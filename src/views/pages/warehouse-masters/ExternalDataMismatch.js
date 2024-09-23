import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, TextField, Checkbox, FormControlLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { getAllActiveCountries, getAllActiveStatesByCountry } from 'utils/CommonFunctions';

export const ExternalDataMismatch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [formData, setFormData] = useState({
    screen: '',
    entryNo: '',
    uploadedPartNo: '',
    masterPartNo: '',
    uploadedPartDesc: '',
    masterPartDesc: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    screen: '',
    entryNo: '',
    uploadedPartNo: '',
    masterPartNo: '',
    uploadedPartDesc: '',
    masterPartDesc: ''
  });

  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);

  // useEffect(() => {
  //   getAllCities();
  //   getAllCountries();
  //   if (formData.country) {
  //     getAllStates();
  //   }
  // }, [formData.country]);

  // const getAllCountries = async () => {
  //   try {
  //     const countryData = await getAllActiveCountries(orgId);
  //     setCountryList(countryData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllStates = async () => {
  //   try {
  //     const stateData = await getAllActiveStatesByCountry(formData.country, orgId);
  //     setStateList(stateData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value, checked } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;

  //   // if (name === 'cityCode' && !codeRegex.test(value)) {
  //   //   setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   // } else if (name === 'cityCode' && value.length > 3) {
  //   //   setFieldErrors({ ...fieldErrors, [name]: 'Max Length is 3' });
  //   // } else if (name === 'cityName' && !nameRegex.test(value)) {
  //   //   setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   // } else {
  //   setFormData({ ...formData, [name]: value.toUpperCase() });
  //   setFieldErrors({ ...fieldErrors, [name]: '' });
  //   // }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;
    let errorMessage = '';

    // Update field errors and form data
    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Maintain cursor position after the value is updated
      setTimeout(() => {
        if (e.target.setSelectionRange) {
          e.target.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  const handleClear = () => {
    setFormData({
      screen: '',
      entryNo: '',
      uploadedPartNo: '',
      masterPartNo: '',
      uploadedPartDesc: '',
      masterPartDesc: ''
    });
    setFieldErrors({
      screen: '',
      entryNo: '',
      uploadedPartNo: '',
      masterPartNo: '',
      uploadedPartDesc: '',
      masterPartDesc: ''
    });
  };

  const getAllSavedData = async () => {
    try {
      const response = await apiCalls('get', `commonmaster/city?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.cityVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getParticularDataById = async (row) => {
    console.log('THE SELECTED CITY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `commonmaster/city/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCity = response.paramObjectsMap.cityVO;

        setFormData({
          cityCode: particularCity.cityCode,
          cityName: particularCity.cityName,
          country: particularCity.country,
          state: particularCity.state,
          active: particularCity.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.screen) {
      errors.screen = 'Screen is required';
    }
    if (!formData.entryNo) {
      errors.entryNo = 'Entry No is required';
    }
    if (!formData.uploadedPartNo) {
      errors.uploadedPartNo = 'Uploaded Part No is required';
    }
    if (!formData.masterPartNo) {
      errors.masterPartNo = 'Master Part No is required';
    }
    if (!formData.uploadedPartDesc) {
      errors.uploadedPartDesc = 'Uploaded Part Desc is required';
    }
    if (!formData.masterPartDesc) {
      errors.masterPartDesc = 'Master Part Desc is required';
    }

    // Check for validation errors
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...(editId && { id: editId }),
        screen: formData.screen,
        entryNo: formData.entryNo,
        uploadedPartNo: formData.uploadedPartNo,
        masterPartNo: formData.masterPartNo,
        uploadedPartDesc: formData.uploadedPartDesc,
        masterPartDesc: formData.masterPartDesc,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('post', `commonmaster/createUpdatePart`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Part Updated Successfully' : 'Part created successfully');
          handleClear();
          getAllSavedData();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Part creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Part creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const listViewColumns = [
    { accessorKey: 'cityCode', header: 'Code', size: 140 },
    { accessorKey: 'cityName', header: 'City', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.screen}>
                  <InputLabel id="screen-label">Screen</InputLabel>
                  <Select labelId="screen-label" label="Screen" value={formData.screen} onChange={handleInputChange} name="screen">
                    {/* {screenList?.map((row) => (
                      <MenuItem key={row.id} value={row.screenName}>
                        {row.screenName}
                      </MenuItem>
                    ))} */}
                    <MenuItem value="SCREEN1">SCREEN1</MenuItem>
                    <MenuItem value="SCREEN2">SCREEN2</MenuItem>
                    <MenuItem value="SCREEN3">SCREEN3</MenuItem>
                  </Select>
                  {fieldErrors.screen && <FormHelperText>{fieldErrors.screen}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Entry No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="entryNo"
                  value={formData.entryNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.entryNo}
                  helperText={fieldErrors.entryNo}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.uploadedPartNo}>
                  <InputLabel id="uploadedPartNo-label">Uploaded Part No</InputLabel>
                  <Select
                    labelId="uploadedPartNo-label"
                    label="Uploaded Part No"
                    value={formData.uploadedPartNo}
                    onChange={handleInputChange}
                    name="uploadedPartNo"
                  >
                    {/* {uploadedPartNoList?.map((row) => (
                      <MenuItem key={row.id} value={row.uploadedPartNo}>
                        {row.uploadedPartNo}
                      </MenuItem>
                    ))} */}
                    <MenuItem value="UPLOAD PARTNO1">UPLOAD PARTNO1</MenuItem>
                    <MenuItem value="UPLOAD PARTNO2">UPLOAD PARTNO2</MenuItem>
                    <MenuItem value="UPLOAD PARTNO3">UPLOAD PARTNO3</MenuItem>
                  </Select>
                  {fieldErrors.uploadedPartNo && <FormHelperText>{fieldErrors.uploadedPartNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.masterPartNo}>
                  <InputLabel id="masterPartNo-label">Master Part No</InputLabel>
                  <Select
                    labelId="masterPartNo-label"
                    label="Master Part No"
                    value={formData.masterPartNo}
                    onChange={handleInputChange}
                    name="masterPartNo"
                  >
                    {/* {masterPartNoList?.map((row) => (
                      <MenuItem key={row.id} value={row.masterPartNo}>
                        {row.masterPartNo}
                      </MenuItem>
                    ))} */}
                    <MenuItem value="MASTER PARTNO1">MASTER PARTNO1</MenuItem>
                    <MenuItem value="MASTER PARTNO2">MASTER PARTNO2</MenuItem>
                    <MenuItem value="MASTER PARTNO3">MASTER PARTNO3</MenuItem>
                  </Select>
                  {fieldErrors.masterPartNo && <FormHelperText>{fieldErrors.masterPartNo}</FormHelperText>}
                </FormControl>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Uploaded Part Desc"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="uploadedPartDesc"
                  value={formData.uploadedPartDesc}
                  onChange={handleInputChange}
                  error={!!fieldErrors.uploadedPartDesc}
                  helperText={fieldErrors.uploadedPartDesc}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.masterPartDesc}>
                  <InputLabel id="masterPartDesc-label">Master Part Desc</InputLabel>
                  <Select
                    labelId="masterPartDesc-label"
                    label="Master Part Desc"
                    value={formData.masterPartDesc}
                    onChange={handleInputChange}
                    name="masterPartDesc"
                  >
                    <MenuItem value="MASTER PART DESC1">MASTER PART DESC1</MenuItem>
                    <MenuItem value="MASTER PART DESC2">MASTER PART DESC2</MenuItem>
                    <MenuItem value="UPLOAD PART DESC3">UPLOAD PART DESC3</MenuItem>
                  </Select>
                  {fieldErrors.masterPartDesc && <FormHelperText>{fieldErrors.masterPartDesc}</FormHelperText>}
                </FormControl>
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ExternalDataMismatch;
