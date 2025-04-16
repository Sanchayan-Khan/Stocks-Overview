'use client';

import { useSession } from '../providers/session-provider';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useSession();

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 z-[1000] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text hover:from-teal-400 hover:to-blue-400 transition-all duration-300">
              Stock Dashboard
            </span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">
                Welcome, <span className="text-blue-400">{user.fullName}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}