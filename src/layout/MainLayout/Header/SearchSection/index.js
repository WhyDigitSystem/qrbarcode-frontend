import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material-UI components
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Third-party components
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// Project imports
import Transitions from 'ui-component/extended/Transitions';

// Assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';

// Screens list
const screens = [
  { name: 'Create Company', path: '/companysetup/createcompany' },
  { name: 'Company Setup', path: '/companysetup/companysetup' },
  { name: 'Country', path: '/basicmasters/countrymaster' },
  { name: 'State', path: '/basicmasters/statemaster' },
  { name: 'City', path: '/basicmasters/citymaster' },
  { name: 'Customer', path: '/warehousemasters/customermaster' },
  { name: 'Warehouse', path: '/warehousemasters/warehousemaster' },
  { name: 'Location Type', path: '/warehousemasters/locationtypemaster' },
  { name: 'Warehouse Location', path: '/warehousemasters/warehouselocationmaster' },
  { name: 'Location Mapping', path: '/warehousemasters/locationmappingmaster' },
  { name: 'Cell Type', path: '/warehousemasters/celltypemaster' },
  { name: 'Employee', path: '/warehousemasters/employeemaster' },
  { name: 'User Creation', path: '/warehousemasters/usercreationmaster' },
  { name: 'Item', path: '/warehousemasters/itemmaster' },
  { name: 'Buyer', path: '/warehousemasters/buyermaster' },
  { name: 'Carrier', path: '/warehousemasters/carriermaster' },
  { name: 'Supplier', path: '/warehousemasters/suppliermaster' },
  { name: 'External Data Mismatch', path: '/warehousemasters/externaldatamismatchmaster' },
  { name: 'Material Label Mapping', path: '/warehousemasters/materiallabelmappingmaster' },
  { name: 'Roles and Responsibility Setup', path: '/rolesresponsibility/rolesandresponse' },
  { name: 'Screen Names', path: '/rolesresponsibility/screennames' },
  { name: 'Department', path: '/warehousemasters/departmentmaster' },
  { name: 'Designation', path: '/warehousemasters/designationmaster' },
  { name: 'Group', path: '/warehousemasters/groupmaster' },
  { name: 'Unit', path: '/basicmasters/unitmaster' },
  { name: 'Currency', path: '/basicmasters/currencymaster' },
  { name: 'Region', path: '/basicmasters/regionmaster' },
  { name: 'Document Type', path: '/warehousemasters/documenttype' },
  { name: 'Document Type Mapping', path: '/warehousemasters/documenttypemapping' },
  { name: 'Financial Year', path: '/warehousemasters/finyearmaster' },

  { name: 'Inbound', path: '/inbound/inboundmain' },
  { name: 'Gate Pass In', path: '/inbound/inboundmain' },
  { name: 'GRN', path: '/inbound/inboundmain' },
  { name: 'Putaway', path: '/inbound/inboundmain' },
  { name: 'Outbound', path: '/outbound/outboundmain' },
  { name: 'Buyer Order', path: '/outbound/outboundmain' },
  { name: 'Pick Request', path: '/outbound/outboundmain' },
  { name: 'Reverse Pick', path: '/outbound/outboundmain' },
  { name: 'Sales Return', path: '/outbound/outboundmain' },
  { name: 'Delivery Challan', path: '/outbound/outboundmain' },
  { name: 'Vas', path: '/vas/vasmain' },
  { name: 'Vas Pick', path: '/vas/vasmain' },
  { name: 'Vas Putaway', path: '/vas/vasmain' },
  { name: 'Co-pick', path: '/vas/vasmain' },
  { name: 'Co-putaway', path: '/vas/vasmain' },
  { name: 'Kitting', path: '/vas/vasmain' },
  { name: 'De-Kitting', path: '/vas/vasmain' },
  { name: 'Stock Process', path: '/stock-process/stockprocessmain' },
  { name: 'Location Movement', path: '/stock-process/stockprocessmain' },
  { name: 'Stock Restate', path: '/stock-process/stockprocessmain' },
  { name: 'Code Conversion', path: '/stock-process/stockprocessmain' },
  { name: 'Cycle Count', path: '/stock-process/stockprocessmain' },
  { name: 'Stock Consolidation', path: '/stock-process/stockprocessmain' }
];

