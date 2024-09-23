import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import SaveIcon from '@mui/icons-material/Save';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { MaterialReactTable } from 'material-react-table';

export const PendingBuyerOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginFinYear, setLoginFinYear] = useState(localStorage.getItem('finYear'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [listView, setListView] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const reportColumns = [
    { accessorKey: 'sno', header: 'S No', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
    { accessorKey: 'orderNo', header: 'Order No', size: 140 },
    { accessorKey: 'orderDate', header: 'Order Date', size: 140 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'shipToName', header: 'Ship To Name', size: 140 },
    { accessorKey: 'billToName', header: 'Bill To Name', size: 140 },
    { accessorKey: 'buyerName', header: 'Buyer Name', size: 140 }
  ];

  useEffect(() => {
    getPendingBuyerOrderDetails();
  }, []);

  const getPendingBuyerOrderDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `buyerOrder/getPendingBuyerOrderDetails?branchCode=${loginBranchCode}&finYear=${loginFinYear}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        setRowData(response.paramObjectsMap.pendingOrderDetails);
        setIsLoading(false);
        setListView(true);
      } else {
        showToast('error', response.paramObjectsMap.errorMessage || 'Report Fetch failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Report Fetch failed');
      setIsLoading(false);
    }
  };

  const handleSelectedRows = async (selectedRows) => {
    const selectedRowsData = selectedRows.map((row) => row.original);
    setSelectedRows(selectedRowsData);
    console.log('selectedRowsData', selectedRowsData);

    if (selectedRows.length === 0) {
      showToast('error', 'Please select at least one order');
      return;
    }

    const errors = {};
    if (!loginBranch) {
      errors.loginBranch = 'Branch is required';
    }
    if (!loginBranchCode) {
      errors.loginBranchCode = 'BranchCode is required';
    }
    if (!loginClient) {
      errors.loginClient = 'Client is required';
    }
    if (!loginCustomer) {
      errors.loginCustomer = 'Customer is required';
    }
    if (!loginWarehouse) {
      errors.loginWarehouse = 'Warehouse is required';
    }
    if (!loginFinYear) {
      errors.loginFinYear = 'FinYear is required';
    }

    if (Object.keys(errors).length > 0) {
      showToast('error', 'Please fix validation errors');
      return;
    }

    setIsLoading(true);

    const saveFormData = selectedRowsData.map((row) => ({
      billToName: row.billToName,
      branch: loginBranch,
      branchCode: loginBranchCode,
      buyerName: row.buyerName,
      client: loginClient,
      createdBy: loginUserName,
      customer: loginCustomer,
      finYear: loginFinYear,
      invoiceDate: row.invoiceDate,
      invoiceNo: row.invoiceNo,
      orderDate: row.orderDate,
      orderNo: row.orderNo,
      orgId: orgId,
      refDate: row.refDate,
      refNo: row.refNo,
      shipToName: row.shipToName,
      warehouse: loginWarehouse
    }));

    console.log('DATA TO SAVE IS:', saveFormData);

    try {
      const result = await apiCalls('put', `buyerOrder/createMultipleBuyerOrder`, saveFormData);

      if (result.status === true) {
        console.log('Response:', result);
        showToast('success', 'Multiple Buyer Orders created successfully');
        handleClear();
        getPendingBuyerOrderDetails();
      } else {
        showToast('error', result.paramObjectsMap.errorMessage || 'Multiple Buyer Order creation failed');
      }
    } catch (err) {
      console.log('error', err);
      showToast('error', 'Multiple Buyer Order creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedRows([]);
  };

  return (
    <>
      {listView && (
        <div>
          <MaterialReactTable
            columns={reportColumns}
            data={rowData}
            enableRowSelection={true}
            renderTopToolbarCustomActions={({ table }) => (
              <ActionButton
                title="Generate Buyer Order"
                icon={SaveIcon}
                onClick={() => handleSelectedRows(table.getSelectedRowModel().rows)}
              />
            )}
          />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default PendingBuyerOrder;
