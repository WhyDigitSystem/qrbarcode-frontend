import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import BuyerOrder from './BuyerOrder';
import PickRequest from './PickRequest';
import ReversePick from './ReversePick';
import SalesReturn from './SalesReturn';
import DeliveryChallen from './DeliveryChallen';
import PendingBuyerOrder from './PendingBuyerOrder';
import PendingPickRequest from './PendingPickRequest';

const OutboundMain = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
            <Tab value={0} label="Buyer Order" />
            <Tab value={1} label="Pick Request" />
            <Tab value={2} label="Reverse Pick" />
            <Tab value={3} label="Sales Return" />
            <Tab value={4} label="Delivery Challan" />
            <Tab value={5} label="Multiple Buyer Order" />
            <Tab value={6} label="Multiple Pick Request" />
          </Tabs>
        </Box>
        <Box sx={{ padding: 2 }}>
          {value === 0 && <BuyerOrder />}
          {value === 1 && <PickRequest />}
          {value === 2 && <ReversePick />}
          {value === 3 && <SalesReturn />}
          {value === 4 && <DeliveryChallen />}
          {value === 5 && <PendingBuyerOrder />}
          {value === 6 && <PendingPickRequest />}
        </Box>
      </div>
    </>
  );
};

export default OutboundMain;
