import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, Settings, Bell, Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Team", path: "/team", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1C1E]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E1E3E5] bg-white flex flex-col">
        <div className="p-6 border-bottom border-[#E1E3E5]">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <CheckSquare size={20} />
            </div>
            <span>TeamSync</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-[#44474E] hover:bg-[#F1F3F5]"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E1E3E5]">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-[#44474E] hover:bg-[#F1F3F5] transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#E1E3E5] bg-white flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" size={16} />
            <input
              type="text"
              placeholder="Search tasks, team members..."
              className="w-full pl-10 pr-4 py-2 bg-[#F1F3F5] border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-[#44474E] hover:bg-[#F1F3F5] rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
              JD
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
