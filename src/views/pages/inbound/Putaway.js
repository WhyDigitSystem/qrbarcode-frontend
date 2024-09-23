import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { initCaps } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import GeneratePdfTemp from './PutawayPdf';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import sampleFile from '../../../assets/sample-files/sample_Putaway.xls';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Putaway = () => {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [locationTypeList, setLocationTypeList] = useState([]);
  const [grnList, setGrnList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginFinYear, setLoginFinYear] = useState(localStorage.getItem('finYear'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginUserId, setLoginUserId] = useState(localStorage.getItem('userId'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [checkedState, setCheckedState] = useState({});
  const [checkAll, setCheckAll] = useState(false);

  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    binClass: 'Fixed',
    binPick: 'Empty',
    binType: '',
    branch: loginBranch,
    branchCode: loginBranchCode,
    briefDesc: '',
    carrier: '',
    client: loginClient,
    contact: '',
    core: 'Multi',
    createdBy: loginUserName,
    customer: loginCustomer,
    docId: '',
    docDate: dayjs(),
    enteredPerson: '',
    driverName: '',
    entryNo: '',
    entryDate: null,
    finYear: loginFinYear,
    grnDate: null,
    grnNo: '',
    lotNo: '',
    modeOfShipment: '',
    orgId: orgId,
    status: 'Edit',
    securityName: '',
    supplier: '',
    supplierShortName: '',
    totalGrnQty: '',
    vehicleType: '',
    vehicleNo: '',
    warehouse: loginWarehouse,
    freeze: false
  });

  const [putAwayDetailsTableData, setPutAwayDetailsTableData] = useState([
    {
      batchNo: '',
      recQty: '',
      binType: '',
      cellType: 'ACTIVE',
      noOfBins: '',
      bin: '',
      batchDate: '',
      expDate: '',
      partDesc: '',
      shortQty: '',
      grnQty: '',
      damageQty: '',
      pQty: '',
      invQty: '',
      sku: '',
      ssku: '',
      partNo: ''
    }
  ]);

  // const lrNoDetailsRefs = useRef(
  //   putAwayDetailsTableData.map(() => ({
  //     sku: React.createRef(),
  //     bin: React.createRef()
  //   }))
  // );
  // useEffect(() => {
  //   // If the length of the table changes, update the refs
  //   if (lrNoDetailsRefs.current.length !== putAwayDetailsTableData.length) {
  //     lrNoDetailsRefs.current = putAwayDetailsTableData.map(
  //       (_, index) =>
  //         lrNoDetailsRefs.current[index] || {
  //           sku: React.createRef(),
  //           bin: React.createRef()
  //         }
  //     );
  //   }
  // }, [putAwayDetailsTableData.length]);

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = putAwayDetailsTableData.map((_, index) => ({
      sku: lrNoDetailsRefs.current[index]?.sku || React.createRef(),
      bin: lrNoDetailsRefs.current[index]?.bin || React.createRef()
    }));
  }, [putAwayDetailsTableData]);

  const [gridDetailsTableData, setGridDetailsTableData] = useState([
    // {
    //   batchNo: '',
    //   recQty: '',
    //   binType: '',
    //   cellType: 'ACTIVE',
    //   noOfBins: '',
    //   bin: '',
    //   batchDate: '',
    //   expDate: '',
    //   partDesc: '',
    //   shortQty: '',
    //   grnQty: '',
    //   damageQty: '',
    //   pQty: '',
    //   invQty: '',
    //   sku: '',
    //   ssku: '',
    //   partNo: ''
    // }
  ]);
  const [putAwayTableErrors, setPutAwayTableErrors] = useState([
    {
      batch: '',
      bin: '',
      binType: '',
      cellType: '',
      grnQty: '',
      invNo: '',
      invQty: '',
      partDesc: '',
      partNo: '',
      putAwayQty: '',
      recQty: '',
      remarks: '',
      sku: '',
      ssku: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    binClass: '',
    binPick: '',
    binType: '',
    branch: loginBranch,
    branchCode: loginBranchCode,
    carrier: '',
    client: loginClient,
    core: '',
    createdBy: loginUserName,
    customer: loginCustomer,
    enteredPerson: '',
    entryNo: '',
    entryDate: null,
    finYear: '',
    grnDate: null,
    grnNo: '',
    lotNo: '',
    modeOfShipment: '',
    orgId: orgId,
    status: '',
    supplier: '',
    supplierShortName: '',
    warehouse: loginWarehouse,
    docDate: new Date()
  });
  const listViewColumns = [
    { accessorKey: 'status', header: 'Status', size: 140 },
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'grnNo', header: 'GRN No', size: 140 },
    { accessorKey: 'grnDate', header: 'GRN Date', size: 140 },
    { accessorKey: 'entryNo', header: 'Entry No', size: 140 },
    { accessorKey: 'entryDate', header: 'Entry Date', size: 140 },
    { accessorKey: 'totalGrnQty', header: 'Total Grn Qty', size: 140 },
    { accessorKey: 'totalPutawayQty', header: 'Total Putaway Qty', size: 140 }
    // { accessorKey: 'customer', header: 'Customer', size: 140 },
    // { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    // { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
    // { accessorKey: 'refDate', header: 'Ship To', size: 140 },
    // { accessorKey: 'reMarks', header: 'Remarks', size: 140 }
  ];

  useEffect(() => {
    getPutAwayDocId();
    getAllPutAway();
    getGrnForPutaway();
    getAllLocationTypes();
  }, []);

  useEffect(() => {
    // const totalGrnQty = putAwayDetailsTableData.reduce((sum, row) => sum + (parseInt(row.grnQty, 10) || 0), 0);
    const totalPutawayQty = putAwayDetailsTableData.reduce((sum, row) => sum + (parseInt(row.pQty, 10) || 0), 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      // totalGrnQty: totalGrnQty,
      totalPutawayQty: totalPutawayQty
    }));
    // console.log('oq', formData.totalPutawayQty);
  }, [putAwayDetailsTableData]);

  useEffect(() => {
    const initialCheckedState = {};
    gridDetailsTableData.forEach((row) => {
      initialCheckedState[row.id] = false;
    });
    setCheckedState(initialCheckedState);
  }, [gridDetailsTableData]);

  const handleCheckboxChange = (id) => {
    setCheckedState((prevCheckedState) => ({
      ...prevCheckedState,
      [id]: !prevCheckedState[id]
    }));

    const allChecked = gridDetailsTableData.every((row) => checkedState[row.id] || row.id === id);
    setCheckAll(allChecked);
  };

  const handleCheckAllChange = () => {
    const updatedCheckAll = !checkAll;
    const newCheckedState = {};
    gridDetailsTableData.forEach((row) => {
      newCheckedState[row.id] = updatedCheckAll;
    });
    setCheckedState(newCheckedState);
    setCheckAll(updatedCheckAll);
  };

  const handlePutawayGrid = async () => {
    try {
      const response = await apiCalls(
        `get`,
        `warehousemastercontroller/getAllBinDetails?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );

      if (response.statusFlag === 'Ok' && response.status) {
        const bins = response.paramObjectsMap.Bins;

        const selectedRows = gridDetailsTableData.filter((row) => checkedState[row.id]);

        const updatedRows = selectedRows.map((row) => ({
          ...row,
          binOptions: bins.map((bin) => bin.bin)
        }));
        console.log('updatedRows', updatedRows);

        setPutAwayDetailsTableData(updatedRows);
      } else {
        console.error('Failed to fetch bin details:', response.paramObjectsMap.message);
      }
    } catch (error) {
      console.error('Error fetching bin details:', error);
    }

    handleCloseModal();
  };

  const getPutAwayDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `putaway/getPutAwayDocId?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setFormData((prevData) => ({
          ...prevData,
          docId: response.paramObjectsMap.PutAwayDocId
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getGrnForPutaway = async () => {
    try {
      const response = await apiCalls(
        'get',
        `putaway/getGrnForPutaway?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      setGrnList(response.paramObjectsMap.grnVO);
      console.log('grnVo', response.paramObjectsMap.grnVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleAddRow = () => {
    // if (isLastRowEmpty(putAwayDetailsTableData)) {
    //   displayRowError(putAwayDetailsTableData);
    //   return;
    // }
    const newRow = {
      id: Date.now(),
      batchNo: '',
      bin: '',
      binType: '',
      cellType: '',
      grnQty: '',
      invNo: '',
      invQty: '',
      partDesc: '',
      partNo: '',
      pQty: '',
      recQty: '',
      remarks: '',
      sku: '',
      ssku: ''
    };
    setPutAwayDetailsTableData([...putAwayDetailsTableData, newRow]);
    setPutAwayTableErrors([
      ...putAwayTableErrors,
      {
        batch: '',
        bin: '',
        binType: '',
        cellType: '',
        grnQty: 0,
        invNo: '',
        invQty: 0,
        partDesc: '',
        partNo: '',
        putAwayQty: 0,
        recQty: 0,
        remarks: '',
        sku: '',
        ssku: ''
      }
    ]);
  };

  // const handleFullGrid = () => {
  //   getPutawayGridDetails();
  // };
  const handleCloseModal = () => {
    setModalOpen(false);
    setCheckAll(false);
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

  const getPutawayGridDetails = async () => {
    const errors = {};
    if (!formData.grnNo) {
      errors.grnNo = 'Grn No is required';
    }
    if (!formData.binType) {
      errors.binType = 'Bin Type is required';
    }
    if (Object.keys(errors).length === 0) {
      setModalOpen(true);
      try {
        const response = await apiCalls(
          'get',
          `putaway/getPutawayGridDetails?binClass=${formData.binClass}&binPick=${formData.binPick}&binType=${formData.binType}&branchCode=${loginBranchCode}&client=${loginClient}&grnNo=${formData.grnNo}&orgId=${orgId}&warehouse=${loginWarehouse}`
        );
        console.log('THE GRN IDS GRID DETAILS IS:', response);
        if (response.status === true) {
          const gridDetails = response.paramObjectsMap.gridDetails;
          console.log('THE BIN DETAILS ARE:', gridDetails);

          setGridDetailsTableData(
            gridDetails.map((row) => ({
              id: row.id,
              batchNo: row.batchNo,
              recQty: row.recQty,
              invoiceNo: row.invoiceNo,
              batchNo: row.batchNo,
              binType: row.binType,
              noOfBins: row.noOfBins,
              bin: row.bin,
              remarks: row.remarks,
              batchDate: row.batchDate,
              expDate: row.expDate,
              partDesc: row.partDesc,
              shortQty: row.shortQty,
              grnQty: row.grnQty,
              damageQty: row.damageQty,
              pQty: row.pQty,
              invQty: row.invQty,
              sku: row.sku,
              ssku: row.ssku,
              partNo: row.partNo
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getAllPutAway = async () => {
    try {
      const response = await apiCalls(
        'get',
        `putaway/getAllPutAway?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.PutAwayVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPutAwayById = async (row) => {
    console.log('THE SELECTED PUTAWAY ID IS:', row);
    setEditId(row.original.id);

    try {
      const response = await apiCalls('get', `putaway/getPutAwayById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularPutaway = response.paramObjectsMap.putAwayVO;
        console.log('THE PARTICULAR PUTAWAY IS:', particularPutaway);

        // Set the form data
        setFormData({
          docDate: particularPutaway.docDate,
          grnNo: particularPutaway.grnNo,
          docId: particularPutaway.docId,
          grnDate: particularPutaway.grnDate,
          entryNo: particularPutaway.entryNo,
          entryDate: particularPutaway.entryDate,
          core: particularPutaway.core,
          supplierShortName: particularPutaway.supplierShortName,
          supplier: particularPutaway.supplier,
          modeOfShipment: particularPutaway.modeOfShipment,
          carrier: particularPutaway.carrier,
          binType: particularPutaway.binType,
          contact: particularPutaway.contact,
          status: particularPutaway.status,
          // status: particularPutaway.status === 'Edit' ? 'EDIT' : 'CONFIRM' || 'Confirm' ? 'CONFIRM' : 'EDIT',
          lotNo: particularPutaway.lotNo,
          enteredPerson: particularPutaway.enteredPerson,
          binClass: particularPutaway.binClass,
          binPick: particularPutaway.binPick,
          totalGrnQty: particularPutaway.totalGrnQty,
          totalPutawayQty: particularPutaway.totalPutawayQty,
          screenName: particularPutaway.screenName,
          screenCode: particularPutaway.screenCode,
          orgId: particularPutaway.orgId,
          customer: particularPutaway.customer,
          client: particularPutaway.client,
          finYear: particularPutaway.finYear,
          vehicleType: particularPutaway.vehicleType,
          vehicleNo: particularPutaway.vehicleNo,
          driverName: particularPutaway.driverName,
          branch: particularPutaway.branch,
          branchCode: particularPutaway.branchCode,
          warehouse: particularPutaway.warehouse,
          freeze: particularPutaway.freeze
        });

        // Fetch bin details
        const binResponse = await apiCalls(
          'get',
          `warehousemastercontroller/getAllBinDetails?branchCode=${particularPutaway.branchCode}&client=${particularPutaway.client}&orgId=${particularPutaway.orgId}&warehouse=${particularPutaway.warehouse}`
        );

        if (binResponse.status === true) {
          const bins = binResponse.paramObjectsMap.Bins.map((bin) => bin.bin);

          // Update putaway details with bin options
          setPutAwayDetailsTableData(
            particularPutaway.putAwayDetailsVO.map((pa) => ({
              partNo: pa.partNo,
              batchNo: pa.batch,
              partDesc: pa.partDesc,
              sku: pa.sku,
              invoiceNo: pa.invoiceNo,
              invQty: pa.invQty,
              recQty: pa.recQty,
              pQty: pa.putAwayQty,
              bin: pa.bin,
              binOptions: bins, // Set bin options here
              remarks: pa.remarks,
              binType: pa.binType,
              shortQty: pa.shortQty,
              grnQty: pa.grnQty,
              binClass: pa.binClass,
              cellType: pa.cellType,
              batchDate: pa.batchDate,
              status: pa.status,
              expDate: pa.expDate,
              qcFlag: pa.qcFlag,
              ssku: pa.ssku,
              ssqty: pa.ssqty
            }))
          );
        } else {
          console.error('Error fetching bin details:', binResponse);
        }
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, checked } = e.target;

  //   let errorMessage = '';

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     if (name === 'grnNo') {
  //       const selectedId = grnList.find((id) => id.docId === value);
  //       const selectedPutawayId = selectedId.docId;
  //       if (selectedId) {
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           grnNo: selectedId.docId,
  //           grnDate: dayjs(selectedId.docDate).format('YYYY-MM-DD'),
  //           entryNo: selectedId.entryNo,
  //           entryDate: dayjs(selectedId.entryDate).format('YYYY-MM-DD'),
  //           gatePassDate: dayjs(selectedId.docDate).format('YYYY-MM-DD'),
  //           supplierShortName: selectedId.supplierShortName,
  //           supplier: selectedId.supplier,
  //           carrier: selectedId.carrier,
  //           modeOfShipment: selectedId.modeOfShipment.toUpperCase(),
  //           vehicleType: selectedId.vehicleType.toUpperCase(),
  //           contact: selectedId.contact,
  //           driverName: selectedId.driverName.toUpperCase(),
  //           securityName: selectedId.securityName.toUpperCase(),
  //           lrDate: dayjs(selectedId.lrDate).format('YYYY-MM-DD'),
  //           briefDesc: selectedId.goodsDescripition.toUpperCase(),
  //           vehicleNo: selectedId.vehicleNo,
  //           lotNo: selectedId.lotNo,
  //           totalGrnQty: selectedId.totalGrnQty
  //         }));
  //         // getPutawayGridDetails(selectedPutawayId);
  //       }
  //     } else if (name === 'binClass') {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: value
  //       }));
  //     } else if (name === 'binPick') {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: value
  //       }));
  //     } else if (name === 'status') {
  //       setFormData({ ...formData, [name]: value });
  //     } else {
  //       setFormData({ ...formData, [name]: value.toUpperCase() });
  //     }

  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      // Handle specific cases
      if (name === 'grnNo') {
        const selectedId = grnList.find((id) => id.docId === value);
        if (selectedId) {
          setFormData((prevData) => ({
            ...prevData,
            grnNo: selectedId.docId,
            grnDate: dayjs(selectedId.docDate).format('YYYY-MM-DD'),
            entryNo: selectedId.entryNo,
            entryDate: dayjs(selectedId.entryDate).format('YYYY-MM-DD'),
            gatePassDate: dayjs(selectedId.docDate).format('YYYY-MM-DD'),
            supplierShortName: selectedId.supplierShortName,
            supplier: selectedId.supplier,
            carrier: selectedId.carrier,
            modeOfShipment: selectedId.modeOfShipment.toUpperCase(),
            vehicleType: selectedId.vehicleType.toUpperCase(),
            contact: selectedId.contact,
            driverName: selectedId.driverName.toUpperCase(),
            securityName: selectedId.securityName.toUpperCase(),
            lrDate: dayjs(selectedId.lrDate).format('YYYY-MM-DD'),
            briefDesc: selectedId.goodsDescripition.toUpperCase(),
            vehicleNo: selectedId.vehicleNo,
            lotNo: selectedId.lotNo,
            totalGrnQty: selectedId.totalGrnQty
          }));
          // Optionally call other functions
          // getPutawayGridDetails(selectedPutawayId);
        }
      } else if (name === 'binClass' || name === 'binPick') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      } else if (name === 'status' || name === 'core') {
        setFormData({ ...formData, [name]: name === 'core' ? initCaps(value) : value });
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Restore cursor position after state update, only for inputs that support text selection
      setTimeout(() => {
        const inputElement = document.querySelector(`[name=${name}]`);
        if (
          inputElement &&
          (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA') &&
          (type === 'text' || type === 'password' || type === 'search' || type === 'tel' || type === 'url')
        ) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  const handleDeleteRow = (id) => {
    setPutAwayDetailsTableData(putAwayDetailsTableData.filter((row) => row.id !== id));
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === putAwayDetailsTableData) {
      return !lastRow.partNo || !lastRow.partDesc || !lastRow.batchNo || !lastRow.qty;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === putAwayDetailsTableData) {
      setPutAwayTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partDesc: !table[table.length - 1].partDesc ? 'Part Desc is required' : '',
          // batchNo: !table[table.length - 1].batchNo ? 'Batch No is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : ''
        };
        return newErrors;
      });
    }
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === putAwayDetailsTableData[putAwayDetailsTableData.length - 1].id) {
      handleAddRow();
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('DD-MM-YYYY');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      binClass: 'Fixed',
      binPick: 'Empty',
      binType: '',
      branch: loginBranch,
      branchCode: loginBranchCode,
      briefDesc: '',
      carrier: '',
      client: loginClient,
      contact: '',
      core: 'Multi',
      createdBy: loginUserName,
      customer: loginCustomer,
      docDate: dayjs(),
      enteredPerson: '',
      driverName: '',
      entryNo: '',
      entryDate: null,
      finYear: '2024',
      grnDate: null,
      grnNo: '',
      lotNo: '',
      modeOfShipment: '',
      orgId: orgId,
      status: 'Edit',
      securityName: '',
      supplier: '',
      supplierShortName: '',
      totalGrnQty: '',
      vehicleType: '',
      vehicleNo: '',
      warehouse: loginWarehouse
    });
    setPutAwayDetailsTableData([
      {
        id: 1,
        batch: '',
        bin: '',
        binType: '',
        cellType: '',
        grnQty: '',
        invNo: '',
        invQty: '',
        partDesc: '',
        partNo: '',
        batchNo: '',
        pQty: '',
        recQty: '',
        remarks: '',
        sku: '',
        ssku: ''
      }
    ]);
    setPutAwayTableErrors('');
    setFieldErrors({
      binClass: '',
      binPick: '',
      binType: '',
      branch: loginBranch,
      branchCode: loginBranchCode,
      carrier: '',
      client: loginClient,
      core: '',
      createdBy: loginUserName,
      customer: loginCustomer,
      enteredPerson: '',
      entryNo: '',
      entryDate: null,
      finYear: '',
      grnDate: null,
      grnNo: '',
      lotNo: '',
      modeOfShipment: '',
      orgId: orgId,
      status: '',
      supplier: '',
      supplierShortName: '',
      warehouse: loginWarehouse
    });
    getPutAwayDocId();
    // setEditId('');
  };

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;
    if (!formData.grnNo) {
      errors.grnNo = 'Grn No is required';
    }
    if (!formData.binType) {
      errors.binType = 'Bin Type is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    // if (!formData.binClass) {
    //   errors.binClass = 'Bin Class is required';
    // }
    // if (!formData.binPick) {
    //   errors.binPick = 'Bin Pick is required';
    // }

    let putAwayDetailsTableDataValid = true;
    const newTableErrors = putAwayDetailsTableData.map((row, index) => {
      const rowErrors = {};
      // if (!row.batchNo) {
      //   rowErrors.batchNo = 'Batch No is required';
      //   putAwayDetailsTableDataValid = false;
      // }
      if (!row.sku) {
        rowErrors.sku = 'Sku is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].sku;
        putAwayDetailsTableDataValid = false;
      }
      // if (!row.putAwayQty) {
      //   rowErrors.putAwayQty = 'PutAwayQty is required';
      //   putAwayDetailsTableDataValid = false;
      // }
      if (!row.bin) {
        rowErrors.bin = 'Bin is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].bin;
        putAwayDetailsTableDataValid = false;
      }

      return rowErrors;
    });

    if (!putAwayDetailsTableDataValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
    } else {
      // Proceed with form submission
    }

    setPutAwayTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && putAwayDetailsTableDataValid) {
      setIsLoading(true);
      const putAwayDetailsDTO = putAwayDetailsTableData.map((row) => ({
        batch: row.batchNo,
        batchDate: row.batchDate,
        bin: row.bin,
        binType: row.binType,
        cellType: row.cellType,
        expdate: row.expDate,
        grnQty: row.grnQty,
        invoiceNo: row.invoiceNo,
        invQty: row.invQty,
        partDesc: row.partDesc,
        partNo: row.partNo,
        putAwayQty: row.pQty,
        recQty: row.recQty,
        remarks: row.remarks,
        sku: row.sku,
        ssku: row.ssku
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        binClass: formData.binClass,
        binPick: formData.binPick,
        binType: formData.binType,
        branch: loginBranch,
        branchCode: loginBranchCode,
        carrier: formData.carrier,
        contact: formData.contact,
        client: loginClient,
        core: formData.core,
        createdBy: loginUserName,
        customer: loginCustomer,
        // docDate: dayjs(),
        driverName: formData.driverName,
        enteredPerson: formData.enteredPerson,
        entryDate: formData.entryDate,
        entryNo: formData.entryNo,
        finYear: loginFinYear,
        grnDate: formData.grnDate,
        grnNo: formData.grnNo,
        lotNo: formData.lotNo,
        modeOfShipment: formData.modeOfShipment,
        orgId: orgId,
        putAwayDetailsDTO,
        status: formData.status,
        supplier: formData.supplier,
        supplierShortName: formData.supplierShortName,
        vehicleType: formData.vehicleType,
        vehicleNo: formData.vehicleNo,
        warehouse: loginWarehouse
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `putaway/createUpdatePutAway`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Put Away Updated Successfully' : 'Put Away created successfully');
          setIsLoading(false);
          getAllPutAway();
          getGrnForPutaway();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Put Away creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Put Away creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  // const handleSave = async () => {
  //   const errors = {};
  //   let firstInvalidFieldRef = null;

  //   // Validate form fields
  //   if (!formData.grnNo) {
  //     errors.grnNo = 'Grn No is required';
  //   }
  //   if (!formData.binType) {
  //     errors.binType = 'Bin Type is required';
  //   }
  //   if (!formData.status) {
  //     errors.status = 'Status is required';
  //   }
  //   if (!formData.binClass) {
  //     errors.binClass = 'Bin Class is required';
  //   }
  //   if (!formData.binPick) {
  //     errors.binPick = 'Bin Pick is required';
  //   }

  //   // Validate table fields
  //   let putAwayDetailsTableDataValid = true;
  //   const newTableErrors = putAwayDetailsTableData.map((row, index) => {
  //     const rowErrors = {};
  //     if (!row.batchNo) {
  //       rowErrors.batchNo = 'Batch No is required';
  //       putAwayDetailsTableDataValid = false;
  //     }
  //     if (!row.sku) {
  //       rowErrors.sku = 'Sku is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index]?.sku;
  //       putAwayDetailsTableDataValid = false;
  //     }
  //     if (!row.putAwayQty) {
  //       rowErrors.putAwayQty = 'Put Away Quantity is required';
  //       putAwayDetailsTableDataValid = false;
  //     }
  //     if (!row.bin) {
  //       rowErrors.bin = 'Bin is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index]?.bin;
  //       putAwayDetailsTableDataValid = false;
  //     }
  //     return rowErrors;
  //   });

  //   // Set the errors in state
  //   setPutAwayTableErrors(newTableErrors);

  //   // Log the validation state for debugging
  //   console.log('Validation state:', { putAwayDetailsTableDataValid, errors, newTableErrors });

  //   // Stop form submission if any errors are found
  //   if (!putAwayDetailsTableDataValid || Object.keys(errors).length > 0) {
  //     console.log('Form submission blocked due to validation errors.');
  //     if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
  //       firstInvalidFieldRef.current.focus();
  //     }
  //     return;
  //   }

  //   // Proceed with form submission
  //   setIsLoading(true);

  //   const putAwayDetailsDTO = putAwayDetailsTableData.map((row) => ({
  //     batch: row.batchNo,
  //     batchDate: row.batchDate,
  //     bin: row.bin,
  //     binType: row.binType,
  //     cellType: row.cellType,
  //     expdate: row.expDate,
  //     grnQty: row.grnQty,
  //     invoiceNo: row.invoiceNo,
  //     invQty: row.invQty,
  //     partDesc: row.partDesc,
  //     partNo: row.partNo,
  //     putAwayQty: row.putAwayQty,
  //     recQty: row.recQty,
  //     remarks: row.remarks,
  //     sku: row.sku,
  //     ssku: row.ssku
  //   }));

  //   const saveFormData = {
  //     ...(editId && { id: editId }),
  //     binClass: formData.binClass,
  //     binPick: formData.binPick,
  //     binType: formData.binType,
  //     branch: loginBranch,
  //     branchCode: loginBranchCode,
  //     carrier: formData.carrier,
  //     contact: formData.contact,
  //     client: loginClient,
  //     core: formData.core,
  //     createdBy: loginUserName,
  //     customer: loginCustomer,
  //     driverName: formData.driverName,
  //     enteredPerson: formData.enteredPerson,
  //     entryDate: formData.entryDate,
  //     entryNo: formData.entryNo,
  //     finYear: loginFinYear,
  //     grnDate: formData.grnDate,
  //     grnNo: formData.grnNo,
  //     lotNo: formData.lotNo,
  //     modeOfShipment: formData.modeOfShipment,
  //     orgId: orgId,
  //     putAwayDetailsDTO,
  //     status: formData.status,
  //     supplier: formData.supplier,
  //     supplierShortName: formData.supplierShortName,
  //     vehicleType: formData.vehicleType,
  //     vehicleNo: formData.vehicleNo,
  //     warehouse: loginWarehouse
  //   };

  //   console.log('DATA TO SAVE IS:', saveFormData);

  //   try {
  //     const response = await apiCalls('put', `putaway/createUpdatePutAway`, saveFormData);
  //     console.log('API Response:', response);
  //     if (response.status === true) {
  //       handleClear();
  //       showToast('success', editId ? 'Put Away Updated Successfully' : 'Put Away created successfully');
  //       getAllPutAway();
  //     } else {
  //       showToast('error', response.paramObjectsMap.errorMessage || 'Put Away creation failed');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     showToast('error', 'Put Away creation failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleView = () => {
    setListView(!listView);
    setDownloadPdf(false);
  };

  const handleClose = () => {
    setFormData({
      binClass: '',
      binPick: '',
      binType: '',
      branch: loginBranch,
      branchCode: loginBranchCode,
      carrier: '',
      client: loginClient,
      core: '',
      createdBy: loginUserName,
      customer: loginCustomer,
      enteredPerson: '',
      entryNo: '',
      entryDate: null,
      finYear: '',
      grnDate: null,
      grnNo: '',
      lotNo: '',
      modeOfShipment: '',
      orgId: orgId,
      status: '',
      supplier: '',
      supplierShortName: '',
      warehouse: loginWarehouse
    });
  };

  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
  };
  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };
  return (
    <>
      <div>{/* <ToastContainer /> */}</div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            {!formData.freeze && <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} />}
            <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
          </div>
        </div>
        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            sampleFileDownload={sampleFile}
            handleFileUpload={handleFileUpload}
            // apiUrl={`putaway/ExcelUploadForPutAway?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
            screen="PutAway"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getPutAwayById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
            {downloadPdf && <GeneratePdfTemp row={pdfData} />}
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField
                  label="Document No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="docId"
                  value={formData.docId}
                  error={!!fieldErrors.docId}
                  helperText={fieldErrors.docId}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Document Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              {editId ? (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Grn No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="grnNo"
                    value={formData.grnNo}
                    error={!!fieldErrors.grnNo}
                    helperText={fieldErrors.grnNo}
                    disabled
                  />
                </div>
              ) : (
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.grnNo}>
                    <InputLabel id="grnNo">
                      {
                        <span>
                          Grn No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select labelId="grnNo" name="grnNo" label="Grn No" value={formData.grnNo} onChange={handleInputChange}>
                      {grnList?.map((row) => (
                        <MenuItem key={row.id} value={row.docId}>
                          {row.docId}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.grnNo && <FormHelperText error>{fieldErrors.grnNo}</FormHelperText>}
                  </FormControl>
                </div>
              )}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Grn Date"
                      value={formData.grnDate ? dayjs(formData.grnDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('grnDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.grnDate}
                      helperText={fieldErrors.grnDate && 'Required'}
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Entry/SI No."
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="entryNo"
                  value={formData.entryNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.entryNo}
                  helperText={fieldErrors.entryNo}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Entry Date"
                      value={formData.entryDate ? dayjs(formData.entryDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('entryDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.entryDate}
                      helperText={fieldErrors.entryDate && 'Required'}
                      disabled
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              {editId ? (
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Core"
                    variant="outlined"
                    size="small"
                    disabled={formData.freeze}
                    fullWidth
                    name="core"
                    value={formData.core}
                    error={!!fieldErrors.core}
                    helperText={fieldErrors.core}
                  />
                </div>
              ) : (
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.core}>
                    <InputLabel id="core">Core</InputLabel>
                    <Select
                      labelId="core"
                      id="core"
                      name="core"
                      label="Core"
                      value={formData.core}
                      disabled={formData.freeze}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">Select Option</MenuItem>
                      <MenuItem value="Multi">MULTI</MenuItem>
                      <MenuItem value="Single">SINGLE</MenuItem>
                    </Select>
                    {fieldErrors.core && <FormHelperText error>{fieldErrors.core}</FormHelperText>}
                  </FormControl>
                </div>
              )}
              <div className="col-md-3 mb-3">
                <TextField
                  label="Supplier Short Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="supplierShortName"
                  value={formData.supplierShortName}
                  error={!!fieldErrors.supplierShortName}
                  helperText={fieldErrors.supplierShortName}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Supplier"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  error={!!fieldErrors.supplier}
                  helperText={fieldErrors.supplier}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Mode Of Shipment"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="modeOfShipment"
                  value={formData.modeOfShipment}
                  error={!!fieldErrors.modeOfShipment}
                  helperText={fieldErrors.modeOfShipment}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Carrier"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleInputChange}
                  error={!!fieldErrors.carrier}
                  helperText={fieldErrors.carrier}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Brief Desc. of the Goods"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="briefDesc"
                  value={formData.briefDesc}
                  onChange={handleInputChange}
                  error={!!fieldErrors.briefDesc}
                  helperText={fieldErrors.briefDesc}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Entered By"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="enteredPerson"
                  value={formData.enteredPerson}
                  onChange={handleInputChange}
                  error={!!fieldErrors.enteredPerson}
                  helperText={fieldErrors.enteredPerson}
                  disabled={formData.freeze}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  label="Lot No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="lotNo"
                  value={formData.lotNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.lotNo}
                  helperText={fieldErrors.lotNo}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small" error={!!fieldErrors.binType}>
                  <InputLabel id="binType-label">
                    {
                      <span>
                        Bin Type <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="binType-label"
                    id="binType"
                    name="binType"
                    label="Bin Type"
                    disabled={formData.freeze}
                    value={formData.binType}
                    onChange={handleInputChange}
                  >
                    {locationTypeList?.map((row) => (
                      <MenuItem key={row.id} value={row.ltype.toUpperCase()}>
                        {row.ltype.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.binType && <FormHelperText error>{fieldErrors.binType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                {editId ? (
                  <>
                    <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                      <InputLabel id="status">
                        {
                          <span>
                            Status <span className="asterisk">*</span>
                          </span>
                        }
                      </InputLabel>
                      <Select
                        labelId="status"
                        id="status"
                        name="status"
                        label="Status"
                        disabled={formData.freeze}
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Edit">EDIT</MenuItem>
                        <MenuItem value="Confirm">CONFIRM</MenuItem>
                      </Select>
                      {fieldErrors.status && <FormHelperText error>{fieldErrors.status}</FormHelperText>}
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                      <InputLabel id="status">
                        {
                          <span>
                            Status <span className="asterisk">*</span>
                          </span>
                        }
                      </InputLabel>
                      <Select
                        labelId="status"
                        id="status"
                        name="status"
                        label="Status"
                        disabled={formData.freeze}
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Edit">EDIT</MenuItem>
                      </Select>
                      {fieldErrors.status && <FormHelperText error>{fieldErrors.status}</FormHelperText>}
                    </FormControl>
                  </>
                )}
              </div>
              <div className="col-md-3 mb-3">
                <FormControl className="ps-2">
                  <FormLabel id="demo-radio-buttons-group-label">Bin Class</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="fixed"
                    name="binClass"
                    disabled={formData.freeze}
                    value={formData.binClass}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="Fixed" control={<Radio size="small" />} label="Fixed" />
                    <FormControlLabel value="Open" control={<Radio size="small" />} label="Open" />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="col-md-6 mb-3">
                <FormControl className="ps-2">
                  <FormLabel id="demo-radio-buttons-group-label">Bin Pick</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Empty"
                    name="binPick"
                    value={formData.binPick}
                    disabled={formData.freeze}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="Empty" control={<Radio size="small" />} label="Empty" />
                    <FormControlLabel value="Occupied" control={<Radio size="small" />} label="Occupied" />
                    <FormControlLabel value="Both" control={<Radio size="small" />} label="Both" />
                  </RadioGroup>
                </FormControl>
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
                  disabled={formData.freeze}
                >
                  <Tab value={0} label="LR NO. Details" />
                  <Tab value={1} label="Summary" />
                  <Tab value={2} label="Others" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                        <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={getPutawayGridDetails} />
                      </div>
                      {/* Table */}
                      <div className="row mt-2">
                        <div className="col-lg-12">
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
                                  {/* <th className="px-2 py-2 text-white text-center">INVOICE No</th> */}
                                  <th className="px-2 py-2 text-white text-center">Part No</th>
                                  <th className="px-2 py-2 text-white text-center">Batch</th>
                                  <th className="px-2 py-2 text-white text-center">Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">SKU *</th>
                                  <th className="px-2 py-2 text-white text-center">Inv Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Rec Qty</th>
                                  <th className="px-2 py-2 text-white text-center">GRN Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Putaway Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Bin *</th>
                                  <th className="px-2 py-2 text-white text-center">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {putAwayDetailsTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    {/* <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.invNo}
                                        style={{ width: '130px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, invNo: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], invNo: !value ? 'Avail Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.invNo ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {putAwayTableErrors[index]?.invNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].invNo}
                                        </div>
                                      )}
                                    </td> */}

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.partNo}
                                        style={{ width: '130px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, partNo: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], partNo: !value ? 'Avail Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {putAwayTableErrors[index]?.partNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].partNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.batchNo}
                                        style={{ width: '130px' }}
                                        disabled={formData.freeze}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, batchNo: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], batchNo: !value ? 'batchNo is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                      />
                                      {putAwayTableErrors[index]?.batch && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].batch}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.partDesc}
                                        style={{ width: '300px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, partDesc: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], partDesc: !value ? 'Avail Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {putAwayTableErrors[index]?.partDesc && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].partDesc}
                                        </div>
                                      )}
                                    </td>

                                    {/* <td className="border px-2 py-2">
                                      <select
                                        value={row.batchNo}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, batchNo: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              batchNo: !value ? 'Batch No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        <option value="ONE">ONE</option>
                                        <option value="TWO">TWO</option>
                                      </select>
                                      {putAwayTableErrors[index]?.batchNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].batchNo}
                                        </div>
                                      )}
                                    </td> */}

                                    <td className="border px-2 py-2">
                                      <select
                                        // ref={lrNoDetailsRefs.current[index].sku}
                                        ref={lrNoDetailsRefs.current[index]?.sku}
                                        value={row.sku}
                                        style={{ width: '130px' }}
                                        disabled={formData.freeze}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sku: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sku: !value ? 'Sku is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        <option value={row.sku}>{row.sku}</option>
                                        {/* <option value="KM19">KM19</option> */}
                                      </select>
                                      {putAwayTableErrors[index]?.sku && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].sku}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.invQty}
                                        style={{ width: '110px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, invQty: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], invQty: !value ? 'Avail Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.invQty ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {putAwayTableErrors[index]?.invQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].invQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.recQty}
                                        style={{ width: '110px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, recQty: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], recQty: !value ? 'Avail Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.recQty ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {putAwayTableErrors[index]?.recQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].recQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.grnQty}
                                        style={{ width: '110px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, grnQty: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], grnQty: !value ? 'Avail Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.grnQty ? 'error form-control' : 'form-control'}
                                        disabled
                                      />
                                      {putAwayTableErrors[index]?.grnQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].grnQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.pQty}
                                        disabled={formData.freeze}
                                        style={{ width: '110px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, pQty: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], pQty: !value ? 'pQty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.pQty ? 'error form-control' : 'form-control'}
                                      />
                                      {putAwayTableErrors[index]?.pQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].pQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        // ref={lrNoDetailsRefs.current[index].bin}

                                        ref={lrNoDetailsRefs.current[index]?.bin}
                                        value={row.bin}
                                        disabled={formData.freeze}
                                        style={{ width: '130px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, bin: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              bin: !value ? 'Bin is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Option</option>
                                        {row.binOptions &&
                                          row.binOptions.map((bin) => (
                                            <option key={bin} value={bin}>
                                              {bin}
                                            </option>
                                          ))}
                                      </select>
                                      {putAwayTableErrors[index]?.bin && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].bin}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.remarks}
                                        disabled={formData.freeze}
                                        style={{ width: '110px' }}
                                        onKeyDown={(e) => handleKeyDown(e, row)}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPutAwayDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, remarks: value.toUpperCase() } : r))
                                          );
                                          setPutAwayTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], remarks: !value ? 'remarks is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={putAwayTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                      />
                                      {putAwayTableErrors[index]?.remarks && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {putAwayTableErrors[index].remarks}
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
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Total GRN Qty."
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="totalGrnQty"
                          value={formData.totalGrnQty}
                          disabled
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Total Putaway Qty."
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="totalPutawayQty"
                          value={formData.totalPutawayQty}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}
                {value === 2 && (
                  <>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Vehicle Type"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="vehicleType"
                          value={formData.vehicleType}
                          error={!!fieldErrors.vehicleType}
                          helperText={fieldErrors.vehicleType}
                          disabled
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Vehicle No"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="vehicleNo"
                          value={formData.vehicleNo}
                          onChange={handleInputChange}
                          error={!!fieldErrors.vehicleNo}
                          helperText={fieldErrors.vehicleNo}
                          disabled
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Security Person Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="securityName"
                          value={formData.securityName}
                          onChange={handleInputChange}
                          error={!!fieldErrors.securityName}
                          helperText={fieldErrors.securityName}
                          disabled
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Driver Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="driverName"
                          value={formData.driverName}
                          onChange={handleInputChange}
                          error={!!fieldErrors.driverName}
                          helperText={fieldErrors.driverName}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}
              </Box>
              <Dialog
                open={modalOpen}
                maxWidth={'lg'}
                fullWidth={true}
                onClose={handleCloseModal}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
              >
                <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                  <h6>Grid Details</h6>
                </DialogTitle>
                <DialogContent className="pb-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr style={{ backgroundColor: '#673AB7' }}>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                <Checkbox checked={checkAll} onChange={handleCheckAllChange} />
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                S.No
                              </th>
                              <th className="px-2 py-2 text-white text-center">Batch</th>
                              <th className="px-2 py-2 text-white text-center">Batch Date</th>
                              <th className="px-2 py-2 text-white text-center">Bin</th>
                              <th className="px-2 py-2 text-white text-center">Exp Date</th>
                              <th className="px-2 py-2 text-white text-center">Part No.</th>
                              <th className="px-2 py-2 text-white text-center">Part Desc</th>
                              <th className="px-2 py-2 text-white text-center">Invoice Qty</th>
                              <th className="px-2 py-2 text-white text-center">Received Qty</th>
                              <th className="px-2 py-2 text-white text-center">Grn Qty</th>
                              <th className="px-2 py-2 text-white text-center">Put Away Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridDetailsTableData.map((row, index) => (
                              <tr key={row.id}>
                                <td className="border p-0 text-center">
                                  <Checkbox checked={checkedState[row.id] || false} onChange={() => handleCheckboxChange(row.id)} />
                                </td>
                                <td className="text-center">
                                  <div className="pt-1">{index + 1}</div>
                                </td>
                                <td className="border p-0">{row.batchNo}</td>
                                <td className="border p-0">{row.batchDate}</td>
                                <td className="border p-0">{row.bin}</td>
                                <td className="border p-0">{row.expDate}</td>
                                <td className="border p-0">{row.partNo}</td>
                                <td className="border p-0">{row.partDesc}</td>
                                <td className="border p-0">{row.invQty}</td>
                                <td className="border p-0">{row.recQty}</td>
                                <td className="border p-0">{row.grnQty}</td>
                                <td className="border p-0">{row.pQty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button color="secondary" onClick={handlePutawayGrid} variant="contained">
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
export default Putaway;
