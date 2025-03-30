import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppLayout from './components/layouts/app-layout/app-layout';
import { Toaster } from './components/ui/toaster';
import './index.css';
import AppProvider from './providers/app-provider';
import { MediaConfig } from './screens/media-config/media-config';
import SignInScreen from './screens/sign-in/sign-in';
import SignUpScreen from './screens/sign-up/sign-up';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<MediaConfig />} />
          </Route>
          <Route path='/sign-in' element={<SignInScreen />} />
          <Route path='/sign-up' element={<SignUpScreen />} />
        </Routes>
        <Toaster />
      </Router>
    </AppProvider>
  );
}

export default App;
