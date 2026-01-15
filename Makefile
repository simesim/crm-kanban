run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

db:
	docker compose up -d db

db-down:
	docker compose down
