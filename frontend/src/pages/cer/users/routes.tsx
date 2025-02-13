import { RouteObject } from 'react-router-dom';
import UsersList from './list';
import UserForm from './form';

export const userRoutes: RouteObject[] = [
  {
    path: '/cer/users',
    element: <UsersList />,
  },
  {
    path: '/cer/users/new',
    element: <UserForm />,
  },
  {
    path: '/cer/users/:userId/edit',
    element: <UserForm />,
  },
]; 