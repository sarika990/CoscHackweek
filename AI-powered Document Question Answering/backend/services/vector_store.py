import faiss
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple
from config import Config
from services.embeddings import EmbeddingModel
from utils import get_logger

logger = get_logger("vector_store")

class VectorStoreManager:
    def __init__(self):
        self.vector_dir = Config.VECTOR_DIR
        self.index_path = self.vector_dir / "index.faiss"
        self.metadata_path = self.vector_dir / "metadata.json"
        
        self.embedding_model = EmbeddingModel()
        self.dimension = self.embedding_model.dimension
        
        self.index = None
        self.metadata: List[Dict[str, Any]] = []
        
        self.load_index()

    def load_index(self):
        """Loads index and metadata if they exist, otherwise creates a new index."""
        if self.index_path.exists() and self.metadata_path.exists():
            try:
                logger.info("Loading existing FAISS index and metadata...")
                self.index = faiss.read_index(str(self.index_path))
                # Check dimension mismatch
                if self.index.d != self.dimension:
                    logger.warning(f"Dimension mismatch: Index has {self.index.d}, but current embedding model has {self.dimension}. Reinitializing database.")
                    self._init_new_index()
                else:
                    with open(self.metadata_path, "r", encoding="utf-8") as f:
                        self.metadata = json.load(f)
                    logger.info(f"Loaded {len(self.metadata)} chunks from FAISS index.")
            except Exception as e:
                logger.error(f"Failed to load FAISS index: {e}. Reinitializing database.")
                self._init_new_index()
        else:
            logger.info("No index found. Initializing new FAISS index.")
            self._init_new_index()

    def _init_new_index(self):
        self.dimension = self.embedding_model.dimension
        self.index = faiss.IndexFlatIP(self.dimension)
        self.metadata = []
        self.save_index()

    def save_index(self):
        """Saves current index and metadata to disk."""
        try:
            self.vector_dir.mkdir(parents=True, exist_ok=True)
            faiss.write_index(self.index, str(self.index_path))
            with open(self.metadata_path, "w", encoding="utf-8") as f:
                json.dump(self.metadata, f, ensure_ascii=False, indent=2)
            logger.info("Saved FAISS index and metadata successfully.")
        except Exception as e:
            logger.error(f"Error saving FAISS index: {e}")

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        """Generates embeddings for chunks and adds them to the FAISS index."""
        if not chunks:
            return
            
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.embedding_model.get_embeddings(texts)
        
        # Verify embedding dimension matches index dimension
        emb_dim = embeddings.shape[1] if len(embeddings.shape) > 1 else self.dimension
        if self.index.d != emb_dim:
            logger.warning(f"Index dimension ({self.index.d}) doesn't match embedding dimension ({emb_dim}). Reinitializing index.")
            self.dimension = emb_dim
            self.index = faiss.IndexFlatIP(self.dimension)
            
        faiss.normalize_L2(embeddings)
        
        self.index.add(embeddings)
        self.metadata.extend(chunks)
        self.save_index()
        logger.info(f"Successfully added {len(chunks)} chunks to vector store.")

    def rebuild_from_all_files(self, all_chunks: List[Dict[str, Any]]):
        """Rebuilds the index scratch from a list of all current chunks."""
        logger.info("Rebuilding index from scratch...")
        self._init_new_index()
        if all_chunks:
            self.add_chunks(all_chunks)

    def similarity_search(self, query: str, top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        """
        Searches the index for top_k most similar chunks.
        Returns a list of tuples containing (chunk_metadata, similarity_score).
        """
        if not self.metadata or self.index.ntotal == 0:
            logger.warning("Search query received but vector database is empty.")
            return []
            
        query_vector = self.embedding_model.get_embedding(query)
        query_vector = query_vector.reshape(1, -1)
        faiss.normalize_L2(query_vector)
        
        scores, indices = self.index.search(query_vector, top_k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append((self.metadata[idx], float(score)))
                
        return results

    def clear(self):
        """Deletes vector index files and resets current state."""
        self._init_new_index()
        if self.index_path.exists():
            self.index_path.unlink()
        if self.metadata_path.exists():
            self.metadata_path.unlink()
        logger.info("Cleared Vector Database.")
        
vector_store_manager = VectorStoreManager()
