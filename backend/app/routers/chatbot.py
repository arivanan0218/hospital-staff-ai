from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.chatbot_service import chatbot_service

router = APIRouter(
    prefix="/api/chatbot",
    tags=["chatbot"],
    responses={404: {"description": "Not found"}},
)

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    
class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, db: Session = Depends(get_db)):
    """
    Handle chat messages and return AI responses with database context
    """
    try:
        # Convert Pydantic model to list of dicts for the service
        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in chat_request.messages
        ]
        
        # Get response from GROQ with database context
        response = await chatbot_service.get_chat_response(messages, db=db)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
