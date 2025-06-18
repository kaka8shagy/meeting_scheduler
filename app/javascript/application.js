import React from 'react';
import ReactDOM from 'react-dom/client';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './components/App';

const Body = lazy(() => import('./components/Body'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Error = lazy(() => import('./components/Error'));

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('react-root'); // The ID of the div where React will take over

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <Error />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <Body />
            </Suspense>
          ),
        },
        {
          path: '/about',
          element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <About />
            </Suspense>
          ),
        },
        {
          path: '/contact',
          element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <Contact />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={appRouter} />);
});