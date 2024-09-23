import PropTypes from 'prop-types';

// material-ui
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import SwipeUpIcon from '@mui/icons-material/SwipeUp';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const TotalIncomeLightCard1 = ({ isLoading, data, pickRequestData }) => {
  const theme = useTheme();

  const orderCount = data[0]?.orderCount || 0;

  const pickCount = pickRequestData[0]?.orderCount || 0;

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {/* Card 1 - Putaway */}
          <CardWrapper border={false} content={false}>
            <Box sx={{ p: 1.5 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.primary[800],
                      color: '#fff'
                    }}
                  >
                    <ArrowOutwardIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#fff' }}>
                      {orderCount}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#fff',
                        mt: 0.5
                      }}
                    >
                      Per Day Putaway &nbsp; &nbsp;
                    </Typography>
                  }
                />
              </ListItem>
            </Box>
          </CardWrapper>

          {/* Card 2 - Pick Request */}
          <CardWrapper border={false} content={false}>
            <Box sx={{ p: 1.5 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.primary[800],
                      color: '#fff'
                    }}
                  >
                    <SwipeUpIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#fff' }}>
                      {pickCount}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#fff',
                        mt: 0.5
                      }}
                    >
                      Per Day Pick Request
                    </Typography>
                  }
                />
              </ListItem>
            </Box>
          </CardWrapper>
        </Box>
      )}
    </>
  );
};

TotalIncomeLightCard1.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalIncomeLightCard1;
