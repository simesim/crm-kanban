# crm-kanban (вариант 2: /crm-kanban/server + /crm-kanban/client)

## Что внутри
- `server/` — Node.js + Express + Prisma + PostgreSQL (REST API)
- `client/` — CRA (react-scripts) + Redux Toolkit + DnD

## Картинки (можно заменить своими)
Код использует эти имена:
- `client/public/assets/logo.svg`
- `client/public/assets/avatar.svg`

Можешь просто заменить файлы своими, оставив те же имена.

## Запуск (локально)

### 1) База данных (Docker)
```bash
docker-compose up -d
```

### 2) Сервер
```bash
cd server
npm i
npx prisma migrate dev
npm run dev
```
Проверка:
- `GET http://localhost:3000/api/v1/health`

### 3) Создать тестовые аккаунты
**LEAD**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"lead@test.com","password":"123456","role":"LEAD"}'
```

**MANAGER**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"123456","role":"MANAGER"}'
```

### 4) Клиент
```bash
cd client
npm i
npm start
```
Откроется:
- `http://localhost:3001`

## Что закрыто из плана Светы (дни 1–10)
- UI-кирпичи: Loader/Spinner, Modal, Input/Button
- Страницы: Login, Boards, Board (Kanban), Card Modal, NotFound
- UI колонок: добавить/переименовать/удалить + кнопки влево/вправо
- UI карточек: создание внутри колонки, открытие в модалке
- CRM поля в модалке: phone/email/age/course/source + tags/checklist/timePreferences
- UI комментариев: список/ввод/удаление (по правам)
- Визуал DnD карточек: подсветка, placeholder, курсор
- Полировка: пустые состояния, тексты, тосты

Дополнительно (по твоему скрину):
- Страницы меню: `Диск / Отзывы / Уроки` (пока статические)
