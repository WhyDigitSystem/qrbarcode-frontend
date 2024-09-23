import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { getAllActiveBranches, getAllActiveEmployees } from 'utils/CommonFunctions';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { decryptPassword, encryptPassword } from 'views/utilities/encryptPassword';

export const UserCreationMaster = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeCode: '',
    userType: '',
    mobileNo: '',
    nickName: '',
    email: '',
    password: 'Wds@2022',
    active: true,
    orgId: 1
  });
  const [value, setValue] = useState(0);
  const [branchTableData, setBranchTableData] = useState([
    {
      id: 1,
      branchCode: '',
      branch: ''
    }
  ]);
  const [roleTableData, setRoleTableData] = useState([{ id: 1, role: '', roleId: '', startDate: null, endDate: null }]);
  const [clientTableData, setClientTableData] = useState([{ id: 1, customer: '', rowClientList: [], client: '' }]);

  const [roleTableDataErrors, setRoleTableDataErrors] = useState([
    {
      role: '',
      roleId: '',
      startDate: '',
      endDate: ''
    }
  ]);
  const [branchTableErrors, setBranchTableErrors] = useState([
    {
      branchCode: '',
      branch: ''
    }
  ]);
  const [clientTableErrors, setClientTableErrors] = useState([
    {
      customer: '',
      client: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    employeeName: '',
    employeeCode: '',
    userType: '',
    mobileNo: '',
    nickName: '',
    email: '',
    active: '',
    password: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'employeeName', header: 'Employee', size: 140 },
    { accessorKey: 'userName', header: 'Emp Code', size: 140 },
    { accessorKey: 'userType', header: 'User Type', size: 140 },
    { accessorKey: 'email', header: 'Email', size: 140 },
    {
      accessorKey: 'roleAccessVO',
      header: 'Roles',
      Cell: ({ cell }) => {
        const roles = cell
          .getValue()
          .map((role) => role.role)
          .join(', ');
        return roles;
      }
    },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];
  const [listViewData, setListViewData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [clientList, setClientList] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    getAllEmployees();
    getAllRoles();
    getAllBranches();
    getAllUsers();
    getAllCustomers();
    console.log('THE ROLES ARE FROM THE USEEFFECT IS:', roleList);
  }, []);

  const getAllEmployees = async () => {
    try {
      const empData = await getAllActiveEmployees(orgId);
      console.log('THE EMPDATA IS:', empData);

      setEmployeeList(empData);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getAllRoles = async () => {
    try {
      const response = await apiCalls('get', `auth/allActiveRolesByOrgId?orgId=${orgId}`);
      console.log('ROLE API Response:', response);

      if (response.status === true) {
        console.log('THE GETALL ROLES:', response);

        setRoleList(response.paramObjectsMap.rolesVO);
        console.log('THE ROLESVO ARE:', response.paramObjectsMap.rolesVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
        setCustomerList(response.paramObjectsMap.CustomerVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllClientsByCustomer = async (customer, row) => {
    try {
      const response = await apiCalls('get', `warehousemastercontroller/client?customer=${customer}&orgid=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        // setClientList(response.paramObjectsMap.clientVO);
        setClientTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowClientList: response.paramObjectsMap.clientVO
                }
              : r
          )
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await apiCalls('get', `auth/allUsersByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.userVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUserById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `auth/getUserById?userId=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularUser = response.paramObjectsMap.userVO;
        const foundBranch1 = branchList.find((branch) => branch.branchCode === particularUser.branchAccessibleVO.branchcode);
        console.log('THE FOUND BRANCH 1 IS:', foundBranch1);

        setFormData({
          employeeCode: particularUser.userName,
          employeeName: particularUser.employeeName,
          nickName: particularUser.nickName,
          userType: particularUser.userType,
          mobileNo: particularUser.mobileNo,
          email: particularUser.email,
          // password: decryptPassword(particularUser.password),
          // password: particularUser.password,

          active: particularUser.active === 'Active' ? true : false
        });
        setRoleTableData(
          particularUser.roleAccessVO.map((role) => ({
            id: role.id,
            role: role.role,
            roleId: role.roleId,
            startDate: role.startDate,
            endDate: role.endDate
          }))
        );
        setClientTableData(
          particularUser.clientAccessVO.map((role) => ({
            id: role.id,
            client: role.client,
            customer: role.customer
          }))
        );

        const alreadySelectedBranch = particularUser.branchAccessibleVO.map((role) => {
          const foundBranch = branchList.find((branch) => branch.branchCode === role.branchcode);
          console.log(`Searching for branch with code ${role.branchcode}:`, foundBranch);
          return {
            id: role.id,
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

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   const nameRegex = /^[A-Za-z ]*$/;
  //   const alphaNumericRegex = /^[A-Za-z0-9]*$/;
  //   const numericRegex = /^[0-9]*$/;
  //   const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
  //   const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation

  //   let errorMessage = '';

  //   // Validation based on field name
  //   switch (name) {
  //     case 'mobileNo':
  //       if (!numericRegex.test(value)) {
  //         errorMessage = 'Only numeric characters are allowed';
  //       } else if (value.length > 10) {
  //         errorMessage = 'Invalid Format';
  //       }
  //       break;

  //     case 'nickName':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only alphabet are allowed';
  //       }
  //       break;
  //   }

  //   // Update field errors and form data
  //   if (errorMessage) {
  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  //   } else {
  //     if (name === 'employeeName') {
  //       const selectedEmp = employeeList.find((emp) => emp.employeeName === value);
  //       if (selectedEmp) {
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           employeeName: selectedEmp.employeeName,
  //           employeeCode: selectedEmp.employeeCode
  //         }));
  //       }
  //     }

  //     // Convert to uppercase if not the email field
  //     // const updatedValue = name === 'email' ? value : value.toUpperCase();
  //     const updatedValue = name === 'email' ? value.toLowerCase() : value.toUpperCase();
  //     setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));

  //     setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;

    const nameRegex = /^[A-Za-z ]*$/;
    const numericRegex = /^[0-9]*$/;

    let errorMessage = '';
    let transformedValue = value;

    // Validation based on field name
    switch (name) {
      case 'mobileNo':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;

      case 'nickName':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabets are allowed';
        }
        break;
    }

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'employeeName') {
        const selectedEmp = employeeList.find((emp) => emp.employeeName === value);
        if (selectedEmp) {
          setFormData((prevData) => ({
            ...prevData,
            employeeName: selectedEmp.employeeName,
            employeeCode: selectedEmp.employeeCode
          }));
        }
      }

      // Transform value: uppercase for all except email (which should be lowercase)
      transformedValue = name === 'email' ? value.toLowerCase() : value.toUpperCase();

      // Update form data with the transformed value
      setFormData((prevData) => ({ ...prevData, [name]: transformedValue }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

      // Calculate cursor position adjustment due to transformation
      const cursorOffset = transformedValue.length - value.length;

      setTimeout(() => {
        if (e.target.setSelectionRange) {
          // Adjust cursor position after transformation
          e.target.setSelectionRange(selectionStart + cursorOffset, selectionEnd + cursorOffset);
        }
      }, 0);
    }
  };

  const handleActiveChange = (event) => {
    setFormData({
      ...formData,
      active: event.target.checked
    });
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        if (table === roleTableData) handleAddRow();
        else if (table === branchTableData) handleAddRow1();
        else handleAddRow2();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(roleTableData)) {
      displayRowError(roleTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      role: '',
      roleId: '',
      startDate: '',
      endDate: ''
    };
    setRoleTableData([...roleTableData, newRow]);
    setRoleTableDataErrors([...roleTableDataErrors, { role: '', roleId: '', startDate: '', endDate: '' }]);
  };

  const handleAddRow1 = () => {
    if (isLastRowEmpty(branchTableData)) {
      displayRowError(branchTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      branchCode: '',
      branch: ''
    };
    setBranchTableData([...branchTableData, newRow]);
    setBranchTableErrors([
      ...branchTableErrors,
      {
        branchCode: ''
      }
    ]);
  };

  const handleAddRow2 = () => {
    if (isLastRowEmpty(clientTableData)) {
      displayRowError(clientTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      customer: '',
      rowClientList: [],
      client: ''
    };
    setClientTableData([...clientTableData, newRow]);
    setClientTableErrors([
      ...clientTableErrors,
      {
        customer: '',
        rowClientList: '',
        client: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === roleTableData) {
      return !lastRow.role || !lastRow.startDate;
    } else if (table === branchTableData) {
      return !lastRow.branchCode;
    } else if (table === clientTableData) {
      return !lastRow.customer || !lastRow.client;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === roleTableData) {
      setRoleTableDataErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          role: !table[table.length - 1].role ? 'Role is required' : '',
          startDate: !table[table.length - 1].startDate ? 'Start Date is required' : ''
        };
        return newErrors;
      });
    }
    if (table === branchTableData) {
      setBranchTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          branchCode: !table[table.length - 1].branchCode ? 'Branch Code is required' : ''
        };
        return newErrors;
      });
    }
    if (table === clientTableData) {
      setClientTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          customer: !table[table.length - 1].customer ? 'Customer is required' : '',
          client: !table[table.length - 1].client ? 'Client is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  // const getAvailableClients = (currentRowId) => {
  //   const selectedClients = clientTableData.filter((row) => row.id !== currentRowId).map((row) => row.client);
  //   return clientList.filter((role) => !selectedClients.includes(role.client));
  // };
  const getAvailableRoles = (currentRowId) => {
    const selectedRoles = roleTableData.filter((row) => row.id !== currentRowId).map((row) => row.role);
    return roleList.filter((role) => !selectedRoles.includes(role.role));
  };

  const handleRoleChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setRoleTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setRoleTableDataErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
  };

  const getAvailableBranchCodes = (currentRowId) => {
    const selectedBranchCodes = branchTableData.filter((row) => row.id !== currentRowId).map((row) => row.branchCode);
    return branchList.filter((branch) => !selectedBranchCodes.includes(branch.branchCode));
  };

  const handleBranchCodeChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBranch = branchList.find((branch) => branch.branchCode === value);
    setBranchTableData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, branchCode: value, branch: selectedBranch ? selectedBranch.branch : '' } : r))
    );
    setBranchTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        branchCode: !value ? 'Branch Code is required' : ''
      };
      return newErrors;
    });
  };
  // const handleCustomerChange = (row, index, event) => {
  //   const value = event.target.value;
  //   // const selectedCustomer = customerList.find((branch) => branch.branchCode === value);
  //   setClientTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, customer: value } : r)));
  //   setClientTableErrors((prev) => {
  //     const newErrors = [...prev];
  //     newErrors[index] = {
  //       ...newErrors[index],
  //       customer: !value ? 'Customer is required' : ''
  //     };
  //     return newErrors;
  //   });
  // };

  const handleClear = () => {
    setFormData({
      employeeName: '',
      employeeCode: '',
      reportingTo: '',
      userType: '',
      mobileNo: '',
      nickName: '',
      email: '',
      groupNo: '',
      pwdExpDays: '',
      active: '',
      isFirstTime: '',
      // password: '',
      active: true,
      isFirstTime: true
    });
    setRoleTableData([{ id: 1, role: '', roleId: '', startDate: '', endDate: '' }]);
    setBranchTableData([{ id: 1, branchCode: '', branchName: '' }]);
    setClientTableData([{ id: 1, customer: '', client: '' }]);
    setFieldErrors({
      employeeName: '',
      employeeCode: '',
      reportingTo: '',
      userType: '',
      mobileNo: '',
      nickName: '',
      email: '',
      groupNo: '',
      pwdExpDays: '',
      password: ''
    });
    setRoleTableDataErrors('');
    setBranchTableErrors('');
    setClientTableErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('handle save is working');

    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid MailID Format';
    }
    if (!formData.employeeName) {
      errors.employeeName = 'Employee Name is required';
    }
    if (!formData.nickName) {
      errors.nickName = 'Nick Name is required';
    }
    if (!formData.userType) {
      errors.userType = 'User Type is required';
    }
    if (!formData.mobileNo) {
      errors.mobileNo = 'Mobile No is required';
    } else if (formData.mobileNo.length < 10) {
      errors.mobileNo = ' Mobile No must be in 10 digit';
    }

    if (!formData.email) {
      errors.email = 'Email ID is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid MailID Format';
    }

    let roleTableDataValid = true;
    const newTableErrors = roleTableData.map((row) => {
      const rowErrors = {};
      if (!row.role) {
        rowErrors.role = 'Role is required';
        roleTableDataValid = false;
      }
      if (!row.startDate) {
        rowErrors.startDate = 'Start Date is required';
        roleTableDataValid = false;
      }
      if (!row.endDate) {
        rowErrors.endDate = 'End Date is required';
        roleTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setRoleTableDataErrors(newTableErrors);

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

    let clientTableDataValid = true;
    const newTableErrors2 = clientTableData.map((row) => {
      const rowErrors = {};
      if (!row.customer) {
        rowErrors.customer = 'Customer is required';
        clientTableDataValid = false;
      }
      if (!row.client) {
        rowErrors.client = 'Client is required';
        clientTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    setClientTableErrors(newTableErrors2);

    if (Object.keys(errors).length === 0 && roleTableDataValid && branchTableDataValid && clientTableDataValid) {
      setIsLoading(true);
      const roleVo = roleTableData.map((row) => ({
        ...(editId && { id: row.id }),
        role: row.role,
        roleId: row.roleId,
        startDate: dayjs(row.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(row.endDate).format('YYYY-MM-DD')
      }));
      const branchVo = branchTableData.map((row) => ({
        ...(editId && { id: row.id }),
        branchCode: row.branchCode,
        branch: row.branch
      }));
      const clientVo = clientTableData.map((row) => ({
        ...(editId && { id: row.id }),
        customer: row.customer,
        client: row.client
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        employeeName: formData.employeeName,
        userType: formData.userType,
        email: formData.email,
        password: encryptPassword(formData.password),
        mobileNo: formData.mobileNo,
        nickName: formData.nickName,
        userName: formData.employeeCode,

        roleAccessDTO: roleVo,
        clientAccessDTOList: clientVo,
        branchAccessDTOList: branchVo,
        active: formData.active,
        orgId: orgId
        // createdby: loginUserName
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `auth/signup`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'User Updated Successfully' : 'User created successfully');
          handleClear();
          getAllUsers();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'User creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'User creation failed');
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
      employeeName: '',
      employeeCode: '',
      reportingTo: '',
      userType: '',
      mobileNo: '',
      nickName: '',
      email: '',
      groupNo: '',
      pwdExpDays: '',
      password: '',
      active: true,
      isFirstTime: true
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
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getUserById} />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.employeeName}>
                  <InputLabel id="employeeName-label">Employee Name</InputLabel>
                  <Select
                    labelId="employeeName-label"
                    label="EmployeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    name="employeeName"
                  >
                    {employeeList.length > 0 &&
                      employeeList.map((row) => (
                        <MenuItem key={row.id} value={row.employeeName}>
                          {row.employeeName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.employeeName && <FormHelperText>{fieldErrors.employeeName}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="EmployeeCode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  error={!!fieldErrors.employeeCode}
                  helperText={fieldErrors.employeeCode}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Nick Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="nickName"
                  value={formData.nickName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.nickName}
                  helperText={fieldErrors.nickName}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.userType}>
                  <InputLabel id="userType-label">User Type</InputLabel>
                  <Select labelId="userType-label" label="userType" value={formData.userType} onChange={handleInputChange} name="userType">
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="USER">USER</MenuItem>
                  </Select>
                  {fieldErrors.userType && <FormHelperText>{fieldErrors.userType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Mobile"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.mobileNo}
                  helperText={fieldErrors.mobileNo}
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
              {/* <div className="col-md-3 mb-3">
                <TextField
                  label="Password"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                />
              </div> */}

              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleActiveChange} name="active" color="primary" />}
                  label="Active"
                />
              </div>
            </div>
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Roles" />
                  <Tab value={1} label="Branch Accessible" />
                  <Tab value={2} label="Client Access" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-9">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '250px' }}>
                                    Role
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Start Date
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    End Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {roleTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            roleTableData,
                                            setRoleTableData,
                                            roleTableDataErrors,
                                            setRoleTableDataErrors
                                          )
                                        }
                                        // id, table, setTable, errorTable, setErrorTable
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.role}
                                        onChange={(e) => handleRoleChange(row, index, e)}
                                        className={roleTableDataErrors[index]?.role ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {getAvailableRoles(row.id).map((role) => (
                                          <option key={role.id} value={role.role}>
                                            {role.role}
                                          </option>
                                        ))}
                                      </select>
                                      {roleTableDataErrors[index]?.role && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {roleTableDataErrors[index].role}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <div className="w-100">
                                        <DatePicker
                                          selected={row.startDate}
                                          className={roleTableDataErrors[index]?.startDate ? 'error form-control' : 'form-control'}
                                          onChange={(date) => {
                                            setRoleTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, startDate: date, endDate: date > r.endDate ? null : r.endDate }
                                                  : r
                                              )
                                            );
                                            setRoleTableDataErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                startDate: !date ? 'Start Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          dateFormat="dd-MM-yyyy"
                                          minDate={new Date()}
                                          onKeyDown={(e) => handleKeyDown(e, row, roleTableData)}
                                        />
                                        {roleTableDataErrors[index]?.startDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {roleTableDataErrors[index].startDate}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <DatePicker
                                        selected={row.endDate}
                                        className={roleTableDataErrors[index]?.endDate ? 'error form-control' : 'form-control'}
                                        onChange={(date) => {
                                          setRoleTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, endDate: date } : r)));
                                          setRoleTableDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              endDate: !date ? 'End Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        dateFormat="dd-MM-yyyy"
                                        minDate={row.startDate || new Date()}
                                        disabled={!row.startDate}
                                      />
                                      {roleTableDataErrors[index]?.endDate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {roleTableDataErrors[index].endDate}
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
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            branchTableData,
                                            setBranchTableData,
                                            branchTableErrors,
                                            setBranchTableErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.branchCode}
                                        onChange={(e) => handleBranchCodeChange(row, index, e)}
                                        onKeyDown={(e) => handleKeyDown(e, row, branchTableData)}
                                        className={branchTableErrors[index]?.branchCode ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select</option>
                                        {getAvailableBranchCodes(row.id).map((branch) => (
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
                {value === 2 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow2} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-6">
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
                                  <th className="px-2 py-2 text-white text-center">Customer</th>
                                  <th className="px-2 py-2 text-white text-center">Client</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clientTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            clientTableData,
                                            setClientTableData,
                                            clientTableErrors,
                                            setClientTableErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.customer}
                                        className={clientTableErrors[index]?.customer ? 'error form-control' : 'form-control'}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setClientTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, customer: value } : r)));
                                          getAllClientsByCustomer(value, row);
                                          setClientTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              customer: !value ? 'Customer is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                      >
                                        <option value="">--Select--</option>
                                        {customerList?.map((row) => (
                                          <option key={row.id} value={row.customerName}>
                                            {row.customerName}
                                          </option>
                                        ))}
                                      </select>
                                      {clientTableErrors[index]?.customer && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].customer}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <select
                                        value={row.client}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setClientTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, client: value } : r)));
                                          setClientTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              client: !value ? 'Client is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, row, clientTableData)}
                                        className={clientTableErrors[index]?.client ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {Array.isArray(row.rowClientList) &&
                                          row.rowClientList.map(
                                            (client, idx) =>
                                              client &&
                                              client.client && (
                                                <option key={client.client} value={client.client}>
                                                  {client.client}
                                                </option>
                                              )
                                          )}
                                      </select>
                                      {clientTableErrors[index]?.client && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {clientTableErrors[index].client}
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
export default UserCreationMaster;
