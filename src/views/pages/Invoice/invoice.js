import axios from 'axios';

import React, { useState, useEffect } from 'react';
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

  const [file, setFile] = useState(null);
  const [downloadPdf, setDownloadPdf] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pdfData, setPdfData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
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
    billToAddress: '',
    cgst: '',
    companyAddress: '',
    dueDate: dayjs().add(30, 'day').format('DD-MM-YYYY'),
    gstType: '',
    tax: '',
    taxpercentage: '',
    igst: '',
    invoiceDate: invoiceDate,
    invoiceNo: '',
    term: '',
    notes: '',
    serviceMonth: serviceMonth,
    sgst: '',
    shipToAddress: '',
    subTotal: '',
    termsAndConditions: '',
    total: '',
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

  const [rows, setRows] = useState([]);
  const [viewId, setViewId] = useState(true);

  const [fieldErrors, setFieldErrors] = useState({
    billToAddress: '',
    cgst: '',
    companyAddress: '',
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
    shipToAddress: '',
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
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

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

  const getTaxInvoiceById = async (row) => {
    console.log('THE SELECTED row ID IS:', row);
    // setViewId(id);
    try {
      const response = await apiCalls('get', `master/getTaxInvoiceById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularInvoiceNo = response.paramObjectsMap.taxInvoiceVO;
        console.log('THE PARTICULAR Invoice Num DATA IS:', particularInvoiceNo);
        setFormData({
          accountName: particularInvoiceNo.accountName,
          taxpercentage: particularInvoiceNo.tax,
          accountNo: particularInvoiceNo.accountNo,
          bankName: particularInvoiceNo.bankName,
          ifsc: particularInvoiceNo.ifsc,
          billToAddress: particularInvoiceNo.billToAddress,
          cgst: particularInvoiceNo.cgst,
          companyAddress: particularInvoiceNo.companyAddress,
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
          shipToAddress: particularInvoiceNo.shipToAddress,
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
        setViewId(false);
        // setViewId(row);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.tax) {
      errors.tax = 'Tax Percentage is required';
    } else if (formData.tax === 'India') {
      if (!formData.gstType) {
        errors.gstType = 'GST Type is required';
      }
      if (formData.gstType === 'Intra') {
        if (!formData.cgst) errors.cgst = 'CGST is required';
        if (!formData.sgst) errors.sgst = 'SGST is required';
        formData.taxpercentage = '';
        formData.igst = '';
      } else if (formData.gstType === 'Inter') {
        if (!formData.igst) errors.igst = 'IGST is required';
        formData.taxpercentage = '';
        formData.cgst = '';
        formData.sgst = '';
      }
    } else if (formData.tax === 'Others') {
      if (!formData.taxpercentage) errors.tax = 'Tax Percentage is required';
      formData.gstType = '';
      formData.cgst = '';
      formData.sgst = '';
      formData.igst = '';
    }

    let childTableDataValid = true;
    const newTableErrors = [];

    if (!Array.isArray(childTableData) || childTableData.length === 0) {
      childTableDataValid = false;
      newTableErrors.push({ general: 'Table Data is required' });
    } else {
      childTableData.forEach((row, index) => {
        const rowErrors = {};

        if (!row.amount) rowErrors.amount = 'Amount is required';
        if (!row.rate) rowErrors.rate = 'Rate is required';
        if (!row.quantity) rowErrors.quantity = 'Quantity is required';
        if (!row.description) rowErrors.description = 'Description is required';

        if (Object.keys(rowErrors).length > 0) {
          childTableDataValid = false;
          newTableErrors[index] = rowErrors;
        }
      });
    }

    setChildTableErrors(newTableErrors);

    // If validation fails, don't proceed
    if (!childTableDataValid || Object.keys(errors).length > 0) {
      console.log('noerrors');
      setFieldErrors(errors);
      return false;
    }

    setIsLoading(true);
    // const requiredFields = [
    //   'termsAndConditions',
    //   'subTotal',
    //   'total',
    //   'bankName',
    //   'accountName',
    //   'accountNo',
    //   'ifsc',
    //   'invoiceNo',
    //   'dueDate',
    //   'invoiceDate',
    //   'serviceMonth',
    //   'companyAddress',
    //   'billToAddress',
    //   'shipToAddress'
    // ];

    // requiredFields.forEach((field) => {
    //   if (!formData[field]) {
    //     console.log('allok');

    //     errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
    //   }
    // });

    const childVO = childTableData.map((row) => ({
      amount: row.amount,
      description: row.description,
      quantity: row.quantity,
      rate: row.rate
    }));

    const saveFormData = {
      ...(editId && { id: editId }),
      createdBy: loginUserName,
      orgId: 1,
      productLines: childVO,
      billToAddress: formData.billToAddress,
      cgst: formData.cgst,
      companyAddress: formData.companyAddress,
      dueDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
      gstType: formData.gstType,
      tax: formData.taxpercentage,
      // taxpercentage: formData.taxpercentage,
      igst: formData.igst,
      invoiceDate: dayjs().format('YYYY-MM-DD'),
      invoiceNo: formData.invoiceNo,
      term: formData.term,
      notes: formData.notes,
      serviceMonth: formData.serviceMonth,
      sgst: formData.sgst,
      shipToAddress: formData.shipToAddress,
      subTotal: formData.subTotal,
      termsAndConditions: formData.termsAndConditions,
      total: formData.total,
      // Bank Details
      bankName: formData.bankName,
      accountName: formData.accountName,
      accountNo: formData.accountNo,
      ifsc: formData.ifsc
    };

    console.log('DATA TO SAVE IS:', saveFormData);

    try {
      const response = await apiCalls('put', `master/createUpdateTaxInvoice`, saveFormData);
      if (response.status) {
        console.log('Response:', response);
        handleClear();
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

  const validateField = (field, value, formData) => {
    let error = '';

    // Regular expressions for different field types
    const numberRegex = /^[0-9]+$/; // Only digits
    const decimalRegex = /^\d+(\.\d{1,2})?$/; // Validates decimal numbers
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/; // DD-MM-YYYY format
    const codeRedex = /^[A-Za-z0-9]+$/;

    // switch (field) {
    //   case 'invoiceNo':
    //     if (!value) {
    //       error = 'Invoice Number is required';
    //     } else if (!codeRedex.test(value)) {
    //       error = 'Invalid Invoice Number';
    //     }
    //     break;
    //   case 'tax':
    //     if (formData.tax === 'India') {
    //       if (!value) {
    //         error = 'Tax Percentage is required';
    //       }
    //       //  else if (!value) {
    //       //   error = 'Tax Percentage must be a valid number with up to 2 decimal places';
    //       // }
    //     }
    //     break;
    //   case 'cgst':
    //   case 'sgst':
    //     if (formData.gstType === 'Inter') {
    //       if (!value) {
    //         error = `${field} is required`;
    //       }
    //       //  else if (!decimalRegex.test(value)) {
    //       //   error = `${field} must be a valid number (up to 2 decimal places)`;
    //       // }
    //     }
    //     break;
    //   case 'subTotal':
    //   case 'total':
    //   case 'amount':
    //     if (!value) {
    //       error = 'This field is required';
    //     } else if (!decimalRegex.test(value)) {
    //       error = 'Must be a valid number (up to 2 decimal places)';
    //     }
    //     break;
    //   case 'invoiceDate':
    //   case 'dueDate':
    //     if (!value) {
    //       error = 'Date is required';
    //     } else if (!dateRegex.test(value)) {
    //       error = 'Invalid date format (DD-MM-YYYY)';
    //     }
    //     break;
    //   default:
    //     break;
    // }

    return error;
  };

  const handleInputChange = (e, index, fieldName) => {
    const { name, value } = e.target;

    // Update form data before validating
    const updatedFormData = { ...formData, [name]: value };
    const error = validateField(name, value, updatedFormData);

    if (typeof index === 'number') {
      const updatedChildTableData = [...childTableData];
      updatedChildTableData[index][fieldName] = value;

      const updatedChildTableErrors = [...childTableErrors];
      updatedChildTableErrors[index][fieldName] = error;

      setChildTableData(updatedChildTableData);
      setChildTableErrors(updatedChildTableErrors);
    } else {
      const updatedFieldErrors = { ...fieldErrors, [name]: error };

      setFormData(updatedFormData);
      setFieldErrors(updatedFieldErrors);
    }
  };

  const handleDeleteRow = (id) => {
    const updatedTableData = childTableData.filter((row) => row.id !== id);
    const updatedTableErrors = childTableErrors.filter((_, index) => childTableData[index].id !== id);

    setChildTableData(updatedTableData);
    setChildTableErrors(updatedTableErrors);
  };

  const handleClear = () => {
    setFormData({
      billToAddress: '',
      cgst: '',
      companyAddress: '',
      dueDate: dayjs().add(30, 'day').format('DD-MM-YYYY'),
      gstType: '',
      tax: '',
      taxpercentage: '',
      igst: '',
      invoiceDate: dayjs().format('DD-MM-YYYY'),
      invoiceNo: '',
      term: '',
      notes: '',
      serviceMonth: '',
      sgst: '',
      shipToAddress: '',
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
      billToAddress: '',
      cgst: '',
      companyAddress: '',
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
      shipToAddress: '',
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

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            {/* <ActionButton title="Upload" type="file" accept="image/*" icon={ImageIcon} onClick={handleImageChange} /> */}
            <div>
              {/* <input
                accept="image/*"
                style={{ display: 'none' }} // Hide input
                id="upload-button"
                type="file"
                onChange={handleImageChange}
              />

              <label htmlFor="upload-button">
                <Button variant="contained" component="span" startIcon={<ImageIcon />}>
                  Upload Image
                </Button>
              </label> */}

              {/* {selectedImage && (
                <div style={{ marginTop: '20px' }}>
                  <img src={selectedImage} alt="Selected" width="200px" height="200px" />
                </div>
              )} */}
            </div>
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
                />
              </div>

              <div className="col-md-6 mb-3">
                <TextField
                  label="Customer"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="billToAddress"
                  value={formData.billToAddress}
                  onChange={handleInputChange}
                  error={!!fieldErrors.billToAddress}
                  helperText={fieldErrors.billToAddress}
                />
              </div>

              <div className="col-md-6 mb-3">
                <TextField
                  label="Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="shipToAddress"
                  value={formData.shipToAddress}
                  onChange={handleInputChange}
                  error={!!fieldErrors.shipToAddress}
                  helperText={fieldErrors.shipToAddress}
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
                />
              </div>

              <div className="col-md-3 mb-3">
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
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" size="small" fullWidth error={!!fieldErrors.tax}>
                  <InputLabel>Tax</InputLabel>
                  <Select name="tax" value={formData.tax} onChange={handleInputChange} label="Tax">
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                  <FormHelperText>{fieldErrors.tax}</FormHelperText>
                </FormControl>
              </div>

              {formData.tax === 'Others' && (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Tax Percentage %"
                    variant="outlined"
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

              {formData.tax === 'India' && (
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

              {formData.gstType === 'Inter' && formData.tax === 'India' && (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="IGST"
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

              {formData.gstType === 'Intra' && formData.tax === 'India' && (
                <>
                  <div className="col-md-3 mb-3">
                    <TextField
                      label="CGST"
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
                  size="small"
                  fullWidth
                  name="subTotal"
                  value={formData.subTotal}
                  onChange={handleInputChange}
                  error={!!fieldErrors.subTotal}
                  helperText={fieldErrors.subTotal}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Total"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  error={!!fieldErrors.total}
                  helperText={fieldErrors.total}
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
                            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
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
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                        </td>
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
                                            type="text"
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
                                            type="text"
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
                                            type="text"
                                            value={row.amount}
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
                              label="Account No:"
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
