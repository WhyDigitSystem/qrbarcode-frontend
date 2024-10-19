import axios from 'axios';

import React, { useState, useEffect } from 'react';
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
  const [pdfData, setPdfData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState('');
  const [childTableErrors, setChildTableErrors] = useState([]);
  const [childTableData, setChildTableData] = useState([]);

  const [value, setValue] = useState(0);

  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    // { accessorKey: 'bankName', header: 'Bank Name', size: 140

    { accessorKey: 'invoiceNo', header: 'Invoice Num', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'dueDate', header: 'Due Date', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllTaxInvoice();
  }, []);

  // const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [formData, setFormData] = useState({
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
    iFSC: ''
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
  const [viewId, setViewId] = useState('');

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
    iFSC: ''
  });
  const [productLinesErrorsTable, setProductLinesErrorsTable] = useState({
    description: '',
    amount: '',
    quantity: '',
    rate: ''
  });

  const handleAddRow = () => {
    console.log('THE HANDLE ADD ROW FUNCTION IS WORKING');

    if (isLastRowEmpty(childTableData)) {
      displayRowError(childTableData);
      console.log('Last Row is Empty');
      return;
    }
    console.log('the ok');

    const newRow = {
      id: Date.now(),
      description: '',
      amount: '',
      quantity: '',
      rate: ''
    };
    setChildTableData([...childTableData, newRow]);
    setChildTableErrors([
      ...childTableErrors,
      {
        description: '',
        amount: '',
        quantity: '',
        rate: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === childTableData) {
      return !lastRow.partDesc || !lastRow.partNo || !lastRow.qrcodevalue || !lastRow.barcodevalue || !lastRow.batchno;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === childTableData) {
      setChildTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          description: !table[table.length - 1].description ? 'description is required' : '',
          quantity: !table[table.length - 1].quantity ? 'quantity is required' : '',
          rate: !table[table.length - 1].rate ? 'rate is required' : '',
          amount: !table[table.length - 1].amount ? 'amount is required' : ''
        };
        return newErrors;
      });
    }
  };

  const getAllTaxInvoice = async () => {
    try {
      const response = await apiCalls('get', `master/getAllTaxInvoice`);
      console.log('API Response:', response);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.taxInvoiceVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.cgst) errors.cgst = 'cgst is required';
    if (!formData.termsAndConditions) errors.termsAndConditions = 'termsAndConditions is required';
    if (!formData.sgst) errors.sgst = 'sgst is required';
    if (!formData.gstType) errors.gstType = 'gstType is required';
    if (!formData.tax) errors.tax = 'Tax is required';
    if (!formData.taxpercentage) errors.taxpercentage = 'Taxpercentage is required';
    if (!formData.notes) errors.notes = 'notes is required';
    if (!formData.igst) errors.igst = 'igst is required';
    if (!formData.subTotal) errors.subTotal = 'subTotal is required';
    if (!formData.total) errors.total = 'total is required';
    if (!formData.bankName) errors.bankName = 'Bank Name is required';
    if (!formData.accountName) errors.accountName = 'Account Name is required';
    if (!formData.accountNo) errors.accountNo = 'Account No is required';
    if (!formData.iFSC) errors.iFSC = 'IFSC Code is required';
    if (!formData.invoiceNo) errors.invoiceNo = 'Invoice Num is required';
    if (!formData.term) errors.term = 'Term is required';
    if (!formData.companyAddress) errors.companyAddress = 'Address is required';
    if (!formData.invoiceDate) errors.invoiceDate = 'Invoice Date is required';
    if (!formData.dueDate) errors.dueDate = 'Due Date is required';
    if (!formData.serviceMonth) errors.serviceMonth = 'Service Month is required';
    if (!formData.billToAddress) errors.billToAddress = 'Bill To Address is required';
    if (!formData.shipToAddress) errors.shipToAddress = 'Ship To Address is required';

    let childTableDataValid = true;
    if (!childTableData || !Array.isArray(childTableData) || childTableData.length === 0) {
      childTableDataValid = false;
      setChildTableErrors([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = childTableData.map((row, index) => {
        const rowErrors = {};
        if (!row.amount) rowErrors.amount = 'amount is required';
        if (!row.rate) rowErrors.rate = 'rate is required';
        if (!row.quantity) rowErrors.quantity = 'quantity is required';
        if (!row.description) rowErrors.description = 'description is required';

        if (Object.keys(rowErrors).length > 0) {
          childTableDataValid = false;
        }

        return rowErrors;
      });

      setChildTableErrors(newTableErrors);
    }
    if (!childTableDataValid || Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    if (childTableDataValid) {
      setIsLoading(true);
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

        accountName: formData.accountName,
        accountNo: formData.accountNo,
        bankName: formData.bankName,
        billToAddress: formData.billToAddress,
        cgst: formData.cgst,
        companyAddress: formData.companyAddress,
        dueDate: formData.dueDate,
        gstType: formData.gstType,
        taxpercentage: formData.taxpercentage,
        ifsc: formData.iFSC,
        igst: formData.igst,
        invoiceDate: formData.invoiceDate,
        term: formData.term,
        notes: formData.notes,
        serviceMonth: formData.serviceMonth,
        sgst: formData.sgst,
        shipToAddress: formData.shipToAddress,
        subTotal: formData.subTotal,
        termsAndConditions: formData.termsAndConditions,
        total: formData.total
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        console.log('handlesave try working');
        const response = await apiCalls('put', `master/createUpdateTaxInvoice`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Invoice Updated Successfully' : 'Invoice created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.message || 'Invoice Creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', ' Invoice failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
    return true;
  };

  const handleGenerate = () => {};

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleDateChange = () => {};

  const addNewRow = () => {
    const newRow = { id: rows.length + 1, name: '', qty: '', rate: '', amount: '' };
    setRows([...rows, newRow]);
  };

  // const handleInputChange = (event, index = null) => {
  //   const { name, value } = event.target;
  //   const addressRegex = /^[a-zA-Z0-9\s,.-]*$/;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const numberRegex = /^\d*\.?\d*$/;
  //   const taxPercentageRegex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
  //   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  //   if ((name === 'invoiceNo' || name === 'term') && !codeRegex.test(value)) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid Format' }));
  //   }
  //   if ((name === 'billToAddress' || name === 'shipToAddress' || name === 'companyAddress') && !addressRegex.test(value)) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid Format' }));
  //   }
  //   if ((name === 'cgst' || name === 'sgst' || name === 'igst' || name === 'total' || name === 'subTotal' || name === 'accountNo') && !numberRegex.test(value)) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid Format' }));
  //   }
  //   if (name === 'taxpercentage' && !taxPercentageRegex.test(value)) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid Format' }));
  //   }
  //   if (name === 'iFSC' && !ifscRegex.test(value)) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid Format' }));
  //   } else {
  //     setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  //   }

  //   if (index !== null) {
  //     const updatedRows = rows.map((row, i) => {
  //       if (i === index) {
  //         const updatedRow = { ...row, [name]: value };
  //         if (name === 'qty' || name === 'rate') {
  //           const qty = updatedRow.qty || 0;
  //           const rate = updatedRow.rate || 0;
  //           updatedRow.amount = qty * rate;
  //         }
  //         return updatedRow;
  //       }
  //       return row;
  //     });
  //     setRows(updatedRows);
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value
  //     }));
  //   }
  // };

  const handleInputChange = (event, index = null) => {
    const { name, value } = event.target;
    const addressRegex = /^[a-zA-Z0-9\s,.-]*$/;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const numberRegex = /^\d*\.?\d*$/;
    const taxPercentageRegex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  
    let errors = {}; // Temporarily store errors
  
    // Validation checks
    if ((name === 'invoiceNo' || name === 'term') && !codeRegex.test(value)) {
      errors[name] = 'Invalid Format';
    }
    if ((name === 'billToAddress' || name === 'shipToAddress' || name === 'companyAddress') && !addressRegex.test(value)) {
      errors[name] = 'Invalid Format';
    }
    if ((name === 'cgst' || name === 'sgst' || name === 'igst' || name === 'total' || name === 'subTotal' || name === 'accountNo') && !numberRegex.test(value)) {
      errors[name] = 'Invalid Format';
    }
    if (name === 'taxpercentage' && !taxPercentageRegex.test(value)) {
      errors[name] = 'Invalid Format';
    }
    if (name === 'iFSC' && !ifscRegex.test(value)) {
      errors[name] = 'Invalid Format';
    }
  
    // Update the field errors
    setFieldErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  
    // Proceed with updating form data if no errors
    if (Object.keys(errors).length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === 'iFSC' ? value.toUpperCase() : value, // Uppercase only for iFSC
      }));
    }
  
    if (index !== null) {
      const updatedRows = rows.map((row, i) => {
        if (i === index) {
          const updatedRow = { ...row, [name]: value };
          if (name === 'qty' || name === 'rate') {
            const qty = updatedRow.qty || 0;
            const rate = updatedRow.rate || 0;
            updatedRow.amount = qty * rate;
          }
          return updatedRow;
        }
        return row;
      });
      setRows(updatedRows);
    }
  };
  

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };
  const handleClear = () => {
    setFormData({
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
      iFSC: ''
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
      iFSC: ''
    });
    setChildTableErrors([]);
    setChildTableData([]);
  };

  const handleTapChange = (event, newValue) => {
    setValue(newValue);
  };
  const getTaxInvoiceById = () => {
    setListView(false);
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
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
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
                  label="Bill To Address"
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
                  label="Ship To Address"
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
                <TextField
                  label="Tax"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="tax"
                  value={formData.tax}
                  onChange={handleInputChange}
                  error={!!fieldErrors.tax}
                  helperText={fieldErrors.tax}
                />
              </div>

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

              <div className="col-md-3 mb-3">
                <TextField
                  label="GST Type"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="gstType"
                  value={formData.gstType}
                  onChange={handleInputChange}
                  error={!!fieldErrors.gstType}
                  helperText={fieldErrors.gstType}
                />
              </div>

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
                                      <>
                                        <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                          Action
                                        </th>
                                      </>
                                    )}
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      {' '}
                                      S.No
                                    </th>
                                    <th className="px-2 py-2 text-white text-center">Item & Description</th>
                                    <th className="px-2 py-2 text-white text-center">Quantity</th>
                                    <th className="px-2 py-2 text-white text-center">Rate</th>
                                    <th className="px-2 py-2 text-white text-center">Amount</th>
                                  </tr>
                                </thead>
                                {!viewId ? (
                                  <>
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
                                              <>
                                                <td className="border px-2 py-2 text-center">
                                                  <ActionButton
                                                    title="Delete"
                                                    icon={DeleteIcon}
                                                    onClick={() =>
                                                      handleDeleteRow(
                                                        row.id,
                                                        childTableData,
                                                        setChildTableData,
                                                        childTableErrors,
                                                        setChildTableErrors
                                                      )
                                                    }
                                                  />
                                                </td>
                                              </>
                                            )}
                                            <td className="text-center">
                                              <div className="pt-2">{index + 1}</div>
                                            </td>

                                            <td className="border px-2 py-2">
                                              <input
                                                type="text"
                                                value={row.description}
                                                onChange={(e) => {
                                                  const updatedTableData = [...childTableData];
                                                  updatedTableData[index].description = e.target.value;
                                                  setChildTableData(updatedTableData);
                                                }}
                                                style={{ width: '180px' }}
                                                className={childTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                              />
                                              {childTableErrors[index]?.description && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>{childTableErrors[index].description}</div>
                                              )}
                                            </td>

                                            <td className="border px-2 py-2">
                                              <input
                                                type="text"
                                                value={row.quantity}
                                                onChange={(e) => {
                                                  const updatedTableData = [...childTableData];
                                                  updatedTableData[index].quantity = e.target.value;
                                                  setChildTableData(updatedTableData);
                                                }}
                                                style={{ width: '180px' }}
                                                className={childTableErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                              />
                                              {childTableErrors[index]?.quantity && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>{childTableErrors[index].quantity}</div>
                                              )}
                                            </td>

                                            <td className="border px-2 py-2">
                                              <input
                                                type="text"
                                                value={row.rate}
                                                onChange={(e) => {
                                                  const updatedTableData = [...childTableData];
                                                  updatedTableData[index].rate = e.target.value;
                                                  setChildTableData(updatedTableData);
                                                }}
                                                style={{ width: '180px' }}
                                                className={childTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                              />
                                              {childTableErrors[index]?.rate && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>{childTableErrors[index].rate}</div>
                                              )}
                                            </td>

                                            <td className="border px-2 py-2">
                                              <input
                                                type="number"
                                                value={row.amount}
                                                onChange={(e) => {
                                                  const updatedTableData = [...childTableData];
                                                  updatedTableData[index].amount = e.target.value;
                                                  setChildTableData(updatedTableData);
                                                }}
                                                style={{ width: '180px' }}
                                                className={childTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                              />
                                              {childTableErrors[index]?.amount && (
                                                <div style={{ color: 'red', fontSize: '12px' }}>{childTableErrors[index].amount}</div>
                                              )}
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                    {childTableErrors.some((error) => error.general) && (
                                      <tfoot>
                                        <tr>
                                          <td colSpan={13} className="error-message">
                                            <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                                              {childTableErrors.find((error) => error.general)?.general}
                                            </div>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
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
                            {/* {errors.bankName && <span style={{ color: 'red' }}>{errors.bankName}</span>} */}
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
                            {/* {errors.accountNo && <span style={{ color: 'red' }}>{errors.accountNo}</span>} */}
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
                            {/* {errors.accountName && <span style={{ color: 'red' }}>{errors.accountName}</span>} */}
                          </div>
                          <div className="col-md-3">
                            <TextField
                              size="small"
                              fullWidth
                              label="IFSC"
                              margin="normal"
                              name="iFSC"
                              value={formData.iFSC}
                              onChange={handleInputChange}
                              error={!!fieldErrors.iFSC}
                              helperText={fieldErrors.iFSC}
                            />
                            {/* {errors.iFSC && <span style={{ color: 'red' }}>{errors.iFSC}</span>} */}
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
