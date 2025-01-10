
// assets
import { IconDashboard } from '@tabler/icons-react';
import invoice from 'views/pages/Invoice/invoice';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Invoice = {
  id: 'invoice',
  title: 'Invoice',
  type: 'group',
  children: [
    {
      id: 'invoice',
      title: 'Invoice',
      type: 'collapse',
      icon: icons.IconDashboard,

      children: [
        {
          id: 'invoice',
          title: 'Invoice',
          type: 'item',
          url: '/invoice',
        },
        {
          id: 'invoicepdf',
          title: 'Invoice PDF',
          type: 'item',
          url: '/invoicepdf',
        }
      ]
    }
  ]
};

export default Invoice;