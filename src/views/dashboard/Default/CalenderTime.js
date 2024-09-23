import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const StyledWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: '16px',
  background: 'white',
  //   boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  minWidth: '320px',
  textAlign: 'center',
  //   transition: 'all 0.3s ease-in-out',
  //   '&:hover': {
  //     transform: 'scale(1.02)' // Subtle hover effect
  //   },
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%' // Responsive for mobile
  }
}));

const DateTimeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: theme.spacing(2)
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff8a00, #e52e71)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.2rem', // Slightly larger text
  fontWeight: 700,
  margin: `0 ${theme.spacing(2)}`
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  padding: theme.spacing(1),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' // Hover effect on icons
  }
}));

const WelcomeMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#333'
}));

const CalendarTimeDisplay = () => {
  const [currentDate, setCurrentDate] = useState(dayjs().format('DD/MM/YYYY'));
  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm:ss'));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(dayjs().format('DD-MM-YYYY'));
      setCurrentTime(dayjs().format('HH:mm:ss'));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <StyledWrapper>
      <DateTimeContainer>
        <Box display="flex" alignItems="center">
          <IconBox>
            <CalendarTodayIcon fontSize="medium" style={{ color: '#ff8a00' }} />
          </IconBox>
          <GradientTypography>{currentDate}</GradientTypography>
        </Box>

        <Box display="flex" alignItems="center">
          <IconBox>
            <AccessTimeIcon fontSize="medium" style={{ color: '#e52e71' }} />
          </IconBox>
          <GradientTypography>{currentTime}</GradientTypography>
        </Box>
      </DateTimeContainer>

      <WelcomeMessage>
        Welcome, <span style={{ color: '#e52e71' }}>{localStorage.getItem('userName')}</span>!
      </WelcomeMessage>
    </StyledWrapper>
  );
};

export default CalendarTimeDisplay;
