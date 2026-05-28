import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AppProviders } from '@/providers';
import { router } from '@/routes/routeConfig.tsx';

export default function App() {
  return (
    <Provider store={store}>
      <AppProviders>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AppProviders>
    </Provider>
  );
}
