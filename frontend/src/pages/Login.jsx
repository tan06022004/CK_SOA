import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import styles from '../styles/Login.module.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = authService.login(username, password);

    if (result.success) {
      onLogin(result.role);
      navigate(`/${result.role}`);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Home size={32} />
          </div>
          <h1 className={styles.title}>HotelMaster</h1>
          <p className={styles.subtitle}>Hotel Management System</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Username Input */}
          <div>
            <label className={styles.label}>Tên đăng nhập</label>
            <div className={styles.inputWrapper}>
              <User className={styles.icon} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Nhập tên đăng nhập"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label className={styles.label}>Mật khẩu</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Nhập mật khẩu"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                tabIndex="-1"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Đăng nhập
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;