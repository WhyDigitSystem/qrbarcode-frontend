import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const Qrbarsingle = Loadable(lazy(() => import('views/pages/qrCode/QrBarCode')));
const Qrbargroup = Loadable(lazy(() => import('views/pages/qrCode/QrBargroup')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const QrBarRouts = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/qrbar/group',
      element: <Qrbargroup />
    },
    {
      path: '/qrbar/single',
      element: <Qrbarsingle />
    }
  ]
};

export default QrBarRouts;
