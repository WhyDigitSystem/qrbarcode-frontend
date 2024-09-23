import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControlLabel } from '@mui/material';
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

export const Kitting = () => {
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [docId, setDocId] = useState('');
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  // const [finYear, setFinYear] = useState(localStorage.getItem('finYear') ? localStorage.getItem('finYear') : '2024');
  const [finYear, setFinYear] = useState('2024');
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));

  const [formData, setFormData] = useState({
    docId: docId,
    docDate: dayjs(),
    refNo: '',
    refDate: '',
    active: true
  });
  const [value, setValue] = useState(0);
  const [childPartNoList, setChildPartNoList] = useState([]);
  const [partNoOptions1, setPartNoOptions1] = useState([]);
  const [grnOptions, setGrnOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [binOptions, setBinOptions] = useState([]);
  const [rowBatchNo, setRowBatchNo] = useState([]);

  const [childTableData, setChildTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDescription: '',
      rowBatchNoList: [],
      batchNo: '',
      batchDate: null,
      expDate: null,
      lotNo: '',
      rowGrnNoList: [],
      grnNo: '',
      grnDate: '',
      sku: '',
      bin: '',
      avlQty: '',
      qty: '',
      unitRate: '',
      amount: ''
    }
  ]);

  const lrNoDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoDetailsRefs.current = childTableData.map((_, index) => ({
      partNo: lrNoDetailsRefs.current[index]?.partNo || React.createRef(),
      grnNo: lrNoDetailsRefs.current[index]?.grnNo || React.createRef(),
      batchNo: lrNoDetailsRefs.current[index]?.batchNo || React.createRef(),
      bin: lrNoDetailsRefs.current[index]?.bin || React.createRef(),
      qty: lrNoDetailsRefs.current[index]?.qty || React.createRef()
    }));
  }, [childTableData]);

  const [parentTableData, setParentTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDescription: '',
      rowBatchNoList: [],
      batchNo: '',
      batchDate: null,
      expDate: null,
      lotNo: '',
      sku: '',
      qty: '',
      unitRate: '',
      amount: '',
      rowGrnNoList: [],
      grnNo: '',
      grnDate: '',
      expDate: '',
      bin: '',
      core: '',
      cellType: '',
      binType: '',
      binClass: ''
    }
  ]);

  const lrNoParentDetailsRefs = useRef([]);

  useEffect(() => {
    lrNoParentDetailsRefs.current = parentTableData.map((_, index) => ({
      partNo: lrNoParentDetailsRefs.current[index]?.partNo || React.createRef(),
      grnNo: lrNoParentDetailsRefs.current[index]?.grnNo || React.createRef(),
      batchNo: lrNoParentDetailsRefs.current[index]?.batchNo || React.createRef(),
      bin: lrNoParentDetailsRefs.current[index]?.bin || React.createRef(),
      qty: lrNoParentDetailsRefs.current[index]?.qty || React.createRef()
    }));
  }, [parentTableData]);

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      partNo: '',
      partDescription: '',
      rowBatchNoList: [],
      batchNo: '',
      batchDate: null,
      expDate: null,
      lotNo: '',
      rowGrnNoList: [],
      grnNo: '',
      grnDate: '',
      sku: '',
      bin: '',
      avlQty: '',
      qty: '',
      unitRate: '',
      amount: ''
    };
    setChildTableData([...childTableData, newRow]);
    setChildTableErrors([
      ...childTableErrors,
      {
        bin: '',
        partNo: '',
        partDescription: '',
        batchNo: '',
        lotNo: '',
        grnNo: '',
        grnDate: '',
        sku: '',
        avlQty: '',
        qty: '',
        unitRate: '',
        amount: ''
      }
    ]);
  };

  const [childTableErrors, setChildTableErrors] = useState([
    {
      bin: '',
      partNo: '',
      partDescription: '',
      batchNo: '',
      lotNo: '',
      grnNo: '',
      grnDate: '',
      sku: '',
      avlQty: '',
      qty: '',
      unitRate: '',
      amount: ''
    }
  ]);
  const [parentTableErrors, setParentTableErrors] = useState([
    {
      partNo: '',
      partDescription: '',
      batchNo: '',
      lotNo: '',
      sku: '',
      qty: '',
      unitRate: '',
      amount: '',
      grnNo: '',
      grnDate: '',
      expDate: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: '',
    refNo: '',
    refDate: ''
  });
  const [listView, setListView] = useState(false);
  const [toBinList, setToBinList] = useState([]);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'refNo', header: 'Ref Id', size: 140 },
    { accessorKey: 'refDate', header: 'Ref Date', size: 140 }
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
    getAllKitting();
    getDocId();
    getAllBinDetails();
    getAllChildPartNo();
    getAllParentPart();
  }, []);

  // Example usage:

  const getAllKitting = async () => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getAllKitting?orgId=${orgId}&branchCode=${branchCode}&client=${client}&customer=${customer}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.kittingVOs);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllParentPart = async () => {
    try {
      console.log('Current docId:', docId); // Log the current docId to verify its value

      const response = await apiCalls('get', `kitting/getPartNOByParent?orgId=${orgId}&branchCode=${branchCode}&client=${client}`);
      console.log('API Response:', response);

      if (response.status === true) {
        const options1 = response.paramObjectsMap.kittingVO.map((item) => ({
          value: item.partNo,
          partDescription: item.partDesc, // Ensure these fields exist in the response
          sku: item.Sku // Ensure these fields exist in the response
        }));
        setPartNoOptions1(options1);

        // Modify the document ID and set it in the parent table data

        console.log('Updated parentTableData:', parentTableData); // Log the updated parentTableData after state update
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to append "GN" to the document ID
  const appendGNToDocumentId = (docId) => {
    // Insert "GN" right after "KT" if "KT" is present
    const index = docId.indexOf('KT');
    if (index !== -1) {
      return `${docId.slice(0, index + 2)}GN${docId.slice(index + 2)}`;
    }
    return docId; // Return the original document ID if "KT" is not found
  };

  // Ensure the state updates correctly
  useEffect(() => {
    console.log('parentTableData has been updated:', parentTableData);
  }, [parentTableData]);

  const getAllChildPartNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getPartNOByChild?orgId=${orgId}&branchCode=${branchCode}&client=${client}&warehouse=${warehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setChildPartNoList(response.paramObjectsMap.kittingVO);
      } else {
        console.error('Error: Unable to fetch part numbers:', response.message);
      }
    } catch (error) {
      console.error('Error fetching part numbers:', error);
    }
  };

  const getAvailableChildPartNos = (currentRowId) => {
    const selectedPartNos = childTableData
      .filter((row) => row.id !== currentRowId && row.partNo) // Exclude current row and empty partNos
      .map((row) => row.partNo);

    console.log('THE SELECTED PART NOS:', selectedPartNos);

    // Filter out selected part numbers from the available options
    return childPartNoList.filter((partDetail) => !selectedPartNos.includes(partDetail.partNo));
  };

  const handleChildPartNoChange = (row, index, event) => {
    const value = event.target.value;
    const selectedPartNo = childPartNoList.find((b) => b.partNo === value);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              partNo: selectedPartNo ? selectedPartNo.partNo : '',
              partDescription: selectedPartNo ? selectedPartNo.partDesc : '',
              sku: selectedPartNo ? selectedPartNo.Sku : '',
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
      getAllChildGrnNo(value, row);
    }
  };

  const getAllChildGrnNo = async (selectedPartNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getGrnNOByChild?orgId=${orgId}&branchCode=${branchCode}&client=${client}&partNo=${selectedPartNo}&warehouse=${warehouse}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setChildTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowGrnNoList: response.paramObjectsMap.kittingVO
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

  const handleChildGrnNoChange = (row, index, event) => {
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
    getAllChildBatchNo(value, row);
  };

  const getAllChildBatchNo = async (selectedGrnNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getBatchByChild?orgId=${orgId}&branchCode=${branchCode}&client=${client}&partNo=${row.partNo}&warehouse=${warehouse}&grnNo=${selectedGrnNo}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        const batchData = response.paramObjectsMap.kittingVO.map((item) => ({
          batchNo: item.batchNo,
          batchDate: item.batchDate,
          expDate: item.expDate
        }));
        setChildTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, rowBatchNoList: batchData } : r)));
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleChildBatchNoChange = (row, index, e) => {
    const value = e.target.value;
    console.log('Selected Batch No:', value);

    const selectedBatchNo = row.rowBatchNoList.find((option) => option.batchNo === value);
    console.log('Selected Batch Details:', selectedBatchNo);

    setChildTableData((prev) => {
      return prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              batchNo: selectedBatchNo ? selectedBatchNo.batchNo : '',
              batchDate: selectedBatchNo ? selectedBatchNo.batchDate : '',
              expDate: selectedBatchNo ? selectedBatchNo.expDate : ''
            }
          : r
      );
    });

    setChildTableErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        batchNo: ''
      };
      return newErrors;
    });

    getAllChildBin(row.partNo, row.grnNo, value, row);
  };

  const getAllChildBin = async (selectedPartNo, selectedGrnNo, selectedBatchNo, row) => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getBinByChild?orgId=${orgId}&branchCode=${branchCode}&client=${client}&partNo=${selectedPartNo}&warehouse=${warehouse}&grnNo=${selectedGrnNo}&batch=${selectedBatchNo}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setChildTableData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  rowBinList: response.paramObjectsMap.kittingVO
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

  const handleChildBinChange = (row, index, event) => {
    const value = event.target.value;
    const selectedToBin = row.rowBinList.find((row) => row.bin === value);
    setChildTableData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              bin: selectedToBin.bin,
              binClass: selectedToBin ? selectedToBin.binClass : '',
              binType: selectedToBin ? selectedToBin.binType : '',
              cellType: selectedToBin ? selectedToBin.cellType : '',
              core: selectedToBin ? selectedToBin.core : ''
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
    getAllAvlQty(row, value);
  };
  const getAllAvlQty = async (row, selectedBin) => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getSqtyByKitting?orgId=${orgId}&batch=${row.batchNo}&branchCode=${branchCode}&client=${client}&partNo=${row.partNo}&warehouse=${warehouse}&grnNo=${row.grnNo}&bin=${selectedBin}`
      );

      if (response.status === true) {
        const avlQty = response.paramObjectsMap.avlQty; // Update to match the response format
        setChildTableData((prevData) =>
          prevData.map((r) =>
            r.partNo === row.partNo && r.grnNo === row.grnNo
              ? {
                  ...r,
                  avlQty: avlQty // Update the avlQty for the corresponding row
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

  const getAllBinDetails = async () => {
    try {
      const response = await apiCalls(
        'get',
        `warehousemastercontroller/getAllBinDetails?warehouse=${warehouse}&branchCode=${branchCode}&client=${client}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        console.log('response.paramObjectsMap.Bins:', response.paramObjectsMap.Bins);
        const optionsBin = response.paramObjectsMap.Bins.map((item) => ({
          binClass: item.binClass,
          binType: item.binType, // Ensure these fields exist in the response
          cellType: item.cellType, // Ensure these fields exist in the response
          core: item.core,
          bin: item.bin
        }));
        setBinOptions(optionsBin);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllParentGRnNo = async (selectedPart, partNo) => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getGrnNOByParent?bin=${selectedPart.bin}&orgId=${orgId}&branch=${branch}&branchCode=${branchCode}&client=${client}&partDesc=${selectedPart.partDescription}&partNo=${partNo}&sku=${selectedPart.sku}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        const options = response.paramObjectsMap.kittingVO.map((item) => ({
          value: item.partNo,
          partDescription: item.partDesc, // Ensure these fields exist in the response
          sku: item.Sku // Ensure these fields exist in the response
        }));
        // setPartNoOptions(options);
        console.log('Mapped Part No Options:', options);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `kitting/getKittingInDocId?orgId=${orgId}&branchCode=${branchCode}&client=${client}&branch=${branch}&finYear=${finYear}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setDocId(response.paramObjectsMap.KittingDocId);
        setFormData((prevFormData) => ({
          ...prevFormData,
          docId: response.paramObjectsMap.KittingDocId
        }));
        const modifiedDocId = appendGNToDocumentId(response.paramObjectsMap.KittingDocId);
        console.log('Modified docId:', modifiedDocId); // Log the modified docId to verify it

        setParentTableData((prevParentTableData) =>
          prevParentTableData.map((row) => ({
            ...row,
            grnNo: modifiedDocId // Ensure this line correctly sets grnNo
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const getKittingById = async (row) => {
  //   console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
  //   setEditId(row.original.id);
  //   try {
  //     const response = await apiCalls('get', `kitting/getKittingById?id=${row.original.id}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setListView(false);
  //       const particularCustomer = response.paramObjectsMap.kittingVO;
  //       console.log('THE PARTICULAR CUSTOMER IS:', particularCustomer);

  //       // Update form data
  //       setFormData({
  //         docId: particularCustomer.docId,
  //         docDate: particularCustomer.docDate ? dayjs(particularCustomer.docDate) : dayjs(),
  //         refNo: particularCustomer.refNo || '',
  //         refDate: particularCustomer.refDate ? dayjs(particularCustomer.refDate) : '',
  //         active: particularCustomer.active === true,
  //         customer: particularCustomer.customer,
  //         branch: particularCustomer.branch,
  //         warehouse: particularCustomer.warehouse
  //       });

  //       // Update childTableData with kittingDetails1VO data
  //       setChildTableData(
  //         particularCustomer.kittingDetails1VO.map((detail) => ({
  //           id: detail.id,
  //           bin: detail.bin || '',
  //           partNo: detail.partNo || '',
  //           partDescription: detail.partDescription || '',
  //           batchNo: detail.batchNo || '',
  //           lotNo: detail.lotNo || '',
  //           grnNo: detail.grnNo || '',
  //           grnDate: detail.grnDate || '',
  //           sku: detail.sku || '',
  //           avlQty: detail.avlQty || '',
  //           qty: detail.qty || '',
  //           unitRate: detail.unitRate || '',
  //           amount: detail.amount || ''
  //           // getAllChildGrnNo(detail.partNo, detail)
  //         }))
  //       );

  //       // Update parentTableData with kittingDetails2VO data
  //       setParentTableData(
  //         particularCustomer.kittingDetails2VO.map((detail) => ({
  //           id: detail.id,
  //           partNo: detail.ppartNo || '',
  //           partDescription: detail.ppartDescription || '',
  //           batchNo: detail.pbatchNo || '',
  //           batchDate: detail.pbatchDate || '',
  //           lotNo: detail.plotNo || '',
  //           sku: detail.psku || '',
  //           qty: detail.pqty || '',
  //           unitRate: detail.punitRate || '',
  //           amount: detail.pamount || '',
  //           grnNo: detail.pgrnNo || '',
  //           grnDate: detail.pgrnDate || '',
  //           expDate: detail.pexpDate || ''
  //         }))
  //       );

  //       // Handle selected branch data
  //       const alreadySelectedBranch = particularCustomer.clientBranchVO.map((br) => {
  //         const foundBranch = branchList.find((branch) => branch.branchCode === br.branchCode);
  //         console.log(`Searching for branch with code ${br.branchCode}:`, foundBranch);
  //         return {
  //           id: br.id,
  //           branchCode: foundBranch ? foundBranch.branchCode : 'Not Found',
  //           branch: foundBranch ? foundBranch.branch : 'Not Found'
  //         };
  //       });
  //       setParentTableData(alreadySelectedBranch);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value, checked } = e.target;
  //   const nameRegex = /^[A-Za-z ]*$/;
  //   const alphaNumericRegex = /^[A-Za-z0-9]*$/;
  //   const numericRegex = /^[0-9]*$/;
  //   const branchNameRegex = /^[A-Za-z0-9@_\-*]*$/;
  //   const branchCodeRegex = /^[a-zA-Z0-9#_\-\/\\]*$/;

  //   let errorMessage = '';

  //   switch (name) {
  //     case 'customer':
  //     case 'shortName':
  //       if (!nameRegex.test(value)) {
  //         errorMessage = 'Only alphabetic characters are allowed';
  //       }
  //       break;
  //     case 'pan':
  //       if (!alphaNumericRegex.test(value)) {
  //         errorMessage = 'Only alphanumeric characters are allowed';
  //       } else if (value.length > 10) {
  //         errorMessage = 'Invalid Format';
  //       }
  //       break;
  //     case 'branchName':
  //       if (!branchNameRegex.test(value)) {
  //         errorMessage = 'Only alphanumeric characters and @, _, -, * are allowed';
  //       }
  //       break;
  //     case 'mobile':
  //       if (!numericRegex.test(value)) {
  //         errorMessage = 'Only numeric characters are allowed';
  //       } else if (value.length > 10) {
  //         errorMessage = 'Invalid Format';
  //       }
  //       break;
  //     case 'gst':
  //       if (!alphaNumericRegex.test(value)) {
  //         errorMessage = 'Only alphanumeric characters are allowed';
  //       } else if (value.length > 15) {
  //         errorMessage = 'Invalid Format';
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     if (name === 'active') {
  //       setFormData({ ...formData, [name]: checked });
  //     } else if (name === 'email') {
  //       setFormData({ ...formData, [name]: value });
  //     } else {
  //       setFormData({ ...formData, [name]: value.toUpperCase() });
  //     }

  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //   }
  // };

  const getKittingById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `kitting/getKittingById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularCustomer = response.paramObjectsMap.kittingVO;
        console.log('THE PARTICULAR CUSTOMER IS:', particularCustomer);

        // Update form data
        setFormData({
          docId: particularCustomer.docId,
          docDate: particularCustomer.docDate ? dayjs(particularCustomer.docDate) : dayjs(),
          refNo: particularCustomer.refNo || '',
          refDate: particularCustomer.refDate ? dayjs(particularCustomer.refDate) : '',
          active: particularCustomer.active === true,
          customer: particularCustomer.customer,
          branch: particularCustomer.branch,
          warehouse: particularCustomer.warehouse
        });

        // Update childTableData with kittingDetails1VO data
        const childTableDetails = particularCustomer.kittingDetails1VO.map((detail) => ({
          id: detail.id,
          bin: detail.bin || '',
          partNo: detail.partNo || '',
          partDescription: detail.partDescription || '',
          batchNo: detail.batchNo || '',
          lotNo: detail.lotNo || '',
          grnNo: detail.grnNo || '',
          grnDate: detail.grnDate || '',
          sku: detail.sku || '',
          avlQty: detail.avlQty || '',
          qty: detail.qty || '',
          unitRate: detail.unitRate || '',
          amount: detail.amount || '',
          rowGrnNoList: [] // Initialize with empty list
        }));

        setChildTableData(childTableDetails);

        // Call getAllChildGrnNo for each part number in childTableDetails
        const grnPromises = childTableDetails.map((row) => getAllChildGrnNo(row.partNo, row));
        const batchPromises = childTableDetails.map((row) => getAllChildBatchNo(row.grnNo, row));
        const binPromises = childTableDetails.map((row) => getAllChildBin(row.partNo, row.grnNo, row.batchNo, row));

        // Wait for all the getAllChildGrnNo API calls to complete
        await Promise.all(grnPromises, batchPromises, binPromises);

        // Update parentTableData with kittingDetails2VO data
        setParentTableData(
          particularCustomer.kittingDetails2VO.map((detail) => ({
            id: detail.id,
            partNo: detail.ppartNo || '',
            partDescription: detail.ppartDesc || '',
            batchNo: detail.pbatchNo || '',
            batchDate: detail.pbatchDate || '',
            lotNo: detail.plotNo || '',
            sku: detail.psku || '',
            qty: detail.pqty || '',
            unitRate: detail.punitRate || '',
            amount: detail.pamount || '',
            grnNo: detail.pgrnNo || '',
            grnDate: detail.pgrnDate || '',
            expDate: detail.pexpDate || '',
            bin: detail.pbin,
            core: detail.pcore,
            cellType: detail.pcellType,
            binType: detail.pbinType,
            binClass: detail.pbinClass
          }))
        );

        const alreadySelectedBranch = particularCustomer.clientBranchVO.map((br) => {
          const foundBranch = branchList.find((branch) => branch.branchCode === br.branchCode);
          console.log(`Searching for branch with code ${br.branchCode}:`, foundBranch);
          return {
            id: br.id,
            branchCode: foundBranch ? foundBranch.branchCode : 'Not Found',
            branch: foundBranch ? foundBranch.branch : 'Not Found'
          };
        });
        setParentTableData(alreadySelectedBranch);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    // Capture the cursor position before the update
    const cursorPosition = { start: selectionStart, end: selectionEnd };

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
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      if (name === 'active') {
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
      } else if (name === 'email') {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
      }

      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }

    // Restore cursor position after state update
    setTimeout(() => {
      const inputElement = document.querySelector(`[name=${name}]`);
      if (inputElement) {
        inputElement.setSelectionRange(cursorPosition.start, cursorPosition.end);
      }
    }, 0);
  };

  const handleDeleteRow = (id) => {
    setChildTableData(childTableData.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === childTableData[childTableData.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };
  const handleDeleteRow1 = (id) => {
    setParentTableData(parentTableData.filter((row) => row.id !== id));
  };
  // const handleKeyDown1 = (e, row) => {
  //   if (e.key === 'Tab' && row.id === parentTableData[parentTableData.length - 1].id) {
  //     e.preventDefault();
  //     handleAddRow1();
  //   }
  // };

  const handleClear = () => {
    setFormData({
      docDate: null,
      refNo: '',
      refDate: '',
      active: true
    });
    setChildTableData([
      {
        id: 1,
        bin: '',
        partNo: '',
        partDescription: '',
        batchNo: '',
        lotNo: '',
        grnNo: '',
        grnDate: '',
        sku: '',
        avlQty: '',
        qty: '',
        unitRate: '',
        amount: ''
      }
    ]);
    setParentTableData([
      {
        id: 1,
        partNo: '',
        partDescription: '',
        batchNo: '',
        lotNo: '',
        sku: '',
        qty: '',
        unitRate: '',
        amount: '',
        grnNo: '',
        grnDate: '',
        expDate: ''
      }
    ]);
    setFieldErrors({
      docId: '',
      docDate: '',
      refNo: '',
      refDate: ''
    });
    getDocId();
  };

  // const handleSave = async () => {
  //   const errors = {};
  //   let firstInvalidFieldRef = null;

  //   if (!formData.docId) {
  //     errors.docId = 'Doc Id is required';
  //   }
  //   // if (!formData.docDate) {
  //   //   errors.docDate = ' DocDate is required';
  //   // }
  //   if (!formData.refNo) {
  //     errors.refNo = 'Ref Id is required';
  //   }
  //   if (!formData.refDate) {
  //     errors.refDate = 'Ref Date is required';
  //   }

  //   let childTableDataValid = true;
  //   const newTableErrors = childTableData.map((row, index) => {
  //     const rowErrors = {};
  //     if (!row.partNo) {
  //       rowErrors.partNo = 'PartNo is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partNo;
  //       childTableDataValid = false;
  //     }
  //     if (!row.grnNo) {
  //       rowErrors.grnNo = 'Grn No is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].grnNo;
  //       childTableDataValid = false;
  //     }
  //     if (!row.batchNo) {
  //       rowErrors.batchNo = 'Batch No is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].batchNo;
  //       childTableDataValid = false;
  //     }
  //     if (!row.bin) {
  //       rowErrors.bin = 'Bin is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].bin;
  //       childTableDataValid = false;
  //     }
  //     if (!row.qty) {
  //       rowErrors.qty = 'qty Type is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].qty;
  //       childTableDataValid = false;
  //     }
  //     return rowErrors;
  //   });
  //   // setFieldErrors(errors);

  //   setChildTableErrors(newTableErrors);

  //   if (!childTableDataValid || Object.keys(errors).length > 0) {
  //     // Focus on the first invalid field
  //     if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
  //       firstInvalidFieldRef.current.focus();
  //     }
  //   } else {
  //     // Proceed with form submission
  //   }

  //   let parentTableDataValid = true;
  //   const newTableErrors1 = parentTableData.map((row, index) => {
  //     const rowErrors = {};
  //     if (!row.partNo) {
  //       rowErrors.partNo = 'P PartNo is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].partNo;
  //       parentTableDataValid = false;
  //     }
  //     if (!row.grnNo) {
  //       rowErrors.grnNo = 'P Grn No is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].grnNo;
  //       parentTableDataValid = false;
  //     }
  //     if (!row.batchNo) {
  //       rowErrors.batchNo = 'P Batch No is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].batchNo;
  //       parentTableDataValid = false;
  //     }
  //     if (!row.bin) {
  //       rowErrors.bin = 'P Bin is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].bin;
  //       parentTableDataValid = false;
  //     }
  //     if (!row.qty) {
  //       rowErrors.qty = 'P qty Type is required';
  //       if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].qty;
  //       parentTableDataValid = false;
  //     }
  //     return rowErrors;
  //   });
  //   setFieldErrors(errors);

  //   if (!parentTableDataValid || Object.keys(errors).length > 0) {
  //     // Focus on the first invalid field
  //     if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
  //       firstInvalidFieldRef.current.focus();
  //     }
  //   } else {
  //     // Proceed with form submission
  //   }

  //   setParentTableErrors(newTableErrors1);

  //   if (Object.keys(errors).length === 0 && childTableDataValid && parentTableDataValid) {
  //     setIsLoading(true);
  //     const childVO = childTableData.map((row) => ({
  //       bin: row.bin,
  //       partNo: row.partNo,
  //       partDescription: row.partDescription,
  //       batchNo: row.batchNo,
  //       expDate: row.expDate,
  //       batchDate: row.batchDate,
  //       lotNo: row.lotNo,
  //       grnNo: row.grnNo,
  //       binType: row.binType,
  //       binClass: row.binClass,
  //       cellType: row.cellType,
  //       core: row.core,
  //       grnDate: row.grnDate,
  //       sku: row.sku,
  //       avlQty: parseInt(row.avlQty),
  //       qty: parseInt(row.qty),
  //       unitRate: parseInt(row.unitRate),
  //       amount: parseInt(row.amount),
  //       qQcflag: true
  //     }));
  //     const ParentVO = parentTableData.map((row) => ({
  //       ppartNo: row.partNo,
  //       ppartDescription: row.partDescription,
  //       pbatchNo: row.batchNo,
  //       pbatchDate: row.batchDate,
  //       plotNo: row.lotNo,

  //       psku: row.sku,
  //       pqty: parseInt(row.qty),
  //       pbin: row.bin,
  //       pgrnNo: row.grnNo,
  //       pgrnDate: row.grnDate,
  //       pexpDate: row.expDate,
  //       pqcflag: true,
  //       pbinType: row.binType,
  //       pbinClass: row.binClass,
  //       pcellType: row.cellType,
  //       pcore: row.core
  //     }));

  //     const saveFormData = {
  //       ...(editId && { id: editId }),
  //       // docId: formData.docId,
  //       docDate: formData.docDate,
  //       refNo: formData.refNo,
  //       refDate: formData.refDate,
  //       kittingDetails1DTO: childVO,
  //       kittingDetails2DTO: ParentVO,
  //       orgId: orgId,
  //       createdBy: loginUserName,
  //       branch: branch,
  //       branchCode: branchCode,
  //       client: client,
  //       customer: customer,
  //       finYear: finYear,
  //       warehouse: warehouse
  //     };

  //     console.log('DATA TO SAVE IS:', saveFormData);
  //     try {
  //       const response = await apiCalls('put', `kitting/createUpdateKitting`, saveFormData);
  //       if (response.status === true) {
  //         console.log('Response:', response);
  //         handleClear();
  //         showToast('success', editId ? ' Kitting Updated Successfully' : 'Kitting created successfully');
  //         getAllKitting();
  //         setIsLoading(false);
  //       } else {
  //         showToast('error', response.paramObjectsMap.errorMessage || 'Kitting creation failed');
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //       showToast('error', 'Kitting creation failed');
  //       setIsLoading(false);
  //     }
  //   } else {
  //     setFieldErrors(errors);
  //   }
  // };

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;

    // Validate form fields
    if (!formData.docId) {
      errors.docId = 'Doc Id is required';
    }
    if (!formData.refNo) {
      errors.refNo = 'Ref Id is required';
    }
    if (!formData.refDate) {
      errors.refDate = 'Ref Date is required';
    }

    // Validate child table data
    let childTableDataValid = true;
    const newTableErrors = childTableData.map((row, index) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'PartNo is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].partNo;
        childTableDataValid = false;
      }
      if (!row.grnNo) {
        rowErrors.grnNo = 'Grn No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].grnNo;
        childTableDataValid = false;
      }
      if (!row.batchNo) {
        rowErrors.batchNo = 'Batch No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].batchNo;
        childTableDataValid = false;
      }
      if (!row.bin) {
        rowErrors.bin = 'Bin is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].bin;
        childTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'qty Type is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].qty;
        childTableDataValid = false;
      }
      return rowErrors;
    });
    setChildTableErrors(newTableErrors);

    // Reset firstInvalidFieldRef before validating parent table data
    let parentTableDataValid = true;
    const newTableErrors1 = parentTableData.map((row, index) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'P PartNo is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].partNo;
        parentTableDataValid = false;
      }
      if (!row.grnNo) {
        rowErrors.grnNo = 'P Grn No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].grnNo;
        parentTableDataValid = false;
      }
      if (!row.batchNo) {
        rowErrors.batchNo = 'P Batch No is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].batchNo;
        parentTableDataValid = false;
      }
      if (!row.bin) {
        rowErrors.bin = 'P Bin is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].bin;
        parentTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'P qty Type is required';
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoParentDetailsRefs.current[index].qty;
        parentTableDataValid = false;
      }
      return rowErrors;
    });
    setParentTableErrors(newTableErrors1);

    // Set general form errors
    setFieldErrors(errors);

    if (!childTableDataValid || !parentTableDataValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
    } else {
      // Proceed with form submission
      setIsLoading(true);

      // Mapping child table data for the API
      const childVO = childTableData.map((row) => ({
        bin: row.bin,
        partNo: row.partNo,
        partDescription: row.partDescription,
        batchNo: row.batchNo,
        expDate: row.expDate,
        batchDate: row.batchDate,
        lotNo: row.lotNo,
        grnNo: row.grnNo,
        binType: row.binType,
        binClass: row.binClass,
        cellType: row.cellType,
        core: row.core,
        grnDate: row.grnDate,
        sku: row.sku,
        avlQty: parseInt(row.avlQty),
        qty: parseInt(row.qty),
        unitRate: parseInt(row.unitRate),
        amount: parseInt(row.amount),
        qQcflag: true
      }));

      // Mapping parent table data for the API
      const ParentVO = parentTableData.map((row) => ({
        ppartNo: row.partNo,
        ppartDescription: row.partDescription,
        pbatchNo: row.batchNo,
        pbatchDate: row.batchDate,
        plotNo: row.lotNo,
        psku: row.sku,
        pqty: parseInt(row.qty),
        pbin: row.bin,
        pgrnNo: row.grnNo,
        pgrnDate: row.grnDate,
        pexpDate: row.expDate,
        pqcflag: true,
        pbinType: row.binType,
        pbinClass: row.binClass,
        pcellType: row.cellType,
        pcore: row.core
      }));

      // Data to save
      const saveFormData = {
        ...(editId && { id: editId }),
        docDate: formData.docDate,
        refNo: formData.refNo,
        refDate: formData.refDate,
        kittingDetails1DTO: childVO,
        kittingDetails2DTO: ParentVO,
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
        const response = await apiCalls('put', `kitting/createUpdateKitting`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          showToast('success', editId ? 'Kitting Updated Successfully' : 'Kitting created successfully');
          getAllKitting();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Kitting creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Kitting creation failed');
        setIsLoading(false);
      }
    }
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleParentTableChange = (index, field, value) => {
    const updatedData = [...parentTableData];
    updatedData[index] = { ...updatedData[index], [field]: value };

    // Additional logic if necessary (e.g., dependent field updates)
    if (field === 'qty' || field === 'unitRate') {
      updatedData[index].amount = updatedData[index].qty * updatedData[index].unitRate;
    }

    setParentTableData(updatedData);

    // Handle validation errors if needed
    const updatedErrors = [...parentTableErrors];
    if (value === '') {
      updatedErrors[index] = { ...updatedErrors[index], [field]: 'This field is required' };
    } else {
      if (updatedErrors[index]) {
        delete updatedErrors[index][field];
      }
    }
    setParentTableErrors(updatedErrors);
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
            <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={() => handleSave()} margin="0 10px 0 10px" />
          </div>
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getKittingById} />
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
                  label={
                    <span>
                      Ref Id <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="refNo"
                  value={formData.refNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.refNo}
                  helperText={fieldErrors.refNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ref Date"
                      value={formData.refDate ? dayjs(formData.refDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('refDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.refDate}
                      helperText={fieldErrors.refDate}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
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
                  <Tab value={0} label="Kitting Child" />
                  <Tab value={1} label="Kitting Parent" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      {/* Table */}
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
                                  <th className="px-2 py-2 text-white text-center">Part No</th>
                                  <th className="px-2 py-2 text-white text-center">Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">SKU</th>
                                  <th className="px-2 py-2 text-white text-center">GRN No</th>
                                  <th className="px-2 py-2 text-white text-center">GRN Date</th>
                                  <th className="px-2 py-2 text-white text-center">Batch No</th>
                                  {/* <th className="px-2 py-2 text-white text-center">Lot No</th> */}
                                  <th className="px-2 py-2 text-white text-center">Bin</th>
                                  <th className="px-2 py-2 text-white text-center">Avl Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {childTableData.map((row, index) => (
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
                                        onChange={(e) => handleChildPartNoChange(row, index, e)}
                                        className={childTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">-- Select --</option>
                                        {childPartNoList?.map((row, index) => (
                                          <option key={index} value={row.partNo}>
                                            {row.partNo}
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
                                        value={row.partDescription}
                                        disabled
                                        style={{ width: '200px' }}
                                        className={childTableErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
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
                                        onChange={(e) => handleChildGrnNoChange(row, index, e)}
                                        className={childTableErrors[index]?.grnNo ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">-- Select --</option>
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
                                      <input
                                        type="date"
                                        value={row.grnDate}
                                        disabled
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setChildTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, grnDate: value } : r)));
                                          setChildTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], grnDate: !value ? 'GRN Date is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={childTableErrors[index]?.grnDate ? 'error form-control' : 'form-control'}
                                      />
                                      {childTableErrors[index]?.grnDate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {childTableErrors[index].grnDate}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <select
                                        ref={lrNoDetailsRefs.current[index]?.batchNo}
                                        value={row.batchNo}
                                        style={{ width: '130px' }}
                                        onChange={(e) => handleChildBatchNoChange(row, index, e)}
                                        className={childTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select batch No</option>
                                        {Array.isArray(row.rowBatchNoList) &&
                                          row.rowBatchNoList.map((batch) => (
                                            <option key={batch.id} value={batch.batchNo}>
                                              {batch.batchNo}
                                            </option>
                                          ))}
                                      </select>
                                      {childTableErrors[index]?.batchNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {childTableErrors[index].batchNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        ref={lrNoDetailsRefs.current[index]?.bin}
                                        value={row.bin}
                                        style={{ width: '130px' }}
                                        onChange={(e) => handleChildBinChange(row, index, e)}
                                        className={childTableErrors[index]?.bin ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">--Select--</option>
                                        {Array.isArray(row.rowBinList) &&
                                          row.rowBinList.map((bin, idx) => (
                                            <option key={bin.bin} value={bin.bin}>
                                              {bin.bin}
                                            </option>
                                          ))}
                                      </select>
                                      {childTableErrors[index]?.bin && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {childTableErrors[index].bin}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.avlQty}
                                        disabled
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setChildTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, avlQty: value } : r)));
                                          setChildTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], avlQty: !value ? 'Avl Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={childTableErrors[index]?.avlQty ? 'error form-control' : 'form-control'}
                                      />
                                      {childTableErrors[index]?.avlQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {childTableErrors[index].avlQty}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.qty}
                                        type="text"
                                        value={row.qty}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setChildTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r)));
                                          setChildTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = { ...newErrors[index], qty: !value ? 'Qty is required' : '' };
                                            return newErrors;
                                          });
                                        }}
                                        className={childTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                      />
                                      {childTableErrors[index]?.qty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {childTableErrors[index].qty}
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
                      <div className="mb-1">{parentTableData.length > 0 ? '' : <ActionButton title="Add" icon={AddIcon} />}</div>
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
                                  <th className="px-2 py-2 text-white text-center">P Part No</th>
                                  <th className="px-2 py-2 text-white text-center">P Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">P SKU</th>
                                  <th className="px-2 py-2 text-white text-center">P GRN No</th>
                                  <th className="px-2 py-2 text-white text-center">P GRN Date</th>
                                  <th className="px-2 py-2 text-white text-center">P Batch No</th>
                                  <th className="px-2 py-2 text-white text-center">P Batch Date</th>
                                  <th className="px-2 py-2 text-white text-center">P Lot No</th>
                                  <th className="px-2 py-2 text-white text-center">P Bin</th>
                                  <th className="px-2 py-2 text-white text-center">P Qty</th>
                                  {/* <th className="px-2 py-2 text-white text-center">P Unit Rate</th>
                                  <th className="px-2 py-2 text-white text-center">P Amount</th> */}

                                  <th className="px-2 py-2 text-white text-center">P Exp Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {parentTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRow1(row.id)} />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        ref={lrNoParentDetailsRefs.current[index]?.partNo}
                                        value={row.partNo}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          console.log('Selected Part No:', value);

                                          const selectedPart = partNoOptions1.find((option) => String(option.value) === String(value));
                                          console.log('Selected Part Details:', selectedPart);

                                          if (selectedPart) {
                                            setParentTableData((prev) => {
                                              return prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      partNo: value,
                                                      partDescription: selectedPart.partDescription,
                                                      sku: selectedPart.sku
                                                    }
                                                  : r
                                              );
                                            });
                                            getAllParentGRnNo(selectedPart, value);
                                          }

                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              partNo: !value ? 'Part No is required' : '',
                                              partDescription: !selectedPart ? 'Part Description is required' : '',
                                              sku: !selectedPart ? 'SKU is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.partNo ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">Select Part No</option>
                                        {partNoOptions1 &&
                                          partNoOptions1.map((option) => (
                                            <option key={option.value} value={option.value}>
                                              {option.value}
                                            </option>
                                          ))}
                                      </select>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.partDescription}
                                        disabled
                                        style={{ width: '200px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) =>
                                            prev.map((r, i) => (i === index ? { ...r, partDescription: value } : r))
                                          );
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              partDescription: !value ? 'Part Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
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
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, sku: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sku: !value ? 'SKU is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.sku ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoParentDetailsRefs.current[index]?.grnNo}
                                        type="text"
                                        value={row.grnNo}
                                        disabled
                                        style={{ width: '220px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, grnNo: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              grnNo: !value ? 'GRN No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.grnNo ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="date"
                                        value={row.grnDate}
                                        // disabled
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, grnDate: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              grnDate: !value ? 'GRN Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.grnDate ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoParentDetailsRefs.current[index]?.batchNo}
                                        type="text"
                                        value={row.batchNo}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, batchNo: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              batchNo: !value ? 'Batch No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.batchNo ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="date"
                                        value={row.batchDate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, batchDate: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              batchDate: !value ? 'Batch Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.batchDate ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.lotNo}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, lotNo: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              lotNo: !value ? 'Lot No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.lotNo ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <select
                                        ref={lrNoParentDetailsRefs.current[index]?.bin}
                                        value={row.bin}
                                        style={{ width: '130px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          console.log('Selected Bin No:', value);

                                          const selectedBin = binOptions.find((option) => option.bin === value);
                                          console.log('Selected Bin Details:', selectedBin);

                                          if (selectedBin) {
                                            setParentTableData((prev) => {
                                              return prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      bin: selectedBin.bin,
                                                      core: selectedBin.core,
                                                      cellType: selectedBin.cellType,
                                                      binType: selectedBin.binType,
                                                      binClass: selectedBin.binClass
                                                    }
                                                  : r
                                              );
                                            });
                                          }

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
                                        <option value="">Select bin</option>
                                        {binOptions &&
                                          binOptions.map((option) => (
                                            <option key={option.bin} value={option.bin}>
                                              {option.bin}
                                            </option>
                                          ))}
                                      </select>
                                      {childTableErrors[index]?.bin && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {childTableErrors[index].bin}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoParentDetailsRefs.current[index]?.qty}
                                        type="number"
                                        value={row.qty}
                                        style={{ width: '100px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, qty: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              qty: !value ? 'Quantity is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="date"
                                        value={row.expDate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setParentTableData((prev) => prev.map((r, i) => (i === index ? { ...r, expDate: value } : r)));
                                          setParentTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              expDate: !value ? 'Exp Date is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={parentTableErrors[index]?.expDate ? 'error form-control' : 'form-control'}
                                      />
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
export default Kitting;
