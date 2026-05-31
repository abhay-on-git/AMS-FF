import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AppProviders } from '@/providers';
import { router } from '@/routes/routeConfig.tsx';

export default function App() {
  return (
    <Provider store={store}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </Provider>
  );
}
