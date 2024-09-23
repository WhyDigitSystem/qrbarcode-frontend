import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

// project imports
import apiCalls from 'apicall';
import { gridSpacing } from 'store/constant';
import CalendarTimeComponent from './CalenderTime';
import EarningCard from './EarningCard';
import GaugeValueRangeNoSnap from './Gauge';
import GaugeValueRangeNoSnapOut from './GaugeOut';
import HoldMeterial from './HoldMeterial';
import LowStockDashboard from './LowStockDashboard';
import PopularCard from './PopularCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard1 from './TotalIncomeLightCard1';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [finYear, setFinYear] = useState('2024');
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [lowStockData, setLowStockData] = useState([]);
  const [putAwayData, setPutAwayData] = useState([]);
  const [pickRequestData, setPickRequestData] = useState([]);

  useEffect(() => {
    setLoading(false);
    getAllLowStockData();
    getPerDayPutAwayCount();
    getPerDayPickRequestCount();
  }, []);

  const getAllLowStockData = async () => {
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getStockLowVolume?orgId=${orgId}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        const grnData = response.paramObjectsMap.putawayDashboard;
        setLowStockData(grnData);
        console.log('Data ====>:', response.paramObjectsMap.putawayDashboard);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPerDayPutAwayCount = async () => {
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getPutAwayOrderPerDay?orgId=${orgId}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        const grnData = response.paramObjectsMap.putAwayOrderPerDay;
        setPutAwayData(grnData);
        console.log('Data ====>:', response.paramObjectsMap.putAwayOrderPerDay);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPerDayPickRequestCount = async () => {
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getPickRequestOrderPerDay?orgId=${orgId}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        const grnData = response.paramObjectsMap.pickRequestOrderPerDay;
        setPickRequestData(grnData);
        console.log('Data ====>:', response.paramObjectsMap.pickRequestOrderPerDay);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>

          <Grid item sm={12} xs={12} md={6} lg={4}>
            <TotalIncomeDarkCard isLoading={isLoading} />
          </Grid>
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={7} md={8} sm={8} xs={12}>
            {/* <EarningCard isLoading={isLoading} /> */}
            <GaugeValueRangeNoSnap />
          </Grid>
          <Grid item sm={5} xs={12} md={4} lg={5}>
            {/* <TotalIncomeLightCard isLoading={isLoading} /> */}
            <Box>
              {' '}
              <CalendarTimeComponent />{' '}
            </Box>
            <Box sx={{ mt: 2 }}>
              {' '}
              <TotalIncomeLightCard1 isLoading={isLoading} data={putAwayData} pickRequestData={pickRequestData} />
            </Box>

            {/* <div style={{ marginTop: '7px' }}>
              {' '}

              
             
              <TotalIncomeLightCard1 isLoading={isLoading} />
            </div> */}
            {/* <TotalIncomeLightCard isLoading={isLoading} /> */}
          </Grid>
          {/* <Grid item sm={5} xs={12} md={4} lg={4}>
            <TotalIncomeLightCard isLoading={isLoading} />
          </Grid> */}
          {/* <Grid item lg={2} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid> */}
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* <Grid item lg={7} md={8} sm={8} xs={12}>
            <EarningCard isLoading={isLoading} /> <GaugeValueRangeNoSnapOut />
          </Grid> */}
          <Grid item lg={7} md={8} sm={8} xs={12}>
            {/* <EarningCard isLoading={isLoading} /> */}
            <GaugeValueRangeNoSnapOut isLoading={isLoading} />
          </Grid>
          <Grid item sm={5} xs={12} md={4} lg={5}>
            {/* <TotalIncomeLightCard1 isLoading={isLoading} data={putAwayData} pickRequestData={pickRequestData} /> */}
            <HoldMeterial isLoading={isLoading} />
            {/* <PutAwayOrderDashboard data={putAwayData} /> */}
            {/* <div style={{ marginTop: '7px' }}>
              {' '}
             
              <TotalIncomeLightCard1 isLoading={isLoading} />
            </div> */}
            {/* <TotalIncomeLightCard isLoading={isLoading} /> */}
          </Grid>
          {/* <Grid item sm={6} xs={12} md={6} lg={5}>
            <TotalIncomeDarkCard isLoading={isLoading} />
          </Grid> */}
          {/* <Grid item lg={2} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid> */}
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
            {lowStockData.length > 0 ? <LowStockDashboard data={lowStockData} /> : ''}
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
