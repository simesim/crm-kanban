# CRM Kanban Client (React)

This is a **working** client for your CRM + Kanban board (Trello-like):
- login (MANAGER / LEAD)
- boards list + create board (LEAD)
- board view: columns + cards, drag & drop (sync via REST)
- card modal: full card fields + comments

Day 10 additions:
- column reorder (drag columns) for LEAD
- role-based UI (MANAGER doesn't see LEAD-only actions)
- search inside board (drag disabled while searching)
- LEAD can add board member by userId

## 1) Requirements
- Node.js 18+ (recommended)
- Running backend on **http://localhost:3000** (your Postman env uses `http://localhost:3000/api/v1`)

## 2) Configure
Copy `.env.example` to `.env` if needed.

Main var:
- `REACT_APP_API_URL=http://localhost:3000/api/v1`

## 3) Install & run
```bash
cd client
npm i
npm start
```
The UI will open on: http://localhost:3001

## 3.1) How to get a userId for "Add member"
Open Prisma Studio:
```bash
cd server
npx prisma studio
```
Find `User` table and copy the `id`.

## 4) Quick check (backend)
From your Postman:
- `GET {{baseUrl}}/health`
- `POST {{baseUrl}}/auth/login`

If Postman works, UI login should work too.

## 5) If some endpoints differ on your server
This client assumes these endpoints (baseUrl already includes `/api/v1`):
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /boards`
- `POST /boards`
- `GET /boards/:id`

Columns/Cards/Comments endpoints are **centralized** here:
- `src/service/columns.js`
- `src/service/cards.js`
- `src/service/comments.js`

If your server uses another URL shape, update only these files.

## 6) Demo credentials
From your Postman collection:
- `lead@test.com / 123456`

