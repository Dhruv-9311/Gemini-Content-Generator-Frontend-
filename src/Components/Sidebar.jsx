import { useContext } from "react"
import { ChatContext } from "../store/ChatContext";
import formatTime from "../util/timeUtil";
import {Link, useNavigate} from "react-router-dom"

const Sidebar = () => {
  const {chats, deleteChat} = useContext(ChatContext);
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/');
  }

  const handleDeleteChat = async (chatId, e) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        const response = await fetch(`https://gemini-content-generator-backend.vercel.app/api/conversation/${chatId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          deleteChat(chatId);
          // Navigate to home if we're currently viewing the deleted chat
          if (window.location.pathname === `/conversation/${chatId}`) {
            navigate('/');
          }
        } else {
          console.error('Failed to delete conversation');
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  }

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Gemini Content Generator
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Chat
          </span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Recent Conversations
        </h2>
        
        {chats.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div 
                key={chat._id}
                className="relative group"
              >
                <Link 
                  to={`/conversation/${chat._id}`} 
                  className="block p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 border border-gray-700 hover:border-gray-600 group"
                >
                  <div className="flex flex-col pr-8">
                    <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-200 truncate">
                      {chat.title || 'Untitled Conversation'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(chat.startTime)}
                    </div>
                  </div>
                </Link>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-600 hover:bg-opacity-20 transition-all duration-200"
                  title="Delete conversation"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          Powered by Gemini AI
        </div>
      </div>
    </div>
  )
}

export default Sidebar;