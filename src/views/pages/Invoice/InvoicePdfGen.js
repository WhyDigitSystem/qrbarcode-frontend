import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';

const InvoicePdfGen = ({ row, callBackFunction }) => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Function to open the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to generate and download the PDF
  const handleDownloadPdf = async () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save(`Invoice_${row.invoiceNo}.pdf`);

      handleClose();
    } else {
      console.error("Element not found: 'pdf-content'");
    }
  };

  // Automatically open the dialog when the component is rendered
  useEffect(() => {
    if (row) {
      handleOpen();
    }
    console.log('RowData =>', row);

    // Call the callback function to pass handleDownloadPdf if needed
    if (callBackFunction) {
      callBackFunction(handleDownloadPdf);
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB'); // Format date as DD/MM/YYYY
    const formattedTime = now.toLocaleTimeString('en-GB'); // Format time as HH:MM:SS
    setCurrentDateTime(`${formattedDate} ${formattedTime}`);
  }, [row, callBackFunction]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      onEntered={handleDownloadPdf} // Ensure content is fully rendered before generating PDF
    >
      <DialogContent>
        <div className="mt-2 text-center">
          <strong>Invoice</strong>
        </div>
        <div
          id="pdf-content"
          style={{
            padding: '20px',
            width: '210mm',
            height: 'auto',
            margin: 'auto',
            // fontFamily: 'Roboto, Arial, sans-serif',
            position: 'relative'
          }}
        >
          {/* <!-- Header Section --> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              marginBottom: '20px',
              borderBottom: '1px solid #000000',
              paddingBottom: '10px'
              // color: '#333'
            }}
          >
            {/* <div>EFit QrBar Code</div>
            <div>Invoice</div> */}
            <div>{localStorage.getItem('branch')}</div>
          </div>

          {/* <!-- Details Section --> */}
          <div>
            <div className="mb-3">
              <strong>Invoice No : </strong>
              <span>{row.invoiceNo}</span>
            </div>
            <div className="mb-3">
              <strong>Invoice Date : </strong>
              <span> {row.invoiceDate}</span>
            </div>
            <div className="mb-3">
              <strong>Term : </strong>
              <span>{row.term}</span>
            </div>
            <div className="mb-3">
              <strong>Due Date : </strong>
              <span>{row.dueDate}</span>
            </div>
            <div className="mb-3">
              <strong>Total : </strong>
              <span>{row.total}</span>
            </div>
          </div>
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#555'
            }}
          >
            <div>
              <div className="mb-3">
                <strong>Bill To Address : </strong>
                <span> {row.billToAddress}</span>
              </div>
              <div className="mb-3">
                <strong>Service Month : </strong>
                <span> {row.serviceMonth}</span>
              </div>
              <div className="mb-3">
                <strong>Tax : </strong>
                <span>{row.tax}</span>
              </div>
              <div className="mb-3">
                <strong>Total : </strong>
                <span> {row.total}</span>
              </div>
              <div className="mb-3">
                <strong>Notes : </strong>
                <span>{row.notes}</span>
              </div>
            </div>
            <div style={{ textAlign: 'lrft' }}>
              <div className="mb-3">
                <strong>Ship To Address : </strong>
                <span>{row.shipToAddress}</span>
              </div>
              <div className="mb-3">
                <strong>Company Address : </strong>
                <span> {row.companyAddress}</span>
              </div>
              <div className="mb-3">
                <strong>Subtotal : </strong>
                <span> {row.subTotal}</span>
              </div>
              <div className="mb-3">
                <strong>Terms and Conditions : </strong>
                <span> {row.termsAndConditions}</span>
              </div>
            </div>
          </div>

          {/* <!-- Table Section --> */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '12px',
              border: '1px solid #000000'
            }}
          >
            <thead>
              <tr style={{ fontWeight: 'bold' }}>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>S.No </th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Description *</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Quantity *</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Rate *</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Amount *</th>
                {/* <th style={{ border: '1px solid #000000', padding: '10px' }}>P. Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Location</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Tick</th> */}
              </tr>
            </thead>
            <tbody>
              {row.productLines?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.description}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.rate}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <!-- Total Section --> */}
          <div
            style={{
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333'
            }}
          >
            Total: {row.productLines?.reduce((sum, item) => sum + item.putAwayQty, 0)}
          </div>

          <div>
            <div className="mb-3">
              <strong>BankName : </strong>
              {row.bankName}
            </div>
            <div className="mb-3">
              <strong>AccountNo : </strong>
              {row.accountNo}
            </div>
            <div className="mb-3">
              <strong>Account Name : </strong>
              {row.accountName}
            </div>
            <div className="mb-3">
              <strong>Term : </strong>
              {row.term}
            </div>
            <div>
              <strong>IFSC : </strong>
              {row.ifsc}
            </div>
          </div>

          <div
            style={{
              textAlign: 'Left',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333',
              marginTop: '10%'
            }}
          >
            Authorised Signatory
          </div>

          {/* <!-- Footer Section --> */}
          <div
            style={{
              borderTop: '2px solid #000000',
              paddingTop: '10px',
              fontSize: '12px',
              color: '#777',
              textAlign: 'center',
              // position: 'absolute',
              bottom: '0',
              width: '100%',
              marginTop: '5%'
            }}
          >
            <div>Footer</div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownloadPdf} color="primary" variant="contained" startIcon={<DownloadIcon />}>
          PDF
        </Button>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePdfGen;
