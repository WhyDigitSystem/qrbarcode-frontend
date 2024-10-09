import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const Invoice = Loadable(lazy(() => import('views/pages/Invoice/invoice')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const InvoiceRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/invoice',
      element: <Invoice />
    }
  ]
};

export default InvoiceRoutes;
