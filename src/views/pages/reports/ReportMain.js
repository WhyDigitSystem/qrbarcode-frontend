import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import StockConsolidation from './StockConsolidation';
import StockConsolidationBinWise from './StockConsolidationBinWise';
import StockLedgerReport from './StockLedgerReport';
import { StockBatchWiseReport } from './StockBatchWiseReport';
import StockBinBatchStatusWiseReport from './StockBinBatchStatusWiseReport';

const ReportMain = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
            <Tab value={0} label="Stock Consolidation" />
            <Tab value={1} label="Stock Consolidation BinWise" />
            <Tab value={2} label="Stock Ledger Report" />
            <Tab value={3} label="Stock Batch Wise Report" />
            <Tab value={4} label="Stock Bin Batch Status Wise Report" />
          </Tabs>
        </Box>
        <Box sx={{ padding: 2 }}>
          {value === 0 && <StockConsolidation />}
          {value === 1 && <StockConsolidationBinWise />}
          {value === 2 && <StockLedgerReport />}
          {value === 3 && <StockBatchWiseReport />}
          {value === 4 && <StockBinBatchStatusWiseReport />}
        </Box>
      </div>
    </>
  );
};

export default ReportMain;