// Styled Components
const PopperStyle = styled(Popper)(({ theme }) => ({
  zIndex: 1300, // Higher than default to ensure it overlays other components
  width: '100%',
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  position: 'absolute'
}));

const OutlineInputStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 434,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff'
  }
}));

const HeaderAvatarStyle = styled(Avatar)(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));

const SearchResultsPaper = styled(Paper)(({ theme }) => ({
  maxHeight: 300,
  overflowY: 'auto',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius
}));

// Mobile Search Component
const MobileSearch = ({ value, setValue, popupState }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSearch = (screen) => {
    navigate(screen.path);
    setValue(''); // Clear the search input value
    popupState.close(); // Close the popup after selection
  };

  const filteredScreens = screens.filter((screen) => screen.name.toLowerCase().includes(value.toLowerCase()));

  return (
    <>
      <OutlineInputStyle
        id="input-search-header"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
            <ButtonBase sx={{ borderRadius: '12px', mr: 1 }}>
              <HeaderAvatarStyle variant="rounded">
                <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
              </HeaderAvatarStyle>
            </ButtonBase>
            <ButtonBase sx={{ borderRadius: '12px' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.orange.light,
                  color: theme.palette.orange.dark,
                  '&:hover': {
                    background: theme.palette.orange.dark,
                    color: theme.palette.orange.light
                  }
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'search' }}
      />
      {value && filteredScreens.length > 0 && (
        <SearchResultsPaper>
          <List>
            {filteredScreens.map((screen) => (
              <ListItem key={screen.path} disablePadding>
                <ListItemButton onClick={() => handleSearch(screen)}>
                  <ListItemText primary={screen.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </SearchResultsPaper>
      )}
      {value && filteredScreens.length === 0 && (
        <SearchResultsPaper>
          <List>
            <ListItem>
              <ListItemText primary="No results found" />
            </ListItem>
          </List>
        </SearchResultsPaper>
      )}
    </>
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  popupState: PropTypes.object.isRequired
};

// Desktop Search Component
const DesktopSearch = ({ value, setValue }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSearch = (screen) => {
    navigate(screen.path);
    setValue(''); // Clear the search input value
    window.location.reload(); // Optional: Consider if you really need to reload the page
  };

  const filteredScreens = screens.filter((screen) => screen.name.toLowerCase().includes(value.toLowerCase()));

  return (
    <Box sx={{ position: 'relative' }}>
      <OutlineInputStyle
        id="input-search-header"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
            <ButtonBase sx={{ borderRadius: '12px', mr: 1 }}>
              <HeaderAvatarStyle variant="rounded">
                <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
              </HeaderAvatarStyle>
            </ButtonBase>
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'search' }}
      />
      {value && (
        <SearchResultsPaper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            ml: 2,
            zIndex: 1600
          }}
        >
          <List>
            {filteredScreens.length > 0 ? (
              filteredScreens.map((screen) => (
                <ListItem key={screen.path} disablePadding>
                  <ListItemButton onClick={() => handleSearch(screen)}>
                    <ListItemText primary={screen.name} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
          </List>
        </SearchResultsPaper>
      )}
    </Box>
  );
};

DesktopSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};

// Main SearchSection Component
const SearchSection = () => {
  const [value, setValue] = useState('');
  const theme = useTheme();

  return (
    <>
      {/* Mobile Search */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
        <PopupState variant="popper" popupId="mobile-search-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                  <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition placement="bottom-start">
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card
                      sx={{
                        background: '#fff',
                        [theme.breakpoints.down('sm')]: {
                          border: 0,
                          boxShadow: 'none'
                        },
                        width: '100%'
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item xs>
                            <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>

      {/* Desktop Search */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
        <DesktopSearch value={value} setValue={setValue} />
      </Box>
    </>
  );
};

export default SearchSection;
