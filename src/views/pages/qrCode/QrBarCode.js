import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Grid, Typography, TextField, Button, Box } from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';

const QrBarCode = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [barCodeValue, setBarCodeValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const generateQrCode = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      setQrCodeValue(inputValue);
      console.log('setQrCodeValue', inputValue);
    } else {
      console.error('Input value for QR Code cannot be empty.');
    }
  };

  const generateBarCode = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      try {
        setBarCodeValue(inputValue);
        JsBarcode('#barcode', inputValue, {
          format: 'CODE128',
          displayValue: true
          // Optional: set other options like width, height, etc.
        });
      } catch (error) {
        console.error('Invalid input for Barcode generation:', error.message);
      }
    } else {
      console.error('Input value for Barcode cannot be empty.');
      clearBarcode(); // Clear previous barcode if the new input is empty
    }
  };

  const clearFields = () => {
    setInputValue('');
    setQrCodeValue('');
    setBarCodeValue('');
    clearBarcode(); // Clear the barcode SVG element
  };

  const clearBarcode = () => {
    const barcodeElement = document.getElementById('barcode');
    if (barcodeElement) {
      barcodeElement.innerHTML = ''; // Clear the barcode SVG content
    }
  };

  return (
    <>
      <Breadcrumb title="Create Bar Qr Code">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          CreateQrcode
        </Typography>
      </Breadcrumb>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <div className="BarQrCode">
                <TextField
                  label="Qr/Bar Code Generator"
                  margin="normal"
                  name="inputValue"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Box mt={2}>
                  <Button color="primary" size="large" variant="contained" onClick={generateBarCode}>
                    Bar Code
                  </Button>
                  <Button color="primary" size="large" variant="contained" onClick={generateQrCode} style={{ margin: '0 5px' }}>
                    Qr Code
                  </Button>
                  <Button color="primary" size="large" variant="contained" onClick={clearFields}>
                    Clear
                  </Button>
                </Box>
                <Box mt={4}>
                  {qrCodeValue && (
                    <div>
                      <Typography variant="h6">Generated QR Code:</Typography>
                      <QRCodeSVG value={qrCodeValue} size={128} />
                    </div>
                  )}
                  {barCodeValue && (
                    <div>
                      <Typography variant="h6">Generated Barcode:</Typography>
                      <svg id="barcode"></svg>
                    </div>
                  )}
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default QrBarCode;
