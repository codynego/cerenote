import React, { useState } from 'react';

interface ChatMessage {
  user: string;
  ai: string;
}

const AiChat: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);  // Store chat messages
  const [userInput, setUserInput] = useState<string>('');  // User input for the chat

  // Handle sending the chat message
  const sendMessage = async () => {
    if (userInput.trim()) {
      const newChatMessages = [...chatMessages, { user: userInput, ai: '...thinking' }];
      setChatMessages(newChatMessages);
      setUserInput('');  // Reset user input field

      // Simulate an AI response (You can replace this with an actual API call)
      setTimeout(() => {
        const aiResponse = `AI Response to: ${userInput}`;
        const updatedChatMessages = newChatMessages.map((message, index) =>
          index === newChatMessages.length - 1 ? { ...message, ai: aiResponse } : message
        );
        setChatMessages(updatedChatMessages);
      }, 1000); // Simulate a delay
    }
  };

  return (
    <div className="chat-section flex flex-col h-full z-30 absolute md:static md:p-2 p-5 w-full inset-0 bg-blue-950">
      {/* Chat History */}
      <div className="chat-history overflow-auto flex-grow mt-10">
        {chatMessages.map((msg, index) => (
          <div key={index} className="chat-message mb-2">
            <div className="user-message text-sm bg-blue-100 p-2 rounded-md text-right">
              {msg.user}
            </div>
            <div className="ai-message text-sm bg-green-100 p-2 rounded-md mt-1">
              {msg.ai}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="chat-input flex items-center justify-around gap-2 mt-auto p-2 bg-white shadow-md rounded-lg">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          className="  py-1 border-0 w-full focus:outline-none"
        />
        <button 
          className=" p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={sendMessage}
        >
          {/* FontAwesome send icon */}
          <i className="fas fa-paper-plane text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default AiChat;
