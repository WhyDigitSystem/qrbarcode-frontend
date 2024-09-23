import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const WMSRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // {
    //   path: '/reports/reportsmain',
    //   element: <ReportMain />
    // },
    // {
    //   path: '/reports/reportsmain',
    //   element: <ReportMain />
    // }
  ]
};

export default WMSRoutes;
