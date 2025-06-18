import React from 'react';
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

const App = () => {
  return (
    <div className="app p-4 flex flex-col min-h-screen">
      <div>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Header />
        </Suspense>
      </div>
      <div className="flex-1 py-4"><Outlet /></div>
      <div>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default App;