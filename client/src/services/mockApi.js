import { mockBoard, mockCard } from './mockData';

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockBoardAPI = {
  getBoard: async (boardId) => {
    await delay(800);
    return { data: mockBoard };
  },
  
  moveCard: async (cardId, data) => {
    await delay(300);
    console.log('Карточка перемещена:', { cardId, ...data });
    return { success: true };
  }
};

export const mockCardAPI = {
  getCard: async (cardId) => {
    await delay(500);
    return { data: mockCard };
  },
  
  addComment: async (cardId, data) => {
    await delay(400);
    console.log('Комментарий добавлен:', data);
    return { 
      data: {
        id: Date.now().toString(),
        ...data,
        author: { id: 'user-1', name: 'Менеджер Анна' },
        createdAt: new Date().toISOString()
      }
    };
  },
  
  updateCard: async (cardId, data) => {
    await delay(300);
    console.log('Карточка обновлена:', data);
    return { success: true };
  }
};