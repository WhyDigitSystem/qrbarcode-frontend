// assets

import { IconArrowDownToArc } from '@tabler/icons-react';

// constant
const icons = {
  IconArrowDownToArc
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const inbound = {
  id: 'inbound',
  title: 'Inbound',
  type: 'group',
  children: [
    {
      id: 'inbound',
      title: 'Inbound',
      type: 'item',
      url: '/inbound/inboundmain',
      icon: icons.IconArrowDownToArc
    }
  ]
};

export default inbound;
