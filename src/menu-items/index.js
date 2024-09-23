// import dashboard from './dashboard';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';
// import company from './company';
// import basicMasters from './basicMasters';
// import warehouseMasters from './warehouseMasters';
// import RolesAndResponsibilities from './RolesAndResponsibilities';
// import inbound from './inbound';
// import outbound from './outbound';
// import vas from './vas';
// import stockProcess from './stockProcess';
// import UiChangeSamples from './UiChangeSamples';

// const loginUserRole = localStorage.getItem('ROLE');
// const storedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// // ==============================|| MENU ITEMS ||============================== //

// const menuItems = {
//   // items: [dashboard, pages, utilities, other, company, basicMasters]
//   // items: [dashboard, ...(loginUserRole === 'PRODUCT_ADMIN' ? [company] : [basicMasters])]
//   items: [
//     dashboard,
//     company,
//     basicMasters,
//     warehouseMasters,
//     RolesAndResponsibilities,
//     inbound,
//     outbound,
//     vas,
//     stockProcess,
//     UiChangeSamples
//   ]
// };

// export default menuItems;

import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import company from './company';
import basicMasters from './basicMasters';
import warehouseMasters from './warehouseMasters';
import RolesAndResponsibilities from './RolesAndResponsibilities';
import inbound from './inbound';
import outbound from './outbound';
import vas from './vas';
import stockProcess from './stockProcess';
import UiChangeSamples from './UiChangeSamples';
import Reports from './Reports';

const loginUserName = (localStorage.getItem('userName') || '').toLowerCase();
const loginUserType = localStorage.getItem('userType');
const storedScreens = JSON.parse(localStorage.getItem('screens')) || [];

// Valid screens that control the visibility of the 'inbound' menu
const validScreensForWarehouseMasters = ['customer', 'warehouse', 'bin type'];
const validScreensForInbound = ['pick request', 'grn', 'putaway'];
const validScreensForOutbound = ['buyer order', 'pick request', 'reverse pick', 'sales return', 'delivery challen'];
const validScreensForVas = ['vas pick', 'vas putaway', 'copick', 'coputaway', 'kitting', 'dekitting'];
const validScreensForStockProcess = ['location movement', 'stock restate', 'code conversion', 'cycle count'];
const validScreensForReports = ['stock consolidaton'];

// Check if any valid screen exists in storedScreens
const shouldDisplayInbound = storedScreens.some((screen) => validScreensForInbound.includes(screen.toLowerCase()));
const shouldDisplayOutbound = storedScreens.some((screen) => validScreensForOutbound.includes(screen.toLowerCase()));
const shouldDisplayVas = storedScreens.some((screen) => validScreensForVas.includes(screen.toLowerCase()));
const shouldDisplayStockProcess = storedScreens.some((screen) => validScreensForStockProcess.includes(screen.toLowerCase()));
const shouldDisplayStockReports = storedScreens.some((screen) => validScreensForReports.includes(screen.toLowerCase()));

console.log('loginUserName:', loginUserName); // To check if 'admin' is properly set
console.log('shouldDisplayInbound:', shouldDisplayInbound);
console.log('shouldDisplayStockProcess:', shouldDisplayStockProcess);

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard,
    ...(loginUserType === 'admin' ? [company, basicMasters, warehouseMasters, RolesAndResponsibilities] : []),
    // company,
    // basicMasters,
    // RolesAndResponsibilities,
    // warehouseMasters,
    // outbound,
    // vas,
    ...(loginUserType === 'admin' || shouldDisplayInbound ? [inbound] : []),
    ...(loginUserType === 'admin' || shouldDisplayOutbound ? [outbound] : []),
    ...(loginUserType === 'admin' || shouldDisplayVas ? [vas] : []),
    ...(loginUserType === 'admin' || shouldDisplayStockProcess ? [stockProcess] : []),
    ...(loginUserType === 'admin' || shouldDisplayStockReports ? [Reports] : []),

    UiChangeSamples
  ]
};

export default menuItems;
