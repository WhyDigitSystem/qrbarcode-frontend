import React, { useState } from 'react';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { RiAiGenerate } from 'react-icons/ri';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import AddIcon from '@mui/icons-material/Add';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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

const Invoice = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState('');

  const [value, setValue] = useState(0);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [formData, setFormData] = useState({
    chooseFile: '',
    invoiceNo: '',
    address: '',
    invoiceDate: '',
    terms: '',
    dueDate: '',
    serviceMonth: '',
    billTo: '',
    shipTo: '',
    tax1: '',
    tax2: '',
    bankName: '',
    accountName: '',
    accountNo: '',
    iFSC: '',
    // Table
    amount: '',
    rate: '',
    qty: '',
    name: ''
  });
  const [rows, setRows] = useState([]);

  const [fieldErrors, setFieldErrors] = useState({
    chooseFile: '',
    invoiceNo: '',
    address: '',
    invoiceDate: '',
    terms: '',
    dueDate: '',
    serviceMonth: '',
    billTo: '',
    shipTo: '',
    tax1: '',
    tax2: '',
    bankName: '',
    accountName: '',
    accountNo: '',
    iFSC: '',
    // Table
    amount: '',
    rate: '',
    qty: '',
    name: ''
  });

  const handleSave = () => {
    const errors = {};

    if (!formData.invoiceNo) {
      errors.invoiceNo = 'Invoice number is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }

    if (!formData.terms) {
      errors.terms = 'Terms is required';
    }
    if (!formData.invoiceDate) {
      errors.invoiceDate = 'invoiceDate is required';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'dueDate is required';
    }
    if (!formData.serviceMonth) {
      errors.serviceMonth = 'serviceMonth is required';
    }
    if (!formData.billTo) {
      errors.billTo = 'billTo is required';
    }
    if (!formData.shipTo) {
      errors.shipTo = 'shipTo is required';
    }
    if (!formData.tax1) {
      errors.tax1 = 'tax1 is required';
    }
    if (!formData.tax2) {
      errors.tax2 = 'tax2 is required';
    }
    if (!formData.bankName) {
      errors.bankName = 'bankName is required';
    }
    if (!formData.accountName) {
      errors.accountName = 'accountName is required';
    }
    if (!formData.accountNo) {
      errors.accountNo = 'accountNo is required';
    }
    if (!formData.iFSC) {
      errors.iFSC = 'iFSC is required';
    }

    // Table
    if (!formData.amount) {
      errors.amount = 'amount is required';
    }
    if (!formData.rate) {
      errors.rate = 'rate is required';
    }
    if (!formData.qty) {
      errors.qty = 'qty is required';
    }
    if (!formData.tax2) {
      errors.tax2 = 'name is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        invoiceNo: formData.invoiceNo,
        address: formData.address,
        orgId: orgId,
        createdby: loginUserName
      };
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {};

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

  const handleInputChange = (event, index = null) => {
    const { name, value } = event.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const addressRegex = /^[a-zA-Z0-9\s,.-]*$/;
    if (name === 'invoiceNo' && !codeRegex.test(value)) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: 'Invalid Format' }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };
  const handleClear = () => {
    setFormData({
      chooseFile: '',
      invoiceNo: '',
      address: '',
      invoiceDate: '',
      terms: '',
      dueDate: '',
      serviceMonth: '',
      billTo: '',
      shipTo: '',
      tax1: '',
      tax2: '',
      bankName: '',
      accountName: '',
      accountNo: '',
      iFSC: '',
      amount: '',
      rate: '',
      qty: '',
      name: ''
    });
    setFieldErrors({
      chooseFile: '',
      invoiceNo: '',
      address: '',
      invoiceDate: '',
      terms: '',
      dueDate: '',
      serviceMonth: '',
      billTo: '',
      shipTo: '',
      tax1: '',
      tax2: '',
      bankName: '',
      accountName: '',
      accountNo: '',
      iFSC: '',
      amount: '',
      rate: '',
      qty: '',
      name: ''
    });
    setErrors({});
  };

  // //
  const handleTapChange = (event, newValue) => {
    setValue(newValue);
  };

  // ///

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
          </div>
        </div>
        <div>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Logo Upload</p>
                </div>
                <div className="col-md-6">
                  <TextField
                    size="small"
                    fullWidth
                    type="file"
                    value={formData.chooseFile}
                    name="chooseFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ marginTop: '10px' }}
                  />
                  {file && <p>Selected file: {file.name}</p>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">InVoice No</p>
                </div>
                <div className="col-md-6">
                  <TextField
                    size="small"
                    fullWidth
                    label="InVoiceNo"
                    margin="normal"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.invoiceNo}
                    helperText={fieldErrors.invoiceNo}
                  />
                  {errors.invoiceNo && <span style={{ color: 'red' }}>{errors.invoiceNo}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Terms</p>
                </div>
                <div className="col-md-6">
                  <TextField
                    size="small"
                    fullWidth
                    label="Terms"
                    margin="normal"
                    name="terms"
                    value={formData.terms}
                    onChange={handleInputChange}
                    error={!!fieldErrors.terms}
                    helperText={fieldErrors.terms}
                  />
                  {errors.terms && <span style={{ color: 'red' }}>{errors.terms}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Service Month</p>
                </div>
                <div className="col-md-6">
                  <TextField
                    size="small"
                    fullWidth
                    label="Service Month"
                    margin="normal"
                    name="serviceMonth"
                    value={formData.serviceMonth}
                    onChange={handleInputChange}
                    error={!!fieldErrors.serviceMonth}
                    helperText={fieldErrors.serviceMonth}
                  />
                  {errors.serviceMonth && <span style={{ color: 'red' }}>{errors.serviceMonth}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Ship To</p>
                </div>
                <div className="col-md-6">
                  <TextField
                    size="small"
                    fullWidth
                    label="Ship To"
                    margin="normal"
                    name="shipTo"
                    value={formData.shipTo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.shipTo}
                    helperText={fieldErrors.shipTo}
                  />
                  {errors.shipTo && <span style={{ color: 'red' }}>{errors.shipTo}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Tax 2</p>
                </div>
                <div className="col-md-6 mt-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Tax2"
                    margin="normal"
                    name="tax2"
                    value={formData.tax2}
                    onChange={handleInputChange}
                    error={!!fieldErrors.tax2}
                    helperText={fieldErrors.tax2}
                  />
                  {errors.tax2 && <span style={{ color: 'red' }}>{errors.tax2}</span>}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Address</p>
                </div>
                <div className="col-md-6">
                  <TextareaAutosize
                    id="textarea"
                    className="form-control mb-1"
                    value={formData.address}
                    name="address"
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Address"
                    style={{ height: '18px' }}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                  />
                  {errors.address && <span style={{ color: 'green' }}>{errors.address}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">InVoice Date</p>
                </div>
                <div className="col-md-6">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="InVoice Date"
                        value={formData.invoiceDate ? dayjs(formData.invoiceDate, 'DD-MM-YYYY') : null}
                        onChange={(date) => handleDateChange('invoiceDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.invoiceDate}
                        helperText={fieldErrors.invoiceDate}
                      />
                      {errors.invoiceDate && <span style={{ color: 'red' }}>{errors.invoiceDate}</span>}
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Due Date</p>
                </div>
                <div className="col-md-6 mt-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Due Date"
                        value={formData.dueDate ? dayjs(formData.dueDate, 'DD-MM-YYYY') : null}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.dueDate}
                        helperText={fieldErrors.dueDate}
                      />
                      {errors.dueDate && <span style={{ color: 'red' }}>{errors.dueDate}</span>}
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Bill To</p>
                </div>
                <div className="col-md-6 mt-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Bill To"
                    margin="normal"
                    name="billTo"
                    value={formData.billTo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.billTo}
                    helperText={fieldErrors.billTo}
                  />
                  {errors.billTo && <span style={{ color: 'red' }}>{errors.billTo}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Tax 1</p>
                </div>
                <div className="col-md-6 mt-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Tax1"
                    margin="normal"
                    name="tax1"
                    value={formData.tax1}
                    onChange={handleInputChange}
                    error={!!fieldErrors.tax1}
                    helperText={fieldErrors.tax1}
                  />
                  {errors.tax1 && <span style={{ color: 'red' }}>{errors.tax1}</span>}
                </div>
              </div>
            </div>
          </div>
          <ActionButton title="Add" icon={AddIcon} onClick={addNewRow} />
          <div className="row">
            {/* <button onClick={addNewRow} className="btn btn-primary mb-3">
              Add New Row
            </button> */}
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr style={{ backgroundColor: 'rgb(103 58 183)' }}>
                    <th className="px-2 py-2 text-white text-center">S.No</th>
                    <th className="px-2 py-2 text-white text-center">Item & Description</th>
                    <th className="px-2 py-2 text-white text-center">Rate</th>
                    <th className="px-2 py-2 text-white text-center">Actions</th>
                    <th className="px-2 py-2 text-white text-center">Amount</th>
                    <th className="px-2 py-2 text-white text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={row.name}
                          onChange={(event) => handleInputChange(event, index)}
                          className="form-control"
                          error={!!fieldErrors.name}
                          helperText={fieldErrors.name}
                        />
                        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                      </td>
                      <td>
                        <input
                          type="number"
                          name="qty"
                          value={row.qty}
                          onChange={(event) => handleInputChange(event, index)}
                          className="form-control"
                          error={!!fieldErrors.qty}
                          helperText={fieldErrors.qty}
                        />
                        {errors.qty && <span style={{ color: 'red' }}>{errors.qty}</span>}
                      </td>
                      <td>
                        <input
                          type="number"
                          name="rate"
                          value={row.rate}
                          onChange={(event) => handleInputChange(event, index)}
                          className="form-control"
                          error={!!fieldErrors.rate}
                          helperText={fieldErrors.rate}
                        />
                        {errors.rate && <span style={{ color: 'red' }}>{errors.rate}</span>}
                      </td>
                      <td>{row.amount}</td>
                      <td>
                        <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Bank Name</p>
                </div>
                <div className="col-md-6">
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
                  {errors.bankName && <span style={{ color: 'red' }}>{errors.bankName}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Account No</p>
                </div>
                <div className="col-md-6">
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
                  {errors.accountNo && <span style={{ color: 'red' }}>{errors.accountNo}</span>}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">Account Name</p>
                </div>
                <div className="col-md-6">
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
                  {errors.accountName && <span style={{ color: 'red' }}>{errors.accountName}</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-3">IFSC</p>
                </div>
                <div className="col-md-6">
                  <TextField
                    size="small"
                    fullWidth
                    label="iFSC"
                    margin="normal"
                    name="iFSC"
                    value={formData.iFSC}
                    onChange={handleInputChange}
                    error={!!fieldErrors.iFSC}
                    helperText={fieldErrors.iFSC}
                  />
                  {errors.iFSC && <span style={{ color: 'red' }}>{errors.iFSC}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <>
          <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleTapChange} aria-label="Invoice Tabs">
              <Tab label="Tab 1" />
              <Tab label="Tab 2" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {value === 0 && (
                <div variant="body1">
                  <>
                    <div className="row ">
                      <div className="mb-1 d-flex">
                        <div className="mb-1"></div>
                        <div className="mb-1"></div>
                      </div>
                    </div>
                  </>
                </div>
              )}
              {value === 1 && <div variant="body1">Content for Tab 2</div>}
            </Box>
          </Box>
        </>
      </div>
    </>
  );
};

export default Invoice;
