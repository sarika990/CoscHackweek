from typing import Dict, Any, List
from services.vector_store import vector_store_manager
from services.llm import llm_service
from utils import get_logger, Timer

logger = get_logger("rag_pipeline")

SYSTEM_PROMPT = """
You are a precise document question answering assistant. Your primary task is to answer user questions using only the provided reference context.

Rules:
1. Base your answer ONLY and ENTIRELY on the provided reference context chunks below.
2. If the context does not contain the answer, or if there is no context provided, you MUST reply exactly:
"I couldn't find relevant information in the uploaded documents."
3. Do not invent, assume, extrapolate, or hallucinate any facts.
4. Keep the output clean, objective, and well-structured (e.g. use markdown tables, lists, code blocks, or bold text where appropriate).

Context Chunks:
{context}

Question:
{question}

Answer:
"""

def generate_summary_prompt(context: str) -> str:
    return f"""
Provide a concise, professional, and well-structured summary of the following document contents.
Use bullet points, clear headings, and highlight the key topics covered.
If there is no text, say "No content available to summarize."

Document Content:
{context}

Summary:
"""

class RAGPipeline:
    def __init__(self):
        self.vector_store = vector_store_manager
        self.llm = llm_service

    def answer_question(self, question: str) -> Dict[str, Any]:
        """
        Runs similarity search, builds context-based prompt, and generates Gemini response.
        """
        logger.info(f"RAG Pipeline: Processing question: '{question}'")
        
        with Timer("Similarity search"):
            search_results = self.vector_store.similarity_search(question, top_k=5)
            
        if not search_results:
            logger.warning("No search results found, returning default fallback answer.")
            return {
                "answer": "I couldn't find relevant information in the uploaded documents.",
                "sources": []
            }
            
        # Build Context
        context_parts = []
        sources = []
        for i, (chunk, score) in enumerate(search_results):
            context_parts.append(f"--- Chunk {i+1} (Source: {chunk['source']}, Index: {chunk['chunk_index']}) ---\n{chunk['text']}")
            sources.append({
                "source": chunk["source"],
                "chunk_index": chunk["chunk_index"],
                "score": score
            })
            
        context_str = "\n\n".join(context_parts)
        prompt = SYSTEM_PROMPT.format(context=context_str, question=question)
        
        try:
            with Timer("LLM response generation"):
                answer = self.llm.generate_response(prompt)
            return {
                "answer": answer.strip(),
                "sources": sources
            }
        except Exception as e:
            logger.error(f"RAG Pipeline: LLM invocation failed: {e}")
            return {
                "answer": f"Error communicating with AI service: {str(e)}",
                "sources": []
            }

    def generate_document_summary(self) -> Dict[str, Any]:
        """
        Generates a concise summary based on all loaded chunks.
        """
        metadata = self.vector_store.metadata
        if not metadata:
            return {
                "summary": "No documents uploaded. Please upload a document first.",
                "success": False
            }
            
        summary_chunks = metadata[:15]
        context_str = "\n\n".join([f"Source: {c['source']}\n{c['text']}" for c in summary_chunks])
        
        prompt = generate_summary_prompt(context_str)
        try:
            summary = self.llm.generate_response(prompt)
            return {
                "summary": summary.strip(),
                "success": True
            }
        except Exception as e:
            logger.error(f"Summary generation failed: {e}")
            return {
                "summary": f"Failed to generate summary: {str(e)}",
                "success": False
            }

rag_pipeline = RAGPipeline()
