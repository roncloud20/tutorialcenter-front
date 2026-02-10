import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function RightPanel({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`
        fixed top-0 right-0 z-40 h-screen bg-gray-100 border-l
        transition-all duration-300
        ${collapsed ? "w-16" : "w-80"}
        p-3
      `}
    >
      {/* Toggle Button */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-200"
        >
          {collapsed ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold text-sm mb-2">Calendar</h3>
            <div className="text-xs text-gray-500">January 2025</div>

            <div className="grid grid-cols-7 gap-2 mt-3 text-xs">
              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  className={`h-8 flex items-center justify-center rounded ${
                    i === 7
                      ? "bg-blue-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold text-sm mb-3">Notifications</h3>
            <div className="space-y-2 text-xs">
              <p className="bg-gray-100 p-2 rounded">
                Physics master class – 8:30am
              </p>
              <p className="bg-gray-100 p-2 rounded">
                Mathematics master class – 2:30pm
              </p>
              <p className="bg-gray-100 p-2 rounded">
                Chemistry master class – 5:30pm
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
