import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { getTask } from '../api/tasks';
import { useNotification } from '../context/NotificationContext';
import './TaskDetail.css';

const STATUS_KEYS = { todo: 'statusTodo', 'in-progress': 'statusInProgress', done: 'statusDone' };
const PRIORITY_KEYS = { low: 'priorityLow', medium: 'priorityMedium', high: 'priorityHigh' };

export default function TaskDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getTask(id)
      .then((data) => {
        if (!cancelled) setTask(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.status === 404 ? t('task.taskNotFound') : t('common.error'));
          if (err.response?.status !== 404) showError(err.response?.data?.message || t('common.error'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, t, showError]);

  if (loading) {
    return (
      <div className="page">
        <p className="page__loading">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="page">
        <p className="page__error">{error || t('task.taskNotFound')}</p>
        <Link to="/tasks" className="task-detail__back">{t('task.backToList')}</Link>
      </div>
    );
  }

  const statusKey = STATUS_KEYS[task.status] || 'statusTodo';
  const priorityKey = PRIORITY_KEYS[task.priority] || 'priorityMedium';
  const created = task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '';
  const updated = task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '';
  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';

  return (
    <div className="page task-detail">
      <Link to="/tasks" className="task-detail__back">{t('task.backToList')}</Link>
      <h1 className="task-detail__title">{t('task.details')}</h1>
      <div className="task-detail__card">
        <h2 className="task-detail__name">{task.title}</h2>
        {task.description && (
          <p className="task-detail__desc">{task.description}</p>
        )}
        <dl className="task-detail__meta">
          <dt>{t('task.status')}</dt>
          <dd><span className={`task-detail__badge task-detail__badge--${task.status}`}>{t(`task.${statusKey}`)}</span></dd>
          <dt>{t('task.priority')}</dt>
          <dd><span className={`task-detail__badge task-detail__badge--priority-${task.priority}`}>{t(`task.${priorityKey}`)}</span></dd>
          {due && (
            <>
              <dt>{t('task.dueDate')}</dt>
              <dd>{due}</dd>
            </>
          )}
          {created && (
            <>
              <dt>{t('task.createdAt')}</dt>
              <dd>{created}</dd>
            </>
          )}
          {updated && (
            <>
              <dt>{t('task.updatedAt')}</dt>
              <dd>{updated}</dd>
            </>
          )}
        </dl>
        <Link to={`/tasks/${task._id}/edit`} className="task-detail__edit">
          {t('task.edit')}
        </Link>
      </div>
    </div>
  );
}
