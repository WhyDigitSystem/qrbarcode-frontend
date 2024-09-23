import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
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
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { getAllActiveBranches, getAllActiveBuyer } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import sampleFile from '../../../assets/sample-files/sample_data_buyerorder.xls';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const BuyerOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [buyerList, setBuyerList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginUserId, setLoginUserId] = useState(localStorage.getItem('userId'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [loginFinYear, setLoginFinYear] = useState(2024);
  const [partNoList, setPartNoList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    avilQty: 10,
    billto: '',
    bin: 'CHENNAI',
    billtoFullName: '',
    branch: loginBranch,
    branchCode: loginBranchCode,
    buyerShortName: '',
    buyerFullName: '',
    client: loginClient,
    company: 'String',
    createdBy: loginUserName,
    currency: '',
    customer: loginCustomer,
    docId: '',
    docDate: dayjs(),
    exRate: 1,
    freeze: false,
    invoiceDate: dayjs(),
    invoiceNo: '',
    // location: '',
    orderDate: dayjs(),
    orderNo: '',
    orderQty: '',
    orgId: orgId,
    reMarks: '',
    refDate: dayjs(),
    refNo: '',
    shipTo: '',
    shipToFullName: '',
    tax: 'TAX'
  });
  const [value, setValue] = useState(0);

  const [skuDetailsTableData, setSkuDetailsTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      batchNo: '',
      availQty: '',
      qty: ''
    }
  ]);

  // const lrNoDetailsRefs = useRef(
  //   skuDetailsTableData.map(() => ({
  //     partNo: React.createRef(),
  //     batchNo: React.createRef(),
  //     qty: React.createRef()
  //   }))
  // );

  // useEffect(() => {
  //   // If the length of the table changes, update the refs
  //   if (lrNoDetailsRefs.current.length !== skuDetailsTableData.length) {
  //     lrNoDetailsRefs.current = skuDetailsTableData.map(
  //       (_, index) =>
  //         lrNoDetailsRefs.current[index] || {
  //           partNo: React.createRef(),
  //           batchNo: React.createRef(),
  //           qty: React.createRef()
  //         }
  //     );
  //   }
  // }, [skuDetailsTableData.length]);

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = skuDetailsTableData.map((_, index) => ({
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      batchNo: lrNoDetailsRefs.current[index]?.batchNo || React.createRef(),
      qty: lrNoDetailsRefs.current[index]?.qty || React.createRef()
    }));
  }, [skuDetailsTableData]);

  const [skuDetails, setSkuDetails] = useState([
    {
      id: 1,
      availQty: 100,
      batchNo: '',
      partDesc: '',
      partNo: '',
      qcflag: true,
      // qty: 0,
      remarks: 'TEST',
      sku: 'KG'
    }
  ]);

  useEffect(() => {
    getNewBuyerOrderDocId();
    getAllCurrencies();
    getAllBranches();
    getAllBuyerOrders();
    getAllBuyerList();
    getAllPartNo();
  }, []);

  useEffect(() => {
    const totalQty = skuDetailsTableData.reduce((sum, row) => sum + (parseInt(row.qty, 10) || 0), 0);
    const totalAvlQty = skuDetailsTableData.reduce((sum, row) => sum + (parseInt(row.availQty, 10) || 0), 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      orderQty: totalQty,
      avlQty: totalAvlQty
    }));
    console.log('oq', formData.orderQty);
  }, [skuDetailsTableData]);

  const handleAddRow = () => {
    if (isLastRowEmpty(skuDetailsTableData)) {
      displayRowError(skuDetailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      availQty: '',
      rowBatchNoList: [],
      batchNo: '',
      partDesc: '',
      partNo: '',
      qcflag: '',
      qty: '',
      remarks: '',
      sku: ''
    };
    setSkuDetailsTableData([...skuDetailsTableData, newRow]);
    setSkuDetailsTableErrors([
      ...skuDetailsTableErrors,
      {
        availQty: '',
        batchNo: '',
        partDesc: '',
        partNo: '',
        qcflag: '',
        qty: '',
        remarks: '',
        sku: ''
      }
    ]);
  };

  const handleFullGrid = () => {
    setModalOpen(true);
    handleFullGridFunction();
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFullGridFunction = async () => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getBoSkuDetails?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      console.log('THE WAREHOUSE IS:', response);
      if (response.status === true) {
        const sku = response.paramObjectsMap.skuDetails;
        console.log('THE SKU DETAILS ARE:', sku);

        setSkuDetails(
          sku.map((row) => ({
            id: row.id,
            availQty: row.sqty,
            batchNo: row.batch,
            partDesc: row.partDesc,
            partNo: row.partNo,
            qcflag: row.qcflag,
            qty: row.qty,
            remarks: row.remarks,
            sku: row.sku
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const [skuDetailsTableErrors, setSkuDetailsTableErrors] = useState([
    {
      availQty: '',
      batchNo: '',
      partDesc: '',
      partNo: '',
      qcflag: '',
      qty: '',
      remarks: '',
      sku: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    billto: '',
    branch: '',
    branchCode: '',
    buyerShortName: '',
    client: '',
    company: '',
    createdBy: '',
    currency: '',
    customer: '',
    docDate: new Date(),
    exRate: '',
    finYear: '',
    freeze: false,
    invoiceDate: '',
    invoiceNo: '',
    location: '',
    orderDate: '',
    orderNo: '',
    orgId: orgId,
    reMarks: '',
    refDate: '',
    refNo: '',
    shipTo: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Buyer Order ID', size: 140 },
    { accessorKey: 'docDate', header: 'Buyer Order Date', size: 140 },
    { accessorKey: 'orderNo', header: 'Order No', size: 140 },
    { accessorKey: 'orderDate', header: 'Order Date', size: 140 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'buyerShortName', header: 'Buyer Short Name', size: 140 },
    { accessorKey: 'billToShortName', header: 'Bill To', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getNewBuyerOrderDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getBuyerOrderDocId?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=2024&orgId=${orgId}`
      );
      console.log('API Response:', response);
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.BuyerOrderDocId
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllCurrencies = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/currency?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setCurrencyList(response.paramObjectsMap.currencyVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getAllBuyerList = async () => {
    try {
      const buyerData = await getAllActiveBuyer(loginBranchCode, loginClient, orgId);
      console.log('THE buyerData IS:', buyerData);

      setBuyerList(buyerData);
    } catch (error) {
      console.error('Error fetching buyerData data:', error);
    }
  };

  const getAllBuyerOrders = async () => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getAllBuyerOrderByOrgId?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.buyerOrderVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBuyerOrderById = async (row) => {
    console.log('THE SELECTED BUYER ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `buyerOrder/getAllBuyerOrderById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true && response.paramObjectsMap && response.paramObjectsMap.buyerOrderVO) {
        const particularBuyerOrder = response.paramObjectsMap.buyerOrderVO;
        console.log('THE PARTICULAR BUYER ORDER IS:', particularBuyerOrder);
        getAllCurrencies();

        // Populate form data
        setFormData({
          ...formData,
          docId: particularBuyerOrder.docId,
          docDate: particularBuyerOrder.docDate,
          orderNo: particularBuyerOrder.orderNo,
          orderDate: particularBuyerOrder.orderDate,
          invoiceNo: particularBuyerOrder.invoiceNo,
          invoiceDate: particularBuyerOrder.invoiceDate,
          buyerShortName: particularBuyerOrder.buyerShortName,
          buyerFullName: particularBuyerOrder.buyer,
          currency: particularBuyerOrder.currency,
          exRate: particularBuyerOrder.exRate,
          billto: particularBuyerOrder.billToShortName,
          billtoFullName: particularBuyerOrder.billToName,
          shipTo: particularBuyerOrder.shipToShortName,
          shipToFullName: particularBuyerOrder.shipToName,
          refNo: particularBuyerOrder.refNo,
          refDate: particularBuyerOrder.refDate,
          reMarks: particularBuyerOrder.remarks,
          freeze: particularBuyerOrder.freeze
        });

        particularBuyerOrder.buyerOrderDetailsVO.forEach((bo) => {
          getBatchNo(bo.partNo, bo); // Fetch batch numbers for each part
        });
        // Populate SKU details
        setSkuDetailsTableData(
          particularBuyerOrder.buyerOrderDetailsVO.map((bo) => ({
            id: bo.id,
            partNo: bo.partNo,
            partDesc: bo.partDesc,
            sku: bo.sku,
            batchNo: bo.batchNo, // This may be empty initially
            qty: bo.qty,
            availQty: bo.availQty,
            rowBatchNoList: [] // Initialize as empty
          }))
        );
        setListView(false);
        // Fetch batch numbers for each part number
      } else {
        console.error('API Error or Unexpected Response:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPartNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getPartNoByBuyerOrder?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      // console.log('THE ACTIVE PART DETAILS ARE:', partNoData);

      setPartNoList(response.paramObjectsMap.partNoDetails);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
    }
  };
  const getBatchNo = async (selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getBatchByBuyerOrder?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&partNo=${selectedPartNo}&warehouse=${loginWarehouse}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        setSkuDetailsTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBatchNoList: response.paramObjectsMap.skuDetails
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleBatchNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBatchNo = row.rowBatchNoList.find((row) => row.batch === value);
    setSkuDetailsTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              batchNo: selectedBatchNo.batch,
              expDate: selectedBatchNo.expDate
            }
          : r
      )
    );
    setSkuDetailsTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getAvailQty(value, row.partNo, row);
  };
  const getAvailQty = async (selectedBatchNo, selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getAvlQty?batch=${selectedBatchNo}&branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&partNo=${selectedPartNo}&warehouse=${loginWarehouse}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        setSkuDetailsTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  availQty: response.paramObjectsMap.avalQty
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd } = e.target;

    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;
    const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
    const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    let errorMessage = '';

    switch (name) {
      case 'id':
      case 'shortName':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      case 'pan':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'branchName':
        if (!branchNameRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters and @, _, -, * are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'active') {
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else if (name === 'buyerShortName') {
        const selectedBuyer = buyerList?.find((row) => row.buyerShortName === value);
        console.log('buyer', selectedBuyer);
        if (selectedBuyer) {
          setFormData((prevData) => ({
            ...prevData,
            buyerShortName: value,
            buyerFullName: selectedBuyer.buyer
          }));
        }
      } else if (name === 'billto') {
        const selectedBillTo = buyerList?.find((row) => row.buyerShortName === value);
        console.log('buyer', selectedBillTo);
        if (selectedBillTo) {
          setFormData((prevData) => ({
            ...prevData,
            billto: value,
            billtoFullName: selectedBillTo.buyer
          }));
        }
      } else if (name === 'shipTo') {
        const selectedShipTo = buyerList?.find((row) => row.buyerShortName === value);
        console.log('buyer', selectedShipTo);
        if (selectedShipTo) {
          setFormData((prevData) => ({
            ...prevData,
            shipTo: value,
            shipToFullName: selectedShipTo.buyer
          }));
        }
      } else {
        const formattedValue = value.toUpperCase();
        setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
      }

      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }

    // Preserve cursor position for text inputs
    if (e.target.setSelectionRange && e.target.type !== 'checkbox') {
      setTimeout(() => {
        e.target.setSelectionRange(selectionStart, selectionEnd);
      }, 0);
    }
  };

  const handleDeleteRow = (id, table, setTable) => {
    setTable(table.filter((row) => row.id !== id));
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === skuDetailsTableData) {
      return !lastRow.partNo || !lastRow.partDesc || !lastRow.batchNo || !lastRow.qty;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === skuDetailsTableData) {
      setSkuDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partDesc: !table[table.length - 1].partDesc ? 'Part Desc is required' : '',
          // batchNo: !table[table.length - 1].batchNo ? 'Batch No is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        // if (table === roleTableData) handleAddRow();
        handleAddRow();
      }
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(skuDetails.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSaveSelectedRows1 = () => {
    const selectedData = selectedRows.map((index) => skuDetails[index]);
    setSkuDetailsTableData([...selectedData]);
    console.log('data', selectedData);
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();
  };

  const handleSaveSelectedRows = async () => {
    const selectedData = selectedRows.map((index) => skuDetails[index]);

    setSkuDetailsTableData((prev) => [...selectedData]);

    console.log('Data selected:', selectedData);

    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();

    try {
      await Promise.all(
        selectedData.map(async (data, idx) => {
          const simulatedEvent = {
            target: {
              value: data.batchNo
            }
          };

          await getBatchNo(data.partNo, data);
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      billto: '',
      billtoFullName: '',
      branch: '',
      branchCode: '',
      buyerShortName: '',
      buyerFullName: '',
      client: '',
      company: '',
      createdBy: '',
      currency: '',
      customer: '',
      docDate: dayjs(),
      exRate: '',
      finYear: '',
      freeze: false,
      invoiceDate: dayjs(),
      invoiceNo: '',
      location: '',
      orderDate: dayjs(),
      orderNo: '',
      orgId: orgId,
      reMarks: '',
      refDate: dayjs(),
      refNo: '',
      shipTo: '',
      shipToFullName: ''
    });
    setSkuDetailsTableData([]);
    setFieldErrors({
      billto: '',
      branch: '',
      branchCode: '',
      buyerShortName: '',
      buyerFullName: '',
      client: '',
      company: '',
      createdBy: '',
      currency: '',
      customer: '',
      docDate: null,
      exRate: '',
      finYear: '',
      freeze: false,
      invoiceDate: null,
      invoiceNo: '',
      location: '',
      orderDate: null,
      orderNo: '',
      orgId: orgId,
      reMarks: '',
      refDate: null,
      refNo: '',
      shipTo: ''
    });
    setEditId('');
    getNewBuyerOrderDocId();
  };

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;

    // Validate main form fields
    if (!formData.orderNo) {
      errors.orderNo = 'Order No is required';
    }
    if (!formData.orderDate) {
      errors.orderDate = 'Order Date is required';
    }
    if (!formData.invoiceNo) {
      errors.invoiceNo = 'Invoice No is required';
    }
    if (!formData.invoiceDate) {
      errors.invoiceDate = 'Invoice Date is required';
    }
    if (!formData.buyerShortName) {
      errors.buyerShortName = 'Buyer Short Name is required';
    }
    if (!formData.billto) {
      errors.billto = 'Bill To is required';
    }
    if (!formData.shipTo) {
      errors.shipTo = 'Ship To is required';
    }

    // Validate table data
    let skuDetailsTableDataValid = true;
    const newTableErrors = skuDetailsTableData.map((row, index) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index]?.partNo;
        skuDetailsTableDataValid = false;
      }
      if (!row.batchNo) {
        rowErrors.batchNo = 'Batch No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index]?.batchNo;
        skuDetailsTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'Qty is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index]?.qty;
        skuDetailsTableDataValid = false;
      }
      return rowErrors;
    });

    // Update state with errors
    setSkuDetailsTableErrors(newTableErrors);
    setFieldErrors(errors);

    // Log validation errors for debugging
    console.log('Validation Errors:', errors);
    console.log('Table Validation Errors:', newTableErrors);

    // Block save operation if there are any errors
    if (!skuDetailsTableDataValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
      return; // Stop execution if validation fails
    }

    // Proceed with form submission only if all validations pass
    setIsLoading(true);
    const buyerOrderDetailsDTO = skuDetailsTableData.map((row) => ({
      ...(editId && { id: row.id }),
      partNo: row.partNo,
      partDesc: row.partDesc,
      sku: row.sku,
      batchNo: row.batchNo,
      availQty: row.availQty,
      qty: row.qty,
      remarks: '',
      expDate: row.expDate
    }));

    const saveFormData = {
      ...(editId && { id: editId }),
      billToName: formData.billtoFullName,
      billToShortName: formData.billto,
      branch: loginBranch,
      branchCode: loginBranchCode,
      buyer: formData.buyerFullName,
      buyerOrderDetailsDTO: buyerOrderDetailsDTO,
      buyerShortName: formData.buyerShortName,
      client: loginClient,
      createdBy: loginUserName,
      customer: loginCustomer,
      finYear: loginFinYear,
      invoiceDate: formData.invoiceDate,
      invoiceNo: formData.invoiceNo,
      orderDate: formData.orderDate,
      orderNo: formData.orderNo,
      orgId: parseInt(orgId),
      refDate: formData.refDate,
      refNo: formData.refNo,
      shipToName: formData.shipToFullName,
      shipToShortName: formData.shipTo,
      warehouse: loginWarehouse
    };

    console.log('DATA TO SAVE IS:', saveFormData);

    try {
      const response = await apiCalls('put', `buyerOrder/createUpdateBuyerOrder`, saveFormData);
      console.log('API Response:', response);
      if (response.status === true) {
        handleClear();
        getAllBuyerOrders();
        showToast('success', editId ? 'Buyer Order Updated Successfully' : 'Buyer Order created successfully');
      } else {
        showToast('error', response.paramObjectsMap.errorMessage || 'Buyer Order creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Buyer Order creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleClose = () => {
    setFormData({
      customer: '',
      orderDate: '',
      pan: '',
      contactPerson: '',
      mobile: '',
      gstReg: '',
      email: '',
      groupOf: '',
      tanNo: '',
      address: '',
      country: '',
      state: '',
      city: '',
      gst: '',
      active: true
    });
  };
  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
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
            {formData.freeze ? '' : <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} />}
            <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
          </div>
        </div>
        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            sampleFileDownload={sampleFile}
            handleFileUpload={handleFileUpload}
            apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
            screen="Buyer Order"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getBuyerOrderById} />
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
                  name="docId"
                  value={formData.docId}
                  onChange={handleInputChange}
                  error={!!fieldErrors.docId}
                  helperText={fieldErrors.docId}
                  disabled
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
                <TextField
                  label={
                    <span>
                      Order No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="orderNo"
                  value={formData.orderNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.orderNo}
                  helperText={fieldErrors.orderNo}
                  disabled={formData.freeze}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Order Date"
                      value={formData.orderDate ? dayjs(formData.orderDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('orderDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      disabled={formData.freeze}
                      format="DD-MM-YYYY"
                      error={fieldErrors.orderDate}
                      helperText={fieldErrors.orderDate && 'Required'}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Invoice No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  disabled={formData.freeze}
                  onChange={handleInputChange}
                  error={!!fieldErrors.invoiceNo}
                  helperText={fieldErrors.invoiceNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Invoice Date"
                      value={formData.invoiceDate ? dayjs(formData.invoiceDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('invoiceDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.invoiceDate}
                      helperText={fieldErrors.invoiceDate && 'Required'}
                      disabled={formData.freeze}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.buyerShortName}>
                  <InputLabel id="buyerShortName">
                    {
                      <span>
                        Buyer Short Name <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="buyerShortName"
                    id="buyerShortName"
                    name="buyerShortName"
                    label="Buyer Short Name"
                    value={formData.buyerShortName}
                    onChange={handleInputChange}
                    disabled={formData.freeze}
                  >
                    {buyerList.length > 0 &&
                      buyerList.map((row) => (
                        <MenuItem key={row.id} value={row.buyerShortName.toUpperCase()}>
                          {row.buyerShortName.toUpperCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.buyerShortName && <FormHelperText error>{fieldErrors.buyerShortName}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Buyer Full Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="buyerFullName"
                  value={formData.buyerFullName}
                  error={!!fieldErrors.buyerFullName}
                  helperText={fieldErrors.buyerFullName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.billto}>
                  <InputLabel id="billto">
                    {
                      <span>
                        Bill To <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="billto"
                    id="billto"
                    name="billto"
                    label="Bill To"
                    value={formData.billto}
                    onChange={handleInputChange}
                    disabled={formData.freeze}
                  >
                    {buyerList?.map((row) => (
                      <MenuItem key={row.id} value={row.buyerShortName.toUpperCase()}>
                        {row.buyerShortName.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.billto && <FormHelperText error>{fieldErrors.billto}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Bill To Full Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="billtoFullName"
                  value={formData.billtoFullName}
                  error={!!fieldErrors.billtoFullName}
                  helperText={fieldErrors.billtoFullName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Ref No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={formData.freeze}
                  name="refNo"
                  value={formData.refNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.refNo}
                  helperText={fieldErrors.refNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ref Date"
                      value={formData.refDate ? dayjs(formData.refDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('refDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.refDate}
                      helperText={fieldErrors.refDate && 'Required'}
                      disabled={formData.freeze}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.shipTo}>
                  <InputLabel id="shipTo">
                    {
                      <span>
                        Ship To <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="shipTo"
                    id="shipTo"
                    name="shipTo"
                    label="Ship To"
                    value={formData.shipTo}
                    onChange={handleInputChange}
                    disabled={formData.freeze}
                  >
                    {buyerList?.map((row) => (
                      <MenuItem key={row.id} value={row.buyerShortName.toUpperCase()}>
                        {row.buyerShortName.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.shipTo && <FormHelperText error>{fieldErrors.shipTo}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Ship To Full Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="shipToFullName"
                  value={formData.shipToFullName}
                  error={!!fieldErrors.shipToFullName}
                  helperText={fieldErrors.shipToFullName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Remarks"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="reMarks"
                  value={formData.reMarks}
                  onChange={handleInputChange}
                  error={!!fieldErrors.reMarks}
                  helperText={fieldErrors.reMarks}
                  disabled={formData.freeze}
                />
              </div>
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
                  <Tab value={0} label="SKU Details" />
                  <Tab value={1} label="Summary" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                      </div>
                      {/* Table */}
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Part No *</th>
                                  <th className="px-2 py-2 text-white text-center">Part Desc</th>
                                  <th className="px-2 py-2 text-white text-center">SKU</th>
                                  <th className="px-2 py-2 text-white text-center">Batch No</th>
                                  <th className="px-2 py-2 text-white text-center">Avl QTY</th>
                                  <th className="px-2 py-2 text-white text-center">QTY *</th>
                                </tr>
                              </thead>
                              <tbody>
                                {skuDetailsTableData.map((row, index) => (
                                  <tr key={index}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() => handleDeleteRow(row.id, skuDetailsTableData, setSkuDetailsTableData)}
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        ref={lrNoDetailsRefs.current[index]?.partNo}
                                        value={row.partNo}
                                        disabled={formData.freeze}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const selectedPartNo = partNoList.find((p) => p.partNo === value);

                                          setSkuDetailsTableData((prev) =>
                                            prev.map((r, i) =>
                                              i === index
                                                ? {
                                                    ...r,
                                                    partNo: value,
                                                    partDesc: selectedPartNo ? selectedPartNo.partDesc : '',
                                                    sku: selectedPartNo ? selectedPartNo.sku : ''
                                                  }
                                                : r
                                            )
                                          );
                                          setSkuDetailsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              partNo: !value ? 'Part No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                          getBatchNo(value, row);
                                        }}
                                        className={skuDetailsTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {partNoList?.map((part) => (
                                          <option key={part.id} value={part.partNo}>
                                            {part.partNo}
                                          </option>
                                        ))}
                                      </select>
                                      {skuDetailsTableErrors[index]?.partNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {skuDetailsTableErrors[index].partNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.partDesc}
                                        disabled
                                        className={skuDetailsTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                      />
                                      {skuDetailsTableErrors[index]?.partDesc && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {skuDetailsTableErrors[index].partDesc}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.sku}
                                        disabled
                                        className={skuDetailsTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                      />
                                      {skuDetailsTableErrors[index]?.sku && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {skuDetailsTableErrors[index].sku}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        ref={lrNoDetailsRefs.current[index]?.batchNo}
                                        value={row.batchNo}
                                        disabled={formData.freeze}
                                        // onChange={(e) => {
                                        //   const value = e.target.value;
                                        //   setSkuDetailsTableData((prev) =>
                                        //     prev.map((r, i) => (i === index ? { ...r, batchNo: value.toUpperCase() } : r))
                                        //   );
                                        //   setSkuDetailsTableErrors((prev) => {
                                        //     const newErrors = [...prev];
                                        //     newErrors[index] = {
                                        //       ...newErrors[index],
                                        //       batchNo: !value ? 'Batch No is required' : ''
                                        //     };
                                        //     return newErrors;
                                        //   });
                                        // }}
                                        onChange={(e) => handleBatchNoChange(row, index, e)}
                                        className={skuDetailsTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {Array.isArray(row.rowBatchNoList) &&
                                          row.rowBatchNoList.map(
                                            (g, idx) =>
                                              g &&
                                              g.batch && (
                                                <option key={g.batch} value={g.batch}>
                                                  {g.batch}
                                                </option>
                                              )
                                          )}
                                      </select>
                                      {skuDetailsTableErrors[index]?.batchNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {skuDetailsTableErrors[index].batchNo}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.availQty}
                                        className={skuDetailsTableErrors[index]?.availQty ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {skuDetailsTableErrors[index]?.availQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {skuDetailsTableErrors[index].availQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.qty}
                                        style={{ width: '150px' }}
                                        type="text"
                                        disabled={formData.freeze}
                                        value={row.qty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const intPattern = /^\d*$/;
                                          const intValue = parseInt(value, 10) || 0;

                                          if (intPattern.test(value) || value === '') {
                                            // Check if the entered value is greater than availQty
                                            if (intValue <= row.availQty) {
                                              setSkuDetailsTableData((prev) => {
                                                const updatedData = prev.map((r, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...r,
                                                      qty: intValue
                                                    };
                                                  }
                                                  return r;
                                                });
                                                return updatedData;
                                              });

                                              setSkuDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], qty: '' };
                                                return newErrors;
                                              });
                                            } else {
                                              // Set error if input value exceeds availQty
                                              setSkuDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = { ...newErrors[index], qty: 'Qty cannot be greater than Avail Qty' };
                                                return newErrors;
                                              });
                                            }
                                          } else {
                                            // Set error if input is invalid
                                            setSkuDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], qty: 'Only numbers are allowed' };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        onBlur={() => {
                                          // Ensure that the value on blur is within valid range
                                          setSkuDetailsTableData((prev) => {
                                            const updatedData = prev.map((r, i) => {
                                              if (i === index) {
                                                const correctedQty = Math.min(r.qty, r.availQty);
                                                return {
                                                  ...r,
                                                  qty: correctedQty
                                                };
                                              }
                                              return r;
                                            });
                                            return updatedData;
                                          });
                                        }}
                                        className={skuDetailsTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        onKeyDown={(e) => handleKeyDown(e, row, skuDetailsTableData)}
                                      />
                                      {skuDetailsTableErrors[index]?.qty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {skuDetailsTableErrors[index].qty}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
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
                          label="Order Qty"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="orderQty"
                          value={formData.orderQty}
                          // onChange={handleInputChange}
                          // error={!!fieldErrors.orderQty}
                          // helperText={fieldErrors.orderQty}
                          disabled
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Avl Qty"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="avlQty"
                          value={formData.avlQty}
                          // onChange={handleInputChange}
                          // error={!!fieldErrors.avlQty}
                          // helperText={fieldErrors.avlQty}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}
              </Box>
              <Dialog
                open={modalOpen}
                maxWidth={'md'}
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
                              <th className="px-2 py-2 text-white text-center">Part No *</th>
                              <th className="px-2 py-2 text-white text-center">Part Desc</th>
                              <th className="px-2 py-2 text-white text-center">SKU</th>
                              <th className="px-2 py-2 text-white text-center">Batch No</th>
                              {/* <th className="px-2 py-2 text-white text-center">Qty *</th> */}
                              <th className="px-2 py-2 text-white text-center">Avl. Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {skuDetails.map((row, index) => (
                              <tr key={index}>
                                <td className="border p-0 text-center">
                                  <Checkbox
                                    checked={selectedRows.includes(index)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                    }}
                                  />
                                </td>
                                <td className="text-center p-0">
                                  <div style={{ paddingTop: 12 }}>{index + 1}</div>
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partNo}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partDesc}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.sku}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.batchNo}
                                </td>
                                {/* <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.qty}
                                </td> */}
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.availQty}
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
                  <Button color="secondary" onClick={handleSaveSelectedRows} variant="contained">
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
export default BuyerOrder;
