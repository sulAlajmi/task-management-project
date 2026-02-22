import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTask, updateTask } from '../api/tasks';
import { useNotification } from '../context/NotificationContext';
import './TaskForm.css';

const STATUS_OPTIONS = [
  { value: 'todo', key: 'statusTodo' },
  { value: 'in-progress', key: 'statusInProgress' },
  { value: 'done', key: 'statusDone' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', key: 'priorityLow' },
  { value: 'medium', key: 'priorityMedium' },
  { value: 'high', key: 'priorityHigh' },
];

function formatDateForInput(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function TaskEdit() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    getTask(id)
      .then((data) => {
        if (!cancelled) {
          setForm({
            title: data.title || '',
            description: data.description || '',
            status: data.status || 'todo',
            priority: data.priority || 'medium',
            dueDate: formatDateForInput(data.dueDate),
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.status === 404 ? t('task.taskNotFound') : t('common.error'));
          showError(err.response?.data?.message || t('common.error'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, t, showError]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = t('task.titleRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setErrors({});
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
    };
    try {
      await updateTask(id, payload);
      showSuccess(t('task.updateSuccess'));
      navigate(`/tasks/${id}`);
    } catch (err) {
      showError(err.response?.data?.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="page__loading">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="page__error">{error}</p>
        <Link to="/tasks" className="task-form__back">{t('task.backToList')}</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to={`/tasks/${id}`} className="task-form__back">{t('task.backToList')}</Link>
      <h1 className="task-form__title">{t('task.edit')}</h1>
      <form className="task-form__form" onSubmit={handleSubmit}>
        <div className="task-form__field">
          <label htmlFor="title">{t('task.title')} *</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className={errors.title ? 'task-form__input--error' : ''}
          />
          {errors.title && <span className="task-form__error">{errors.title}</span>}
        </div>
        <div className="task-form__field">
          <label htmlFor="description">{t('task.description')}</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div className="task-form__field">
          <label htmlFor="status">{t('task.status')}</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{t(`task.${o.key}`)}</option>
            ))}
          </select>
        </div>
        <div className="task-form__field">
          <label htmlFor="priority">{t('task.priority')}</label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{t(`task.${o.key}`)}</option>
            ))}
          </select>
        </div>
        <div className="task-form__field">
          <label htmlFor="dueDate">{t('task.dueDate')}</label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
          />
        </div>
        <div className="task-form__actions">
          <button type="submit" className="task-form__submit" disabled={saving}>
            {saving ? t('common.loading') : t('common.submit')}
          </button>
          <Link to={`/tasks/${id}`} className="task-form__cancel">{t('common.cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
