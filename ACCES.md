# Access rules (Boards)

## Users
- user1 (id=1)
- user2 (id=2)

## Scenarios

### 1. Owner sees own board
- user1 creates boardA
- user1 requests GET /boards
- boardA is returned

### 2. Non-member does not see board
- user1 creates boardA
- user2 requests GET /boards
- boardA is NOT returned

### 3. Non-member cannot access board by id
- user1 creates boardA
- user2 requests GET /boards/{boardA.id}
- response: 404

### 4. Member sees board
- user1 creates boardA
- user1 adds user2 as member
- user2 requests GET /boards
- boardA is returned
