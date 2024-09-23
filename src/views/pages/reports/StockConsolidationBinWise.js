import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, TextField, Checkbox, FormControlLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { getAllActivePartDetails } from 'utils/CommonFunctions';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import CommonReportTable from 'utils/CommonReportTable';

export const StockConsolidationBinWise = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [partList, setPartList] = useState([]);
  const [binList, setBinList] = useState([]);
  const [formData, setFormData] = useState({
    selectedDate: dayjs(),
    partNo: '',
    bin: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    selectedDate: '',
    partNo: '',
    bin: ''
  });
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const reportColumns = [
    { accessorKey: 'partNo', header: 'Part No', size: 140 },
    { accessorKey: 'partDesc', header: 'Part Description', size: 140 },
    { accessorKey: 'bin', header: 'Bin', size: 140 },
    { accessorKey: 'avlQty', header: 'Avl QTY', size: 140 }
  ];

  useEffect(() => {
    getAllPartNo();
  }, []);

  const getAllPartNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getPartNoForBinWise?branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setPartList(response.paramObjectsMap.stockDetails);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllBin = async (selectedPartNo) => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getBinNoForBinWise?branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&partNo=${selectedPartNo}&warehouse=${loginWarehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setBinList(response.paramObjectsMap.stockDetails);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      selectedDate: dayjs(),
      partNo: '',
      bin: ''
    });
    setFieldErrors({
      selectedDate: '',
      partNo: '',
      bin: ''
    });
    setListView(false);
  };

  const handleSearch = async () => {
    const errors = {};
    if (!formData.partNo) {
      errors.partNo = 'partNo is required';
    }
    if (!formData.bin) {
      errors.bin = 'Bin is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `Reports/getStockReportBinWise?bin=${formData.bin}&branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&partNo=${formData.partNo}&warehouse=${loginWarehouse}`
        );

        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.stockDetails);
          setIsLoading(false);
          setListView(true);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Report Fetch failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Report Fetch failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('DD-MM-YYYY');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  // const handlePartNoChange = (fieldName) => (event, value) => {
  //   if (value) {
  //     // When a part number is selected, update the formData and fetch the corresponding bin list
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [fieldName]: value.partNo,
  //       bin: '' // Clear bin value as a new partNo is selected
  //     }));
  //     getAllBin(value.partNo); // Fetch bins for the selected part number
  //   } else {
  //     // When partNo is cleared, reset both partNo and bin, and clear the binList
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [fieldName]: '', // Clear the partNo field
  //       bin: '' // Clear the bin field as well
  //     }));
  //     setBinList([]); // Clear the binList array
  //   }

  //   setFieldErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [fieldName]: '' // Clear any errors related to partNo
  //   }));
  // };

  const handlePartNoChange = (fieldName) => (event, value) => {
    if (value && typeof value === 'object') {
      const partNo = value.partNo || '';

      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: partNo,
        bin: '' // Clear bin when partNo changes
      }));

      if (partNo && partNo !== 'ALL') {
        getAllBin(partNo); // Fetch bin list for selected part number
      } else {
        setBinList([]); // Clear bin list if 'ALL' or empty
      }
    } else if (value === '' || value === null) {
      // Handle case when input is cleared
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: '',
        bin: ''
      }));
      setBinList([]); // Clear bin list
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '' // Clear errors for partNo
    }));
  };

  const handleBinChange = (fieldName) => (event, value) => {
    if (value) {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: value.Bin
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: ''
      }));
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: ''
    }));
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={handleSearch} isLoading={isLoading} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Effective Date"
                  value={formData.selectedDate ? dayjs(formData.selectedDate, 'DD-MM-YYYY') : null}
                  disabled
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  format="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          {/* <div className="col-md-3 mb-3">
            <Autocomplete
              disablePortal
              options={[{ partNo: 'ALL' }, ...partList]}
              getOptionLabel={(option) => option.partNo}
              sx={{ width: '100%' }}
              size="small"
              value={formData.partNo ? partList.find((p) => p.partNo === formData.partNo) : 'ALL'}
              onChange={(event, newValue) => handlePartNoChange('partNo')(event, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Part No"
                  error={!!fieldErrors.partNo}
                  helperText={fieldErrors.partNo}
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 }
                  }}
                />
              )}
            />
          </div> */}
          <div className="col-md-3 mb-3">
            <Autocomplete
              freeSolo
              disablePortal
              options={partList}
              getOptionLabel={(option) => option.partNo || ''}
              sx={{ width: '100%' }}
              size="small"
              value={partList.find((p) => p.partNo === formData.partNo) || { partNo: 'ALL' }}
              onChange={(event, newValue) => handlePartNoChange('partNo')(event, newValue)}
              onInputChange={(event, newInputValue) => {
                handlePartNoChange('partNo')(event, newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Part No"
                  error={!!fieldErrors.partNo}
                  helperText={fieldErrors.partNo}
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 }
                  }}
                />
              )}
            />
          </div>

          <div className="col-md-3 mb-3">
            <Autocomplete
              disablePortal
              options={binList}
              getOptionLabel={(option) => option.Bin}
              sx={{ width: '100%' }}
              size="small"
              value={formData.bin ? binList.find((p) => p.Bin === formData.bin) : null}
              onChange={(event, newValue) => handleBinChange('bin')(event, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bin"
                  error={!!fieldErrors.bin}
                  helperText={fieldErrors.bin}
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 }
                  }}
                  clearable={true}
                />
              )}
            />
          </div>
        </div>
        {listView && (
          <div className="mt-4">
            <CommonReportTable data={rowData} columns={reportColumns} />
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default StockConsolidationBinWise;
