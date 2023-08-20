import { Alert, AlertColor, Snackbar } from '@mui/material';

type Props = {
  isToastOpen: boolean;
  severity: AlertColor;
  message: string;
  closeToast: () => void;
};

export default function Toast({
  isToastOpen,
  severity,
  message,
  closeToast,
}: Props) {
  return (
    <div>
      <Snackbar
        open={isToastOpen}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeToast} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
