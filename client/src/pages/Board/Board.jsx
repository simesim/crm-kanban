<<<<<<< HEAD
export default function Board() {
  return <div>Board page</div>;
}
=======
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { boardAPI } from '../../services/mockApi';
import { mockBoardAPI as boardAPI } from '../../services/mockApi';
import Layout from '../../components/Layout/Layout';
import Loader from '../../components/Loader/Loader';
import CardModal from '../Card/CardModal';
import { Button } from '../../components/Inputs';
import styles from './Board.module.css';

const Board = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка доски целиком
// В Board.jsx, исправляем useEffect
useEffect(() => {
  loadBoard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [boardId]); // Игнорируем предупреждение, так как loadBoard не нужно включать в зависимости

  const loadBoard = async () => {
    setLoading(true);
    try {
      const response = await boardAPI.getBoard(boardId);
      setBoard(response.data);
    } catch (error) {
      console.error('Ошибка загрузки доски:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка переноса карточек
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Нет цели или позиция не изменилась
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Оптимистичное обновление UI
    const newBoard = { ...board };
    const sourceColumn = newBoard.columns.find(c => c.id === source.droppableId);
    const destColumn = newBoard.columns.find(c => c.id === destination.droppableId);
    
    const [movedCard] = sourceColumn.cards.splice(source.index, 1);
    destColumn.cards.splice(destination.index, 0, movedCard);
    
    // Обновляем позиции
    destColumn.cards.forEach((card, idx) => {
      card.position = idx;
    });
    
    setBoard(newBoard);

    // Отправка на сервер
    try {
      await boardAPI.moveCard(draggableId, {
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        newPosition: destination.index
      });
    } catch (error) {
      // Откат при ошибке
      console.error('Ошибка перемещения:', error);
      loadBoard(); // Перезагружаем актуальное состояние
    }
  };

  // Открыть карточку
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loaderContainer}>
          <Loader size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.board}>
        <div className={styles.boardHeader}>
          <h1>{board?.title}</h1>
          <div className={styles.boardStats}>
            <span>👥 {board?.totalStudents} учеников</span>
            <span>📊 {board?.columns?.length} этапов</span>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.columns}>
            {board?.columns.map(column => (
              <Column 
                key={column.id} 
                column={column} 
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </DragDropContext>

        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          card={selectedCard}
          onUpdate={loadBoard}
        />
      </div>
    </Layout>
  );
};

// Колонка канбана
const Column = ({ column, onCardClick }) => {
  const totalCards = column.cards?.length || 0;
  const totalValue = column.cards?.reduce((sum, card) => sum + (card.courseValue || 0), 0);

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h3>{column.title}</h3>
        <div className={styles.columnStats}>
          <span>{totalCards} учеников</span>
          {totalValue > 0 && <span>💰 {totalValue.toLocaleString()} ₽</span>}
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`${styles.cards} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.cards?.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
                    onClick={() => onCardClick(card)}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.cardName}>{card.studentName}</span>
                      {card.isNew && <span className={styles.newBadge}>Новый</span>}
                    </div>
                    
                    <div className={styles.cardInfo}>
                      <div className={styles.cardCourse}>
                        🎓 {card.courseName}
                      </div>
                      
                      <div className={styles.cardMeta}>
                        <span>📞 {card.phone}</span>
                        {card.courseValue && (
                          <span className={styles.cardValue}>
                            💰 {card.courseValue.toLocaleString()} ₽
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardDate}>
                        📅 {new Date(card.lastActivity).toLocaleDateString()}
                      </span>
                      {card.commentsCount > 0 && (
                        <span className={styles.cardComments}>
                          💬 {card.commentsCount}
                        </span>
                      )}
                      {card.tags?.map(tag => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <Button variant="outline" size="small" fullWidth>
        + Добавить ученика
      </Button>
    </div>
  );
};

export default Board;
>>>>>>> d5d5f61172c5e1fe8eed093fc2836c1e8e898903
