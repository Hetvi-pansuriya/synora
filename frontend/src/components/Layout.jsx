import { cloneElement, useState } from 'react';
import API_BASE from '../config';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from './Toast';
import './Layout.css';

function Layout({ children }) {
  void API_BASE;
  const [title, setTitle] = useState('Customers');
  const [count, setCount] = useState(null);
  const [toast, setToast] = useState(null);
  const user = JSON.parse(localStorage.getItem('synora_user') || '{}');

  const showToast = (payload) => {
    setToast({ id: Date.now(), ...payload });
  };

  return (
    <div className="layout">
      <Sidebar user={user} showToast={showToast} />
      <div className="layout-main">
        <Topbar title={title} count={count} user={user} />
        <main className="layout-content">
          {children && cloneElement(children, { setTitle, setCount, showToast })}
        </main>
        {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
      </div>
    </div>
  );
}

export default Layout;
