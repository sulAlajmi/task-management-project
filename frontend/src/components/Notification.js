import { useNotification } from '../context/NotificationContext';
import './Notification.css';

export default function Notification() {
  const { notification, clear } = useNotification();
  if (!notification) return null;

  return (
    <div
      className={`notification notification--${notification.type}`}
      role="alert"
      onClick={clear}
    >
      {notification.message}
    </div>
  );
}
