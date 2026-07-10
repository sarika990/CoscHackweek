import numpy as np
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from typing import List
from config import Config
from utils import get_logger

logger = get_logger("embeddings")

class EmbeddingModel:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingModel, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.use_gemini_fallback = False
            cls._instance.dimension = 384  # Default dimension for all-MiniLM-L6-v2
            
            # Attempt to load local SentenceTransformer
            for model_name in [Config.EMBEDDING_MODEL_NAME, "sentence-transformers/all-MiniLM-L6-v2", "all-MiniLM-L6-v2"]:
                try:
                    logger.info(f"Loading SentenceTransformer model: {model_name}")
                    cls._instance.model = SentenceTransformer(model_name)
                    cls._instance.dimension = cls._instance.model.get_embedding_dimension()
                    logger.info(f"SentenceTransformer model loaded successfully. Dimension: {cls._instance.dimension}")
                    break
                except Exception as e:
                    logger.error(f"Failed to load local model {model_name}: {e}")
            
            if cls._instance.model is None:
                logger.warning("Local SentenceTransformer models could not be loaded. Checking Gemini API embedding fallback...")
                if Config.GEMINI_API_KEY:
                    try:
                        genai.configure(api_key=Config.GEMINI_API_KEY)
                        cls._instance.use_gemini_fallback = True
                        cls._instance.dimension = 768  # text-embedding-004 defaults to 768
                        logger.info("Configured Gemini text-embedding-004 as fallback embedding provider. Dimension: 768")
                    except Exception as e:
                        logger.error(f"Failed to configure Gemini embedding fallback: {e}")
                else:
                    logger.error("No embedding model could be loaded and GEMINI_API_KEY is not set for fallback.")
                    
        return cls._instance

    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Generates vector embeddings for a list of text strings.
        Returns a numpy array of shape (len(texts), embedding_dim).
        """
        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)
            
        if self.model is not None and not self.use_gemini_fallback:
            try:
                embeddings = self.model.encode(texts, show_progress_bar=False)
                return np.array(embeddings, dtype=np.float32)
            except Exception as e:
                logger.error(f"Local embedding generation failed: {e}. Trying Gemini embedding API fallback...")
                if Config.GEMINI_API_KEY:
                    self.use_gemini_fallback = True
                    self.dimension = 768
                else:
                    raise e
                    
        if self.use_gemini_fallback:
            try:
                logger.info(f"Generating {len(texts)} embeddings via Gemini text-embedding-004 API...")
                # Configure if not already done
                if Config.GEMINI_API_KEY:
                    genai.configure(api_key=Config.GEMINI_API_KEY)
                result = genai.embed_content(
                    model="models/text-embedding-004",
                    content=texts,
                    task_type="retrieval_document"
                )
                embeddings = result['embedding']
                return np.array(embeddings, dtype=np.float32)
            except Exception as e:
                logger.error(f"Gemini API embedding generation failed: {e}")
                raise e
                
        raise RuntimeError("No embedding generation method available.")

    def get_embedding(self, text: str) -> np.ndarray:
        """
        Generates a single vector embedding for a text string.
        """
        if self.use_gemini_fallback:
            try:
                if Config.GEMINI_API_KEY:
                    genai.configure(api_key=Config.GEMINI_API_KEY)
                result = genai.embed_content(
                    model="models/text-embedding-004",
                    content=text,
                    task_type="retrieval_query"
                )
                return np.array(result['embedding'], dtype=np.float32)
            except Exception as e:
                logger.error(f"Gemini API single embedding generation failed: {e}")
                raise e
        return self.get_embeddings([text])[0]
