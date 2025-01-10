import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import InvoicePdf from 'views/pages/Invoice/invoicePdf';

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
    },
    {
      path: '/invoicepdf',
      element: <InvoicePdf />
    }
  ]
};

export default InvoiceRoutes;
