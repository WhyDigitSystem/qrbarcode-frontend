import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveLocationTypes } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import GeneratePdfVasPickpdf from './VasPickpdf';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const VasPick = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginUserId, setLoginUserId] = useState(localStorage.getItem('userId'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [loginFinYear, setLoginFinYear] = useState(localStorage.getItem('finYear'));
  const [pickBinTypeList, setPickBinTypeList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    pickBinType: '',
    stockState: '',
    stockStateFlag: '',
    status: '',
    totalOrderQty: '',
    totalPickedQty: '',
    freeze: false
  });
  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: dayjs(),
    pickBinType: '',
    stockStateFlag: '',
    stockState: '',
    status: '',
    totalOrderQty: '',
    totalPickedQty: ''
  });
  const [vasPickGridTableData, setVasPickGridTableData] = useState([]);
  const [vasPickGridTableErrors, setVasPickGridTableErrors] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      sku: '',
      bin: '',
      batchNo: '',
      batchDate: null,
      grnNo: '',
      grnDate: null,
      avlQty: '',
      pickQty: '',
      remainingQty: ''
    }
  ]);
  const [modalTableData, setModalTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      sku: '',
      grnNo: '',
      grnDate: null,
      batchNo: '',
      batchDate: null,
      bin: '',
      binType: '',
      binClass: '',
      core: '',
      cellType: '',
      expDate: null,
      avlQty: '',
      pickQty: '',
      qcFlag: '',
      status: ''
    }
  ]);
  const [value, setValue] = useState(0);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'VAS Pick ID', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'picBin', header: 'Picked Bin', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 140 },
    { accessorKey: 'pickedQty', header: 'Picked QTY', size: 140 }
  ];

  useEffect(() => {
    getNewVasPickDocId();
    getAllPickBinType();
    getAllVasPick();
  }, []);

  useEffect(() => {
    const totalQty = vasPickGridTableData.reduce((sum, row) => sum + (parseInt(row.pickQty, 10) || 0), 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalPickedQty: totalQty
    }));
  }, [vasPickGridTableData]);

  const getNewVasPickDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasPick/getVasPickDocId?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.VasPickDocId
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getFillGridDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasPick/getVasPicGridDetails?bintype=${formData.pickBinType}&branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&stateStatus=${formData.stockStateFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE VAS PICK GRID DETAILS IS:', response);
      if (response.status === true) {
        const gridDetails = response.paramObjectsMap.vaspickGrid;
        console.log('THE MODAL TABLE DATA FROM API ARE:', gridDetails);

        setModalTableData(
          gridDetails.map((row) => ({
            id: row.id,
            partNo: row.partNo,
            partDesc: row.partDesc,
            sku: row.sku,
            grnNo: row.grnNo,
            grnDate: row.grnDate,
            batchNo: row.batch,
            batchDate: row.batchDate,
            bin: row.bin,
            binType: row.binType,
            binClass: row.binClass,
            core: row.core,
            expDate: row.expDate,
            avlQty: row.avalQty,
            pickQty: row.pickQty,
            qcFlag: row.qcFlag,
            cellType: row.cellType,
            status: row.status
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getAllPickBinType = async () => {
    try {
      const activeBinData = await getAllActiveLocationTypes(orgId);
      setPickBinTypeList(activeBinData);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const getAllVasPick = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasPick/getAllVaspick?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      setListViewData(response.paramObjectsMap.vasPickVO);
    } catch (error) {
      console.error('Error fetching GRN data:', error);
    }
  };

  const getVasPickById = async (row) => {
    console.log('THE SELECTED GRN ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `vasPick/getVaspickById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularVasPick = response.paramObjectsMap.vasPickVO;
        setFormData({
          docId: particularVasPick.docId,
          docDate: particularVasPick.docDate,
          pickBinType: particularVasPick.picBin,
          stockState: particularVasPick.stockState,
          stockStateFlag: particularVasPick.stateStatus,
          status: particularVasPick.status,
          freeze: particularVasPick.freeze
        });
        setVasPickGridTableData(
          particularVasPick.vasPickDetailsVO.map((row) => ({
            id: row.id,
            partNo: row.partNo,
            partDesc: row.partDescription,
            sku: row.sku,
            avlQty: row.avlQty,
            batchNo: row.batchNo,
            batchDate: row.batchDate,
            grnNo: row.grnNo,
            grnDate: row.grnDate,
            bin: row.bin,
            binType: row.binType,
            binClass: row.binClass,
            core: row.core,
            expDate: row.expDate,
            qcFlag: row.qcFlag,
            pickQty: row.picQty,
            cellType: row.cellType,
            remainingQty: row.remaningQty
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, checked } = e.target;

  //   const nameRegex = /^[A-Za-z ]*$/;
  //   const alphaNumericRegex = /^[A-Za-z0-9]*$/;
  //   const numericRegex = /^[0-9]*$/;

  //   let errorMessage = '';

  //   switch (name) {
  //     case 'docCode':
  //       if (!alphaNumericRegex.test(value)) {
  //         errorMessage = 'Only alphanumeric characters are allowed';
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   } else {
  //     if (name === 'stockState') {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         stockState: value,
  //         stockStateFlag: (value === 'READY TO DISPATCH' && 'R') || (value === 'HOLD' && 'H') || ''
  //       }));
  //     } else if (name === 'status') {
  //       setFormData((prevData) => ({ ...prevData, [name]: value }));
  //     } else {
  //       setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
  //     }

  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd } = e.target;

    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;

    let errorMessage = '';

    switch (name) {
      case 'docCode':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'stockState') {
        setFormData((prevData) => ({
          ...prevData,
          stockState: value,
          stockStateFlag: (value === 'READY TO DISPATCH' && 'R') || (value === 'HOLD' && 'H') || ''
        }));
      } else if (name === 'status') {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
      }

      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Restore cursor position after state update
      setTimeout(() => {
        const inputElement = document.querySelector(`[name=${name}]`);
        if (inputElement) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleClear = () => {
    setFormData({
      docId: '',
      docDate: dayjs(),
      pickBinType: '',
      stockState: '',
      status: '',
      totalOrderQty: '',
      totalPickedQty: '',
      freeze: false
    });
    setFieldErrors({
      docId: '',
      docDate: '',
      pickBinType: '',
      stockState: '',
      status: '',
      totalOrderQty: '',
      totalPickedQty: ''
    });
    getNewVasPickDocId();
    setEditId('');
    setVasPickGridTableData([]);
    setVasPickGridTableErrors('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.pickBinType) errors.pickBinType = 'Pick Bin Type is required';
    if (!formData.stockState) errors.stockState = 'Stock State is required';
    if (!formData.status) errors.status = 'Status is required';

    let vasPickGridTableDataValid = true;
    if (!vasPickGridTableData || !Array.isArray(vasPickGridTableData) || vasPickGridTableData.length === 0) {
      vasPickGridTableDataValid = false;
      setVasPickGridTableErrors([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = vasPickGridTableData.map((row, index) => {
        const rowErrors = {};

        if (!row.partNo) rowErrors.partNo = 'Part No is required';

        if (!row.pickQty) rowErrors.pickQty = 'Pick QTY is required';

        if (Object.keys(rowErrors).length > 0) vasPickGridTableDataValid = false;

        return rowErrors;
      });

      setVasPickGridTableErrors(newTableErrors);
      setFieldErrors(errors);
    }

    if (Object.keys(errors).length === 0 && vasPickGridTableDataValid) {
      setIsLoading(true);
      const gridVo = vasPickGridTableData.map((row) => ({
        ...(editId && { id: row.id }),
        partNo: row.partNo,
        partDescription: row.partDesc,
        sku: row.sku,
        avlQty: row.avlQty,
        batchNo: row.batchNo,
        batchDate: row.batchDate,
        grnNo: row.grnNo,
        grnDate: row.grnDate,
        bin: row.bin,
        binType: row.binType,
        binClass: row.binClass,
        core: row.core,
        expDate: row.expDate,
        qcflag: row.qcFlag,
        picQty: row.pickQty,
        cellType: row.cellType,
        remainingQty: 0
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        picBin: formData.pickBinType,
        stockState: formData.stockState,
        stateStatus: formData.stockStateFlag,
        status: formData.status,
        orgId: parseInt(orgId),
        branch: loginBranch,
        branchCode: loginBranchCode,
        client: loginClient,
        customer: loginCustomer,
        finYear: loginFinYear,
        warehouse: loginWarehouse,
        vasPickDetailsDTO: gridVo,
        createdBy: loginUserName
      };
      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `vasPick/createUpdateVasPic`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'VAS Pick Updated Successfully' : 'VAS Pick created successfully');
          handleClear();
          getAllVasPick();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'VAS Pick creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'VAS Pick creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePickQtyChange = (e, row, index) => {
    const value = e.target.value;
    const intPattern = /^\d*$/;

    if (intPattern.test(value) || value === '') {
      const numericValue = parseInt(value, 10);
      const numericAvlQty = parseInt(row.avlQty, 10) || 0;

      if (value === '' || numericValue <= numericAvlQty) {
        setVasPickGridTableData((prev) => {
          const updatedData = prev.map((r) => {
            const updatedPickQty = numericValue || 0;
            return r.id === row.id
              ? {
                  ...r,
                  pickQty: value,
                  remainingQty: !value ? '' : numericAvlQty - updatedPickQty
                }
              : r;
          });
          return updatedData;
        });

        setVasPickGridTableErrors((prev) => {
          const newErrors = [...prev];
          newErrors[index] = {
            ...newErrors[index],
            pickQty: !value ? 'Pick QTY is required' : ''
          };
          return newErrors;
        });
      } else {
        setVasPickGridTableErrors((prev) => {
          const newErrors = [...prev];
          newErrors[index] = {
            ...newErrors[index],
            pickQty: 'Pick QTY cannot be greater than Inv QTY'
          };
          return newErrors;
        });
      }
    } else {
      setVasPickGridTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = { ...newErrors[index], pickQty: 'Invalid value' };
        return newErrors;
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(modalTableData.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmitSelectedRows = async () => {
    const selectedData = selectedRows.map((index) => modalTableData[index]);
    setVasPickGridTableData([...vasPickGridTableData, ...selectedData]);

    console.log('Data selected:', selectedData);

    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();

    try {
      await Promise.all(
        selectedData.map(async (data, idx) => {
          const simulatedEvent = {
            target: {
              value: data.avlQty
            }
          };

          // await getPartNo(data.fromBin, formData.transferFromFlag, data);
          handlePickQtyChange(simulatedEvent, data, vasPickGridTableData.length + idx);
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
  };
  const handleFullGrid = () => {
    getFillGridDetails();
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            {!formData.freeze && (
              <>
                <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />{' '}
              </>
            )}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getVasPickById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
            {downloadPdf && <GeneratePdfVasPickpdf row={pdfData} />}
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField label="Document No" variant="outlined" size="small" fullWidth name="docId" value={formData.docId} disabled />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Document Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.pickBinType}>
                  <InputLabel id="pickBinType-label">
                    {
                      <span>
                        Pick Bin Type <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="pickBinType-label"
                    label="Pick Bin Type"
                    value={formData.pickBinType}
                    onChange={handleInputChange}
                    name="pickBinType"
                    disabled={formData.freeze}
                  >
                    {pickBinTypeList?.map((row) => (
                      <MenuItem key={row.id} value={row.binType.toUpperCase()}>
                        {row.binType.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.pickBinType && <FormHelperText>{fieldErrors.pickBinType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.stockState}>
                  <InputLabel id="stockState-label">
                    {
                      <span>
                        Stock State <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="stockState-label"
                    label="Stock State"
                    value={formData.stockState}
                    onChange={handleInputChange}
                    name="stockState"
                    required
                    disabled={formData.freeze}
                  >
                    <MenuItem value="HOLD">HOLD</MenuItem>
                    <MenuItem value="READY TO DISPATCH">READY TO DISPATCH</MenuItem>
                  </Select>
                  {fieldErrors.stockState && <FormHelperText>{fieldErrors.stockState}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                  <InputLabel id="status-label">
                    {
                      <span>
                        Status <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    label="Status"
                    value={formData.status}
                    onChange={handleInputChange}
                    name="status"
                    required
                    disabled={formData.freeze}
                  >
                    <MenuItem value="Edit">EDIT</MenuItem>
                    {editId && <MenuItem value="Confirm">CONFIRM</MenuItem>}
                  </Select>
                  {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                </FormControl>
              </div>
            </div>

            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Details" />
                  <Tab value={1} label="Summary" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        {!formData.freeze && (
                          <>
                            <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                          </>
                        )}
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  {!formData.freeze && (
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                  )}
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="table-header">Part No</th>
                                  <th className="table-header">Part Desc</th>
                                  <th className="table-header">SKU</th>
                                  <th className="table-header">Bin</th>
                                  <th className="table-header">Batch No</th>
                                  <th className="table-header">GRN No</th>
                                  <th className="table-header">Avl QTY</th>
                                  <th className="table-header">Pick QTY</th>
                                  <th className="table-header">Remain QTY</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vasPickGridTableData.length === 0 ? (
                                  <tr>
                                    <td colSpan="18" className="text-center py-2">
                                      No Data Found
                                    </td>
                                  </tr>
                                ) : (
                                  vasPickGridTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      {!formData.freeze && (
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                vasPickGridTableData,
                                                setVasPickGridTableData,
                                                vasPickGridTableErrors,
                                                setVasPickGridTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                      )}
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.partNo}
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.partDesc}
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.sku}
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.grnNo}
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.batchNo}
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.bin}
                                      </td>
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.avlQty}
                                      </td>
                                      {!formData.freeze ? (
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            type="text"
                                            value={row.pickQty}
                                            onChange={(e) => handlePickQtyChange(e, row, index)}
                                            className={vasPickGridTableErrors[index]?.pickQty ? 'error form-control' : 'form-control'}
                                            disabled={!row.avlQty}
                                          />
                                          {row.avlQty && vasPickGridTableErrors[index]?.pickQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {vasPickGridTableErrors[index].pickQty}
                                            </div>
                                          )}
                                        </td>
                                      ) : (
                                        <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.pickQty}
                                        </td>
                                      )}
                                      <td className="border px-2 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.remainingQty}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                              {Array.isArray(vasPickGridTableErrors) && vasPickGridTableErrors.some((error) => error.general) && (
                                <tfoot>
                                  <tr>
                                    <td colSpan={14} className="error-message">
                                      <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                                        {vasPickGridTableErrors.find((error) => error.general)?.general}
                                      </div>
                                    </td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {value === 1 && (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Total Picked QTY"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="totalPickedQty"
                          value={formData.totalPickedQty}
                          onChange={handleInputChange}
                          error={!!fieldErrors.totalPickedQty}
                          helperText={fieldErrors.totalPickedQty}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
            <Dialog
              open={modalOpen}
              maxWidth={'lg'}
              fullWidth={true}
              onClose={handleCloseModal}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                <h6>Grid Details</h6>
              </DialogTitle>
              <DialogContent className="pb-0">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-bordered ">
                        <thead>
                          <tr style={{ backgroundColor: '#673AB7' }}>
                            <th className="table-header">
                              <Checkbox checked={selectAll} onChange={handleSelectAll} />
                            </th>
                            <th className="table-header">S.No</th>
                            <th className="table-header">Part No</th>
                            <th className="table-header ">Part Desc</th>
                            <th className="table-header">SKU</th>
                            <th className="table-header">GRN No</th>
                            <th className="table-header">GRN Date</th>
                            <th className="table-header">Batch No</th>
                            <th className="table-header">Batch Date</th>
                            <th className="table-header">Bin</th>
                            <th className="table-header">Bin Type</th>
                            <th className="table-header">Avl QTY</th>
                            <th className="table-header">Pick QTY</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalTableData.map((row, index) => (
                            <tr key={row.id}>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {/* <Checkbox checked={selectAll} onChange={handleSelectAll} /> */}
                                <Checkbox
                                  checked={selectedRows.includes(index)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                  }}
                                />
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {index + 1}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.partNo}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.partDesc}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.sku}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.grnNo}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.grnDate}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.batchNo}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.batchDate}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.bin}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.binType}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.avlQty}
                              </td>
                              <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                {row.pickQty}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmitSelectedRows} variant="contained">
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default VasPick;
