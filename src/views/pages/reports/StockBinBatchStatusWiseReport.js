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
import CommonReportTable from 'utils/CommonReportTable';
import { showToast } from 'utils/toast-component';

export const StockBinBatchStatusWiseReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [partList, setPartList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [binList, setBinList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [formData, setFormData] = useState({
    selectedDate: dayjs(),
    partNo: '',
    batch: '',
    bin: '',
    status: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    selectedDate: '',
    partNo: '',
    batch: '',
    bin: '',
    status: ''
  });
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const reportColumns = [
    { accessorKey: 'partNo', header: 'Part No', size: 140 },
    { accessorKey: 'partDesc', header: 'Part Desc', size: 140 },
    { accessorKey: 'avlQty', header: 'QTY', size: 140 }
  ];

  useEffect(() => {
    getPartNoForStockReportBinAndBatchWise();
  }, []);

  const getPartNoForStockReportBinAndBatchWise = async () => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getPartNoForStockReportBinAndBatchWise?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}&customer=${loginCustomer}`
      );
      const partData = response.paramObjectsMap.stockDetails;
      const allParts = [{ partNo: 'ALL', partDesc: 'All Parts', id: null }, ...partData];
      setPartList(allParts);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handlePartNoChange = (event, newValue) => {
    if (newValue && newValue.partNo) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        partNo: newValue.partNo
      }));
      getBatchForStockReportBinAndBatchWise(newValue.partNo);
    }
  };

  const getBatchForStockReportBinAndBatchWise = async (partNo) => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getBatchForStockReportBinAndBatchWise?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}&customer=${loginCustomer}&partNo=${partNo}`
      );
      setBatchList(response.paramObjectsMap.stockDetails);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleBatchNoChange = (event, newValue) => {
    if (newValue && newValue.batch) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        batch: newValue.batch
      }));
      getBinForStockReportBinAndBatchWise(newValue.batch);
    }
  };

  const getBinForStockReportBinAndBatchWise = async (batch) => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getBinForStockReportBinAndBatchWise?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}&customer=${loginCustomer}&partNo=${formData.partNo}&batch=${batch}`
      );
      setBinList(response.paramObjectsMap.stockDetails);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleBinChange = (event, newValue) => {
    if (newValue && newValue.bin) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bin: newValue.bin
      }));
      getStatusForStockReportBinAndBatchWise(newValue.bin);
    }
  };

  const getStatusForStockReportBinAndBatchWise = async (bin) => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getStatusForStockReportBinAndBatchWise?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}&customer=${loginCustomer}&partNo=${formData.partNo}&batch=${formData.batch}&bin=${bin}`
      );
      setStatusList(response.paramObjectsMap.stockDetails);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleStatusChange = (event, newValue) => {
    if (newValue && newValue.status) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        status: newValue.status
      }));
    }
  };

  const handleClear = () => {
    setFormData({
      selectedDate: dayjs(),
      partNo: '',
      batch: '',
      bin: '',
      status: ''
    });
    setFieldErrors({
      selectedDate: '',
      partNo: '',
      batch: '',
      bin: '',
      status: ''
    });
    setBatchList([]);
    setBinList([]);
    setStatusList([]);
    setListView(false);
  };

  const handleSearch = async () => {
    const errors = {};
    if (!formData.partNo) {
      errors.partNo = 'Part No is required';
    }
    if (!formData.batch) {
      errors.batch = 'Batch No is required';
    }
    if (!formData.bin) {
      errors.bin = 'Bin is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `Reports/getStockReportBinAndBatchWise?status=${formData.status}&batch=${formData.batch}&bin=${formData.bin}&branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&partNo=${formData.partNo}&warehouse=${loginWarehouse}`
        );
        if (response.status === true) {
          setRowData(response.paramObjectsMap.stockDetails);
          setIsLoading(false);
          setListView(true);
          setFieldErrors({
            selectedDate: '',
            partNo: '',
            batch: '',
            bin: '',
            status: ''
          });
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
                  slotProps={{
                    textField: { size: 'small', clearable: true }
                  }}
                  format="DD-MM-YYYY"
                  disabled
                />
              </LocalizationProvider>
            </FormControl>
          </div>

          <div className="col-md-3 mb-3">
            <Autocomplete
              disablePortal
              options={partList}
              getOptionLabel={(option) => option.partNo}
              sx={{ width: '100%' }}
              size="small"
              value={formData.partNo ? partList.find((p) => p.partNo === formData.partNo) : null}
              onChange={handlePartNoChange}
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
              options={batchList}
              getOptionLabel={(option) => option.batch}
              sx={{ width: '100%' }}
              size="small"
              value={formData.batch ? batchList.find((p) => p.batch === formData.batch) : null}
              onChange={handleBatchNoChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Batch No"
                  error={!!fieldErrors.batch}
                  helperText={fieldErrors.batch}
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
              getOptionLabel={(option) => option.bin}
              sx={{ width: '100%' }}
              size="small"
              value={formData.bin ? binList.find((p) => p.bin === formData.bin) : null}
              onChange={handleBinChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bin No"
                  error={!!fieldErrors.bin}
                  helperText={fieldErrors.bin}
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
              options={statusList}
              getOptionLabel={(option) => option.status}
              sx={{ width: '100%' }}
              size="small"
              value={formData.status ? statusList.find((p) => p.status === formData.status) : null}
              onChange={handleStatusChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  error={!!fieldErrors.status}
                  helperText={fieldErrors.status}
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 }
                  }}
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

export default StockBinBatchStatusWiseReport;
