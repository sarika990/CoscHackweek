import google.generativeai as genai
from config import Config
from utils import get_logger

logger = get_logger("llm")

class LLMService:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        self.model_name = "gemini-1.5-flash"
        self._configured = False
        self._model_verified = False
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self._configured = True
                logger.info("Google Gemini SDK configured successfully.")
                self._verify_and_select_model()
            except Exception as e:
                logger.error(f"Failed to configure Gemini SDK: {e}")

    def _verify_and_select_model(self):
        """
        Queries available models and switches to a supported model if gemini-1.5-flash is not available.
        """
        try:
            logger.info("Verifying supported Gemini models...")
            models = list(genai.list_models())
            supported_names = [m.name for m in models]
            logger.info(f"Available API models: {supported_names}")
            
            # Target names with and without 'models/' prefix
            targets = ["models/gemini-1.5-flash", "gemini-1.5-flash"]
            if any(t in supported_names for t in targets):
                self.model_name = "gemini-1.5-flash"
                self._model_verified = True
                logger.info("Using default model: gemini-1.5-flash")
                return
                
            # Fallback selection: find compatible Flash models
            compat_models = []
            for m in models:
                if "generateContent" in m.supported_generation_methods:
                    name_lower = m.name.lower()
                    if "flash" in name_lower:
                        compat_models.append(m.name)
            
            if compat_models:
                # Prioritize newer and latest Flash models
                priority = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"]
                selected = None
                for p in priority:
                    for c in compat_models:
                        if p in c:
                            selected = c
                            break
                    if selected:
                        break
                
                if not selected:
                    selected = compat_models[0]
                
                self.model_name = selected
                self._model_verified = True
                logger.info(f"Automatically selected compatible model: {self.model_name}")
            else:
                # Fallback to any generateContent-capable model
                gen_models = [m.name for m in models if "generateContent" in m.supported_generation_methods]
                if gen_models:
                    self.model_name = gen_models[0]
                    self._model_verified = True
                    logger.info(f"No Flash model found. Defaulting to: {self.model_name}")
                else:
                    logger.warning("No models supporting generateContent found.")
        except Exception as e:
            logger.error(f"Error listing/verifying Gemini models: {e}. Defaulting to gemini-1.5-flash")
            self.model_name = "gemini-1.5-flash"

    def generate_response(self, prompt: str) -> str:
        """
        Generates text using Google Gemini with the configured API key.
        """
        if not self._configured:
            # Recheck Config (in case api_key was added later dynamically)
            self.api_key = Config.GEMINI_API_KEY
            if self.api_key:
                try:
                    genai.configure(api_key=self.api_key)
                    self._configured = True
                    logger.info("Google Gemini SDK re-configured successfully.")
                except Exception as e:
                    logger.error(f"Failed to configure Gemini SDK on retry: {e}")
            
            if not self._configured:
                logger.warning("Gemini API key is not configured. Returning graceful fallback notification.")
                return "⚠️ Gemini API Key is missing. Please configure GEMINI_API_KEY in your backend/.env environment variables file to enable AI answers."

        if self._configured and not self._model_verified:
            self._verify_and_select_model()

        try:
            logger.info(f"Generating content with model {self.model_name}")
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API generation error on {self.model_name}: {e}")
            # If a 404 occurs on generation, try model re-verification once
            if "404" in str(e) or "not found" in str(e).lower():
                logger.info("Retrying with model list re-verification...")
                self._verify_and_select_model()
                try:
                    logger.info(f"Retrying content generation with model {self.model_name}")
                    model = genai.GenerativeModel(self.model_name)
                    response = model.generate_content(prompt)
                    return response.text
                except Exception as retry_err:
                    logger.error(f"Retry generation failed: {retry_err}")
                    raise retry_err
            raise e

llm_service = LLMService()
