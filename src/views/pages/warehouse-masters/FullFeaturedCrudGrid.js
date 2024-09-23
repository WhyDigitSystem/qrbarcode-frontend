import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveBranches, getAllActiveCitiesByState, getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

export const FullFeaturedCrudGrid = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    customer: '',
    shortName: '',
    pan: '',
    contactPerson: '',
    mobile: '',
    gstReg: 'YES',
    email: '',
    groupOf: '',
    tanNo: '',
    address: '',
    country: '',
    state: '',
    city: '',
    gst: '',
    active: true
  });
  const [value, setValue] = useState(0);
  const [branchTableData, setBranchTableData] = useState([
    {
      id: 1,
      branchCode: '',
      branch: ''
    }
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      client: '',
      clientCode: '',
      clientType: '',
      fifoFife: ''
    };
    setClientTableData([...clientTableData, newRow]);
    setClientTableErrors([...clientTableErrors, { client: '', clientCode: '', clientType: '', fifoFife: '' }]);
  };
  const handleAddRow1 = () => {
    const newRow = {
      id: Date.now(),
      branchCode: '',
      branch: ''
    };
    setBranchTableData([...branchTableData, newRow]);
    setBranchTableErrors([
      ...branchTableErrors,
      {
        branchCode: '',
        branch: ''
      }
    ]);
  };

  const [clientTableErrors, setClientTableErrors] = useState([
    {
      client: '',
      clientCode: '',
      clientType: '',
      fifoFife: ''
    }
  ]);
  const [branchTableErrors, setBranchTableErrors] = useState([
    {
      branchCode: '',
      branch: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    customer: '',
    shortName: '',
    pan: '',
    contactPerson: '',
    mobile: '',
    gstReg: '',
    email: '',
    groupOf: '',
    tanNo: '',
    address: '',
    country: '',
    state: '',
    city: '',
    gst: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'customerName', header: 'Customer', size: 140 },
    { accessorKey: 'contactPerson', header: 'Contact Person', size: 140 },
    { accessorKey: 'emailId', header: 'Email Id', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  const [clientTableData, setClientTableData] = useState([{ id: 1, client: '', clientCode: '', clientType: '', fifoFife: '' }]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getAllBranches();
    getAllCountries();
    if (formData.country) {
      getAllStates();
    }
    if (formData.state) {
      getAllCities();
    }
    getAllCustomers();
  }, [formData.country, formData.state]);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      setCountryList(countryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllStates = async () => {
    try {
      const stateData = await getAllActiveStatesByCountry(formData.country, orgId);
      setStateList(stateData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllCities = async () => {
    try {
      const cityData = await getAllActiveCitiesByState(formData.state, orgId);
      setCityList(cityData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllBranches = async () => {
    try {
      const branchData = await getAllActiveBranches(orgId);
      setBranchList(branchData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllCustomers = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/customer?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.CustomerVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCustomerById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/customer/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCustomer = response.paramObjectsMap.Customer;
        console.log('THE PARTICULAR CUSTOMER IS:', particularCustomer);

        setFormData({
          customer: particularCustomer.customerName,
          shortName: particularCustomer.customerShortName,
          pan: particularCustomer.panNo,
          contactPerson: particularCustomer.contactPerson,
          mobile: particularCustomer.mobileNumber,
          gstReg: particularCustomer.gstRegistration,
          email: particularCustomer.emailId,
          groupOf: particularCustomer.groupOf,
          tanNo: particularCustomer.tanNo,
          address: particularCustomer.address1,
          country: particularCustomer.country,
          state: particularCustomer.state,
          city: particularCustomer.city,
          gst: particularCustomer.gstNo,
          active: particularCustomer.active === 'Active' ? true : false
        });
        setClientTableData(
          particularCustomer.clientVO.map((cl) => ({
            id: cl.id,
            client: cl.client,
            clientCode: cl.clientCode,
            clientType: cl.clientType,
            fifoFife: cl.fifofife
          }))
        );

        const alreadySelectedBranch = particularCustomer.clientBranchVO.map((br) => {
          const foundBranch = branchList.find((branch) => branch.branchCode === br.branchCode);
          console.log(`Searching for branch with code ${br.branchcode}:`, foundBranch);
          return {
            id: br.id,
            branchCode: foundBranch ? foundBranch.branchCode : 'Not Found',
            branch: foundBranch.branch ? foundBranch.branch : 'Not Found'
          };
        });
        setBranchTableData(alreadySelectedBranch);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;
    const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
    const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    let errorMessage = '';

    switch (name) {
      case 'customer':
      case 'shortName':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      case 'pan':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'branchName':
        if (!branchNameRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters and @, _, -, * are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'gst':
        if (formData.gst === 'YES') {
          if (!alphaNumericRegex.test(value)) {
            errorMessage = 'Only alphanumeric characters are allowed';
          } else if (value.length > 15) {
            errorMessage = 'Invalid Format';
          }
          break;
        }
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'active') {
        setFormData({ ...formData, [name]: checked });
      } else if (name === 'email') {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleDeleteRow = (id) => {
    setClientTableData(clientTableData.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === clientTableData[clientTableData.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };
  const handleDeleteRow1 = (id) => {
    setBranchTableData(branchTableData.filter((row) => row.id !== id));
  };
  const handleKeyDown1 = (e, row) => {
    if (e.key === 'Tab' && row.id === branchTableData[branchTableData.length - 1].id) {
      e.preventDefault();
      handleAddRow1();
    }
  };

  const handleClear = () => {
    setFormData({
      customer: '',
      shortName: '',
      pan: '',
      contactPerson: '',
      mobile: '',
      gstReg: '',
      email: '',
      groupOf: '',
      tanNo: '',
      address: '',
      country: '',
      state: '',
      city: '',
      gst: '',
      active: true
    });
    setClientTableData([{ id: 1, client: '', clientCode: '', clientType: '', fifoFife: '' }]);
    setBranchTableData([{ id: 1, branchCode: '', branchName: '' }]);
    setFieldErrors({
      customer: '',
      shortName: '',
      pan: '',
      contactPerson: '',
      mobile: '',
      gstReg: '',
      email: '',
      groupOf: '',
      tanNo: '',
      address: '',
      country: '',
      state: '',
      city: '',
      gst: ''
    });
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.customer) {
      errors.customer = 'Customer is required';
    }
    if (!formData.shortName) {
      errors.shortName = 'Short Name is required';
    }
    if (!formData.contactPerson) {
      errors.contactPerson = 'Contact Person is required';
    }
    if (!formData.email) {
      errors.email = 'Email ID is required';
    }
    if (!formData.groupOf) {
      errors.groupOf = 'Group Of is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.state) {
      errors.state = 'State is required';
    }
    if (!formData.city) {
      errors.city = 'City is required';
    }
    if (formData.gst === 'YES' && formData.gst.length < 15) {
      errors.gst = 'Invalid GST Format';
    }
    if (!formData.mobile) {
      errors.mobile = 'mobile is required';
    } else if (formData.mobile.length < 10) {
      errors.mobile = 'Invalid Mobile Format';
    }
    if (formData.pan.length < 10) {
      errors.pan = 'Invalid PAN Format';
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
      if (!row.clientType) {
        rowErrors.clientType = 'Client Type is required';
        clientTableDataValid = false;
      }
      if (!row.fifoFife) {
        rowErrors.fifoFife = 'FIFO / FIFE is required';
        clientTableDataValid = false;
      }

      return rowErrors;
    });
    // setFieldErrors(errors);

    setClientTableErrors(newTableErrors);

    let branchTableDataValid = true;
    const newTableErrors1 = branchTableData.map((row) => {
      const rowErrors = {};
      if (!row.branchCode) {
        rowErrors.branchCode = 'Branch Code is required';
        branchTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setBranchTableErrors(newTableErrors1);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const clientVo = clientTableData.map((row) => ({
        client: row.client,
        clientCode: row.clientCode,
        clientType: row.clientType,
        fifofife: row.fifoFife
      }));
      const branchVo = branchTableData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        customerName: formData.customer,
        customerShortName: formData.shortName,
        panNo: formData.pan,
        contactPerson: formData.contactPerson,
        mobileNumber: formData.mobile,
        gstRegistration: formData.gstReg,
        emailId: formData.email,
        groupOf: formData.groupOf,
        tanNo: formData.tanNo,
        address1: formData.address,
        address2: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        gstNo: formData.gst,
        clientDTO: clientVo,
        clientBranchDTO: branchVo,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateCustomer`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Customer Updated Successfully' : 'Customer created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Customer creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Customer creation failed');
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
      customer: '',
      shortName: '',
      pan: '',
      contactPerson: '',
      mobile: '',
      gstReg: '',
      email: '',
      groupOf: '',
      tanNo: '',
      address: '',
      country: '',
      state: '',
      city: '',
      gst: '',
      active: true
    });
  };

  return (
    <>
      <div>{/* <ToastContainer /> */}</div>
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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCustomerById} />
          </div>
        ) : (
          <>
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Detail" />
                  <Tab value={1} label="Client" />
                  <Tab value={2} label="Branch" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Customer"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="customer"
                          value={formData.customer}
                          onChange={handleInputChange}
                          error={!!fieldErrors.customer}
                          helperText={fieldErrors.customer}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Short Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="shortName"
                          value={formData.shortName}
                          onChange={handleInputChange}
                          error={!!fieldErrors.shortName}
                          helperText={fieldErrors.shortName}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Contact Person"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          error={!!fieldErrors.contactPerson}
                          helperText={fieldErrors.contactPerson}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Mobile"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          error={!!fieldErrors.mobile}
                          helperText={fieldErrors.mobile}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Email"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={!!fieldErrors.email}
                          helperText={fieldErrors.email}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Group Of"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="groupOf"
                          value={formData.groupOf}
                          onChange={handleInputChange}
                          error={!!fieldErrors.groupOf}
                          helperText={fieldErrors.groupOf}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="PAN"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="pan"
                          value={formData.pan}
                          onChange={handleInputChange}
                          error={!!fieldErrors.pan}
                          helperText={fieldErrors.pan}
                        />
                      </div>
                      {/* <div className="col-md-3 mb-3">
                <TextField
                  label="GST Registration"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="gstReg"
                  value={formData.gstReg}
                  onChange={handleInputChange}
                  error={!!fieldErrors.gstReg}
                  helperText={fieldErrors.gstReg}
                />
              </div> */}
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="TAN"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="tanNo"
                          value={formData.tanNo}
                          onChange={handleInputChange}
                          error={!!fieldErrors.tanNo}
                          helperText={fieldErrors.tanNo}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Address"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          error={!!fieldErrors.address}
                          helperText={fieldErrors.address}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                          <InputLabel id="country-label">Country</InputLabel>
                          <Select
                            labelId="country-label"
                            label="Country"
                            value={formData.country}
                            onChange={handleInputChange}
                            name="country"
                          >
                            {countryList?.map((row) => (
                              <MenuItem key={row.id} value={row.countryName}>
                                {row.countryName}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.state}>
                          <InputLabel id="state-label">State</InputLabel>
                          <Select labelId="state-label" label="State" value={formData.state} onChange={handleInputChange} name="state">
                            {stateList?.map((row) => (
                              <MenuItem key={row.id} value={row.stateName}>
                                {row.stateName}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.state && <FormHelperText>{fieldErrors.state}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.state}>
                          <InputLabel id="city-label">City</InputLabel>
                          <Select labelId="city-label" label="City" value={formData.city} onChange={handleInputChange} name="city">
                            {cityList?.map((row) => (
                              <MenuItem key={row.id} value={row.cityName}>
                                {row.cityName}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.city && <FormHelperText>{fieldErrors.city}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.gstReg}>
                          <InputLabel id="gstReg">GST Registration</InputLabel>
                          <Select
                            labelId="gstReg"
                            id="gstReg"
                            name="gstReg"
                            label="GST Registration"
                            value={formData.gstReg}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="YES">YES</MenuItem>
                            <MenuItem value="NO">NO</MenuItem>
                          </Select>
                          {fieldErrors.gstReg && <FormHelperText error>{fieldErrors.gstReg}</FormHelperText>}
                        </FormControl>
                      </div>
                      {formData.gstReg === 'YES' && (
                        <div className="col-md-3 mb-3">
                          <TextField
                            label="GST"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="gst"
                            value={formData.gst}
                            onChange={handleInputChange}
                            error={!!fieldErrors.gst}
                            helperText={fieldErrors.gst}
                          />
                        </div>
                      )}
                      <div className="col-md-3 mb-3">
                        <FormControlLabel
                          control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
                          label="Active"
                        />
                      </div>
                    </div>
                  </>
                )}
                {value === 1 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      {/* Table */}
                      <div className="row mt-2">
                        <div className="col-lg-12">
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
                                  <th className="px-2 py-2 text-white text-center">Client</th>
                                  <th className="px-2 py-2 text-white text-center">Client Code</th>
                                  <th className="px-2 py-2 text-white text-center">Client Type</th>
                                  <th className="px-2 py-2 text-white text-center">FEFO / FIFE / LILO</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clientTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.client}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setClientTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, client: value.toUpperCase() } : r))
                                          );
                                          setClientTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], client: !value ? 'Gst In is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={clientTableErrors[index]?.client ? 'error form-control' : 'form-control'}
                                        // //style={{ marginBottom: '10px' }}
                                      />
                                      {clientTableErrors[index]?.client && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].client}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.clientCode}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setClientTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, clientCode: value.toUpperCase() } : r))
                                          );
                                          setClientTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], clientCode: !value ? 'clientCode is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={clientTableErrors[index]?.clientCode ? 'error form-control' : 'form-control'}
                                      />
                                      {clientTableErrors[index]?.clientCode && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].clientCode}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.clientType}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setClientTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, clientType: value.toUpperCase() } : r))
                                          );
                                          setClientTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              clientType: !value ? 'State Code is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={clientTableErrors[index]?.clientType ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        <option value="FIXED">FIXED</option>
                                        <option value="OPEN">OPEN</option>
                                      </select>
                                      {clientTableErrors[index]?.clientType && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].clientType}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.fifoFife}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setClientTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, fifoFife: value.toUpperCase() } : r))
                                          );
                                          setClientTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              fifoFife: !value ? 'FEFO FIFE LILO is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, row)}
                                        className={clientTableErrors[index]?.fifoFife ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        <option value="FEFO">FEFO</option>
                                        <option value="FIFE">FIFE</option>
                                        <option value="LILO">LILO</option>
                                      </select>
                                      {clientTableErrors[index]?.fifoFife && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].fifoFife}
                                        </div>
                                      )}
                                    </td>
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

                {value === 2 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow1} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-6">
                          <div className="table-responsive">
                            <table className="table table-bordered table-responsive">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Branch Code
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Branch</th>
                                </tr>
                              </thead>
                              <tbody>
                                {branchTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow1(row.id)} />
                                    </td>
                                    <td className="text-center">
                                      {/* <input type="text" value={`${index + 1}`} readOnly style={{ width: '100%' }} /> */}
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.branchCode}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const selectedBranch = branchList.find((branch) => branch.branchCode === value);
                                          setBranchTableData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? { ...r, branchCode: value, branch: selectedBranch ? selectedBranch.branch : '' }
                                                : r
                                            )
                                          );

                                          setBranchTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              branchCode: !value ? 'Branch Code is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        onKeyDown={(e) => handleKeyDown1(e, row)}
                                        className={branchTableErrors[index]?.branchCode ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {branchList?.map((branch) => (
                                          <option key={branch.id} value={branch.branchCode}>
                                            {branch.branchCode}
                                          </option>
                                        ))}
                                      </select>
                                      {branchTableErrors[index]?.branchCode && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {branchTableErrors[index].branchCode}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2 text-center pt-3">{row.branch}</td>
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
export default FullFeaturedCrudGrid;
