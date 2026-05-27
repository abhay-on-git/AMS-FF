import { RootProviders } from './providers';
import { AppRouter } from './router';

export default function App() {
  return (
    <RootProviders>
      <AppRouter />
    </RootProviders>
  );
}
