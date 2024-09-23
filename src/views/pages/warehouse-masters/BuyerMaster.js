import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import 'react-datepicker/dist/react-datepicker.css';
import apiCalls from 'apicall';
import { getAllActiveCitiesByState, getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';

export const BuyerMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [editId, setEditId] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));

  const [formData, setFormData] = useState({
    buyerName: '',
    shortName: '',
    buyerType: '',
    pan: '',
    tanNo: '',
    contactPerson: '',
    mobile: '',
    addressLine1: '',
    country: '',
    state: '',
    city: '',
    controlBranch: branchCode,
    pincode: '',
    email: '',
    gst: 'YES',
    gstNo: '',
    eccNo: '',
    active: true
  });

  const [fieldErrors, setFieldErrors] = useState({
    buyerName: '',
    shortName: '',
    buyerType: '',
    pan: '',
    tanNo: '',
    contactPerson: '',
    mobile: '',
    addressLine1: '',
    country: '',
    state: '',
    city: '',
    controlBranch: '',
    pincode: '',
    email: '',
    gst: '',
    gstNo: '',
    eccNo: '',
    active: true
  });
  const listViewColumns = [
    { accessorKey: 'buyer', header: 'Buyer', size: 140 },
    { accessorKey: 'buyerShortName', header: 'Buyer Short Name', size: 140 },
    { accessorKey: 'buyerType', header: 'Buyer Type', size: 140 },
    { accessorKey: 'panNo', header: 'PAN', size: 140 },
    { accessorKey: 'tanNo', header: 'TAN', size: 140 },
    { accessorKey: 'contactPerson', header: 'contact Person', size: 140 },
    { accessorKey: 'mobileNo', header: 'Mobile', size: 140 },
    { accessorKey: 'addressLine1', header: 'Address', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'city', header: 'City', size: 140 },
    { accessorKey: 'zipCode', header: 'Pincode', size: 140 },
    { accessorKey: 'email', header: 'Email', size: 140 },
    { accessorKey: 'gst', header: 'GST', size: 140 },
    { accessorKey: 'gstNo', header: 'GST No', size: 140 },
    { accessorKey: 'cbranch', header: 'Control Branch', size: 140 },
    { accessorKey: 'eccNo', header: 'ECC No', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    console.log('LISTVIEW FIELD CURRENT VALUE IS', listView);
    getAllBuyer();
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

  const getAllBuyer = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/buyer?cbranch=${branchCode}&client=${client}&orgid=${orgId}`);
      setListViewData(response.paramObjectsMap.buyerVO);
      console.log('TEST LISTVIEW DATA', response.paramObjectsMap.buyerVO);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getBuyerById = async (row) => {
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/buyer/${row.original.id}`);

      if (response.status === true) {
        const result = response.paramObjectsMap.Buyer;
        console.log('response.paramObjectsMap.buyer', response.paramObjectsMap.Buyer);
        setListView(false);
        setFormData({
          buyerName: result.buyer,
          shortName: result.buyerShortName,
          buyerType: result.buyerType,
          pan: result.panNo,
          tanNo: result.tanNo,
          contactPerson: result.contactPerson,
          mobile: result.mobileNo,
          addressLine1: result.addressLine1,
          country: result.country,
          state: result.state,
          city: result.city,
          controlBranch: result.cbranch,
          pincode: result.zipCode,
          email: result.email,
          gst: result.gst,
          gstNo: result.gstNo,
          eccNo: result.eccNo,
          active: result.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const numericRegex = /^[0-9]*$/;
  //   const alphanumericRegex = /^[A-Za-z0-9]*$/;
  //   const specialCharsRegex = /^[A-Za-z0-9@_\-*]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;

  //   let errorMessage = '';

  //   if (name === 'active') {
  //     setFormData({ ...formData, [name]: checked });
  //     return;
  //   }

  //   switch (name) {
  //     case 'buyerName':
  //     case 'shortName':
  //     case 'contactPerson':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only Alphabet are allowed';
  //       }
  //       break;
  //     case 'mobile':
  //       if (!numericRegex.test(value)) {
  //         errorMessage = 'Only Numbers are allowed';
  //       } else if (value.length > 10) {
  //         errorMessage = 'max Length is 10';
  //       }
  //       break;
  //     case 'pan':
  //       if (!alphanumericRegex.test(value)) {
  //         errorMessage = 'Only AlphaNumeric are allowed';
  //       } else if (value.length > 10) {
  //         errorMessage = 'max Length is 10';
  //       }
  //       break;
  //     case 'pincode':
  //       if (!alphanumericRegex.test(value)) {
  //         errorMessage = 'Only AlphaNumeric are allowed';
  //       } else if (value.length > 6) {
  //         errorMessage = 'max Length is 6';
  //       }
  //       break;
  //     case 'gstNo':
  //       if (formData.gst === 'YES') {
  //         if (!alphanumericRegex.test(value)) {
  //           errorMessage = 'Only AlphaNumeric are allowed';
  //         } else if (value.length > 15) {
  //           errorMessage = 'Max Length is 15';
  //         }
  //       }
  //       break;
  //     case 'eccNo':
  //       if (!alphanumericRegex.test(value)) {
  //         errorMessage = 'Only AlphaNumeric are allowed';
  //       } else if (value.length > 15) {
  //         errorMessage = 'max Length is 15';
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     if (name === 'gst' && value === 'NO') {
  //       setFormData({ ...formData, [name]: value, gstNo: '' });
  //     } else {
  //       // setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '', gst: '' }));
  //       const updatedValue = name === 'email' ? value.toLowerCase() : value.toUpperCase();
  //       setFormData({ ...formData, [name]: updatedValue });
  //       setFieldErrors({ ...fieldErrors, [name]: '' });
  //     }
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type, checked } = e.target;
    const numericRegex = /^[0-9]*$/;
    const alphanumericRegex = /^[A-Za-z0-9]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    let errorMessage = '';

    if (name === 'active') {
      setFormData({ ...formData, [name]: checked });
      return;
    }

    switch (name) {
      case 'buyerName':
      case 'shortName':
      case 'contactPerson':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only Alphabet are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only Numbers are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Max Length is 10';
        }
        break;
      case 'pan':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Max Length is 10';
        }
        break;
      case 'pincode':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 6) {
          errorMessage = 'Max Length is 6';
        }
        break;
      case 'gstNo':
        if (formData.gst === 'YES') {
          if (!alphanumericRegex.test(value)) {
            errorMessage = 'Only AlphaNumeric are allowed';
          } else if (value.length > 15) {
            errorMessage = 'Max Length is 15';
          }
        }
        break;
      case 'eccNo':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only AlphaNumeric are allowed';
        } else if (value.length > 15) {
          errorMessage = 'Max Length is 15';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'gst' && value === 'NO') {
        setFormData({ ...formData, [name]: value, gstNo: '' });
      } else {
        const updatedValue = name === 'email' ? value.toLowerCase() : value.toUpperCase();
        setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
        setFieldErrors({ ...fieldErrors, [name]: '' });

        setTimeout(() => {
          if (e.target.setSelectionRange) {
            e.target.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleClear = () => {
    setEditId('');
    setFormData({
      buyerName: '',
      shortName: '',
      buyerType: '',
      pan: '',
      tanNo: '',
      contactPerson: '',
      mobile: '',
      addressLine1: '',
      country: '',
      state: '',
      city: '',
      controlBranch: branchCode,
      pincode: '',
      email: '',
      gst: 'YES',
      gstNo: '',
      eccNo: '',
      active: true
    });

    setFieldErrors({
      buyerName: '',
      shortName: '',
      buyerType: '',
      pan: '',
      tanNo: '',
      contactPerson: '',
      mobile: '',
      addressLine1: '',
      country: '',
      state: '',
      city: '',
      controlBranch: '',
      pincode: '',
      email: '',
      gst: '',
      gstNo: '',
      eccNo: '',
      active: true
    });
  };

  const handleSave = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.buyerName) {
      errors.buyerName = 'Buyer Name is required';
    }
    if (!formData.shortName) {
      errors.shortName = 'Short Name is required';
    }
    // if (formData.gst === 'YES' && formData.gstNo.length < 15) {
    //   errors.gstNo = 'Invalid GST Format';
    // }
    if (formData.pan.length < 10) {
      errors.pan = 'Invalid PAN Format';
    }
    if (formData.mobile.length < 10) {
      errors.mobile = 'Invalid Mobile Format';
    }
    if (!formData.email) {
      errors.email = 'Email ID is Required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid MailID Format';
    }
    if (formData.pincode.length > 0 && formData.pincode.length < 6) {
      errors.pincode = 'Invalid Pincode';
    }
    if (formData.gst === 'YES' && !formData.gstNo) {
      errors.gstNo = 'GST No is Required';
    } else if (formData.gst === 'YES' && formData.gstNo.length < 15) {
      errors.gstNo = 'Invalid GST Format';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        buyer: formData.buyerName,
        buyerShortName: formData.shortName,
        buyerType: formData.buyerType,
        panNo: formData.pan,
        tanNo: formData.tanNo,
        contactPerson: formData.contactPerson,
        mobileNo: formData.mobile,
        addressLine1: formData.addressLine1,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        cbranch: formData.controlBranch,
        zipCode: formData.pincode,
        email: formData.email,
        gst: formData.gst,
        gstNo: formData.gstNo,
        eccNo: formData.eccNo,
        branch: branch,
        branchCode: branchCode,
        client: client,
        createdBy: loginUserName,
        customer: customer,
        orgId: orgId,
        warehouse: warehouse
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `warehousemastercontroller/buyer`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Buyer Updated Successfully' : 'Buyer created successfully');
          setIsLoading(false);
          getAllBuyer();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Buyer creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Buyer creation failed');
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
      buyerName: '',
      shortName: '',
      buyerType: '',
      pan: '',
      tanNo: '',
      contactPerson: '',
      mobile: '',
      addressLine1: '',
      country: '',
      state: '',
      city: '',
      controlBranch: '',
      pincode: '',
      email: '',
      gst: '',
      gstNo: '',
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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getBuyerById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Buyer Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.buyerName}
                  helperText={fieldErrors.buyerName}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.buyerType}>
                  <InputLabel id="buyerType-label">Buyer Type</InputLabel>
                  <Select
                    labelId="buyerType-label"
                    id="buyerType"
                    name="buyerType"
                    label="Buyer Type"
                    value={formData.buyerType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="LOCAL">LOCAL</MenuItem>
                    <MenuItem value="EXPORT">EXPORT</MenuItem>
                    <MenuItem value="STOCK TRANSFER">STOCK TRANSFER</MenuItem>
                  </Select>
                  {fieldErrors.buyerType && <FormHelperText error>{fieldErrors.buyerType}</FormHelperText>}
                </FormControl>
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
                  label="Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  error={!!fieldErrors.addressLine1}
                  helperText={fieldErrors.addressLine1}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.gst}>
                  <InputLabel id="gst">GST Registration</InputLabel>
                  <Select labelId="gst" id="gst" name="gst" label="GST Registration" value={formData.gst} onChange={handleInputChange}>
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.gst && <FormHelperText error>{fieldErrors.gst}</FormHelperText>}
                </FormControl>
              </div>
              {formData.gst === 'YES' && (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="GST"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="gstNo"
                    value={formData.gstNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.gstNo}
                    helperText={fieldErrors.gstNo}
                  />
                </div>
              )}
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
                    <MenuItem value={branchCode}>{branchCode}</MenuItem>
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
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox name="active" checked={formData.active} onChange={handleInputChange} color="primary" />}
                  label="Active"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default BuyerMaster;
