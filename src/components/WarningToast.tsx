import { toast } from 'react-hot-toast';

export const warningToast = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#fffbea',        // light yellow background
      border: '1px solid #facc15',  // yellow border
      color: '#92400e',             // dark amber text
    },
  });
};
