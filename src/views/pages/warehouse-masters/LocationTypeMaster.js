import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { initCaps } from 'utils/CommonFunctions';

export const LocationTypeMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    active: true,
    binType: '',
    core: ''
  });
  const [editId, setEditId] = useState('');

  const theme = useTheme();
  const anchorRef = useRef(null);
  const inputRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({
    binType: '',
    core: ''
  });
  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    { accessorKey: 'binType', header: 'Bin Type', size: 140 },
    { accessorKey: 'core', header: 'Core', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    console.log('LISTVIEW FIELD CURRENT VALUE IS', listView);
    getAllLocationTypes();
  }, []);

  const getAllLocationTypes = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/locationType?orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.locationTypeVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getLocationTypeById = async (row) => {
    console.log('THE SELECTED COUNTRY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/locationType/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularLocationType = response.paramObjectsMap.locationTypeVO;

        setFormData({
          binType: particularLocationType.binType,
          core: particularLocationType.core.toUpperCase(),
          active: particularLocationType.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, selectionStart, selectionEnd } = e.target;

  //   const nameRegex = /^[A-Za-z0-9  ]*$/;
  //   let errorMessage = '';

  //   switch (name) {
  //     case 'binType':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only Alphanumeric characters are allowed';
  //       }
  //       break;

  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   } else {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  //     const upperCaseValue = value.toUpperCase();
  //     setFormData((prevData) => ({ ...prevData, [name]: upperCaseValue }));
  //     setTimeout(() => {
  //       if (inputRef.current) {
  //         inputRef.current.setSelectionRange(selectionStart, selectionEnd);
  //       }
  //     }, 0);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value, selectionStart, selectionEnd } = e.target;

  //   const nameRegex = /^[A-Za-z0-9 ]*$/;
  //   let errorMessage = '';

  //   switch (name) {
  //     case 'binType':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only Alphanumeric characters are allowed';
  //       }
  //       break;

  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   } else {
  //     if (name === 'core') {
  //       setFormData({ ...formData, [name]: initCaps(value) });
  //     }
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  //     const upperCaseValue = value.toUpperCase();
  //     setFormData((prevData) => ({ ...prevData, [name]: upperCaseValue }));
  //     setTimeout(() => {
  //       const inputElement = document.getElementsByName(name)[0];
  //       if (inputElement) {
  //         inputElement.setSelectionRange(selectionStart, selectionEnd);
  //       }
  //     }, 0);
  //   }
  // };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    if (name === 'cityCode' && !codeRegex.test(value)) {
      setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'active' ? checked : value.toUpperCase()
      });
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    // Update the cursor position after the input change
    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
    // }
  };

  const handleClear = () => {
    setEditId('');
    setFormData({
      binType: '',
      core: '',
      active: true
    });
    setFieldErrors({
      binType: '',
      core: ''
    });
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.binType) errors.binType = 'Bin Type is required';
    if (!formData.core) errors.core = 'Core is required';

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        binType: formData.binType,
        core: initCaps(formData.core),
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateLocationType`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response.data);

          showToast('success', editId ? ' Bin Type Updated Successfully' : 'Bin Type created successfully');

          handleClear();
          getAllLocationTypes();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Bin Type creation failed');
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
    setEditMode(false);
    setFormData({
      binType: ''
    });
  };

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked
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
            <ActionButton
              title="Save"
              icon={SaveIcon}
              isLoading={isLoading}
              onClick={() => handleSave()}
              margin="0 10px 0 10px"
            /> &nbsp;{' '}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getLocationTypeById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Bin Type"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="binType"
                  value={formData.binType}
                  onChange={handleInputChange}
                  error={!!fieldErrors.binType}
                  helperText={fieldErrors.binType}
                  inputRef={inputRef}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.core}>
                  <InputLabel id="movingType-label">Core</InputLabel>
                  <Select labelId="core-label" id="core" name="core" label="Core" value={formData.core} onChange={handleInputChange}>
                    <MenuItem value="SINGLE">SINGLE </MenuItem>
                    <MenuItem value="MULTI">MULTI </MenuItem>
                  </Select>
                  {fieldErrors.core && <FormHelperText error>{fieldErrors.core}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
                  label="Active"
                  labelPlacement="end"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        <ToastComponent />
      </div>
    </>
  );
};
export default LocationTypeMaster;
