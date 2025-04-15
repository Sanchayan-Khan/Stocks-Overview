'use client'
import Link from 'next/link'
import 'animate.css';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
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
    const interval = setInterval(fetchStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  const filtered = stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      {/* Metallic gradient overlay to give depth to black background */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-70 z-[-10]"></div>
      
      {/* Background Text Effect */}
      <div className="fixed inset-0 flex items-center justify-center z-0">
        <div className="w-full h-full transform scale-[1] opacity-70">
          <TextHoverEffect text="STOCKS" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-600 text-center mb-8 animate__animated animate__fadeIn animate__delay-1s hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-400 hover:via-red-500 hover:to-orange-600">
        Stock Market Dashboard
      </h1>

          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search by symbol or name (e.g. AAPL, Apple)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-2/3 p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading stock data...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400">No stocks found matching "{search}"</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((stock) => (
                <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}>
                  <div className="bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      {stock.logo && (
                        <img src={stock.logo} alt={`${stock.name} logo`} className="w-8 h-8 rounded-full" />
                      )}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-white">{stock.name}</h2>
                        <p className="text-sm text-gray-400">{stock.symbol}</p>
                      </div>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          stock.change >= 0
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {stock.percentChange.toFixed(2)}%
                      </span>
                    </div>
                
                    <p className="text-lg text-gray-300 mb-1">
                      Price: ${stock.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      } dark:text-opacity-80 mb-4`}
                    >
                      Change: {stock.change.toFixed(2)}
                    </p>
                
                    {/* Chart */}
                    <div className="w-full h-32">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
