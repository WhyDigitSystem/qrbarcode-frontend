import axios from 'axios';

import React, { useState, useEffect } from 'react';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import ImageIcon from '@mui/icons-material/Image';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { RiAiGenerate } from 'react-icons/ri';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import AddIcon from '@mui/icons-material/Add';
import CommonListViewTable from '../CommonListViewTable';
import InvoicePdfGen from './InvoicePdfGen';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import apiCalls from 'apicall';
import Typography from '@mui/material/Typography';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs from 'dayjs';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';

const Invoice = () => {
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [downloadPdf, setDownloadPdf] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  const [pdfData, setPdfData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState('');
  const [childTableErrors, setChildTableErrors] = useState([]);
  const [childTableData, setChildTableData] = useState([]);
  const [value, setValue] = useState(0);

  const invoiceDate = dayjs().format('DD-MM-YYYY');
  const [day, month, year] = invoiceDate.split('-');
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const serviceMonth = `${day} ${monthNames[parseInt(month, 10) - 1]}`;

  const [formData, setFormData] = useState({
    img: '',
    customer: '',
    cgst: 0,
    // companyAddress: '',
    dueDate: dayjs().add(30, 'day').format('DD-MM-YYYY'),
    gstType: '',
    tax: 0,
    taxpercentage: '',
    igst: 0,
    invoiceDate: invoiceDate,
    invoiceNo: '',
    term: '',
    notes: '',
    serviceMonth: serviceMonth,
    sgst: 0,
    address: '',
    subTotal: 0,
    termsAndConditions: '',
    total: 0,
    // Bank Details
    bankName: '',
    accountName: '',
    accountNo: '',
    ifsc: ''
  });
  const [modalTableData, setModalTableData] = useState([
    {
      id: 1,
      description: '',
      amount: '',
      quantity: '',
      rate: ''
    }
  ]);

  const [viewId, setViewId] = useState(true);

  const [fieldErrors, setFieldErrors] = useState({
    img: '',
    customer: '',
    cgst: '',
    // companyAddress: '',
    dueDate: '',
    gstType: '',
    tax: '',
    taxpercentage: '',
    igst: '',
    invoiceDate: '',
    invoiceNo: '',
    term: '',
    notes: '',
    serviceMonth: '',
    sgst: '',
    address: '',
    subTotal: '',
    termsAndConditions: '',
    total: '',
    // Bank Details
    bankName: '',
    accountName: '',
    accountNo: '',
    ifsc: ''
  });
  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    { accessorKey: 'invoiceNo', header: 'Invoice Num', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'dueDate', header: 'Due Date', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllTaxInvoice();
    getTaxInvoiceById();
    getTaxInvoiceImageById();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const handleAddRow = () => {
    if (isLastRowEmpty(childTableData)) {
      displayRowError(childTableData);
      return;
    }

    const newRow = { id: Date.now(), description: '', amount: '', quantity: '', rate: '' };
    setChildTableData([...childTableData, newRow]);
    setChildTableErrors([...childTableErrors, { description: '', amount: '', quantity: '', rate: '' }]);
    setViewId(false);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === childTableData) {
      return !lastRow.rate || !lastRow.quantity || !lastRow.amount || !lastRow.description;
    }
    return false;
  };

  const displayRowError = (table) => {
    setChildTableErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      const lastRow = table[table.length - 1];

      newErrors[table.length - 1] = {
        description: !lastRow.description ? 'Description is required' : '',
        quantity: !lastRow.quantity ? 'Quantity is required' : '',
        rate: !lastRow.rate ? 'Rate is required' : '',
        amount: !lastRow.amount ? 'Amount is required' : ''
      };

      return newErrors;
    });
  };

  const getAllTaxInvoice = async () => {
    try {
      const response = await apiCalls('get', `master/getAllTaxInvoice`);
      console.log('API Response:', response);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.taxInvoiceVO);
        // getTaxInvoiceById();
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getTaxInvoiceImageById = async (row) => {
    console.log('THE SELECTED image row ID IS:', row);
    // setViewId(id);
    try {
      const response = await apiCalls('get', `master/uploadImageForTaxInvoice?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularImage = response.paramObjectsMap.taxInvoiceVO;
        console.log('THE PARTICULAR Invoice Num DATA IS:', particularImage);
        setFormData({
          img: particularImage.img
        });

        setViewId(false);
        // setViewId(row);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getTaxInvoiceById = async (row) => {
    console.log('THE SELECTED row ID IS:', row);
    // setViewId(id);
    try {
      const response = await apiCalls('get', `master/getTaxInvoiceById?id=${row.original.id}`);
      // handleFileUpload(response.paramObjectsMap.taxInvoiceVO.id);
      // console.log('API Response:', response);

      if (response.status === true) {
        getTaxInvoiceImageById();
        setListView(false);
        const particularInvoiceNo = response.paramObjectsMap.taxInvoiceVO;
        console.log('THE PARTICULAR Invoice Num DATA IS:', particularInvoiceNo);
        setFormData({
          accountName: particularInvoiceNo.accountName,
          taxInvoiceimage: particularInvoiceNo.img,
          taxpercentage: particularInvoiceNo.tax,
          accountNo: particularInvoiceNo.accountNo,
          bankName: particularInvoiceNo.bankName,
          ifsc: particularInvoiceNo.ifsc,
          customer: particularInvoiceNo.customer,
          cgst: particularInvoiceNo.cgst,
          // companyAddress: particularInvoiceNo.companyAddress,
          dueDate: particularInvoiceNo.dueDate
            ? dayjs(particularInvoiceNo.dueDate).add(30, 'day').format('DD-MM-YYYY')
            : dayjs().add(30, 'day').format('DD-MM-YYYY'),
          gstType: particularInvoiceNo.gstType,
          igst: particularInvoiceNo.igst,
          invoiceDate: particularInvoiceNo.invoiceDate ? dayjs(particularInvoiceNo.invoiceDate).format('DD-MM-YYYY') : dayjs(),
          invoiceNo: particularInvoiceNo.invoiceNo,
          notes: particularInvoiceNo.notes,
          serviceMonth: particularInvoiceNo.serviceMonth,
          sgst: particularInvoiceNo.sgst,
          address: particularInvoiceNo.address,
          subTotal: particularInvoiceNo.subTotal,
          termsAndConditions: particularInvoiceNo.termsAndConditions,
          term: particularInvoiceNo.term,
          total: particularInvoiceNo.total
        });

        const mappedData = particularInvoiceNo.productLines.map((detail) => ({
          id: detail.id,
          amount: detail.amount,
          description: detail.description,
          quantity: detail.quantity,
          rate: detail.rate
        }));

        console.log('Mapped Data for Child Table:', mappedData);

        setChildTableData(mappedData);
        getTaxInvoiceImageById();
        setViewId(false);
        // setViewId(row);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Validation for individual fields
  const validateField = (field, value, formData) => {
    let error = '';
    const codeRegex = /^[A-Za-z0-9]+$/; // For invoice number validation

    const requiredFields = ['invoiceNo', 'term', 'customer', 'address', 'serviceMonth', 'notes', 'dueDate'];

    if (requiredFields.includes(field) && !value) {
      return `${field.replace(/([A-Z])/g, ' $1')} is required`.replace(/^./, (str) => str.toUpperCase());
    }

    if (field === 'invoiceNo' && !codeRegex.test(value)) {
      error = 'Invalid Invoice Number';
    }

    return error;
  };

  // Enhanced handleInputChange for dynamic form and table validation
  const handleInputChange = (e, index, field) => {
    const { name, value } = e.target;
    let error = '';

    if (typeof index === 'number') {
      const updatedRows = [...childTableData];
      if (!updatedRows[index]) return;

      updatedRows[index][field] = field === 'quantity' || field === 'rate' || field === 'amount' ? parseFloat(value) || 0 : value;

      if (field === 'quantity' || field === 'rate') {
        const quantity = parseFloat(updatedRows[index].quantity) || 0;
        const rate = parseFloat(updatedRows[index].rate) || 0;
        updatedRows[index].amount = (quantity * rate).toFixed(2);
      }

      error = validateField(field, updatedRows[index][field], formData);
      const newTableErrors = [...childTableErrors];
      newTableErrors[index] = newTableErrors[index] || {};
      newTableErrors[index][field] = error;

      setChildTableErrors(newTableErrors);
      setChildTableData(updatedRows);
      calculateTotalAmount(updatedRows);
    } else {
      const updatedFormData = {
        ...formData,
        [name]: name === 'cgst' || name === 'sgst' || name === 'igst' || name === 'taxpercentage' ? parseFloat(value) || 0 : value
      };

      error = validateField(name, updatedFormData[name], updatedFormData);
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      setFormData(updatedFormData);
    }
  };

  const handleSave = async () => {
    const errors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) errors[field] = error;
    });

    let childTableDataValid = true;
    const newTableErrors = [];
    childTableData.forEach((row, index) => {
      const rowErrors = {};
      if (!row.description) rowErrors.description = 'Description is required';
      if (!row.quantity) rowErrors.quantity = 'Quantity is required';
      if (!row.rate) rowErrors.rate = 'Rate is required';
      if (!row.amount) rowErrors.amount = 'Amount is required';

      if (Object.keys(rowErrors).length > 0) {
        childTableDataValid = false;
        newTableErrors[index] = rowErrors;
      }
    });

    setFieldErrors(errors);
    setChildTableErrors(newTableErrors);

    if (!childTableDataValid || Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      const childVO = childTableData.map((row) => ({
        description: row.description,
        quantity: row.quantity,
        rate: row.rate,
        amount: row.amount
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        createdBy: loginUserName,
        productLines: childVO,
        customer: formData.customer,
        cgst: formData.cgst,
        dueDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
        gstType: formData.gstType,
        tax: formData.taxpercentage,
        igst: formData.igst,
        invoiceDate: dayjs().format('YYYY-MM-DD'),
        invoiceNo: formData.invoiceNo,
        term: formData.term,
        notes: formData.notes,
        serviceMonth: formData.serviceMonth,
        sgst: formData.sgst,
        address: formData.address,
        termsAndConditions: formData.termsAndConditions,
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNo: formData.accountNo,
        ifsc: formData.ifsc,
        taxInvoiceimage: formData.taxInvoiceimage || '' 
      };

      console.log('Data to Save:', saveFormData); 

      //
      const response = await apiCalls('put', `master/createUpdateTaxInvoice`, saveFormData);
      if (response.status) {
        handleClear();
        getAllTaxInvoice();
        handleFileUpload(response.paramObjectsMap.taxInvoiceVO.id);
        console.log('Response:', response);
        showToast('success', editId ? 'Invoice Updated Successfully' : 'Invoice created successfully');
      } else {
        showToast('error', response.paramObjectsMap.message || 'Invoice Creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Invoice failed');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalAmount = (rows) => {
    let subTotal = rows.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);

    let taxAmount = 0;

    if (formData.gstType === 'Intra') {
      const cgst = parseFloat(formData.cgst) || 0;
      const sgst = parseFloat(formData.sgst) || 0;
      taxAmount = (subTotal * (cgst + sgst)) / 100;
    } else if (formData.gstType === 'Inter') {
      const igst = parseFloat(formData.igst) || 0;
      taxAmount = (subTotal * igst) / 100;
    } else if (formData.tax === 'OTHERS') {
      const taxPercentage = parseFloat(formData.taxpercentage) || 0;
      taxAmount = (subTotal * taxPercentage) / 100;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      subTotal: subTotal.toFixed(2),
      total: (subTotal + taxAmount).toFixed(2)
    }));
  };

  const handleDeleteRow = (id) => {
    const updatedTableData = childTableData.filter((row) => row.id !== id);
    const updatedTableErrors = childTableErrors.filter((_, index) => childTableData[index].id !== id);

    setChildTableData(updatedTableData);
    setChildTableErrors(updatedTableErrors);
  };

  const handleTableClear = () => {
    setChildTableErrors([]);
    setChildTableData({
      amount: '',
      description: '',
      quantity: '',
      rate: ''
    });
  };

  const handleClear = () => {
    setFile('');
    setFormData({
      img: '',
      customer: '',
      cgst: '',
      // companyAddress: '',
      dueDate: dayjs().add(30, 'day').format('DD-MM-YYYY'),
      gstType: '',
      tax: '',
      taxpercentage: '',
      igst: '',
      invoiceDate: dayjs().format('DD-MM-YYYY'),
      invoiceNo: '',
      term: '',
      notes: '',
      serviceMonth: serviceMonth,
      sgst: '',
      address: '',
      subTotal: '',
      termsAndConditions: '',
      total: '',
      // Bank Details
      bankName: '',
      accountName: '',
      accountNo: '',
      ifsc: ''
    });
    setFieldErrors({
      customer: '',
      cgst: '',
      // companyAddress: '',
      dueDate: '',
      gstType: '',
      tax: '',
      taxpercentage: '',
      igst: '',
      invoiceDate: '',
      invoiceNo: '',
      term: '',
      notes: '',
      serviceMonth: '',
      sgst: '',
      address: '',
      subTotal: '',
      termsAndConditions: '',
      total: '',
      // Bank Details
      bankName: '',
      accountName: '',
      accountNo: '',
      ifsc: ''
    });
    setChildTableErrors([]);
    setChildTableData([]);
  };

  const handleTapChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleView = () => {
    setListView(!listView);
    setDownloadPdf(false);
  };

  const GeneratePdf = (row) => {
    console.log('PDF Data :', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };

  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (imgId) => {
    if (!file) {
      showToast('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/master/uploadImageForTaxInvoice?id=${imgId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File Upload Success:', response.data);
      showToast('success', editId ? 'Invoice Updated Successfully' : 'Invoice created successfully');
      showToast('File uploaded successfully!');
    } catch (error) {
      console.error('File Upload Error:', error);
      showToast('Failed to upload file');
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
        
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getTaxInvoiceById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
            {downloadPdf && <InvoicePdfGen row={pdfData} />}
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <input type="file" onChange={handleFileChange} />
                {/* // onClick={handleFileUpload} */}
                
                {/* <Button
                    variant="contained"
                    component="span"
                    startIcon={<FaCloudUploadAlt />}
                    onClick={handleFileUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button> */}
                {/* <TextField
                  type="file"
                  name="img"
                  onChange={handleImage}
                  label="Image Upload"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formData.img}
                  error={!!fieldErrors.img}
                  helperText={fieldErrors.img}
                /> */}
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
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Invoice Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  error={!!fieldErrors.invoiceDate}
                  helperText={fieldErrors.invoiceDate}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Term"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  error={!!fieldErrors.term}
                  helperText={fieldErrors.term}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Due Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  error={!!fieldErrors.dueDate}
                  helperText={fieldErrors.dueDate}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Customer"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  error={!!fieldErrors.customer}
                  helperText={fieldErrors.customer}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!fieldErrors.address}
                  helperText={fieldErrors.address}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Service Month"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="serviceMonth"
                  value={formData.serviceMonth}
                  onChange={handleInputChange}
                  error={!!fieldErrors.serviceMonth}
                  helperText={fieldErrors.serviceMonth}
                  disabled
                />
              </div>

              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="Company Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  error={!!fieldErrors.companyAddress}
                  helperText={fieldErrors.companyAddress}
                />
              </div> */}

              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" size="small" fullWidth error={!!fieldErrors.tax}>
                  <InputLabel>Tax</InputLabel>
                  <Select name="tax" value={formData.tax} onChange={handleInputChange} label="Tax">
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="INDIA">INDIA</MenuItem>
                    <MenuItem value="OTHERS">OTHERS</MenuItem>
                  </Select>
                  <FormHelperText>{fieldErrors.tax}</FormHelperText>
                </FormControl>
              </div>

              {formData.tax === 'OTHERS' && (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Tax Percentage %"
                    variant="outlined"
                    type="number"
                    size="small"
                    fullWidth
                    name="taxpercentage"
                    value={formData.taxpercentage}
                    onChange={handleInputChange}
                    error={!!fieldErrors.taxpercentage}
                    helperText={fieldErrors.taxpercentage}
                  />
                </div>
              )}

              {formData.tax === 'INDIA' && (
                <div className="col-md-3 mb-3">
                  <FormControl variant="outlined" size="small" fullWidth error={!!fieldErrors.gstType}>
                    <InputLabel>GST Type</InputLabel>
                    <Select name="gstType" value={formData.gstType} onChange={handleInputChange} label="gstType">
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="Intra">Intra</MenuItem>
                      <MenuItem value="Inter">Inter</MenuItem>
                    </Select>
                    <FormHelperText>{fieldErrors.gstType}</FormHelperText>
                  </FormControl>
                </div>
              )}

              {formData.gstType === 'Inter' && formData.tax === 'INDIA' && (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="IGST"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="igst"
                    value={formData.igst}
                    onChange={handleInputChange}
                    error={!!fieldErrors.igst}
                    helperText={fieldErrors.igst}
                  />
                </div>
              )}

              {formData.gstType === 'Intra' && formData.tax === 'INDIA' && (
                <>
                  <div className="col-md-3 mb-3">
                    <TextField
                      label="CGST"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="cgst"
                      value={formData.cgst}
                      onChange={handleInputChange}
                      error={!!fieldErrors.cgst}
                      helperText={fieldErrors.cgst}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <TextField
                      label="SGST"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="sgst"
                      value={formData.sgst}
                      onChange={handleInputChange}
                      error={!!fieldErrors.sgst}
                      helperText={fieldErrors.sgst}
                    />
                  </div>
                </>
              )}

              <div className="col-md-3 mb-3">
                <TextField
                  label="Subtotal"
                  variant="outlined"
                  type="number"
                  size="small"
                  fullWidth
                  name="subTotal"
                  value={formData.subTotal}
                  onChange={handleInputChange}
                  error={!!fieldErrors.subTotal}
                  helperText={fieldErrors.subTotal}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Total"
                  variant="outlined"
                  type="number"
                  size="small"
                  fullWidth
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  error={!!fieldErrors.total}
                  helperText={fieldErrors.total}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <TextField
                  label="Terms and Conditions"
                  variant="outlined"
                  size="medium"
                  fullWidth
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  error={!!fieldErrors.termsAndConditions}
                  helperText={fieldErrors.termsAndConditions}
                />
              </div>

              <div className="col-md-6 mb-3">
                <TextField
                  label="Notes"
                  variant="outlined"
                  size="medium"
                  fullWidth
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  error={!!fieldErrors.notes}
                  helperText={fieldErrors.notes}
                />
              </div>
            </div>
            <>
              <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleTapChange} aria-label="Invoice Tabs">
                  <Tab label="Item Details" />
                  <Tab label="Bank Details" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  {value === 0 && (
                    <div variant="body1">
                      <>
                        <div className="row ">
                          <div className="mb-2 d-flex">
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                            <ActionButton title="Clear" icon={ClearIcon} onClick={handleTableClear} />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered" style={{ width: '100%' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    {!viewId && (
                                      <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                        Action
                                      </th>
                                    )}
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center">Description*</th>
                                    <th className="px-2 py-2 text-white text-center">Quantity *</th>
                                    <th className="px-2 py-2 text-white text-center">Rate *</th>
                                    <th className="px-2 py-2 text-white text-center">Amount *</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {childTableData.length === 0 ? (
                                    <tr>
                                      <td colSpan="18" className="text-center py-2">
                                        No Data Found
                                      </td>
                                    </tr>
                                  ) : (
                                    childTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        {!viewId && (
                                          <td className="border px-2 py-2 text-center">
                                            <ActionButton
                                              title="Delete"
                                              icon={DeleteIcon}
                                              onClick={() => {
                                                console.log('Row data:', row);

                                                handleDeleteRow(
                                                  row.id,
                                                  childTableData,
                                                  setChildTableData,
                                                  childTableErrors,
                                                  setChildTableErrors
                                                );
                                              }}
                                            />
                                          </td>
                                        )}
                                        <td className="text-center">{index + 1}</td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.description}
                                            onChange={(e) => handleInputChange(e, index, 'description')}
                                            className={childTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                          />
                                          {childTableErrors[index]?.description && (
                                            <div className="text-danger">{childTableErrors[index].description}</div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.quantity}
                                            onChange={(e) => handleInputChange(e, index, 'quantity')}
                                            className={childTableErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                          />
                                          {childTableErrors[index]?.quantity && (
                                            <div className="text-danger">{childTableErrors[index].quantity}</div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.rate}
                                            onChange={(e) => handleInputChange(e, index, 'rate')}
                                            className={childTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                          />
                                          {childTableErrors[index]?.rate && (
                                            <div className="text-danger">{childTableErrors[index].rate}</div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.amount}
                                            disabled
                                            onChange={(e) => handleInputChange(e, index, 'amount')}
                                            className={childTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                          />
                                          {childTableErrors[index]?.amount && (
                                            <div className="text-danger">{childTableErrors[index].amount}</div>
                                          )}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  )}
                  {value === 1 && (
                    <div variant="body1">
                      <>
                        <div className="row">
                          <div className="col-md-3">
                            <TextField
                              size="small"
                              fullWidth
                              label="Bank Name"
                              margin="normal"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleInputChange}
                              error={!!fieldErrors.bankName}
                              helperText={fieldErrors.bankName}
                            />
                          </div>
                          <div className="col-md-3">
                            <TextField
                              size="small"
                              fullWidth
                              label="Account No"
                              margin="normal"
                              name="accountNo"
                              value={formData.accountNo}
                              onChange={handleInputChange}
                              error={!!fieldErrors.accountNo}
                              helperText={fieldErrors.accountNo}
                            />
                          </div>
                          <div className="col-md-3">
                            <TextField
                              size="small"
                              fullWidth
                              label="Account Name"
                              margin="normal"
                              name="accountName"
                              value={formData.accountName}
                              onChange={handleInputChange}
                              error={!!fieldErrors.accountName}
                              helperText={fieldErrors.accountName}
                            />
                          </div>
                          <div className="col-md-3">
                            <TextField
                              size="small"
                              fullWidth
                              label="IFSC"
                              margin="normal"
                              name="ifsc"
                              value={formData.ifsc}
                              onChange={handleInputChange}
                              error={!!fieldErrors.ifsc}
                              helperText={fieldErrors.ifsc}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  )}
                </Box>
              </Box>
            </>
          </>
        )}
      </div>
    </>
  );
};

export default Invoice;
