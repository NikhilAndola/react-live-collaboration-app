import { lazy } from 'react';
import Loadable from './components/atoms/Suspense';
import PageContainer from './components/Layout/PageContainer';
import DashboardContainer from './components/Layout/DashboardContainer';

const LandingPage = Loadable(lazy(() => import('./pages/LandingPage')));
const CodeEditorPage = Loadable(lazy(() => import('./pages/CodeEditorPage')));

const route = [
  {
    path: '/',
    element: (
      <PageContainer>
        <LandingPage />
      </PageContainer>
    ),
  },
  {
    path: '/room/:roomId',
    element: <DashboardContainer />,
    children: [
      {
        path: '',
        element: <CodeEditorPage />,
      },
    ],
  },
];

export default route;
