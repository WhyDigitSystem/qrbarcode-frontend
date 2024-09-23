import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { getAllActiveBranches, getAllActiveEmployees } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { decryptPassword, encryptPassword } from 'views/utilities/encryptPassword';

export const DocumentTypeMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    screenCode: '',
    screenName: '',
    userType: '',
    docCode: '',
    desc: ''
  });
  const [value, setValue] = useState(0);
  const [clientTableData, setClientTableData] = useState([{ id: 1, clientCode: '', client: '' }]);
  const [clientTableErrors, setClientTableErrors] = useState([
    {
      clientCode: '',
      client: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    screenCode: '',
    screenName: '',
    userType: '',
    docCode: '',
    desc: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'screenCode', header: 'screenCode', size: 140 },
    { accessorKey: 'screenName', header: 'Screen', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);
  const [screenList, setScreenList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [clientList, setClientList] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    getAllScreens();
    getAllDocumentType();
    // getAllCustomers();
    getAllClients();
  }, []);

  const getAllScreens = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/allScreenNames`);
      console.log('API Response:', response);

      if (response.status === true) {
        setScreenList(response.paramObjectsMap.screenNamesVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllClients = async () => {
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
  const getAllDocumentType = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/getAllDocumentType?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.documentTypeVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDocumentTypeById = async (row) => {
    console.log('THE SELECTED DOCUMENTTYPE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/documentTypeById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularClient = response.paramObjectsMap.documentTypeVO;

        setFormData({
          screenName: particularClient.screenName,
          screenCode: particularClient.screenCode,
          desc: particularClient.description,
          docCode: particularClient.docCode,
          active: particularClient.active === 'Active' ? true : false
        });

        const alreadySelectedClient = particularClient.documentTypeDetailsVO.map((i) => {
          const foundClient = clientList.find((cl) => cl.client === i.client);
          console.log(`Searching for branch with code ${i.client}:`, foundClient);
          return {
            id: i.id,
            client: foundClient ? foundClient.client : 'Not Found',
            clientCode: foundClient.clientCode ? foundClient.clientCode : 'Not Found'
          };
        });
        setClientTableData(alreadySelectedClient);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   const nameRegex = /^[A-Za-z ]*$/;
  //   const alphaNumericRegex = /^[A-Za-z0-9]*$/;
  //   const numericRegex = /^[0-9]*$/;

  //   let errorMessage = '';

  //   switch (name) {
  //     case 'docCode':
  //       if (!alphaNumericRegex.test(value)) {
  //         errorMessage = 'Only numeric characters are allowed';
  //       } else if (value.length > 10) {
  //         errorMessage = 'Invalid Format';
  //       }
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   } else {
  //     if (name === 'screenCode') {
  //       const selectedScreen = screenList.find((scr) => scr.screenCode === value);
  //       if (selectedScreen) {
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           screenName: selectedScreen.screenName,
  //           screenCode: selectedScreen.screenCode
  //         }));
  //       }
  //     }

  //     setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));

  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;

    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;

    let errorMessage = '';

    switch (name) {
      case 'docCode':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;

      // Add other cases here if needed
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'screenCode') {
        const selectedScreen = screenList.find((scr) => scr.screenCode === value);
        if (selectedScreen) {
          setFormData((prevData) => ({
            ...prevData,
            screenName: selectedScreen.screenName,
            screenCode: selectedScreen.screenCode
          }));
        }
      }

      const updatedValue = value.toUpperCase();
      setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Preserve cursor position for text inputs
      if (type === 'text' && e.target.setSelectionRange) {
        setTimeout(() => {
          e.target.setSelectionRange(selectionStart, selectionEnd);
        }, 0);
      }
    }
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        // if (table === roleTableData) handleAddRow();
        // else if (table === branchTableData) handleAddRow1();
        handleAddRow();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(clientTableData)) {
      displayRowError(clientTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      clientCode: '',
      client: ''
    };
    setClientTableData([...clientTableData, newRow]);
    setClientTableErrors([
      ...clientTableErrors,
      {
        clientCode: '',
        client: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;
    if (table === clientTableData) {
      return !lastRow.client;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === clientTableData) {
      setClientTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          clientCode: !table[table.length - 1].clientCode ? 'clientCode is required' : '',
          client: !table[table.length - 1].client ? 'Client is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable) => {
    setTable(table.filter((row) => row.id !== id));
  };

  const getAvailableClients = (currentRowId) => {
    const selectedClients = clientTableData.filter((row) => row.id !== currentRowId).map((row) => row.client);
    return clientList.filter((client) => !selectedClients.includes(client.client));
  };

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

  const handleClear = () => {
    setFormData({
      screenCode: '',
      screenName: '',
      docCode: '',
      desc: '',
      active: true
    });

    setClientTableData([{ id: 1, clientCode: '', client: '' }]);
    setFieldErrors({
      screenCode: '',
      screenName: '',
      docCode: '',
      desc: ''
    });
    setClientTableErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('handle save is working');

    const errors = {};
    if (!formData.screenCode) {
      errors.screenCode = 'Client Code is required';
    }
    if (!formData.desc) {
      errors.desc = 'Desc is required';
    }
    if (!formData.docCode) {
      errors.docCode = 'Doc Code is required';
    }

    let clientTableDataValid = true;
    const newTableErrors2 = clientTableData.map((row) => {
      const rowErrors = {};
      if (!row.clientCode) {
        rowErrors.clientCode = 'clientCode is required';
        clientTableDataValid = false;
      }
      if (!row.client) {
        rowErrors.client = 'Client is required';
        clientTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setClientTableErrors(newTableErrors2);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const clientVo = clientTableData.map((row) => ({
        clientCode: row.clientCode,
        client: row.client
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        screenCode: formData.screenCode,
        docCode: formData.docCode,
        description: formData.desc,
        screenName: formData.screenName,
        documentTypeDetailsDTO: clientVo,
        active: formData.active,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateDocumentType`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Document Type Updated Successfully' : 'Document Type created successfully');
          handleClear();
          getAllDocumentType();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Document Type creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Document Type creation failed');
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
      screenCode: '',
      screenName: '',
      docCode: '',
      desc: '',
      active: true
    });
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getDocumentTypeById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.screenCode}>
                  <InputLabel id="screenCode-label">Screen Code</InputLabel>
                  <Select
                    labelId="screenCode-label"
                    label="screenCode"
                    value={formData.screenCode}
                    onChange={handleInputChange}
                    name="screenCode"
                  >
                    {screenList?.map((row) => (
                      <MenuItem key={row.id} value={row.screenCode}>
                        {row.screenCode}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.screenCode && <FormHelperText>{fieldErrors.screenCode}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Screen Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="screenName"
                  value={formData.screenName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.screenName}
                  helperText={fieldErrors.screenName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Desc"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  error={!!fieldErrors.desc}
                  helperText={fieldErrors.desc}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Doc Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="docCode"
                  value={formData.docCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.docCode}
                  helperText={fieldErrors.docCode}
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
                  <Tab value={0} label="Client Access" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-6">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Client </th>
                                  <th className="px-2 py-2 text-white text-center">Client Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clientTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() => handleDeleteRow(row.id, clientTableData, setClientTableData)}
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

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
export default DocumentTypeMaster;
