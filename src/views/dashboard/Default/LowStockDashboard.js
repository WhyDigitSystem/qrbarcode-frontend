import SearchIcon from '@mui/icons-material/Search'; // Import Search Icon
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

const LowStockDashboard = ({ data }) => {
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1); // Page state
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  const lowStockItems = data;

  // Search functionality with debouncing
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setLoading(true); // Start loading when search term changes
    const delayDebounceFn = setTimeout(() => {
      setLoading(false); // Stop loading after 500ms debounce
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Filter items based on search term
  const filteredItems = lowStockItems.filter(
    (item) =>
      item.partDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage); // Calculate total pages

  // Get the items for the current page
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  return (
    <Card sx={{ p: 3, backgroundColor: '#ffffff' }}>
      {' '}
      {/* Added Card Component */}
      <Grid container alignItems="center" spacing={2}>
        {/* Low Stock Items Heading */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" gutterBottom>
            Low Stock Items
          </Typography>
        </Grid>

        {/* Search Input */}
        <Grid item xs={12} sm={4} alignItems="flex-end" sx={{ marginLeft: '16%' }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            size="small" // Reduce input size
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
      {/* Loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 0.8 }}>
                  <strong>Part Description</strong>
                </TableCell>
                <TableCell sx={{ py: 0.8 }}>
                  <strong>Part No</strong>
                </TableCell>
                <TableCell sx={{ py: 0.8 }}>
                  <strong>SKU</strong>
                </TableCell>
                <TableCell sx={{ py: 0.8 }}>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell sx={{ py: 0.8 }}>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ py: 0.8 }}>{item.partDesc}</TableCell>
                  <TableCell sx={{ py: 0.8 }}>{item.partNo}</TableCell>
                  <TableCell sx={{ py: 0.8 }}>{item.sku}</TableCell>
                  <TableCell sx={{ py: 0.8 }}>
                    <Tooltip title="Quantity in stock">
                      <span>{item.qty}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ py: 0.8 }}>
                    <Tooltip title={item.status === 'Low Qty' ? 'Low Stock Alert' : 'Sufficient Stock'}>
                      {/* <WarningIcon sx={{ color: item.status === 'Low Qty' ? 'warning.main' : 'grey.600' }} /> */}
                      <Chip label="Low Stock" variant="filled" color="warning" sx={{ font: 10 }} />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Pagination Component */}
      {currentItems.length > 3 ? (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" size="large" />
        </Box>
      ) : (
        ''
      )}
    </Card>
  );
};

export default LowStockDashboard;
