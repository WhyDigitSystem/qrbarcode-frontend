// // assets
// import { IconKey } from '@tabler/icons-react';

// // constant
// const icons = {
//   IconKey
// };

// // ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

// const QrBarCode = {
//   country: {
//     id: 'qrbarCode',
//     title: 'QrbarSingle',
//     type: 'item',
//     url: '/qrbar/single'
//   },
//   state: {
//     id: 'qrbarCode',
//     title: 'QrbarGroup',
//     type: 'item',
//     url: '/qrbar/group'
//   }
// };

// export default QrBarCode;

// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const QrBarCode = {
  id: 'qrBarCode',
  title: 'QR BarCode',
  type: 'group',
  children: [
    {
      id: 'qrBarCode',
      title: 'QR BarCode',
      type: 'collapse',
      // url: '/qrbar/single',
      icon: icons.IconDashboard,
      // breadcrumbs: false

      children: [
        {
          id: 'qrBarSingle',
          title: 'QRBarSingle',
          type: 'item',
          url: '/qrbar/single',
        },
        {
          id: 'qrbarGroup',
          title: 'QrbarGroup',
          type: 'item',
          url: '/qrbar/group'
        }
      ]
    }
  ]
};

export default QrBarCode;

