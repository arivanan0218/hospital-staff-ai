// import React, { useState, useRef, useEffect } from 'react';
// import { Box, IconButton, InputBase, Paper, Typography, Avatar } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
// import PersonIcon from '@mui/icons-material/Person';
// import { styled } from '@mui/material/styles';

// const ChatContainer = styled(Paper)(({ theme }) => ({
//   position: 'fixed',
//   bottom: '20px',
//   right: '20px',
//   width: '350px',
//   maxHeight: '500px',
//   display: 'flex',
//   flexDirection: 'column',
//   boxShadow: theme.shadows[10],
//   borderRadius: '12px',
//   overflow: 'hidden',
//   zIndex: 1000,
// }));

// const ChatHeader = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: 'white',
//   padding: '12px 16px',
//   display: 'flex',
//   alignItems: 'center',
//   '& svg': {
//     marginRight: '8px',
//   },
// }));

// const MessagesContainer = styled(Box)({
//   flex: 1,
//   padding: '16px',
//   overflowY: 'auto',
//   backgroundColor: '#f9f9f9',
//   '& > *:not(:last-child)': {
//     marginBottom: '12px',
//   },
// });

// const MessageBubble = styled(Box)(({ $isUser }) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'flex-start',
//   justifyContent: $isUser ? 'flex-end' : 'flex-start',
//   marginBottom: '8px',
//   '& > div': {
//     maxWidth: '80%',
//     padding: '8px 12px',
//     borderRadius: '18px',
//     backgroundColor: $isUser ? '#1976d2' : '#e0e0e0',
//     color: $isUser ? 'white' : 'black',
//     wordBreak: 'break-word',
//   },
// }));

// const InputContainer = styled(Box)({
//   display: 'flex',
//   padding: '8px',
//   borderTop: '1px solid #e0e0e0',
//   backgroundColor: 'white',
// });

// const StyledInput = styled(InputBase)({
//   flex: 1,
//   padding: '8px 16px',
//   backgroundColor: '#f5f5f5',
//   borderRadius: '20px',
//   marginRight: '8px',
// });

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: 'Hello! I\'m your hospital staff assistant. How can I help you today?' }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage = { role: 'user', content: inputValue };
//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/api/chatbot/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMessage].map(msg => ({
//             role: msg.role,
//             content: msg.content
//           }))
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to get response from chatbot');
//       }

//       const data = await response.json();
//       setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [
//         ...prev, 
//         { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (!isOpen) {
//     return (
//       <IconButton 
//         onClick={() => setIsOpen(true)}
//         sx={{
//           position: 'fixed',
//           bottom: '24px',
//           right: '24px',
//           backgroundColor: 'primary.main',
//           color: 'white',
//           width: '60px',
//           height: '60px',
//           '&:hover': {
//             backgroundColor: 'primary.dark',
//           },
//         }}
//       >
//         <SmartToyIcon fontSize="large" />
//       </IconButton>
//     );
//   }

//   return (
//     <ChatContainer elevation={3}>
//       <ChatHeader>
//         <SmartToyIcon />
//         <Typography variant="subtitle1">Hospital Staff Assistant</Typography>
//         <IconButton 
//           size="small" 
//           onClick={() => setIsOpen(false)}
//           sx={{ 
//             color: 'white',
//             marginLeft: 'auto',
//             '&:hover': {
//               backgroundColor: 'rgba(255, 255, 255, 0.1)',
//             },
//           }}
//         >
//           ×
//         </IconButton>
//       </ChatHeader>
      
//       <MessagesContainer>
//         {messages.map((message, index) => (
//           <MessageBubble key={index} $isUser={message.role === 'user'}>
//             <Box>
//               <Box display="flex" alignItems="center" mb={0.5}>
//                 {message.role === 'user' ? (
//                   <PersonIcon fontSize="small" sx={{ mr: 1 }} />
//                 ) : (
//                   <SmartToyIcon fontSize="small" sx={{ mr: 1 }} />
//                 )}
//                 <Typography variant="caption" fontWeight="bold">
//                   {message.role === 'user' ? 'You' : 'Assistant'}
//                 </Typography>
//               </Box>
//               <Typography variant="body2" whiteSpace="pre-wrap">
//                 {message.content}
//               </Typography>
//             </Box>
//           </MessageBubble>
//         ))}
//         {isLoading && (
//           <MessageBubble $isUser={false}>
//             <Box>
//               <Typography variant="body2" fontStyle="italic">
//                 Assistant is typing...
//               </Typography>
//             </Box>
//           </MessageBubble>
//         )}
//         <div ref={messagesEndRef} />
//       </MessagesContainer>
      
//       <InputContainer>
//         <StyledInput
//           placeholder="Type your message..."
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           disabled={isLoading}
//           multiline
//           maxRows={4}
//         />
//         <IconButton 
//           color="primary" 
//           onClick={handleSendMessage}
//           disabled={!inputValue.trim() || isLoading}
//         >
//           <SendIcon />
//         </IconButton>
//       </InputContainer>
//     </ChatContainer>
//   );
// };

// export default Chatbot;


import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, InputBase, Paper, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '360px',
  height: '520px', // Fixed height
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  borderRadius: '20px',
  overflow: 'hidden',
  zIndex: 1000,
  border: '1px solid #e5e5e5',
  backgroundColor: '#ffffff',
}));

const ChatHeader = styled(Box)({
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid #e5e5e5',
  flexShrink: 0, // Prevent header from shrinking
});

