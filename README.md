# CRM Kanban (Server + Client)

## Что внутри
- `server/` — Express + Prisma + PostgreSQL (REST API)
- `client/` — React (CRA) + Redux Toolkit (Kanban UI)
- `docker-compose.yml` — PostgreSQL
- Postman: `CRM-Kanban.postman_collection.json`, `Local-CRM.postman_environment.json`

## Требования
- Node.js 18+
- Docker Desktop

## Быстрый старт (локально)

### 1) База данных
```bash
docker-compose up -d
```

### 2) Сервер
```bash
cd server
npm i
# применить миграции и сгенерировать клиент Prisma
npx prisma migrate dev
npm run dev
```
Проверка:
- `GET http://localhost:3000/api/v1/health`

### 3) Создай тестовые аккаунты
Можно через Postman или curl:

**LEAD**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"lead@test.com","password":"123456","role":"LEAD"}'
```

**MANAGER**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"123456","role":"MANAGER"}'
```

> `role` можно не передавать — по умолчанию будет `MANAGER`.

### 4) Клиент
В новом терминале:
```bash
cd client
npm i
npm start
```
Откроется: `http://localhost:3001`

## День 10 (что добавлено в клиент)
- Перетаскивание колонок (только LEAD)
- Ролевой UI: MANAGER не видит LEAD-операции (колонки/инвайты)
- Поиск по карточкам на доске (в режиме поиска drag выключен)
- Инвайт участника в доску по `userId` (LEAD)

## Где взять userId для инвайта
```bash
cd server
npx prisma studio
```
Таблица `User` → поле `id`.
