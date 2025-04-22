'use client';

import { useSession } from '../providers/session-provider';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="fixed w-full top-0 bg-black/50 backdrop-blur-lg border-b border-white/10 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center">
            <motion.span 
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text hover:from-teal-400 hover:to-blue-400"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Home
            </motion.span>
          </Link>
          
          <div className="flex items-center">
            {/* Mobile menu button */}
            {user && (
              <button 
                className="sm:hidden mr-2 text-gray-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
                </svg>
              </button>
            )}
            
            <AnimatePresence mode="wait">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {user ? (
                  <motion.div
                    className="flex items-center gap-2 sm:gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-gray-300 text-sm sm:text-base font-medium hidden sm:inline-block">
                      Welcome, <span className="text-blue-400">{user.fullName}</span>
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors duration-200 font-medium"
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/login"
                        className="text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-200"
                      >
                        Login
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="py-3 border-t border-gray-700">
                <p className="text-gray-300 text-sm mb-2">
                  Welcome, <span className="text-blue-400">{user.fullName}</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}