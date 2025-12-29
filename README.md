# 1. Start PostgreSQL
docker-compose up -d

# 2. Install backend dependencies & setup database
cd backend
bun install
bun run db:generate
bun run db:push
bun run db:seed

# 3. Start backend (runs on port 3001)
bun run dev

# 4. In another terminal, start frontend (runs on port 3000)
cd frontend
npm run dev