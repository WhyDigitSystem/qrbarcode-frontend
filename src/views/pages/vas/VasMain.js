import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import CoPick from './CoPick';
import CoPutaway from './CoPutaway';
import Kitting from './Kitting';
import VasPick from './VasPick';
import VasPutaway from './VasPutaway';
import DeKitting from './DeKitting';

const VasMain = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
            <Tab value={0} label="VAS Pick" />
            <Tab value={1} label="VAS PutAway" />
            <Tab value={2} label="Co-Pick" />
            <Tab value={3} label="Co-PutAway" />
            <Tab value={4} label="Kitting" />
            <Tab value={5} label="De-Kitting" />
          </Tabs>
        </Box>
        <Box sx={{ padding: 2 }}>
          {value === 0 && <VasPick />}
          {value === 1 && <VasPutaway />}
          {value === 2 && <CoPick />}
          {value === 3 && <CoPutaway />}
          {value === 4 && <Kitting />}
          {value === 5 && <DeKitting />}
        </Box>
      </div>
    </>
  );
};

export default VasMain;
