import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Loader from './components/Loader/Loader';
import Modal from './components/Modal/Modal';
import { Button, Input, TextInput, TextArea, Select } from './components/Inputs';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    email: '',
    description: '',
    status: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const headerContent = (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <span>📊 CRM Kanban</span>
      <span style={{ fontSize: '14px', opacity: 0.8 }}>UI Components Testing</span>
    </div>
  );

  const sidebarContent = (
    <div>
      <h3 style={{ color: 'white', marginBottom: '20px' }}>📦 Components</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '12px', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
          ✅ Layout
        </li>
        <li style={{ marginBottom: '12px', padding: '8px' }}>
          🔄 Loader
        </li>
        <li style={{ marginBottom: '12px', padding: '8px' }}>
          📋 Modal
        </li>
        <li style={{ marginBottom: '12px', padding: '8px' }}>
          🔘 Button
        </li>
        <li style={{ marginBottom: '12px', padding: '8px' }}>
          📝 Inputs
        </li>
      </ul>
    </div>
  );

  const selectOptions = [
    { value: 'active', label: '✅ Активен' },
    { value: 'pending', label: '⏳ В ожидании' },
    { value: 'completed', label: '🎉 Завершен' },
    { value: 'cancelled', label: '❌ Отменен' }
  ];

  return (
    <Layout headerContent={headerContent} sidebarContent={sidebarContent}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>🧪 Тестирование UI компонентов</h1>
        
        {/* Loader секция */}
        <section style={{ marginBottom: '40px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px' }}>🔄 Loader</h2>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>Small:</div>
              <Loader size="small" />
            </div>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>Medium:</div>
              <Loader size="medium" />
            </div>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>Large:</div>
              <Loader size="large" />
            </div>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>Custom color:</div>
              <Loader size="small" color="#28a745" />
            </div>
          </div>
        </section>

        {/* Button секция */}
        <section style={{ marginBottom: '40px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px' }}>🔘 Button</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Variants:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Sizes:</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>States:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button disabled>Disabled</Button>
              <Button fullWidth style={{ maxWidth: '300px' }}>Full Width</Button>
            </div>
          </div>
        </section>

        {/* Inputs секция */}
        <section style={{ marginBottom: '40px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px' }}>📝 Inputs</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>TextInput:</h3>
              <TextInput 
                label="Обычное поле"
                placeholder="Введите текст..."
                value={formData.text}
                onChange={handleChange}
                name="text"
              />
              
              <TextInput 
                label="С ошибкой"
                placeholder="Поле с ошибкой"
                value="Неверный формат"
                onChange={handleChange}
                error="Это поле заполнено неверно"
                name="text-error"
                style={{ marginTop: '20px' }}
              />
              
              <TextInput 
                label="Обязательное поле"
                placeholder="Обязательно к заполнению"
                required
                style={{ marginTop: '20px' }}
              />
              
              <TextInput 
                label="Отключенное поле"
                placeholder="Недоступно"
                disabled
                style={{ marginTop: '20px' }}
              />
            </div>
            
            <div>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Input (email):</h3>
              <Input 
                type="email"
                label="Email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                name="email"
              />
              
              <h3 style={{ margin: '20px 0 15px', fontSize: '16px' }}>TextArea:</h3>
              <TextArea 
                label="Описание"
                placeholder="Введите описание..."
                value={formData.description}
                onChange={handleChange}
                name="description"
                rows={4}
              />
              
              <h3 style={{ margin: '20px 0 15px', fontSize: '16px' }}>Select:</h3>
              <Select 
                label="Статус"
                placeholder="Выберите статус..."
                options={selectOptions}
                value={formData.status}
                onChange={handleChange}
                name="status"
                required
              />
            </div>
          </div>
        </section>

        {/* Modal секция */}
        <section style={{ marginBottom: '40px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px' }}>📋 Modal</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Открыть модальное окно
          </Button>
        </section>

        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Тестовое модальное окно"
          size="medium"
        >
          <div style={{ padding: '20px' }}>
            <p>Это содержимое модального окна. Здесь можно разместить любые компоненты:</p>
            
            <TextInput 
              label="Имя"
              placeholder="Введите имя"
              fullWidth
              style={{ marginBottom: '15px' }}
            />
            
            <TextArea 
              label="Комментарий"
              placeholder="Введите комментарий..."
              rows={3}
              fullWidth
              style={{ marginBottom: '20px' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Отмена
              </Button>
              <Button variant="success">
                Сохранить
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

export default App;