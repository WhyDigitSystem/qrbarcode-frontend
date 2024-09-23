import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import GeneratePdfVasPutaway from './VasPutawaypdf';

export const VasPutaway = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [supplierList, setSupplierList] = useState([]);
  const [carrierList, setCarrierList] = useState([]);
  const [vasNoList, setVasNoList] = useState([]);
  const [tableBinList, setTableBinList] = useState([]);
  const [modeOfShipmentList, setModeOfShipmentList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [cbranch, setCbranch] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const [finYear, setFinYear] = useState('2024');
  const [vasPutAwayDocId, setVasPutAwayDocId] = useState('');

  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);

  const [formData, setFormData] = useState({
    docdate: dayjs(),
    vasPickNo: '',
    status: '',
    totalGrnQty: '',
    totalPutawayQty: '',
    freeze: false
  });
  const [value, setValue] = useState(0);

  const [lrNoDetailsError, setLrNoDetailsError] = useState([
    {
      partNo: '',
      partDescription: '',
      grnNo: '',
      invQty: '',
      putAwayQty: '',
      fromBin: '',
      toBin: '',
      sku: '',
      remarks: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docdate: new Date(),
    vasPickNo: '',
    status: '',
    totalGrnQty: '',
    totalPutawayQty: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'vasPickNo', header: 'Vas Pick No', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  const [lrNoDetailsTable, setLrNoDetailsTable] = useState([
    {
      id: 1,
      partNo: '',
      partDescription: '',
      grnNo: '',
      invQty: '',
      putAwayQty: '',
      fromBin: '',
      toBin: '',
      sku: '',
      remarks: ''
    }
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      partNo: '',
      partDescription: '',
      grnNo: '',
      invQty: '',
      putAwayQty: '',
      fromBin: '',
      bin: '',
      sku: '',
      remarks: '',
      batchNo: '',
      batchDate: '',
      binClass: '',
      binType: '',
      cellType: '',
      clientCode: '',
      core: '',
      expDate: '',
      qcFlag: '',
      stockDate: '',
      toBinType: '',
      toBinClass: '',
      toCellType: '',
      toCore: '',
      toBin: ''
    };
    setLrNoDetailsTable([...lrNoDetailsTable, newRow]);
    setLrNoDetailsError([
      ...lrNoDetailsError,
      {
        partNo: '',
        partDescription: '',
        grnNo: '',
        invQty: '',
        putAwayQty: '',
        fromBin: '',
        toBin: '',
        sku: '',
        remarks: ''
      }
    ]);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getVasPutawayDocId();
    getAllVasPickNo();
    getAllVasPutaway();
    getToBinDetailsVasPutaway();
  }, []);

  const getVasPutawayDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasputaway/getVasPutawayDocId?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setVasPutAwayDocId(response.paramObjectsMap.VasPutAwayDocId);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllVasPickNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasputaway/getDocIdFromVasPickForVasPutaway?branch=${branch}&client=${client}&finYear=${finYear}&orgId=${orgId}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setVasNoList(response.paramObjectsMap.vasPutawayVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getFillGridVasPutaway = async (vasPickNo) => {
    try {
      const response = await apiCalls(
        'get',
        `vasputaway/getAllFillGridFromVasPutaway?branch=${branch}&branchCode=${cbranch}&client=${client}&docId=${vasPickNo}&orgId=${orgId}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        let totalGrnQty = 0;
        let totalPutawayQty = 0;

        const data = response.paramObjectsMap.vasPutawayVO.map((item, index) => {
          const invQty = parseFloat(item.pickQty) || 0;
          const putAwayQty = parseFloat(item.putawayQty) || 0;

          totalGrnQty += invQty;
          totalPutawayQty += putAwayQty;

          return {
            id: index + 1,
            partNo: item.partNo,
            partDescription: item.partDesc,
            grnNo: item.grnNo,
            grnDate: item.grnDate,
            invQty: invQty,
            putAwayQty: putAwayQty,
            fromBin: item.bin,
            binClass: item.binClass,
            binType: item.binType,
            cellType: item.cellType,
            core: item.core,
            expDate: item.expDate,
            batchNo: item.batchNo,
            batchDate: item.batchDate,
            qcFlag: item.qcFlag,
            sku: item.sku,
            binList: tableBinList // Include bin list in each row data
          };
        });

        setLrNoDetailsTable(data);

        setFormData((prevData) => ({
          ...prevData,
          totalGrnQty: totalGrnQty,
          totalPutawayQty: totalPutawayQty
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleToBinChange = (row, index, event) => {
    const value = event.target.value;
    const selectedToBin = tableBinList.find((row) => row.bin === value);
    console.log('selectedToBin', selectedToBin);
    setLrNoDetailsTable((prev) => {
      const updatedTable = prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              toBin: selectedToBin.bin,
              toBinType: selectedToBin ? selectedToBin.binType : '',
              toBinClass: selectedToBin ? selectedToBin.binClass : '',
              toCellType: selectedToBin ? selectedToBin.cellType : '',
              toCore: selectedToBin ? selectedToBin.core : ''
            }
          : r
      );

      // Trigger validation after table update
      setLrNoDetailsError((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          toBin: !value ? 'Bin is required' : ''
        };
        return newErrors;
      });

      return updatedTable;
    });
  };

  const getAllVasPutaway = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasputaway/getAllVasPutaway?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.vasPutawayVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getToBinDetailsVasPutaway = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasputaway/getToBinDetailsVasPutaway?branchCode=${cbranch}&client=${client}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response getToBinDetailsVasPutaway', response);

      if (response.status === true) {
        setTableBinList(response.paramObjectsMap.ToBin);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getVasPutawayById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);

    try {
      const response = await apiCalls('get', `vasputaway/getVasPutawayById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularVasPutaway = response.paramObjectsMap.vasPutawayVO;

        console.log('THE PARTICULAR CUSTOMER IS:', particularVasPutaway);
        setVasPutAwayDocId(particularVasPutaway.docId);
        setFormData({
          docdate: particularVasPutaway.docDate,
          vasPickNo: particularVasPutaway.vasPickNo,
          status: particularVasPutaway.status,
          totalGrnQty: particularVasPutaway.totalGrnQty,
          totalPutawayQty: particularVasPutaway.totalPutawayQty,
          freeze: particularVasPutaway.freeze
        });

        setLrNoDetailsTable(
          particularVasPutaway.vasPutawayDetailsVO.map((detail) => ({
            id: detail.id,
            partNo: detail.partNo,
            partDescription: detail.partDesc,
            grnNo: detail.grnNo,
            grnDate: detail.grnDate,
            invQty: detail.invQty,
            putAwayQty: detail.putAwayQty,
            fromBin: detail.fromBin,
            sku: detail.sku,
            remarks: detail.remarks,
            batchNo: detail.batchNo,
            batchDate: detail.batchDate,
            binClass: detail.fromBinClass,
            binType: detail.fromBinType,
            cellType: detail.fromCellType,
            clientCode: detail.clientCode,
            core: detail.fromCore,
            expDate: detail.expDate,
            qcFlag: detail.qcFlag,
            stockDate: detail.stockDate,
            toBinType: detail.toBinType,
            toBinClass: detail.toBinClass,
            toCellType: detail.toCellType,
            toCore: detail.toCore,
            binList: tableBinList,
            toBin: detail.toBin
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = async (event) => {
  //   const { name, value } = event.target;

  //   if (name === 'vasPickNo') {
  //     setFormData({
  //       ...formData,
  //       vasPickNo: value
  //     });

  //     // Call the function to get the fill grid data for the selected vasPickNo
  //     await getFillGridVasPutaway(value);
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value
  //     });
  //   }
  // };

  const handleInputChange = async (event) => {
    const { name, value, selectionStart, selectionEnd } = event.target;

    const processedValue = name !== 'status' && typeof value === 'string' ? value.toUpperCase() : value;

    // Capture the cursor position before the update
    const cursorPosition = { start: selectionStart, end: selectionEnd };

    // Update form data based on the field name
    if (name === 'vasPickNo') {
      setFormData({
        ...formData,
        vasPickNo: value
      });

      // Call the function to get the fill grid data for the selected vasPickNo
      await getFillGridVasPutaway(value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Restore cursor position after state update
    setTimeout(() => {
      const inputElement = document.querySelector(`[name=${name}]`);
      if (inputElement) {
        inputElement.setSelectionRange(cursorPosition.start, cursorPosition.end);
      }
    }, 0);
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleDeleteRow = (id) => {
    setLrNoDetailsTable(lrNoDetailsTable.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === lrNoDetailsTable[lrNoDetailsTable.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };

  const handleClear = () => {
    setVasPutAwayDocId('');
    setFormData({
      docdate: dayjs(),
      vasPickNo: '',
      status: '',
      totalGrnQty: '',
      totalPutawayQty: '',
      freeze: false
    });
    setLrNoDetailsTable([
      {
        partNo: '',
        partDescription: '',
        grnNo: '',
        invQty: '',
        putAwayQty: '',
        fromBin: '',
        bin: '',
        sku: '',
        remarks: ''
      }
    ]);
    setLrNoDetailsError('');
    setFieldErrors({
      docdate: new Date(),
      vasPickNo: '',
      status: '',
      totalGrnQty: '',
      totalPutawayQty: ''
    });
    getVasPutawayDocId();
  };

  // const lrNoDetailsRefs = useRef(
  //   lrNoDetailsTable.map(() => ({
  //     toBin: React.createRef()
  //   }))
  // );

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = lrNoDetailsTable.map((_, index) => ({
      toBin: lrNoDetailsRefs.current[index]?.toBin || React.createRef()
    }));
  }, [lrNoDetailsTable]);

  const handleSave = async () => {
    console.log('save');

    const errors = {};
    let firstInvalidFieldRef = null;
    if (!formData.vasPickNo) {
      errors.vasPickNo = 'Vas Pick No is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    // Table validation
    if (lrNoDetailsTable.length === 0) {
      errors.table = 'LR No Details Table is required';
      setFieldErrors(errors);
      showToast('error', 'LR No Details Table is required');
      return; // Exit the function if the table is empty
    }

    let lrNoDetailsTableValid = true;
    const newTableErrors = lrNoDetailsTable.map((row, index) => {
      const rowErrors = {};
      if (!row.toBin) {
        rowErrors.toBin = 'Bin is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].toBin;
      }
      // if (!row.remarks) {
      //   rowErrors.remarks = 'Remarks is required';
      //   lrNoDetailsTableValid = false;
      // }

      return rowErrors;
    });

    setLrNoDetailsError(newTableErrors);

    if (!lrNoDetailsTableValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
    } else {
      // Proceed with form submission
    }

    setFieldErrors(errors);
    console.log('save 2');
    if (Object.keys(errors).length === 0 && lrNoDetailsTableValid) {
      console.log('save 3');
      setIsLoading(true);
      const lrNoDetailsVO = lrNoDetailsTable.map((row) => ({
        partNo: row.partNo,
        partDesc: row.partDescription,
        grnNo: row.grnNo,
        grnDate: row.grnDate,
        invQty: parseInt(row.invQty),
        putAwayQty: parseInt(row.putAwayQty),
        fromBin: row.fromBin,
        sku: row.sku,
        remarks: row.remarks,
        batchNo: row.batchNo,
        batchDate: row.batchDate,
        fromBinClass: row.binClass,
        fromBinType: row.binType,
        fromCellType: row.cellType,
        clientCode: row.clientCode,
        fromCore: row.core,
        expDate: row.expDate,
        qcFlag: row.qcFlag,
        stockDate: row.stockDate,
        toBin: row.toBin,
        toBinType: row.toBinType,
        toBinClass: row.toBinClass,
        toCellType: row.toCellType,
        toCore: row.toCore
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
        branchCode: cbranch,
        client: client,
        createdBy: loginUserName,
        customer: customer,
        finYear: finYear,
        orgId: orgId,
        vasPickNo: formData.vasPickNo,
        status: formData.status,
        totalGrnQty: parseInt(formData.totalGrnQty),
        totalPutawayQty: parseInt(formData.totalPutawayQty),
        warehouse: warehouse,
        vasPutawayDetailsDTO: lrNoDetailsVO
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `vasputaway/createUpdateVasPutaway`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          getAllVasPutaway();
          getVasPutawayDocId();
          showToast('success', editId ? ' Vas Putaway In Updated Successfully' : 'Vas Putaway In created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Vas Putaway In creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', error.message);
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleClose = () => {
    setFormData({
      docdate: null,
      vasPickNo: '',
      status: '',
      totalGrnQty: '',
      totalPutawayQty: ''
    });
  };

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };

  return (
    <>
      <div>{/* <ToastContainer /> */}</div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            {!formData.freeze && (
              <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
            )}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getVasPutawayById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
            {downloadPdf && <GeneratePdfVasPutaway row={pdfData} />}
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Document No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="vasPutAwayDocId"
                  value={vasPutAwayDocId}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Document Date"
                      value={formData.docdate ? dayjs(formData.docdate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docdate', date)}
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
                {editId ? (
                  <TextField
                    label="VAS Pick No *"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="vasPickNo"
                    value={formData.vasPickNo}
                    disabled
                  />
                ) : (
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.vasPickNo}>
                    <InputLabel id="vasPickNo">
                      {
                        <span>
                          VAS Pick No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="vasPickNo"
                      label="VAS Pick No *"
                      value={formData.vasPickNo}
                      onChange={handleInputChange}
                      name="vasPickNo"
                    >
                      {vasNoList.length > 0 ? (
                        vasNoList.map((vas) => (
                          <MenuItem key={vas.id} value={vas.vasPickNo}>
                            {vas.vasPickNo}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Data Found</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.vasPickNo && <FormHelperText>{fieldErrors.vasPickNo}</FormHelperText>}
                  </FormControl>
                )}
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                  <InputLabel id="status">
                    {
                      <span>
                        Status <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="status"
                    label="Status *"
                    value={formData.status}
                    onChange={handleInputChange}
                    name="status"
                    disabled={formData.freeze}
                  >
                    <MenuItem value="Edit">EDIT</MenuItem>
                    {editId && <MenuItem value="Confirm">CONFIRM</MenuItem>}
                  </Select>
                  {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                </FormControl>
              </div>

              {/* <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
                  label="Active"
                />
              </div> */}
            </div>
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="LR No Details" />
                  <Tab value={1} label="Summary" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">{!formData.freeze && <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />}</div>
                      {/* Table */}
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
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
                                  <th className="px-2 py-2 text-white text-center">Part No</th>
                                  <th className="px-2 py-2 text-white text-center">Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">GRN No</th>
                                  <th className="px-2 py-2 text-white text-center">Inv Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Putaway Qty</th>
                                  <th className="px-2 py-2 text-white text-center">From Bin</th>
                                  <th className="px-2 py-2 text-white text-center">Bin *</th>
                                  <th className="px-2 py-2 text-white text-center">SKU</th>
                                  <th className="px-2 py-2 text-white text-center">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lrNoDetailsTable.length > 0 ? (
                                  lrNoDetailsTable.map((row, index) => (
                                    <tr key={row.id}>
                                      {!formData.freeze && (
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                        </td>
                                      )}
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.partNo}
                                          disabled
                                          className="form-control"
                                          title={row.partNo}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.partDescription}
                                          disabled
                                          className="form-control"
                                          title={row.partDescription}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.grnNo}
                                          disabled
                                          className="form-control"
                                          title={row.grnNo}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.invQty}
                                          disabled
                                          className="form-control"
                                          title={row.invQty}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.putAwayQty}
                                          disabled
                                          className="form-control"
                                          title={row.putAwayQty}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.fromBin}
                                          disabled
                                          className="form-control"
                                          title={row.fromBin}
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          ref={lrNoDetailsRefs.current[index]?.toBin}
                                          value={row.toBin}
                                          style={{ width: '100px' }}
                                          onChange={(e) => handleToBinChange(row, index, e)}
                                          // onChange={(e) => {
                                          //   const value = e.target.value;

                                          //   setLrNoDetailsTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, bin: value } : r)));
                                          //   setLrNoDetailsError((prev) => {
                                          //     const newErrors = [...prev];
                                          //     newErrors[index] = {
                                          //       ...newErrors[index],
                                          //       bin: !value ? 'Bin is required' : ''
                                          //     };
                                          //     return newErrors;
                                          //   });
                                          // }}
                                          className={lrNoDetailsError[index]?.toBin ? 'error form-control' : 'form-control'}
                                          disabled={formData.freeze}
                                        >
                                          <option value="">--Select--</option>
                                          {row.binList && row.binList.length > 0 ? (
                                            row.binList.map((list) => (
                                              <option key={list.id} value={list.bin}>
                                                {list.bin}
                                              </option>
                                            ))
                                          ) : (
                                            <option disabled>No Data Found</option>
                                          )}
                                        </select>
                                        {lrNoDetailsError[index]?.toBin && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {lrNoDetailsError[index].toBin}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.sku}
                                          disabled
                                          className="form-control"
                                          title={row.sku}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.remarks}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                            );
                                          }}
                                          onKeyDown={(e) => handleKeyDown(e, row)}
                                          className="form-control"
                                          disabled={formData.freeze}
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="18" className="text-center py-2">
                                      No Data Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {value === 1 && (
                  <>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Total GRN Qty"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="totalGrnQty"
                          value={formData.totalGrnQty}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Total Putaway Qty"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="totalPutawayQty"
                          value={formData.totalPutawayQty}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
export default VasPutaway;
