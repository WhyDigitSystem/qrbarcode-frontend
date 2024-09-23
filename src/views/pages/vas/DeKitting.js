import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { showToast } from 'utils/toast-component';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import React, { useRef } from 'react';

export const DeKitting = () => {
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [partNoList, setPartNoList] = useState([]);
  const [batchNoList, setBatchNoList] = useState([]);
  const [binsData, setBinsData] = useState([]);
  const [docId, setDocId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  // const [finYear, setFinYear] = useState(localStorage.getItem('finYear') ? localStorage.getItem('finYear') : '2024');
  const [finYear, setFinYear] = useState('2024');
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const [value, setValue] = useState(0);
  const [partNoOptions, setPartNoOptions] = useState([]);
  const [formData, setFormData] = useState({
    docId: docId,
    docDate: dayjs(),
    active: true,
    freeze: false
  });
  const [parentTable, setParentTable] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      batchDate: '',
      batchNo: '',
      bin: '',
      binClass: '',
      binType: '',
      cellType: '',
      core: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      bin: '',
      expDate: '',
      avlQty: '',
      qty: ''
    }
  ]);

  // const lrNoDetailsRefs = useRef(
  //   parentTable.map(() => ({
  //     partNo: React.createRef(),
  //     qty: React.createRef()
  //   }))
  // );

  // useEffect(() => {
  //   // If the length of the table changes, update the refs
  //   if (lrNoDetailsRefs.current.length !== parentTable.length) {
  //     lrNoDetailsRefs.current = parentTable.map(
  //       (_, index) =>
  //         lrNoDetailsRefs.current[index] || {
  //           partNo: React.createRef(),
  //           qty: React.createRef()
  //         }
  //     );
  //   }
  // }, [parentTable.length]);

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = parentTable.map((_, index) => ({
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      qty: lrNoDetailsRefs.current[index]?.qty || React.createRef()
    }));
  }, [parentTable]);

  const [childTable, setChildTable] = useState([
    {
      id: 1,
      partNo: '',
      partDesc: '',
      batchNo: '',
      batchDate: '',
      bin: '',
      binClass: '',
      binType: '',
      cellType: '',
      core: '',
      lotNo: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      expDate: '',
      qty: ''
    }
  ]);

  const handleAddRow = () => {
    if (isLastRowEmpty(parentTable)) {
      displayRowError(parentTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      partNo: '',
      partDesc: '',
      batchDate: '',
      batchNo: '',
      bin: '',
      binClass: '',
      binType: '',
      cellType: '',
      core: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      bin: '',
      expDate: '',
      avlQty: '',
      qty: ''
    };
    setParentTable([...parentTable, newRow]);
    setParentTableErrors([
      ...parentTableErrors,
      {
        partNo: '',
        partDesc: '',
        batchDate: '',
        batchNo: '',
        bin: '',
        binClass: '',
        binType: '',
        cellType: '',
        core: '',
        sku: '',
        grnNo: '',
        grnDate: '',
        bin: '',
        expDate: '',
        avlQty: '',
        qty: ''
      }
    ]);
  };
  const handleAddRow1 = () => {
    const newRow = {
      id: Date.now(),
      partNo: '',
      partDesc: '',
      batchNo: '',
      batchDate: '',
      bin: '',
      binClass: '',
      binType: '',
      cellType: '',
      core: '',
      lotNo: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      expDate: '',
      qty: ''
    };
    setChildTable([...childTable, newRow]);
    setChildTableErrors([
      ...childTableErrors,
      {
        partNo: '',
        partDesc: '',
        batchNo: '',
        batchDate: '',
        bin: '',
        binClass: '',
        binType: '',
        cellType: '',
        core: '',
        lotNo: '',
        sku: '',
        grnNo: '',
        grnDate: '',
        expDate: '',
        qty: ''
      }
    ]);
    getDocId();
  };

  const [parentTableErrors, setParentTableErrors] = useState([
    {
      partNo: '',
      partDesc: '',
      batchDate: '',
      batchNo: '',
      bin: '',
      binClass: '',
      binType: '',
      cellType: '',
      core: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      bin: '',
      expDate: '',
      avlQty: '',
      qty: ''
    }
  ]);
  const [childTableErrors, setChildTableErrors] = useState([
    {
      partNo: '',
      partDesc: '',
      batchNo: '',
      batchDate: '',
      bin: '',
      binClass: '',
      binType: '',
      cellType: '',
      core: '',
      lotNo: '',
      sku: '',
      grnNo: '',
      grnDate: '',
      expDate: '',
      qty: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 }
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
    getDocId();
    getAllDeKittingByOrgId();
    getAllPartNo();
    getAllBinDetails();
    getAllChildPart();
  }, []);

  const getAllBinDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `warehousemastercontroller/getAllBinDetails?warehouse=${warehouse}&branchCode=${branchCode}&client=${client}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        console.log('response.paramObjectsMap.Bins:', response.paramObjectsMap.Bins);
        setBinsData(response.paramObjectsMap.Bins);
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
        `deKitting/getPartNoFromStockForDeKittingParent?branch=${branch}&branchCode=${branchCode}&client=${client}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        console.log('paramObjectsMap:', response.paramObjectsMap);

        const partData = response.paramObjectsMap.partNoDetails.map(({ partNo, partDesc, sku }) => ({ partNo, partDesc, sku }));

        setPartNoList(partData);
      } else {
        console.error('API Error:', response);
        return response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return error;
    }
  };

  const handlePartNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedPartNo = partNoList.find((p) => p.partNo === value);
    setParentTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              partNo: value,
              partDesc: selectedPartNo ? selectedPartNo.partDesc : '',
              sku: selectedPartNo ? selectedPartNo.sku : ''
            }
          : r
      )
    );
    setParentTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        partNo: !value ? 'Part No is required' : ''
      };
      return newErrors;
    });

    if (value) {
      getGrnNo(value, row);
    }
  };

  const getGrnNo = async (selectedRowPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getGrnDetailsForDekittingParent?branch=${branch}&branchCode=${branchCode}&client=${client}&orgId=${orgId}&partNo=${selectedRowPartNo}`
      );
      console.log('THE FROM GRN NO LIST IS:', response);
      if (response.status === true) {
        setParentTable((prev) =>
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
    setParentTable((prev) =>
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
    setParentTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        grnNo: !value ? 'GRN No is required' : ''
      };
      return newErrors;
    });
    getBatchNo(row.partNo, value, row);
  };

  const getBatchNo = async (selectedPartNo, selectedGrnNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getBatchNoForDeKittingParent?branch=${branch}&branchCode=${branchCode}&client=${client}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}`
      );
      console.log('getBatchNoForDeKittingParent IS:', response);
      if (response.status === true) {
        setParentTable((prev) =>
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
    setParentTable((prev) =>
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
    setParentTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        batchNo: !value ? 'Batch No is required' : ''
      };
      return newErrors;
    });
    getBinDetails(value, row.grnNo, row.partNo, row);
  };

  const getBinDetails = async (selectedBatchNo, selectedGrnNo, selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getBinForDeKittingParent?batchNo=${selectedBatchNo}&branch=${branch}&branchCode=${branchCode}&client=${client}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}`
      );
      console.log('THE TO BIN LIST ARE:', response);
      if (response.status === true) {
        setParentTable((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBinList: response.paramObjectsMap.binDetails
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleBinChange = (row, index, event) => {
    const value = event.target.value;

    console.log('THE ROW.PARTNO IS:', row);

    const selectedBin = row.rowBinList.find((bin) => bin.bin === value);

    setParentTable((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              bin: value,
              binType: selectedBin ? selectedBin.binType : '',
              binClass: selectedBin ? selectedBin.binclass : '',
              cellType: selectedBin ? selectedBin.celltype : '',
              core: selectedBin ? selectedBin.core : ''
            }
          : r
      )
    );

    setParentTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        bin: !value ? 'Bin is required' : ''
      };
      return newErrors;
    });

    getAvlQty(row.batchNo, value, row.grnNo, row.partNo, row);
  };

  const getAvlQty = async (selectedBatchNo, selectedBin, selectedGrnNo, selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getAvlQtyForDeKittingParent?batchNo=${selectedBatchNo}&bin=${selectedBin}&branch=${branch}&branchCode=${branchCode}&client=${client}&grnNo=${selectedGrnNo}&orgId=${orgId}&partNo=${selectedPartNo}`
      );
      console.log('THE ROW. TO BIN IS IS:', selectedBin);
      console.log('avlQty', response.paramObjectsMap.avlQty);

      setParentTable((prevData) =>
        prevData.map((r) =>
          r.id === row.id
            ? {
                ...r,
                avlQty: response.paramObjectsMap.avlQty
              }
            : r
        )
      );
    } catch (error) {
      console.error('Error fetching locationType data:', error);
    }
  };

  const getAllDeKittingByOrgId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getAllDeKittingByOrgId?orgId=${orgId}&branch=${branch}&branchCode=${branchCode}&client=${client}&finYear=${finYear}&warehouse=${warehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.deKittingVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllChildPart = async () => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getPartNoforDeKittingChild?orgId=${orgId}&branchCode=${branchCode}&client=${client}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        const options = response.paramObjectsMap.partNoChild.map((item) => ({
          partNo: item.partNo,
          partDesc: item.partDesc,
          sku: item.sku
        }));
        setPartNoOptions(options);
        console.log('Mapped Part No Options:', options);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const appendGNToDocumentId = (docId) => {
    const index = docId.indexOf('DK');
    if (index !== -1) {
      return `${docId.slice(0, index + 2)}GN${docId.slice(index + 2)}`;
    }
    return docId;
  };

  useEffect(() => {
    console.log('childTable has been updated:', childTable);
  }, [childTable]);

  const getDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `deKitting/getDeKittingDocId?orgId=${orgId}&branchCode=${branchCode}&client=${client}&branch=${branch}&finYear=${finYear}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setDocId(response.paramObjectsMap.deKittingDocId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          docId: response.paramObjectsMap.deKittingDocId
        }));
        const modifiedDocId = appendGNToDocumentId(response.paramObjectsMap.deKittingDocId);
        console.log('Modified docId:', modifiedDocId);

        setChildTable((prevParentTableData) =>
          prevParentTableData.map((row) => ({
            ...row,
            grnNo: modifiedDocId
          }))
        );

        // setChildTable((prevParentTableData) =>
        //   prevParentTableData.map((row) => ({
        //     ...row,
        //     grnNo: modifiedDocId // Set the same grnNo for all rows
        //   }))
        // );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDeKittingById = async (row) => {
    console.log('THE SELECTED DEKITTING ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `deKitting/getDeKittingById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularDekitting = response.paramObjectsMap.deKittingVO;
        console.log('THE PARTICULAR DeKitting IS:', particularDekitting);
        getAllBinDetails();
        setFormData({
          docId: particularDekitting.docId,
          docDate: particularDekitting.docDate ? dayjs(particularDekitting.docDate) : dayjs(),
          active: particularDekitting.active === true,
          customer: particularDekitting.customer,
          branch: particularDekitting.branch,
          warehouse: particularDekitting.warehouse,
          freeze: particularDekitting.freeze
        });

        setParentTable(
          particularDekitting.deKittingParentVO.map((detail) => ({
            id: detail.id,
            partNo: detail.partNo || '',
            partDesc: detail.partDesc || '',
            batchNo: detail.batchNo || '',
            batchDate: detail.batchDate || '',
            bin: detail.bin || '',
            binType: detail.binType || '',
            cellType: detail.cellType || '',
            core: detail.core || '',
            sku: detail.sku || '',
            grnNo: detail.grnNo || '',
            grnDate: detail.grnDate || '',
            expDate: detail.expDate || '',
            qty: detail.qty || ''
          }))
        );

        setChildTable(
          particularDekitting.deKittingChildVO.map((detail) => ({
            id: detail.id,
            partNo: detail.partNo || '',
            partDesc: detail.partDesc || '',
            batchNo: detail.batchNo || '',
            batchDate: detail.batchDate || '',
            bin: detail.bin || '',
            sku: detail.sku || '',
            grnNo: detail.grnNo || '',
            grnDate: detail.grnDate || '',
            expDate: detail.expDate || '',
            qty: detail.qty || ''
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      if (name === 'active') {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
      }

      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleDeleteRow = (id) => {
    setParentTable(parentTable.filter((row) => row.id !== id));
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === parentTable) {
      return !lastRow.partNo || !lastRow.grnNo || !lastRow.batchNo || !lastRow.bin || !lastRow.qty;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === parentTable) {
      setParentTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          grnNo: !table[table.length - 1].grnNo ? 'Grn No is required' : '',
          batchNo: !table[table.length - 1].batchNo ? 'Batch No is required' : '',
          bin: !table[table.length - 1].bin ? 'Bin is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : ''
        };
        return newErrors;
      });
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
  const handleDeleteRow1 = (id) => {
    setChildTable(childTable.filter((row) => row.id !== id));
  };

  const handleClear = () => {
    setFormData({ docDate: dayjs() });
    setEditId('');
    setParentTable([
      {
        id: 1,
        partNo: '',
        partDesc: '',
        batchDate: '',
        batchNo: '',
        bin: '',
        binClass: '',
        binType: '',
        cellType: '',
        core: '',
        sku: '',
        grnNo: '',
        grnDate: '',
        bin: '',
        expDate: '',
        avlQty: '',
        qty: ''
      }
    ]);
    setChildTable([
      {
        id: 1,
        partNo: '',
        partDesc: '',
        batchNo: '',
        batchDate: '',
        bin: '',
        binClass: '',
        binType: '',
        cellType: '',
        core: '',
        lotNo: '',
        sku: '',
        // grnNo: '',
        grnDate: '',
        expDate: '',
        qty: ''
      }
    ]);
    setFieldErrors({
      docId: '',
      docDate: ''
    });
    getDocId();
  };

  const handleSave = async () => {
    // if (editId) {
    //   showToast('error', 'Save is not allowed while editing an existing record');
    //   return;
    // }

    const errors = {};
    let firstInvalidFieldRef = null;

    if (!formData.docId) {
      errors.docId = 'Doc Id is required';
    }

    let parentTableDataValid = true;
    const newTableErrors = parentTable.map((row, index) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partNo;
        parentTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'Qty is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].qty;
        parentTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);

    if (!parentTableDataValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
    } else {
      // Proceed with form submission
    }

    setParentTableErrors(newTableErrors);

    let childTableDataValid = true;
    const newTableErrors1 = childTable.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is required';
        childTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'Qty is required';
        childTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setChildTableErrors(newTableErrors1);

    if (Object.keys(errors).length === 0 && childTableDataValid && parentTableDataValid) {
      setIsLoading(true);
      const ParentVO = parentTable.map((row) => ({
        avlQty: parseInt(row.avlQty),
        batchDate: row.batchDate,
        batchNo: row.batchNo,
        bin: row.bin,
        binClass: row.binClass,
        binType: row.binType,
        cellType: row.cellType,
        core: row.core,
        expDate: row.expDate,
        grnDate: row.grnDate,
        grnNo: row.grnNo,
        partNo: row.partNo,
        partDesc: row.partDesc,
        qty: parseInt(row.qty),
        sku: row.sku
      }));
      const childVO = childTable.map((row) => ({
        batchDate: row.batchDate,
        batchNo: row.batchNo,
        bin: row.bin,
        binClass: row.binClass,
        binType: row.binType,
        cellType: row.cellType,
        core: row.core,
        expDate: row.expDate,
        grnDate: row.grnDate,
        grnNo: row.grnNo,
        partNo: row.partNo,
        partDesc: row.partDesc,
        qty: parseInt(row.qty),
        sku: row.sku
      }));

      const saveFormData = {
        branch: branch,
        branchCode: branchCode,
        client: client,
        createdBy: loginUserName,
        customer: customer,
        deKittingChildDTO: childVO,
        deKittingParentDTO: ParentVO,
        finYear: finYear,
        orgId: orgId,
        warehouse: warehouse
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `deKitting/createUpdateDeKitting`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', 'De-Kitting created successfully');
          getAllDeKittingByOrgId();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'De-Kitting creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'De-Kitting creation failed');
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
      <div>{/* <ToastContainer /> */}</div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            {!formData.freeze && (
              <ActionButton
                title="Save"
                icon={SaveIcon}
                isLoading={isLoading}
                onClick={!editId ? handleSave : undefined}
                margin="0 10px 0 10px"
              />
            )}
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getDeKittingById} />
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
                  <Tab value={0} label="De-Kitting Parent" />
                  <Tab value={1} label="De-Kitting Child" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered" style={{ width: '100%' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  {!editId && (
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                  )}
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Part No</th>
                                  <th className="px-2 py-2 text-white text-center">Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">SKU</th>
                                  <th className="px-2 py-2 text-white text-center">GRN No</th>
                                  <th className="px-2 py-2 text-white text-center">Batch No</th>
                                  <th className="px-2 py-2 text-white text-center">Bin</th>
                                  <th className="px-2 py-2 text-white text-center">Bin Type</th>
                                  <th className="px-2 py-2 text-white text-center">Exp Date</th>
                                  {!editId && <th className="px-2 py-2 text-white text-center">Avl Qty</th>}
                                  <th className="px-2 py-2 text-white text-center">Qty</th>
                                </tr>
                              </thead>
                              {!editId ? (
                                <tbody>
                                  {parentTable.map((row, index) => (
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
                                          style={{ width: '200px' }}
                                          onChange={(e) => handlePartNoChange(row, index, e)}
                                          className={parentTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">-- Select --</option>
                                          {partNoList?.map((part) => (
                                            <option key={part.id} value={part.partNo}>
                                              {part.partNo}
                                            </option>
                                          ))}
                                        </select>
                                        {parentTableErrors[index]?.partNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].partNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.partDesc}
                                          disabled
                                          style={{ width: '200px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setParentTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, partDesc: value } : r)));
                                            setParentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDesc: !value ? 'Part Description is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={parentTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                        />
                                        {parentTableErrors[index]?.partDesc && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].partDesc}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sku}
                                          disabled
                                          style={{ width: '200px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setParentTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, sku: value } : r)));
                                            setParentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sku: !value ? 'Sku is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={parentTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                        />
                                        {parentTableErrors[index]?.partDesc && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].sku}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.grnNo}
                                          style={{ width: '200px' }}
                                          onChange={(e) => handleGrnNoChange(row, index, e)}
                                          className={parentTableErrors[index]?.grnNo ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">-- Select --</option>

                                          {Array.isArray(row.rowGrnNoList) &&
                                            row.rowGrnNoList.map(
                                              (g, idx) =>
                                                g &&
                                                g.grnNo && (
                                                  <option key={g.grnNo} value={g.grnNo}>
                                                    {g.grnNo}
                                                  </option>
                                                )
                                            )}
                                        </select>
                                        {parentTableErrors[index]?.grnNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].grnNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.batchNo}
                                          style={{ width: '200px' }}
                                          onChange={(e) => handleBatchNoChange(row, index, e)}
                                          className={parentTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">-- Select --</option>
                                          {Array.isArray(row.rowBatchNoList) &&
                                            row.rowBatchNoList.map(
                                              (g, idx) =>
                                                g &&
                                                g.batchNo && (
                                                  <option key={g.batchNo} value={g.batchNo}>
                                                    {g.batchNo}
                                                  </option>
                                                )
                                            )}
                                          {batchNoList?.map((batch, index) => (
                                            <option key={index} value={batch.batchNo}>
                                              {batch.batchNo}
                                            </option>
                                          ))}
                                        </select>
                                        {parentTableErrors[index]?.batchNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].batchNo}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.bin}
                                          style={{ width: '200px' }}
                                          onChange={(e) => handleBinChange(row, index, e)}
                                          className={parentTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">--Select--</option>
                                          {Array.isArray(row.rowBinList) && row.rowBinList.length > 0 ? (
                                            row.rowBinList.map((g) =>
                                              g && g.bin ? (
                                                <option key={g.bin} value={g.bin}>
                                                  {g.bin}
                                                </option>
                                              ) : null
                                            )
                                          ) : (
                                            <option value="" disabled>
                                              No bins available
                                            </option>
                                          )}
                                        </select>
                                        {parentTableErrors[index]?.bin && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].bin}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '300px' }}
                                          type="text"
                                          value={row.binType}
                                          className={parentTableErrors[index]?.binType ? 'error form-control' : 'form-control'}
                                          disabled
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.expDate}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setParentTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, expDate: value } : r)));
                                            setParentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], expDate: !value ? 'Exp Date is required' : '' };
                                              return newErrors;
                                            });
                                          }}
                                          className={parentTableErrors[index]?.expDate ? 'error form-control' : 'form-control'}
                                        />
                                        {parentTableErrors[index]?.expDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].expDate}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.avlQty}
                                          className={parentTableErrors[index]?.avlQty ? 'error form-control' : 'form-control'}
                                          disabled
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          ref={lrNoDetailsRefs.current[index]?.qty}
                                          type="text"
                                          value={row.qty}
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setParentTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r)));
                                            setParentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], qty: !value ? 'Qty is required' : '' };
                                              return newErrors;
                                            });
                                          }}
                                          className={parentTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                          onKeyDown={(e) => handleKeyDown(e, row, parentTable)}
                                        />
                                        {parentTableErrors[index]?.qty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {parentTableErrors[index].qty}
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              ) : (
                                <tbody>
                                  {parentTable.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.partNo}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.partDesc}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.sku}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.grnNo}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.batchNo}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.bin}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.binType}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.expDate}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.qty}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              )}
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
                      <div className="mb-1">{!formData.freeze && <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow1} />}</div>

                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  {!editId && (
                                    <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                      Action
                                    </th>
                                  )}
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Part No</th>
                                  <th className="px-2 py-2 text-white text-center">Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">SKU</th>
                                  <th className="px-2 py-2 text-white text-center">GRN No</th>
                                  <th className="px-2 py-2 text-white text-center">GRN Date</th>
                                  <th className="px-2 py-2 text-white text-center">Batch No</th>
                                  <th className="px-2 py-2 text-white text-center">Batch Date</th>
                                  <th className="px-2 py-2 text-white text-center">Bin</th>
                                  <th className="px-2 py-2 text-white text-center">Exp Date</th>
                                  <th className="px-2 py-2 text-white text-center">Qty</th>
                                </tr>
                              </thead>

                              {!editId ? (
                                <tbody>
                                  {childTable.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow1(row.id)} />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.partNo}
                                          style={{ width: '130px' }}
                                          onChange={(e) => {
                                            const partNo = e.target.value;
                                            console.log('Selected Part No:', partNo);

                                            const selectedPart = partNoOptions.find((option) => String(option.partNo) === String(partNo));
                                            console.log('Selected Part Details:', selectedPart);

                                            if (selectedPart) {
                                              setChildTable((prev) => {
                                                return prev.map((r) =>
                                                  r.id === row.id
                                                    ? {
                                                        ...r,
                                                        partNo: partNo,
                                                        partDesc: selectedPart.partDesc,
                                                        sku: selectedPart.sku
                                                      }
                                                    : r
                                                );
                                              });
                                            }
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partNo: !partNo ? 'Part No is required' : '',
                                                partDescription: !selectedPart ? 'Part Description is required' : '',
                                                sku: !selectedPart ? 'SKU is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Part No</option>
                                          {partNoOptions &&
                                            partNoOptions.map((option) => (
                                              <option key={option.partNo} value={option.partNo}>
                                                {option.partNo}
                                              </option>
                                            ))}
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
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, partDesc: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDesc: !value ? 'Part Description is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.sku}
                                          disabled
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, sku: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sku: !value ? 'SKU is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.grnNo}
                                          disabled
                                          style={{ width: '220px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, grnNo: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                grnNo: !value ? 'GRN No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.grnNo ? 'error form-control' : 'form-control'}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.grnDate}
                                          // disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, grnDate: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                grnDate: !value ? 'GRN Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.grnDate ? 'error form-control' : 'form-control'}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.batchNo}
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, batchNo: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                batchNo: !value ? 'Batch No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.batchDate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, batchDate: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                batchDate: !value ? 'Batch Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.batchDate ? 'error form-control' : 'form-control'}
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.bin}
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            const selectedBin = binsData.find((bin) => bin.bin === value);
                                            console.log('selectedBin', selectedBin);
                                            setChildTable((prev) =>
                                              prev.map((r, i) =>
                                                i === index
                                                  ? {
                                                      ...r,
                                                      bin: value,
                                                      binClass: selectedBin ? selectedBin.binClass : '',
                                                      binType: selectedBin ? selectedBin.binType : '',
                                                      cellType: selectedBin ? selectedBin.cellType : '',
                                                      core: selectedBin ? selectedBin.core : ''
                                                    }
                                                  : r
                                              )
                                            );

                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                bin: !value ? 'Bin is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Bin</option>
                                          {binsData.map((bin) => (
                                            <option key={bin.bin} value={bin.bin}>
                                              {bin.bin}
                                            </option>
                                          ))}
                                        </select>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.expDate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, expDate: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                expDate: !value ? 'Exp Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.expDate ? 'error form-control' : 'form-control'}
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="number"
                                          value={row.qty}
                                          style={{ width: '100px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setChildTable((prev) => prev.map((r, i) => (i === index ? { ...r, qty: value } : r)));
                                            setChildTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: !value ? 'Quantity is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={childTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              ) : (
                                <tbody>
                                  {childTable.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.partNo}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.partDesc}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.sku}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.grnNo}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.grnDate}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.batchNo}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.batchDate}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.bin}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.expDate}
                                      </td>
                                      <td className="border p-2 text-center mt-2" style={{ width: '200px' }}>
                                        {row.qty}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              )}
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
export default DeKitting;
