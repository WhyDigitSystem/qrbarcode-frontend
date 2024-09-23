import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { getAllActiveBranches, getAllActiveEmployees } from 'utils/CommonFunctions';

export const WarehouseMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    warehouse: '',
    active: true,
    orgId: 1
  });
  const [value, setValue] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [clientList, setClientList] = useState([]);

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === clientTableData) {
      return !lastRow.client || !lastRow.clientCode;
    }
    // else if (table === branchTableData) {
    //   return !lastRow.customerBranchCode;
    // }
    return false;
  };

  const displayRowError = (table) => {
    if (table === clientTableData) {
      setClientTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          client: !table[table.length - 1].client ? 'Client is required' : '',
          clientCode: !table[table.length - 1].clientCode ? 'Client Code is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(clientTableData)) {
      displayRowError(clientTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      client: '',
      clientCode: ''
    };
    setClientTableData([...clientTableData, newRow]);
    setClientTableErrors([...clientTableErrors, { client: '', clientCode: '' }]);
  };
  const [clientTableErrors, setClientTableErrors] = useState([
    {
      client: '',
      clientCode: ''
    }
  ]);

  const theme = useTheme();
  const anchorRef = useRef(null);
  const inputRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({
    warehouse: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'warehouse', header: 'Warehouse', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  const [clientTableData, setClientTableData] = useState([{ id: 1, client: '', clientCode: '' }]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;

    const nameRegex = /^[A-Za-z ]*$/;
    const numericRegex = /^[0-9]*$/;

    let errorMessage = '';

    switch (name) {
      case 'branch':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;

      case 'warehouse':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabet characters are allowed';
        }
        break;

      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Convert the input value to uppercase
      const upperCaseValue = value.toUpperCase();

      // Set the form data and preserve the cursor position
      setFormData((prevData) => ({ ...prevData, [name]: upperCaseValue }));

      // Use a timeout to ensure the cursor position is set after the state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  const handleActiveChange = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked
    });
  };

  const handleDeleteRow = (id) => {
    setClientTableData(clientTableData.filter((row) => row.id !== id));
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        if (table === clientTableData) handleAddRow();
        // else if (table === branchTableData) handleAddRow1();
      }
    }
  };

  const handleClear = () => {
    setFormData({
      warehouse: '',
      active: true
    });
    setClientTableData([{ id: 1, client: '', clientCode: '' }]);
    setFieldErrors({
      warehouse: ''
    });
    setEditId('');
    setClientTableErrors(clientTableErrors.map(() => ({ client: '', clientCode: '' })));
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.warehouse) {
      errors.warehouse = 'Warehouse is required';
    }

    let clientTableDataValid = true;
    const newTableErrors = clientTableData.map((row) => {
      const rowErrors = {};
      if (!row.client) {
        rowErrors.client = 'Client is required';
        clientTableDataValid = false;
      }
      if (!row.clientCode) {
        rowErrors.clientCode = 'Client Code is required';
        clientTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setClientTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && clientTableDataValid) {
      setIsLoading(true);
      const clientVo = clientTableData.map((row) => ({
        client: row.client,
        clientCode: row.clientCode
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        warehouse: formData.warehouse,
        warehouseClientDTO: clientVo,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateWarehouse`, saveFormData);

        if (response.status === true) {
          console.log('Response:', response.data);
          showToast('success', editId ? ' Warehouse Updated Successfully' : 'Warehouse created successfully');
          handleClear();
          getAllWarehouse();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Warehouse creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', error.message);
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleClose = () => {
    setFormData({
      branch: '',
      warehouse: '',
      active: true
    });
  };

  useEffect(() => {
    getAllClient();
    getAllWarehouse();
  }, []);

  const handleClientChange = (row, index, event) => {
    const value = event.target.value;
    const selectedClient = clientList.find((client) => client.client === value);
    setClientTableData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, client: value, clientCode: selectedClient ? selectedClient.clientCode : '' } : r))
    );
    setClientTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        client: !value ? 'Client is required' : ''
      };
      return newErrors;
    });
  };

  const getAllClient = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/getClientAndClientCodeByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setClientList(response.paramObjectsMap.CustomerVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const getAvailableClients = (currentRowId) => {
  //   if (!Array.isArray(clientTableData) || !Array.isArray(clientList)) {
  //     console.error('clientTableData or clientList is not an array');
  //     return [];
  //   }

  //   const selectedClients = clientTableData.filter((row) => row.id !== currentRowId).map((row) => row.client);

  //   return clientList.filter((client) => !selectedClients.includes(client.client));
  // };

  const getAvailableClients = (currentRowId) => {
    const selectedClients = clientTableData.filter((row) => row.id !== currentRowId).map((row) => row.client);
    return clientList.filter((client) => !selectedClients.includes(client.client));
  };

  const getAllWarehouse = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/warehouse?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.warehouseVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getWarehouseById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/warehouse/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularWarehouse = response.paramObjectsMap.Warehouse;
        setFormData({
          branch: particularWarehouse.branch,
          warehouse: particularWarehouse.warehouse,

          active: particularWarehouse.active === 'Active' ? true : false
        });
        setClientTableData(
          particularWarehouse.warehouseClientVO.map((role) => ({
            id: role.id,
            client: role.client,
            clientCode: role.clientCode
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getWarehouseById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Branch"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="branch"
                  value={branch}
                  onChange={handleInputChange}
                  error={!!fieldErrors.branch}
                  helperText={fieldErrors.branch}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Warehouse"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleInputChange}
                  error={!!fieldErrors.warehouse}
                  helperText={fieldErrors.warehouse}
                  inputRef={inputRef}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleActiveChange} name="active" color="primary" />}
                  label="Active"
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
                  <Tab value={0} label="Client" />
                  {/* <Tab value={1} label="Branch" /> */}
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <Tooltip title="Add" placement="top">
                          <ButtonBase sx={{ borderRadius: '12px', marginLeft: '10px' }} onClick={handleAddRow}>
                            <Avatar
                              variant="rounded"
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                '&[aria-controls="menu-list-grow"],&:hover': {
                                  background: theme.palette.secondary.dark,
                                  color: theme.palette.secondary.light
                                }
                              }}
                              ref={anchorRef}
                              aria-haspopup="true"
                              color="inherit"
                            >
                              <AddIcon size="1.3rem" stroke={1.5} />
                            </Avatar>
                          </ButtonBase>
                        </Tooltip>
                      </div>
                      {/* Table */}
                      <div className="row mt-2">
                        <div className="col-lg-6">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '15%' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '14%' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 225 }}>
                                    Client
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Client Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clientTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <Tooltip title="Delete" placement="top">
                                        <ButtonBase
                                          sx={{ borderRadius: '12px', marginLeft: '4px' }}
                                          onClick={() => handleDeleteRow(row.id)}
                                        >
                                          <Avatar
                                            variant="rounded"
                                            sx={{
                                              ...theme.typography.commonAvatar,
                                              ...theme.typography.mediumAvatar,
                                              transition: 'all .2s ease-in-out',
                                              background: theme.palette.secondary.light,
                                              color: theme.palette.secondary.dark,
                                              '&[aria-controls="menu-list-grow"],&:hover': {
                                                background: theme.palette.secondary.dark,
                                                color: theme.palette.secondary.light
                                              }
                                            }}
                                            ref={anchorRef}
                                            aria-haspopup="true"
                                            color="inherit"
                                          >
                                            <DeleteIcon size="1.3rem" stroke={1.5} />
                                          </Avatar>
                                        </ButtonBase>
                                      </Tooltip>
                                    </td>
                                    <td className="text-center">{index + 1}</td>

                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.client}
                                        onChange={(e) => handleClientChange(row, index, e)}
                                        onKeyDown={(e) => handleKeyDown(e, row, clientTableData)}
                                        className={clientTableErrors[index]?.client ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {getAvailableClients(row.id).map((client) => (
                                          <option key={client.id} value={client.client}>
                                            {client.client}
                                          </option>
                                        ))}
                                      </select>
                                      {clientTableErrors[index]?.client && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].client}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2 text-center pt-3">{row.clientCode}</td>
                                  </tr>
                                ))}
                              </tbody>
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
        )}
      </div>
      <ToastContainer />
    </>
  );
};
export default WarehouseMaster;
