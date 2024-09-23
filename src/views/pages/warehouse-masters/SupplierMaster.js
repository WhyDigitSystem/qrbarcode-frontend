import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveCitiesByState, getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

export const SupplierMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [selectedBranchCode, setSelectedBranchCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [formData, setFormData] = useState({
    supplierName: '',
    shortName: '',
    supplierType: '',
    pan: '',
    tanNo: '',
    contactPerson: '',
    mobile: '',
    address: '',
    country: '',
    state: '',
    city: '',
    controlBranch: localStorage.getItem('branchcode'),
    pincode: '',
    email: '',
    // gst: '',
    eccNo: '',
    active: true
  });
  const [value, setValue] = useState(0);

  const [fieldErrors, setFieldErrors] = useState({
    supplierName: '',
    shortName: '',
    supplierType: '',
    pan: '',
    tanNo: '',
    contactPerson: '',
    mobile: '',
    address: '',
    country: '',
    state: '',
    city: '',
    controlBranch: '',
    pincode: '',
    email: '',
    // gst: '',
    eccNo: '',
    active: true
  });
  const listViewColumns = [
    { accessorKey: 'supplier', header: 'Supplier Name', size: 140 },
    { accessorKey: 'supplierShortName', header: 'Short Name', size: 140 },
    { accessorKey: 'supplierType', header: 'Supplier Type', size: 140 },
    { accessorKey: 'cbranch', header: 'Control Branch', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  const supplierNameRef = useRef(null);
  const shortNameRef = useRef(null);
  const panRef = useRef(null);
  const tanNoRef = useRef(null);
  const contactPersonRef = useRef(null);
  const mobileRef = useRef(null);
  const addressRef = useRef(null);
  const pincodeRef = useRef(null);
  const emailRef = useRef(null);
  const eccNoRef = useRef(null);

  useEffect(() => {
    getAllSuppliers();
  }, []);

  useEffect(() => {
    getAllCountries();
    if (formData.country) {
      getAllStates();
    }
    if (formData.state) {
      getAllCities();
    }
  }, [formData.country, formData.state]);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      if (Array.isArray(countryData)) {
        setCountryList(countryData);
      } else {
        console.error('Expected an array but got:', typeof countryData);
      }
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

  const getAllSuppliers = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/supplier?cbranch=${branchCode}&client=${client}&orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.supplierVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getSupplierById = async (row) => {
    console.log('THE SELECTED COUNTRY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/supplier/${row.original.id}`);

      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularSupplier = response.paramObjectsMap.Supplier;

        setFormData({
          supplierName: particularSupplier.supplier,
          shortName: particularSupplier.supplierShortName,
          supplierType: particularSupplier.supplierType,
          pan: particularSupplier.panNo,
          tanNo: particularSupplier.tanNo,
          contactPerson: particularSupplier.contactPerson,
          mobile: particularSupplier.mobileNo,
          address: particularSupplier.addressLine1,
          country: particularSupplier.country,
          state: particularSupplier.state,
          city: particularSupplier.city,
          controlBranch: particularSupplier.cbranch,
          pincode: particularSupplier.zipCode,
          email: particularSupplier.email,
          // gst: particularSupplier.gst,
          eccNo: particularSupplier.eccNo,
          active: particularSupplier.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    let errorMessage = '';

    const numericRegex = /^[0-9]*$/;
    const alphanumericRegex = /^[A-Za-z0-9 ]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    switch (name) {
      case 'supplierName':
      case 'shortName':
      case 'contactPerson':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only Alphabet are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only Numbers are allowed';
        } else if (value.length > 10) {
          errorMessage = 'max Length is 10';
        }
        break;
      case 'pan':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 10) {
          errorMessage = 'max Length is 10';
        }
        break;
      case 'tanNo':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 10) {
          errorMessage = 'max Length is 10';
        }
        break;
      case 'pincode':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 6) {
          errorMessage = 'max Length is 6';
        }
        break;
      case 'eccNo':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 15) {
          errorMessage = 'max Length is 15';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFieldErrors({ ...fieldErrors, [name]: '' });

      const upperCaseValue = value.toUpperCase();
      const updatedValue = name === 'email' ? value.toLowerCase() : upperCaseValue;

      setFormData({ ...formData, [name]: updatedValue });

      const refs = {
        supplierName: supplierNameRef,
        shortName: shortNameRef,
        pan: panRef,
        tanNo: tanNoRef,
        contactPerson: contactPersonRef,
        mobile: mobileRef,
        address: addressRef,
        pinCode: pincodeRef,
        email: emailRef,
        eccNo: eccNoRef
      };

      setTimeout(() => {
        const ref = refs[name];
        if (ref && ref.current) {
          ref.current.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 10);
    }
  };

  const handleClear = () => {
    setFormData({
      supplierName: '',
      shortName: '',
      supplierType: '',
      pan: '',
      tanNo: '',
      contactPerson: '',
      mobile: '',
      address: '',
      country: '',
      state: '',
      city: '',
      controlBranch: localStorage.getItem('branchcode'),
      pincode: '',
      email: '',
      eccNo: '',
      active: true
    });

    setFieldErrors({
      supplierName: '',
      shortName: '',
      supplierType: '',
      pan: '',
      tanNo: '',
      contactPerson: '',
      mobile: '',
      address: '',
      country: '',
      state: '',
      city: '',
      controlBranch: '',
      pincode: '',
      email: '',
      // gst: '',
      eccNo: '',
      active: true
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.shortName) {
      errors.shortName = 'Short Name is required';
    }
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier Type is required';
    }
    if (!formData.pan) {
      errors.pan = 'Pan is required';
    }
    if (!formData.tanNo) {
      errors.tanNo = 'Tan is required';
    }
    if (!formData.contactPerson) {
      errors.contactPerson = 'Contact Person is required';
    }
    if (!formData.mobile) {
      errors.mobile = 'Mobile is required';
    } else if (formData.mobile.length < 10) {
      errors.mobile = 'Invalid Mobile Format';
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
    if (formData.pincode.length > 0 && formData.pincode.length < 6) {
      errors.pincode = 'Invalid Pincode Format';
    }
    if (formData.pan.length > 0 && formData.pan.length < 10) {
      errors.pan = 'Invalid PAN Format';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid MailID Format';
    }
    if (!formData.controlBranch) {
      errors.controlBranch = 'Control Branch is required';
    }
    if (!formData.eccNo) {
      errors.eccNo = 'Ecc No is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        supplier: formData.supplierName,
        supplierShortName: formData.shortName,
        supplierType: formData.supplierType,
        panNo: formData.pan,
        tanNo: formData.tanNo,
        contactPerson: formData.contactPerson,
        mobileNo: formData.mobile,
        addressLine1: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        cbranch: formData.controlBranch,
        zipCode: formData.pincode,
        email: formData.email,
        // gst: formData.gst,
        eccNo: formData.eccNo,
        orgId: orgId,
        createdBy: loginUserName,
        branchCode: branchCode,
        branch: branch,
        client: client,
        customer: customer,
        warehouse: warehouse
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateSupplier`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response.data);
          handleClear();
          getAllSuppliers();
          showToast('success', editId ? ' Supplier Updated Successfully' : 'Supplier created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Supplier creation failed');
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
      supplierName: '',
      shortName: '',
      supplierType: '',
      pan: '',
      tanNo: '',
      contactPerson: '',
      mobile: '',
      address: '',
      country: '',
      state: '',
      city: '',
      controlBranch: '',
      pincode: '',
      email: '',
      // gst: '',
      eccNo: '',
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
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getSupplierById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Supplier Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.supplierName}
                  helperText={fieldErrors.supplierName}
                  inputRef={supplierNameRef}
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
                  inputRef={shortNameRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.supplierType}>
                  <InputLabel id="supplierType-label">Supplier Type</InputLabel>
                  <Select
                    labelId="supplierType-label"
                    id="supplierType"
                    name="supplierType"
                    label="Supplier Type"
                    value={formData.supplierType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="VENDOR">VENDOR</MenuItem>
                    <MenuItem value="SUB CONTRACTOR">SUB CONTRACTOR</MenuItem>
                  </Select>
                  {fieldErrors.supplierType && <FormHelperText error>{fieldErrors.supplierType}</FormHelperText>}
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
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
              </div> */}
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.category}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="CATEGORY 1">CATEGORY 1</MenuItem>
                    <MenuItem value="CATEGORY 2">CATEGORY 2</MenuItem>
                  </Select>
                  {fieldErrors.category && <FormHelperText error>{fieldErrors.category}</FormHelperText>}
                </FormControl>
              </div> */}
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
                  inputRef={panRef}
                />
              </div>
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
                  inputRef={tanNoRef}
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
                  inputRef={contactPersonRef}
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
                  inputRef={mobileRef}
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
                  inputRef={addressRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
                    {Array.isArray(countryList) &&
                      countryList.map((row) => (
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
                <TextField
                  label="Pincode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.pincode}
                  helperText={fieldErrors.pincode}
                  inputRef={pincodeRef}
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
                  inputRef={emailRef}
                />
              </div>
              {/* <div className="col-md-3 mb-3">
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
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.controlBranch}>
                  <InputLabel id="controlBranch-label">Control Branch</InputLabel>
                  <Select
                    labelId="controlBranch-label"
                    id="controlBranch"
                    name="controlBranch"
                    label="Control Branch"
                    value={formData.controlBranch}
                    onChange={handleInputChange}
                  >
                    {loginBranchCode && <MenuItem value={loginBranchCode}>{loginBranchCode}</MenuItem>}
                    <MenuItem value="ALL">ALL</MenuItem>
                  </Select>
                  {fieldErrors.controlBranch && <FormHelperText error>{fieldErrors.controlBranch}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="ECC No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="eccNo"
                  value={formData.eccNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.eccNo}
                  helperText={fieldErrors.eccNo}
                  inputRef={eccNoRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      onChange={() => setFormData({ ...formData, active: !formData.active })}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </div>
            </div>
            {/* <p className="mt-2 fw-bold">Range Details</p> */}
            {/* <div className="row mt-2">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Range"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="range"
                  value={formData.range}
                  onChange={handleInputChange}
                  error={!!fieldErrors.range}
                  helperText={fieldErrors.range}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Range Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="rangeAddress"
                  value={formData.rangeAddress}
                  onChange={handleInputChange}
                  error={!!fieldErrors.rangeAddress}
                  helperText={fieldErrors.rangeAddress}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Pincode 1"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="pincode1"
                  value={formData.pincode1}
                  onChange={handleInputChange}
                  error={!!fieldErrors.pincode1}
                  helperText={fieldErrors.pincode1}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Division"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  error={!!fieldErrors.division}
                  helperText={fieldErrors.division}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Commissionerate"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="commissionerate"
                  value={formData.commissionerate}
                  onChange={handleInputChange}
                  error={!!fieldErrors.commissionerate}
                  helperText={fieldErrors.commissionerate}
                />
              </div>
            </div> */}
          </>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default SupplierMaster;
