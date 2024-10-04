import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"; // Importing necessary components
import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";
import ActionButton from "utils/ActionButton";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { RiAiGenerate } from "react-icons/ri";

const QrBarCode = () => {
  const [inputValue, setInputValue] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [barCodes, setBarCodes] = useState([]);
  const [count, setCount] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [viewId, setViewId] = useState("");
  const [open, setOpen] = useState(false); // State for dialog
  const [modalTableData, setModalTableData] = useState([]); // State for modal table data

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCountChange = (e) => {
    setCount(e.target.value);
  };

  const generateQrCode = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      const qrCodeArray = Array.from({ length: count }, () => inputValue);
      setQrCodes(qrCodeArray);
    } else {
      console.error("Input value for QR Code cannot be empty.");
    }
  };

  const generateBarCode = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      const barCodeArray = Array.from({ length: count }, () => inputValue);
      setBarCodes(barCodeArray);
    } else {
      console.error("Input value for Barcode cannot be empty.");
      clearBarcode();
    }
  };

  const clearFields = () => {
    setInputValue("");
    setQrCodes([]);
    setBarCodes([]);
    clearBarcode();
  };

  const clearBarcode = () => {
    barCodes.forEach((_, index) => {
      const barcodeElement = document.getElementById(`barcode-${index}`);
      if (barcodeElement) {
        barcodeElement.innerHTML = "";
      }
    });
  };

  useEffect(() => {
    barCodes.forEach((code, index) => {
      const barcodeElement = document.getElementById(`barcode-${index}`);
      if (barcodeElement) {
        JsBarcode(barcodeElement, code, {
          format: "CODE128",
          displayValue: true,
        });
      }
    });
  }, [barCodes]);

  const handleBulkUploadOpen = () => {};
  const handleClear = () => {};
  const handleGenerate = () => {
    setOpen(true); // Open the dialog when generating
    // Populate modalTableData as needed
  };
  
  const handleSave = () => {
    // Implement save logic
  };

  const handleGenerateClose = () => {
    setOpen(false); // Close the dialog
  };

  const handlePrint = () => {
    // Implement print logic
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: "20px", borderRadius: "10px" }}>
      <div className="row d-flex ml">
        <div className="d-flex flex-wrap justify-content-start mb-2" style={{ marginBottom: "20px" }}>
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          {!viewId && (
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
          )}
          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
          <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
        </div>
      </div>
      <div className="BarQrCode">
        <div className="row">
          <div className="col-md-3 ">
            <TextField
              size="small"
              fullWidth
              label="Qr/Bar Code Generator"
              margin="normal"
              name="inputValue"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3 ">
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
            />
          </div>
        </div>

        <Box mt={2}>
          <Button color="primary" size="large" variant="contained" onClick={generateBarCode}>
            Bar Code
          </Button>
          <Button color="primary" size="large" variant="contained" onClick={generateQrCode} style={{ margin: "0 5px" }}>
            Qr Code
          </Button>
          <Button color="primary" size="large" variant="contained" onClick={clearFields}>
            Clear
          </Button>
        </Box>

        <Box mt={4}>
          {qrCodes.length > 0 && (
            <div>
              <Typography variant="h6">Generated QR Codes:</Typography>
              {qrCodes.map((code, index) => (
                <div key={index}>
                  <QRCodeSVG value={code} size={128} />
                </div>
              ))}
            </div>
          )}
          {barCodes.length > 0 && (
            <div>
              <Typography variant="h6">Generated Barcodes:</Typography>
              {barCodes.map((code, index) => (
                <div key={index}   >
                  <svg id={`barcode-${index}`}></svg>
                </div>
              ))}
            </div>
          )}
        </Box>
      </div>
      <div>
        {open && (
          <Dialog
            open={open}
            maxWidth={'md'}
            fullWidth={true}
            onClose={handleGenerateClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle>Generated Codes</DialogTitle>
            <DialogContent>
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
                        <svg id={`barcode-${index}`} value={row.barcodevalue}></svg>  
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  );
};

export default QrBarCode;
