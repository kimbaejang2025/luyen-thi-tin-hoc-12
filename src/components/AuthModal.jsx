import React, { useState } from 'react';
import { Icon } from './Icons';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, registeredUsers }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, username, password, confirmPassword } = formData;

    if (!username.trim() || !password) {
      setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    if (isLoginMode) {
      // Login flow
      const user = registeredUsers.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
      );
      
      if (user) {
        onLogin(user);
        handleClose();
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
    } else {
      // Register flow
      if (!name.trim()) {
        setError('Vui lòng điền họ và tên!');
        return;
      }
      
      if (password.length < 6) {
        setError('Mật khẩu phải dài ít nhất 6 ký tự!');
        return;
      }

      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không trùng khớp!');
        return;
      }

      const userExists = registeredUsers.some(
        u => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (userExists) {
        setError('Tên đăng nhập này đã tồn tại trên hệ thống!');
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password: password,
        role: 'user',
        history: []
      };

      onRegister(newUser);
      setIsLoginMode(true);
      setError('');
      alert('Đăng ký tài khoản học viên thành công! Hãy đăng nhập ngay.');
    }
  };

  const handleClose = () => {
    setFormData({ name: '', username: '', password: '', confirmPassword: '' });
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="glass-card modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <Icon name="X" style={{ width: '20px', height: '20px' }} />
        </button>
        
        <h2 className="modal-title">
          {isLoginMode ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Học Viên'}
        </h2>
        <p className="modal-desc">
          {isLoginMode 
            ? 'Hãy đăng nhập để lưu kết quả thi thử và lịch sử học tập.' 
            : 'Đăng ký tài khoản nhanh chóng để tham gia luyện thi trực tuyến.'
          }
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error text-center" style={{ marginBottom: '16px', color: 'var(--color-danger)' }}>{error}</div>}
          
          {!isLoginMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Họ và tên</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="Nhập họ và tên học viên..."
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">Tên đăng nhập</label>
            <input
              id="auth-username"
              type="text"
              name="username"
              className="form-input"
              placeholder="Nhập tên đăng nhập..."
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Mật khẩu</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm-pass">Xác nhận mật khẩu</label>
              <input
                id="reg-confirm-pass"
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Nhập lại mật khẩu..."
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            <Icon name={isLoginMode ? 'User' : 'Plus'} style={{ width: '18px', height: '18px' }} />
            {isLoginMode ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <div className="auth-switch">
          {isLoginMode ? (
            <>
              Chưa có tài khoản học viên?{' '}
              <span onClick={() => { setIsLoginMode(false); setError(''); }}>Đăng ký ngay</span>
            </>
          ) : (
            <>
              Đã có tài khoản?{' '}
              <span onClick={() => { setIsLoginMode(true); setError(''); }}>Đăng nhập</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
