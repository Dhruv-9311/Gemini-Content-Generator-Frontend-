import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ChatContext } from "../store/ChatContext";
import formatTime from "../util/timeUtil";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const {id} = useParams();
  const {chats, addChat, updateChat} = useContext(ChatContext);
  const [chat, setChat] = useState(null);
  const messageRef = useRef(null);
  const modelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const Navigate = useNavigate();

  useEffect(() => {
    if(id) {
      const foundChat = chats.find((chat) => chat._id === id);
      setChat(foundChat);
    } else {
      setChat(null);
    }
  }, [id, chats]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessages = async (e) => {
    e.preventDefault();
    
    if (!messageRef.current.value.trim()) return;
    
    setLoading(true);
    setError(null);
    
    const url = id ? `https://gemini-content-generator-backend.vercel.app/api/conversation/${id}` : "https://gemini-content-generator-backend.vercel.app/api/conversation";
    const method = id ? "PUT" : "POST";
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: messageRef.current.value,
          model: modelRef.current?.value || 'gemini-1.5-flash-8b',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const responseData = await response.json();
      
      // Handle different response structures from backend
      const updatedChat = id ? responseData : responseData.conversation;
      
      if (id) {
        updateChat(updatedChat);
        setChat(updatedChat);
      } else {
        addChat(updatedChat);
        setChat(updatedChat);
        // Navigate to the new conversation
        Navigate(`/conversation/${updatedChat._id}`);
      }
      
      messageRef.current.value = '';
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {chat ? chat.title || 'Untitled Conversation' : 'New Conversation'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {chat ? `${chat.messages?.length || 0} messages` : 'Start a conversation with Gemini AI'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {modelRef.current?.value || 'gemini-1.5-flash-8b'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat && chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((message) => {
            const isUser = message.role === 'user';
            const isAssistant = message.role === 'assistant';
            
            return (
              <div key={message._id} className="space-y-4">
                {/* Message Display */}
                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-start gap-3 max-w-4xl">
                    {/* Avatar - Left for assistant, Right for user */}
                    {isAssistant && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div className="flex-1">
                      <div className={`rounded-lg px-4 py-3 shadow-sm ${
                        isUser 
                          ? 'bg-blue-50 border border-blue-200 text-gray-800' 
                          : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-gray-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              isUser ? 'text-blue-700' : 'text-purple-700'
                            }`}>
                              {isUser ? 'You' : 'Gemini AI'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                              isUser 
                                ? 'text-blue-600 bg-blue-100' 
                                : 'text-purple-600 bg-purple-100'
                            }`}>
                              {message.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(message.createdAt || new Date())}
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    
                    {/* Avatar - Right for user */}
                    {isUser && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-md">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500">
                Send a message below to begin chatting with Gemini AI. Ask questions, get help with coding, or have a creative conversation!
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error: {error}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessages} className="space-y-3">
          {/* Model Selection */}
          {!chat && (
          <div className="flex items-center gap-2">
            <label htmlFor="model" className="text-sm font-medium text-gray-700">Model:</label>
            <select 
              name="model" 
              id="model" 
              ref={modelRef}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="gemini-1.5-flash-8b"
            >
              <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash 8B</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>)}
          
          {/* Message Input */}
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                ref={messageRef}
                name="prompt"
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessages(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;