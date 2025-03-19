import ControlLayout from './components/layouts/control-layout';
import AuthButton from './components/shared/auth-button';
import Widget from './components/shared/widget';
import { Toaster } from './components/ui/toaster';
import './index.css';
import AppProvider from './providers/app-provider';

function App() {
  return (
    <AppProvider>
      <ControlLayout>
        <AuthButton />
        <Widget />
      </ControlLayout>
      <Toaster />
    </AppProvider>
  );
}

export default App;

// 11:14
