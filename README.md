# Receipt Extractor

A full-stack app that extracts data from receipt images using AI.

## Project Structure

```
├── engineer-assessment-backend/   # NestJS backend API
├── engineer-assessment-frontend/  # React frontend (Vite + Tailwind)
├── sample-receipts/               # Sample receipt images for testing
└── docker-compose.yml             # PostgreSQL database
```

## Quick Start

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Backend setup

```bash
cd engineer-assessment-backend
npm install
npx prisma migrate dev
npm run start:dev
```

### 3. Frontend setup

```bash
cd engineer-assessment-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

## Features

- Upload receipt images (drag & drop or file picker)
- AI-powered extraction of merchant, items, prices, and totals
- Edit extracted data before saving
- Automatic sum validation
- Receipt history with S3 storage

## Tech Stack

**Backend:** NestJS, Prisma, PostgreSQL, OpenAI/Gemini, AWS S3  
**Frontend:** React 19, Vite, Tailwind CSS, Axios
