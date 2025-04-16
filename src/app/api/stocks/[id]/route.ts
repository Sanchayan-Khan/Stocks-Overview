import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string> } // Use Record<string, string> for params
) {
  const { id } = context.params;

  try {
    const [quoteRes, profileRes, metricsRes] = await Promise.all([
      axios.get(`https://finnhub.io/api/v1/quote?symbol=${id}&token=${API_KEY}`),
      axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${id}&token=${API_KEY}`),
      axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${id}&metric=all&token=${API_KEY}`),
    ]);

    const now = new Date();
    const chartData = Array.from({ length: 7 }, (_, i) => ({
      time: new Date(now.getTime() - i * 60 * 60 * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      price: quoteRes.data.c + (Math.random() - 0.5) * 5,
    })).reverse();

    const stock = {
      symbol: id,
      name: profileRes.data.name,
      logo: profileRes.data.logo,
      price: quoteRes.data.c,
      change: quoteRes.data.d,
      percentChange: quoteRes.data.dp,
      chartData,
      marketCap: metricsRes.data.metric.marketCapitalization,
      peRatio: metricsRes.data.metric.peNormalizedAnnual,
      eps: metricsRes.data.metric.epsNormalizedAnnual,
      week52High: metricsRes.data.metric['52WeekHigh'],
      week52Low: metricsRes.data.metric['52WeekLow'],
      dayHigh: quoteRes.data.h,
      dayLow: quoteRes.data.l,
    };

    return NextResponse.json(stock);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
