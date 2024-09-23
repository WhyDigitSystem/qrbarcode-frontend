import { IconArrowDownFromArc } from '@tabler/icons-react';

const icons = {
  IconArrowDownFromArc
};

const outbound = {
  id: 'outbound',
  title: 'Outbound',
  type: 'group',
  children: [
    {
      id: 'outbound',
      title: 'Outbound',
      type: 'item',
      url: '/outbound/outboundmain',
      icon: icons.IconArrowDownFromArc
    }
  ]
};

export default outbound;
