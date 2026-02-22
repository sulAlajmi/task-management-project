import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/tasks';
import { useNotification } from '../context/NotificationContext';
import TaskItem from '../components/TaskItem';
import './TaskList.css';

export default function TaskList() {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getTasks()
      .then((data) => {
        if (!cancelled) setTasks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.status === 401 ? t('common.unauthorized') : t('common.error'));
          showError(err.response?.data?.message || t('common.error'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [t, showError]);

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
      </div>
    );
  }

  return (
    <div className="page task-list">
      <div className="task-list__head">
        <h1 className="task-list__title">{t('task.myTasks')}</h1>
        <Link to="/tasks/new" className="task-list__new">
          {t('nav.newTask')}
        </Link>
      </div>
      {tasks.length === 0 ? (
        <div className="task-list__empty">
          <p>{t('task.noTasks')}</p>
          <p className="task-list__empty-hint">{t('task.createFirst')}</p>
          <Link to="/tasks/new" className="task-list__new task-list__new--block">
            {t('task.create')}
          </Link>
        </div>
      ) : (
        <ul className="task-list__list">
          {tasks.map((task) => (
            <li key={task._id}>
              <TaskItem task={task} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
