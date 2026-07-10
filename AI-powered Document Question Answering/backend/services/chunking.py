import re
from typing import List, Dict, Any
from utils import get_logger

logger = get_logger("chunking")

def split_into_sentences(text: str) -> List[str]:
    """
    Split text into sentences using regex.
    Avoids splitting on common abbreviations like Dr., Mr., etc.
    """
    sentence_end = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
    sentences = sentence_end.split(text)
    return [s.strip() for s in sentences if s.strip()]

def chunk_text(text: str, filename: str, chunk_size: int = 850, overlap: int = 150) -> List[Dict[str, Any]]:
    """
    Groups sentences into chunks of approximately chunk_size characters with overlap.
    Returns a list of dicts with keys: 'text', 'source', 'chunk_index'.
    """
    sentences = split_into_sentences(text)
    chunks = []
    
    current_chunk = []
    current_length = 0
    chunk_index = 0
    
    for sentence in sentences:
        sentence_len = len(sentence)
        
        if sentence_len > chunk_size:
            if current_chunk:
                chunk_content = " ".join(current_chunk)
                chunks.append({
                    "text": chunk_content,
                    "source": filename,
                    "chunk_index": chunk_index
                })
                chunk_index += 1
                current_chunk = []
                current_length = 0
            
            words = sentence.split(" ")
            sub_chunk = []
            sub_len = 0
            for word in words:
                if sub_len + len(word) + 1 > chunk_size:
                    chunks.append({
                        "text": " ".join(sub_chunk),
                        "source": filename,
                        "chunk_index": chunk_index
                    })
                    chunk_index += 1
                    overlap_words = sub_chunk[-5:] if len(sub_chunk) > 5 else []
                    sub_chunk = overlap_words + [word]
                    sub_len = sum(len(w) for w in sub_chunk) + len(sub_chunk) - 1
                else:
                    sub_chunk.append(word)
                    sub_len += len(word) + 1
            if sub_chunk:
                chunks.append({
                    "text": " ".join(sub_chunk),
                    "source": filename,
                    "chunk_index": chunk_index
                })
                chunk_index += 1
            continue
        
        if current_length + sentence_len + 1 > chunk_size:
            chunk_content = " ".join(current_chunk)
            chunks.append({
                "text": chunk_content,
                "source": filename,
                "chunk_index": chunk_index
            })
            chunk_index += 1
            
            overlap_chunk = []
            overlap_len = 0
            for s in reversed(current_chunk):
                if overlap_len + len(s) + 1 <= overlap:
                    overlap_chunk.insert(0, s)
                    overlap_len += len(s) + 1
                else:
                    break
            
            current_chunk = overlap_chunk + [sentence]
            current_length = sum(len(s) for s in current_chunk) + len(current_chunk) - 1
        else:
            current_chunk.append(sentence)
            current_length += sentence_len + 1
            
    if current_chunk:
        chunk_content = " ".join(current_chunk)
        chunks.append({
            "text": chunk_content,
            "source": filename,
            "chunk_index": chunk_index
        })
        
    logger.info(f"Chunked document {filename} into {len(chunks)} semantic chunks.")
    return chunks
