import { useEffect, useState } from 'react';
import API_BASE from '../config';
import './Toast.css';

function Toast({ toast, onDismiss }) {
  void API_BASE;
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setClosing(false);
    const hideTimer = setTimeout(() => setClosing(true), 2700);
    const removeTimer = setTimeout(onDismiss, 3000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast ${closing ? 'closing' : ''}`}>
      <div className="toast-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-8" /></svg>
      </div>
      <div>
        <div className="toast-title">{toast.title}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
    </div>
  );
}

export default Toast;
