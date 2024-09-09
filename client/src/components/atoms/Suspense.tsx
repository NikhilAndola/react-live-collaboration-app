import { Suspense } from 'react';

// interface LoadableProps {
//   children: React.ReactNode;
// }

export default function Loadable(Component: any) {
  return () => <Suspense fallback={<></>}>{<Component />}</Suspense>;
}
