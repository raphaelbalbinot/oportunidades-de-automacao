import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextData {
  showNotification: (type: NotificationType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, title: string, message?: string, duration = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newItem: NotificationItem = { id, type, title, message, duration };

      setNotifications((prev) => [...prev, newItem]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const success = useCallback((title: string, message?: string) => showNotification('success', title, message), [showNotification]);
  const error = useCallback((title: string, message?: string) => showNotification('danger', title, message), [showNotification]);
  const warning = useCallback((title: string, message?: string) => showNotification('warning', title, message), [showNotification]);
  const info = useCallback((title: string, message?: string) => showNotification('info', title, message), [showNotification]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'fa-check-circle text-emerald-600';
      case 'danger':
        return 'fa-times-circle text-red-600';
      case 'warning':
        return 'fa-exclamation-triangle text-amber-500';
      case 'info':
        return 'fa-info-circle text-blue-600';
    }
  };

  const getTypeClasses = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-emerald-600 bg-emerald-50/95 text-emerald-950 shadow-emerald-900/10';
      case 'danger':
        return 'border-l-4 border-l-red-600 bg-red-50/95 text-red-950 shadow-red-900/10';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-amber-50/95 text-amber-950 shadow-amber-900/10';
      case 'info':
        return 'border-l-4 border-l-blue-600 bg-blue-50/95 text-blue-950 shadow-blue-900/10';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, warning, info }}>
      {children}

      {/* Floating Container de Mensagens GovBR DS */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {notifications.map((item) => (
          <div
            key={item.id}
            role="alert"
            className={`br-message pointer-events-auto rounded-md p-4 shadow-xl border border-slate-200 backdrop-blur-xs flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${getTypeClasses(
              item.type
            )}`}
          >
            <div className="icon flex-shrink-0 mt-0.5">
              <i className={`fas ${getIcon(item.type)} text-base`} aria-hidden="true"></i>
            </div>
            <div className="content flex-1 text-xs">
              <div className="message-title font-bold text-[13px] tracking-tight">{item.title}</div>
              {item.message && <div className="message-body mt-1 opacity-90 leading-relaxed">{item.message}</div>}
            </div>
            <div className="close flex-shrink-0">
              <button
                type="button"
                onClick={() => removeNotification(item.id)}
                className="br-button circle small text-slate-500 hover:text-slate-800 p-1 bg-transparent cursor-pointer rounded-full transition-colors"
                aria-label="Fechar notificação"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
