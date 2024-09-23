import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/system';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

const ModernDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  position: 'relative',
  fontSize: '1.25rem',
  fontWeight: 600
}));

const ModernDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default
}));

const ModernCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8]
  }
}));

const PopularCard = ({ isLoading }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expiryData, setExpiryData] = useState([]);
  const theme = useTheme();

  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [warehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [client, setClient] = useState(localStorage.getItem('client'));

  useEffect(() => {
    getExpiryDetails();
  }, []);

  const getExpiryDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `dashboardController/getExpDetailsForMaterials?orgId=${orgId}&branchCode=${branchCode}&warehouse=${warehouse}&client=${client}`
      );
      if (response.status === true) {
        setExpiryData(response.paramObjectsMap.expDetails.reverse());
      }
    } catch (error) {
      console.error('Error fetching expiry details:', error);
    }
  };

  const handleViewAllClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const getColorByDays = (days) => {
    if (days < 0) return 'error';
    if (days <= 7) return 'warning';
    return 'success';
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <>
          <MainCard content={false}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Expiry Products
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              {expiryData.slice(0, 2).map((item, index) => (
                <Grid container direction="row" alignItems="center" spacing={2} key={index}>
                  <Grid item xs={12}>
                    <Grid container direction="row" alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          {item.partNo} - {item.partDesc}
                        </Typography>
                        <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="body2" color="textSecondary" noWrap>
                              SKU: {item.sku}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body2" color="textSecondary" noWrap>
                              Qty: {item.qty}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sx={{ mb: 1.5 }}>
                        <Chip
                          label={item.days < 0 ? 'Expired' : `${item.days} days left`}
                          color={getColorByDays(item.days)}
                          icon={item.days < 0 ? <ErrorOutlineOutlinedIcon /> : <CalendarTodayOutlinedIcon />}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </CardContent>
            <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
              <Button size="small" disableElevation onClick={handleViewAllClick}>
                View All
                <ChevronRightOutlinedIcon />
              </Button>
            </CardActions>
          </MainCard>

          {/* Modern Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: {
                borderRadius: 3,
                backgroundColor: theme.palette.background.default,
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <ModernDialogTitle>
              Expiry Products
              <IconButton
                aria-label="close"
                onClick={handleDialogClose}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: (theme) => theme.palette.common.white
                }}
              >
                <CloseIcon />
              </IconButton>
            </ModernDialogTitle>

            <ModernDialogContent dividers>
              <Grid container spacing={2}>
                {expiryData.map((item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <ModernCard
                      sx={{
                        padding: '12px', // Reduced padding
                        minHeight: 'auto', // Minimized height
                        borderRadius: 2 // Slightly sharper border
                      }}
                    >
                      <CardContent sx={{ paddingBottom: '4px' }}>
                        {/* Part No and Description */}
                        <Typography variant="h6" gutterBottom noWrap>
                          {item.partNo} - {item.partDesc}
                        </Typography>

                        {/* SKU */}
                        <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="body2" color="textSecondary" noWrap>
                              SKU: {item.sku}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body2" color="textSecondary" noWrap>
                              Qty: {item.qty}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 1 }} />

                        {/* Additional Fields */}
                        <Typography variant="body2" color="textSecondary" noWrap>
                          <strong>GRN No:</strong> {item.grnNo}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          <strong>GRN Date:</strong> {item.grnDate}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          <strong>Batch:</strong> {item.batch}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" noWrap>
                          <strong>Expiry Date:</strong> {dayjs(item.expDate).format('DD-MM-YYYY')}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        {/* Expiry Status */}
                        <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                          <Chip
                            label={item.days < 0 ? 'Expired' : `${item.days} days left`}
                            color={getColorByDays(item.days)}
                            icon={item.days < 0 ? <ErrorOutlineOutlinedIcon /> : <CalendarTodayOutlinedIcon />}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />

                          <Chip
                            label={item.bin}
                            color={getColorByDays(item.days)}
                            // icon={item.days < 0 ? <ErrorOutlineOutlinedIcon /> : <CalendarTodayOutlinedIcon />}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                      </CardContent>
                    </ModernCard>
                  </Grid>
                ))}
              </Grid>
            </ModernDialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleDialogClose} color="primary" variant="contained" sx={{ borderRadius: '20px' }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
