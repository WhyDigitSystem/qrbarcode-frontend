import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import { getAllActivePartDetails } from 'utils/CommonFunctions';
import CommonReportTable from 'utils/CommonReportTable';
import { showToast } from 'utils/toast-component';

export const StockLedgerReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [partList, setPartList] = useState([]);

  const [formData, setFormData] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
    partNo: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    startDate: '',
    endDate: '',
    partNo: ''
  });
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const reportColumns = [
    { accessorKey: 'partNo', header: 'Part No', size: 140 },
    { accessorKey: 'partDesc', header: 'Part Desc', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'sourceScreen', header: 'Source Screen', size: 140 },
    { accessorKey: 'oQty', header: 'Opening Qty', size: 140 },
    { accessorKey: 'rQty', header: 'Received Qty', size: 140 },
    { accessorKey: 'dQty', header: 'Dispatch Qty', size: 140 },
    { accessorKey: 'cQty', header: 'Closing Qty', size: 140 }
  ];
  useEffect(() => {
    getAllPartNo();
  }, []);

  const getAllPartNo = async () => {
    try {
      const partData = await getAllActivePartDetails(loginBranchCode, loginClient, orgId);
      console.log('THE PART DATA ARE:', partData);
      const allParts = [{ partno: 'ALL', partDesc: 'All Parts', id: null }, ...partData];

      setPartList(allParts);
    } catch (error) {
      console.error('Error fetching part data:', error);
    }
  };
  const handleInputChange = (fieldName) => (event, value) => {
    if (value) {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: value.partno
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

  const handleDateChange = (field, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleSearch = async () => {
    const errors = {};
    if (!formData.partNo) {
      errors.partNo = 'partNo is required';
    }
    const saveFormData = {
      partNo: formData.partNo,
      startDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DD') : null,
      endDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DD') : null
    };
    console.log('THE SAVE FORM DATA IS:', saveFormData);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `Reports/getStockLedger?branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&endDate=${saveFormData.endDate}&orgId=${orgId}&partNo=${saveFormData.partNo}&startDate=${saveFormData.endDate}&warehouse=${loginWarehouse}`
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

  const handleClear = () => {
    setFormData({
      startDate: dayjs(),
      endDate: dayjs(),
      partNo: ''
    });
    setFieldErrors({
      startDate: '',
      partNo: ''
    });
    setListView(false);
  };

  const handleView = () => {
    setListView(!listView);
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
            <Autocomplete
              disablePortal
              options={partList}
              getOptionLabel={(option) => option.partno}
              sx={{ width: '100%' }}
              size="small"
              value={formData.partNo ? partList.find((p) => p.partno === formData.partNo) : null}
              onChange={handleInputChange('partNo')}
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
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate ? dayjs(formData.startDate, 'YYYY-MM-DD') : null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  format="DD-MM-YYYY"
                  error={fieldErrors.startDate}
                  helperText={fieldErrors.startDate && 'Required'}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled" size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate ? dayjs(formData.endDate, 'YYYY-MM-DD') : null}
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  format="DD-MM-YYYY"
                  disabled
                />
              </LocalizationProvider>
            </FormControl>
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

export default StockLedgerReport;
