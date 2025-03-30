import './index.css';
import AppProvider from './providers/app-provider';
import CameraPreview from './screens/camera-preview';

export default function CameraApp() {
  return (
    <AppProvider>
      <CameraPreview />
    </AppProvider>
  );
}
