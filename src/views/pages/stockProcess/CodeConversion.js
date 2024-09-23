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
import { getAllActiveCpartNo } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import React, { useRef } from 'react';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export const CodeConversion = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [cPartNoList, setCPartNoList] = useState([]);
  const [cPalletList, setCPalletList] = useState([]);
  const [partNoList, setPartNoList] = useState([]);
  const [grnNoList, setGrnNoList] = useState([]);
  const [locationTypeList, setLocationTypeList] = useState([]);
  const [batchNoList, setBatchNoList] = useState([]);
  const [palletList, setPalletList] = useState([]);
  const [avgQty, setAvgQty] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [cbranch, setCbranch] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const [finYear, setFinYear] = useState('2024');
  const [codeConversionDocId, setCodeConversionDocId] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewId, setViewId] = useState('');

  const [formData, setFormData] = useState({
    docdate: dayjs()
  });
  const [value, setValue] = useState(0);

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      partNo: '',
      partDescription: '',
      rowGrnNoList: [],
      grnNo: '',
      sku: '',
      rowBinTypeList: [],
      binType: '',
      rowBatchNoList: [],
      batchNo: '',
      lotNo: '',
      rowBinList: [],
      bin: '',
      qty: '',
      actualQty: '',
      rate: '',
      convertQty: '',
      crate: '',
      cpartNo: '',
      cpartDesc: '',
      csku: '',
      cbatchNo: '',
      clotNo: '',
      cbin: '',
      remarks: ''
    };
    setCodeConversionDetailsTable([...codeConversionDetailsTable, newRow]);
    setCodeConversionDetailsError([
      ...codeConversionDetailsError,
      {
        partNo: '',
        partDescription: '',
        grnNo: '',
        sku: '',
        binType: '',
        batchNo: '',
        lotNo: '',
        bin: '',
        qty: '',
        actualQty: '',
        rate: '',
        convertQty: '',
        crate: '',
        cpartNo: '',
        cpartDesc: '',
        csku: '',
        cbatchNo: '',
        clotNo: '',
        cbin: '',
        remarks: ''
      }
    ]);
  };

  const [codeConversionDetailsError, setCodeConversionDetailsError] = useState([
    {
      partNo: '',
      partDescription: '',
      grnNo: '',
      sku: '',
      binType: '',
      batchNo: '',
      lotNo: '',
      bin: '',
      qty: '',
      actualQty: '',
      rate: '',
      convertQty: '',
      crate: '',
      cpartNo: '',
      cpartDesc: '',
      csku: '',
      cbatchNo: '',
      clotNo: '',
      cbin: '',
      remarks: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docdate: new Date()
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Code Conversion ID', size: 140 },
    { accessorKey: 'docDate', header: 'Code Conversion Date', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  const [codeConversionDetailsTable, setCodeConversionDetailsTable] = useState([
    {
      partNo: '',
      partDescription: '',
      sku: '',
      grnNo: '',
      binType: '',
      batchNo: '',
      bin: '',
      qty: '',
      actualQty: '',
      convertQty: '',
      cpartNo: '',
      cpartDesc: '',
      csku: '',
      cbin: '',
      remarks: ''
    }
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getCodeConversionDocId();
    getAllPartNo();
    getAllCPartNo();
    getAllcPallet();
    getAllCodeConversions();
  }, []);

  const getCodeConversionDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getCodeConversionDocId?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setCodeConversionDocId(response.paramObjectsMap.CodeConversionDocId);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPartNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getPartNoAndPartDescFromStockForCodeConversion?branchCode=${cbranch}&client=${client}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setPartNoList(response.paramObjectsMap.codeConversionVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handlePartNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedFromPartNo = partNoList.find((b) => b.partNo === value);
    setCodeConversionDetailsTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              partNo: selectedFromPartNo ? selectedFromPartNo.partNo : '',
              partDescription: selectedFromPartNo ? selectedFromPartNo.partDesc : '',
              sku: selectedFromPartNo ? selectedFromPartNo.sku : ''
            }
          : r
      )
    );
    setCodeConversionDetailsError((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        partNo: !value ? 'Part number is required' : ''
      };
      return newErrors;
    });
    if (value) {
      getAllGrnNo(value, row);
    }
  };

  const getAllGrnNo = async (partNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getGrnNoAndGrnDateFromStockForCodeConversion?branchCode=${cbranch}&client=${client}&orgId=${orgId}&partNo=${partNo}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);
      if (response.status === true) {
        setCodeConversionDetailsTable((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowGrnNoList: response.paramObjectsMap.codeConversionVO
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGrnNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedGrnNo = row.rowGrnNoList.find((row) => row.grnNo === value);
    setCodeConversionDetailsTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              grnNo: selectedGrnNo.grnNo,
              grnDate: selectedGrnNo.grnDate
            }
          : r
      )
    );
    setCodeConversionDetailsError((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getAllBinType(value, row.partNo, row);
  };

  const getAllBinType = async (grnNo, partNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getBinTypeFromStockForCodeConversion?branchCode=${cbranch}&client=${client}&grnNo=${grnNo}&orgId=${orgId}&partNo=${partNo}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setCodeConversionDetailsTable((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBinTypeList: response.paramObjectsMap.codeConversionVO
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleBinTypeChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBinType = row.rowBinTypeList.find((row) => row.binType === value);
    setCodeConversionDetailsTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              binType: selectedBinType.binType
            }
          : r
      )
    );
    setCodeConversionDetailsError((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        binType: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getAllBatchNo(value, row.grnNo, row.partNo, row);
  };

  const getAllBatchNo = async (binType, grnNo, partNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getBatchNoFromStockForCodeConversion?binType=${binType}&branchCode=${cbranch}&client=${client}&grnNo=${grnNo}&orgId=${orgId}&partNo=${partNo}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setCodeConversionDetailsTable((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBatchNoList: response.paramObjectsMap.codeConversionVO
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleBatchNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBatchNo = row.rowBatchNoList.find((row) => row.batchNo === value);
    setCodeConversionDetailsTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              batchNo: selectedBatchNo.batchNo,
              batchDate: selectedBatchNo.batchDate,
              expDate: selectedBatchNo.expDate,
              lotNo: selectedBatchNo.lotNo
            }
          : r
      )
    );
    setCodeConversionDetailsError((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        batchNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getAllBin(value, row.binType, row.grnNo, row.partNo, row);
  };

  const getAllBin = async (batchNo, binType, grnNo, partNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getBinFromStockForCodeConversion?batchNo=${batchNo}&binType=${binType}&branchCode=${cbranch}&client=${client}&grnNo=${grnNo}&orgId=${orgId}&partNo=${partNo}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setCodeConversionDetailsTable((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBinList: response.paramObjectsMap.codeConversionVO
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBinChange = (row, index, event) => {
    const value = event.target.value;
    const selectedBin = row.rowBinList.find((row) => row.bin === value);
    setCodeConversionDetailsTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              bin: selectedBin.bin,
              binClass: selectedBin.binClass,
              cellType: selectedBin.cellType,
              core: selectedBin.core
            }
          : r
      )
    );
    setCodeConversionDetailsError((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        bin: !value ? 'Bin is required' : ''
      };
      return newErrors;
    });

    getTableQty(value, row.batchNo, row.binType, row.grnNo, row.partNo, row);
  };

  const getTableQty = async (bin, batchNo, binType, grnNo, partNo, row) => {
    try {
      const url = `codeconversion/getAvlQtyCodeConversion?batchNo=${batchNo}&bin=${bin}&binType=${binType}&branch=${branch}&branchCode=${cbranch}&client=${client}&grnNo=${grnNo}&orgId=${orgId}&partNo=${partNo}&warehouse=${warehouse}`;

      const response = await apiCalls('get', url);

      console.log('API Response:', response);

      if (response.status === true) {
        setCodeConversionDetailsTable((prevData) =>
          prevData.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  qty: response.paramObjectsMap.AvgQty || 0
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const getAllCPartNo = async () => {
    try {
      const cPartData = await getAllActiveCpartNo(cbranch, client, orgId);
      console.log('Processed Data:', cPartData);
      if (cPartData && cPartData.length > 0) {
        setCPartNoList(cPartData);
      } else {
        console.warn('No suppliers found');
      }
    } catch (error) {
      console.error('Error fetching supplier data:', error);
    }
  };
  const getAllcPallet = async () => {
    try {
      const response = await apiCalls(
        'get',
        `vasputaway/getToBinDetailsVasPutaway?branchCode=${cbranch}&client=${client}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setCPalletList(response.paramObjectsMap.ToBin);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllCodeConversions = async () => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getAllCodeConversion?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.codeConversionVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getCodeConversionById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `codeconversion/getCodeConversionById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setViewId(row.original.id);
        const particularCodeConversion = response.paramObjectsMap.codeConversionVO;
        console.log('THE PARTICULAR CUSTOMER IS:', particularCodeConversion);
        setCodeConversionDocId(particularCodeConversion.docId);
        setFormData({
          docdate: particularCodeConversion.docDate
        });
        setCodeConversionDetailsTable(
          particularCodeConversion.codeConversionDetailsVO.map((detail) => ({
            id: detail.id,
            partNo: detail.partNo,
            partDescription: detail.partDesc,
            sku: detail.sku,
            grnNo: detail.grnNo,
            binType: detail.binType,
            batchNo: detail.batchNo,
            bin: detail.bin,
            qty: detail.qty,
            actualQty: detail.actualQty,
            convertQty: detail.convertQty,
            cpartNo: detail.cpartNo,
            cpartDesc: detail.cpartDesc,
            csku: detail.csku,
            cbatchNo: detail.cbatchNo,
            cbin: detail.cbin,
            remarks: detail.remarks
          }))
        );
      } else {
        console.error('API Error:', response);
      }
      setListView(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleDeleteRow = (id) => {
    setCodeConversionDetailsTable(codeConversionDetailsTable.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === codeConversionDetailsTable[codeConversionDetailsTable.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };

  const handleClear = () => {
    setCodeConversionDocId('');
    setFormData({
      docdate: dayjs()
    });
    setCodeConversionDetailsTable([]);
    setCodeConversionDetailsError([]);
    setFieldErrors({
      docdate: new Date()
    });
    setViewId('');
    getCodeConversionDocId();
  };

  const handleTableClear = (table) => {
    if (table === 'codeConversionDetailsTable') {
      setCodeConversionDetailsTable([]);
      setCodeConversionDetailsError([]);
    }
  };

  const lrNoDetailsRefs = useRef([]);

  // useEffect(() => {
  //   lrNoDetailsRefs.current = codeConversionDetailsTable.map((_, i) => ({
  //     partNo: lrNoDetailsRefs.current[i]?.partNo || React.createRef(),
  //     grnNo: lrNoDetailsRefs.current[i]?.grnNo || React.createRef(),
  //     binType: lrNoDetailsRefs.current[i]?.binType || React.createRef(),
  //     batchNo: lrNoDetailsRefs.current[i]?.batchNo || React.createRef(),
  //     bin: lrNoDetailsRefs.current[i]?.bin || React.createRef(),
  //     actualQty: lrNoDetailsRefs.current[i]?.actualQty || React.createRef(),
  //     convertQty: lrNoDetailsRefs.current[i]?.convertQty || React.createRef(),
  //     cpartNo: lrNoDetailsRefs.current[i]?.cpartNo || React.createRef(),
  //     cbatchNo: lrNoDetailsRefs.current[i]?.cbatchNo || React.createRef(),
  //     cbin: lrNoDetailsRefs.current[i]?.cbin || React.createRef()
  //   }));
  // }, [codeConversionDetailsTable]);

  useEffect(() => {
    lrNoDetailsRefs.current = codeConversionDetailsTable.map((_, index) => ({
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      grnNo: lrNoDetailsRefs.current[index]?.grnNo || React.createRef(),
      binType: lrNoDetailsRefs.current[index]?.binType || React.createRef(),
      batchNo: lrNoDetailsRefs.current[index]?.batchNo || React.createRef(),
      bin: lrNoDetailsRefs.current[index]?.bin || React.createRef(),
      actualQty: lrNoDetailsRefs.current[index]?.actualQty || React.createRef(),
      convertQty: lrNoDetailsRefs.current[index]?.convertQty || React.createRef(),
      cpartNo: lrNoDetailsRefs.current[index]?.cpartNo || React.createRef(),
      cbin: lrNoDetailsRefs.current[index]?.cbin || React.createRef()
    }));
  }, [codeConversionDetailsTable]);

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;

    let codeConversionDetailsTableValid = true;
    if (!codeConversionDetailsTable || !Array.isArray(codeConversionDetailsTable) || codeConversionDetailsTable.length === 0) {
      codeConversionDetailsTableValid = false;
      setCodeConversionDetailsError([{ general: 'Table Data is required' }]);
    } else {
      const newTableErrors = codeConversionDetailsTable.map((row, index) => {
        const rowErrors = {};
        if (!row.partNo) {
          rowErrors.partNo = 'Part No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partNo;
        }

        if (!row.grnNo) {
          rowErrors.grnNo = 'GRN No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].grnNo;
        }

        if (!row.binType) {
          rowErrors.binType = 'Bin Type is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].binType;
        }

        if (!row.batchNo) {
          rowErrors.batchNo = 'Batch No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].batchNo;
        }

        if (!row.bin) {
          rowErrors.bin = 'Bin is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].bin;
        }

        if (!row.actualQty) {
          rowErrors.actualQty = 'Actual Qty is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].actualQty;
        }

        if (!row.convertQty) {
          rowErrors.convertQty = 'Convert Qty is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].convertQty;
        }

        if (!row.cpartNo) {
          rowErrors.cpartNo = 'Cpart No is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].cpartNo;
        }

        if (!row.cbin) {
          rowErrors.cbin = 'C Bin is required';
          if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].cbin;
        }

        if (Object.keys(rowErrors).length > 0) codeConversionDetailsTableValid = false;
        return rowErrors;
      });

      if (!codeConversionDetailsTableValid || Object.keys(errors).length > 0) {
        // Focus on the first invalid field
        if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
          firstInvalidFieldRef.current.focus();
        }
      } else {
        // Proceed with form submission
      }

      setCodeConversionDetailsError(newTableErrors);
    }

    if (Object.keys(errors).length === 0 && codeConversionDetailsTableValid) {
      setIsLoading(true);

      const detailsVO = codeConversionDetailsTable.map((row) => ({
        ...(viewId && { id: row.id }),
        actualQty: parseInt(row.actualQty),
        batchDate: row.batchDate,
        batchNo: row.batchNo,
        bin: row.bin,
        binClass: row.binClass,
        binType: row.binType,
        cbatchDate: row.cbatchDate,
        cbatchNo: row.cbatchNo,
        cbin: row.cbin,
        cbinClass: row.cBinClass,
        cbinType: row.cBinType,
        ccellType: row.cCellType,
        cclientCode: row.cclientCode,
        ccore: row.cCore,
        cellType: row.cellType,
        cexpDate: row.cexpDate,
        clientCode: row.clientCode,
        clotNo: row.clotNo,
        convertQty: parseInt(row.convertQty),
        core: row.core,
        cpartDesc: row.cpartDesc,
        cpartNo: row.cpartNo,
        cpckey: row.cpckey,
        crate: row.crate,
        csku: row.csku,
        cssku: row.cssku,
        cstockDate: row.cstockDate,
        expDate: row.expDate,
        grnDate: row.grnDate,
        grnNo: row.grnNo,
        lotNo: row.lotNo,
        partDesc: row.partDescription,
        partNo: row.partNo,
        pckey: row.pckey,
        qcFlag: row.qcFlag,
        qty: parseInt(row.qty),
        rate: row.rate,
        remarks: row.remarks,
        sku: row.sku,
        ssku: row.ssku,
        status: row.status,
        stockDate: row.stockDate
      }));

      const saveFormData = {
        ...(viewId && { id: viewId }),
        branch: branch,
        branchCode: cbranch,
        client: client,
        createdBy: loginUserName,
        customer: customer,
        finYear: finYear,
        orgId: orgId,
        warehouse: warehouse,
        codeConversionDetailsDTO: detailsVO
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `codeconversion/createUpdateCodeConversion`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          getAllCodeConversions();
          showToast('success', viewId ? 'Code Conversion In Updated Successfully' : 'Code Conversion In created successfully');
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Code Conversion In creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', error.message);
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

  const handleClose = () => {
    setFormData({
      docdate: null
    });
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
    setCodeConversionDetailsTable([...codeConversionDetailsTable, ...selectedData]);
    console.log('Data selected:', selectedData);
    setSelectedRows([]);
    setSelectAll(false);
    handleCloseModal();

    try {
      await Promise.all(
        selectedData.map(async (data, idx) => {
          await getAllGrnNo(data.partNo, data);
          await getAllBinType(data.grnNo, data.partNo, data);
          await getAllBatchNo(data.binType, data.grnNo, data.partNo, data);
          await getAllBin(data.batchNo, data.binType, data.grnNo, data.partNo, data);
          await getTableQty(data.bin, data.batchNo, data.binType, data.grnNo, data.partNo, data);
          const simulatedEvent = {
            target: {
              value: data.bin
            }
          };
        })
      );
    } catch (error) {
      console.error('Error processing selected data:', error);
    }
  };

  const [modalTableData, setModalTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDescription: '',
      grnNo: '',
      grnDate: null,
      sku: '',
      batchNo: '',
      batchDate: null,
      expDate: null,
      bin: '',
      binType: '',
      binClass: '',
      qcFlag: '',
      status: '',
      core: '',
      cellType: '',
      totalQty: ''
    }
  ]);

  const getFillGridDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `codeconversion/getAllFillGridFromStockForCodeConversion?branchCode=${cbranch}&client=${client}&orgId=${orgId}&warehouse=${warehouse}`
      );
      console.log('THE VAS PICK GRID DETAILS IS:', response);
      if (response.status === true) {
        const gridDetails = response.paramObjectsMap.codeConversionVO;
        console.log('THE MODAL TABLE DATA FROM API ARE:', gridDetails);

        setModalTableData(
          gridDetails.map((row) => ({
            id: row.id,
            partNo: row.partNo,
            partDescription: row.partDesc,
            grnNo: row.grnNo,
            grnDate: row.grnDate,
            sku: row.sku,
            batchNo: row.batchNo,
            batchDate: row.batchDate,
            expDate: row.expDate,
            bin: row.bin,
            binType: row.binType,
            binClass: row.binClass,
            qcFlag: row.qcFlag,
            status: row.status,
            cellType: row.cellType,
            core: row.core,
            totalQty: row.totalQty
          }))
        );
        setCodeConversionDetailsTable([]);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleFullGrid = () => {
    getFillGridDetails();
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
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
              onClick={!viewId ? handleSave : undefined}
              margin="0 10px 0 10px"
            />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCodeConversionById} />
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
                  name="codeConversionDocId"
                  value={codeConversionDocId}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Document Date"
                      value={formData.docdate ? dayjs(formData.docdate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docdate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      disabled
                    />
                  </LocalizationProvider>
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
                            <ActionButton title="Clear" icon={ClearIcon} onClick={() => handleTableClear('codeConversionDetailsTable')} />
                          </>
                        )}
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  {!viewId && <th className="table-header">Action</th>}
                                  <th className="table-header">S.No</th>
                                  <th className="table-header">Part No *</th>
                                  <th className="table-header">Part Description</th>
                                  <th className="table-header">SKU</th>
                                  <th className="table-header">GRN No *</th>
                                  <th className="table-header">Bin Type *</th>
                                  <th className="table-header">Batch No *</th>
                                  <th className="table-header">Bin *</th>
                                  <th className="table-header">QTY</th>
                                  <th className="table-header">Actual QTY *</th>
                                  <th className="table-header">Convert QTY *</th>
                                  <th className="table-header">C Part No *</th>
                                  <th className="table-header">C Part Desc</th>
                                  <th className="table-header">C SKU</th>
                                  {/* <th className="table-header">C Batch No *</th> */}
                                  <th className="table-header">C Bin *</th>
                                  {/* <th className="table-header">C ExpDate *</th> */}
                                  <th className="table-header">Remarks</th>
                                </tr>
                              </thead>
                              {!viewId ? (
                                <>
                                  <tbody>
                                    {codeConversionDetailsTable.length > 0 ? (
                                      codeConversionDetailsTable.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="border px-2 py-2 text-center">
                                            <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row.id)} />
                                          </td>
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.partNo}
                                              value={row.partNo}
                                              style={{ width: '100px' }}
                                              onChange={(e) => handlePartNoChange(row, index, e)}
                                              className={codeConversionDetailsError[index]?.partNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {partNoList.length > 0 ? (
                                                partNoList.map((part) => (
                                                  <option key={part.id} value={part.partNo}>
                                                    {part.partNo}
                                                  </option>
                                                ))
                                              ) : (
                                                <option disabled>No Data Found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.partNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].partNo}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              style={{ width: '300px' }}
                                              value={row.partDescription}
                                              disabled
                                              className="form-control"
                                              title={row.partDescription}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.sku}
                                              disabled
                                              className="form-control"
                                              title={row.sku}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.grnNo}
                                              value={row.grnNo}
                                              style={{ width: '200px' }}
                                              onChange={(e) => handleGrnNoChange(row, index, e)}
                                              className={codeConversionDetailsError[index]?.grnNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {Array.isArray(row.rowGrnNoList) && row.rowGrnNoList.length > 0 ? (
                                                row.rowGrnNoList.map(
                                                  (g, idx) =>
                                                    g &&
                                                    g.grnNo && (
                                                      <option key={g.grnNo} value={g.grnNo}>
                                                        {g.grnNo}
                                                      </option>
                                                    )
                                                )
                                              ) : (
                                                <option disabled>No data found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.grnNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].grnNo}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.binType}
                                              value={row.binType}
                                              style={{ width: '200px' }}
                                              onChange={(e) => handleBinTypeChange(row, index, e)}
                                              className={codeConversionDetailsError[index]?.binType ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {Array.isArray(row.rowBinTypeList) && row.rowBinTypeList.length > 0 ? (
                                                row.rowBinTypeList.map(
                                                  (bin, idx) =>
                                                    bin &&
                                                    bin.binType && (
                                                      <option key={bin.binType} value={bin.binType}>
                                                        {bin.binType}
                                                      </option>
                                                    )
                                                )
                                              ) : (
                                                <option disabled>No Data Found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.binType && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].binType}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.batchNo}
                                              value={row.batchNo}
                                              style={{ width: '100px' }}
                                              onChange={(e) => handleBatchNoChange(row, index, e)}
                                              className={codeConversionDetailsError[index]?.batchNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {Array.isArray(row.rowBatchNoList) && row.rowBatchNoList.length > 0 ? (
                                                row.rowBatchNoList.map(
                                                  (batch, idx) =>
                                                    batch &&
                                                    batch.batchNo && (
                                                      <option key={batch.batchNo} value={batch.batchNo}>
                                                        {batch.batchNo}
                                                      </option>
                                                    )
                                                )
                                              ) : (
                                                <option disabled>No Data Found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.batchNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].batchNo}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.bin}
                                              value={row.bin}
                                              style={{ width: '100px' }}
                                              onChange={(e) => handleBinChange(row, index, e)}
                                              className={codeConversionDetailsError[index]?.bin ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {Array.isArray(row.rowBinList) && row.rowBinList.length > 0 ? (
                                                row.rowBinList.map(
                                                  (bin, idx) =>
                                                    bin &&
                                                    bin.bin && (
                                                      <option key={bin.bin} value={bin.bin}>
                                                        {bin.bin}
                                                      </option>
                                                    )
                                                )
                                              ) : (
                                                <option disabled>No Data Found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.bin && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].bin}
                                              </div>
                                            )}
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.qty}
                                              disabled
                                              className="form-control"
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              ref={lrNoDetailsRefs.current[index]?.actualQty}
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.actualQty}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const intPattern = /^\d*$/;

                                                if (intPattern.test(value) || value === '') {
                                                  const numericValue = parseInt(value, 10);
                                                  const numericQty = parseInt(row.qty, 10) || 0;

                                                  if (value === '' || numericValue <= numericQty) {
                                                    setCodeConversionDetailsTable((prev) => {
                                                      const updatedData = prev.map((r) => {
                                                        return r.id === row.id
                                                          ? {
                                                              ...r,
                                                              actualQty: value
                                                            }
                                                          : r;
                                                      });
                                                      return updatedData;
                                                    });
                                                    setCodeConversionDetailsError((prev) => {
                                                      const newErrors = [...prev];
                                                      newErrors[index] = {
                                                        ...newErrors[index],
                                                        actualQty: !value ? '' : ''
                                                      };
                                                      return newErrors;
                                                    });
                                                  } else {
                                                    setCodeConversionDetailsError((prev) => {
                                                      const newErrors = [...prev];
                                                      newErrors[index] = {
                                                        ...newErrors[index],
                                                        actualQty: 'Actual QTY cannot be greater than QTY'
                                                      };
                                                      return newErrors;
                                                    });
                                                  }
                                                } else {
                                                  setCodeConversionDetailsError((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = { ...newErrors[index], qty: 'Invalid value' };
                                                    return newErrors;
                                                  });
                                                }
                                              }}
                                              className={
                                                codeConversionDetailsError[index]?.actualQty ? 'error form-control' : 'form-control'
                                              }
                                            />
                                            {codeConversionDetailsError[index]?.actualQty && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].actualQty}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              ref={lrNoDetailsRefs.current[index]?.convertQty}
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.convertQty}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                  setCodeConversionDetailsTable((prev) =>
                                                    prev.map((r) => (r.id === row.id ? { ...r, convertQty: value } : r))
                                                  );
                                                  setCodeConversionDetailsError((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = {
                                                      ...newErrors[index],
                                                      convertQty: !value ? 'Convert Qty is required' : ''
                                                    };
                                                    return newErrors;
                                                  });
                                                } else {
                                                  setCodeConversionDetailsError((prev) => {
                                                    const newErrors = [...prev];
                                                    newErrors[index] = {
                                                      ...newErrors[index],
                                                      convertQty: 'Only numbers are allowed'
                                                    };
                                                    return newErrors;
                                                  });
                                                }
                                              }}
                                              className={
                                                codeConversionDetailsError[index]?.convertQty ? 'error form-control' : 'form-control'
                                              }
                                            />
                                            {codeConversionDetailsError[index]?.convertQty && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].convertQty}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.cpartNo}
                                              value={row.cpartNo}
                                              style={{ width: '100px' }}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const selectedCPart = cPartNoList.find((cpart) => cpart.partno === value);
                                                setCodeConversionDetailsTable((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? {
                                                          ...r,
                                                          cpartNo: value,
                                                          cpartDesc: selectedCPart ? selectedCPart.partDesc : '',
                                                          csku: selectedCPart ? selectedCPart.sku : ''
                                                        }
                                                      : r
                                                  )
                                                );

                                                setCodeConversionDetailsError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    cpartNo: !value ? 'C Part No is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={codeConversionDetailsError[index]?.cpartNo ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {cPartNoList.length > 0 ? (
                                                cPartNoList
                                                  .filter((cpart) => cpart.partno !== row.partNo)
                                                  .map((cpart) => (
                                                    <option key={cpart.id} value={cpart.partno}>
                                                      {cpart.partno}
                                                    </option>
                                                  ))
                                              ) : (
                                                <option disabled>No Data Found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.cpartNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].cpartNo}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              style={{ width: '300px' }}
                                              value={row.cpartDesc}
                                              disabled
                                              className="form-control"
                                              title={row.cpartDesc}
                                            />
                                          </td>

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.csku}
                                              disabled
                                              className="form-control"
                                              title={row.csku}
                                            />
                                          </td>
                                          {/* <td className="border px-2 py-2">
                                            <input
                                              ref={lrNoDetailsRefs.current[index]?.cbatchNo}
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.cbatchNo}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setCodeConversionDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, cbatchNo: value } : r))
                                                );
                                                setCodeConversionDetailsError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    cbatchNo: !value ? 'C Batch No is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={
                                                codeConversionDetailsError[index]?.cbatchNo ? 'error form-control' : 'form-control'
                                              }
                                            />
                                            {codeConversionDetailsError[index]?.cbatchNo && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].cbatchNo}
                                              </div>
                                            )}
                                          </td> */}
                                          <td className="border px-2 py-2">
                                            <select
                                              ref={lrNoDetailsRefs.current[index]?.cbin}
                                              value={row.cbin}
                                              style={{ width: '100px' }}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const selectedCBin = cPalletList.find((row) => row.bin === value);

                                                setCodeConversionDetailsTable((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? {
                                                          ...r,
                                                          cbin: selectedCBin.bin,
                                                          cCore: selectedCBin.core,
                                                          cCellType: selectedCBin.cellType,
                                                          cBinType: selectedCBin.binType,
                                                          cBinClass: selectedCBin.binClass
                                                        }
                                                      : r
                                                  )
                                                );

                                                setCodeConversionDetailsError((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    cbin: !value ? 'C Bin is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={codeConversionDetailsError[index]?.cbin ? 'error form-control' : 'form-control'}
                                            >
                                              <option value="">--Select--</option>
                                              {cPalletList.length > 0 ? (
                                                cPalletList.map((cPallet) => (
                                                  <option key={cPallet.id} value={cPallet.bin}>
                                                    {cPallet.bin}
                                                  </option>
                                                ))
                                              ) : (
                                                <option disabled>No Data Found</option>
                                              )}
                                            </select>
                                            {codeConversionDetailsError[index]?.cbin && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {codeConversionDetailsError[index].cbin}
                                              </div>
                                            )}
                                          </td>

                                          {/* <td className="border px-2 py-2">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                              <DatePicker
                                                value={row.cexpDate ? dayjs(row.cexpDate, 'YYYY-MM-DD') : null}
                                                slotProps={{
                                                  textField: { size: 'small', clearable: true, style: { width: '200px' }, disabled: true } // Disable the DatePicker
                                                }}
                                                format="DD-MM-YYYY"
                                              />
                                            </LocalizationProvider>
                                          </td> */}

                                          <td className="border px-2 py-2">
                                            <input
                                              type="text"
                                              style={{ width: '100px' }}
                                              value={row.remarks}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setCodeConversionDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, remarks: value.toUpperCase() } : r))
                                                );
                                              }}
                                              onKeyDown={(e) => handleKeyDown(e, row)}
                                              className="form-control"
                                            />
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="18" className="text-center py-2">
                                          No Data Found
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                  {codeConversionDetailsError.some((error) => error.general) && (
                                    <tfoot>
                                      <tr>
                                        <td colSpan={18} className="error-message">
                                          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                                            {codeConversionDetailsError.find((error) => error.general)?.general}
                                          </div>
                                        </td>
                                      </tr>
                                    </tfoot>
                                  )}
                                </>
                              ) : (
                                <>
                                  <tbody>
                                    {codeConversionDetailsTable.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.partNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.partDescription}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.sku}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.grnNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.binType}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.batchNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.bin}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.qty}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.actualQty}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.convertQty}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.cpartNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.cpartDesc}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.csku}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.cbatchNo}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.cbin}
                                        </td>
                                        <td className="border px-2 py-2 text-center" style={{ whiteSpace: 'nowrap' }}>
                                          {row.remarks}
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
                              <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                <Checkbox checked={selectAll} onChange={handleSelectAll} />
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                S.No
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                Part No
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                Part Description
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                GRN No
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                SKU
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                Bin Type
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                Batch No
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                Bin
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                Qty
                              </th>
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
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {index + 1}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.partNo}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.partDescription}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.grnNo}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.sku}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.binType}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.batchNo}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.bin}
                                </td>
                                <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                  {row.totalQty}
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
export default CodeConversion;
