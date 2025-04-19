# Stock Dashboard

This is a Next.js stock dashboard application that provides real-time stock data, interactive charts, and financial analysis tools with user authentication.

## Features

- **User Authentication**: Secure login and signup functionality using Jose JWT
- **Real-time Stock Data**: Monitor stock prices with automatic updates
- **Interactive Charts**: Visualize stock performance with Recharts 2.0
- **Watchlist**: Save and track your favorite stocks
- **Financial Analysis**: View key financial metrics and indicators
- **Responsive Design**: Access from any device with a fully responsive interface
- **Modern Animations**: Smooth transitions and effects using Framer Motion
- **API Routes**: Secure backend API endpoints with MongoDB integration

## Tech Stack

- **Framework**: Next.js 15.3.0 with App Router and TurboPack
- **Database**: MongoDB with Mongoose 8.x
- **Authentication**: JWT-based auth with Jose 6.x
- **Styling**: 
  - Tailwind CSS 4.x
  - Class Variance Authority
  - Custom animations with Framer Motion 12.x
- **Charts**: Recharts 2.15+
- **UI Components**: Custom components with animate.css integration
- **API Integration**: Axios for data fetching
- **Type Safety**: Full TypeScript support

## Getting Started

First, install dependencies:

```bash
npm install
```

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Then, run the development server with TurboPack enabled:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js app router components and pages
│   ├── api/               # API routes for authentication and stock data
│   ├── login/            # User authentication pages
│   └── stocks/           # Stock-related pages
├── components/            # Reusable UI components
│   ├── providers/        # Context providers
│   └── ui/              # UI components with animations
├── lib/                  # Utility functions and helpers
├── middleware/           # Authentication and database middleware
└── models/              # MongoDB Mongoose models
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## The author is currently learning web dev, thank you!
