# Receipt Extractor - Backend

NestJS backend for AI-powered receipt data extraction.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3 (LocalStack for local dev)
- **AI Providers**: Google Gemini, OpenAI GPT-4

## Prerequisites

- Node.js v20+ (see `.nvmrc`)
- Docker & Docker Compose (for LocalStack)
- API keys for AI providers

## Setup

### 1. Install Dependencies

```bash
nvm use  # or ensure Node v20+
npm install
```

### 2. Environment Setup

Copy the example env file and update with your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your AI provider keys (`GEMINI_API_KEY` and/or `OPENAI_API_KEY`).

### 3. Start LocalStack (S3)

From the project root:

```bash
docker-compose up -d
```

The S3 bucket (`receipts`) will be automatically created when the backend starts.

### 4. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Server

```bash
npm run start:dev
```

Server runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| `GET`  | `/`             | Health check               |
| `POST` | `/receipts`     | Upload and extract receipt |
| `GET`  | `/receipts/:id` | Get receipt by ID          |

### Upload Receipt

```bash
curl -X POST http://localhost:3000/receipts \
  -F "file=@receipt.jpg" \
  -F "provider=gemini"
```

## Project Structure

```
src/
├── ai/         # AI providers (Gemini, OpenAI)
├── prisma/     # Database service
├── receipt/    # Controller, service, DTOs
├── storage/    # S3 storage service
└── config/     # App configuration
```

## Running Tests

```bash
npm run test        # Unit tests
npm run test:cov    # Coverage report
```

## Design Decisions

1. **Multi-provider AI**: Supports both Gemini and OpenAI, selectable per request
2. **Validation**: Uses `class-validator` to verify AI responses match expected schema
3. **S3 Storage**: Receipt images stored in S3, URLs returned to frontend
4. **Prisma ORM**: Type-safe database access with PostgreSQL
