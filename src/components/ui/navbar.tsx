'use client';

import { useSession } from '../providers/session-provider';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="fixed w-full top-0 bg-black/50 backdrop-blur-lg border-b border-white/10 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text hover:from-teal-400 hover:to-blue-400"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Home
            </motion.span>
          </Link>
          
          <AnimatePresence mode="wait">
            <div className="flex items-center space-x-4">
              {user ? (
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-gray-300 font-medium hidden sm:inline-block">
                    Welcome, <span className="text-blue-400">{user.fullName}</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
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
                      className="text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 px-4 py-2 rounded-md transition-all duration-200"
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
    </nav>
  );
}