import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import QRCode from 'react-qr-code';
import { Button, Typography } from '@mui/material';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
};

function ShopQRCodeModal({ isOpen, onClose, qrCodeUrl }: Props) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container justifyContent="center">
        <Grid
          container
          item
          sx={{
            padding: 10,
            backgroundColor: '#154C79',
            width: 250,
            borderRadius: 5,
          }}
          justifyContent="center"
        >
          <Grid item>
            <Typography variant="h6" color="white">
              QR Code
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              margin: 5,
              padding: 1,
              borderWidth: 2,
              borderColor: '#000',
              backgroundColor: '#fff',
            }}
          >
            <QRCode
              size={128}
              style={{ height: 'auto' }}
              value={qrCodeUrl}
              viewBox={`0 0 128 128`}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
}

export default ShopQRCodeModal;
