import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { FormControlLabel, FormGroup, FormControl } from '@mui/material';
import { Button, Typography, Box, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import GridOnIcon from '@mui/icons-material/GridOn';
import DeleteIcon from '@mui/icons-material/Delete';
import { RiAiGenerate } from 'react-icons/ri';
import Checkbox from '@mui/material/Checkbox';

import ActionButton from 'utils/ActionButton';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import sampleFile from '../../../assets/samplefiles/QrBarCode.xls';
import CommonListViewTable from '../CommonListViewTable';
import apiCalls from 'apicall';
// import { batch } from 'react-redux';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const QrBargroup = () => {
  const [value, setValue] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [childTableData, setChildTableData] = useState([]);
  const [childTableErrors, setChildTableErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [generateQrCode, setGenerateQrCode] = useState(false);
  const [generateBarCode, setGenerateBarCode] = useState(false);
  const [generateBoth, setGenerateBoth] = useState(true);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [formData, setFormData] = useState({
    entryno: '',
    count: '',
    docno: '',
    documentDate: dayjs().format('DD-MM-YYYY')
  });
  const [fieldErrors, setFieldErrors] = useState({
    entryno: '',
    count: '',
    docno: '',
    documentDate: ''
  });
  const [modalTableData, setModalTableData] = useState([
    {
      id: '',
      partNo: '',
      partDesc: '',
      qrcodevalue: '',
      barcodevalue: '',
      batchNo: ''
    }
  ]);
  const [modalTableErrors, setModalTableErrors] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      qrcodevalue: '',
      barcodevalue: '',
      batchNo: ''
    }
  ]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [id, setId] = useState(parseInt(localStorage.getItem('id')));
  const [viewId, setViewId] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const lrNoDetailsRefs = useRef([]);
  const [uploadedFile, setUploadedFile] = useState(false);

  useEffect(() => {
    getDocId();
    getQrBarCodeById();
    getAllQrBarCode();
  }, []);

  useEffect(() => {
    lrNoDetailsRefs.current = childTableData.map((_, index) => ({
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      partDesc: lrNoDetailsRefs.current[index]?.partDesc || React.createRef(),
      qrcodevalue: lrNoDetailsRefs.current[index]?.qrcodevalue || React.createRef(),
      barcodevalue: lrNoDetailsRefs.current[index]?.barcodevalue || React.createRef(),
      batchNo: lrNoDetailsRefs.current[index]?.batchNo || React.createRef()
    }));
  }, [childTableData]);

  const [fromBinList, setFromBinList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  // const [viewId, setViewId] = useState('');
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
  const handleQrCodeCheckbox = () => {
    setGenerateQrCode(!generateQrCode);
    setGenerateBarCode(false);
    setGenerateBoth(false);
  };

  const handleBarCodeCheckbox = () => {
    setGenerateBarCode(!generateBarCode);
    setGenerateQrCode(false);
    setGenerateBoth(false);
  };

  const handleBothCheckbox = () => {
    setGenerateBoth(!generateBoth);
    setGenerateQrCode(false);
    setGenerateBarCode(false);
  };

  const getQrBarCodeById = async (row) => {
    console.log('THE SELECTED row ID IS:', row);
    setViewId(id);
    try {
      const response = await apiCalls('get', `qrbarcode/getQrBarCodeById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularqrbarcode = response.paramObjectsMap.qrBarCodeVO;
        console.log('THE PARTICULAR QRBAR CODE DATA IS:', particularqrbarcode);
        setFormData({
          docno: particularqrbarcode.docId,
          documentDate: particularqrbarcode.docDate ? dayjs(particularqrbarcode.docDate).format('DD-MM-YYYY') : dayjs(),
          entryno: particularqrbarcode.entryNo,
          count: particularqrbarcode.count
        });

        const mappedData = particularqrbarcode.qrBarCodeDetailsVO.map((detail) => ({
          id: detail.id,
          partNo: detail.partNo || '',
          partDesc: detail.partDescription || '',
          batchNo: detail.batchNo || '',
          barcodevalue: detail.barCodeValue,
          qrcodevalue: detail.qrCodeValue
        }));

        console.log('Mapped Data for Child Table:', mappedData);

        setChildTableData(mappedData);

        setViewId(row);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllQrBarCode = async () => {
    try {
      const response = await apiCalls('get', `qrbarcode/getAllQrBarCode`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.QrBarCodeVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls('get', `/qrbarcode/getFillGridFromQrBarExcelUpload?entryNo=${formData.entryno}`);
      console.log('API Response:', response);

      if (response.status === true) {
        const gridDetails = response.paramObjectsMap.qrBarCodeVO;
        console.log('THE MODAL TABLE DATA FROM API ARE:', gridDetails);
        setModalTableData(
          gridDetails.map((row) => ({
            id: row.id,
            partNo: row.partNo,
            partDesc: row.partDesc,
            batchNo: row.batchNo
          }))
        );
        setChildTableData([]);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    const numRegex = /^[0-9]*$/;
    const nameRegex = /^[A-Za-z0-9 ]*$/;

    if (name === 'entryno' && !nameRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    }
    if (name === 'count' && !numRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      setFieldErrors({ ...fieldErrors, [name]: '' });

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

  const getDocId = async () => {
    try {
      const response = await apiCalls('get', `qrbarcode/getQrBarCodeDocId`);
      console.log('API Response:', response);

      if (response.status === true) {
        // console.log(response.paramObjectsMap.qrbarcodeDocId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          docno: response.paramObjectsMap.qrbarcodeDocId
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddRow = () => {
    console.log('THE HANDLE ADD ROW FUNCTION IS WORKING');
    // setChildTableErrors({...modalTableErrors, [name]: ''})

    if (isLastRowEmpty(childTableData)) {
      displayRowError(childTableData);
      console.log('Last Row is Empty');
      return;
    }
    console.log('the ok');

    const newRow = {
      id: Date.now(),
      partNo: '',
      partDesc: '',
      qrcodevalue: '',
      barcodevalue: '',
      batchNo: ''
    };
    setChildTableData([...childTableData, newRow]);
    setChildTableErrors([
      ...childTableErrors,
      {
        partNo: '',
        partDesc: '',
        qrcodevalue: '',
        barcodevalue: '',
        batchNo: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === childTableData) {
      return !lastRow.partDesc || !lastRow.partNo || !lastRow.qrcodevalue || !lastRow.barcodevalue || !lastRow.batchNo;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === childTableData) {
      setChildTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partDesc: !table[table.length - 1].partDesc ? 'Part Desc is required' : '',
          qrcodevalue: !table[table.length - 1].qrcodevalue ? 'QrCode Value is required' : '',
          barcodevalue: !table[table.length - 1].barcodevalue ? 'BarCode Value is required' : '',
          batchNo: !table[table.length - 1].batchNo ? 'Batch is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    console.log('Row ID to delete:', id);

    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      console.log('Updated Table Data:', updatedData);
      console.log('Updated Errors:', updatedErrors);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    } else {
      console.log('Row not found!');
    }
  };

  const handleClear = () => {
    setFormData({
      entryno: '',
      count: '',
      // docno: formData.docno,
      documentDate: dayjs().format('DD-MM-YYYY')
    });
    getDocId();
    setFieldErrors({
      entryno: '',
      count: '',
      docno: '',
      documentDate: ''
    });
    setChildTableErrors([]);
    setChildTableData([]);
    setViewId(false);
    setIsDisabled(false);
    setGenerateBoth(true);
    setGenerateQrCode(false);
    setGenerateBarCode(false);
  };
  const [listView, setListView] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'entryNo', header: 'Entry No', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  const handleSave = async () => {
    const errors = {};
    if (!formData.docno) errors.docno = 'Doc No is required';
    if (!formData.documentDate) errors.documentDate = 'Document Date is required';
    if (!formData.count) errors.count = 'Count is required';
    if (!formData.entryno) errors.entryno = 'Entry No is required';

    let childTableDataValid = true;
    if (!childTableData || !Array.isArray(childTableData) || childTableData.length === 0) {
      childTableDataValid = false;
      setChildTableErrors([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = childTableData.map((row, index) => {
        const rowErrors = {};
        if (!row.partNo) rowErrors.partNo = 'Part No is required';
        if (!row.partDesc) rowErrors.partDesc = 'Part Desc is required';
        if (!row.qrcodevalue) rowErrors.qrcodevalue = 'Qr Code Value is required';
        if (!row.barcodevalue) rowErrors.barcodevalue = 'Bar Code Value is required';
        if (!row.batchNo) rowErrors.batchNo = 'Batch is required';

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
        barCodeValue: row.barcodevalue,
        partDescription: row.partDesc,
        partNo: row.partNo,
        qrCodeValue: row.qrcodevalue,
        batchNo: row.batchNo
      }));

      const saveFormData = {
        ...(viewId && { id: viewId }),
        createdBy: loginUserName,
        // id: id,
        // active: true,
        // cancel: true,
        // cancelRemarks: "string",
        orgId: 1,
        count: formData.count,
        docDate: dayjs().format('YYYY-MM-DD'),
        docId: formData.docno,
        entryNo: formData.entryno,
        qrBarCodeDetailsDTO: childVO
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `qrbarcode/createUpdateQrBarCode`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          // showToast('success', viewId ? ' Qr Bar Code Updated Successfully' : 'Qr Bar Code created successfully');
          getAllFillGrid();
          getAllQrBarCode();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Qr Bar Code Creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', ' QrBar Code failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
    return true;
  };

  const handleTableClear = (table) => {
    if (table === 'childTableData') {
      setChildTableData([]);
      setChildTableErrors([]);
    }
  };

  const handleFullGrid = () => {
    setModalOpen(true);
    getAllFillGrid();
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
    const selectedData = selectedRows.map((index) => {
      const data = modalTableData[index];
      return {
        ...data,
        qrcodevalue: `${data.partNo}-${data.partDesc}-${data.batchNo}`,
        barcodevalue: `${data.partNo}-${data.partDesc}-${data.batchNo}`
      };
    });

    setChildTableData((prev) => [...prev, ...selectedData]);

    console.log('Data selected with QR and Barcode values:', selectedData);

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
          // await getbatchNo(data.fromBin, data.partNo, data.grnNo, data);
          // await getAvlQty(data.batchNo, data.fromBin, data.grnNo, data.partNo, data);

          // handlePartNoChange(data, childTableData.length + idx, simulatedEvent);
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
  };
  const handleView = () => {
    setListView(!listView);
    setIsDisabled(true);
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    setUploadedFile(true);
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    if (uploadedFile === false) {
      toast.error('Please upload a file before submitting.', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    handleBulkUploadClose();
  };

  const handleGenerateClose = () => {
    setOpen(false);
  };
  const [showCodes, setShowCodes] = useState(false);

  const handleGenerate = async () => {
    const count = parseInt(formData.count, 10);
  
    if (!viewId) {
      // const isValid = await 
      handleSave();
    }

    let updatedTableData = [];

    setTimeout(() => {
      childTableData.forEach((row) => {
        for (let i = 0; i < count; i++) {
          updatedTableData.push({
            ...row,
            qrcodevalue: generateQrCode || generateBoth ? row.qrcodevalue : '',
            barcodevalue: generateBarCode || generateBoth ? row.barcodevalue : ''
          });
        }
      });

      setModalTableData(updatedTableData);
      setOpen(true);
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        modalTableData.forEach((row, index) => {
          const elementId = `barcode-${index}`;
          const barcodeElement = document.getElementById(elementId);

          if (barcodeElement) {
            try {
              JsBarcode(`#${elementId}`, row.barcodevalue, {
                format: 'CODE128',
                displayValue: true,
                lineColor: '#000',
                width: 2,
                height: 60
              });
            } catch (error) {
              console.error(`Error rendering barcode for row ${index}:`, error);
            }
          } else {
            console.error(`Element with id ${elementId} not found!`);
          }
        });
      }, 500);
    }
  }, [modalTableData, open]);

  const handlePrint = () => {
    setShowCodes(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="ListView" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            {!viewId && <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />}
            <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
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
            apiUrl={`qrbarcode/ExcelUploadForQrBarCode?createdBy=${loginUserName}`}
            screen="QrBarCode"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockView={true} disableEditIcon toView={getQrBarCodeById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-4">
                <TextField
                  label="Document No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="docno"
                  disabled
                  value={formData.docno}
                  onChange={handleInputChange}
                  error={!!fieldErrors.docno}
                  helperText={fieldErrors.docno}
                />
              </div>
              <div className="col-md-3 mb-4">
                <TextField
                  label="Document Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="documentDate"
                  value={formData.documentDate}
                  disabled={isDisabled}
                />
              </div>
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
                  disabled={isDisabled}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Count"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="count"
                  value={formData.count}
                  onChange={handleInputChange}
                  error={!!fieldErrors.count}
                  helperText={fieldErrors.count}
                  disabled={isDisabled}
                />
              </div>
              <div className="row mt-2">
                <FormControl component="fieldset">
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox checked={generateQrCode} onChange={handleQrCodeCheckbox} color="secondary" />}
                      label="Generate QR Code"
                    />

                    <FormControlLabel
                      control={<Checkbox checked={generateBarCode} onChange={handleBarCodeCheckbox} color="secondary" />}
                      label="Generate Bar Code"
                    />

                    <FormControlLabel
                      control={<Checkbox checked={generateBoth} onChange={handleBothCheckbox} color="secondary" />}
                      label="Generate Both QR and Bar Code"
                    />
                  </FormGroup>
                </FormControl>
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
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                  )}
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Part No *</th>
                                  <th className="px-2 py-2 text-white text-center">Part Desc *</th>
                                  <th className="px-2 py-2 text-white text-center">Batch *</th>
                                  <th className="px-2 py-2 text-white text-center">QrCode Value *</th>
                                  <th className="px-2 py-2 text-white text-center">BarCode Value *</th>
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
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.partNo}
                                          onChange={(e) => handleInputChange(e, index, 'partNo')}
                                          style={{ width: '180px' }}
                                          className={childTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                          disabled={viewId && true}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.partDesc}
                                          onChange={(e) => handleInputChange(e, index, 'partDesc')}
                                          style={{ width: '180px' }}
                                          className={childTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                          disabled={viewId && true}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.batchNo}
                                          onChange={(e) => handleInputChange(e, index, 'batchNo')}
                                          style={{ width: '180px' }}
                                          className={childTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                          disabled={viewId && true}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.qrcodevalue}
                                          onChange={(e) => handleInputChange(e, index, 'qrcodevalue')}
                                          style={{ width: '180px' }}
                                          className={childTableErrors[index]?.qrcodevalue ? 'error form-control' : 'form-control'}
                                          disabled={viewId && true}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.barcodevalue}
                                          onChange={(e) => handleInputChange(e, index, 'barcodevalue')}
                                          style={{ width: '180px' }}
                                          className={childTableErrors[index]?.barcodevalue ? 'error form-control' : 'form-control'}
                                          disabled={viewId && true}
                                        />
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
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
                                    <th className="table-header">Part No</th>
                                    <th className="table-header">Part Description</th>
                                    <th className="table-header">Batch</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modalTableData?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border p-0 text-center">
                                        <Checkbox
                                          checked={selectedRows.includes(index)}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">{index + 1}</td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.partNo || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.partDesc || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.batchNo || ''}
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
                        <Button onClick={handleCloseModal} sx={{ color: '#673AB7' }}>
                          Cancel
                        </Button>
                        <Button
                          color="secondary"
                          onClick={handleSubmitSelectedRows}
                          variant="contained"
                          sx={{ backgroundColor: '#673AB7' }}
                        >
                          Proceed
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </Box>
            </div>
          </>
        )}
        <div>
          {open && (
            <Dialog open={open} onClose={handleGenerateClose} maxWidth="md" fullWidth>
              <DialogTitle>Generated Codes</DialogTitle>
              <DialogContent>
                <table className="table table-bordered">
                  <thead>
                    <tr style={{ backgroundColor: '#673AB7' }}>
                      {generateQrCode || generateBoth ? <th className="table-header">QrCode Value</th> : null}
                      {generateBarCode || generateBoth ? <th className="table-header">BarCode Value</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {modalTableData.map((row, index) => (
                      <tr key={row.id}>
                        {generateQrCode || generateBoth ? (
                          <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                            <QRCodeSVG value={row.qrcodevalue || 'No QR Value'} size={80} />
                          </td>
                        ) : null}
                        {generateBarCode || generateBoth ? (
                          <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                            <svg id={`barcode-${index}`}></svg>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleGenerateClose} sx={{ color: '#673AB7' }}>
                  Close
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="contained"
                  sx={{
                    backgroundColor: '#673AB7',
                    '&:hover': {
                      backgroundColor: '#673AB7'
                    }
                  }}
                >
                  Print
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};
export default QrBargroup;
