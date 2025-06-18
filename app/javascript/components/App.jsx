import React from 'react';
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

const App = () => {
  return (
    <div className="app">
      <Suspense fallback={<h1>Loading...</h1>}>
        <Header />
      </Suspense>
      <Outlet />
      <Suspense fallback={<h1>Loading...</h1>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;