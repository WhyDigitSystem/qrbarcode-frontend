import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react'; 
import { Container, FormHelperText, Button, Grid, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField } from '@mui/material';

import { BiShowAlt } from "react-icons/bi";
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ActionButton from 'utils/ActionButton';
import CommonListViewTable from '../CommonListViewTable';
import apiCalls from 'apicall';

const QrBargroup = () => {
  const [formData, setFormData] = useState({
    qrbarcode:'',
    noitems:'1'
  });
  const [fieldErrors, setFieldErrors] = useState({
    qrbarcode:'',
    noitems:''
  });
  const [codes, setCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getAllQrBarCode();
  }, []);

  const showToast = (type, message) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    const numRegex = /^[0-9]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    if (name === 'qrbarcode' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else if (name === 'noitems' && value.length > 3 && !numRegex.test(value) ) {
      setFieldErrors({ ...fieldErrors, [name]: 'Max Length is 3' });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Update the cursor position after the input change
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleClear = () =>{
    setFormData({
      qrbarcode:'',
      noitems:'1'
    })
    setFieldErrors({
      qrbarcode:'',
      noitems:''
    }) 
    setCodes([]); 
  }
  
  const getAllQrBarCode = async () => {
    try {
      const response = await apiCalls('get', `/qrbarcode/getAllQrBarCode`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getQrBarCodeById = async (row) => {
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `qrbarcode/getAllQrBarCodeById/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularQrBar = response.paramObjectsMap;

        setFormData({
          qrbarcode: particularQrBar.qrbarcode,
          noitems: particularQrBar.noitems,
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShow = async () => {
    const errors = {};
  
    // Validation
    if (!formData.qrbarcode) {
      errors.qrbarcode = 'QrBar Code Data is required';
    }
    if (!formData.noitems) {
      errors.noitems = 'Number of items is required';
    }
    setFieldErrors(errors);
  
    // Proceed only if there are no validation errors
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      
      const saveData = {
        ...(editId && { id: editId }),
        qrbarcode: formData.qrbarcode,
        noitems: formData.noitems,
        // orgId: orgId,
        // createdBy: loginUserName
      };
  
      console.log('DATA TO SAVE', saveData);
  
      try {
        
        const response = await apiCalls('post', `qrbarcode/createUpdateQrBarCode`, saveData);
        
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Qr & Bar Code Updated Successfully' : 'Qr & Bar Code created successfully');
          handleClear();
          getAllQrBarCode();  
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Qr & Bar Code creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Qr & Bar Code creation failed');
      } finally {
        setIsLoading(false);  // Always stop loading after the API call
      }
  
      // Generate QR and Barcodes after successful form submission
      const newCodes = Array.from({ length: parseInt(formData.noitems, 10) }, () => formData.qrbarcode);
      setCodes(newCodes);
    }
  };
  
  const handleView = () =>{
    setListView(!listView);
  }

  const listViewColumns = [
    { accessorKey: 'qrbarcode', header: 'QrBarCode Data', size: 140 },
    { accessorKey: 'noitems', header: 'No of Items', size: 140 }
  ];
  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
          <div className="row d-flex ml">
            <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              <ActionButton title="View History" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
              <ActionButton title="View QR & BAR Code" icon={BiShowAlt} isLoading={isLoading} onClick={handleShow} margin="0 10px 0 10px" />
            </div>
          </div>
          {listView ? (
            <div className="mt-4">
               <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true}  />  {/*  toEdit={} */}
            </div>
            
              ) : (
            <>
              <div className="row">
                  <div className="col-md-3 mb-3">
                    <TextField
                      label="Enter Data"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="qrbarcode"
                      value={formData.qrbarcode}
                      onChange={handleInputChange}
                      error={!!fieldErrors.qrbarcode}
                      helperText={fieldErrors.qrbarcode}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <TextField
                      label="Number of items"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="noitems"
                      value={formData.noitems}
                      onChange={handleInputChange}
                      error={!!fieldErrors.noitems}
                      helperText={fieldErrors.noitems}
                    />
                  </div>
                  {codes.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="qr-barcode-table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">S.No</TableCell>
                            <TableCell align="center">QR Code</TableCell>
                            <TableCell align="center">Barcode</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {codes.map((code, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                  <QRCodeCanvas value={code} size={128} />
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                  <Barcode value={code} />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
          </>
          )}
      </div>
    </>  
)
}

export default QrBargroup
