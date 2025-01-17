import React, { useState } from 'react';

interface ChatMessage {
  role: string;
  parts: string[];
}


interface AiChatProps {
  noteId: number;
}

const AiChat: React.FC<AiChatProps> = ({ noteId }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [thinking, setThinking] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user input to the chat history
    const newUserMessage = { role: 'user', parts: [userInput] };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setUserInput('');

    try {
      setThinking(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/note/chat/${noteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_input: userInput,
          history: updatedMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = { role: 'model', parts: [data.ai_response] };

        // Add AI response to the chat history
        setChatMessages((prev) => [...prev, aiResponse]);
      } else {
        alert('Failed to get AI response.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="chat-section flex flex-col h-full z-30 absolute md:static md:p-2 p-4 w-full inset-0 bg-blue-950">
      {/* Chat History */}
      <div className="chat-history overflow-auto flex-grow mt-10 p-3">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`text-sm p-2 rounded-md inline ${msg.role === 'user' ? 'bg-blue-100' : 'text-white'}`}>
              {msg.parts.join('\n')}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="chat-message mb-2 text-left">
            <div className="text-sm p-2 rounded-md">
              <span className="dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input flex items-center justify-around gap-2 mt-auto p-2 bg-white shadow-md rounded-lg">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          className="py-1 border-0 w-full focus:outline-none"
        />
        <button className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={sendMessage}>
          <i className="fas fa-paper-plane text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default AiChat;
