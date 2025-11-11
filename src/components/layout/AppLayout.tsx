import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">FM Squad Planner</h1>
        </div>

        {/* Main panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}

