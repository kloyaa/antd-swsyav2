import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/login/login.page';
import AdminDashboard from './pages/dashboard/dasbhoard.page';
import UsersActivity from './pages/dashboard/activity.page';
import Users from './pages/dashboard/users.page';
import Requests from './pages/dashboard/requests.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/a/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/a/activities',
    element: <UsersActivity />,
  },
  {
    path: '/a/users',
    element: <Users />,
  },
  {
    path: '/a/requests',
    element: <Requests />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
