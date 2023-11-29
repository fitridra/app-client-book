import Home from './pages/Home';
import Login from './pages/Login';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
