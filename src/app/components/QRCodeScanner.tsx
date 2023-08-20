import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface CameraDevice {
  id: string;
  label: string;
}

type Props = {
  title: string;
  fps?: number;
  qrbox?: number;
  qrCodeSuccessCallback?: (decodedText: string) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
};

function QrcodeScanner({
  title,
  fps = 10,
  qrbox = 250,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Props) {
  const [isScanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const html5QrCodeRef = useRef<Html5Qrcode>();

  const handleStopScanning = useCallback(async (isMounted = true) => {
    try {
      if (html5QrCodeRef.current) {
        const scannerState = html5QrCodeRef.current.getState();
        if (
          [
            Html5QrcodeScannerState.PAUSED,
            Html5QrcodeScannerState.SCANNING,
          ].includes(scannerState)
        ) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
        if (isMounted) setScanning(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStartScanning = useCallback(
    async (id: string) => {
      setScanning(true);
      setSelectedCamera(id);
      try {
        if (html5QrCodeRef.current) {
          // Stop if there's already a scanner active.
          try {
            const scannerState = html5QrCodeRef.current.getState();
            if (
              [
                Html5QrcodeScannerState.PAUSED,
                Html5QrcodeScannerState.SCANNING,
              ].includes(scannerState)
            ) {
              await html5QrCodeRef.current.stop();
            }
          } catch (e) {
            console.error(e);
          }

          html5QrCodeRef.current
            .start(
              id,
              {
                fps,
                qrbox,
              },
              (decodedText: string) => {
                handleStopScanning();
                qrCodeSuccessCallback && qrCodeSuccessCallback(decodedText);
              },
              (errorMessage: string) => {
                qrCodeErrorCallback && qrCodeErrorCallback(errorMessage);
              }
            )
            .catch(() => {
              // Start failed.
            });
        }
      } catch (e) {
        console.error(e);
      }
    },
    [fps, qrbox, qrCodeSuccessCallback, qrCodeErrorCallback, handleStopScanning]
  );

  const handleRequestCameraPermissions = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras(); // Request camera permissions.
      if (devices && devices.length) {
        setCameras(devices);
        html5QrCodeRef.current = new Html5Qrcode('reader', false);
        handleStartScanning(devices[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  }, [handleStartScanning]);

  useEffect(() => {
    return () => {
      handleStopScanning(false);
    };
  }, [handleStopScanning]);

  useEffect(() => {
    const handleLanding = async () => {
      if (isScanning) {
        await handleRequestCameraPermissions();
      }
    };

    handleLanding();
  }, [isScanning, handleRequestCameraPermissions]);

  return (
    <div className="mt-5 shadow-sm bg-white rounded-md flex flex-col items-center dark:bg-surface-02dp p-3">
      {!isScanning && (
        <>
          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setScanning(true)}
              >
                {title}
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      <div className="bg-black w-full" id="reader" />

      {isScanning && (
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleStopScanning()}
              >
                Stop Scanning
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default QrcodeScanner;
