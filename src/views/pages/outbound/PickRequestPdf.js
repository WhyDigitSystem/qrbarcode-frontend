import DownloadIcon from '@mui/icons-material/Download';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';

const GeneratePdfTempPick = ({ row, callBackFunction }) => {
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
      pdf.save(`PICK_${row.docId}.pdf`);

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
      <DialogTitle>PDF Preview</DialogTitle>
      <DialogContent>
        <div
          id="pdf-content"
          style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            width: '210mm',
            height: 'auto',
            margin: 'auto',
            fontFamily: 'Roboto, Arial, sans-serif',
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
              borderBottom: '2px solid #000000',
              paddingBottom: '10px',
              color: '#333'
            }}
          >
            <div>EFit WMS</div>
            <div>Pick Request</div>
            <div>{localStorage.getItem('branch')}</div>
          </div>

          {/* <!-- Details Section --> */}
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
              <div>
                <strong>Customer : </strong> {row.customer}
              </div>
              <div>
                <strong>Pick No : </strong> {row.docId}
              </div>
              <div>
                <strong>Pick Date : </strong>
                {row.docDate}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>
                <strong>Order No : </strong> {row.buyerRefNo}
              </div>
              <div>
                <strong>Buyer Order No : </strong> {row.buyerOrderNo}
              </div>
              <div>
                <strong>Buyer Order Date:</strong> {row.buyerOrderDate}
              </div>
            </div>
          </div>

          {/* <!-- Footer Section --> */}
          <div
            style={{
              marginBottom: '20px',
              textAlign: 'right',
              fontSize: '12px',
              color: '#777'
            }}
          >
            <div>{currentDateTime}</div>
            <div>Printed By: {localStorage.getItem('userName')}</div>
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
              <tr style={{ backgroundColor: '#673ab7', color: '#fff' }}>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Sl.</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Part Code</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Part Description</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Batch</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Unit</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Pick Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Location</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Tick</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>Avl Qty</th>
                <th style={{ border: '1px solid #000000', padding: '10px' }}>PC</th>
              </tr>
            </thead>
            <tbody>
              {row.pickRequestDetailsVO?.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.partNo}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.partDesc}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.batch || ''}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.sku}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.pickQty}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.bin}</td>
                  <td
                    style={{
                      border: '1px solid #000000',
                      padding: '10px',
                      textAlign: 'center'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '1px solid #333',
                        textAlign: 'center',
                        lineHeight: '20px',
                        fontSize: '16px'
                      }}
                    >
                      {/* Uncomment the line below to display a checked checkbox */}
                      {/* ☑ */}
                      {/* Uncomment the line below to display an unchecked checkbox */}
                    </div>
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}>{item.availQty}</td>
                  <td style={{ border: '1px solid #000000', padding: '10px' }}></td>
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
            Total: {row.pickRequestDetailsVO?.reduce((sum, item) => sum + item.pickQty, 0)}
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
        <Button onClick={handleDownloadPdf} color="secondary" variant="contained" startIcon={<DownloadIcon />}>
          PDF
        </Button>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneratePdfTempPick;
