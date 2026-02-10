import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export default function RightPanel({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`
        fixed top-0 right-0 z-40 h-screen
        bg-white dark:bg-gray-900 dark:text-white
        border-l border-gray-200 dark:border-gray-700
        transition-all duration-500
        ${collapsed ? "w-16 p-2" : "w-80 p-4"}
        flex flex-col
        shadow-lg
      `}
    >
      {/* Toggle Button */}
      {/* <div className="relative flex justify-end mb-4"> */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute -left-3 top-1/2 -translate-y-1/2
            bg-blue-900 text-white
            p-1.5 rounded-full shadow-lg
            hover:bg-blue-800
          "
        >
          {collapsed ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      {/* </div> */}

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 overflow-auto transition-all duration-500">
        {/* Calendar */}
        <div
          className={`
            ${collapsed ? "flex justify-center items-center p-3" : "p-4"}
            bg-white dark:bg-gray-900 rounded-2xl shadow-md
            hover:shadow-xl transition-shadow duration-300
          `}
        >
          {collapsed ? (
            <CalendarDaysIcon className="w-6 h-6 text-blue-900 dark:text-blue-400" />
          ) : (
            <>
              <h3 className="font-semibold text-sm mb-2">Calendar</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                January 2025
              </div>
              <div className="grid grid-cols-7 gap-2 mt-3 text-xs">
                {[...Array(31)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-8 flex items-center justify-center rounded-lg
                      font-medium
                      ${i === 7
                        ? "bg-blue-900 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div
          className={`
            ${collapsed ? "flex justify-center items-center p-3" : "p-4"}
            bg-white dark:bg-gray-900 rounded-2xl shadow-md
            hover:shadow-xl transition-shadow duration-300
          `}
        >
          {collapsed ? (
            <BellIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          ) : (
            <>
              <h3 className="font-semibold text-sm mb-3">Notifications</h3>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  "Physics master class – 8:30am",
                  "Mathematics master class – 2:30pm",
                  "Chemistry master class – 5:30pm",
                ].map((note, idx) => (
                  <p
                    key={idx}
                    className="
                      bg-gray-100 dark:bg-gray-700
                      p-2 rounded-lg
                      font-medium
                      hover:bg-gray-200 dark:hover:bg-gray-600
                      transition-colors duration-300
                    "
                  >
                    {note}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
