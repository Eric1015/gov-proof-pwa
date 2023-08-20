import { AlertColor } from '@mui/material';
import { useCallback, useState } from 'react';

const useToast = () => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState('');

  const closeToast = useCallback(() => {
    setIsToastOpen(false);
  }, []);

  const openToast = useCallback((message: string, severity: AlertColor) => {
    setMessage(message);
    setSeverity(severity);
    setIsToastOpen(true);
  }, []);

  return { isToastOpen, severity, message, closeToast, openToast };
};

export default useToast;
