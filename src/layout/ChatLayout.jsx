import { Outlet } from "react-router-dom"
import Sidebar from "../Components/Sidebar"

const ChatLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Sidebar/>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <Outlet/>
      </main>
    </div>
  )
}

export default ChatLayout;