import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

export const UnitMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    active: true,
    uom: '',
    unitType: '',
    unitName: ''
  });
  const [editId, setEditId] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    unitName: '',
    uom: '',
    unitType: ''
  });
  const [listView, setListView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const listViewColumns = [
    { accessorKey: 'uom', header: 'Code', size: 140 },
    {
      accessorKey: 'unitName',
      header: 'unit',
      size: 140
    },
    {
      accessorKey: 'unitType',
      header: 'Type',
      size: 140
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllUnits();
  }, []);

  const getAllUnits = async () => {
    try {
      const result = await apiCalls('get', `warehousemastercontroller/getAllUnitByOrgId?orgid=${orgId}`);
      setListViewData(result.paramObjectsMap.unitVO);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getUnitById = async (row) => {
    console.log('THE SELECTED unit ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/unit/${row.original.id}`);

      if (response.status === true) {
        const particularUnit = response.paramObjectsMap.unitVO;
        setFormData({
          uom: particularUnit.uom,
          unitName: particularUnit.unitName,
          active: particularUnit.active === 'Active' ? true : false,
          unitType: particularUnit.unitType
        });
        setListView(false);
      } else {
        console.error('API Error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const nameRegex = /^[A-Za-z ]*$/;

  //   if (name === 'uom' && !nameRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else if (name === 'unitName' && !nameRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else if (name === 'type' && !nameRegex.test(value)) {
  //     setFieldErrors({ ...fieldErrors, [name]: 'Invalid Format' });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, type, selectionStart, selectionEnd } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
    const nameRegex = /^[A-Za-z ]*$/;

    let errorMessage = '';

    switch (name) {
      case 'uom':
      case 'unitName':
      case 'type':
        if (!nameRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      // Update form data
      setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Preserve cursor position for text inputs
      if (type !== 'checkbox' && e.target.setSelectionRange) {
        setTimeout(() => {
          e.target.setSelectionRange(selectionStart, selectionEnd);
        }, 0);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      unitName: '',
      uom: '',
      unitType: '',
      active: true
    });
    setFieldErrors({
      unitName: '',
      uom: '',
      unitType: ''
    });
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.uom) {
      errors.uom = 'UOM is required';
    }
    if (!formData.unitName) {
      errors.unitName = 'unit is required';
    }
    if (!formData.unitType) {
      errors.unitType = 'Type is required';
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        uom: formData.uom,
        unitName: formData.unitName,
        unitType: formData.unitType,
        orgId: orgId,
        createdby: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const result = await apiCalls('put', `warehousemastercontroller/createUpdateUnit`, saveFormData);

        if (result.status === true) {
          console.log('Response:', result);
          showToast('success', editId ? ' Unit Updated Successfully' : 'Unit created successfully');
          handleClear();
          getAllUnits();
          setIsLoading(false);
        } else {
          showToast('error', result.paramObjectsMap.errorMessage || 'Unit creation failed');
          setIsLoading(false);
        }
      } catch (err) {
        console.log('error', err);
        showToast('error', 'Unit creation failed');
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
      unit: '',
      uom: '',
      type: ''
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
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" /> &nbsp;{' '}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true} // DISAPLE THE MODAL IF TRUE
              toEdit={getUnitById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="UOM"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="uom"
                  value={formData.uom}
                  onChange={handleInputChange}
                  error={!!fieldErrors.uom}
                  helperText={fieldErrors.uom}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="unitName"
                  value={formData.unitName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.unitName}
                  helperText={fieldErrors.unitName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Type"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  error={!!fieldErrors.unitType}
                  helperText={fieldErrors.unitType}
                />
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
export default UnitMaster;
