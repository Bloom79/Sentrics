import { RouteObject } from 'react-router-dom';
import MembersList from './index';
import MemberForm from './form';

export const memberRoutes: RouteObject[] = [
  {
    path: '/cer/members',
    element: <MembersList />,
  },
  {
    path: '/cer/members/new',
    element: <MemberForm />,
  },
  {
    path: '/cer/members/:memberId/edit',
    element: <MemberForm />,
  },
]; 