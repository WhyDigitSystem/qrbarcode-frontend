// import PropTypes from 'prop-types';

// // material-ui
// import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
// import { styled, useTheme } from '@mui/material/styles';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// // assets
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import InventoryIcon from '@mui/icons-material/Inventory';

// // styles
// const CardWrapper = styled(MainCard)(({ theme }) => ({
//   overflow: 'hidden',
//   position: 'relative',
//   '&:after': {
//     content: '""',
//     position: 'absolute',
//     width: 210,
//     height: 210,
//     background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
//     borderRadius: '50%',
//     top: -30,
//     right: -180
//   },
//   '&:before': {
//     content: '""',
//     position: 'absolute',
//     width: 210,
//     height: 210,
//     background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
//     borderRadius: '50%',
//     top: -160,
//     right: -130
//   }
// }));

// const StockVolumeCard = () => {
//   const theme = useTheme();

//   return (
//     <CardWrapper border={false} content={false}>
//       <Box sx={{ p: 1.5 }}>
//         <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
//           <ListItemAvatar>
//             <Avatar
//               variant="rounded"
//               sx={{
//                 ...theme.typography.commonAvatar,
//                 ...theme.typography.largeAvatar,
//                 backgroundColor: theme.palette.warning.light,
//                 color: theme.palette.warning.dark
//               }}
//             >
//               <InventoryIcon fontSize="inherit" />
//             </Avatar>
//           </ListItemAvatar>
//           <ListItemText
//             sx={{
//               py: 0,
//               mt: 0.45,
//               mb: 0.45
//             }}
//             primary={<Typography variant="h4">1200</Typography>}
//             secondary={
//               <Typography
//                 variant="subtitle2"
//                 sx={{
//                   color: theme.palette.grey[500],
//                   mt: 0.5
//                 }}
//               >
//                 Total Stock Volume
//               </Typography>
//             }
//           />
//         </ListItem>
//       </Box>
//     </CardWrapper>
//   );
// };

// const StockAmountCard = () => {
//   const theme = useTheme();

//   return (
//     <CardWrapper border={false} content={false}>
//       <Box sx={{ p: 1.5 }}>
//         <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
//           <ListItemAvatar>
//             <Avatar
//               variant="rounded"
//               sx={{
//                 ...theme.typography.commonAvatar,
//                 ...theme.typography.largeAvatar,
//                 backgroundColor: theme.palette.warning.light,
//                 color: theme.palette.warning.dark
//               }}
//             >
//               <CurrencyRupeeIcon fontSize="inherit" />
//             </Avatar>
//           </ListItemAvatar>
//           <ListItemText
//             sx={{
//               py: 0,
//               mt: 0.45,
//               mb: 0.45
//             }}
//             primary={<Typography variant="h4">1200</Typography>}
//             secondary={
//               <Typography
//                 variant="subtitle2"
//                 sx={{
//                   color: theme.palette.grey[500],
//                   mt: 0.5
//                 }}
//               >
//                 Total Stock Amount
//               </Typography>
//             }
//           />
//         </ListItem>
//       </Box>
//     </CardWrapper>
//   );
// };

// // ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

// const TotalIncomeLightCard = ({ isLoading }) => {
//   return (
//     <>
//       {isLoading ? (
//         <TotalIncomeCard />
//       ) : (
//         <Stack direction="row" spacing={2}>
//           <StockVolumeCard />
//           <StockAmountCard />
//         </Stack>
//       )}
//     </>
//   );
// };

// TotalIncomeLightCard.propTypes = {
//   isLoading: PropTypes.bool
// };

// export default TotalIncomeLightCard;

import { Box, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// styles
const CardWrapper = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: theme.palette.background.paper,
  padding: '8px',
  // boxShadow: theme.shadows[2],
  width: '90%',
  height: '50%'
  // maxWidth: '210px'
}));

// Stock Volume Gauge Chart
const StockVolumeCard = () => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -10
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%'
        },
        dataLabels: {
          showOn: 'always',
          name: {
            show: true,
            fontSize: '14px',
            color: theme.palette.text.secondary
          },
          value: {
            fontSize: '18px',
            show: true,
            formatter: (val) => `${val}%`
          }
        }
      }
    },
    labels: ['Stock Volume'],
    colors: [theme.palette.primary.main]
  };

  const chartSeries = [70]; // Example value for stock volume

  return (
    <CardWrapper>
      <ListItem alignItems="center" disableGutters>
        {/* <ListItemAvatar>
          <Avatar
            variant="rounded"
            sx={{
              backgroundColor: theme.palette.warning.light,
              color: theme.palette.warning.dark
            }}
          >
            <InventoryIcon fontSize="inherit" />
          </Avatar>
        </ListItemAvatar> */}
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600, textAlign: 'center' }}>
              Total Stock Volume
            </Typography>
          }
          // secondary={
          //   <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
          //     Total Stock Volume
          //   </Typography>
          // }
        />
      </ListItem>
      <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height={200} />
    </CardWrapper>
  );
};

// Stock Amount Gauge Chart
const StockAmountCard = () => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -10
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%'
        },
        dataLabels: {
          showOn: 'always',
          name: {
            show: true,
            fontSize: '14px',
            color: theme.palette.text.secondary
          },
          value: {
            fontSize: '18px',
            show: true,
            formatter: (val) => `${val}%`
          }
        }
      }
    },
    labels: ['Stock Amount'],
    colors: [theme.palette.primary.main]
  };

  const chartSeries = [85]; // Example value for stock amount

  return (
    <CardWrapper>
      <ListItem alignItems="center" disableGutters>
        {/* <ListItemAvatar>
          <Avatar
            variant="rounded"
            sx={{
              backgroundColor: theme.palette.warning.light,
              color: theme.palette.warning.dark
            }}
          >
            <CurrencyRupeeIcon fontSize="inherit" />
          </Avatar>
        </ListItemAvatar> */}
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600, textAlign: 'center' }}>
              Total Stock Amount
            </Typography>
          }
          // secondary={
          //   <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
          //     Total Stock Amount
          //   </Typography>
          // }
        />
      </ListItem>
      <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height={200} />
    </CardWrapper>
  );
};

// Main component
const TotalIncomeLightCard = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <Stack direction="row" spacing={2}>
          <StockVolumeCard />
          <StockAmountCard />
        </Stack>
      )}
    </>
  );
};

TotalIncomeLightCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalIncomeLightCard;
