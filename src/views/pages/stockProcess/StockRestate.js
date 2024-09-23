import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
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
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import React, { useRef } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import sampleFile from '../../../assets/sample-files/sample_Stock_Restate_.xls';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const StockRestate = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [viewId, setViewId] = useState('');
  const [fromBinList, setFromBinList] = useState([]);
  const [partNoList, setPartNoList] = useState([]);
  const [grnNoList, setGrnNoList] = useState([]);
  const [batchNoList, setBatchNoList] = useState([]);
  const [toBinList, setToBinList] = useState([]);
  const [fromQtyList, setFromQtyList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [loginUserId, setLoginUserId] = useState(localStorage.getItem('userId'));
  const [loginBranchCode, setLoginBranchCode] = useState(localStorage.getItem('branchcode'));
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('branch'));
  const [loginCustomer, setLoginCustomer] = useState(localStorage.getItem('customer'));
  const [loginClient, setLoginClient] = useState(localStorage.getItem('client'));
  const [loginWarehouse, setLoginWarehouse] = useState(localStorage.getItem('warehouse'));
  const [loginFinYear, setLoginFinYear] = useState(localStorage.getItem('finYear'));
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    docId: '',
    docDate: dayjs(),
    transferFrom: '',
    transferTo: '',
    transferFromFlag: '',
    transferToFlag: '',
    entryNo: ''
  });
  const [value, setValue] = useState(0);
  const [detailTableData, setDetailTableData] = useState([
    // {
    //   id: 1,
    //   fromBin: '',
    //   fromBinType: '',
    //   partNo: '',
    //   partDesc: '',
    //   sku: '',
    //   grnNo: '',
    //   batchNo: '',
    //   toBin: '',
    //   toBinType: '',
    //   fromQty: '',
    //   toQty: '',
    //   remainQty: ''
    // }
  ]);

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = detailTableData.map((_, index) => ({
      fromBin: lrNoDetailsRefs.current[index]?.fromBin || React.createRef(),
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      grnNo: lrNoDetailsRefs.current[index]?.grnNo || React.createRef(),
      batchNo: lrNoDetailsRefs.current[index]?.batchNo || React.createRef(),
      toBin: lrNoDetailsRefs.current[index]?.toBin || React.createRef(),
      toQty: lrNoDetailsRefs.current[index]?.toQty || React.createRef()
    }));
  }, [detailTableData]);

  const [detailTableErrors, setDetailTableErrors] = useState([]);
  const [modalTableData, setModalTableData] = useState([
    {
      id: 1,
      fromBin: '',
      fromBinClass: '',
      fromBinType: '',
      fromCellType: '',
      partNo: '',
      partDesc: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      batchNo: '',
      batchDate: '',
      expDate: '',
      toBin: '',
      toBinType: '',
      toBinClass: '',
      toCellType: '',
      fromQty: '',
      toQty: '',
      remainQty: '',
      fromCore: '',
      toCore: '',
      qcFlag: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: null,
    transferFrom: '',
    transferTo: '',
    transferFromFlag: '',
    transferToFlag: '',
    entryNo: ''
  });
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Stock Restate ID', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'transferFrom', header: 'Transfer From', size: 140 },
    { accessorKey: 'transferTo', header: 'Identity transfer To', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  const [transferType, setTransferType] = useState([
    { name: 'HOLD', value: 'HOLD' },
    { name: 'DEFECTIVE', value: 'DEFECTIVE' },
    { name: 'RELEASE', value: 'RELEASE' },
    { name: 'VAS', value: 'VAS' }
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getNewStockRestateDocId();
    getFromBin();
    getAllStockRestate();
  }, []);

  const getNewStockRestateDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getStockRestateDocId?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}`
      );
      console.log('THE NEW DOCID IS:', response);
      if (response.status === true) {
        setFormData((prevData) => ({
          ...prevData,
          docId: response.paramObjectsMap.StockRestateDocId
        }));
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getFillGridDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getFillGridDetailsForStockRestate?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&tranferFromFlag=${formData.transferFromFlag}&tranferToFlag=${formData.transferToFlag}&warehouse=${loginWarehouse}&entryNo=${formData.entryNo}`
      );
      console.log('THE VAS PICK GRID DETAILS IS:', response);
      if (response.status === true) {
        const gridDetails = response.paramObjectsMap.fillGridDetails;
        console.log('THE MODAL TABLE DATA FROM API ARE:', gridDetails);

        setModalTableData(
          gridDetails.map((row) => ({
            id: row.id,
            fromBin: row.fromBin,
            fromBinClass: row.fromBinClass,
            fromBinType: row.fromBinType,
            fromCellType: row.fromCellType,
            partNo: row.partNo,
            partDesc: row.partDesc,
            sku: row.sku,
            grnNo: row.grnNo,
            grnDate: row.grnDate,
            batchNo: row.batchNo,
            batchDate: row.batchDate,
            expDate: row.expDate,
            toBin: row.toBin,
            toBinType: row.ToBinType,
            toBinClass: row.ToBinClass,
            toCellType: row.ToCellType,
            fromQty: row.fromQty,
            toQty: row.toQty,
            fromCore: row.fromCore,
            toCore: row.ToCore,
            qcFlag: row.qcFlag
          }))
        );
        setDetailTableData([]);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getAllStockRestate = async () => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getAllStockRestate?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&finYear=${loginFinYear}&orgId=${orgId}&warehouse=${loginWarehouse}`
      );
      console.log('THE WAREHOUSES IS:', response);
      if (response.status === true) {
        setListViewData(response.paramObjectsMap.stockRestateVO);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getFromBin = async (selectedTransferFromFlag) => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getFromBinDetailsForStockRestate?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&tranferFromFlag=${selectedTransferFromFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        setFromBinList(response.paramObjectsMap.fromBinDetails);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getPartNo = async (selectedFromBin, selectedTransferFromFlag, row) => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getPartNoDetailsForStockRestate?branchCode=${loginBranchCode}&client=${loginClient}&fromBin=${selectedFromBin}&orgId=${orgId}&tranferFromFlag=${selectedTransferFromFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        // setPartNoList(response.paramObjectsMap.partNoDetails);
        setDetailTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowPartNoList: response.paramObjectsMap.partNoDetails
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getGrnNo = async (selectedRowPartNo, selectedRowFromBin) => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getGrnNoDetailsForStockRestate?branchCode=${loginBranchCode}&client=${loginClient}&fromBin=${selectedRowFromBin}&orgId=${orgId}&partNo=${selectedRowPartNo}&tranferFromFlag=${formData.transferFromFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        setGrnNoList(response.paramObjectsMap.grnNoDetails);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getBatchNo = async (selectedFromBin, selectedPartNo, selectedGrnNo) => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getbatchNoDetailsForStockRestate?branchCode=${loginBranchCode}&client=${loginClient}&fromBin=${selectedFromBin}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}&tranferFromFlag=${formData.transferFromFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        setBatchNoList(response.paramObjectsMap.batchNoDetails);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getToBinDetails = async (selectedTransferFromFlag) => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getToBinDetails?branchCode=${loginBranchCode}&client=${loginClient}&orgId=${orgId}&tranferFromFlag=${selectedTransferFromFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE TO BIN LIST ARE:', response);
      if (response.status === true) {
        setToBinList(response.paramObjectsMap.toBinDetails);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getFromQty = async (selectedBatchNo, selectedFromBin, selectedGrnNo, selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `stockRestate/getFromQtyForStockRestate?batchNo=${selectedBatchNo}&branchCode=${loginBranchCode}&client=${loginClient}&fromBin=${selectedFromBin}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}&tranferFromFlag=${formData.transferFromFlag}&warehouse=${loginWarehouse}`
      );
      console.log('THE ROW. TO BIN IS IS:', selectedPartNo);

      setDetailTableData((prevData) =>
        prevData.map((r) =>
          r.id === row.id
            ? {
                ...r,
                fromQty: response.paramObjectsMap?.fromQty || r.fromQty // Use optional chaining to avoid errors if `paramObjectsMap` is undefined
              }
            : r
        )
      );
    } catch (error) {
      console.error('Error fetching locationType data:', error);
    }
  };

  const getStockRestateById = async (row) => {
    console.log('THE SELECTED STOCK RESTATE  ID IS:', row.original.id);

    try {
      const response = await apiCalls('get', `stockRestate/getStockRestateById?id=${row.original.id}`);
      console.log('THE STOCK RESTATE DATA IS:', response);

      if (response.status === true) {
        setViewId(row.original.id);
        const particularStockRestate = response.paramObjectsMap.stockRestateVO;
        console.log('THE TRANSFER FROM FLAG IS:', particularStockRestate.transferFromFlag);

        setFormData({
          docId: particularStockRestate.docId,
          docDate: particularStockRestate.docDate,
          transferFrom: particularStockRestate.transferFrom,
          transferFromFlag: particularStockRestate.transferFromFlag,
          transferTo: particularStockRestate.transferTo,
          transferToFlag: particularStockRestate.transferToFlag,
          entryNo: particularStockRestate.entryNo
        });
        getFromBin(particularStockRestate.transferFromFlag);

        setDetailTableData(
          particularStockRestate.stockRestateDetailsVO.map((row) => ({
            id: row.id,
            fromBin: row.fromBin,
            fromBinClass: row.fromBinClass,
            fromBinType: row.fromBinType,
            fromCellType: row.fromCellType,
            partNo: row.partNo,
            partDesc: row.partDesc,
            sku: row.sku,
            grnNo: row.grnNo,
            grnDate: row.grnDate,
            batchNo: row.batch,
            batchDate: row.batchDate,
            expDate: row.expDate,
            toBin: row.toBin,
            toBinType: row.toBinType,
            toBinClass: row.toBinClass,
            toCellType: row.toCellType,
            fromQty: row.fromQty,
            toQty: row.toQty,
            fromCore: row.fromCore,
            toCore: row.toCore,
            qcFlag: row.qcFlag,
            remainQty: row.remainQty
          }))
        );
        setListView(false);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const specialCharsRegex = /^[A-Za-z0-9#_\-/\\]*$/;

  //   let errorMessage = '';

  //   switch (name) {
  //     case 'entryNo':
  //       if (!specialCharsRegex.test(value)) {
  //         errorMessage = 'Only alphaNumeric, #_-/ are allowed';
  //       }
  //       break;

  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     let updatedData = { ...formData, [name]: value.toUpperCase() };

  //     if (name === 'transferFrom') {
  //       updatedData.transferFromFlag = value === 'DEFECTIVE' ? 'D' : value === 'HOLD' ? 'H' : value === 'RELEASE' ? 'R' : '';
  //       setFromBinList([]);
  //       getFromBin(updatedData.transferFromFlag);
  //       getToBinDetails(updatedData.transferFromFlag);
  //     } else if (name === 'transferTo') {
  //       updatedData.transferToFlag = value === 'DEFECTIVE' ? 'D' : value === 'HOLD' ? 'H' : value === 'RELEASE' ? 'R' : '';
  //     }

  //     setFormData(updatedData);
  //     setFieldErrors({ ...fieldErrors, [name]: '' });

  //     // Log the updated flag for debugging
  //     if (name === 'transferFrom') {
  //       console.log('THE TRANSFER FROM FLAG IS:', updatedData.transferFromFlag);
  //     } else if (name === 'transferTo') {
  //       console.log('THE TRANSFER TO FLAG IS:', updatedData.transferToFlag);
  //     }
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target; // Capture cursor positions
    const specialCharsRegex = /^[A-Za-z0-9#_\-/\\]*$/;

    let errorMessage = '';

    switch (name) {
      case 'entryNo':
        if (!specialCharsRegex.test(value)) {
          errorMessage = 'Only alphanumeric, #_-/ are allowed';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      let updatedData = { ...formData, [name]: value.toUpperCase() };

      if (name === 'transferFrom') {
        updatedData.transferFromFlag =
          value === 'DEFECTIVE' ? 'D' : value === 'HOLD' ? 'H' : value === 'RELEASE' ? 'R' : value === 'VAS' ? 'V' : '';
        setFromBinList([]);
        getFromBin(updatedData.transferFromFlag);
        getToBinDetails(updatedData.transferFromFlag);
      } else if (name === 'transferTo') {
        updatedData.transferToFlag =
          value === 'DEFECTIVE' ? 'D' : value === 'HOLD' ? 'H' : value === 'RELEASE' ? 'R' : value === 'VAS' ? 'V' : '';
      }

      setFormData(updatedData);
      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Log the updated flag for debugging
      if (name === 'transferFrom') {
        console.log('THE TRANSFER FROM FLAG IS:', updatedData.transferFromFlag);
      } else if (name === 'transferTo') {
        console.log('THE TRANSFER TO FLAG IS:', updatedData.transferToFlag);
      }
    }

    // Restore cursor position after state update
    setTimeout(() => {
      const inputElement = document.querySelector(`[name=${name}]`);
      if (inputElement) {
        inputElement.setSelectionRange(selectionStart, selectionEnd);
      }
    }, 0);
  };
  const getAvailableTransferTo = (transferFrom) => {
    const selectedTransferFrom = transferFrom;
    return transferType.filter((i) => !selectedTransferFrom.includes(i.value));
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        // if (table === roleTableData) handleAddRow();
        handleAddRow();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailTableData)) {
      displayRowError(detailTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      fromBin: '',
      fromBinClass: '',
      fromBinType: '',
      fromBCellType: '',
      partNo: '',
      partDesc: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      batchNo: '',
      batchDate: '',
      expDate: '',
      toBin: '',
      toBinType: '',
      toBinClass: '',
      toCellType: '',
      fromQty: '',
      toQty: '',
      remainQty: '',
      fromCore: '',
      toCore: '',
      qcFlag: ''
    };
    setDetailTableData([...detailTableData, newRow]);
    setDetailTableErrors([
      ...detailTableErrors,
      {
        fromBin: '',
        fromBinClass: '',
        fromBinType: '',
        fromBCellType: '',
        partNo: '',
        partDesc: '',
        sku: '',
        grnNo: '',
        grnDate: '',
        batchNo: '',
        batchDate: '',
        expDate: '',
        toBin: '',
        toBinType: '',
        toBinClass: '',
        toCellType: '',
        fromQty: '',
        toQty: '',
        remainQty: '',
        fromCore: '',
        toCore: '',
        qcFlag: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailTableData) {
      return !lastRow.partNo || !lastRow.fromBin || !lastRow.grnNo || !lastRow.batchNo || !lastRow.toBin;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailTableData) {
      setDetailTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          fromBin: !table[table.length - 1].fromBin ? 'Bin Category is required' : '',
          grnNo: !table[table.length - 1].grnNo ? 'Status is required' : '',
          batchNo: !table[table.length - 1].batchNo ? 'Core is required' : '',
          toBin: !table[table.length - 1].toBin ? 'Status is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable) => {
    setTable(table.filter((row) => row.id !== id));
  };

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      transferFrom: '',
      transferto: '',
      entryNo: ''
    });
    setDetailTableData([]);
    setFieldErrors({
      docId: '',
      docDate: null,
      transferFrom: '',
      transferto: '',
      entryNo: ''
    });
    setDetailTableErrors([]);
    setViewId('');
    getNewStockRestateDocId();
  };

  const handleTableClear = (table) => {
    if (table === 'detailTableData') {
      setDetailTableData([]);
      setDetailTableErrors([]);
    }
  };

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;

    if (!formData.transferFrom) {
      errors.transferFrom = 'Transfer From is required';
    }
    if (!formData.transferTo) {
      errors.transferTo = 'Transfer To is required';
    }

    let detailTableDataValid = true;
    if (!detailTableData || !Array.isArray(detailTableData) || detailTableData.length === 0) {
      detailTableDataValid = false;
      setDetailTableErrors([{ general: 'Detail Table Data is required' }]);
    } else {
      const newTableErrors = detailTableData.map((row, index) => {
        const rowErrors = {};
        if (!row.fromBin) {
          rowErrors.fromBin = 'From Bin is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].fromBin;
        }
        if (!row.partNo) {
          rowErrors.partNo = 'Part No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partNo;
        }
        if (!row.grnNo) {
          rowErrors.grnNo = 'Grn No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].grnNo;
        }
        if (!row.batchNo) {
          rowErrors.batchNo = 'Batch No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].batchNo;
        }
        if (!row.toBin) {
          rowErrors.toBin = 'To Bin is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].toBin;
        }
        if (!row.toQty) {
          rowErrors.toQty = 'To QTY is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].toQty;
        }

        if (Object.keys(rowErrors).length > 0) detailTableDataValid = false;

        return rowErrors;
      });

      setDetailTableErrors(newTableErrors);

      if (!detailTableDataValid || Object.keys(errors).length > 0) {
        // Focus on the first invalid field
        if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
          firstInvalidFieldRef.current.focus();
        }
      } else {
        // Proceed with form submission
      }
    }

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      setIsLoading(true);
      const stockRestateVo = detailTableData.map((row) => ({
        ...(viewId && { id: row.id }),
        fromBin: row.fromBin,
        fromBinClass: row.fromBinClass,
        fromBinType: row.fromBinType,
        fromCellType: row.fromCellType,
        partNo: row.partNo,
        partDesc: row.partDesc,
        sku: row.sku,
        grnNo: row.grnNo,
        grnDate: row.grnDate,
        batch: row.batchNo,
        batchDate: row.batchDate,
        expDate: row.expDate,
        toBin: row.toBin,
        toBinType: row.toBinType,
        toBinClass: row.toBinClass,
        toCellType: row.toCellType,
        fromQty: row.fromQty,
        toQty: parseInt(row.toQty),
        fromCore: row.fromCore,
        toCore: row.toCore,
        qcFlag: row.qcFlag
      }));

      const saveFormData = {
        ...(viewId && { id: viewId }),
        branch: loginBranch,
        branchCode: loginBranchCode,
        client: loginClient,
        customer: loginCustomer,
        warehouse: loginWarehouse,
        finYear: loginFinYear,
        orgId: parseInt(orgId),
        createdBy: loginUserName,
        entryNo: formData.entryNo === '' ? null : formData.entryNo,
        transferFrom: formData.transferFrom,
        transferFromFlag: formData.transferFromFlag,
        transferTo: formData.transferTo,
        transferToFlag: formData.transferToFlag,
        stockRestateDetailsDTO: stockRestateVo
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', `stockRestate/createStockRestate`, saveFormData);

        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', viewId ? ' Stock Restate Updated Successfully' : 'Stock Restate created successfully');
          getAllStockRestate();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Stock Restate creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Stock Restate creation failed');
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
      branch: '',
      warehouse: '',
      locationType: '',
      rowNo: '',
      levelIdentity: '',
      cellFrom: '',
      cellTo: '',
      active: true
    });
  };
  const handleFromBinChange = (row, index, event) => {
    const value = event.target.value;
    const selectedFromBin = fromBinList.find((b) => b.fromBin === value);
    setDetailTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              fromBin: selectedFromBin.fromBin,
              fromBinType: selectedFromBin ? selectedFromBin.fromBinType : '',
              fromBinClass: selectedFromBin ? selectedFromBin.fromBinClass : '',
              fromCellType: selectedFromBin ? selectedFromBin.fromCellType : '',
              fromCore: selectedFromBin ? selectedFromBin.fromCore : ''
            }
          : r
      )
    );
    setDetailTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        partNo: !value ? 'Part number is required' : ''
      };
      return newErrors;
    });
    getPartNo(value, formData.transferFromFlag, row);
  };

  const handlePartNoChange = (row, index, event) => {
    const value = event.target.value;

    // Find the selected part number from the row's partNoList
    const selectedFromPartNo = row.rowPartNoList.find((b) => b.partNo === value);

    // Update the detail table data
    setDetailTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              partNo: selectedFromPartNo ? selectedFromPartNo.partNo : '', // Safeguard for undefined
              partDesc: selectedFromPartNo ? selectedFromPartNo.partDesc : '', // Safeguard for undefined
              sku: selectedFromPartNo ? selectedFromPartNo.sku : '' // Safeguard for undefined
            }
          : r
      )
    );

    // Update validation errors
    setDetailTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        partNo: !value ? 'Part number is required' : '' // Set error if partNo is empty
      };
      return newErrors;
    });

    // Call getGrnNo only if value is not empty
    if (value) {
      getGrnNo(value, row.fromBin);
    }
  };

  const handleGrnNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedGrnNo = grnNoList.find((row) => row.grnNo === value);
    setDetailTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              grnNo: selectedGrnNo.grnNo,
              grnDate: selectedGrnNo ? selectedGrnNo.grnDate : ''
            }
          : r
      )
    );
    setDetailTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getBatchNo(row.fromBin, row.partNo, value);
  };
  const handleBatchNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBatchNo = batchNoList.find((row) => row.batchNo === value);
    setDetailTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              batchNo: selectedBatchNo.batchNo,
              batchDate: selectedBatchNo ? selectedBatchNo.batchDate : '',
              expDate: selectedBatchNo ? selectedBatchNo.expDate : ''
            }
          : r
      )
    );
    setDetailTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    // getBatchNo(row.fromBin, row.partNo, value);
  };
  const handleToBinChange = (row, index, event) => {
    const value = event.target.value;
    console.log('THE ROW.PARTNO IS:', row);

    const selectedToBin = toBinList.find((row) => row.toBin === value);
    setDetailTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              toBin: selectedToBin.toBin,
              toBinType: selectedToBin ? selectedToBin.tobinType : '',
              toBinClass: selectedToBin ? selectedToBin.toBinClass : '',
              toCellType: selectedToBin ? selectedToBin.toCellType : '',
              toCore: selectedToBin ? selectedToBin.toCore : ''
            }
          : r
      )
    );
    setDetailTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getFromQty(row.batchNo, row.fromBin, row.grnNo, row.partNo, row);
  };
  const handleFromQtyChange = (row, index, event) => {
    const value = event.target.value;
    // const selectedToBin = toBinList.find((row) => row.toBin === value);
    setDetailTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              fromQty: value
              // toBinType: selectedToBin ? selectedToBin.tobinType : '',
              // toBinClass: selectedToBin ? selectedToBin.toBinClass : '',
              // toCellType: selectedToBin ? selectedToBin.toCellType : '',
              // toCore: selectedToBin ? selectedToBin.toCore : ''
            }
          : r
      )
    );
    setDetailTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        fromQty: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    // getBatchNo(row.fromBin, row.partNo, value);
  };

  // const handleToQtyChange = (e, row, index) => {
  //   const value = e.target.value;
  //   const numericValue = isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10); // Ensure value is a number
  //   const numericFromQty = isNaN(parseInt(row.fromQty, 10)) ? 0 : parseInt(row.fromQty, 10); // Ensure fromQty is a number
  //   const intPattern = /^\d*$/;

  //   if (intPattern.test(value) || value === '') {
  //     setDetailTableData((prev) => {
  //       const updatedData = prev.map((r) => {
  //         if (r.id === row.id) {
  //           let newRemainQty = numericFromQty - numericValue; // Initial remainQty calculation

  //           const cumulativeToQty = prev.reduce((total, item) => {
  //             if (
  //               item.fromBin === r.fromBin &&
  //               item.partNo === r.partNo &&
  //               item.grnNo === r.grnNo &&
  //               item.batchNo === r.batchNo &&
  //               item.id !== r.id
  //             ) {
  //               return total + (isNaN(parseInt(item.toQty, 10)) ? 0 : parseInt(item.toQty, 10));
  //             }
  //             return total;
  //           }, numericValue); // Include the current row's toQty in the cumulative total

  //           // Subtract cumulativeToQty from fromQty to get new remainQty
  //           newRemainQty = numericFromQty - cumulativeToQty;

  //           // Ensure remainQty is non-negative
  //           newRemainQty = Math.max(newRemainQty, 0);

  //           console.log(`Updated remainQty for row ${r.id}: ${newRemainQty}`); // Debugging line

  //           return {
  //             ...r,
  //             toQty: value,
  //             remainQty: newRemainQty
  //           };
  //         }
  //         return r;
  //       });

  //       return updatedData;
  //     });
  //     setDetailTableErrors((prev) => {
  //       const newErrors = [...prev];
  //       newErrors[index] = {
  //         ...newErrors[index],
  //         toQty: ''
  //       };
  //       return newErrors;
  //     });
  //   } else {
  //     setDetailTableErrors((prev) => {
  //       const newErrors = [...prev];
  //       newErrors[index] = {
  //         ...newErrors[index],
  //         toQty: 'Only numbers are allowed'
  //       };
  //       return newErrors;
  //     });
  //   }
  // };

  const handleToQtyChange = (e, row, index) => {
    const value = e.target.value;
    const numericValue = isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10);
    const numericFromQty = isNaN(parseInt(row.fromQty, 10)) ? 0 : parseInt(row.fromQty, 10);
    const intPattern = /^\d*$/;

    if (value === '') {
      setDetailTableData((prev) => {
        return prev.map((r) => {
          if (r.id === row.id) {
            return {
              ...r,
              toQty: '',
              remainQty: ''
            };
          }
          return r;
        });
      });
    } else if (intPattern.test(value)) {
      setDetailTableData((prev) => {
        let cumulativeToQty = 0;
        let maxAllowedToQty = numericFromQty;
        let shouldClearSubsequentRows = false;

        return prev.map((r, idx) => {
          if (r.fromBin === row.fromBin && r.partNo === row.partNo && r.grnNo === row.grnNo && r.batchNo === row.batchNo) {
            if (idx === index) {
              // Calculate the max allowed for the current row
              maxAllowedToQty = numericFromQty - cumulativeToQty;

              if (numericValue > maxAllowedToQty) {
                // If the value exceeds the max allowed, display an error
                setDetailTableErrors((prev) => {
                  const newErrors = [...prev];
                  newErrors[index] = {
                    ...newErrors[index],
                    toQty: `Cannot exceed ${maxAllowedToQty}`
                  };
                  return newErrors;
                });
                return {
                  ...r,
                  toQty: r.toQty // Keep the previous value if invalid input
                };
              } else {
                // Clear any previous error
                setDetailTableErrors((prev) => {
                  const newErrors = [...prev];
                  newErrors[index] = {
                    ...newErrors[index],
                    toQty: ''
                  };
                  return newErrors;
                });

                cumulativeToQty += numericValue;
              }
            } else {
              cumulativeToQty += isNaN(parseInt(r.toQty, 10)) ? 0 : parseInt(r.toQty, 10);
            }

            const newRemainQty = Math.max(numericFromQty - cumulativeToQty, 0);

            if (newRemainQty <= 0 && idx >= index) {
              shouldClearSubsequentRows = true;
            }

            // Clear subsequent rows if necessary
            if (shouldClearSubsequentRows && idx > index) {
              return {
                ...r,
                toQty: '',
                remainQty: ''
              };
            }

            return {
              ...r,
              toQty: idx === index ? value : r.toQty,
              remainQty: newRemainQty
            };
          }
          return r;
        });
      });
    } else {
      // Handle invalid input (non-numeric)
      setDetailTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          toQty: 'Only numbers are allowed'
        };
        return newErrors;
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(modalTableData.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmitSelectedRows = async () => {
    const selectedData = selectedRows.map((index) => modalTableData[index]);

    // Adding selected data to the existing table data
    setDetailTableData([...detailTableData, ...selectedData]);

    console.log('Data selected:', selectedData);

    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();

    try {
      await Promise.all(
        selectedData.map(async (data, idx) => {
          // Simulate the event object for handleToQtyChange
          const simulatedEvent = {
            target: {
              value: data.toQty // Assuming you have a toQty field in your data
            }
          };

          await getPartNo(data.fromBin, formData.transferFromFlag, data);
          await getGrnNo(data.partNo, data.fromBin);
          await getBatchNo(data.fromBin, data.partNo, data.grnNo);

          // Call handleToQtyChange with simulated event, row data, and index
          handleToQtyChange(simulatedEvent, data, detailTableData.length + idx);
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
  };

  const handleFullGrid = () => {
    getFillGridDetails();
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
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
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={!viewId ? handleSave : undefined} />
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
            apiUrl={`stockRestate/ExcelUploadForStockRestate?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
            screen="PutAway"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              // disableEditIcon={true}
              // viewIcon={true}
              toEdit={getStockRestateById}
            />
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3 mb-3">
                <TextField label="Document No" variant="outlined" size="small" fullWidth name="Doc ID" value={formData.docId} disabled />
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
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.transferFrom}>
                  <InputLabel id="transferFrom-label">
                    {
                      <span>
                        Transfer From <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="transferFrom-label"
                    id="transferFrom"
                    name="transferFrom"
                    label="Transfer From *"
                    value={formData.transferFrom}
                    onChange={handleInputChange}
                    disabled={viewId ? true : false}
                  >
                    {transferType?.map((row, index) => (
                      <MenuItem key={row.index} value={row.value.toUpperCase()}>
                        {row.value.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.transferFrom && <FormHelperText error>{fieldErrors.transferFrom}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.transferTo}>
                  <InputLabel id="transferTo-label">
                    {
                      <span>
                        Transfer To <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="transferTo-label"
                    id="transferTo"
                    name="transferTo"
                    label="Transfer To *"
                    value={formData.transferTo}
                    onChange={handleInputChange}
                    disabled={viewId ? true : false}
                  >
                    {getAvailableTransferTo(formData.transferFrom).map((row, index) => (
                      <MenuItem key={index} value={row.value}>
                        {row.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.transferTo && <FormHelperText error>{fieldErrors.transferTo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={<span>Entry No</span>}
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="entryNo"
                  value={formData.entryNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.entryNo}
                  helperText={fieldErrors.entryNo}
                  disabled={viewId && true}
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
                  <Tab value={0} label="Bin Details" />
                </Tabs>
              </Box>
              <Box className="mt-2" sx={{ padding: 1 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        {!viewId && (
                          <>
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                            <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                            <ActionButton title="Clear" icon={ClearIcon} onClick={() => handleTableClear('detailTableData')} />
                          </>
                        )}
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered" style={{ width: '100%' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  {!viewId && (
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                  )}
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="table-header">From Bin *</th>
                                  <th className="table-header">From Bin Type</th>
                                  <th className="table-header">Part No *</th>
                                  <th className="table-header">Part Desc</th>
                                  <th className="table-header">SKU</th>
                                  <th className="table-header">GRN No *</th>
                                  <th className="table-header">Batch No *</th>
                                  <th className="table-header">To Bin *</th>
                                  <th className="table-header">To Bin Type</th>
                                  <th className="table-header">From QTY</th>
                                  <th className="table-header">To QTY *</th>
                                  <th className="table-header">Remain QTY</th>
                                </tr>
                              </thead>
                              {!viewId ? (
                                <>
                                  <tbody>
                                    {detailTableData.length === 0 ? (
                                      <tr>
                                        <td colSpan="18" className="text-center py-2">
                                          No Data Found
                                        </td>
                                      </tr>
                                    ) : (
                                      <>
                                        {detailTableData.map((row, index) => (
                                          <tr key={row.id}>
                                            <td className="border px-2 py-2 text-center">
                                              <ActionButton
                                                title="Delete"
                                                icon={DeleteIcon}
                                                onClick={() => handleDeleteRow(row.id, detailTableData, setDetailTableData)}
                                              />
                                            </td>
                                            <td className="text-center">
                                              <div className="pt-2">{index + 1}</div>
                                            </td>
                                            <td className="border px-2 py-2">
                                              <select
                                                ref={lrNoDetailsRefs.current[index]?.fromBin}
                                                value={row.fromBin}
                                                style={{ width: '200px' }}
                                                onChange={(e) => handleFromBinChange(row, index, e)}
                                                className={detailTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                              >
                                                <option value="">-- Select --</option>
                                                {fromBinList?.map((row, index) => (
                                                  <option key={index} value={row.fromBin}>
                                                    {row.fromBin}
                                                  </option>
                                                ))}
                                              </select>
                                              {detailTableErrors[index]?.fromBin && (
                                                <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                  {detailTableErrors[index].fromBin}
                                                </div>
                                              )}
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                style={{ width: '300px' }}
                                                type="text"
                                                value={row.fromBinType}
                                                className={detailTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                                disabled
                                              />
                                            </td>
                                            <td className="border px-2 py-2">
                                              <select
                                                ref={lrNoDetailsRefs.current[index]?.partNo}
                                                value={row.partNo || ''}
                                                onChange={(e) => handlePartNoChange(row, index, e)}
                                                className={`form-control ${detailTableErrors[index]?.partNo ? 'error' : ''}`}
                                                style={{ width: '200px' }}
                                                aria-label="Part Number"
                                              >
                                                <option value="">-- Select --</option>
                                                {Array.isArray(row.rowPartNoList) &&
                                                  row.rowPartNoList.map(
                                                    (part, idx) =>
                                                      part &&
                                                      part.partNo && (
                                                        <option key={part.partNo} value={part.partNo}>
                                                          {part.partNo}
                                                        </option>
                                                      )
                                                  )}
                                              </select>
                                              {detailTableErrors[index]?.partNo && (
                                                <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                  {detailTableErrors[index].partNo}
                                                </div>
                                              )}
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                style={{ width: '300px' }}
                                                type="text"
                                                value={row.partDesc}
                                                className={detailTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                                disabled
                                              />
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                style={{ width: '300px' }}
                                                type="text"
                                                value={row.sku}
                                                className={detailTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                                disabled
                                              />
                                            </td>
                                            <td className="border px-2 py-2">
                                              <select
                                                ref={lrNoDetailsRefs.current[index]?.grnNo}
                                                value={row.grnNo}
                                                style={{ width: '200px' }}
                                                onChange={(e) => handleGrnNoChange(row, index, e)}
                                                className={detailTableErrors[index]?.grnNo ? 'error form-control' : 'form-control'}
                                              >
                                                <option value="">-- Select --</option>
                                                {grnNoList?.map((grn, index) => (
                                                  <option key={index} value={grn.grnNo}>
                                                    {grn.grnNo}
                                                  </option>
                                                ))}
                                              </select>
                                              {detailTableErrors[index]?.grnNo && (
                                                <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                  {detailTableErrors[index].grnNo}
                                                </div>
                                              )}
                                            </td>
                                            <td className="border px-2 py-2">
                                              <select
                                                ref={lrNoDetailsRefs.current[index]?.batchNo}
                                                value={row.batchNo}
                                                style={{ width: '200px' }}
                                                onChange={(e) => handleBatchNoChange(row, index, e)}
                                                className={detailTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                              >
                                                <option value="">-- Select --</option>
                                                {batchNoList?.map((batch, index) => (
                                                  <option key={index} value={batch.batchNo}>
                                                    {batch.batchNo}
                                                  </option>
                                                ))}
                                              </select>
                                              {detailTableErrors[index]?.batchNo && (
                                                <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                  {detailTableErrors[index].batchNo}
                                                </div>
                                              )}
                                            </td>
                                            <td className="border px-2 py-2">
                                              <select
                                                ref={lrNoDetailsRefs.current[index]?.toBin}
                                                value={row.toBin}
                                                style={{ width: '200px' }}
                                                onChange={(e) => handleToBinChange(row, index, e)}
                                                className={detailTableErrors[index]?.toBin ? 'error form-control' : 'form-control'}
                                              >
                                                <option value="">--Select--</option>
                                                {toBinList?.map((row, index) => (
                                                  <option key={index} value={row.toBin}>
                                                    {row.toBin}
                                                  </option>
                                                ))}
                                              </select>
                                              {detailTableErrors[index]?.toBin && (
                                                <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                  {detailTableErrors[index].toBin}
                                                </div>
                                              )}
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                style={{ width: '300px' }}
                                                type="text"
                                                value={row.toBinType}
                                                className={detailTableErrors[index]?.toBinType ? 'error form-control' : 'form-control'}
                                                disabled
                                              />
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                style={{ width: '150px' }}
                                                type="text"
                                                value={row.fromQty}
                                                className={detailTableErrors[index]?.fromQty ? 'error form-control' : 'form-control'}
                                                disabled
                                              />
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                ref={lrNoDetailsRefs.current[index]?.toQty}
                                                style={{ width: '150px' }}
                                                type="text"
                                                value={row.toQty}
                                                onChange={(e) => handleToQtyChange(e, row, index)} // Use the refactored function
                                                className={detailTableErrors[index]?.toQty ? 'error form-control' : 'form-control'}
                                                onKeyDown={(e) => handleKeyDown(e, row, detailTableData)}
                                              />
                                              {detailTableErrors[index]?.toQty && (
                                                <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                  {detailTableErrors[index].toQty}
                                                </div>
                                              )}
                                            </td>
                                            <td className="border px-2 py-2">
                                              <input
                                                style={{ width: '150px' }}
                                                type="text"
                                                value={row.remainQty}
                                                className={detailTableErrors[index]?.remainQty ? 'error form-control' : 'form-control'}
                                                disabled
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </>
                                    )}
                                  </tbody>
                                  {detailTableErrors.some((error) => error.general) && (
                                    <tfoot>
                                      <tr>
                                        <td colSpan={14} className="error-message">
                                          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                                            {detailTableErrors.find((error) => error.general)?.general}
                                          </div>
                                        </td>
                                      </tr>
                                    </tfoot>
                                  )}
                                </>
                              ) : (
                                <>
                                  <tbody>
                                    {detailTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.fromBin}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.fromBinType}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.partNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.partDesc}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.sku}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.grnNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.batchNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.toBin}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.toBinType}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.fromQty}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.toQty}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.remainQty}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </>
                              )}
                            </table>
                          </div>
                        </div>
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
                        <table className="table table-bordered ">
                          <thead>
                            <tr style={{ backgroundColor: '#673AB7' }}>
                              <th className="table-header">
                                <Checkbox checked={selectAll} onChange={handleSelectAll} />
                              </th>
                              <th className="table-header">S.No</th>
                              <th className="table-header">From Bin</th>
                              <th className="table-header">From Bin Type</th>
                              <th className="table-header">Part No</th>
                              <th className="table-header">Part Desc</th>
                              <th className="table-header">SKU</th>
                              <th className="table-header">GRN No</th>
                              <th className="table-header">Batch No</th>
                              <th className="table-header">To Bin</th>
                              <th className="table-header">To Bin Type</th>
                              <th className="table-header">From QTY</th>
                              <th className="table-header">To QTY</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalTableData.map((row, index) => (
                              <tr key={row.id}>
                                <td className="border p-0 text-center">
                                  <Checkbox
                                    checked={selectedRows.includes(index)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                    }}
                                  />
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {index + 1}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.fromBin}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.fromBinType}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.partNo}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.partDesc}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.sku}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.grnNo}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.batchNo}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.toBin}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.toBinType}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.fromQty}
                                </td>
                                <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                  {row.toQty}
                                </td>
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
                  <Button color="secondary" onClick={handleSubmitSelectedRows} variant="contained">
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

export default StockRestate;
