import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Draggable from 'react-draggable';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveGroups } from 'utils/CommonFunctions';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const ReversePick = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [buyerOrderNoList, setBuyerOrderNoList] = useState([]);
  const [listView, setListView] = useState(false);
  const [editId, setEditId] = useState('');
  const [unitList, setUnitList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  // const [finYear, setFinYear] = useState(localStorage.getItem('finYear') ? localStorage.getItem('finYear') : '2024');
  const [finYear, setFinYear] = useState('2024');

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    buyerOrderNo: '',
    buyerRefNo: '',
    buyerRefDate: null,
    clientName: '',
    customerName: '',
    customerShortName: '',
    inTime: '',
    clientAddress: '',
    customerAddress: '',
    status: 'Edit',
    buyersReference: '',
    invoiceNo: '',
    clientShortName: '',
    pickRequestDocDate: '',
    boAmendment: 'No',
    buyerOrderDate: null,
    pickRequestDocId: '',
    freeze: false,
    totalPickedQty: '',
    totalRevisedQty: ''
  });

  const [value, setValue] = useState(0);
  const [fillGridData, setFillGridData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [itemTableData, setItemTableData] = useState([
    // {
    //   availQty: '',
    //   batchDate: '',
    //   batchNo: '',
    //   binClass: '',
    //   binType: '',
    //   cellType: '',
    //   clientCode: '',
    //   core: '',
    //   bin: '',
    //   orderQty: '',
    //   partDesc: '',
    //   partNo: '',
    //   pcKey: '',
    //   pickQty: '',
    //   remainQty: '',
    //   sku: '',
    //   ssku: '',
    //   status: '',
    //   revisedQty: ''
    // }
  ]);

  const handleAddRow = () => {
    const newRow = {
      availQty: '',
      batchDate: '',
      batchNo: '',
      binClass: '',
      binType: '',
      cellType: '',
      clientCode: '',
      core: '',
      bin: '',
      orderQty: '',
      partDesc: '',
      partNo: '',
      pcKey: '',
      pickQty: '',
      remainQty: '',
      sku: '',
      ssku: '',
      status: ''
    };
    setItemTableData([...itemTableData, newRow]);
    setItemTableErrors([
      ...itemTableErrors,
      {
        availQty: '',
        batchDate: '',
        batchNo: '',
        binClass: '',
        binType: '',
        cellType: '',
        clientCode: '',
        core: '',
        bin: '',
        orderQty: '',
        partDesc: '',
        partNo: '',
        pcKey: '',
        pickQty: '',
        remainQty: '',
        sku: '',
        ssku: '',
        status: ''
      }
    ]);
  };

  const [itemTableErrors, setItemTableErrors] = useState([
    {
      availQty: '',
      batchDate: '',
      batchNo: '',
      binClass: '',
      binType: '',
      cellType: '',
      clientCode: '',
      core: '',
      bin: '',
      orderQty: '',
      partDesc: '',
      partNo: '',
      pcKey: '',
      pickQty: '',
      remainQty: '',
      sku: '',
      ssku: '',
      status: ''
    }
  ]);

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: dayjs(),
    buyerOrderNo: '',
    buyerRefNo: '',
    buyerRefDate: null,
    clientName: '',
    customerName: '',
    customerShortName: '',
    inTime: '',
    clientAddress: '',
    customerAddress: '',

    buyersReference: '',
    invoiceNo: '',
    clientShortName: ''
  });
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Doc Id', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'pickRequestDocId', header: 'Pick Request DocId', size: 140 },
    { accessorKey: 'pickRequestDocDate', header: 'Pick Request DocDate', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    console.log('LISTVIEW FIELD CURRENT VALUE IS', listView);
    getAllPickRequest();
    getbuyerRefNo();
    getAllGroups();
    getDocId();
  }, []);
  useEffect(() => {
    const totalRevQty = itemTableData.reduce((sum, row) => sum + (parseInt(row.revisedQty, 10) || 0), 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      totalRevisedQty: totalRevQty
    }));
  }, [itemTableData]);

  const getDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `reversePick/getReversePickDocId?orgId=${orgId}&branchCode=${branchCode}&client=${client}&branch=${branch}&finYear=${finYear}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        // setDocId(response.paramObjectsMap.locationMovementDocId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          docId: response.paramObjectsMap.reversePickDocId
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPickRequest = async () => {
    try {
      const response = await apiCalls(
        'get',
        `reversePick/getAllReversePick?orgId=${orgId}&branchCode=${branchCode}&branch=${branch}&client=${client}&warehouse=${warehouse}&finYear=${finYear}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.reversePickVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getbuyerRefNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `reversePick/getPickRequestDetailsForReversePick?orgId=${orgId}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&branch=${branch}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        // Store the full buyerOrderVO objects in the list
        setBuyerOrderNoList(response.paramObjectsMap.pickRequestVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCurrentTime = () => {
    return dayjs().format('HH:mm:ss');
  };
  const getInTime = () => {
    setFormData((prev) => ({ ...prev, inTime: getCurrentTime() }));
  };

  // Initialize the inTime field with the current time
  useEffect(() => {
    getInTime();
  }, []);

  const getAllGroups = async () => {
    try {
      const groupData = await getAllActiveGroups(orgId);
      console.log('THE GROUP DATA IS:', groupData);

      setGroupList(groupData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  // const getAllItems = async () => {
  //   try {
  //     const response = await apiCalls(
  //       'get',
  //       `warehousemastercontroller/material?cbranch=${loginBranchCode}&client=${loginClient}&orgid=${orgId}`
  //     );
  //     setListViewData(response.paramObjectsMap.materialVO);
  //     console.log('TEST LISTVIEW DATA', response);
  //   } catch (err) {
  //     console.log('error', err);
  //   }
  // };
  const getAllItemById = async (row) => {
    console.log('THE SELECTED ITEM ID IS:', row.original.id);
    setEditId(row.original.id);

    try {
      const response = await apiCalls('get', `reversePick/getReversePickById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const data = response.paramObjectsMap.reversePickVO;

        // Set formData from main response data
        setFormData({
          docId: data.docId,
          docDate: data.docDate,
          buyerOrderNo: data.buyerOrderNo,
          buyerOrderDate: data.buyerOrderDate,
          buyerRefNo: data.buyerRefNo,
          buyerRefDate: data.buyerRefDate,
          clientName: data.clientName,
          customerName: data.customerName,
          customerShortName: data.customerShortName,
          inTime: data.inTime,
          clientAddress: data.clientAddress,
          customerAddress: data.customerAddress,
          status: data.status,
          buyersReference: data.buyersReference,
          invoiceNo: data.invoiceNo,
          clientShortName: data.clientShortName,
          pickOrder: data.pickOrder,
          boAmendment: data.boAmendment,
          pickRequestDocDate: data.pickRequestDocDate,
          pickRequestDocId: data.pickRequestDocId,
          freeze: data.freeze,
          totalPickedQty: data.totalPickQty
          // totalRevisedQty: data.revisedQty
        });
        setItemTableData(
          data.reversePickDetailsVO.map((detail) => ({
            // batchDate: detail.batchDate || '',
            batchDate: detail.batchDate ? dayjs(detail.batchDate).format('DD-MM-YYYY') : null,
            batchNo: detail.batchNo || '',
            binClass: detail.binClass || '',
            binType: detail.binType || '',
            cellType: detail.cellType || '',
            clientCode: detail.clientCode || '',
            expDate: detail.expDate || '',
            core: detail.core || '',
            bin: detail.bin || '',
            orderQty: detail.orderQty || '',
            partDesc: detail.partDesc || '',
            partNo: detail.partNo || '',
            pcKey: detail.pcKey || '',
            pickQty: detail.pickQty || '',
            grnDate: detail.grnDate || '',
            grnNo: detail.grnNo || '',
            revisedQty: detail.revisedQty || '',
            sku: detail.sku || '',
            qcFlag: detail.qcFlag
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChangeGrid = (e, index, fieldName) => {
    const { value } = e.target;

    // Ensure the index and fieldName are provided for table fields like revisedQty
    if (typeof index === 'number' && fieldName) {
      setItemTableData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index][fieldName] = value; // Update the specific field for the correct row
        return updatedData;
      });

      // Optionally: handle field validation here if needed
      if (value === '' || isNaN(value)) {
        setItemTableErrors((prevErrors) => {
          const updatedErrors = [...prevErrors];
          updatedErrors[index] = { ...updatedErrors[index], [fieldName]: 'Invalid quantity' };
          return updatedErrors;
        });
      } else {
        setItemTableErrors((prevErrors) => {
          const updatedErrors = [...prevErrors];
          updatedErrors[index] = { ...updatedErrors[index], [fieldName]: '' }; // Clear error if valid
          return updatedErrors;
        });
      }
    } else {
      // Handle regular form fields
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: value.toUpperCase()
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cursorPosition = e.target.selectionStart; // Capture cursor position

    // Check if the value is a string before applying toUpperCase
    let processedValue = value;
    // let processedValue = name !== 'status' && typeof value === 'string' ? value.toUpperCase() : value;

    // Convert value to uppercase for fields other than 'boAmendment'
    if (typeof value === 'string' && name !== 'boAmendment' && name !== 'status') {
      processedValue = value.toUpperCase();
    }

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue
    }));

    // Maintain cursor position after state change
    setTimeout(() => {
      const inputField = document.querySelector(`[name="${name}"]`);
      if (inputField) {
        inputField.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);

    // Specific logic for 'pickRequestDocId'
    if (name === 'pickRequestDocId') {
      // Find the selected order from the list of orders
      const selectedOrder = buyerOrderNoList.find(
        (order) => order.docId && processedValue && order.docId.toLowerCase() === processedValue.toLowerCase()
      );

      if (selectedOrder) {
        const refDate = selectedOrder.buyerRefDate ? dayjs(selectedOrder.buyerRefDate) : null;

        setFormData((prevFormData) => ({
          ...prevFormData,
          buyerRefNo: selectedOrder.buyerRefNo || '',
          buyerRefDate: refDate,
          clientName: selectedOrder.clientName || '',
          clientShortName: selectedOrder.clientShortName || '',
          customerName: selectedOrder.customerName || '',
          clientAddress: selectedOrder.clientAddress || '',
          customerAddress: selectedOrder.customerAddress || '',
          buyerOrderNo: selectedOrder.buyerOrderNo || '',
          buyerOrderDate: selectedOrder.buyerOrderDate || '',
          buyersReference: selectedOrder.buyersReference || '',
          invoiceNo: selectedOrder.invoiceNo || '',
          pickRequestDocDate: selectedOrder.docDate || '',
          pickRequestDocId: selectedOrder.docId || '',
          boAmendment: selectedOrder.boAmendment || '',
          inTime: formData.inTime || '',
          totalPickedQty: selectedOrder.totalPickQty || ''
        }));
      } else {
        console.log('No matching order found for the selected value.');
      }
    }
  };

  const handleDeleteRow = (id) => {
    const rowIndex = itemTableData.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = itemTableData.filter((row) => row.id !== id);
      const updatedErrors = itemTableErrors.filter((_, index) => index !== rowIndex);
      setItemTableData(updatedData);
      setItemTableErrors(updatedErrors);
    }
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === itemTableData[itemTableData.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };

  const handleClear = () => {
    setFormData({
      docId: '',
      docDate: dayjs(),
      buyerOrderNo: '',
      buyerRefNo: '',
      buyerRefDate: null,
      clientName: '',
      customerName: '',
      customerShortName: '',
      boAmendment: 'No',
      clientAddress: '',
      customerAddress: '',
      status: 'Edit',
      buyersReference: '',
      invoiceNo: '',
      clientShortName: '',
      pickOrder: 'FIFO',
      pickRequestDocId: '',
      totalPickedQty: '',
      totalRevisedQty: ''
    });
    setItemTableData([]);
    setFieldErrors({
      docDate: '',
      pickRequestId: '',
      dispatch: '',
      buyerOrderNo: '',
      buyerRefNo: '',
      buyerRefDate: '',
      shipmentMethod: '',
      refNo: '',
      noOfBoxes: '',
      dueDays: '',
      clientName: '',
      customerName: '',
      inTime: '',
      clientAddress: '',
      customerAddress: '',
      status: '',
      boAmendment: '',
      controlBranch: localStorage.getItem('branchCode'),
      active: true,
      charges: '',
      lineDiscount: '',
      roundOff: '',
      invDiscountAmount: '',
      watAmountWithoutForm: '',
      totalAmount: ''
    });
    getDocId();
    getInTime();
    setItemTableErrors([]);
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.pickRequestDocId) {
      errors.pickRequestDocId = 'Pick Request Id is required';
    }

    if (!formData.buyerRefNo) {
      errors.buyerRefNo = 'Buyer Order Ref No is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }
    setFieldErrors(errors);
    let itemTableDataValid = true;
    if (!itemTableData || !Array.isArray(itemTableData) || itemTableData.length === 0) {
      itemTableDataValid = false;
      setItemTableErrors([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = itemTableData.map((row, index) => {
        const rowErrors = {};

        if (!row.partNo) rowErrors.partNo = 'Part No is required';
        if (!row.grnNo) rowErrors.grnNo = 'Grn No is required';
        if (!row.batchNo) rowErrors.batchNo = 'Batch No is required';
        if (!row.bin) rowErrors.bin = 'Bin is required';

        if (Object.keys(rowErrors).length > 0) itemTableDataValid = false;

        return rowErrors;
      });

      setItemTableErrors(newTableErrors);
    }
    if (Object.keys(errors).length === 0 && itemTableDataValid) {
      // if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const itemVo = itemTableData.map((row) => ({
        availQty: row.availQty,
        batchDate: row.batchDate,
        batchNo: row.batchNo,
        binClass: row.binClass,
        binType: row.binType,
        cellType: row.cellType,
        core: row.core,
        bin: row.bin,
        grnNo: row.grnNo,
        orderQty: row.orderQty,
        partDesc: row.partDesc,
        partNo: row.partNo,
        pickQty: row.pickQty,
        remainQty: row.remainQty,
        sku: row.sku,
        qcFlag: row.qcFlag,
        remarks: row.remarks,
        stockDate: row.stockDate,
        status: row.status,
        expDate: row.expDate,
        grnDate: row.grnDate,
        revisedQty: parseInt(row.revisedQty)
      }));

      const saveFormData = {
        ...(editId && { id: editId }),

        docId: formData.docId,
        docDate: formData.docDate,
        buyerOrderNo: formData.buyerOrderNo,
        buyerRefNo: formData.buyerRefNo,
        buyerRefDate: formData.buyerRefDate,
        clientName: formData.clientName,
        client: client,
        customerName: formData.customerName,
        customerShortName: formData.customerShortName,
        inTime: formData.inTime,
        clientAddress: formData.clientAddress,
        customerAddress: formData.customerAddress,
        status: formData.status,
        buyersReference: formData.buyersReference,
        invoiceNo: formData.invoiceNo,
        clientShortName: formData.clientShortName,
        pickOrder: formData.pickOrder,
        reversePickDetailsDTO: itemVo,
        branch: branch,
        branchCode: branchCode,
        finYear: finYear,
        warehouse: warehouse,
        orgId: orgId,
        customer: customer,
        client: client,
        createdBy: loginUserName,
        boAmendment: formData.boAmendment,
        buyerOrderDate: formData.buyerOrderDate,
        pickRequestDocId: formData.pickRequestDocId,
        pickRequestDocDate: formData.pickRequestDocDate
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `reversePick/createUpdateReversePick`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Reverse Pick Updated Successfully' : 'Reverse Pick created successfully');
          setIsLoading(false);
          getAllPickRequest();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Reverse Pick creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Reverse Pick creation failed');
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
      itemType: '',
      partNo: '',
      partDesc: '',
      custPartNo: '',
      groupName: '',
      styleCode: '',
      baseSku: '',
      addDesc: '',
      purchaseUnit: '',
      storageUnit: '',
      fixedCapAcrossLocn: '',
      fsn: '',
      saleUnit: '',
      type: '',
      serialNoFlag: '',
      sku: '',
      skuQty: '',
      ssku: '',
      sskuQty: '',
      zoneType: '',
      weightSkuUom: '',
      hsnCode: '',
      parentChildKey: '',
      controlBranch: '',
      criticalStockLevel: '',
      criticalStock: '',
      bchk: '',
      status: '',
      barcode: '',
      active: true
    });
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('DD-MM-YYYY');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const getAllFillGrid = async () => {
    const errors = {};
    if (!formData.pickRequestDocId) {
      errors.pickRequestDocId = 'Pick Request Id is required';
    }
    if (Object.keys(errors).length === 0) {
      setModalOpen(true);
      try {
        const response = await apiCalls(
          'get',
          `reversePick/getFillGridDetailsForReversePick?orgId=${orgId}&branchCode=${branchCode}&client=${client}&pickRequestDocId=${formData.pickRequestDocId}`
        );
        console.log('API Response:', response);

        if (response.status === true) {
          setFillGridData(response.paramObjectsMap.fillGridDetails);
          setItemTableErrors([{ general: '' }]);
        } else {
          console.error('API Error:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleSaveSelectedRows = () => {
    const selectedData = selectedRows.map((index) => fillGridData[index]);

    // Extract the bin values from the selected data
    const binValues = selectedData.map((row) => row.bin);

    // Pass the bin values to the getAllPartNo function
    // getAllPartNo(binValues);

    // Add the selected data to childTableData
    setItemTableData([...itemTableData, ...selectedData]);

    console.log('Selected Data:', selectedData);

    // Clear selections and close the modal
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(fillGridData.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllItemById} />
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
                  disabled
                  name="docId"
                  value={formData.docId}
                  onChange={handleInputChange}
                  error={!!fieldErrors.docId}
                  helperText={fieldErrors.docId}
                />
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
                <FormControl variant="outlined" size="small" fullWidth error={!!fieldErrors.buyerRefNo}>
                  <InputLabel id="buyerRefNo-label">
                    <span>
                      Pick Request Id <span className="asterisk">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    labelId="buyerRefNo-label"
                    id="pickRequestDocId"
                    name="pickRequestDocId"
                    label="Pick Request Id"
                    value={formData.pickRequestDocId}
                    onChange={handleInputChange}
                    disabled={formData.freeze}
                  >
                    {buyerOrderNoList.length === 0 && (
                      <MenuItem value="">
                        <em>No Data Found</em>
                      </MenuItem>
                    )}

                    {/* Dynamically mapping buyerOrderNoList to MenuItem components */}
                    {buyerOrderNoList.map((order, index) => (
                      <MenuItem key={index} value={order.docId}>
                        {order.docId}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.pickRequestDocId && <FormHelperText error>{fieldErrors.pickRequestDocId}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Pick Request Date"
                      value={formData.pickRequestDocDate ? dayjs(formData.pickRequestDocDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('pickRequestDocDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.pickRequestDocDate}
                      helperText={fieldErrors.pickRequestDocDate && 'Required'}
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Buyer Order Ref No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="buyerRefNo"
                  value={formData.buyerRefNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.buyerRefNo}
                  helperText={fieldErrors.buyerRefNo}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Buyer Order Ref Date"
                      value={formData.buyerRefDate ? dayjs(formData.buyerRefDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('buyerRefDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.buyerRefDate}
                      helperText={fieldErrors.buyerRefDate && 'Required'}
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Buyer Order No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="buyerOrderNo"
                  value={formData.buyerOrderNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.buyerOrderNo}
                  helperText={fieldErrors.buyerOrderNo}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Buyer Order Date"
                      value={formData.buyerOrderDate ? dayjs(formData.buyerOrderDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('buyerOrderDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      disabled
                      format="DD-MM-YYYY"
                      error={fieldErrors.buyerOrderDate}
                      helperText={fieldErrors.buyerOrderDate && 'Required'}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Buyers Reference"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="buyersReference"
                  value={formData.buyersReference}
                  onChange={handleInputChange}
                  error={!!fieldErrors.buyersReference}
                  helperText={fieldErrors.buyersReference}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Invoice No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.invoiceNo}
                  helperText={fieldErrors.invoiceNo}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Client Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.clientName}
                  helperText={fieldErrors.clientName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Client Short Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="clientShortName"
                  value={formData.clientShortName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.clientShortName}
                  disabled
                  helperText={fieldErrors.clientShortName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Client Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  error={!!fieldErrors.clientAddress}
                  helperText={fieldErrors.clientAddress}
                  disabled
                />
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="Dispatch"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="dispatch"
                  value={formData.dispatch}
                  onChange={handleInputChange}
                  error={!!fieldErrors.dispatch}
                  helperText={fieldErrors.dispatch}
                />
              </div> */}
              <div className="col-md-3 mb-3">
                <TextField
                  label="Customer Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.customerName}
                  helperText={fieldErrors.customerName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Customer Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  error={!!fieldErrors.customerAddress}
                  helperText={fieldErrors.customerAddress}
                  disabled
                />
              </div>

              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="Due Days"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="dueDays"
                  value={formData.dueDays}
                  onChange={handleInputChange}
                  error={!!fieldErrors.dueDays}
                  helperText={fieldErrors.dueDays}
                />
              </div> */}

              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="NoOfBoxes"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="noOfBoxes"
                  value={formData.noOfBoxes}
                  onChange={handleInputChange}
                  error={!!fieldErrors.noOfBoxes}
                  helperText={fieldErrors.noOfBoxes}
                />
              </div> */}

              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.pickOrder}>
                  <InputLabel id="purchaseUnit-label">Pick Order</InputLabel>
                  <Select
                    labelId="purchaseUnit-label"
                    id="purchaseUnit"
                    name="pickOrder"
                    label="Pick Order"
                    value={formData.pickOrder}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="FIFO">FIFO</MenuItem>
                    <MenuItem value="LILO">LIFO</MenuItem>
                    <MenuItem value="FIFO">FIFO</MenuItem>
                  </Select>
                  {fieldErrors.pickOrder && <FormHelperText error>{fieldErrors.pickOrder}</FormHelperText>}
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={formData.freeze}
                  >
                    <MenuItem value="Edit">EDIT</MenuItem>
                    {editId && <MenuItem value="Confirm">CONFIRM</MenuItem>}
                  </Select>
                  {fieldErrors.status && <FormHelperText error>{fieldErrors.status}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="In Time"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="inTime"
                  value={formData.inTime}
                  onChange={handleInputChange}
                  error={!!fieldErrors.inTime}
                  helperText={fieldErrors.inTime}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.boAmendment}>
                  <InputLabel id="status-label">BO Amentment</InputLabel>
                  <Select
                    labelId="status-label"
                    id="boAmendment"
                    name="boAmendment"
                    label="BO Amentment"
                    value={formData.boAmendment}
                    onChange={handleInputChange}
                    disabled={formData.freeze}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                  {fieldErrors.boAmendment && <FormHelperText error>{fieldErrors.boAmendment}</FormHelperText>}
                </FormControl>
              </div>
            </div>

            <div className="row ">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Details" />
                  <Tab value={1} label="Summary" />
                </Tabs>
              </Box>
              {/* <Box className="mt-4"> */}
              <Box className="mt-2" sx={{ padding: 1 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        {/* <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} /> */}
                        <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={getAllFillGrid} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered" style={{ width: '100%' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Part No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Part Desc
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Core
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Bin
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    SKU
                                  </th>

                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Batch No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Batch Date
                                  </th>

                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Order Qty
                                  </th>

                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Pick Qty
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Revised Qty
                                  </th>
                                  {/* <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    Remaining Qty
                                  </th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {itemTableData.length === 0 ? (
                                  <tr>
                                    <td colSpan="18" className="text-center py-2">
                                      No Data Found
                                    </td>
                                  </tr>
                                ) : (
                                  itemTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>

                                      {/* Part Code */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.partNo}
                                          disabled
                                          onChange={(e) => handleInputChange(e, index, 'partNo')}
                                          className={itemTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.partNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].partNo}
                                          </div>
                                        )}
                                      </td>

                                      {/* Part Description */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.partDesc}
                                          disabled
                                          onChange={(e) => handleInputChange(e, index, 'partDesc')}
                                          className={itemTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.partDesc && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].partDesc}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.core}
                                          disabled
                                          onChange={(e) => handleInputChange(e, index, 'core')}
                                          className={itemTableErrors[index]?.core ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.core && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].core}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '100px' }}
                                          value={row.bin}
                                          disabled
                                          onChange={(e) => handleInputChange(e, index, 'bin')}
                                          className={itemTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.bin && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].bin}
                                          </div>
                                        )}
                                      </td>

                                      {/* Batch No */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sku}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => handleInputChange(e, index, 'sku')}
                                          className={itemTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.sku && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].sku}
                                          </div>
                                        )}
                                      </td>

                                      {/* Lot No */}

                                      {/* SKU */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.batchNo}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => handleInputChange(e, index, 'batchNo')}
                                          className={itemTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.batchNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].batchNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.batchDate}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => handleInputChange(e, index, 'batchDate')}
                                          className={itemTableErrors[index]?.batchDate ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.batchDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].batchDate}
                                          </div>
                                        )}
                                      </td>
                                      {/* Location */}
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.orderQty}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => handleInputChange(e, index, 'orderQty')}
                                          className={itemTableErrors[index]?.orderQty ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.orderQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].orderQty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="number"
                                          value={Math.abs(row.pickQty)} // Ensure the value is always positive
                                          style={{ width: '100px' }}
                                          disabled
                                          onChange={(e) => {
                                            const value = Math.abs(parseInt(e.target.value) || 0); // Convert to positive integer

                                            // Update sQty and then recalculate remainQty for the specific row

                                            // Call handleInputChange if needed for validation or other logic
                                            handleInputChange({ ...e, target: { ...e.target, value } }, index, 'pickQty');
                                          }}
                                          className={itemTableErrors[index]?.pickQty ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.pickQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].pickQty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.revisedQty || ''}
                                          style={{ width: '100px' }}
                                          disabled={formData.freeze}
                                          onChange={(e) => handleInputChangeGrid(e, index, 'revisedQty')}
                                          className={itemTableErrors[index]?.revisedQty ? 'error form-control' : 'form-control'}
                                        />
                                        {itemTableErrors[index]?.revisedQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].revisedQty}
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                              {itemTableErrors.some((error) => error.general) && (
                                <tfoot>
                                  <tr>
                                    <td colSpan={13} className="error-message">
                                      <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                                        {itemTableErrors.find((error) => error.general)?.general}
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
                    <div className="row mt-2">
                      <div className="row">
                        <div className="col-md-3 mb-3">
                          <TextField
                            label="Total Picked Qty"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="totalPickedQty"
                            value={formData.totalPickedQty}
                            onChange={handleInputChange}
                            disabled
                            error={!!fieldErrors.totalPickedQty}
                            helperText={fieldErrors.totalPickedQty}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <TextField
                            label="Total Revised Qty"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="totalRevisedQty"
                            value={formData.totalRevisedQty}
                            onChange={handleInputChange}
                            error={!!fieldErrors.totalRevisedQty}
                            disabled
                            helperText={fieldErrors.totalRevisedQty}
                          />
                        </div>
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
                      <table className="table table-bordered">
                        <thead>
                          <tr style={{ backgroundColor: '#673AB7' }}>
                            <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                              <Checkbox checked={selectAll} onChange={handleSelectAll} />
                            </th>
                            <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                              S.No
                            </th>
                            <th className="px-2 py-2 text-white text-center">Part No</th>
                            <th className="px-2 py-2 text-white text-center">Part Desc</th>
                            <th className="px-2 py-2 text-white text-center">Core</th>
                            <th className="px-2 py-2 text-white text-center">SKU</th>
                            <th className="px-2 py-2 text-white text-center">GRN No</th>
                            <th className="px-2 py-2 text-white text-center">GRN Date</th>

                            <th className="px-2 py-2 text-white text-center">Batch No</th>
                            <th className="px-2 py-2 text-white text-center">Batch Date</th>
                            <th className="px-2 py-2 text-white text-center">Bin</th>
                            <th className="px-2 py-2 text-white text-center">Order Qty</th>
                            <th className="px-2 py-2 text-white text-center">Pick Qty</th>
                            {/* <th className="px-2 py-2 text-white text-center">Remaining Qty</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {fillGridData?.map((row, index) => (
                            <tr key={row.index}>
                              <td className="border p-0 text-center">
                                <Checkbox
                                  checked={selectedRows.includes(index)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <div className="pt-1">{index + 1}</div>
                              </td>
                              {/* <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.bin || ''}</div>
                              </td> */}
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.partNo || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.partDesc || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.core || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.sku || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.grnNo || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.grnDate || ''}</div>
                              </td>

                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.batchNo || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.batchDate || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.bin || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.orderQty || ''}</div>
                              </td>
                              <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>{row.pickQty || ''}</div>
                              </td>
                              {/* <td className="border p-0">
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto', padding: '5px' }}>
                                  {row.remainOrderQty || ''}
                                </div>
                              </td> */}
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
                <Button color="secondary" onClick={handleSaveSelectedRows} variant="contained">
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default ReversePick;
