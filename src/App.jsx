import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './shared/components/ScrollToTop';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchSettings } from './store/settingsSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
    // Optional: Add logic here to validate token if needed, or rely on axios interceptors (better).
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
