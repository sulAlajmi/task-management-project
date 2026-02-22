import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TaskItem.css';

const STATUS_KEYS = { todo: 'statusTodo', 'in-progress': 'statusInProgress', done: 'statusDone' };
const PRIORITY_KEYS = { low: 'priorityLow', medium: 'priorityMedium', high: 'priorityHigh' };

export default function TaskItem({ task }) {
  const { t } = useTranslation();
  const statusKey = STATUS_KEYS[task.status] || 'statusTodo';
  const priorityKey = PRIORITY_KEYS[task.priority] || 'priorityMedium';

  return (
    <article className="task-item">
      <Link to={`/tasks/${task._id}`} className="task-item__link">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && (
          <p className="task-item__desc">{task.description}</p>
        )}
        <div className="task-item__meta">
          <span className={`task-item__badge task-item__badge--${task.status}`}>
            {t(`task.${statusKey}`)}
          </span>
          <span className={`task-item__badge task-item__badge--priority-${task.priority}`}>
            {t(`task.${priorityKey}`)}
          </span>
        </div>
      </Link>
      <Link to={`/tasks/${task._id}/edit`} className="task-item__edit" aria-label={t('task.edit')}>
        {t('task.edit')}
      </Link>
    </article>
  );
}
