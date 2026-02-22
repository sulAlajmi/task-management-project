import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../api/auth';
import { useNotification } from '../context/NotificationContext';
import './Auth.css';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = t('auth.emailRequired');
    if (!form.password) next.password = t('auth.passwordRequired');
    else if (form.password.length < 6) next.password = t('auth.passwordMin');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await apiLogin(form.email, form.password);
      showSuccess(t('auth.loginSuccess'));
      const from = location.state?.from?.pathname || '/tasks';
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        showError(t('auth.invalidCredentials'));
      } else {
        showError(err.response?.data?.message || t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <h1 className="auth__title">{t('auth.login')}</h1>
      <form className="auth__form" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
          />
          {errors.password && <span className="auth__error">{errors.password}</span>}
        </div>
        <button type="submit" className="auth__submit" disabled={loading}>
          {loading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
      <p className="auth__footer">
        {t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link>
      </p>
    </div>
  );
}
