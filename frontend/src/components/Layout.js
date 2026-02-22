import { Outlet } from 'react-router-dom';
import Header from './Header';
import Notification from './Notification';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Notification />
    </div>
  );
}
