import ChatInput from './components/ChatInput';
import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.current = io('https://3.39.69.254/socket/chat/');

    socket.current.on('message', (message: string) => {
      const newMessage: Message = { text: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket.current && input) {
      socket.current.emit('message', input);
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
