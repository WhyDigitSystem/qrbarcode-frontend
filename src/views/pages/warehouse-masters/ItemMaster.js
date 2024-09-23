import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
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
import ToastComponent, { showToast } from 'utils/toast-component';
import GridOnIcon from '@mui/icons-material/GridOn';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { getAllActiveGroups, getAllActiveUnits } from 'utils/CommonFunctions';

export const ItemMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [editId, setEditId] = useState('');
  const [unitList, setUnitList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));

  const [formData, setFormData] = useState({
    itemType: '',
    partNo: '',
    partDesc: '',
    custPartNo: '',
    groupName: '',
    styleCode: '',
    baseSku: '',
    addDesc: '',
    purchaseUnit: '',
    storageUnit: '',
    fixedCapAcrossLocn: '',
    fsn: '',
    saleUnit: '',
    type: '',
    serialNoFlag: '',
    sku: '',
    skuQty: '',
    ssku: '',
    sskuQty: '',
    zoneType: '',
    weightSkuUom: '',
    hsnCode: '',
    controlBranch: localStorage.getItem('branchcode'),
    criticalStockLevel: '',
    criticalStock: '',
    bchk: '',
    status: 'R',
    parentChildKey: 'CHILD',
    barcode: '',
    skuCategory: '',
    active: true
  });
  const [value, setValue] = useState(0);
  const [itemTableData, setItemTableData] = useState([
    {
      id: 1,
      mrp: '',
      fDate: null,
      tDate: null
    }
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      mrp: '',
      fDate: null,
      tDate: null
    };
    setItemTableData([...itemTableData, newRow]);
    setItemTableErrors([
      ...itemTableErrors,
      {
        mrp: '',
        fDate: null,
        tDate: null
      }
    ]);
  };

  const [itemTableErrors, setItemTableErrors] = useState([
    {
      mrp: '',
      fDate: null,
      tDate: null
    }
  ]);

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    itemType: '',
    partNo: '',
    partDesc: '',
    custPartNo: '',
    groupName: '',
    styleCode: '',
    baseSku: '',
    addDesc: '',
    purchaseUnit: '',
    storageUnit: '',
    fixedCapAcrossLocn: '',
    fsn: '',
    saleUnit: '',
    type: '',
    serialNoFlag: '',
    sku: '',
    skuQty: '',
    ssku: '',
    sskuQty: '',
    zoneType: '',
    weightSkuUom: '',
    hsnCode: '',
    parentChildKey: '',
    controlBranch: '',
    criticalStockLevel: '',
    criticalStock: '',
    bchk: '',
    status: '',
    barcode: '',
    skuCategory: '',
    movingType: ''
  });
  const listViewColumns = [
    { accessorKey: 'partno', header: 'Part No', size: 140 },
    { accessorKey: 'partDesc', header: 'Part Desc', size: 140 },
    { accessorKey: 'sku', header: 'SKU', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([
    {
      id: 1,
      partNo: 'partNo1',
      partDesc: 'partDesc1',
      sku: 'sku1',
      status: 'status1',
      active: 'Active'
    },
    {
      id: 2,
      partNo: 'partNo2',
      partDesc: 'partDesc2',
      sku: 'sku2',
      status: 'status2',
      active: 'Active'
    }
  ]);
  useEffect(() => {
    console.log('LISTVIEW FIELD CURRENT VALUE IS', listView);
    getAllUnits();
    getAllGroups();
    getAllItems();
  }, []);

  const getAllUnits = async () => {
    try {
      const unitData = await getAllActiveUnits(orgId);
      setUnitList(unitData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllGroups = async () => {
    try {
      const groupData = await getAllActiveGroups(orgId);
      console.log('THE GROUP DATA IS:', groupData);

      setGroupList(groupData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  const getAllItems = async () => {
    try {
      const response = await apiCalls(
        'get',
        `warehousemastercontroller/material?cbranch=${loginBranchCode}&client=${loginClient}&orgid=${orgId}`
      );
      setListViewData(response.paramObjectsMap.materialVO);
      console.log('TEST LISTVIEW DATA', response);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAllItemById = async (row) => {
    console.log('THE SELECTED ITEM ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/material/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularItem = response.paramObjectsMap.materialVO;
        // const selectedBranch = branchList.find((br) => br.branch === particularItem.branch);
        console.log('THE SELECTED ITEM IS:', particularItem);

        setFormData({
          itemType: particularItem.itemType,
          partNo: particularItem.partno,
          partDesc: particularItem.partDesc,
          custPartNo: particularItem.custPartno,
          groupName: particularItem.groupName,
          styleCode: particularItem.styleCode,
          baseSku: particularItem.baseSku,
          // addDesc: particularItem.addDesc, //no
          purchaseUnit: particularItem.purchaseUnit,
          storageUnit: particularItem.storageUnit,
          // fixedCapAcrossLocn: particularItem.fixedCapAcrossLocn, //no
          fsn: particularItem.fsn,
          saleUnit: particularItem.saleUnit,
          type: particularItem.type,
          // serialNoFlag: particularItem.serialNoFlag, //no
          sku: particularItem.sku,
          skuQty: particularItem.skuQty,
          ssku: particularItem.ssku,
          sskuQty: particularItem.sskuQty,
          // zoneType: particularItem.zoneType, //no
          weightSkuUom: particularItem.weightofSkuAndUom,
          hsnCode: particularItem.hsnCode,
          parentChildKey: particularItem.parentChildKey,
          controlBranch: particularItem.cbranch,
          criticalStockLevel: particularItem.criticalStockLevel,
          // criticalStock: particularItem.criticalStock, //no
          // bchk: particularItem.bchk, //no
          status: particularItem.status,
          barcode: particularItem.barcode,
          skuCategory: particularItem.skuCategory,
          // itemVo: itemVo, //no
          // orgId: orgId,
          // createdby: loginUserName,
          // breadth: 0,
          // client: loginClient,
          // customer: loginCustomer,
          // height: 0,
          // length: 0,
          // palletQty: '',
          // warehouse: loginWarehouse,
          // weight: 0,
          // branch: loginBranch,
          // branchCode: loginBranchCode,
          active: particularItem.active === 'Active' ? true : false
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const numericRegex = /^[0-9]*$/;
  //   const alphanumericRegex = /^[A-Za-z0-9]*$/;
  //   const specialCharsRegex = /^[A-Za-z0-9@_\-*]*$/;

  //   let errorMessage = '';

  //   switch (name) {
  //     case 'baseSku':
  //     case 'ssku':
  //       if (!alphanumericRegex.test(value)) {
  //         errorMessage = 'Only Alphanumeric are allowed';
  //       }
  //       if (value.length > 12) {
  //         errorMessage = 'Length between 8 - 12 only';
  //       }
  //       break;
  //     case 'fsn':
  //     case 'hsnCode':
  //       if (!numericRegex.test(value)) {
  //         errorMessage = 'Only Numbers are allowed';
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    const numericRegex = /^[0-9]*$/;
    const alphanumericRegex = /^[A-Za-z0-9]*$/;

    let errorMessage = '';

    switch (name) {
      case 'baseSku':
      case 'ssku':
        if (!alphanumericRegex.test(value)) {
          errorMessage = 'Only Alphanumeric characters are allowed';
        } else if (value.length > 12) {
          errorMessage = 'Length between 8 - 12 characters only';
        }
        break;
      case 'fsn':
      case 'hsnCode':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only Numbers are allowed';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      const transformedValue = value.toUpperCase();

      // Calculate the difference in length due to transformation
      const cursorOffset = transformedValue.length - value.length;

      setFormData({ ...formData, [name]: transformedValue });
      setFieldErrors({ ...fieldErrors, [name]: '' });

      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement) {
          // Adjust the cursor position considering the transformation
          inputElement.setSelectionRange(selectionStart + cursorOffset, selectionEnd + cursorOffset);
        }
      }, 0);
    }
  };

  // const handleDateChange = (date, index) => {
  //   setItemTableData((prev) => prev.map((r, idx) => (idx === index ? { ...r, fDate: date } : r)));
  //   setItemTableErrors((prev) => {
  //     const newErrors = [...prev];
  //     newErrors[index] = {
  //       ...newErrors[index],
  //       fDate: !date ? 'Start Date is required' : ''
  //     };
  //     return newErrors;
  //   });
  // };

  const handleDeleteRow = (id) => {
    setItemTableData(itemTableData.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === itemTableData[itemTableData.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };

  const handleClear = () => {
    setFormData({
      itemType: '',
      partNo: '',
      partDesc: '',
      custPartNo: '',
      groupName: '',
      styleCode: '',
      baseSku: '',
      addDesc: '',
      purchaseUnit: '',
      storageUnit: '',
      fixedCapAcrossLocn: '',
      fsn: '',
      saleUnit: '',
      type: '',
      serialNoFlag: '',
      sku: '',
      skuQty: '',
      ssku: '',
      sskuQty: '',
      zoneType: '',
      weightSkuUom: '',
      hsnCode: '',
      controlBranch: localStorage.getItem('branchcode'),
      criticalStockLevel: '',
      criticalStock: '',
      bchk: '',
      status: 'R',
      parentChildKey: 'CHILD',
      barcode: '',
      skuCategory: '',
      movingType: '',
      active: true
    });
    setItemTableData([
      {
        id: 1,
        mrp: '',
        fDate: '',
        tDate: ''
      }
    ]);
    setFieldErrors({
      itemType: '',
      partNo: '',
      partDesc: '',
      custPartNo: '',
      groupName: '',
      styleCode: '',
      baseSku: '',
      addDesc: '',
      purchaseUnit: '',
      storageUnit: '',
      fixedCapAcrossLocn: '',
      fsn: '',
      saleUnit: '',
      type: '',
      serialNoFlag: '',
      sku: '',
      skuQty: '',
      ssku: '',
      sskuQty: '',
      zoneType: '',
      weightSkuUom: '',
      hsnCode: '',
      parentChildKey: '',
      controlBranch: '',
      criticalStockLevel: '',
      criticalStock: '',
      bchk: '',
      status: '',
      barcode: '',
      skuCategory: '',
      movingType: ''
    });
    setItemTableErrors('');
    setEditId('');
  };

  const handleTableClear = (table) => {
    if (table === 'itemTableData') {
      setItemTableData([{ id: 1, mrp: '', fDate: '', tDate: '' }]);
      setItemTableErrors('');
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.partNo) {
      errors.partNo = 'Part No is required';
    }
    if (!formData.partDesc) {
      errors.partDesc = 'part Desc is required';
    }
    if (!formData.sku) {
      errors.sku = 'SKU is required';
    }
    if (!formData.ssku) {
      errors.ssku = 'SSKU is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      const itemVo = itemTableData.map((row) => ({
        mrp: row.mrp,
        fromdate: dayjs(row.fDate).format('DD-MM-YYYY'),
        todate: dayjs(row.tDate).format('DD-MM-YYYY')
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        itemType: formData.itemType,
        partno: formData.partNo,
        partDesc: formData.partDesc,
        custPartno: formData.custPartNo,
        groupName: formData.groupName,
        styleCode: formData.styleCode,
        baseSku: formData.baseSku,
        // addDesc: formData.addDesc, //no
        purchaseUnit: formData.purchaseUnit,
        storageUnit: formData.storageUnit,
        // fixedCapAcrossLocn: formData.fixedCapAcrossLocn, //no
        fsn: formData.fsn,
        saleUnit: formData.saleUnit,
        type: formData.type,
        // serialNoFlag: formData.serialNoFlag, //no
        sku: formData.sku,
        skuQty: formData.skuQty,
        ssku: formData.ssku,
        sskuQty: formData.sskuQty,
        skuCategory: formData.skuCategory,
        // zoneType: formData.zoneType, //no
        weightofSkuAndUom: formData.weightSkuUom,
        hsnCode: formData.hsnCode,
        parentChildKey: formData.parentChildKey,
        cbranch: formData.controlBranch,
        criticalStockLevel: formData.criticalStockLevel,
        // criticalStock: formData.criticalStock, //no
        // bchk: formData.bchk, //no
        status: formData.status,
        barcode: formData.barcode,
        // itemVo: itemVo, //no
        orgId: orgId,
        createdBy: loginUserName,
        breadth: 0,
        client: loginClient,
        customer: loginCustomer,
        height: 0,
        length: 0,
        palletQty: '',
        warehouse: loginWarehouse,
        weight: 0,
        branch: loginBranch,
        branchCode: loginBranchCode
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateMaterial`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Item Updated Successfully' : 'Item created successfully');
          setIsLoading(false);
          getAllItems();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Item creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Item creation failed');
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
      itemType: '',
      partNo: '',
      partDesc: '',
      custPartNo: '',
      groupName: '',
      styleCode: '',
      baseSku: '',
      addDesc: '',
      purchaseUnit: '',
      storageUnit: '',
      fixedCapAcrossLocn: '',
      fsn: '',
      saleUnit: '',
      type: '',
      serialNoFlag: '',
      sku: '',
      skuQty: '',
      ssku: '',
      sskuQty: '',
      zoneType: '',
      weightSkuUom: '',
      hsnCode: '',
      parentChildKey: '',
      controlBranch: '',
      criticalStockLevel: '',
      criticalStock: '',
      bchk: '',
      status: '',
      barcode: '',
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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllItemById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.itemType}>
                  <InputLabel id="itemType-label">Item Type</InputLabel>
                  <Select
                    labelId="itemType-label"
                    id="itemType"
                    name="itemType"
                    label="Item Type"
                    value={formData.itemType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="GROUP">GROUP</MenuItem>
                    <MenuItem value="ITEM">ITEM</MenuItem>
                  </Select>
                  {fieldErrors.itemType && <FormHelperText error>{fieldErrors.itemType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Part No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="partNo"
                  value={formData.partNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.partNo}
                  helperText={fieldErrors.partNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Part Desc <span className="asterisk">*</span>
                    </span>
                  }
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
                <TextField
                  label="Cust Part No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="custPartNo"
                  value={formData.custPartNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.custPartNo}
                  helperText={fieldErrors.custPartNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.groupName}>
                  <InputLabel id="groupName-label">Group Name</InputLabel>
                  <Select
                    labelId="groupName-label"
                    id="groupName"
                    name="groupName"
                    label="Group Name"
                    value={formData.groupName}
                    onChange={handleInputChange}
                  >
                    {groupList.length > 0 &&
                      groupList.map((row) => (
                        <MenuItem key={row.id} value={row.groupName.toUpperCase()}>
                          {row.groupName.toUpperCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.groupName && <FormHelperText error>{fieldErrors.groupName}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Style Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="styleCode"
                  value={formData.styleCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.styleCode}
                  helperText={fieldErrors.styleCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Base SKU"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="baseSku"
                  value={formData.baseSku}
                  onChange={handleInputChange}
                  error={!!fieldErrors.baseSku}
                  helperText={fieldErrors.baseSku}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.purchaseUnit}>
                  <InputLabel id="purchaseUnit-label">Purchase Unit</InputLabel>
                  <Select
                    labelId="purchaseUnit-label"
                    id="purchaseUnit"
                    name="purchaseUnit"
                    label="Purchase Unit"
                    value={formData.purchaseUnit}
                    onChange={handleInputChange}
                  >
                    {unitList.length > 0 &&
                      unitList.map((row) => (
                        <MenuItem key={row.id} value={row.unitName.toUpperCase()}>
                          {row.unitName.toUpperCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.purchaseUnit && <FormHelperText error>{fieldErrors.purchaseUnit}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.storageUnit}>
                  <InputLabel id="storageUnit-label">Storage Unit</InputLabel>
                  <Select
                    labelId="storageUnit-label"
                    id="storageUnit"
                    name="storageUnit"
                    label="Storage Unit"
                    value={formData.storageUnit}
                    onChange={handleInputChange}
                  >
                    {unitList.length > 0 &&
                      unitList.map((row) => (
                        <MenuItem key={row.id} value={row.unitName.toUpperCase()}>
                          {row.unitName.toUpperCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.storageUnit && <FormHelperText error>{fieldErrors.storageUnit}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.sku}>
                  <InputLabel id="sku-label">
                    {
                      <span>
                        SKU <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select labelId="sku-label" id="sku" name="sku" label="SKU *" value={formData.sku} onChange={handleInputChange}>
                    {unitList.length > 0 &&
                      unitList?.map((row) => (
                        <MenuItem key={row.id} value={row.unitName.toUpperCase()}>
                          {row.unitName.toUpperCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.sku && <FormHelperText error>{fieldErrors.sku}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.sku}>
                  <InputLabel id="sku-label">
                    {
                      <span>
                        SSKU <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select labelId="sku-label" id="ssku" name="ssku" label="SSKU *" value={formData.ssku} onChange={handleInputChange}>
                    {unitList.length > 0 &&
                      unitList.map((row) => (
                        <MenuItem key={row.id} value={row.unitName.toUpperCase()}>
                          {row.unitName.toUpperCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.ssku && <FormHelperText error>{fieldErrors.ssku}</FormHelperText>}
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="SSKU"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="ssku"
                  value={formData.ssku}
                  onChange={handleInputChange}
                  error={!!fieldErrors.ssku}
                  helperText={fieldErrors.ssku}
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
              {/* <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.criticalStock}>
                  <InputLabel id="criticalStock-label">Critical Stock</InputLabel>
                  <Select
                    labelId="criticalStock-label"
                    id="criticalStock"
                    name="criticalStock"
                    label="Critical Stock"
                    value={formData.criticalStock}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.criticalStock && <FormHelperText error>{fieldErrors.criticalStock}</FormHelperText>}
                </FormControl>
              </div> */}
              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="BCHK"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="bchk"
                  value={formData.bchk}
                  onChange={handleInputChange}
                  error={!!fieldErrors.bchk}
                  helperText={fieldErrors.bchk}
                />
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="R">R</MenuItem>
                    <MenuItem value="H">H</MenuItem>
                    {/* <MenuItem value="L">L</MenuItem> */}
                  </Select>
                  {fieldErrors.status && <FormHelperText error>{fieldErrors.status}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.parentChildKey}>
                  <InputLabel id="parentChildKey-label">Parent Child Key </InputLabel>
                  <Select
                    labelId="parentChildKey-label"
                    id="parentChildKey"
                    name="parentChildKey"
                    label="Parent Child Key"
                    value={formData.parentChildKey}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="PARENT">PARENT</MenuItem>
                    <MenuItem value="CHILD">CHILD</MenuItem>
                  </Select>
                  {fieldErrors.parentChildKey && <FormHelperText error>{fieldErrors.parentChildKey}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.skuCategory}>
                  <InputLabel id="skuCategory-label">Sku Category</InputLabel>
                  <Select
                    labelId="skuCategory-label"
                    id="skuCategory"
                    name="skuCategory"
                    label="Sku Category"
                    value={formData.skuCategory}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="OPENSTORAGE">Open Storage</MenuItem>
                    <MenuItem value="COLDSTORAGE">Cold Storage</MenuItem>
                    <MenuItem value="STRONG">Strong</MenuItem>
                    <MenuItem value="REGULAR">Regular</MenuItem>
                  </Select>
                  {fieldErrors.skuCategory && <FormHelperText error>{fieldErrors.skuCategory}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.movingType}>
                  <InputLabel id="movingType-label">Moving Type</InputLabel>
                  <Select
                    labelId="movingType-label"
                    id="movingType"
                    name="movingType"
                    label="Moving Type"
                    value={formData.movingType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="FAST">Fast </MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM </MenuItem>
                    <MenuItem value="SLOW">Slow </MenuItem>
                  </Select>
                  {fieldErrors.movingType && <FormHelperText error>{fieldErrors.movingType}</FormHelperText>}
                </FormControl>
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

            <div className="row ">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Item Details" />
                  <Tab value={1} label="Other Details" />
                </Tabs>
              </Box>
              {/* <Box className="mt-4"> */}
              <Box className="mt-2" sx={{ padding: 1 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        <ActionButton title="Clear" icon={ClearIcon} onClick={() => handleTableClear('itemTableData')} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-8">
                          <div className="table-responsive">
                            <table className="table table-bordered" style={{ width: '100%' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 100 }}>
                                    MRP
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 150 }}>
                                    From Date
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 150 }}>
                                    To Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {itemTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="number"
                                        value={row.mrp}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, mrp: value } : r)));
                                          setItemTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], mrp: !value ? 'MRP is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemTableErrors[index]?.mrp ? 'error form-control' : 'form-control'}
                                      />
                                      {itemTableErrors[index]?.mrp && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemTableErrors[index].mrp}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <div className="w-100">
                                        <DatePicker
                                          selected={row.fDate}
                                          className={itemTableErrors[index]?.fDate ? 'error form-control' : 'form-control'}
                                          onChange={(date) => {
                                            setItemTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, fDate: date, tDate: date > r.tDate ? null : r.tDate } : r
                                              )
                                            );
                                            setItemTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                fDate: !date ? 'Start Date is required' : '',
                                                tDate: date && row.tDate && date > row.tDate ? '' : newErrors[index]?.tDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          dateFormat="dd-MM-yyyy"
                                          minDate={new Date()}
                                        />
                                        {itemTableErrors[index]?.fDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {itemTableErrors[index].fDate}
                                          </div>
                                        )}
                                      </div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <DatePicker
                                        selected={row.tDate}
                                        className={itemTableErrors[index]?.tDate ? 'error form-control' : 'form-control'}
                                        onChange={(date) => {
                                          setItemTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, tDate: date } : r)));
                                          setItemTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              tDate: !date ? 'End Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        dateFormat="dd-MM-yyyy"
                                        minDate={row.fDate || new Date()} // Set minDate for tDate to be fDate or today's date
                                        disabled={!row.fDate} // Disable tDate picker if fDate is not selected
                                      />
                                      {itemTableErrors[index]?.tDate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemTableErrors[index].tDate}
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
                {value === 1 && (
                  <>
                    <div className="row mt-2">
                      <div className="row">
                        {/* <div className="col-md-3 mb-3">
                          <TextField
                            label="Add Desc"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="addDesc"
                            value={formData.addDesc}
                            onChange={handleInputChange}
                            error={!!fieldErrors.addDesc}
                            helperText={fieldErrors.addDesc}
                          />
                        </div> */}

                        {/* <div className="col-md-3 mb-3">
                          <TextField
                            label="Fixed Cap Across Locn"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="fixedCapAcrossLocn"
                            value={formData.fixedCapAcrossLocn}
                            onChange={handleInputChange}
                            error={!!fieldErrors.fixedCapAcrossLocn}
                            helperText={fieldErrors.fixedCapAcrossLocn}
                          />
                        </div> */}
                        <div className="col-md-3 mb-3">
                          <TextField
                            label="FSN"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="fsn"
                            value={formData.fsn}
                            onChange={handleInputChange}
                            error={!!fieldErrors.fsn}
                            helperText={fieldErrors.fsn}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.saleUnit}>
                            <InputLabel id="saleUnit-label">Sale Unit</InputLabel>
                            <Select
                              labelId="saleUnit-label"
                              id="saleUnit"
                              name="saleUnit"
                              label="Sale Unit"
                              value={formData.saleUnit}
                              onChange={handleInputChange}
                            >
                              {unitList.length > 0 &&
                                unitList.map((row) => (
                                  <MenuItem key={row.id} value={row.unitName.toUpperCase()}>
                                    {row.unitName.toUpperCase()}
                                  </MenuItem>
                                ))}
                            </Select>
                            {fieldErrors.saleUnit && <FormHelperText error>{fieldErrors.saleUnit}</FormHelperText>}
                          </FormControl>
                        </div>
                        <div className="col-md-3 mb-3">
                          <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                              labelId="type-label"
                              id="type"
                              name="type"
                              label="Type"
                              value={formData.type}
                              onChange={handleInputChange}
                            >
                              <MenuItem value="TYPE 1">TYPE 1</MenuItem>
                              <MenuItem value="TYPE 2">TYPE 2</MenuItem>
                            </Select>
                            {fieldErrors.type && <FormHelperText error>{fieldErrors.type}</FormHelperText>}
                          </FormControl>
                        </div>
                        {/* <div className="col-md-3 mb-3">
                          <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.serialNoFlag}>
                            <InputLabel id="serialNoFlag-label">Serial No Flag</InputLabel>
                            <Select
                              labelId="serialNoFlag-label"
                              id="serialNoFlag"
                              name="serialNoFlag"
                              label="Serial No Flag"
                              value={formData.serialNoFlag}
                              onChange={handleInputChange}
                            >
                              <MenuItem value="FLAG 1">FLAG 1</MenuItem>
                              <MenuItem value="FLAG 2">FLAG 2</MenuItem>
                            </Select>
                            {fieldErrors.serialNoFlag && <FormHelperText error>{fieldErrors.serialNoFlag}</FormHelperText>}
                          </FormControl>
                        </div> */}

                        <div className="col-md-3 mb-3">
                          <TextField
                            type="text"
                            label="SKU Qty"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="skuQty"
                            value={formData.skuQty}
                            onChange={handleInputChange}
                            error={!!fieldErrors.skuQty}
                            helperText={fieldErrors.skuQty}
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <TextField
                            type="text"
                            label="SSKU Qty"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="sskuQty"
                            value={formData.sskuQty}
                            onChange={handleInputChange}
                            error={!!fieldErrors.sskuQty}
                            helperText={fieldErrors.sskuQty}
                          />
                        </div>
                        {/* <div className="col-md-3 mb-3">
                          <TextField
                            label="Zone Type"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="zoneType"
                            value={formData.zoneType}
                            onChange={handleInputChange}
                            error={!!fieldErrors.zoneType}
                            helperText={fieldErrors.zoneType}
                          />
                        </div> */}
                        <div className="col-md-3 mb-3">
                          <TextField
                            type="text"
                            label="Weight SKU UOM"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="weightSkuUom"
                            value={formData.weightSkuUom}
                            onChange={handleInputChange}
                            error={!!fieldErrors.weightSkuUom}
                            helperText={fieldErrors.weightSkuUom}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <TextField
                            label="HSN Code"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="hsnCode"
                            value={formData.hsnCode}
                            onChange={handleInputChange}
                            error={!!fieldErrors.hsnCode}
                            helperText={fieldErrors.hsnCode}
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <TextField
                            type="text"
                            label="Critical Stock Level"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="criticalStockLevel"
                            value={formData.criticalStockLevel}
                            onChange={handleInputChange}
                            error={!!fieldErrors.criticalStockLevel}
                            helperText={fieldErrors.criticalStockLevel}
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <TextField
                            label="Barcode"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleInputChange}
                            error={!!fieldErrors.barcode}
                            helperText={fieldErrors.barcode}
                          />
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
      <ToastComponent />
    </>
  );
};

export default ItemMaster;
