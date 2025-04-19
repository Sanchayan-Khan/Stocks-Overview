'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const SkeletonStockDetail = () => (
  <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-8">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-700/50 animate-pulse" />
          <div>
            <div className="h-10 w-48 bg-gray-700/50 rounded animate-pulse mb-2" />
            <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-24 bg-gray-700/50 rounded animate-pulse" />
      </div>

      {/* Price & Change */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-36 bg-gray-700/50 rounded animate-pulse" />
        <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse" />
      </div>

      {/* Chart */}
      <div className="w-full h-72 bg-gray-800/30 rounded-lg shadow-lg mb-8 animate-pulse" />

      {/* Stock Details */}
      <div className="bg-gray-800/30 rounded-lg shadow-lg p-6 mb-8">
        <div className="h-8 w-40 bg-gray-700/50 rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

type Stock = {
  symbol: string
  name: string
  logo: string
  price: number
  change: number
  percentChange: number
  chartData: { time: string; price: number }[]
  marketCap: number
  peRatio: number
  eps: number
  week52High: number
  week52Low: number
  dayHigh: number
  dayLow: number
}

export default function StockDetailPage() {
  const [stock, setStock] = useState<Stock | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      const fetchStockData = async () => {
        try {
          const res = await axios.get(`/api/stocks/${id}`)
          setStock(res.data)
        } catch (err) {
          console.error('Error fetching stock data:', err)
        } finally {
          setLoading(false)
        }
      }
      fetchStockData()
    }
  }, [id])

  if (loading) {
    return <SkeletonStockDetail />
  }

  if (!stock) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>No stock found</p>
      </div>
    )
  }

  const formatNumber = (num: number) =>
    num >= 1e9
      ? `${(num / 1e9).toFixed(2)}B`
      : num >= 1e6
      ? `${(num / 1e6).toFixed(2)}M`
      : num.toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {stock.logo && (
              <img
                src={stock.logo}
                alt={`${stock.name} logo`}
                className="w-16 h-16 rounded-full shadow-lg"
              />
            )}
            <div>
              <h1 className="text-4xl font-semibold text-white">{stock.name}</h1>
              <p className="text-xl text-gray-400">{stock.symbol}</p>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              stock.change >= 0 ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {stock.percentChange.toFixed(2)}%
          </div>
        </div>

        {/* Price & Change */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-2xl font-bold text-white">
            Price: ${stock.price.toFixed(2)}
          </p>
          <p
            className={`text-lg font-medium ${
              stock.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            Change: {stock.change.toFixed(2)}
          </p>
        </div>

        {/* Chart */}
        <div className="w-full h-72 bg-gray-800 rounded-lg shadow-lg mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stock.chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={stock.change >= 0 ? '#10B981' : '#EF4444'}
                strokeWidth={3}
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

        {/* Stock Details */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-white mb-4">Stock Details</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex justify-between">
              <span>24h Change:</span>
              <span
                className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}
              >
                {stock.change.toFixed(2)} USD
              </span>
            </li>
            <li className="flex justify-between">
              <span>Percent Change:</span>
              <span
                className={stock.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}
              >
                {stock.percentChange.toFixed(2)}%
              </span>
            </li>
            <li className="flex justify-between">
              <span>Market Price:</span>
              <span>{stock.price.toFixed(2)} USD</span>
            </li>
            <li className="flex justify-between">
              <span>Market Cap:</span>
              <span>{formatNumber(stock.marketCap)} USD</span>
            </li>
            <li className="flex justify-between">
              <span>P/E Ratio:</span>
              <span>{stock.peRatio?.toFixed(2) || 'N/A'}</span>
            </li>
            <li className="flex justify-between">
              <span>EPS (TTM):</span>
              <span>{stock.eps?.toFixed(2) || 'N/A'}</span>
            </li>
            <li className="flex justify-between">
              <span>52-Week High:</span>
              <span>{stock.week52High?.toFixed(2) || 'N/A'} USD</span>
            </li>
            <li className="flex justify-between">
              <span>52-Week Low:</span>
              <span>{stock.week52Low?.toFixed(2) || 'N/A'} USD</span>
            </li>
            <li className="flex justify-between">
              <span>Day High:</span>
              <span>{stock.dayHigh?.toFixed(2)} USD</span>
            </li>
            <li className="flex justify-between">
              <span>Day Low:</span>
              <span>{stock.dayLow?.toFixed(2)} USD</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
