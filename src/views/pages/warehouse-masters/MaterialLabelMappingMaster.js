import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useState, useEffect } from 'react';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { ToastContainer, toast } from 'react-toastify';

import {
  getAllActiveParts,
  getAllActiveStyles,
  getAllActiveCottons,
  getAllActiveShowers,
  getAllActiveTapes,
  getAllActiveOuters,
  getAllActiveAccessories,
  getAllActiveCategories,
  getAllActiveStatuses,
  getAllActiveRepacks
} from 'utils/CommonFunctions';
import ActionButton from 'utils/ActionButton';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

const MaterialLabelMappingMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const listViewColumns = [
    { accessorKey: 'cityCode', header: 'Code', size: 140 },
    { accessorKey: 'cityName', header: 'City', size: 140 },
    { accessorKey: 'state', header: 'State', size: 140 },
    { accessorKey: 'country', header: 'Country', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  // const [partList, setPartList] = useState([]);
  // const [styleList, setStyleList] = useState([]);
  // const [cottonList, setCottonList] = useState([]);
  // const [showerList, setShowerList] = useState([]);
  // const [tapeList, setTapeList] = useState([]);
  // const [outerList, setOuterList] = useState([]);
  // const [accessoryList, setAccessoryList] = useState([]);
  // const [categoryList, setCategoryList] = useState([]);
  // const [statusList, setStatusList] = useState([]);
  // const [repackList, setRepackList] = useState([]);

  const [formData, setFormData] = useState({
    partNo: '',
    partDesc: '',
    styleCode: '',
    partParentQty: '',
    vasRate: '',
    coPickRate: '',
    inner: '',
    innerQty: '',
    cotton: '',
    cottonQty: '',
    shower: '',
    showerQty: '',
    tape: '',
    tapeQty: '',
    outer: '',
    outerQty: '',
    accessories: '',
    accessoriesQty: '',
    totalSticker: '',
    totalAmt: '',
    childPartNo: '',
    childPartDesc: '',
    childQty: '',
    status: '',
    repack: '',
    category: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    partNo: '',
    partDesc: '',
    styleCode: '',
    partParentQty: '',
    vasRate: '',
    coPickRate: '',
    inner: '',
    innerQty: '',
    cotton: '',
    cottonQty: '',
    shower: '',
    showerQty: '',
    tape: '',
    tapeQty: '',
    outer: '',
    outerQty: '',
    accessories: '',
    accessoriesQty: '',
    totalSticker: '',
    totalAmt: '',
    childPartNo: '',
    childPartDesc: '',
    childQty: '',
    status: '',
    repack: '',
    category: ''
  });

  useEffect(() => {
    // fetchDropdownData();
  }, []);

  // const fetchDropdownData = async () => {
  //   try {
  //     const [parts, styles, cottons, showers, tapes, outers, accessories, categories, statuses, repacks] = await Promise.all([
  //       getAllActiveParts(),
  //       getAllActiveStyles(),
  //       getAllActiveCottons(),
  //       getAllActiveShowers(),
  //       getAllActiveTapes(),
  //       getAllActiveOuters(),
  //       getAllActiveAccessories(),
  //       getAllActiveCategories(),
  //       getAllActiveStatuses(),
  //       getAllActiveRepacks()
  //     ]);

  //     setPartList(parts);
  //     setStyleList(styles);
  //     setCottonList(cottons);
  //     setShowerList(showers);
  //     setTapeList(tapes);
  //     setOuterList(outers);
  //     setAccessoryList(accessories);
  //     setCategoryList(categories);
  //     setStatusList(statuses);
  //     setRepackList(repacks);
  //   } catch (error) {
  //     console.error('Error fetching dropdown data:', error);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericRegex = /^[0-9]*$/;
    const alphanumericRegex = /^[A-Za-z0-9]*$/;
    const specialCharsRegex = /^[A-Za-z0-9@_\-*]*$/;
    const nameRegex = /^[A-Za-z ]*$/;
    let errorMessage = '';

    switch (name) {
      case 'partParentQty':
      case 'vasRate':
      case 'coPickRate':
      case 'innerQty':
      case 'cottonQty':
      case 'showerQty':
      case 'tapeQty':
      case 'outerQty':
      case 'accessoriesQty':
      case 'totalSticker':
      case 'totalAmt':
      case 'childQty':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only Numbers are allowed';
        } else if (value.length > 5) {
          errorMessage = 'max Length is 10';
        }
        break;
      case 'partDesc':
      case 'childPartDesc':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only Numbers are allowed';
        }
        break;
      default:
        break;
    }
    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      const updatedValue = name === 'email' ? value : value.toUpperCase();
      setFormData({ ...formData, [name]: updatedValue });
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleClear = () => {
    setFormData({
      partNo: '',
      partDesc: '',
      styleCode: '',
      partParentQty: '',
      vasRate: '',
      coPickRate: '',
      inner: '',
      innerQty: '',
      cotton: '',
      cottonQty: '',
      shower: '',
      showerQty: '',
      tape: '',
      tapeQty: '',
      outer: '',
      outerQty: '',
      accessories: '',
      accessoriesQty: '',
      totalSticker: '',
      totalAmt: '',
      childPartNo: '',
      childPartDesc: '',
      childQty: '',
      status: '',
      repack: '',
      category: ''
    });
    setFieldErrors({
      partNo: '',
      partDesc: '',
      styleCode: '',
      partParentQty: '',
      vasRate: '',
      coPickRate: '',
      inner: '',
      innerQty: '',
      cotton: '',
      cottonQty: '',
      shower: '',
      showerQty: '',
      tape: '',
      tapeQty: '',
      outer: '',
      outerQty: '',
      accessories: '',
      accessoriesQty: '',
      totalSticker: '',
      totalAmt: '',
      childPartNo: '',
      childPartDesc: '',
      childQty: '',
      status: '',
      repack: '',
      category: ''
    });
  };

  const handleSave = async () => {
    const errors = {};
    // Validate fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) errors[field] = 'Required';
    });

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const saveData = {
        ...(editId && { id: editId }),
        ...formData
      };

      try {
        const response = await apiCalls('post', 'commonmaster/createUpdateMaterialLabel', saveData);
        if (response.status === true) {
          showToast('success', editId ? 'Material Label Updated Successfully' : 'Material Label Created Successfully');
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Material Label creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Material Label creation failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const handleView = () => {
    setListView(!listView);
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
        {/* {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.partNo}>
                  <InputLabel id="partNo-label">Part No</InputLabel>
                  <Select labelId="partNo-label" label="Part No" value={formData.partNo} onChange={handleInputChange} name="partNo">
                    <MenuItem value="PART1">PART1</MenuItem>
                    <MenuItem value="PART2">PART2</MenuItem>
                    <MenuItem value="PART3">PART3</MenuItem>
                  </Select>
                  {fieldErrors.partNo && <FormHelperText>{fieldErrors.partNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Part Description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="partDesc"
                  value={formData.partDesc}
                  onChange={handleInputChange}
                  error={!!fieldErrors.partDesc}
                  helperText={fieldErrors.partDesc}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.styleCode}>
                  <InputLabel id="styleCode-label">Style Code</InputLabel>
                  <Select
                    labelId="styleCode-label"
                    label="Style Code"
                    value={formData.styleCode}
                    onChange={handleInputChange}
                    name="styleCode"
                  >
                    <MenuItem value="STYLE1">STYLE1</MenuItem>
                    <MenuItem value="STYLE2">STYLE2</MenuItem>
                    <MenuItem value="STYLE3">STYLE3</MenuItem>
                  </Select>
                  {fieldErrors.styleCode && <FormHelperText>{fieldErrors.styleCode}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Part Parent Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="partParentQty"
                  value={formData.partParentQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.partParentQty}
                  helperText={fieldErrors.partParentQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="VAS Rate"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="vasRate"
                  value={formData.vasRate}
                  onChange={handleInputChange}
                  error={!!fieldErrors.vasRate}
                  helperText={fieldErrors.vasRate}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Co-Pick Rate"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="coPickRate"
                  value={formData.coPickRate}
                  onChange={handleInputChange}
                  error={!!fieldErrors.coPickRate}
                  helperText={fieldErrors.coPickRate}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.inner}>
                  <InputLabel id="inner-label">Inner</InputLabel>
                  <Select labelId="inner-label" label="Inner" value={formData.inner} onChange={handleInputChange} name="inner">
                    <MenuItem value="INNER1">INNER1</MenuItem>
                    <MenuItem value="INNER2">INNER2</MenuItem>
                    <MenuItem value="INNER3">INNER3</MenuItem>
                  </Select>
                  {fieldErrors.inner && <FormHelperText>{fieldErrors.inner}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Inner Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="innerQty"
                  value={formData.innerQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.innerQty}
                  helperText={fieldErrors.innerQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.cotton}>
                  <InputLabel id="cotton-label">Cotton</InputLabel>
                  <Select labelId="cotton-label" label="Cotton" value={formData.cotton} onChange={handleInputChange} name="cotton">
                    <MenuItem value="COTTON1">COTTON1</MenuItem>
                    <MenuItem value="COTTON2">COTTON2</MenuItem>
                    <MenuItem value="COTTON3">COTTON3</MenuItem>
                  </Select>
                  {fieldErrors.cotton && <FormHelperText>{fieldErrors.cotton}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Cotton Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="cottonQty"
                  value={formData.cottonQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.cottonQty}
                  helperText={fieldErrors.cottonQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.shower}>
                  <InputLabel id="shower-label">Shower</InputLabel>
                  <Select labelId="shower-label" label="Shower" value={formData.shower} onChange={handleInputChange} name="shower">
                    <MenuItem value="SHOWER1">SHOWER1</MenuItem>
                    <MenuItem value="SHOWER2">SHOWER2</MenuItem>
                    <MenuItem value="SHOWER3">SHOWER3</MenuItem>
                  </Select>
                  {fieldErrors.shower && <FormHelperText>{fieldErrors.shower}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Shower Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="showerQty"
                  value={formData.showerQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.showerQty}
                  helperText={fieldErrors.showerQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.tape}>
                  <InputLabel id="tape-label">Tape</InputLabel>
                  <Select labelId="tape-label" label="Tape" value={formData.tape} onChange={handleInputChange} name="tape">
                    <MenuItem value="TAPE1">TAPE1</MenuItem>
                    <MenuItem value="TAPE2">TAPE2</MenuItem>
                    <MenuItem value="TAPE3">TAPE3</MenuItem>
                  </Select>
                  {fieldErrors.tape && <FormHelperText>{fieldErrors.tape}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Tape Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="tapeQty"
                  value={formData.tapeQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.tapeQty}
                  helperText={fieldErrors.tapeQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.outer}>
                  <InputLabel id="outer-label">Outer</InputLabel>
                  <Select labelId="outer-label" label="Outer" value={formData.outer} onChange={handleInputChange} name="outer">
                    <MenuItem value="OUTER1">OUTER1</MenuItem>
                    <MenuItem value="OUTER2">OUTER2</MenuItem>
                    <MenuItem value="OUTER3">OUTER3</MenuItem>
                  </Select>
                  {fieldErrors.outer && <FormHelperText>{fieldErrors.outer}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Outer Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="outerQty"
                  value={formData.outerQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.outerQty}
                  helperText={fieldErrors.outerQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.accessories}>
                  <InputLabel id="accessories-label">Accessories</InputLabel>
                  <Select
                    labelId="accessories-label"
                    label="Accessories"
                    value={formData.accessories}
                    onChange={handleInputChange}
                    name="accessories"
                  >
                    <MenuItem value="ACCESSORY1">ACCESSORY1</MenuItem>
                    <MenuItem value="ACCESSORY2">ACCESSORY2</MenuItem>
                    <MenuItem value="ACCESSORY3">ACCESSORY3</MenuItem>
                  </Select>
                  {fieldErrors.accessories && <FormHelperText>{fieldErrors.accessories}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Accessories Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="accessoriesQty"
                  value={formData.accessoriesQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.accessoriesQty}
                  helperText={fieldErrors.accessoriesQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Total Sticker"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="totalSticker"
                  value={formData.totalSticker}
                  onChange={handleInputChange}
                  error={!!fieldErrors.totalSticker}
                  helperText={fieldErrors.totalSticker}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Total Amt"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="totalAmt"
                  value={formData.totalAmt}
                  onChange={handleInputChange}
                  error={!!fieldErrors.totalAmt}
                  helperText={fieldErrors.totalAmt}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.childPartNo}>
                  <InputLabel id="childPartNo-label">Child Part No</InputLabel>
                  <Select
                    labelId="childPartNo-label"
                    label="Child Part No"
                    value={formData.childPartNo}
                    onChange={handleInputChange}
                    name="childPartNo"
                  >
                    <MenuItem value="CHILD1">CHILD1</MenuItem>
                    <MenuItem value="CHILD2">CHILD2</MenuItem>
                    <MenuItem value="CHILD3">CHILD3</MenuItem>
                  </Select>
                  {fieldErrors.childPartNo && <FormHelperText>{fieldErrors.childPartNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Child Part Description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="childPartDesc"
                  value={formData.childPartDesc}
                  onChange={handleInputChange}
                  error={!!fieldErrors.childPartDesc}
                  helperText={fieldErrors.childPartDesc}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Child Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="childQty"
                  value={formData.childQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.childQty}
                  helperText={fieldErrors.childQty}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select labelId="status-label" label="Status" value={formData.status} onChange={handleInputChange} name="status">
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  </Select>
                  {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.repack}>
                  <InputLabel id="repack-label">Repack</InputLabel>
                  <Select labelId="repack-label" label="Repack" value={formData.repack} onChange={handleInputChange} name="repack">
                    <MenuItem value="REPACK1">REPACK1</MenuItem>
                    <MenuItem value="REPACK2">REPACK2</MenuItem>
                    <MenuItem value="REPACK3">REPACK3</MenuItem>
                  </Select>
                  {fieldErrors.repack && <FormHelperText>{fieldErrors.repack}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.category}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select labelId="category-label" label="Category" value={formData.category} onChange={handleInputChange} name="category">
                    <MenuItem value="CATEGORY1">CATEGORY1</MenuItem>
                    <MenuItem value="CATEGORY2">CATEGORY2</MenuItem>
                    <MenuItem value="CATEGORY3">CATEGORY3</MenuItem>
                  </Select>
                  {fieldErrors.category && <FormHelperText>{fieldErrors.category}</FormHelperText>}
                </FormControl>
              </div>
            </div>
          </>
        )} */}
        <h1 className="text-center mt-5"> HOLD </h1>
      </div>
      <ToastContainer />
    </>
  );
};

export default MaterialLabelMappingMaster;
