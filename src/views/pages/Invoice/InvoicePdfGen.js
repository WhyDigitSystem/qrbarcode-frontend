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

          {/* <div>
            <div class="d-flex flex-row bd-highlight mb-3">
              <strong style={{ width: '120px' }}>Invoice No</strong>
              <div>:</div>
              <div style={{ marginLeft: '30px' }}>{row.invoiceNo}</div>
            </div>
            <div class="d-flex flex-row bd-highlight mb-3">
              <strong style={{ width: '120px' }}>Invoice Date</strong>
              <div>:</div>
              <div style={{ marginLeft: '30px' }}>{row.invoiceDate}</div>
            </div>
            <div class="d-flex flex-row bd-highlight mb-3">
              <strong style={{ width: '120px' }}>Term</strong>
              <div>:</div>
              <div style={{ marginLeft: '30px' }}>{row.term}</div>
            </div>
            <div class="d-flex flex-row bd-highlight mb-3">
              <strong style={{ width: '120px' }}>Due Date</strong>
              <div>:</div>
              <div style={{ marginLeft: '30px' }}>{row.term}</div>
            </div>
          </div> */}
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
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Invoice No</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.invoiceNo}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Term</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.term}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Customer</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.customer}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3 pt-3">
                <strong style={{ width: '120px' }}>Service Month </strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.serviceMonth}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>GST Type </strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.gstType}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3 pt-1">
                <strong style={{ width: '120px' }}>SGST</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.sgst}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '119px' }}>Subtotal</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.subTotal}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '124px' }}>Notes</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.notes}</div>
              </div>
            </div>
            <div style={{ textAlign: 'lrft' }}>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Invoice Date</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.invoiceDate}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Due Date</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.dueDate}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '124px' }}>Address</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.address}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Tax</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.tax}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>CGST</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.cgst}</div>
              </div>
              {/* <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Total</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.total}</div>
              </div> */}
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Terms and Conditions</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.termsAndConditions}</div>
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
              <tr style={{ fontWeight: 'bold', backgroundColor: '#673AB7' }}>
                <th className="px-2 py-2 text-white text-center " style={{ border: '1px solid #000000' }}>
                  S.No{' '}
                </th>
                <th className="px-2 py-2 text-white text-center " style={{ border: '1px solid #000000' }}>
                  Description *
                </th>
                <th className="px-2 py-2 text-white text-center " style={{ border: '1px solid #000000' }}>
                  Quantity *
                </th>
                <th className="px-2 py-2 text-white text-center " style={{ border: '1px solid #000000' }}>
                  Rate *
                </th>
                <th className="px-2 py-2 text-white text-center " style={{ border: '1px solid #000000' }}>
                  Amount *
                </th>
              </tr>
            </thead>
            <tbody>
              {row.productLines?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.description}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>{item.rate}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px', textAlign: 'center' }}>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div className="d-flex justify-content-end mb-3">
            <strong style={{ width: '120px' }}>Total</strong>
            <div>:</div>
            <div style={{ marginLeft: '80px', fontWeight: 'bold' }}>{row.total}</div>
          </div> */}
          {/* <!-- Total Section --> */}
          {/* <div
            style={{
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333',
              marginBottom: '20px'
            }}
            class="d-flex justify-content-start"
          >
            <div> Total: </div>
            <div>{row.productLines?.reduce((sum, item) => sum + item.putAwayQty, 0)}</div>
          </div> */}

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
              <div class="d-flex flex-row bd-highlight mb-3">
                {/* <strong style={{ width: '120px' }}>BankName</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.bankName}</div> */}
              </div>
              <div class="d-flex flex-row bd-highlight mb-3 pt-3">
                <strong style={{ width: '120px' }}>BankName</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.bankName}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Account Name</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.accountName}</div>
              </div>
            </div>
            <div style={{ textAlign: 'lrft' }}>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>Total</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px', fontWeight: 'bold' }}>{row.total}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>AccountNo</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.accountNo}</div>
              </div>
              <div class="d-flex flex-row bd-highlight mb-3">
                <strong style={{ width: '120px' }}>IFSC</strong>
                <div>:</div>
                <div style={{ marginLeft: '30px' }}>{row.ifsc}</div>
              </div>
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
