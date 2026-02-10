import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import logo from "../../assets/images/tutorial_logo.png";

const menuItems = [
  { label: "Dashboard", icon: HomeIcon },
  { label: "Courses", icon: BookOpenIcon },
  { label: "Master Class", icon: AcademicCapIcon },
  { label: "Exam Practice", icon: ClipboardDocumentCheckIcon },
  { label: "Calendar", icon: CalendarDaysIcon },
  { label: "Assessment", icon: ChartBarIcon },
  { label: "Payment", icon: CreditCardIcon },
  { label: "Settings", icon: Cog6ToothIcon },
  { label: "Help", icon: QuestionMarkCircleIcon },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen bg-white border-r
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        flex flex-col
      `}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center gap-3 p-4">
        {!collapsed && (
          <div className="border rounded-lg p-2 flex-1">
            <img src={logo} alt="TC Logo" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-lg
              text-sm font-medium transition
              ${
                label === "Dashboard"
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-4">
        {!collapsed && (
          <div className="flex justify-between bg-gray-100 rounded-full px-4 py-2 text-xs">
            <span>Light</span>
            <span>Dark</span>
          </div>
        )}

        <button className="text-red-500 text-sm font-medium">
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
