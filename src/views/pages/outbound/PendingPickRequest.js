import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import SaveIcon from '@mui/icons-material/Save';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { MaterialReactTable } from 'material-react-table';

export const PendingPickRequest = () => {
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
    { accessorKey: 'buyerOrderNo', header: 'Buyer Order No', size: 140 },
    { accessorKey: 'buyerOrderDate', header: 'Buyer Order Date', size: 140 },
    { accessorKey: 'buyerRefDate', header: 'Buyer Ref Date', size: 140 },
    { accessorKey: 'buyerRefNo', header: 'Buyer Ref No', size: 140 },
    { accessorKey: 'buyersReference', header: 'Buyers Reference', size: 140 },
    { accessorKey: 'buyersReferenceDate', header: 'Buyers Reference Date', size: 250 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 },
    { accessorKey: 'clientName', header: 'Client Name', size: 140 },
    { accessorKey: 'clientShortName', header: 'Client Short Name', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'customerShortName', header: 'Customer Short Name', size: 140 }
  ];

  useEffect(() => {
    getPendingPickDetails();
  }, []);

  const getPendingPickDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `pickrequest/getPendingPickDetails?branchCode=${loginBranchCode}&finYear=${loginFinYear}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        setRowData(response.paramObjectsMap.pendingPickdetails);
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
      branch: loginBranch,
      branchCode: loginBranchCode,
      buyerOrderDate: row.buyerOrderDate,
      buyerOrderNo: row.buyerOrderNo,
      buyerRefDate: row.buyerRefDate,
      buyerRefNo: row.buyerRefNo,
      buyersReference: row.buyersReference,
      client: loginClient,
      clientName: row.clientName,
      clientShortName: row.clientShortName,
      createdBy: loginUserName,
      customer: loginCustomer,
      customerName: row.customerName,
      customerShortName: row.customerShortName,
      finYear: loginFinYear,
      invoiceNo: row.invoiceNo,
      orgId: orgId,
      warehouse: loginWarehouse
    }));

    console.log('DATA TO SAVE IS:', saveFormData);

    try {
      const result = await apiCalls('post', `pickrequest/createMultiplePickRequest`, saveFormData);

      if (result.status === true) {
        console.log('Response:', result);
        showToast('success', 'Multiple Pick Request created successfully');
        handleClear();
        getPendingPickDetails();
      } else {
        showToast('error', result.paramObjectsMap.errorMessage || 'Multiple Pick Request creation failed');
      }
    } catch (err) {
      console.log('error', err);
      showToast('error', 'Multiple Pick Request creation failed');
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
                title="Generate Pick Request"
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

export default PendingPickRequest;
