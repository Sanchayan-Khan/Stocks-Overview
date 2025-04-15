import { NextResponse } from 'next/server'
import axios from 'axios'

const STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX', 'BABA', 'INTC', 'AMD', 'CSCO', 'UBER', 'IBM']

export async function GET() {
  try {
    const results = await Promise.all(
      STOCKS.map(async (symbol) => {
        const quoteRes = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
        )

        const profileRes = await axios.get(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
        )

        const current = quoteRes.data.c
        const change = quoteRes.data.d
        const percentChange = quoteRes.data.dp

        const chartData = Array.from({ length: 10 }, (_, i) => ({
          time: `T-${10 - i}`,
          price: +(current + (Math.random() * 2 - 1) * 5).toFixed(2),
        }))

        return {
          symbol,
          price: current,
          change,
          percentChange,
          chartData,
          name: profileRes.data.name,
          logo: profileRes.data.logo,
        }
      })
    )

    return NextResponse.json(results)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 })
  }
}
