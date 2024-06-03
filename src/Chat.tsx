import ChatInput from './components/ChatInput';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const socket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      socket.current = new WebSocket('wss://3.39.69.254:443/socket/chat');

      socket.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.current.onmessage = (event) => {
        const newMessage: Message = { text: event.data };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }

    return () => {
      socket.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket.current && input) {
      socket.current.send(input);
      setInput('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '400px',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            paddingBottom: '60px',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                padding: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '60%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#FFF',
                  border: '1px solid #CCC',
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            width: '400px',
            backgroundColor: '#FFF',
            borderTop: '1px solid #CCC',
            padding: '10px',
          }}
        >
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
