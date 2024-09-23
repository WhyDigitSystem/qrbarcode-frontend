import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import GridOnIcon from '@mui/icons-material/GridOn';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import sampleFile from '../../../assets/sample-files/sample_Location_movement.xls';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const LocationMovement = () => {
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [viewId, setViewId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [docId, setDocId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  // const [finYear, setFinYear] = useState(localStorage.getItem('finYear');
  const [finYear, setFinYear] = useState('2024');
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const storedScreens = JSON.parse(localStorage.getItem('screens')) || [];
  const [selectedBin, setSelectedBin] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fromBinList, setFromBinList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    docId: docId,
    docDate: dayjs(),
    entryNo: '',
    movedQty: ''
  });
  const [value, setValue] = useState(0);
  const [toBinList, setToBinList] = useState([]);
  const [partNoOptionsNew, setPartNoOptionsNew] = useState([]);
  const [partNoOptionsBin, setPartNoOptionsBin] = useState([]);
  const [fillGridData, setFillGridData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [childTableData, setChildTableData] = useState([
    // {
    //   id: 1,
    //   fromBin: '',
    //   partNo: '',
    //   partDesc: '',
    //   sku: '',
    //   grnNo: '',
    //   batchNo: '',
    //   avlQty: '',
    //   toBin: '',
    //   toBinType: '',
    //   toQty: '',
    //   remainQty: ''
    // }
  ]);

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = childTableData.map((_, index) => ({
      fromBin: lrNoDetailsRefs.current[index]?.fromBin || React.createRef(),
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      grnNo: lrNoDetailsRefs.current[index]?.grnNo || React.createRef(),
      batchNo: lrNoDetailsRefs.current[index]?.batchNo || React.createRef(),
      toBin: lrNoDetailsRefs.current[index]?.toBin || React.createRef(),
      toQty: lrNoDetailsRefs.current[index]?.toQty || React.createRef()
    }));
  }, [childTableData]);

  const [childTableErrors, setChildTableErrors] = useState([]);

  const [modalTableData, setModalTableData] = useState([
    {
      id: 1,
      fromBin: '',
      partNo: '',
      partDesc: '',
      batchNo: '',
      batchDate: null,
      palletNo: '',
      sQty: '',
      cellType: '',
      core: '',
      sku: '',
      expDate: null,
      pickQty: '',
      avlQty: '',
      runQty: '',
      qcFlag: '',
      stockDate: null,
      grnNo: '',
      grnDate: null,
      lotNo: ''
    }
  ]);
  const [modalTableErrors, setModalTableErrors] = useState([
    {
      id: 1,
      fromBin: '',
      partNo: '',
      partDesc: '',
      batchNo: '',
      batchDate: null,
      palletNo: '',
      sQty: '',
      cellType: '',
      core: '',
      sku: '',
      expDate: null,
      pickQty: '',
      avlQty: '',
      runQty: '',
      qcFlag: '',
      stockDate: null,
      grnNo: '',
      grnDate: null,
      lotNo: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: '',
    entryNo: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'entryNo', header: 'Entry No', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  useEffect(() => {
    getAllLocationMovement();
    getDocId();
    getAllFromBin();
    getToBinDetails();
    console.log('the screens from localstorage are:', storedScreens);
  }, []);
  useEffect(() => {
    const totalQty = childTableData.reduce((sum, row) => sum + (parseInt(row.toQty, 10) || 0), 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      movedQty: totalQty
    }));
  }, [childTableData]);

  const getDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getLocationMovementDocId?orgId=${orgId}&branchCode=${branchCode}&client=${client}&branch=${branch}&finYear=${finYear}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setDocId(response.paramObjectsMap.locationMovementDocId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          docId: response.paramObjectsMap.locationMovementDocId
        }));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllLocationMovement = async () => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getAllLocationMovementByOrgId?orgId=${orgId}&branchCode=${branchCode}&branch=${branch}&client=${client}&customer=${customer}&warehouse=${warehouse}&finYear=${finYear}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.locationMovementVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllFillGrid = async () => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getAllForLocationMovementDetailsFillGrid?orgId=${orgId}&branchCode=${branchCode}&branch=${branch}&client=${client}&entryNo=${formData.entryNo}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        // setFillGridData(response.paramObjectsMap.locationMovementDetailsVO);
        const gridDetails = response.paramObjectsMap.locationMovementDetailsVO;
        console.log('THE MODAL TABLE DATA FROM API ARE:', gridDetails);
        setModalTableData(
          gridDetails.map((row) => ({
            id: row.id,
            fromBin: row.bin,
            fromBinClass: row.binClass,
            fromBinType: row.binType,
            fromCellType: row.cellType,
            fromCore: row.core,
            partNo: row.partNo,
            partDesc: row.partDesc,
            sku: row.sku,
            grnNo: row.grnNo,
            grnDate: row.grnDate,
            batchNo: row.batchNo,
            batchDate: row.batchDate,
            expDate: row.expDate,
            // toBin: row.toBin,
            // toBinType: row.ToBinType,
            // toBinClass: row.ToBinClass,
            // toCellType: row.ToCellType,
            avlQty: row.avlQty,
            toQty: row.toQty,
            // fromCore: row.fromCore,
            // toCore: row.ToCore,
            qcFlag: row.qcFlag
          }))
        );
        setChildTableData([]);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllFromBin = async () => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getBinFromStockForLocationMovement?&orgId=${orgId}&branch=${branch}&branchCode=${branchCode}&client=${client}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        console.log('CHILD BIN LIST ARE:', response.paramObjectsMap.locationMovementDetailsVO);
        setFromBinList(response.paramObjectsMap.locationMovementDetailsVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFromBinChange = (row, index, event) => {
    const value = event.target.value;
    const selectedFromBin = fromBinList.find((b) => b.fromBin === value);
    console.log('THE SELECTED ROW IS:', row);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              fromBin: selectedFromBin.fromBin,
              fromBinType: selectedFromBin ? selectedFromBin.fromBinType : '',
              fromBinClass: selectedFromBin ? selectedFromBin.fromBinClass : '',
              fromCellType: selectedFromBin ? selectedFromBin.fromCellType : '',
              fromCore: selectedFromBin ? selectedFromBin.fromCore : '',
              fromBin: selectedFromBin.fromBin,
              rowPartNoList: [],
              partNo: '',
              partDesc: '',
              sku: '',
              grnNo: '',
              rowGrnNoList: [],
              batchNo: '',
              rowBatchNoList: [],
              avlQty: '',
              remainQty: '',
              toBin: '',
              toBinType: ''
            }
          : r
      )
    );
    setChildTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        fromBin: !value ? 'From Bin is required' : ''
      };
      return newErrors;
    });
    getPartNo(value, row);
  };
  const getPartNo = async (selectedFromBin, row) => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getPartNoAndPartDescFromStockForLocationMovement?&orgId=${orgId}&branch=${branch}&branchCode=${branchCode}&client=${client}&bin=${selectedFromBin}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      console.log('THE ROW IS:', row);

      if (response.status === true) {
        setChildTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowPartNoList: response.paramObjectsMap.locationMovementDetailsVO
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const handlePartNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedFromPartNo = row.rowPartNoList.find((b) => b.partNo === value);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              partNo: selectedFromPartNo ? selectedFromPartNo.partNo : '',
              partDesc: selectedFromPartNo ? selectedFromPartNo.partDesc : '',
              sku: selectedFromPartNo ? selectedFromPartNo.sku : '',
              grnNo: '',
              rowGrnNoList: [],
              batchNo: '',
              rowBatchNoList: [],
              avlQty: '',
              remainQty: '',
              toBin: '',
              toBinType: ''
            }
          : r
      )
    );
    setChildTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        partNo: !value ? 'Part number is required' : ''
      };
      return newErrors;
    });

    if (value) {
      getGrnNo(row.fromBin, value, row);
    }
  };
  const getGrnNo = async (selectedFromBin, selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getGrnNoDetailsForLocationMovement?bin=${selectedFromBin}&branch=${branch}&branchCode=${branchCode}&client=${client}&orgId=${orgId}&partNo=${selectedPartNo}`
      );
      console.log('THE FROM BIN LIST IS:', response);

      if (response.status === true) {
        setChildTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowGrnNoList: response.paramObjectsMap.grnDetails
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleGrnNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedGrnNo = row.rowGrnNoList.find((row) => row.grnNo === value);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              grnNo: selectedGrnNo.grnNo,
              grnDate: selectedGrnNo ? selectedGrnNo.grnDate : '',
              batchNo: '',
              rowBatchNoList: [],
              toBin: '',
              toBinType: '',
              avlQty: '',
              remainQty: ''
            }
          : r
      )
    );
    setChildTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getBatchNo(row.fromBin, row.partNo, value, row);
  };
  const getBatchNo = async (selectedFromBin, selectedPartNo, selectedGrnNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getBatchNoDetailsForLocationMovement?bin=${selectedFromBin}&branch=${branch}&branchCode=${branchCode}&client=${client}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}`
      );
      console.log('THE FROM BIN LIST IS:', response);
      if (response.status === true) {
        setChildTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBatchNoList: response.paramObjectsMap.batchDetails
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const handleBatchNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBatchNo = row.rowBatchNoList.find((row) => row.batchNo === value);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              batchNo: selectedBatchNo.batchNo,
              batchDate: selectedBatchNo ? selectedBatchNo.batchDate : '',
              expDate: selectedBatchNo ? selectedBatchNo.expDate : '',
              toBin: '',
              toBinType: '',
              avlQty: '',
              remainQty: ''
            }
          : r
      )
    );

    setChildTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getAvlQty(value, row.fromBin, row.grnNo, row.partNo, row);
  };

  const getAvlQty = async (selectedBatchNo, selectedFromBin, selectedGrnNo, selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getFromQtyForLocationMovement?batchNo=${selectedBatchNo}&bin=${selectedFromBin}&branch=${branch}&branchCode=${branchCode}&client=${client}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}`
      );
      console.log('THE ROW. TO BIN IS IS:', selectedPartNo);

      setChildTableData((prevData) =>
        prevData.map((r) =>
          r.id === row.id
            ? {
                ...r,
                avlQty: response.paramObjectsMap?.fromQty || r.avlQty
              }
            : r
        )
      );
    } catch (error) {
      console.error('Error fetching locationType data:', error);
    }
  };
  const getToBinDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `locationMovement/getToBinFromLocationStatusForLocationMovement?branch=${branch}&branchCode=${branchCode}&client=${client}&orgId=${orgId}&warehouse=${warehouse}`
      );
      console.log('THE TO BIN LIST ARE:', response);
      if (response.status === true) {
        setToBinList(response.paramObjectsMap.locationMovementDetailsVO);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const getAvailableToBins = (row, currentRowId) => {
    const selectedFromBin = childTableData.filter((row) => row.id === currentRowId).map((row) => row.fromBin);
    return toBinList.filter((bin) => !selectedFromBin.includes(bin.toBin));
  };
  const handleToBinChange = (row, index, event) => {
    const value = event.target.value;
    const selectedToBin = toBinList.find((row) => row.toBin === value);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              toBin: selectedToBin.toBin,
              toBinType: selectedToBin ? selectedToBin.toBinType : '',
              toBinClass: selectedToBin ? selectedToBin.toBinClass : '',
              toCellType: selectedToBin ? selectedToBin.toCellType : '',
              toCore: selectedToBin ? selectedToBin.toCore : ''
              // toCore: selectedToBin ? selectedToBin.toCore : ''
            }
          : r
      )
    );
    setChildTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        toBin: !value ? 'To Bin is required' : ''
      };
      return newErrors;
    });
    // getFromQty(row.batchNo, row.fromBin, row.grnNo, row.partNo, row);
  };

  //CURRENT WORKING FUNCTION
  const handleToQtyChange = (e, row, index) => {
    const value = e.target.value;
    const numericValue = isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10);
    const numericAvlQty = isNaN(parseInt(row.avlQty, 10)) ? 0 : parseInt(row.avlQty, 10);
    const intPattern = /^\d*$/;
    let exceedError = false;

    if (value === '') {
      setChildTableData((prev) => {
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
      setChildTableData((prev) => {
        let cumulativeToQty = 0;
        let clearRows = false;

        return prev.map((r, idx) => {
          if (r.fromBin === row.fromBin && r.partNo === row.partNo && r.grnNo === row.grnNo && r.batchNo === row.batchNo) {
            if (idx === index) {
              cumulativeToQty += numericValue;
            } else {
              cumulativeToQty += isNaN(parseInt(r.toQty, 10)) ? 0 : parseInt(r.toQty, 10);
            }

            const newRemainQty = Math.max(numericAvlQty - cumulativeToQty, 0);
            if (idx === index && numericValue > numericAvlQty - (cumulativeToQty - numericValue)) {
              exceedError = true;
              return {
                ...r,
                toQty: r.toQty,
                remainQty: r.remainQty
              };
            }
            if (idx > index) {
              const previousRemainQty = numericAvlQty - (cumulativeToQty - numericValue);
              if (previousRemainQty < numericValue) {
                clearRows = true;
              }
            }
            if (clearRows || newRemainQty < 0) {
              return {
                ...r,
                toQty: '',
                remainQty: ''
              };
            } else {
              return {
                ...r,
                toQty: idx === index ? value : r.toQty,
                remainQty: newRemainQty
              };
            }
          }
          return r;
        });
      });
      setChildTableErrors((prev) => {
        const newErrors = [...prev];
        if (exceedError) {
          newErrors[index] = {
            ...newErrors[index],
            toQty: `Quantity exceeds the available amount`
          };
        } else {
          newErrors[index] = {
            ...newErrors[index],
            toQty: ''
          };
        }
        return newErrors;
      });
    } else {
      setChildTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          toQty: 'Only numbers are allowed'
        };
        return newErrors;
      });
    }
  };

  const getLocationMovementById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `locationMovement/getLocationMovementById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularLocationMovement = response.paramObjectsMap.locationMovementVO;
        console.log('THE PARTICULAR LOCATION MOVEMENT IS:', particularLocationMovement);
        setFormData({
          docId: particularLocationMovement.docId,
          docDate: particularLocationMovement.docDate ? dayjs(particularLocationMovement.docDate) : dayjs(),
          entryNo: particularLocationMovement.entryNo,
          movedQty: particularLocationMovement.movedQty
        });
        setChildTableData(
          particularLocationMovement.locationMovementDetailsVO.map((detail) => ({
            id: detail.id,
            fromBin: detail.bin || '',
            fromBinClass: detail.binClass,
            fromBinType: detail.fromBinType,
            fromCellType: detail.cellType,
            fromCore: detail.core,
            expDate: detail.expDate,
            partNo: detail.partNo,
            partNo: detail.partNo || '',
            partDesc: detail.partDesc || '',
            batchNo: detail.batchNo || '',
            batchDate: detail.batchDate || '',
            grnNo: detail.grnNo || '',
            grnDate: detail.grnDate || '',
            sku: detail.sku || '',
            avlQty: detail.fromQty || '', // Assuming fromQty is the available quantity
            toQty: detail.toQty || '',
            remainingQty: detail.remainingQty || '',
            toBin: detail.toBin,
            toCellType: detail.toCellType,
            toBinType: detail.toBinType,
            remainQty: detail.remainingQty
          }))
        );
        setViewId(row.original.id);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const nameRegex = /^[A-Za-z ]*$/;
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;
    const numericRegex = /^[0-9]*$/;
    const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
    const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

    let errorMessage = '';

    switch (name) {
      case 'customer':
      case 'shortName':
        if (!nameRegex.test(value)) {
          errorMessage = 'Only alphabetic characters are allowed';
        }
        break;
      case 'pan':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'branchName':
        if (!branchNameRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters and @, _, -, * are allowed';
        }
        break;
      case 'mobile':
        if (!numericRegex.test(value)) {
          errorMessage = 'Only numeric characters are allowed';
        } else if (value.length > 10) {
          errorMessage = 'Invalid Format';
        }
        break;
      case 'gst':
        if (!alphaNumericRegex.test(value)) {
          errorMessage = 'Only alphanumeric characters are allowed';
        } else if (value.length > 15) {
          errorMessage = 'Invalid Format';
        }
        break;
      default:
        break;
    }

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'active') {
        setFormData({ ...formData, [name]: checked });
      } else if (name === 'email') {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };
  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        handleAddRow();
      }
    }
  };

  const handleAddRow = () => {
    console.log('THE HANDLE ADD ROW FUNCTION IS WORKING');

    if (isLastRowEmpty(childTableData)) {
      displayRowError(childTableData);
      return;
    }
    console.log('the ok');

    const newRow = {
      id: Date.now(),
      batchDate: '',
      rowBatchNoList: [],
      batchNo: '',
      fromBin: '',
      binClass: '',
      binType: '',
      cellType: '',
      clientCode: '',
      core: '',
      expDate: '',
      avlQty: '',
      grnDate: '',
      rowGrnNoList: [],
      grnNo: '',
      lotNo: '',
      partDesc: '',
      rowPartNoList: [],
      partNo: '',
      pcKey: '',
      qcFlag: '',
      remainQty: '',
      sku: '',
      ssku: '',
      status: '',
      stockDate: '',
      toBin: '',
      toQty: ''
    };
    setChildTableData([...childTableData, newRow]);
    setChildTableErrors([
      ...childTableErrors,
      {
        batchDate: '',
        batchNo: '',
        fromBin: '',
        fromQty: '',
        grnDate: '',
        grnNo: '',
        lotNo: '',
        partDesc: '',
        partNo: '',
        remainQty: '',
        sku: '',
        toBin: '',
        toQty: ''
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === childTableData) {
      return !lastRow.fromBin || !lastRow.partNo || !lastRow.grnNo || !lastRow.batchNo || !lastRow.toBin || !lastRow.toQty;
    }
    // else if (table === branchTableData) {
    //   return !lastRow.branchCode;
    // } else if (table === clientTableData) {
    //   return !lastRow.customer || !lastRow.client;
    // }
    return false;
  };

  const displayRowError = (table) => {
    if (table === childTableData) {
      setChildTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          fromBin: !table[table.length - 1].fromBin ? 'fromBin is required' : '',
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          grnNo: !table[table.length - 1].grnNo ? 'GRN No is required' : '',
          batchNo: !table[table.length - 1].batchNo ? 'Batch No is required' : '',
          toBin: !table[table.length - 1].toBin ? 'To Bin is required' : '',
          toQty: !table[table.length - 1].toQty ? 'To Qty is required' : ''
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

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      refNo: '',
      refDate: '',
      active: true,
      entryNo: ''
    });
    setChildTableData([]);
    setChildTableErrors([]);

    setFieldErrors({
      docId: '',
      docDate: '',
      entryNo: ''
    });
    setViewId('');
    getDocId();
  };
  const handleTableClear = (table) => {
    if (table === 'childTableData') {
      setChildTableData([]);
      setChildTableErrors([]);
    }
  };

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;

    let childTableDataValid = true;
    if (!childTableData || !Array.isArray(childTableData) || childTableData.length === 0) {
      childTableDataValid = false;
      setChildTableErrors([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = childTableData.map((row, index) => {
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
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].batchNo;
          rowErrors.batchNo = 'Batch No is required';
        }
        if (!row.toBin) {
          rowErrors.toBin = 'To Bin is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].toBin;
        }
        if (!row.toQty) {
          rowErrors.toQty = 'To QTY is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].toQty;
        }

        if (Object.keys(rowErrors).length > 0) childTableDataValid = false;

        return rowErrors;
      });

      setChildTableErrors(newTableErrors);
    }

    if (!childTableDataValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
    } else {
      // Proceed with form submission
    }

    if (childTableDataValid) {
      setIsLoading(true);
      const childVO = childTableData.map((row) => ({
        fromBin: row.fromBin,
        fromBinClass: row.fromBinClass,
        fromBinType: row.fromBinType,
        fromCellType: row.fromCellType,
        fromCore: row.fromCore,
        toCore: row.toCore,
        partNo: row.partNo,
        partDesc: row.partDesc,
        batchNo: row.batchNo,
        batchDate: row.batchDate,
        lotNo: row.lotNo,
        grnNo: row.grnNo,
        grnDate: row.grnDate,
        sku: row.sku,
        ssku: row.sku,
        fromQty: parseInt(row.avlQty),
        // qty: parseInt(row.qty),
        expDate: row.expDate,
        toBin: row.toBin,
        binClass: row.binClass,
        binType: row.binType,
        remainingQty: row.remainingQty,
        toQty: parseInt(row.toQty),
        toBinClass: row.toBinClass,
        toCellType: row.toCellType,
        toBinType: row.toBinType,
        qcFlag: 'T'
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        docDate: formData.docDate,
        entryNo: formData.entryNo === '' ? null : formData.entryNo,
        // entryNo: formData.entryNo,
        movedQty: formData.movedQty,
        locationMovementDetailsDTO: childVO,
        orgId: orgId,
        createdBy: loginUserName,
        branch: branch,
        branchCode: branchCode,
        client: client,
        customer: customer,
        finYear: finYear,
        warehouse: warehouse
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `locationMovement/createUpdateLocationMovement`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? ' Location Movement Updated Successfully' : 'Location Movement created successfully');
          getAllLocationMovement();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Location Movement failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Location Movement failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleFullGrid = () => {
    setModalOpen(true);
    getAllFillGrid();
  };
  const handleCloseModal = () => {
    setModalOpen(false);
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

    setChildTableData((prev) => [...prev, ...selectedData]);

    console.log('Data selected:', selectedData);

    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();

    try {
      await Promise.all(
        selectedData.map(async (data, idx) => {
          const simulatedEvent = {
            target: {
              value: data.partNo
            }
          };

          await getPartNo(data.fromBin, data);
          await getGrnNo(data.fromBin, data.partNo, data);
          await getBatchNo(data.fromBin, data.partNo, data.grnNo, data);
          await getAvlQty(data.batchNo, data.fromBin, data.grnNo, data.partNo, data);
          // handlePartNoChange(data, childTableData.length + idx, simulatedEvent);
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
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
            {!viewId && <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />}
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
            apiUrl={`locationMovement/ExcelUploadForLocationMovement?branch=${branch}&branchCode=${branchCode}&client=${client}&createdBy=${loginUserName}&customer=${customer}&finYear=${finYear}&orgId=${orgId}&type=DOC&warehouse=${warehouse}`}
            screen="PutAway"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getLocationMovementById} />
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
                  disabled
                  value={formData.docId}
                  onChange={handleInputChange}
                  error={!!fieldErrors.docId}
                  helperText={fieldErrors.docId}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Document Date"
                      value={formData.docDate}
                      disabled
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.docDate}
                      helperText={fieldErrors.docDate && 'Required'}
                    />
                  </LocalizationProvider>
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
              <div className="col-md-3 mb-3">
                <TextField
                  label="Moved Qty"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled
                  name="movedQty"
                  value={formData.movedQty}
                  onChange={handleInputChange}
                  error={!!fieldErrors.movedQty}
                  helperText={fieldErrors.movedQty}
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
                  <Tab value={0} label="Details" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        {!viewId && (
                          <>
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                            <ActionButton title="Fill Grid" icon={GridOnIcon} onClick={handleFullGrid} />
                            <ActionButton title="Clear" icon={ClearIcon} onClick={() => handleTableClear('childTableData')} />{' '}
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
                                    <>
                                      <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                        Action
                                      </th>
                                    </>
                                  )}
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">From Bin *</th>
                                  <th className="px-2 py-2 text-white text-center">Part No *</th>
                                  <th className="px-2 py-2 text-white text-center">Part Desc</th>
                                  <th className="px-2 py-2 text-white text-center">SKU</th>
                                  <th className="px-2 py-2 text-white text-center">GRN No *</th>
                                  <th className="px-2 py-2 text-white text-center">Batch No *</th>
                                  <th className="px-2 py-2 text-white text-center">Avl Qty</th>
                                  <th className="px-2 py-2 text-white text-center">To Bin *</th>
                                  <th className="px-2 py-2 text-white text-center">To Bin Type</th>
                                  <th className="px-2 py-2 text-white text-center">To Qty *</th>
                                  <th className="px-2 py-2 text-white text-center">Remaining Qty</th>
                                </tr>
                              </thead>
                              {!viewId ? (
                                <>
                                  <tbody>
                                    {childTableData.length === 0 ? (
                                      <tr>
                                        <td colSpan="18" className="text-center py-2">
                                          No Data Found
                                        </td>
                                      </tr>
                                    ) : (
                                      childTableData.map((row, index) => (
                                        <tr key={row.id}>
                                          {!viewId && (
                                            <>
                                              <td className="border px-2 py-2 text-center">
                                                <ActionButton
                                                  title="Delete"
                                                  icon={DeleteIcon}
                                                  onClick={() =>
                                                    handleDeleteRow(
                                                      row.id,
                                                      childTableData,
                                                      setChildTableData,
                                                      childTableErrors,
                                                      setChildTableErrors
                                                    )
                                                  }
                                                />
                                              </td>
                                            </>
                                          )}
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.fromBin}
                                              value={row.fromBin}
                                              style={{ width: '130px' }}
                                              onChange={(e) => handleFromBinChange(row, index, e)}
                                              className={childTableErrors[index]?.fromBin ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {fromBinList &&
                                                fromBinList.map((option) => (
                                                  <option key={option.fromBin} value={option.fromBin}>
                                                    {option.fromBin}
                                                  </option>
                                                ))}
                                            </select>

                                            {childTableErrors[index]?.fromBin && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index].fromBin}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.partNo}
                                              value={row.partNo}
                                              style={{ width: '130px' }}
                                              onChange={(e) => handlePartNoChange(row, index, e)}
                                              className={childTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">-- Select --</option>
                                              {/* {row.rowPartNoList.length > 1 && <option value="">-- Select --</option>} */}
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

                                            {childTableErrors[index]?.partNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index].partNo}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.partDesc}
                                              disabled
                                              style={{ width: '200px' }}
                                              className={childTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              value={row.sku}
                                              disabled
                                              style={{ width: '100px' }}
                                              className={childTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.grnNo}
                                              value={row.grnNo}
                                              style={{ width: '225px' }}
                                              onChange={(e) => handleGrnNoChange(row, index, e)}
                                              className={childTableErrors[index]?.grnNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">-- Select --</option>
                                              {/* {row.rowGrnNoList.length > 1 && <option value="">-- Select --</option>} */}
                                              {Array.isArray(row.rowGrnNoList) &&
                                                row.rowGrnNoList.map(
                                                  (grn, idx) =>
                                                    grn &&
                                                    grn.grnNo && (
                                                      <option key={grn.grnNo} value={grn.grnNo}>
                                                        {grn.grnNo}
                                                      </option>
                                                    )
                                                )}
                                            </select>
                                            {childTableErrors[index]?.grnNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index].grnNo}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.batchNo}
                                              value={row.batchNo}
                                              style={{ width: '200px' }}
                                              onChange={(e) => handleBatchNoChange(row, index, e)}
                                              className={childTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">-- Select --</option>
                                              {/* {row.rowBatchNoList.length > 1 && <option value="">-- Select --</option>} */}
                                              {Array.isArray(row.rowBatchNoList) &&
                                                row.rowBatchNoList.map(
                                                  (batch, idx) =>
                                                    batch &&
                                                    batch.batchNo && (
                                                      <option key={batch.batchNo} value={batch.batchNo}>
                                                        {batch.batchNo}
                                                      </option>
                                                    )
                                                )}
                                            </select>
                                            {childTableErrors[index]?.batchNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index].batchNo}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              style={{ width: '150px' }}
                                              type="text"
                                              value={row.avlQty}
                                              className={childTableErrors[index]?.avlQty ? 'error form-control' : 'form-control'}
                                              disabled
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.toBin}
                                              value={row.toBin}
                                              style={{ width: '200px' }}
                                              onChange={(e) => handleToBinChange(row, index, e)}
                                              className={childTableErrors[index]?.toBin ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {getAvailableToBins(row, row.id).map((bin, index) => (
                                                <option key={index} value={bin.toBin}>
                                                  {bin.toBin}
                                                </option>
                                              ))}
                                            </select>
                                            {childTableErrors[index]?.toBin && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index].toBin}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              style={{ width: '200px' }}
                                              type="text"
                                              value={row.toBinType}
                                              className={childTableErrors[index]?.toBinType ? 'error form-control' : 'form-control'}
                                              disabled
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              ref={lrNoDetailsRefs.current[index]?.toQty}
                                              style={{ width: '150px' }}
                                              type="text"
                                              value={row.toQty}
                                              onChange={(e) => handleToQtyChange(e, row, index)}
                                              className={childTableErrors[index]?.toQty ? 'error form-control' : 'form-control'}
                                              onKeyDown={(e) => handleKeyDown(e, row, childTableData)}
                                            />
                                            {childTableErrors[index]?.toQty && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {childTableErrors[index].toQty}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              style={{ width: '150px' }}
                                              type="text"
                                              value={row.remainQty}
                                              className={childTableErrors[index]?.remainQty ? 'error form-control' : 'form-control'}
                                              disabled
                                            />
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                  {childTableErrors.some((error) => error.general) && (
                                    <tfoot>
                                      <tr>
                                        <td colSpan={13} className="error-message">
                                          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                                            {childTableErrors.find((error) => error.general)?.general}
                                          </div>
                                        </td>
                                      </tr>
                                    </tfoot>
                                  )}
                                </>
                              ) : (
                                <>
                                  <tbody>
                                    {childTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.fromBin}
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
                                          {row.avlQty}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.toBin}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.toBinType}
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

                    <Dialog
                      open={modalOpen}
                      maxWidth={'md'}
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
                                      <Checkbox checked={selectAll} onChange={handleSelectAll} />
                                    </th>
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                      S.No
                                    </th>
                                    <th className="table-header">Bin</th>
                                    <th className="table-header">Part No</th>
                                    <th className="table-header">Part Description</th>
                                    <th className="table-header">SKU</th>
                                    <th className="table-header">GRN No</th>
                                    <th className="table-header">GRN Date</th>
                                    <th className="table-header">Batch No</th>
                                    <th className="table-header">From Qty</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modalTableData?.map((row, index) => (
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
                                      <td className="text-center">{index + 1}</td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.fromBin || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.partNo || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.partDesc || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.sku || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.grnNo || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.grnDate || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.batchNo || ''}
                                      </td>
                                      <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                        {row.avlQty || ''}
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
export default LocationMovement;
