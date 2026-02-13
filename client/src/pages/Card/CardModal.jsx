import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import { Button, TextArea } from '../../components/Inputs'; // Убрали Input, так как он не используется
import Loader from '../../components/Loader/Loader';
import { mockCardAPI as cardAPI } from '../../services/mockApi'; // Исправляем импорт
import styles from './CardModal.module.css';

const CardModal = ({ isOpen, onClose, card, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [comment, setComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  // Загрузка полной информации о карточке
  useEffect(() => {
    const loadCardDetails = async () => {
      if (!isOpen || !card?.id) return;
      
      setLoading(true);
      try {
        const response = await cardAPI.getCard(card.id);
        setCardData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки карточки:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCardDetails();
  }, [isOpen, card?.id]); // Добавили зависимость card?.id

  // Отправка комментария
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setSendingComment(true);
    try {
      await cardAPI.addComment(card.id, { text: comment });
      setComment('');
      
      // Перезагрузка карточки
      const response = await cardAPI.getCard(card.id);
      setCardData(response.data);
      
      onUpdate(); // Обновление доски
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
    } finally {
      setSendingComment(false);
    }
  };

  // Изменение статуса/поля (оставляем для будущего использования)
  // const handleUpdateField = async (field, value) => {
  //   try {
  //     await cardAPI.updateCard(card.id, { [field]: value });
  //     const response = await cardAPI.getCard(card.id);
  //     setCardData(response.data);
  //     onUpdate();
  //   } catch (error) {
  //     console.error('Ошибка обновления:', error);
  //   }
  // };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Карточка ученика`}
      size="large"
    >
      {loading ? (
        <div className={styles.loader}>
          <Loader size="medium" />
        </div>
      ) : cardData && (
        <div className={styles.cardModal}>
          {/* Основная информация */}
          <div className={styles.section}>
            <h3>👤 Информация об ученике</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Имя:</span>
                <span className={styles.value}>{cardData.studentName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Телефон:</span>
                <span className={styles.value}>{cardData.phone}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{cardData.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Курс:</span>
                <span className={styles.value}>{cardData.courseName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Стоимость:</span>
                <span className={styles.value}>{cardData.courseValue?.toLocaleString()} ₽</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Статус:</span>
                <span className={`${styles.status} ${styles[cardData.status]}`}>
                  {cardData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className={styles.section}>
            <h3>📋 Детали</h3>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span>Дата создания:</span>
                <strong>{new Date(cardData.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Последняя активность:</span>
                <strong>{new Date(cardData.lastActivity).toLocaleString()}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Всего комментариев:</span>
                <strong>{cardData.comments?.length || 0}</strong>
              </div>
            </div>
          </div>

          {/* Комментарии */}
          <div className={styles.section}>
            <h3>💬 История взаимодействия</h3>
            
            <div className={styles.comments}>
              {cardData.comments?.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>
                      {comment.author?.name || 'Система'}
                    </span>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.commentText}>
                    {comment.text}
                  </div>
                </div>
              ))}
              
              {cardData.comments?.length === 0 && (
                <div className={styles.noComments}>
                  Нет комментариев
                </div>
              )}
            </div>

            {/* Добавление комментария */}
            <div className={styles.addComment}>
              <TextArea
                placeholder="Добавить комментарий..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                fullWidth
              />
              <Button 
                variant="primary" 
                onClick={handleAddComment}
                disabled={sendingComment || !comment.trim()}
              >
                {sendingComment ? <Loader size="small" /> : 'Отправить'}
              </Button>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className={styles.actions}>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
            <Button variant="success">
              Сохранить изменения
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CardModal;