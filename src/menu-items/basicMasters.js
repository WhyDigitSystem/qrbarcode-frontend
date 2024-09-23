// import { IconDatabaseStar } from '@tabler/icons-react';

// const icons = {
//   IconDatabaseStar
// };
// // const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
// const storedScreens = JSON.parse(localStorage.getItem('screens')) || [];
// console.log('THE SCREENS FROM LOCALSTORAGE ARE:', storedScreens);

// const screenMappings = {
//   country: {
//     id: 'countryMaster',
//     title: 'Country',
//     type: 'item',
//     url: '/basicmasters/countrymaster'
//   },
//   state: {
//     id: 'stateMaster',
//     title: 'State Master',
//     type: 'item',
//     url: '/basicmasters/statemaster'
//   },
//   city: {
//     id: 'cityMaster',
//     title: 'City Master',
//     type: 'item',
//     url: '/basicmasters/citymaster'
//   },
//   currency: {
//     id: 'currencyMaster',
//     title: 'Currency',
//     type: 'item',
//     url: '/basicmasters/currencymaster'
//   },
//   region: {
//     id: 'regionMaster',
//     title: 'Region',
//     type: 'item',
//     url: '/basicmasters/regionmaster'
//   }
// };

// // Convert stored screen names to lowercase to match keys in screenMappings
// const filteredChildren = storedScreens.map((screen) => screenMappings[screen.toLowerCase()]).filter(Boolean);

// const basicMasters = {
//   id: 'basicMastersGroup',
//   title: 'Basic Masters',
//   type: 'group',
//   children: [
//     {
//       id: 'basicMasters',
//       title: 'Basic Masters',
//       type: 'collapse',
//       icon: icons.IconDatabaseStar,
//       children: filteredChildren
//     }
//   ]
// };

// export default basicMasters;

import { useState } from 'react';
import { IconDatabaseStar } from '@tabler/icons-react';

const icons = {
  IconDatabaseStar
};

const loginUserName = localStorage.getItem('userName');
const loginUserType = localStorage.getItem('userType');
const storedScreens = JSON.parse(localStorage.getItem('screens')) || [];
console.log('THE SCREENS FROM LOCALSTORAGE ARE:', storedScreens);

const screenMappings = {
  country: {
    id: 'countryMaster',
    title: 'Country',
    type: 'item',
    url: '/basicmasters/countrymaster'
  },
  state: {
    id: 'stateMaster',
    title: 'State',
    type: 'item',
    url: '/basicmasters/statemaster'
  },
  city: {
    id: 'cityMaster',
    title: 'City',
    type: 'item',
    url: '/basicmasters/citymaster'
  },
  currency: {
    id: 'currencyMaster',
    title: 'Currency',
    type: 'item',
    url: '/basicmasters/currencymaster'
  },
  region: {
    id: 'regionMaster',
    title: 'Region',
    type: 'item',
    url: '/basicmasters/regionmaster'
  }
};

const filteredChildren =
  loginUserType === 'admin'
    ? Object.values(screenMappings)
    : storedScreens.map((screen) => screenMappings[screen.toLowerCase()]).filter(Boolean);

const basicMasters = {
  id: 'basicMastersGroup',
  title: 'Basic Masters',
  type: 'group',
  children: [
    {
      id: 'basicMasters',
      title: 'Basic Masters',
      type: 'collapse',
      icon: icons.IconDatabaseStar,
      children: filteredChildren
    }
  ]
};

export default basicMasters;
