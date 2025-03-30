import AppLayout from './components/layouts/app-layout/app-layout';
import { Toaster } from './components/ui/toaster';
import './index.css';
import AppProvider from './providers/app-provider';

function App() {
  return (
    <AppProvider>
      <AppLayout></AppLayout>
      <Toaster />
    </AppProvider>
  );
}

export default App;
