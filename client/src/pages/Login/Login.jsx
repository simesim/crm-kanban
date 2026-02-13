<<<<<<< HEAD
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../store/auth/thunks";
import { selectAuthLoading, selectAuthError } from "../../store/auth/selectors";

export default function Login() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk(email, password));
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading} type="submit">
          {loading ? "Loading..." : "Sign in"}
        </button>
      </form>

      {error && <div style={{ marginTop: 12, color: "crimson" }}>{error}</div>}
    </div>
  );
}
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/Inputs';
import Loader from '../../components/Loader/Loader';
import styles from './Login.module.css';

// Имитация API-клиента
const api = {
  login: async (email, password) => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Тестовые данные
    if (email === 'manager@test.com' && password === 'Qwerty123!') {
      return {
        success: true,
        data: {
          token: 'fake-jwt-token',
          user: {
            id: 1,
            email: 'manager@test.com',
            name: 'Test Manager',
            role: 'manager'
          }
        }
      };
    } else {
      return {
        success: false,
        error: 'Неверный email или пароль'
      };
    }
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/boards');
    }
  }, [navigate]);

  // Валидация полей
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email обязателен';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Неверный формат email';
        return '';
      case 'password':
        if (!value) return 'Пароль обязателен';
        if (value.length < 6) return 'Пароль должен быть не менее 6 символов';
        return '';
      default:
        return '';
    }
  };

  // Валидация всей формы
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Валидация при изменении
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Очистка серверной ошибки при изменении полей
    setServerError('');
  };

  // Обработка потери фокуса
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Отметить все поля как "тронутые"
    const allTouched = {};
    Object.keys(formData).forEach(key => allTouched[key] = true);
    setTouched(allTouched);
    
    // Валидация
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const response = await api.login(formData.email, formData.password);
      
      if (response.success) {
        // Сохраняем токен и данные пользователя
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Перенаправляем на доски
        navigate('/boards');
      } else {
        setServerError(response.error);
      }
    } catch (error) {
      setServerError('Ошибка сервера. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>CRM Kanban</h1>
        <h2 className={styles.subtitle}>Вход в систему</h2>
        
        {serverError && (
          <div className={styles.serverError}>
            <span className={styles.errorIcon}>⚠️</span>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="manager@test.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
            disabled={isLoading}
            fullWidth
            autoComplete="email"
          />

          <Input
            type="password"
            name="password"
            label="Пароль"
            placeholder="Qwerty123!"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ''}
            disabled={isLoading}
            fullWidth
            autoComplete="current-password"
          />

          <div className={styles.hint}>
            <div>Тестовый доступ:</div>
            <div>manager@test.com</div>
            <div>Qwerty123!</div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? <Loader size="small" color="white" /> : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
>>>>>>> d5d5f61172c5e1fe8eed093fc2836c1e8e898903
