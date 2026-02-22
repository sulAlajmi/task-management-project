import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import './Header.css';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem('access_token');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        {t('nav.tasks')}
      </Link>
      <nav className="header__nav">
        {isAuth ? (
          <>
            <Link to="/tasks" className="header__link">
              {t('nav.tasks')}
            </Link>
            <Link to="/tasks/new" className="header__link">
              {t('nav.newTask')}
            </Link>
            <button type="button" className="header__btn" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header__link">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="header__link">
              {t('nav.register')}
            </Link>
          </>
        )}
        <span className="header__lang">
          <button
            type="button"
            className={`header__lang-btn ${i18n.language === 'en' ? 'header__lang-btn--active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`header__lang-btn ${i18n.language === 'ar' ? 'header__lang-btn--active' : ''}`}
            onClick={() => changeLanguage('ar')}
          >
            AR
          </button>
        </span>
      </nav>
    </header>
  );
}
