import { useState } from "react";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

export default function DashboardLayout({ children }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar */}
      <Sidebar
        collapsed={leftCollapsed}
        setCollapsed={setLeftCollapsed}
      />

      {/* Right Panel */}
      <RightPanel
        collapsed={rightCollapsed}
        setCollapsed={setRightCollapsed}
      />

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 p-6
          ${leftCollapsed ? "ml-20" : "ml-64"}
          ${rightCollapsed ? "mr-16" : "mr-80"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
