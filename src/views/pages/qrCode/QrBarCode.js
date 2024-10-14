import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { RiAiGenerate } from 'react-icons/ri';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import CommonListViewTable from '../CommonListViewTable';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { showToast } from 'utils/toast-component';

const QrBarCode = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState();
  const [open, setOpen] = useState(false);
  const [modalTableData, setModalTableData] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState('');

  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    { accessorKey: 'qrBarCodeValue', header: 'Qr/BarCodeGenerator', size: 140 },
    {
      accessorKey: 'count',
      header: 'Count',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllQrBarCode();
  }, []);

  const getAllQrBarCode = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/qrbarcode/getAllSingleQrBarCode`);
      setListViewData(response.data.paramObjectsMap.SingleQrBarCodeVO.reverse());
      console.log('Test', response.data.paramObjectsMap.SingleQrBarCodeVO);
    } catch (err) {
      setError('Failed to save data');
      console.error(err);
    }
  };

  const getCountryById = async (row) => {
    console.log('THE SELECTED COUNTRY ID IS:', row.original.id);
    setEditId(row.original.id);
    setListView(false);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/qrbarcode/getSingleQrBarCodeById?id=${row.original.id}`);

      if (response.data) {
        const { qrBarCodeValue, count } = response.data.paramObjectsMap.SingleQrBarCodeVO;
        setInputValue(qrBarCodeValue);
        setCount(count);
        setEditMode(true);
      } else {
        console.error('No data found for this ID:', row.original.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleSave = async () => {
    setError('');

    if (!inputValue) {
      setError('Qr/Bar Code Generator is required');
      return;
    }

    if (count < 1) {
      setError('Count must be at least 1');
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/qrbarcode/createUpdateSingleQrBarCode`, {
        id: editId,
        qrBarCodeValue: inputValue,
        count
      });
      showToast('success', 'Qr Barcode created successfully');

      getAllQrBarCode();
      console.log('Data saved successfully:', response.data);
      setInputValue('');
      setCount('');
    } catch (err) {
      setError('Failed to save data');
      // console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleCountChange = (e) => {
    setCount(Number(e.target.value));
    setError('');
  };

  const handleGenerate = () => {
    if (inputValue.trim() === '' || count < 1) {
      setError('Input value and count must be provided.');
      return;
    }

    const qrCodeArray = Array.from({ length: count }, () => inputValue);
    const barCodeArray = Array.from({ length: count }, () => inputValue);

    const data = qrCodeArray.map((qr, index) => ({
      id: index,
      qrcodevalue: qr,
      barcodevalue: barCodeArray[index]
    }));

    setModalTableData(data);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        modalTableData.forEach((row, index) => {
          JsBarcode(`#barcode-${index}`, row.barcodevalue, {
            format: 'CODE128',
            width: 2,
            height: 40,
            displayValue: true
          });
        });
      }, 0);
    }
  }, [modalTableData, open]);

  const handleGenerateClose = () => {
    setOpen(false);
  };

  const handlePrint = async () => {
    const pdf = new jsPDF();
    const content = document.getElementById('dialog-content');
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('generated_codes.pdf');
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="Clear" icon={ClearIcon} onClick={() => setInputValue('')} />
            <ActionButton title="Save" icon={SaveIcon} onClick={() => handleSave()} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCountryById} />
          </div>
        ) : (
          <>
            <div className="BarQrCode">
              <div className="row">
                <div className="col-md-3">
                  <TextField
                    size="small"
                    fullWidth
                    label="Qr/Bar Code Generator"
                    margin="normal"
                    name="inputValue"
                    value={inputValue}
                    onChange={handleInputChange}
                    error={!!error && !inputValue}
                    helperText={!inputValue ? error : ''}
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    label="Count"
                    name="count"
                    value={count}
                    onChange={handleCountChange}
                    type="number"
                    inputProps={{ min: 1 }}
                    error={!!error && (isNaN(count) || count < 1)}
                    helperText={isNaN(count) || count < 1 ? error : ''}
                  />
                </div>
              </div>
              {/* <Box mt={4}>
                {modalTableData.length > 0 && (
                  <div>
                    <Typography variant="h6">Generated Codes:</Typography>
                    {modalTableData.map((row) => (
                      <div key={row.id}>
                        <QRCodeSVG value={row.qrcodevalue} size={128} />
                        <svg id={`barcode-${row.id}`}></svg>
                      </div>
                    ))}
                  </div>
                )}
              </Box> */}
            </div>
          </>
        )}

        <div>
          {open && (
            <Dialog open={open} maxWidth={'md'} fullWidth={true} onClose={handleGenerateClose}>
              <DialogTitle>Generated Codes</DialogTitle>
              <DialogContent>
                <div id="dialog-content">
                  <table className="table table-bordered">
                    <thead>
                      <tr style={{ backgroundColor: '#673AB7' }}>
                        <th className="table-header">QrCode Value</th>
                        <th className="table-header">BarCode Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalTableData.map((row, index) => (
                        <tr key={row.id}>
                          <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                            <QRCodeSVG value={row.qrcodevalue} size={64} />
                          </td>
                          <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                            <svg id={`barcode-${index}`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleGenerateClose} sx={{ color: '#673AB7' }}>
                  Close
                </Button>
                <Button onClick={handlePrint} variant="contained" sx={{ backgroundColor: '#673AB7' }}>
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

export default QrBarCode;
