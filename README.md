# WeatherApp

A weather forecast application built with **React**, **TypeScript**, and
**Tailwind CSS**.\
It fetches real-time weather data, including a 5-day forecast, using the
OpenWeatherMap API.

## Features

- Search for any city to view current weather and 5-day forecast
- Responsive design using Tailwind CSS
- Clean architecture with reusable components
- Fully typed with TypeScript for better developer experience

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **API**: [OpenWeatherMap](https://openweathermap.org/api)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js \>= 18
- npm or yarn

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### Environment Variables

Create a `.env` file in the root of your project and add:

    VITE_WEATHER_API_KEY=your_openweather_api_key

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deployment

This project is deployed on **Vercel**.\

1. Push your code to a GitHub repository. 2. Go to
   [Vercel](https://vercel.com/) and import your repo. 3. Set the
   environment variable (`VITE_WEATHER_API_KEY`) in the Vercel dashboard.
2. Deploy!

## Folder Structure

    src/
      components/     # Reusable UI components
      pages/          # App pages
      types/          # TypeScript type definitions
      hooks/          # Custom hooks

## License

This project is open-source and available under the MIT License.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
