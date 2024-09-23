import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
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
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

export const LocationMappingMaster = () => {
  const [warehouseList, setWarehouseList] = useState([]);
  const [locationTypeList, setLocationTypeList] = useState([]);
  const [rowNoList, setRowNoList] = useState([]);
  const [levelNoList, setLevelNoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginUserId, setLoginUserId] = useState(localStorage.getItem('userId'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));

  const [formData, setFormData] = useState({
    branch: loginBranch,
    warehouse: localStorage.getItem('warehouse'),
    locationType: '',
    clientType: 'Fixed',
    rowNo: '',
    levelNo: '',
    client: loginClient,
    active: true,
    orgId: 1
  });
  const [value, setValue] = useState(0);
  const [locationMappingTableData, setLocationMappingTableData] = useState([
    {
      id: 1,
      rowNo: '',
      levelNo: '',
      palletNo: '',
      multiCore: '',
      LocationStatus: '',
      vasBinSeq: ''
    }
  ]);

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === locationMappingTableData) {
      return !lastRow.rowNo || !lastRow.levelNo || !lastRow.palletNo || !lastRow.multiCore || !lastRow.LocationStatus;
      // } else if (table === branchTableData) {
      //   return !lastRow.branchCode;
      // } else if (table === clientTableData) {
      //   return !lastRow.customer || !lastRow.client;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === locationMappingTableData) {
      setLocationMappingTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          rowNo: !table[table.length - 1].rowNo ? 'Row No is required' : '',
          levelNo: !table[table.length - 1].levelNo ? 'Level No is required' : '',
          palletNo: !table[table.length - 1].palletNo ? 'Bin is required' : '',
          multiCore: !table[table.length - 1].multiCore ? 'Multi Core is required' : '',
          LocationStatus: !table[table.length - 1].LocationStatus ? 'Bin Status is required' : ''
          // vasBinSeq: !table[table.length - 1].vasBinSeq ? 'Bin Seq is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(locationMappingTableData)) {
      displayRowError(locationMappingTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      rowNo: '',
      levelNo: '',
      palletNo: '',
      multiCore: '',
      LocationStatus: '',
      vasBinSeq: ''
    };
    setLocationMappingTableData([...locationMappingTableData, newRow]);
    setLocationMappingTableErrors([
      ...locationMappingTableErrors,
      {
        rowNo: '',
        levelNo: '',
        palletNo: '',
        multiCore: '',
        LocationStatus: ''
        // vasBinSeq: ''
      }
    ]);
  };

  const getAllbinsByCompanyAndWarehouseAndLocationTypeAndRownoAndLevel = async () => {
    const errors = {};
    if (!formData.levelNo) {
      errors.levelNo = 'Level No is required';
    }
    if (!formData.locationType) {
      errors.locationType = 'Location Type is required';
    }
    if (!formData.rowNo) {
      errors.rowNo = 'Row is required';
    }
    if (Object.keys(errors).length === 0) {
      // setModalOpen(true);
      try {
        const response = await apiCalls(
          'get',
          `warehousemastercontroller/bins/levelno/rowno/locationtype/warehouse?level=${formData.levelNo}&locationtype=${formData.locationType}&orgid=${orgId}&rowno=${formData.rowNo}&warehouse=${loginWarehouse}`
        );
        console.log('THE WAREHOUSE IS:', response);
        if (response.status === true) {
          const bins = response.paramObjectsMap.Bins;
          console.log('THE BIN DETAILS ARE:', bins);

          setLocationMappingTableData(
            bins.map((bin) => ({
              id: bin.id,
              rowNo: bin.rowno,
              levelNo: bin.level,
              palletNo: bin.bin,
              multiCore: bin.core,
              LocationStatus: bin.status === 'True' ? 'True' : 'False',
              vasBinSeq: ''
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const [locationMappingTableErrors, setLocationMappingTableErrors] = useState([
    {
      rowNo: '',
      levelNo: '',
      palletNo: '',
      multiCore: '',
      LocationStatus: '',
      vasBinSeq: ''
    }
  ]);

  const theme = useTheme();
  const anchorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    branch: '',
    warehouse: '',
    locationType: '',
    clientType: '',
    rowNo: '',
    levelNo: '',
    client: ''
  });
  const listViewColumns = [
    { accessorKey: 'branch', header: 'Branch', size: 140 },
    { accessorKey: 'branchCode', header: 'Branch Code', size: 140 },
    { accessorKey: 'warehouse', header: 'Warehouse', size: 140 },
    { accessorKey: 'binType', header: 'Bin Type', size: 140 },
    { accessorKey: 'client', header: 'Client', size: 140 },
    { accessorKey: 'clientType', header: 'Client Type', size: 140 },
    { accessorKey: 'customer', header: 'Customer', size: 200 },
    { accessorKey: 'rowNo', header: 'Row', size: 140 },
    { accessorKey: 'levelNo', header: 'Level No', size: 140 }
    // { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  useEffect(() => {
    getAllLocationMapping();
    getAllWarehousesByLoginBranch();
    getAllLocationTypes();
    getAllRownoByCompanyAndWarehouseAndLocationType();
  }, []);

  useEffect(() => {
    getAllRownoByCompanyAndWarehouseAndLocationType();
  }, [formData.locationType]);

  useEffect(() => {
    getAllLevelnoByCompanyAndWarehouseAndLocationTypeAndRowno();
  }, [formData.rowNo]);

  const getAllLocationMapping = async () => {
    try {
      const response = await apiCalls(
        'get',
        `warehousemastercontroller/locationmapping?branch=${loginBranch}&client=${loginClient}&orgid=${orgId}&warehouse=${loginWarehouse}`
      );
      console.log('THE locationMapping IS:', response);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.locationMappingVO);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getLocationmappingid = async (row) => {
    console.log('THE LOCATION ID IS:', row.original.id);

    try {
      const response = await apiCalls('get', `warehousemastercontroller/locationmapping/${row.original.id}`);
      console.log('THE WAREHOUSEES IS:', response);

      if (response.status === true) {
        setEditId(row.original.id);
        const particularLocation = response.paramObjectsMap.LocationMapping;
        setFormData({
          branch: particularLocation.branch,
          branchCode: particularLocation.branchCode,
          locationType: particularLocation.binType,
          rowNo: particularLocation.rowNo,
          levelNo: particularLocation.levelNo,
          client: particularLocation.client,
          clientType: particularLocation.clientType,
          customer: particularLocation.customer,
          warehouse: particularLocation.warehouse,
          active: particularLocation.active === 'Active' ? true : false
        });
        setLocationMappingTableData(
          particularLocation.locationMappingDetails.map((loc) => ({
            id: loc.id,
            palletNo: loc.bin,
            binCategory: loc.binCategory,
            LocationStatus: loc.binStatus === 'True' ? 'True' : 'False',
            vasBinSeq: loc.binSeq,
            multiCore: loc.core,
            levelNo: loc.levelNo,
            rowNo: loc.rowNo,
            warehouse: loc.warehouse
          }))
        );
        setListView(false);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getAllWarehousesByLoginBranch = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/warehouse/branch?branchcode=${loginBranchCode}&orgid=${orgId}`);
      console.log('THE WAREHOUSEES IS:', response);
      if (response.status === true) {
        setWarehouseList(response.paramObjectsMap.Warehouse);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getAllLocationTypes = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/locationtype/warehouse?orgid=${orgId}&warehouse=${loginWarehouse}`);
      if (response.status === true) {
        setLocationTypeList(response.paramObjectsMap.Locationtype);
        console.log('THE LOCATIONTYPE IS:', response.paramObjectsMap.Locationtype);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching locationType data:', error);
    }
  };

  const getAllRownoByCompanyAndWarehouseAndLocationType = async () => {
    try {
      const response = await apiCalls(
        'get',
        `warehousemastercontroller/rowno/locationtype/warehouse?locationtype=${formData.locationType}&orgid=${orgId}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        setRowNoList(response.paramObjectsMap.Rowno);
        console.log('THE Rowno IS:', response.paramObjectsMap.Rowno);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching locationType data:', error);
    }
  };
  const getAllLevelnoByCompanyAndWarehouseAndLocationTypeAndRowno = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/warehousemastercontroller/levelno/rowno/locationtype/warehouse?locationtype=${formData.locationType}&orgid=${orgId}&rowno=${formData.rowNo}&warehouse=${loginWarehouse}`
      );
      if (response.status === true) {
        setLevelNoList(response.paramObjectsMap.Levelno);
        console.log('THE Levelno IS:', response.paramObjectsMap.Levelno);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching locationType data:', error);
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

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     // if (name === 'locationType') {
  //     // }
  //     setFormData({ ...formData, [name]: value });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    const numericRegex = /^[0-9]*$/;
    const alphanumericRegex = /^[A-Za-z0-9]*$/;
    const specialCharsRegex = /^[A-Za-z0-9@_\-*]*$/;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFieldErrors({ ...fieldErrors, [name]: '' });
      setFormData({ ...formData, [name]: value });

      // Optionally maintain cursor position
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  const handleDeleteRow = (id) => {
    setLocationMappingTableData(locationMappingTableData.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === locationMappingTableData[locationMappingTableData.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };

  const handleClear = () => {
    setEditId('');
    setFormData({
      warehouse: '',
      locationType: '',
      clientType: 'Fixed',
      rowNo: '',
      levelNo: '',
      active: true
    });
    setLocationMappingTableData([
      {
        id: 1,
        rowNo: '',
        levelNo: '',
        palletNo: '',
        multiCore: '',
        LocationStatus: '',
        vasBinSeq: ''
      }
    ]);
    setFieldErrors({
      branch: '',
      warehouse: '',
      locationType: '',
      clientType: '',
      rowNo: '',
      levelNo: '',
      client: ''
    });
    setLocationMappingTableErrors('');
  };
  const handleTableClear = (table) => {
    if (table === 'locationMappingTableData') {
      setLocationMappingTableData([{ id: 1, rowNo: '', levelNo: '', palletNo: '', multiCore: '', LocationStatus: '', vasBinSeq: '' }]);
      setLocationMappingTableErrors('');
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.branch) {
      errors.branch = 'Branch is required';
    }
    if (!formData.warehouse) {
      errors.warehouse = 'Warehouse is required';
    }
    if (!formData.locationType) {
      errors.locationType = 'Location Type is required';
    }
    if (!formData.rowNo) {
      errors.rowNo = 'Row Number is required';
    }
    if (!formData.levelNo) {
      errors.levelNo = 'Level No is required';
    }

    let locationMappingTableDataValid = true;
    const newTableErrors = locationMappingTableData.map((row) => {
      const rowErrors = {};
      if (!row.rowNo) {
        rowErrors.rowNo = 'Row No is required';
        locationMappingTableDataValid = false;
      }
      if (!row.levelNo) {
        rowErrors.levelNo = 'Level No is required';
        locationMappingTableDataValid = false;
      }
      if (!row.palletNo) {
        rowErrors.palletNo = 'Bin is required';
        locationMappingTableDataValid = false;
      }
      if (!row.multiCore) {
        rowErrors.multiCore = 'Multi Core is required';
        locationMappingTableDataValid = false;
      }
      if (!row.LocationStatus) {
        rowErrors.LocationStatus = 'Location Status is required';
        locationMappingTableDataValid = false;
      }
      // if (!row.vasBinSeq) {
      //   rowErrors.vasBinSeq = 'Bin Seq is required';
      //   locationMappingTableDataValid = false;
      // }

      return rowErrors;
    });
    setFieldErrors(errors);
    setLocationMappingTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && locationMappingTableDataValid) {
      setIsLoading(true);
      const locationMappingDetailsDTO = locationMappingTableData.map((row) => ({
        bin: row.palletNo,
        binCategory: 'ACTIVE',
        binSeq: row.vasBinSeq,
        binStatus: row.LocationStatus,
        core: row.multiCore,
        levelNo: row.levelNo,
        rowNo: row.rowNo
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        binType: formData.locationType,
        branch: formData.branch,
        branchCode: loginBranchCode,
        client: loginClient,
        clientType: formData.clientType,
        customer: loginCustomer,
        createdBy: loginUserName,
        levelNo: formData.levelNo,
        locationMappingDetailsDTO,
        orgId: orgId,
        rowNo: formData.rowNo,
        warehouse: formData.warehouse
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateLocationMapping`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          getAllLocationMapping();
          showToast('success', editId ? ' LocationMapping Updated Successfully' : 'LocationMapping created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'LocationMapping creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'LocationMapping creation failed');
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
      locationType: '',
      clientType: '',
      rowNo: '',
      levelNo: '',
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
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getLocationmappingid} />
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
                  value={loginBranch}
                  onChange={handleInputChange}
                  error={!!fieldErrors.branch}
                  helperText={fieldErrors.branch}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.warehouse}>
                  <InputLabel id="warehouse-label">Warehouse</InputLabel>
                  <Select
                    labelId="warehouse-label"
                    id="warehouse"
                    name="warehouse"
                    label="Warehouse"
                    value={loginWarehouse}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={loginWarehouse}>{loginWarehouse}</MenuItem>
                    {/* {warehouseList?.map((row, index) => (
                      <MenuItem key={index} value={row.Warehouse.toUpperCase()}>
                        {row.Warehouse.toUpperCase()}
                      </MenuItem>
                    ))} */}
                  </Select>
                  {fieldErrors.warehouse && <FormHelperText error>{fieldErrors.warehouse}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.locationType}>
                  <InputLabel id="locationType-label">Location Type</InputLabel>
                  <Select
                    labelId="locationType-label"
                    id="locationType"
                    name="locationType"
                    label="Location Type"
                    value={formData.locationType}
                    onChange={handleInputChange}
                  >
                    {locationTypeList?.map((row) => (
                      <MenuItem key={row.id} value={row.ltype.toUpperCase()}>
                        {row.ltype.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.locationType && <FormHelperText error>{fieldErrors.locationType}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.rowNo}>
                  <InputLabel id="rowNo-label">Row No</InputLabel>
                  <Select labelId="rowNo-label" id="rowNo" name="rowNo" label="Row No" value={formData.rowNo} onChange={handleInputChange}>
                    {rowNoList?.map((row) => (
                      <MenuItem key={row.id} value={row.rowno.toUpperCase()}>
                        {row.rowno.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.rowNo && <FormHelperText error>{fieldErrors.rowNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.levelNo}>
                  <InputLabel id="levelNo-label">Level No</InputLabel>
                  <Select
                    labelId="levelNo-label"
                    id="levelNo"
                    name="levelNo"
                    label="Level No"
                    value={formData.levelNo}
                    onChange={handleInputChange}
                  >
                    {levelNoList?.map((row) => (
                      <MenuItem key={row.id} value={row.level.toUpperCase()}>
                        {row.level.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.levelNo && <FormHelperText error>{fieldErrors.levelNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Client"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="client"
                  value={loginClient}
                  onChange={handleInputChange}
                  error={!!fieldErrors.client}
                  helperText={fieldErrors.client}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.clientType}>
                  <InputLabel id="clientType-label">Client Type</InputLabel>
                  <Select
                    labelId="clientType-label"
                    id="clientType"
                    name="clientType"
                    label="client Type"
                    value={formData.clientType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Fixed">FIXED</MenuItem>
                    <MenuItem value="Open">OPEN</MenuItem>
                  </Select>
                  {fieldErrors.clientType && <FormHelperText error>{fieldErrors.clientType}</FormHelperText>}
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
                  <Tab value={0} label="Location Details" />
                </Tabs>
              </Box>
              {/* <Box className="mt-4"> */}
              <Box className="mt-2" sx={{ padding: 1 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        <ActionButton
                          title="Fill Grid"
                          icon={GridOnIcon}
                          onClick={getAllbinsByCompanyAndWarehouseAndLocationTypeAndRownoAndLevel}
                        />
                        <ActionButton title="Clear" icon={ClearIcon} onClick={() => handleTableClear('locationMappingTableData')} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
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
                                  <th className="px-2 py-2 text-white text-center">Row No</th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 130 }}>
                                    Level No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: 130 }}>
                                    Bin
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Multi Core</th>
                                  <th className="px-2 py-2 text-white text-center">Bin Status</th>
                                  <th className="px-2 py-2 text-white text-center">Bin Seq</th>
                                </tr>
                              </thead>
                              <tbody>
                                {locationMappingTableData.map((row, index) => (
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
                                        value={row.rowNo}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocationMappingTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, rowNo: value } : r))
                                          );
                                          setLocationMappingTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], rowNo: !value ? 'Row No is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={locationMappingTableErrors[index]?.rowNo ? 'error form-control' : 'form-control'}
                                      />
                                      {locationMappingTableErrors[index]?.rowNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {locationMappingTableErrors[index].rowNo}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.levelNo}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocationMappingTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, levelNo: value } : r))
                                          );
                                          setLocationMappingTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], levelNo: !value ? 'Level No is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={locationMappingTableErrors[index]?.levelNo ? 'error form-control' : 'form-control'}
                                      />
                                      {locationMappingTableErrors[index]?.levelNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {locationMappingTableErrors[index].levelNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.palletNo}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocationMappingTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, palletNo: value } : r))
                                          );
                                          setLocationMappingTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], palletNo: !value ? 'Bin is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={locationMappingTableErrors[index]?.palletNo ? 'error form-control' : 'form-control'}
                                      />
                                      {locationMappingTableErrors[index]?.palletNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {locationMappingTableErrors[index].palletNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.multiCore}
                                        className={locationMappingTableErrors[index]?.multiCore ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                    </td>

                                    {/* <td className="border px-2 py-2">
                                      <select
                                        value={row.multiCore}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocationMappingTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, multiCore: value } : r))
                                          );
                                          setLocationMappingTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              multiCore: !value ? 'Multi Core is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={locationMappingTableErrors[index]?.multiCore ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">--Select--</option>
                                        <option value="Single">Single</option>
                                        <option value="Multi">Multi</option>
                                      </select>
                                      {locationMappingTableErrors[index]?.multiCore && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {locationMappingTableErrors[index].multiCore}
                                        </div>
                                      )}
                                    </td> */}

                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.LocationStatus}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocationMappingTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, LocationStatus: value } : r))
                                          );
                                          setLocationMappingTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              LocationStatus: !value ? 'Bin Status is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, row)}
                                        className={
                                          locationMappingTableErrors[index]?.LocationStatus ? 'error form-control' : 'form-control'
                                        }
                                      >
                                        <option value="">--Select--</option>
                                        <option value="Replace">Replace</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Way">Way</option>
                                        <option value="Unused">Unused</option>
                                      </select>
                                      {locationMappingTableErrors[index]?.LocationStatus && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {locationMappingTableErrors[index].LocationStatus}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.vasBinSeq}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocationMappingTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, vasBinSeq: value } : r))
                                          );
                                          setLocationMappingTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], vasBinSeq: !value ? 'BinSeq is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={locationMappingTableErrors[index]?.vasBinSeq ? 'error form-control' : 'form-control'}
                                      />
                                      {locationMappingTableErrors[index]?.vasBinSeq && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {locationMappingTableErrors[index].vasBinSeq}
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
              </Box>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default LocationMappingMaster;
