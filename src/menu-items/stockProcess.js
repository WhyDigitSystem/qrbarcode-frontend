// assets

import { IconForklift } from '@tabler/icons-react';

// constant
const icons = { IconForklift };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const stockProcess = {
  id: 'stockProcess',
  title: 'Stock Process',
  type: 'group',
  children: [
    {
      id: 'stockProcess',
      title: 'Stock Process',
      type: 'item',
      url: '/stock-process/stockprocessmain',
      icon: icons.IconForklift
    }
  ]
};

export default stockProcess;
