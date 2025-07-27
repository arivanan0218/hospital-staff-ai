import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, InputBase, Paper, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '350px',
  maxHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[10],
  borderRadius: '12px',
  overflow: 'hidden',
  zIndex: 1000,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: '8px',
  },
}));

const MessagesContainer = styled(Box)({
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  backgroundColor: '#f9f9f9',
  '& > *:not(:last-child)': {
    marginBottom: '12px',
  },
});

const MessageBubble = styled(Box)(({ $isUser }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: $isUser ? 'flex-end' : 'flex-start',
  marginBottom: '8px',
  '& > div': {
    maxWidth: '80%',
    padding: '8px 12px',
    borderRadius: '18px',
    backgroundColor: $isUser ? '#1976d2' : '#e0e0e0',
    color: $isUser ? 'white' : 'black',
    wordBreak: 'break-word',
  },
}));

const InputContainer = styled(Box)({
  display: 'flex',
  padding: '8px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: 'white',
});

const StyledInput = styled(InputBase)({
  flex: 1,
  padding: '8px 16px',
  backgroundColor: '#f5f5f5',
  borderRadius: '20px',
  marginRight: '8px',
});

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your hospital staff assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <IconButton 
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'primary.main',
          color: 'white',
          width: '60px',
          height: '60px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        <SmartToyIcon fontSize="large" />
      </IconButton>
    );
  }

  return (
    <ChatContainer elevation={3}>
      <ChatHeader>
        <SmartToyIcon />
        <Typography variant="subtitle1">Hospital Staff Assistant</Typography>
        <IconButton 
          size="small" 
          onClick={() => setIsOpen(false)}
          sx={{ 
            color: 'white',
            marginLeft: 'auto',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          ×
        </IconButton>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble key={index} $isUser={message.role === 'user'}>
            <Box>
              <Box display="flex" alignItems="center" mb={0.5}>
                {message.role === 'user' ? (
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                ) : (
                  <SmartToyIcon fontSize="small" sx={{ mr: 1 }} />
                )}
                <Typography variant="caption" fontWeight="bold">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </Typography>
              </Box>
              <Typography variant="body2" whiteSpace="pre-wrap">
                {message.content}
              </Typography>
            </Box>
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble $isUser={false}>
            <Box>
              <Typography variant="body2" fontStyle="italic">
                Assistant is typing...
              </Typography>
            </Box>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <StyledInput
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          multiline
          maxRows={4}
        />
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbot;
