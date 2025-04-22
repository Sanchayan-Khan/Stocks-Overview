'use client'
import Link from 'next/link'
import { useSession } from '@/components/providers/session-provider'
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gray-800/50 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-700/50"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-700/50 animate-pulse" />
      <div className="flex-1">
        <div className="h-5 w-24 bg-gray-700/50 rounded animate-pulse mb-2" />
        <div className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
      </div>
      <div className="h-6 w-16 bg-gray-700/50 rounded animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-6 w-20 bg-gray-700/50 rounded animate-pulse" />
      <div className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
    </div>
    <div className="mt-4 h-32 bg-gray-700/50 rounded animate-pulse" />
  </motion.div>
)

type Stock = {
  symbol: string
  name: string
  logo: string
  price: number
  change: number
  percentChange: number
  chartData: { time: string; price: number }[]
}

export default function Home() {
  const { user } = useSession()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user) {
      const fetchStocks = async () => {
        try {
          const res = await axios.get('/api/stocks')
          setStocks(res.data)
        } catch (err) {
          console.error('Fetch error:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchStocks()
      const interval = setInterval(fetchStocks, 60000) // Refresh every minute
      return () => clearInterval(interval)
    }
  }, [user])

  const filtered = stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Landing page animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: '20%',
              left: '60%',
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: '40%',
              left: '20%',
            }}
          />
        </div>

        {/* Landing page content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-16">
          <div className="w-full max-w-4xl mx-auto text-center space-y-12">
            <div className="h-48 relative mb-8"> {/* Increased height and margin */}
              <TextHoverEffect text="STOCKS OVERVIEW" />
            </div>

            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Unlock the power of real-time stock tracking and analysis. Join us to access comprehensive market insights and make informed investment decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link 
                href="/login" 
                className="inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-500 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Real-Time Data</h3>
                <p className="text-gray-400">Track stock prices and market movements as they happen</p>
              </div>
              <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2 text-teal-400">Interactive Charts</h3>
                <p className="text-gray-400">Visualize market trends with dynamic, interactive charts</p>
              </div>
              <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2 text-purple-400">Market Insights</h3>
                <p className="text-gray-400">Access detailed analytics and market performance metrics</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-400 z-10 bg-black bg-opacity-60 backdrop-blur-sm">
          <p>
            Created by{' '}
            <a 
              href="https://github.com/Sanchayan-Khan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sanchayan Khan
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Stock listing page for authenticated users
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Stock Market Dashboard
          </h1>
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 p-2 sm:p-3 rounded-lg border border-gray-600 bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No stocks found matching "{search}"</p>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((stock) => (
              <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 backdrop-blur rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    {stock.logo && (
                      <img src={stock.logo} alt={`${stock.name} logo`} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white truncate">{stock.name}</h2>
                      <p className="text-xs sm:text-sm text-gray-400">{stock.symbol}</p>
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                        stock.change >= 0
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-red-900/50 text-red-300'
                      }`}
                    >
                      {stock.percentChange.toFixed(2)}%
                    </span>
                  </div>
              
                  <p className="text-base sm:text-lg text-gray-300 mb-1">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs sm:text-sm ${
                      stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                    } mb-3 sm:mb-4`}
                  >
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </p>
              
                  <div className="w-full h-24 sm:h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stock.chartData}>
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={stock.change >= 0 ? '#10B981' : '#EF4444'}
                          strokeWidth={2}
                          dot={false}
                        />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={['auto', 'auto']} hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.8rem',
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
