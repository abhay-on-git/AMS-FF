import type { PropsWithChildren } from 'react';
import { AppProviders } from '../providers';

export function RootProviders({ children }: PropsWithChildren) {
  return <AppProviders>{children}</AppProviders>;
}
