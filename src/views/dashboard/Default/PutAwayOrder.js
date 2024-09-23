import { Box, Card, CardContent, Typography } from '@mui/material';

const PutAwayOrderDashboard = ({ data }) => {
  // Extracting the order count from the API response
  const orderCount = data[0]?.orderCount || 0;
  const orderDate = data[0]?.orderDate || '';

  return (
    <Box sx={{ maxWidth: 300, mx: 'auto', mt: 3 }}>
      <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Put Away Orders
          </Typography>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
            {orderCount}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Orders as of {orderDate}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PutAwayOrderDashboard;
