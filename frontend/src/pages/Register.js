import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/auth';
import { useNotification } from '../context/NotificationContext';
import './Auth.css';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = t('auth.nameRequired');
    if (!form.email.trim()) next.email = t('auth.emailRequired');
    if (!form.password) next.password = t('auth.passwordRequired');
    else if (form.password.length < 6) next.password = t('auth.passwordMin');
    if (form.password !== form.confirmPassword) next.confirmPassword = t('auth.passwordsMatch');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await apiRegister(form.name, form.email, form.password);
      showSuccess(t('auth.registerSuccess'));
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || t('common.error');
      showError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <h1 className="auth__title">{t('auth.register')}</h1>
      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__field">
          <label htmlFor="name">{t('auth.name')}</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={errors.name ? 'auth__input--error' : ''}
            autoComplete="name"
          />
          {errors.name && <span className="auth__error">{errors.name}</span>}
        </div>
        <div className="auth__field">
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={errors.email ? 'auth__input--error' : ''}
            autoComplete="email"
          />
          {errors.email && <span className="auth__error">{errors.email}</span>}
        </div>
        <div className="auth__field">
          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className={errors.password ? 'auth__input--error' : ''}
            autoComplete="new-password"
          />
          {errors.password && <span className="auth__error">{errors.password}</span>}
        </div>
        <div className="auth__field">
          <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            className={errors.confirmPassword ? 'auth__input--error' : ''}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="auth__error">{errors.confirmPassword}</span>}
        </div>
        <button type="submit" className="auth__submit" disabled={loading}>
          {loading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
      <p className="auth__footer">
        {t('auth.hasAccount')} <Link to="/login">{t('auth.login')}</Link>
      </p>
    </div>
  );
}
