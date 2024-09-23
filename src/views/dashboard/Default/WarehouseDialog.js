import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory'; // Example icon for Part No.
import { Box, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Popover, Typography } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';

const WarehouseDialog = ({ open, onClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null);
  const [warehouseData, setWarehouseData] = useState([]);
  const [warehouseClientData, setWarehouseClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBin, setSelectedBin] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [warehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [client, setClient] = useState(localStorage.getItem('client'));

  // Fetch the warehouse data when dialog opens
  useEffect(() => {
    if (open) {
      const fetchWarehouseData = async () => {
        setLoading(true);
        try {
          const response = await apiCalls(
            'get',
            `dashboardController/getStorageDetails?orgId=${orgId}&branchCode=${branchCode}&warehouse=${warehouse}`
          );
          if (response.status === true) {
            setWarehouseData(response.paramObjectsMap.storageDetails);
          } else {
            console.error('Failed to fetch warehouse data:', response);
          }
        } catch (error) {
          console.error('Error fetching warehouse data:', error);
        } finally {
          setLoading(false);
        }
      };

      const fetchWarehouseDataForClient = async () => {
        setLoading(true);
        try {
          const response = await apiCalls(
            'get',
            `dashboardController/getBinDetailsForClientWise?orgId=${orgId}&branchCode=${branchCode}&warehouse=${warehouse}&client=${client}`
          );
          if (response.status === true) {
            setWarehouseClientData(response.paramObjectsMap.binDetails);
          } else {
            console.error('Failed to fetch warehouse client data:', response);
          }
        } catch (error) {
          console.error('Error fetching warehouse client data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchWarehouseData();
      fetchWarehouseDataForClient();
    }
  }, [open, orgId, branchCode, warehouse, client]);

  const getBinDetail = async (bin) => {
    // setLoading(true);
    setSelectedBin(bin);
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getBinDetails?orgId=${orgId}&branchCode=${branchCode}&warehouse=${warehouse}&client=${client}&bin=${bin}`
      );

      if (response.status === true) {
        setPopoverData(response.paramObjectsMap.binDetails);
      } else {
        console.error('Failed to fetch warehouse client data:', response);
      }
    } catch (error) {
      console.error('Error fetching warehouse client data:', error);
    } finally {
      // setLoading(false);
    }
  };

  // Find common bins between warehouseData and warehouseClientData
  const getCommonBins = () => {
    // Create a Set of bins from warehouseData
    const warehouseBins = new Set(warehouseData.map((location) => location.bin));

    // Create a Set of bins from warehouseClientData
    const clientBins = new Set(warehouseClientData.map((location) => location.bin));

    // Filter common bins and map them to include binStatus
    const commonBinsWithStatus = [...warehouseClientData]
      .filter((location) => warehouseBins.has(location.bin)) // Check if the bin is in warehouseData
      .map((location) => ({
        bin: location.bin,
        binStatus: location.binStatus // Include binStatus in the returned object
      }));

    return commonBinsWithStatus;
  };

  const commonBins = getCommonBins();

  const getColorByAvailability = (bin) => {
    const commonBin = commonBins.find((item) => item.bin === bin);
    console.log('getColour ==>', commonBin);
    if (commonBin) {
      return commonBin.binStatus === 'Occupied' ? 'orange' : 'green'; // Set colors based on binStatus
    }
    return 'grey'; // Default color for bins not in commonBins
  };

  const handleClick = (event, location) => {
    setAnchorEl(event.currentTarget);
    getBinDetail(location);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPopoverData(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? 'simple-popover' : undefined;

  // Group warehouse data by levels (A, B, C)
  const groupByLevel = (data) => {
    return data.reduce((acc, location) => {
      const { level } = location;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(location);
      return acc;
    }, {});
  };

  const groupedData = groupByLevel(warehouseData); // Group the warehouse data by level

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <Grid container alignItems="center" justifyContent="space-between">
            {/* Left side: Title */}
            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Warehouse Location
              </Typography>
            </Grid>

            {/* Middle: Bin Legend (aligned to the left side) */}
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 0 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Box
                      sx={{
                        display: 'flex', // Align items horizontally
                        alignItems: 'center' // Vertically center the box and text
                      }}
                    >
                      {/* Color box */}
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: '#ffa500',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          mr: 1 // Add some space between the box and text
                        }}
                      />
                      <Typography variant="body2">{client}'s Occupied Bin</Typography>
                    </Box>
                  </Grid>

                  <Grid item>
                    <Box
                      sx={{
                        display: 'flex', // Align items horizontally
                        alignItems: 'center' // Vertically center the box and text
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: 'green',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" align="center">
                        Empty
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item>
                    <Box
                      sx={{
                        display: 'flex', // Align items horizontally
                        alignItems: 'center' // Vertically center the box and text
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: 'grey',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" align="center">
                        Others
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right side: Close Button */}
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <Grid container spacing={2} justifyContent="center">
                {/* Sort the levels: single-character levels first, multi-character levels last */}
                {Object.keys(groupedData)
                  .sort((a, b) => {
                    if (a.length === 1 && b.length !== 1) return -1; // Single-character first
                    if (a.length !== 1 && b.length === 1) return 1; // Multi-character last
                    return 0; // No change for same type (e.g., A and B stay in order)
                  })
                  .map((level) => (
                    <Grid item xs={12} key={level}>
                      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 1 }}>
                        Level {level}
                      </Typography>
                      <Grid container justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                        {groupedData[level].map((location, index) => (
                          <Grid
                            item
                            key={index}
                            style={{
                              width: '65px', // Reduced to seat size
                              height: '40px',
                              backgroundColor: getColorByAvailability(location.bin),
                              border: '1px solid #ccc', // Border for seat-like effect
                              borderRadius: '8px', // Rounded corners like a seat
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              color: 'white',
                              cursor: 'pointer',
                              padding: '5px',
                              transition: '0.3s', // Smooth transitions
                              margin: '4px' // Adds space between "seats"
                            }}
                            onClick={(event) => handleClick(event, location.bin)}
                            onMouseEnter={(e) => (e.target.style.borderColor = 'black')} // Hover effect
                            onMouseLeave={(e) => (e.target.style.borderColor = '#ccc')}
                          >
                            {location.bin}
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {popoverData && popoverData.length > 0 ? (
          <Box sx={{ p: 0.5, maxWidth: 300 }}>
            {popoverData.map((data, index) => (
              <Card>
                <CardContent sx={{ padding: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <InventoryIcon color="secondary" />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" component="div">
                        Part No: {data.partNo || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.partDesc || 'No description available'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      <strong>Location:</strong> {selectedBin || 'N/A'}
                    </Typography>
                    <Typography variant="subtitle2">
                      <strong>Available Qty:</strong> {data.avilQty || '0'}
                    </Typography>
                    <Typography variant="subtitle2">
                      <strong>Status:</strong> {data.status || ''}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography>No data available for this bin.</Typography>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default WarehouseDialog;
