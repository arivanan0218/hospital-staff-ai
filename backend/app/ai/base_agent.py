from abc import ABC, abstractmethod
from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain.chat_models import ChatOpenAI
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

class BaseAgent(ABC):
    def __init__(self, model_name: str = "llama3-8b-8192"):
        self.llm = ChatGroq(
            temperature=0.1,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name=model_name
        )
    
    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input data and return results"""
        pass
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Return the system prompt for this agent"""
        pass
    
    async def call_llm(self, messages: List[BaseMessage]) -> str:
        """Call the LLM with messages"""
        response = await self.llm.agenerate([messages])
        return response.generations[0][0].text