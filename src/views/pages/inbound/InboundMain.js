import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import GatePassIn from './GatePassIn';
import Grn from './Grn';
import Putaway from './Putaway';

const InboundMain = () => {
  const [value, setValue] = useState(0);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const loginUserType = localStorage.getItem('userType');
  const allowedScreens = JSON.parse(localStorage.getItem('screens')) || [];

  useEffect(() => {
    if (loginUserType !== 'admin') {
      if (allowedScreens.includes('grn') && !allowedScreens.includes('putaway')) {
        setValue(1);
      } else if (allowedScreens.includes('putaway') && !allowedScreens.includes('grn')) {
        setValue(2);
      } else if (allowedScreens.includes('putaway') && allowedScreens.includes('grn')) {
        setValue(1);
      } else setValue(0);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
      <Box sx={{ width: '100%' }}>
        {loginUserType === 'admin' ? (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value={0} label="Gate Pass In" />
              <Tab value={1} label="GRN" />
              <Tab value={2} label="Put Away" />
            </Tabs>
          </>
        ) : (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              {allowedScreens.includes('gatepassin') && <Tab value={0} label="Gate Pass In" />}
              {allowedScreens.includes('grn') && <Tab value={1} label="GRN" />}
              {allowedScreens.includes('putaway') && <Tab value={2} label="Put Away" />}
            </Tabs>
          </>
        )}
      </Box>
      <Box sx={{ padding: 2 }}>
        {value === 0 && <GatePassIn />}
        {value === 1 && <Grn />}
        {value === 2 && <Putaway />}
      </Box>
    </div>
  );
};

export default InboundMain;
