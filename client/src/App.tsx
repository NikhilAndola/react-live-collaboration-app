import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import route from './routes';

function App() {
  const router = createBrowserRouter(route);

  return <RouterProvider router={router} />;
}

export default App;
