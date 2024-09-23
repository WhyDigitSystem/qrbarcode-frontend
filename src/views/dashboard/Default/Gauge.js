import { Box, Card, Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const GaugeValueRangeNoSnap = ({ isLoading }) => {
  const theme = useTheme();
  const [openCompletedDialog, setOpenCompletedDialog] = useState(false);
  const [openPendingDialog, setOpenPendingDialog] = useState(false);
  const [openCompletedDialogPutaway, setOpenCompletedDialogPutaway] = useState(false);
  const [openPendingDialogPutaway, setOpenPendingDialogPutaway] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [finYear, setFinYear] = useState('2024');
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [pendingGRNData, setPendingGRNData] = useState([]);
  const [completedGRNData, setCompletedGRNData] = useState([]);
  const [pendingPutawayData, setPendingPutawayData] = useState([]);
  const [completedPutawayData, setCompletedPutawayData] = useState([]);
  const [grnChartSeries, setGrnChartSeries] = useState([0, 0]);
  const [putawayChartSeries, setPutawayChartSeries] = useState([0, 0]);

  useEffect(() => {
    getAllGRNData();
    getAllPutawayData();
  }, []);

  useEffect(() => {
    if (completedGRNData.length > 0 || pendingGRNData.length > 0) {
      // Update chart series when the data is ready
      console.log('Completed GRN Data:', completedGRNData); // Add this
      console.log('Pending GRN Data:', pendingGRNData); // Add this
      setGrnChartSeries([completedGRNData.length, pendingGRNData.length]);
    }
  }, [completedGRNData, pendingGRNData]);

  useEffect(() => {
    if (completedPutawayData.length > 0 || pendingPutawayData.length > 0) {
      // Update chart series when the data is ready
      console.log('Completed Putaway Data:', completedPutawayData); // Add this
      console.log('Pending Putaway Data:', pendingPutawayData); // Add this
      setPutawayChartSeries([completedPutawayData.length, pendingPutawayData.length]);
    }
  }, [completedPutawayData, pendingPutawayData]);

  const getAllGRNData = async () => {
    try {
      const response = await apiCalls(
        'get',
        `grn/getGrnStatusForDashBoard?orgId=${orgId}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        const grnData = response.paramObjectsMap.grnDashboard;
        const pendingList = grnData.filter((item) => item.status === 'Pending');
        const completedList = grnData.filter((item) => item.status === 'Complete');

        setPendingGRNData(pendingList);
        setCompletedGRNData(completedList);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const commonChartOptions = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const { dataPointIndex } = config;
          const isCompleted = dataPointIndex === 0;
          const title = isCompleted ? 'Completed Items' : 'Pending Items';
          const data = isCompleted ? completedGRNData : pendingGRNData;

          console.log('DataPointIndex:', dataPointIndex); // Log the index
          console.log('Data selected:', data); // Log selected data

          handleOpenDialog(isCompleted ? 'Completed Items' : 'Pending Items', isCompleted);
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val.toFixed(0)}%`;
      }
    }
  };

  const commonChartOptionsPutaway = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const { dataPointIndex } = config;
          const isCompleted = dataPointIndex === 0;
          const title = isCompleted ? 'Completed Items' : 'Pending Items';
          const data = isCompleted ? completedPutawayData : pendingPutawayData;

          console.log('DataPointIndex:', dataPointIndex); // Log the index
          console.log('Data selected:', data); // Log selected data

          handleOpenDialogPutaway(isCompleted ? 'Completed Items' : 'Pending Items', isCompleted);
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val.toFixed(0)}%`;
      }
    }
  };
  const handleOpenDialog = (title, isCompleted) => {
    setDialogTitle(title);
    if (isCompleted) {
      setOpenCompletedDialog(true);
    } else {
      setOpenPendingDialog(true);
    }
  };

  const handleOpenDialogPutaway = (title, isCompleted) => {
    setDialogTitle(title);
    if (isCompleted) {
      setOpenCompletedDialogPutaway(true);
    } else {
      setOpenPendingDialogPutaway(true);
    }
  };

  const getAllPutawayData = async () => {
    try {
      const response = await apiCalls(
        'get',
        `putaway/getPutawayForDashBoard?orgId=${orgId}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        const putawayData = response.paramObjectsMap.putawayDashboard;
        const pendingList = putawayData.filter((item) => item.status === 'Pending');
        const completedList = putawayData.filter((item) => item.status === 'Complete');

        setPendingPutawayData(pendingList);
        setCompletedPutawayData(completedList);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCloseCompletedDialog = () => {
    setOpenCompletedDialog(false);
    setOpenCompletedDialogPutaway(false);
  };

  const handleClosePendingDialog = () => {
    setOpenPendingDialog(false);
    setOpenPendingDialogPutaway(false);
  };

  const grnChartOptions = {
    ...commonChartOptions,
    labels: ['Completed', 'Pending'],
    colors: ['#6DD5ED', '#2193B0']
  };

  const putawayChartOptions = {
    ...commonChartOptionsPutaway,
    labels: ['Completed', 'Pending'],
    colors: ['#00C49F', '#FFBB28']
  };
  // const putawayChartSeries = [completedPutawayData.length, pendingPutawayData.length];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
      <Card
        sx={{
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: theme.palette.background.paper,
          width: '300px',
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: '600', mb: 1 }}>
          GRN
        </Typography>
        <Box sx={{ width: '100%', height: '100%' }}>
          {grnChartSeries.length > 0 ? (
            <ReactApexChart options={grnChartOptions} series={grnChartSeries} type="pie" height={200} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Card>

      {/* Putaway Chart */}
      <Card
        sx={{
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: theme.palette.background.paper,
          width: '300px',
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: '600', mb: 1 }}>
          Putaway
        </Typography>
        <Box sx={{ width: '100%', height: '100%' }}>
          <ReactApexChart options={putawayChartOptions} series={putawayChartSeries} type="pie" height={200} />
        </Box>
      </Card>

      {/* Completed GRN Dialog */}
      <Dialog open={openCompletedDialog} onClose={handleCloseCompletedDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Completed GRN &nbsp; &nbsp; <Chip label={completedGRNData.length} color={'success'} />
          <IconButton onClick={handleCloseCompletedDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {completedGRNData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Entry No
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Entry Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Status
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedGRNData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.entryNo}</TableCell>
                      <TableCell>{dayjs(item.entryDate).format('DD-MM-YYYY')}</TableCell>
                      <TableCell>
                        <Chip
                          icon={item.status === 'Complete' ? <CheckCircleOutlineIcon /> : <PendingActionsIcon />}
                          label={item.status}
                          color={item.status === 'Complete' ? 'success' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            'No data found!'
          )}
        </DialogContent>
      </Dialog>

      {/* Pending GRN Dialog */}
      <Dialog open={openPendingDialog} onClose={handleClosePendingDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Pending GRN &nbsp; &nbsp; <Chip label={pendingGRNData.length} color={'warning'} />
          <IconButton onClick={handleClosePendingDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Entry No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Entry Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingGRNData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.entryNo}</TableCell>
                    <TableCell>{dayjs(item.entryDate).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>
                      <Chip
                        icon={item.status === 'Complete' ? <CheckCircleOutlineIcon /> : <PendingActionsIcon />}
                        label={item.status}
                        color={item.status === 'Complete' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Completed Putaway Dialog */}
      <Dialog open={openCompletedDialogPutaway} onClose={handleCloseCompletedDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Completed Items
          <IconButton onClick={handleCloseCompletedDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Entry No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Entry Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedPutawayData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.entryNo}</TableCell>
                    <TableCell>{dayjs(item.entryDate).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>
                      <Chip
                        icon={item.status === 'Complete' ? <CheckCircleOutlineIcon /> : <PendingActionsIcon />}
                        label={item.status}
                        color={item.status === 'Complete' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Pending Putaway Dialog */}
      <Dialog open={openPendingDialogPutaway} onClose={handleClosePendingDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Pending Items
          <IconButton onClick={handleClosePendingDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Entry No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Entry Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingPutawayData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.entryNo}</TableCell>
                    <TableCell>{dayjs(item.entryDate).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>
                      <Chip
                        icon={item.status === 'Complete' ? <CheckCircleOutlineIcon /> : <PendingActionsIcon />}
                        label={item.status}
                        color={item.status === 'Complete' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GaugeValueRangeNoSnap;
