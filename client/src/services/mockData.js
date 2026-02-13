// Мок-данные для тестирования без бэкенда
export const mockBoard = {
  id: 'board-1',
  title: 'Курс Frontend-разработки',
  totalStudents: 24,
  columns: [
    {
      id: 'col-1',
      title: '📝 Новые заявки',
      cards: [
        {
          id: 'card-1',
          studentName: 'Иван Петров',
          phone: '+7 (999) 123-45-67',
          email: 'ivan@example.com',
          courseName: 'Frontend Basic',
          courseValue: 45000,
          status: 'new',
          lastActivity: '2026-02-13T10:30:00Z',
          commentsCount: 2,
          isNew: true,
          position: 0
        },
        {
          id: 'card-2',
          studentName: 'Анна Смирнова',
          phone: '+7 (999) 234-56-78',
          email: 'anna@example.com',
          courseName: 'Frontend Pro',
          courseValue: 75000,
          status: 'new',
          lastActivity: '2026-02-12T15:20:00Z',
          commentsCount: 1,
          isNew: true,
          position: 1
        }
      ]
    },
    {
      id: 'col-2',
      title: '📞 Перезвон',
      cards: [
        {
          id: 'card-3',
          studentName: 'Михаил Иванов',
          phone: '+7 (999) 345-67-89',
          email: 'mikhail@example.com',
          courseName: 'Frontend Basic',
          courseValue: 45000,
          status: 'call',
          lastActivity: '2026-02-11T09:15:00Z',
          commentsCount: 3,
          isNew: false,
          position: 0
        }
      ]
    },
    {
      id: 'col-3',
      title: '💰 Оплата',
      cards: [
        {
          id: 'card-4',
          studentName: 'Елена Козлова',
          phone: '+7 (999) 456-78-90',
          email: 'elena@example.com',
          courseName: 'Frontend Pro',
          courseValue: 75000,
          status: 'payment',
          lastActivity: '2026-02-10T14:30:00Z',
          commentsCount: 5,
          isNew: false,
          position: 0
        }
      ]
    },
    {
      id: 'col-4',
      title: '🎓 В обучении',
      cards: [
        {
          id: 'card-5',
          studentName: 'Алексей Сидоров',
          phone: '+7 (999) 567-89-01',
          email: 'alexey@example.com',
          courseName: 'Frontend Basic',
          courseValue: 45000,
          status: 'studying',
          lastActivity: '2026-02-13T11:00:00Z',
          commentsCount: 8,
          isNew: false,
          position: 0
        }
      ]
    },
    {
      id: 'col-5',
      title: '✅ Завершено',
      cards: []
    }
  ]
};

export const mockCard = {
  id: 'card-1',
  studentName: 'Иван Петров',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  courseName: 'Frontend Basic',
  courseValue: 45000,
  status: 'new',
  createdAt: '2026-02-10T08:00:00Z',
  lastActivity: '2026-02-13T10:30:00Z',
  comments: [
    {
      id: 'comment-1',
      author: { id: 'user-1', name: 'Менеджер Анна' },
      text: 'Позвонила, клиент заинтересован, просит подробности по курсу',
      createdAt: '2026-02-10T10:15:00Z'
    },
    {
      id: 'comment-2',
      author: { id: 'user-1', name: 'Менеджер Анна' },
      text: 'Отправила пробный урок на email',
      createdAt: '2026-02-11T14:20:00Z'
    }
  ]
};