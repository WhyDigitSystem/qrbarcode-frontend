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
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';

export const CarrierMaster = () => {
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch] = useState(localStorage.getItem('branch'));
  const [branchCode] = useState(localStorage.getItem('branchcode'));
  const [customer] = useState(localStorage.getItem('customer'));
  const [client] = useState(localStorage.getItem('client'));
  const [warehouse] = useState(localStorage.getItem('warehouse'));

  const [formData, setFormData] = useState({
    carrier: '',
    carrierShortName: '',
    shipmentMode: '',
    cbranch: localStorage.getItem('branchcode'),
    active: true,
    branch: branch,
    branchCode: branchCode,
    warehouse: warehouse,
    customer: customer,
    client: client,
    orgId: orgId
  });
  const [value, setValue] = useState(0);
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [listViewData, setListViewData] = useState([]);

  const [fieldErrors, setFieldErrors] = useState({
    carrier: '',
    carrierShortName: '',
    shipmentMode: '',
    cbranch: ''
  });

  useEffect(() => {
    getAllCarrier();
  }, []);

  const getAllCarrier = async () => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/carrier?orgid=${orgId}&client=${client}&cbranch=${branchCode}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.carrierVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const listViewColumns = [
    { accessorKey: 'carrier', header: 'Carrier Name', size: 140 },
    { accessorKey: 'carrierShortName', header: 'Short Name', size: 140 },
    { accessorKey: 'shipmentMode', header: 'Shipment Mode', size: 140 },
    { accessorKey: 'cbranch', header: 'Control Branch', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const nameRegex = /^[A-Za-z ]*$/;
  //   const numericRegex = /^[0-9]*$/;
  //   const alphanumericRegex = /^[A-Za-z0-9]*$/;
  //   const specialCharsRegex = /^[A-Za-z0-9@_\-*]*$/;

  //   let errorMessage = '';

  //   switch (name) {
  //     case '  carrier':
  //     case 'carrierShortName':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only alphabetic characters are allowed';
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     const updatedValue = name === 'email' ? value : value.toUpperCase();
  //     setFormData({ ...formData, [name]: updatedValue });
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const numericRegex = /^[0-9]*$/;
    const alphanumericRegex = /^[A-Za-z0-9]*$/;
    const specialCharsRegex = /^[A-Za-z0-9@_\-*]*$/;

    let errorMessage = '';

    switch (name) {
      case 'carrier':
      case 'carrierShortName':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      const updatedValue = name === 'email' ? value : value.toUpperCase();
      setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
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
      carrier: '',
      carrierShortName: '',
      shipmentMode: '',
      cbranch: localStorage.getItem('branchcode'),
      active: true
    });

    setFieldErrors({
      carrier: '',
      carrierShortName: '',
      shipmentMode: '',
      cbranch: ''
    });
    setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.carrier) {
      errors.carrier = 'Carrier Name is required';
    }
    if (!formData.carrierShortName) {
      errors.carrierShortName = 'Short Name is required';
    }
    if (!formData.shipmentMode) {
      errors.shipmentMode = 'Shipment Mode is required';
    }
    if (!formData.cbranch) {
      errors.cbranch = 'Control Branch is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const saveFormData = {
        ...(editId && { id: editId }),
        carrier: formData.carrier,
        carrierShortName: formData.carrierShortName,
        shipmentMode: formData.shipmentMode,
        cbranch: formData.cbranch,
        branch: formData.branch,
        branchCode: formData.branchCode,
        warehouse: formData.warehouse,
        customer: formData.customer,
        active: formData.active,
        client: formData.client,
        orgId: orgId,
        createdBy: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `warehousemastercontroller/createUpdateCarrier`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Carrier Master Updated Successfully' : 'Carrier Master created successfully');
          handleClear();
          getAllCarrier();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Carrier Master creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Carrier Master creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
    getAllCarrier();
  };

  const getCarrierById = async (row) => {
    console.log('THE SELECTED CITY ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `warehousemastercontroller/carrier/${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCarrier = response.paramObjectsMap.Carrier;

        setFormData({
          carrier: particularCarrier.carrier,
          carrierShortName: particularCarrier.carrierShortName,
          shipmentMode: particularCarrier.shipmentMode,
          cbranch: particularCarrier.cbranch,
          active: particularCarrier.active === 'Active' ? true : false,
          id: particularCarrier.id,
          branch: particularCarrier.branch,
          branchCode: particularCarrier.branchCode,
          warehouse: particularCarrier.warehouse,
          customer: particularCarrier.customer,
          client: particularCarrier.client,
          orgId: orgId
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      carrier: '',
      carrierShortName: '',
      shipmentMode: '',
      cbranch: '',
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
            {/* <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} /> */}
            <CommonListViewTable columns={listViewColumns} blockEdit={true} data={listViewData} toEdit={getCarrierById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Carrier Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleInputChange}
                  error={!!fieldErrors.carrier}
                  helperText={fieldErrors.carrier}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Short Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="carrierShortName"
                  value={formData.carrierShortName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.carrierShortName}
                  helperText={fieldErrors.carrierShortName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.shipmentMode}>
                  <InputLabel id="shipmentMode-label">Shipment Mode</InputLabel>
                  <Select
                    labelId="shipmentMode-label"
                    id="shipmentMode-label"
                    name="shipmentMode"
                    label="Shipment Mode"
                    value={formData.shipmentMode}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="AIR">AIR</MenuItem>
                    <MenuItem value="SEA">SEA</MenuItem>
                    <MenuItem value="ROAD">ROAD</MenuItem>
                  </Select>
                  {fieldErrors.shipmentMode && <FormHelperText error>{fieldErrors.shipmentMode}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.cbranch}>
                  <InputLabel id="controlBranch-label">Control Branch</InputLabel>
                  <Select
                    labelId="controlBranch-label"
                    id="cbranch"
                    name="cbranch"
                    label="Control Branch"
                    value={formData.cbranch}
                    onChange={handleInputChange}
                  >
                    {loginBranchCode && <MenuItem value={loginBranchCode}>{loginBranchCode}</MenuItem>}
                    <MenuItem value="ALL">ALL</MenuItem>
                  </Select>
                  {fieldErrors.cbranch && <FormHelperText error>{fieldErrors.cbranch}</FormHelperText>}
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

            {/* <div className="row ">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Carrier Details" />
                </Tabs>
              </Box>
      
              <Box className="mt-2" sx={{ padding: 1 }}>
                {value === 0 && (
                  <>
                    <div className="">
                      <div className="d-flex justify-content-start">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        <ActionButton title="Fill Grid" icon={GridOnIcon} />
                        <ActionButton title="Clear" icon={ClearIcon} />
                      </div>
                      <div className="mt-3">
                     
                        <div style={{ overflowX: 'auto' }}>
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                  Action
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                  S.No
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Address Type
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Address
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  City
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  State
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Zip Code
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Country
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Contact
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Phone
                                </th>
                                <th className="px-2 py-2 text-white text-center" style={{ width: '300px' }}>
                                  Email
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {carrierDetailsData.map((row, index) => (
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
                                      value={row.addressType}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressType: value } : r))
                                        );
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressType: !value ? 'Address Type is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.addressType ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.addressType && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].addressType}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.address}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, address: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], address: !value ? 'Address is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.address ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.address && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].address}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.city}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, city: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            city: !value ? 'City is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.city ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">Select Option</option>
                                      <option value="Bengaluru">Bengaluru</option>
                                      <option value="Chennai">Chennai</option>
                                    </select>
                                    {carrierDetailTableErrors[index]?.city && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].city}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.state}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, state: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], state: !value ? 'State is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].state}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.zipCode}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, zipCode: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], zipCode: !value ? 'Zip Code is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.zipCode ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.zipCode && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].zipCode}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.country}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, country: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], country: !value ? 'Country is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.country ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.country && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].country}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contact}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, contact: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], contact: !value ? 'Contact is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.contact ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.contact && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].contact}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.phone}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, phone: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], phone: !value ? 'Phone is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.phone ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.phone && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].phone}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.email}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setCarrierDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, email: value } : r)));
                                        setCarrierDetailTableErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], email: !value ? 'Email is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={carrierDetailTableErrors[index]?.email ? 'error form-control' : 'form-control'}
                                    />
                                    {carrierDetailTableErrors[index]?.email && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {carrierDetailTableErrors[index].email}
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
                  </>
                )}
              </Box>
            </div> */}
          </>
        )}
      </div>
      <ToastComponent />
    </>
  );
};

export default CarrierMaster;
