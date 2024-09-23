// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const UiChangeSamples = {
  id: 'uisamples',
  title: 'UI Changes',
  // caption: 'Company',
  type: 'group',
  children: [
    {
      id: 'uisamples',
      title: 'UI Changes Sample',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'stepper',
          title: 'Stepper',
          type: 'item',
          url: '/basicmasters/fullfeaturedcurdgrid',
          breadcrumbs: false
        },
        {
          id: 'tabs',
          title: 'Tabs',
          type: 'item',
          url: '/basicmasters/stepperTest',
          breadcrumbs: false
        },
        {
          id: 'accordions',
          title: 'Accordion',
          type: 'item',
          url: '/basicmasters/accorditionTest',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default UiChangeSamples;
