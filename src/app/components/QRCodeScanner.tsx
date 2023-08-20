import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';

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

  useEffect(() => {
    return () => {
      handleStopScanning(false);
    };
  }, []);

  async function handleRequestCameraPermissions() {
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
  }

  async function handleStartScanning(id: string) {
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
  }

  async function handleStopScanning(isMounted = true) {
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
  }

  return (
    <div className="mt-5 shadow-sm bg-white rounded-md flex flex-col items-center dark:bg-surface-02dp p-3">
      {!isScanning && (
        <>
          <div className="flex justify-center text-center items-center">
            <div>
              <Button onClick={handleRequestCameraPermissions}>{title}</Button>
            </div>
          </div>
        </>
      )}

      <div className="bg-black w-full" id="reader" />

      {isScanning && (
        <div className="mt-6 text-center">
          <Button onClick={() => handleStopScanning()}>Stop Scanning</Button>
        </div>
      )}
    </div>
  );
}

export default QrcodeScanner;
