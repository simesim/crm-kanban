# CRM Kanban Client (minimal Trello-like CRM)

This client is aligned to the original task:
- CRM with kanban board
- Trello-like logic
- two roles: MANAGER / LEAD
- columns with cards inside
- open a card over the board and view/edit data
- comments for every card
- ordinary REST only, no realtime

Extra features kept minimal:
- toasts for errors/success
- basic empty states and loaders

## Run
```bash
cd client
npm i
npm start
```

The UI will open on: http://localhost:3001

Backend base URL:
- `REACT_APP_API_URL=http://localhost:3000/api/v1`

If your server uses other endpoints for columns/cards/comments,
change only these files:
- `src/service/columns.js`
- `src/service/cards.js`
- `src/service/comments.js`
