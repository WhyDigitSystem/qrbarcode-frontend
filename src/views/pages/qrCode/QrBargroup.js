import React, { useEffect, useState,useRef } from 'react';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react'; 
import { Container, FormHelperText, Button, Grid, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField } from '@mui/material';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import GridOnIcon from '@mui/icons-material/GridOn';
import DeleteIcon from '@mui/icons-material/Delete';

import ActionButton from 'utils/ActionButton';
import CommonListViewTable from '../CommonListViewTable';
import apiCalls from 'apicall';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const QrBargroup = () => {
  const [formData, setFormData] = useState({
    entryno:'' 
  });
  const [fieldErrors, setFieldErrors] = useState({
    entryno:''
  });
  const [value, setValue] = useState(0);
  const [listView, setListView] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [childTableData, setChildTableData] = useState([]);
  const [childTableErrors, setChildTableErrors] = useState([]);
  const [modalTableData, setModalTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDesc:'',
      qrcodevalue:'',
      barcodevalue:'',
      count:''
    }
  ]);
  const [modalTableErrors, setModalTableErrors] = useState([
    {
      id: 1,
      partNo: '',
      partDesc:'',
      qrcodevalue:'',
      barcodevalue:'',
      count:''
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = childTableData.map((_, index) => ({
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      partDesc: lrNoDetailsRefs.current[index]?.partDesc || React.createRef(),
      qrcodevalue: lrNoDetailsRefs.current[index]?.qrcodevalue || React.createRef(),
      barcodevalue: lrNoDetailsRefs.current[index]?.barcodevalue || React.createRef(),
      count: lrNoDetailsRefs.current[index]?.count || React.createRef()
    }));
  }, [childTableData]);

  const [fromBinList, setFromBinList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewId, setViewId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    const numRegex = /^[0-9]*$/;
    const nameRegex = /^[A-Za-z0-9 ]*$/;

    if (name === 'entryno' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
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
      partNo: '',
      partDesc:'',
      qrcodevalue:'',
      barcodevalue:'',
      count:''
    };
    setChildTableData([...childTableData, newRow]);
    setChildTableErrors([
      ...childTableErrors,
      {
        partNo: '',
        partDesc:'',
        qrcodevalue:'',
        barcodevalue:'',
        count:''
      }
    ]);
  }

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === childTableData) {
      return !lastRow.partDesc || !lastRow.partNo || !lastRow.qrcodevalue || !lastRow.barcodevalue || !lastRow.count;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === childTableData) {
      setChildTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          count: !table[table.length - 1].count ? 'Count is required' : '',
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partDesc: !table[table.length - 1].partDesc ? 'PartDesc is required' : '',
          qrcodevalue: !table[table.length - 1].qrcodevalue ? 'QrCode Value is required' : '',
          barcodevalue: !table[table.length - 1].barcodevalue ? 'BarCode Value is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };  

  const handleClear = () =>{
    setFormData({
      entryno:''
    })
    setFieldErrors({
      entryno:''
    }) 
    setChildTableErrors([]);
    setChildTableData([{
      partNo:'',
      partDesc:'',
      qrcodevalue:'',
      barcodevalue:'',
      count:''
    }]);
  }
  
  const handleSave = async () => {
    const errors = {};
    if (!formData.entryno) {
      errors.entryno = 'Entry Number is required';
    }
    let firstInvalidFieldRef = null;

    let childTableDataValid = true;
    if (!childTableData || !Array.isArray(childTableData) || childTableData.length === 0) {
      childTableDataValid = false;
      setChildTableErrors([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = childTableData.map((row, index) => {
        const rowErrors = {};
        
        if (!row.partNo) {
          rowErrors.partNo = 'Part No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partNo;
        }
        if (!row.partDesc) {
          rowErrors.partDesc = 'Part Desc is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partDesc;
        }
        if (!row.qrcodevalue) {
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].qrcodevalue;
          rowErrors.qrcodevalue = 'Qr Code Value is required';
        }
        if (!row.barcodevalue) {
          rowErrors.barcodevalue = 'Bar Code Value is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].barcodevalue;
        }
        if (!row.count) {
          rowErrors.count = 'Count is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].count;
        }

        if (Object.keys(rowErrors).length > 0) childTableDataValid = false;

        return rowErrors;
      });

      setChildTableErrors(newTableErrors);
    }
    setFieldErrors(errors);
  };

  const handleTableClear = (table) => {
    if (table === 'childTableData') {
      setChildTableData([]);
      setChildTableErrors([]);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleFullGrid = () => {
    setModalOpen(true);
    // getAllFillGrid();
  };
  const handleCloseModal = () => {
    setModalOpen(false);
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

    setChildTableData((prev) => [...prev, ...selectedData]);

    console.log('Data selected:', selectedData);

    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();

    try {
      await Promise.all(
        selectedData.map(async (data, idx) => {
          const simulatedEvent = {
            target: {
              value: data.partNo
            }
          };

          // await getPartNo(data.fromBin, data);
          // await getGrnNo(data.fromBin, data.partNo, data);
          // await getBatchNo(data.fromBin, data.partNo, data.grnNo, data);
          // await getAvlQty(data.batchNo, data.fromBin, data.grnNo, data.partNo, data);
          // handlePartNoChange(data, childTableData.length + idx, simulatedEvent);
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
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
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
          <div className="row d-flex ml">
            <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
              <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
              {!viewId && <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />}
              <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
            </div>
          </div>
          
            <>
              <div className="row">
                  <div className="col-md-3 mb-3">
                    <TextField
                      label="Entry No"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="entryno"
                      value={formData.entryno}
                      onChange={handleInputChange}
                      error={!!fieldErrors.entryno}
                      helperText={fieldErrors.entryno}
                      disabled={viewId && true}
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
                  <Tab value={0} label="Details" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        {!viewId && (
                          <>
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                            <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                            <ActionButton title="Clear" icon={ClearIcon} onClick={() => handleTableClear('childTableData')} />{' '}
                          </>
                        )}
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
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Part No *</th>
                                  <th className="px-2 py-2 text-white text-center">Part Desc *</th>
                                  <th className="px-2 py-2 text-white text-center">QrCode Value *</th>
                                  <th className="px-2 py-2 text-white text-center">BarCode Value *</th>
                                  <th className="px-2 py-2 text-white text-center">Count *</th>
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
                                              value={row.partNo}
                                              onChange={(e) => {
                                                const updatedTableData = [...childTableData];
                                                updatedTableData[index].partNo = e.target.value;
                                                setChildTableData(updatedTableData);
                                              }}
                                              style={{ width: '160px' }}
                                              className={childTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                            />
                                            {childTableErrors[index]?.partNo && (
                                              <div style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index]?.partNo}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.partDesc}
                                              onChange={(e) => {
                                                const updatedTableData = [...childTableData];
                                                updatedTableData[index].partDesc = e.target.value;
                                                setChildTableData(updatedTableData);
                                              }}
                                              style={{ width: '160px' }}
                                              className={childTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                            />
                                            {childTableErrors[index]?.partDesc && (
                                              <div style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index]?.partDesc}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.qrcodevalue}
                                              onChange={(e) => {
                                                const updatedTableData = [...childTableData];
                                                updatedTableData[index].qrcodevalue = e.target.value;
                                                setChildTableData(updatedTableData);
                                              }}
                                              style={{ width: '150px' }}
                                              className={childTableErrors[index]?.qrcodevalue ? 'error form-control' : 'form-control'}
                                            />
                                            {childTableErrors[index]?.qrcodevalue && (
                                              <div style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index]?.qrcodevalue}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.barcodevalue}
                                              onChange={(e) => {
                                                const updatedTableData = [...childTableData];
                                                updatedTableData[index].barcodevalue = e.target.value;
                                                setChildTableData(updatedTableData);
                                              }}
                                              style={{ width: '150px' }}
                                              className={childTableErrors[index]?.barcodevalue ? 'error form-control' : 'form-control'}
                                            />
                                            {childTableErrors[index]?.barcodevalue && (
                                              <div style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index]?.barcodevalue}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.count}
                                              onChange={(e) => {
                                                const updatedTableData = [...childTableData];
                                                updatedTableData[index].count = e.target.value;
                                                setChildTableData(updatedTableData);
                                              }}
                                              style={{ width: '150px' }}
                                              className={childTableErrors[index]?.count ? 'error form-control' : 'form-control'}
                                            />
                                            {childTableErrors[index]?.count && (
                                              <div style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index]?.count}
                                              </div>
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
                                <>
                                  
                                </>
                              )}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                  </>
                )}
              </Box>
            </div>
          </>
         
      </div>
    </>  
)
}

export default QrBargroup
