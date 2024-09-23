import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import { ArrowDownwardOutlined } from '@mui/icons-material';
import { IconArrowDownToArc } from '@tabler/icons-react';
import apiCalls from 'apicall';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [timeValue, setTimeValue] = useState(true);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [warehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));

  const [monthData, setMonthData] = useState('');
  const [yearData, setYearData] = useState('');

  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  useEffect(() => {
    getInboundMonth();
    getInboundYear();
  }, []);

  const getInboundMonth = async () => {
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getInBoundOrderPerMonth?orgId=${orgId}&branchCode=${branchCode}&warehouse=${warehouse}&client=${client}&finYear=${finYear}`
      );

      if (response.status === true) {
        setMonthData(response.paramObjectsMap.grnVo[0].count);
      } else {
        console.error('Failed to fetch warehouse client data:', response);
      }
    } catch (error) {
      console.error('Error fetching warehouse client data:', error);
    }
  };

  const getInboundYear = async () => {
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getInBoundOrderPerYear?orgId=${orgId}&branchCode=${branchCode}&warehouse=${warehouse}&client=${client}&finYear=${finYear}`
      );

      if (response.status === true) {
        setYearData(response.paramObjectsMap.grnVo[0].count);
      } else {
        console.error('Failed to fetch warehouse client data:', response);
      }
    } catch (error) {
      console.error('Error fetching warehouse client data:', error);
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        color: '#fff',
                        mt: 1
                      }}
                    >
                      <IconArrowDownToArc fontSize="inherit" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Button
                      disableElevation
                      variant={timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, true)}
                    >
                      Month
                    </Button>
                    <Button
                      disableElevation
                      variant={!timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, false)}
                    >
                      Year
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center">
                      <Grid item>
                        {timeValue ? (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{monthData}</Typography>
                        ) : (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{yearData}</Typography>
                        )}
                      </Grid>
                      <Grid item>
                        <Avatar
                          sx={{
                            ...theme.typography.smallAvatar,
                            cursor: 'pointer',
                            backgroundColor: theme.palette.secondary[200],
                            color: theme.palette.secondary.dark
                          }}
                        >
                          <ArrowDownwardOutlined fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                        </Avatar>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#fff'
                          }}
                        >
                          Inbound Order
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
