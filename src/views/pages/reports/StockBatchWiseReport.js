import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ActionButton from 'utils/ActionButton';
import CommonReportTable from 'utils/CommonReportTable';
import { showToast } from 'utils/toast-component';

export const StockBatchWiseReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [partList, setPartList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  //   const [formData, setFormData] = useState({
  //     selectedDate: null,
  //     partNo: ''
  //   });
  const [formData, setFormData] = useState({
    // selectedDate: dayjs(),
    partNo: '',
    batch: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    // selectedDate: '',
    partNo: '',
    batch: ''
  });
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const reportColumns = [
    { accessorKey: 'partNo', header: 'Part No', size: 140 },
    { accessorKey: 'partDesc', header: 'Part Desc', size: 140 },
    { accessorKey: 'batch', header: 'Batch No', size: 140 },
    { accessorKey: 'avlQty', header: 'QTY', size: 140 }
  ];

  useEffect(() => {
    getAllPartNo();
  }, []);
  const getAllBatch = async (selectedPartNo) => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getBatchForBatchWiseReport?branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&partNo=${selectedPartNo}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        //
        console.log(response.paramObjectsMap.stockDetails);
        setBatchList(response.paramObjectsMap.stockDetails);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllPartNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `Reports/getPartNoForBatchWiseReport?branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        const partData = response.paramObjectsMap.stockDetails;
        const allParts = [{ partNo: 'ALL', partDesc: 'All Parts', id: null }, ...partData];
        setPartList(allParts);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      partNo: '',
      batch: ''
    });
    setFieldErrors({
      partNo: '',
      batch: ''
    });
    setListView(false);
  };

  const handleSearch = async () => {
    const errors = {};
    if (!formData.batch) {
      errors.batch = 'batchNo is required';
    }
    if (!formData.partNo) {
      errors.partNo = 'partNo is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiCalls(
          'get',
          `Reports/getStockReportBatchWise?batch=${formData.batch}&branchCode=${loginBranchCode}&client=${loginClient}&customer=${loginCustomer}&orgId=${orgId}&partNo=${formData.partNo}&warehouse=${loginWarehouse}`
        );
        if (response.status === true) {
          console.log('Response:', response);
          setRowData(response.paramObjectsMap.stockDetails);
          setIsLoading(false);
          setListView(true);
        } else {
          showToast('error', response.paramObjectsMap.message || 'Report Fetch failed');
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

  // const handleDateChange = (field, date) => {
  //   const formattedDate = dayjs(date).format('DD-MM-YYYY');
  //   setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  // };

  const handleBatchNoChange = (fieldName) => (event, value) => {
    if (value) {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: value.batch
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

  const handlePartNoChange = (fieldName) => (event, value) => {
    if (value) {
      console.log('valueworking');
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: value.partNo
      }));
      getAllBatch(value.partNo);
    } else {
      console.log('valuenotworking');
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
            <Autocomplete
              disablePortal
              options={partList}
              getOptionLabel={(option) => option.partNo}
              sx={{ width: '100%' }}
              size="small"
              value={formData.partNo ? partList.find((p) => p.partNo === formData.partNo) : null}
              onChange={handlePartNoChange('partNo')}
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
              onChange={handleBatchNoChange('batch')}
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

export default StockBatchWiseReport;
