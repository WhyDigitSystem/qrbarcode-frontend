import { IconArrowDownFromArc } from '@tabler/icons-react';

const icons = {
  IconArrowDownFromArc
};

const Reports = {
  id: 'reports',
  title: 'Reports',
  type: 'group',
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports/reportsmain',
      icon: icons.IconArrowDownFromArc
    }
  ]
};

export default Reports;