const MessagesContainer = styled(Box)({
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  backgroundColor: '#fafafa',
  // Improved scrollbar styling
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#cccccc',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: '#999999',
    },
  },
  // Firefox scrollbar
  scrollbarWidth: 'thin',
  scrollbarColor: '#cccccc #f0f0f0',
});

const MessagesWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const MessageBubble = styled(Box)(({ $isUser }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: $isUser ? 'flex-end' : 'flex-start',
  marginBottom: '16px',
  width: '100%',
  '&:last-child': {
    marginBottom: '8px',
  },
}));

const MessageContent = styled(Box)(({ $isUser }) => ({
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: $isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: $isUser ? '#000000' : '#ffffff',
  color: $isUser ? '#ffffff' : '#000000',
  border: $isUser ? 'none' : '1px solid #e5e5e5',
  wordBreak: 'break-word',
  lineHeight: 1.4,
  boxShadow: $isUser ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
  textAlign: 'left',
}));

const MessageHeader = styled(Box)(({ $isUser }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  gap: '6px',
  justifyContent: $isUser ? 'flex-end' : 'flex-start',
  paddingRight: $isUser ? '4px' : '0',
  paddingLeft: $isUser ? '0' : '4px',
}));

const InputContainer = styled(Box)({
  display: 'flex',
  padding: '16px 16px 20px 16px',
  borderTop: '1px solid #f0f0f0',
  backgroundColor: '#ffffff',
  gap: '12px',
  alignItems: 'flex-end',
  flexShrink: 0, // Prevent input area from shrinking
});

const StyledInput = styled(InputBase)({
  flex: 1,
  padding: '12px 16px',
  backgroundColor: '#f8f8f8',
  borderRadius: '16px',
  border: '1px solid #e5e5e5',
  fontSize: '14px',
  lineHeight: 1.4,
  maxHeight: '120px', // Limit input height
  '&.Mui-focused': {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    borderColor: '#cccccc',
  },
  '& .MuiInputBase-input': {
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
});

const SendButton = styled(IconButton)(({ disabled }) => ({
  width: '44px',
  height: '44px',
  backgroundColor: disabled ? '#f0f0f0' : '#000000',
  color: disabled ? '#cccccc' : '#ffffff',
  borderRadius: '12px',
  transition: 'all 0.3s ease-in-out',
  flexShrink: 0, // Prevent button from shrinking
  '&:hover': {
    backgroundColor: disabled ? '#f0f0f0' : '#333333',
    transform: disabled ? 'none' : 'translateY(-1px)',
    boxShadow: disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    transform: disabled ? 'none' : 'translateY(0)',
  },
}));

const FloatingButton = styled(IconButton)({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  backgroundColor: '#000000',
  color: '#ffffff',
  width: '64px',
  height: '64px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#333333',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const TypingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '18px 18px 18px 4px',
  maxWidth: '80%',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
});

const TypingDots = styled(Box)({
  display: 'flex',
  gap: '4px',
  '& span': {
    width: '6px',
    height: '6px',
    backgroundColor: '#666666',
    borderRadius: '50%',
    animation: 'typing 1.4s infinite ease-in-out',
    '&:nth-child(1)': { animationDelay: '0s' },
    '&:nth-child(2)': { animationDelay: '0.2s' },
    '&:nth-child(3)': { animationDelay: '0.4s' },
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'translateY(0)',
      opacity: 0.4,
    },
    '30%': {
      transform: 'translateY(-8px)',
      opacity: 1,
    },
  },
});

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your hospital staff assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Enhanced scroll effect
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Auto-scroll when chatbot opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      <FloatingButton onClick={() => setIsOpen(true)}>
        <SmartToyIcon sx={{ fontSize: 28 }} />
      </FloatingButton>
    );
  }

  return (
    <ChatContainer elevation={0}>
      <ChatHeader>
        <Box sx={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          mr: 2,
        }}>
          <SmartToyIcon sx={{ fontSize: 20, color: '#ffffff' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.2,
          }}>
            Hospital Staff Assistant
          </Typography>
          <Typography sx={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 0.5,
          }}>
            AI-powered help
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={() => setIsOpen(false)}
          sx={{ 
            color: '#ffffff',
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </ChatHeader>
      
      <MessagesContainer ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <MessageBubble key={index} $isUser={message.role === 'user'}>
            <MessageHeader $isUser={message.role === 'user'}>
              {message.role === 'user' ? (
                <PersonIcon sx={{ fontSize: 14, color: '#666666' }} />
              ) : (
                <SmartToyIcon sx={{ fontSize: 14, color: '#666666' }} />
              )}
              <Typography sx={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </Typography>
            </MessageHeader>
            <MessageContent $isUser={message.role === 'user'}>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap',
              }}>
                {message.content}
              </Typography>
            </MessageContent>
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble $isUser={false}>
            <MessageHeader $isUser={false}>
              <SmartToyIcon sx={{ fontSize: 14, color: '#666666' }} />
              <Typography sx={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Assistant
              </Typography>
            </MessageHeader>
            <TypingIndicator>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#666666',
                mr: 1,
              }}>
                Typing
              </Typography>
              <TypingDots>
                <span />
                <span />
                <span />
              </TypingDots>
            </TypingIndicator>
          </MessageBubble>
        )}
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
        <SendButton 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          <SendIcon sx={{ fontSize: 20 }} />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbot;