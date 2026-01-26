import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ScrollToTop';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchSettings } from './features/settings/settingsSlice';
import { fetchCurrentUser } from './features/auth/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;

