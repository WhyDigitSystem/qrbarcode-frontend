import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, ButtonBase, FormHelperText, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CommonListViewTable from '../basic-masters/CommonListViewTable';
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
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
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { getAllActiveCarrier, getAllActiveSupplier } from 'utils/CommonFunctions';
import { Form } from 'react-router-dom';
import React, { useRef } from 'react';
import GeneratePdfDeliveryChallanpdf from './DeliveryChallenpdf';

export const DeliveryChallen = () => {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');
  const [editBuyerOrderNo, setEditBuyerOrderNo] = useState('');
  const [supplierList, setSupplierList] = useState([]);
  const [carrierList, setCarrierList] = useState([]);
  const [partNoList, setPartNoList] = useState([]);
  const [modeOfShipmentList, setModeOfShipmentList] = useState([]);
  const [buyerOrderList, setBuyerOrderList] = useState([]);
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [cbranch, setCbranch] = useState(localStorage.getItem('branchcode'));
  const [client, setClient] = useState(localStorage.getItem('client'));
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [customer, setCustomer] = useState(localStorage.getItem('customer'));
  const [warehouse, setWarehouse] = useState(localStorage.getItem('warehouse'));
  const [finYear, setFinYear] = useState('2024');
  const [deliveryChallanDocId, setDeliveryChallanDocId] = useState('');

  const [downloadPdf, setDownloadPdf] = useState(false);
  const [pdfData, setPdfData] = useState([]);

  const [formData, setFormData] = useState({
    docDate: dayjs(),
    buyerOrderNo: '',
    pickReqDate: null,
    invoiceNo: '',
    containerNO: '',
    vechileNo: '',
    exciseInvoiceNo: '',
    commercialInvoiceNo: '',
    boDate: null,
    buyer: '',
    deliveryTerms: '',
    payTerms: '',
    grWaiverNo: '',
    grWaiverDate: dayjs(),
    bankName: '',
    grWaiverClosureDate: dayjs(),
    gatePassNo: '',
    gatePassDate: dayjs(),
    insuranceNo: '',
    billTo: '',
    shipTo: '',
    automailerGroup: '',
    docketNo: '',
    noOfBoxes: '',
    pkgUom: '',
    grossWeight: '',
    gwtUom: '',
    transportName: '',
    transporterDate: dayjs(),
    packingSlipNo: '',
    bin: '',
    taxType: '',
    remarks: '',
    freeze: false
  });
  const [value, setValue] = useState(0);

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      pickRequestNo: '',
      prDate: null,
      partNo: '',
      partDescription: '',
      outBoundBin: '',
      shippedQty: '',
      unitRate: '',
      skuValue: '',
      discount: '',
      tax: '',
      gstTax: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      totalGst: '',
      billAmount: '',
      remarks: ''
    };

    setLrNoDetailsTable((prev) => [...prev, newRow]);
    setLrNoDetailsError((prev) => [
      ...prev,
      {
        pickRequestNo: '',
        prDate: null,
        partNo: '',
        partDescription: '',
        outBoundBin: '',
        shippedQty: '',
        unitRate: '',
        skuValue: '',
        discount: '',
        tax: '',
        gstTax: '',
        amount: '',
        sgst: '',
        cgst: '',
        igst: '',
        totalGst: '',
        billAmount: '',
        remarks: ''
      }
    ]);

    lrNoDetailsRefs.current = [
      ...lrNoDetailsRefs.current,
      {
        outBoundBin: React.createRef(),
        unitRate: React.createRef(),
        skuValue: React.createRef(),
        discount: React.createRef(),
        tax: React.createRef(),
        gstTax: React.createRef(),
        amount: React.createRef(),
        sgst: React.createRef(),
        cgst: React.createRef(),
        igst: React.createRef(),
        totalGst: React.createRef(),
        billAmount: React.createRef()
      }
    ];
  };

  const [lrNoDetailsError, setLrNoDetailsError] = useState([
    {
      pickRequestNo: '',
      prDate: null,
      partNo: '',
      partDescription: '',
      outBoundBin: '',
      shippedQty: '',
      unitRate: '',
      skuValue: '',
      discount: '',
      tax: '',
      gstTax: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      totalGst: '',
      billAmount: '',
      remarks: ''
    }
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    docDate: new Date(),
    buyerOrderNo: '',
    pickReqDate: null,
    invoiceNo: '',
    containerNO: '',
    vechileNo: '',
    exciseInvoiceNo: '',
    commercialInvoiceNo: '',
    boDate: null,
    buyer: '',
    deliveryTerms: '',
    payTerms: '',
    grWaiverNo: '',
    grWaiverDate: null,
    bankName: '',
    grWaiverClosureDate: null,
    gatePassNo: '',
    gatePassDate: null,
    insuranceNo: '',
    billTo: '',
    shipTo: '',
    automailerGroup: '',
    docketNo: '',
    noOfBoxes: '',
    pkgUom: '',
    grossWeight: '',
    gwtUom: '',
    transportName: '',
    transporterDate: null,
    packingSlipNo: '',
    bin: '',
    taxType: '',
    remarks: ''
  });
  const [listView, setListView] = useState(false);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'Doc ID', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'buyerOrderNo', header: 'Buyer Order No', size: 140 },
    { accessorKey: 'buyer', header: 'Buyer', size: 140 },
    { accessorKey: 'gatePassNo', header: 'Gate Pass No', size: 140 },
    { accessorKey: 'transportName', header: 'Transport Name', size: 140 }
    // { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const [listViewData, setListViewData] = useState([]);
  const [lrNoDetailsTable, setLrNoDetailsTable] = useState([
    {
      id: 1,
      pickRequestNo: '',
      prDate: null,
      partNo: '',
      partDescription: '',
      outBoundBin: '',
      shippedQty: '',
      unitRate: '',
      skuValue: '',
      discount: '',
      tax: '',
      gstTax: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      totalGst: '',
      billAmount: '',
      remarks: ''
    }
  ]);

  const lrNoDetailsRefs = useRef(
    lrNoDetailsTable.map(() => ({
      outBoundBin: React.createRef(),
      unitRate: React.createRef(),
      skuValue: React.createRef(),
      discount: React.createRef(),
      tax: React.createRef(),
      gstTax: React.createRef(),
      amount: React.createRef(),
      sgst: React.createRef(),
      cgst: React.createRef(),
      igst: React.createRef(),
      totalGst: React.createRef(),
      billAmount: React.createRef()
    }))
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getAllBuyerOrderNo();
    getDeliveryChallanDocId();
    getAllDeliveryChallan();
  }, []);

  const getDeliveryChallanDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `deliverychallan/getDeliveryChallanDocId?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setDeliveryChallanDocId(response.paramObjectsMap.DeliveryChallanDocId);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllBuyerOrderNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `deliverychallan/getAllPickRequestFromDeliveryChallan?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setBuyerOrderList(response.paramObjectsMap.pickRequestVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBuyerOrderDataByAllData = async (buyerOrderNo) => {
    try {
      const response = await apiCalls(
        'get',
        `deliverychallan/getBuyerShipToBillToFromBuyerOrderForDeliveryChallan?branch=${branch}&branchCode=${cbranch}&buyerOrderNo=${buyerOrderNo}&client=${client}&finYear=${finYear}&orgId=${orgId}`
      );

      console.log('API Response:', response);

      if (response.status === true && response.paramObjectsMap.vasPutawayVO.length > 0) {
        const { buyer, billTo, shipTo } = response.paramObjectsMap.vasPutawayVO[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          buyer: buyer || '',
          billTo: billTo || '',
          shipTo: shipTo || ''
        }));
      } else {
        // Clear the fields if no data is returned
        setFormData((prevFormData) => ({
          ...prevFormData,
          buyer: '',
          billTo: '',
          shipTo: ''
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Clear the fields in case of error
      setFormData((prevFormData) => ({
        ...prevFormData,
        buyer: '',
        billTo: '',
        shipTo: ''
      }));
    }
  };

  const getBuyerOrderNoByTableData = async (buyerOrderNo) => {
    try {
      const response = await apiCalls(
        'get',
        `deliverychallan/getDocidDocdatePartnoPartDescFromPickRequestForDeliveryChallan?branch=${branch}&branchCode=${cbranch}&buyerOrderNo=${buyerOrderNo}&client=${client}&finYear=${finYear}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true && response.paramObjectsMap.deliveryChallanVO.length > 0) {
        const tableData = response.paramObjectsMap.deliveryChallanVO.map((item) => ({
          pickRequestNo: item.docId || '',
          prDate: item.docDate || '',
          partNo: item.partno || '',
          partDescription: item.partDesc || '',
          shippedQty: item.shippedQty || ''
        }));

        setLrNoDetailsTable(tableData);
      } else {
        // Clear the fields if no data is returned
        setLrNoDetailsTable([
          {
            pickRequestNo: '',
            prDate: '',
            partNo: '',
            partDescription: '',
            shippedQty: ''
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Clear the fields in case of error
      setLrNoDetailsTable([
        {
          pickRequestNo: '',
          prDate: '',
          partNo: '',
          partDescription: '',
          shippedQty: ''
        }
      ]);
    }
  };

  const getAllDeliveryChallan = async () => {
    try {
      const response = await apiCalls(
        'get',
        `deliverychallan/getAllDeliveryChallan?branch=${branch}&branchCode=${cbranch}&client=${client}&finYear=${finYear}&orgId=${orgId}&warehouse=${warehouse}`
      );

      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.DeliveryChallanVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDeliverChallanById = async (row) => {
    console.log('THE SELECTED EMPLOYEE ID IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `deliverychallan/getDeliveryChallanById?id=${row.original.id}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListView(false);
        const particularDeliveryChallan = response.paramObjectsMap.deliveryChallanVO;
        console.log('THE PARTICULAR CUSTOMER IS:', particularDeliveryChallan);
        setDeliveryChallanDocId(particularDeliveryChallan.docId);
        setEditBuyerOrderNo(particularDeliveryChallan.buyerOrderNo);
        console.log('buy', particularDeliveryChallan.buyerOrderNo);
        setFormData({
          docDate: particularDeliveryChallan.docDate,
          buyerOrderNo: particularDeliveryChallan.buyerOrderNo,
          pickReqDate: particularDeliveryChallan.pickReqDate,
          invoiceNo: particularDeliveryChallan.invoiceNo,
          containerNO: particularDeliveryChallan.containerNO,
          vechileNo: particularDeliveryChallan.vechileNo,
          exciseInvoiceNo: particularDeliveryChallan.exciseInvoiceNo,
          commercialInvoiceNo: particularDeliveryChallan.commercialInvoiceNo,
          boDate: particularDeliveryChallan.boDate,
          buyer: particularDeliveryChallan.buyer,
          deliveryTerms: particularDeliveryChallan.deliveryTerms,
          payTerms: particularDeliveryChallan.payTerms,
          grWaiverNo: particularDeliveryChallan.grWaiverNo,
          grWaiverDate: particularDeliveryChallan.grWaiverDate,
          bankName: particularDeliveryChallan.bankName,
          grWaiverClosureDate: particularDeliveryChallan.grWaiverClosureDate,
          gatePassNo: particularDeliveryChallan.gatePassNo,
          gatePassDate: particularDeliveryChallan.gatePassDate,
          insuranceNo: particularDeliveryChallan.insuranceNo,
          billTo: particularDeliveryChallan.billTo,
          shipTo: particularDeliveryChallan.shipTo,
          automailerGroup: particularDeliveryChallan.automailerGroup,
          docketNo: particularDeliveryChallan.docketNo,
          noOfBoxes: particularDeliveryChallan.noOfBoxes,
          pkgUom: particularDeliveryChallan.pkgUom,
          grossWeight: particularDeliveryChallan.grossWeight,
          gwtUom: particularDeliveryChallan.gwtUom,
          transportName: particularDeliveryChallan.transportName,
          transporterDate: particularDeliveryChallan.transporterDate,
          packingSlipNo: particularDeliveryChallan.packingSlipNo,
          bin: particularDeliveryChallan.bin,
          taxType: particularDeliveryChallan.taxType,
          remarks: particularDeliveryChallan.remarks,
          freeze: particularDeliveryChallan.freeze
          // active: particularDeliveryChallan.active === 'Active' ? true : false
        });
        setLrNoDetailsTable(
          particularDeliveryChallan.deliveryChallanDetailsVO.map((detail) => ({
            id: detail.id,
            pickRequestNo: detail.pickRequestNo,
            prDate: detail.prDate,
            partNo: detail.partNo,
            partDescription: detail.partDescription,
            outBoundBin: detail.outBoundBin,
            shippedQty: detail.shippedQty,
            unitRate: detail.unitRate,
            skuValue: detail.skuValue,
            discount: detail.discount,
            tax: detail.tax,
            gstTax: detail.gstTax,
            grnQty: detail.grnQty,
            amount: detail.amount,
            sgst: detail.sgst,
            cgst: detail.cgst,
            igst: detail.igst,
            totalGst: detail.totalGst,
            billAmount: detail.billAmount,
            remarks: detail.remarks
          }))
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBuyerOrderChange = async (event) => {
    const selectedBuyerOrderNo = event.target.value;
    const selectedBuyerOrder = buyerOrderList.find((buyer) => buyer.buyerOrderNo === selectedBuyerOrderNo);

    if (selectedBuyerOrder) {
      setFormData({
        ...formData,
        buyerOrderNo: selectedBuyerOrder.buyerOrderNo,
        invoiceNo: selectedBuyerOrder.invoiceNo,
        pickReqDate: selectedBuyerOrder.docDate,
        boDate: selectedBuyerOrder.buyerRefDate,
        buyer: '',
        billTo: '',
        shipTo: ''
      });

      // Fetch additional data for form fields
      await getBuyerOrderDataByAllData(selectedBuyerOrder.buyerOrderNo);

      // Fetch table data and populate it
      await getBuyerOrderNoByTableData(selectedBuyerOrder.buyerOrderNo);
    }
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;

  //   // Define regex patterns
  //   const patterns = {
  //     vechileNo: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     containerNO: /^[a-zA-Z]*$/, // Allow alphabets only
  //     exciseInvoiceNo: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     commercialInvoiceNo: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     deliveryTerms: /^[a-zA-Z]*$/, // Allow alphabets only
  //     payTerms: /^[a-zA-Z]*$/, // Allow alphabets only
  //     grWaiverNo: /^[a-zA-Z]*$/, // Allow alphabets only
  //     bankName: /^[a-zA-Z]*$/, // Allow alphabets only
  //     gatePassNo: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     insuranceNo: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     automailerGroup: /^[a-zA-Z]*$/, // Allow alphabets only
  //     docketNo: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     noOfBoxes: /^[0-9]*$/, // Allow numbers only
  //     pkgUom: /^[a-zA-Z]*$/, // Allow alphabets only
  //     grossWeight: /^[0-9]*$/, // Allow numbers only
  //     gwtUom: /^[a-zA-Z]*$/, // Allow alphabets only
  //     transportName: /^[a-zA-Z]*$/, // Allow alphabets only
  //     packingSlipNo: /^[0-9]*$/, // Allow numbers only
  //     bin: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     taxType: /^[a-zA-Z0-9]*$/, // Allow alphabets and numbers only
  //     remarks: /^[a-zA-Z0-9]*$/ // Allow alphabets and numbers only
  //   };

  //   // Determine the error message based on the field
  //   const getErrorMessage = (fieldName) => {
  //     if (patterns[fieldName]) {
  //       if (fieldName === 'noOfBoxes' || fieldName === 'grossWeight' || fieldName === 'packingSlipNo') {
  //         return 'Only numbers are allowed.';
  //       } else if (
  //         fieldName === 'containerNO' ||
  //         fieldName === 'deliveryTerms' ||
  //         fieldName === 'payTerms' ||
  //         fieldName === 'grWaiverNo' ||
  //         fieldName === 'bankName' ||
  //         fieldName === 'automailerGroup' ||
  //         fieldName === 'pkgUom' ||
  //         fieldName === 'gwtUom' ||
  //         fieldName === 'transportName'
  //       ) {
  //         return 'Only alphabets are allowed.';
  //       } else {
  //         return 'Only alphabets and numbers are allowed.';
  //       }
  //     }
  //     return '';
  //   };

  //   // Validation and update logic
  //   if (patterns[name] && !patterns[name].test(value)) {
  //     setFieldErrors({
  //       ...fieldErrors,
  //       [name]: getErrorMessage(name)
  //     });
  //   } else {
  //     // Clear errors and convert value to uppercase before updating form data
  //     setFieldErrors({ ...fieldErrors, [name]: '' });
  //     setFormData({ ...formData, [name]: value.toUpperCase() });
  //   }
  // };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const inputElement = event.target;

    // Capture the cursor position before updating the form
    const cursorPosition = inputElement.selectionStart;

    // Define regex patterns for validation
    const patterns = {
      vechileNo: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      containerNO: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      exciseInvoiceNo: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      commercialInvoiceNo: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      deliveryTerms: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      payTerms: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      grWaiverNo: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      bankName: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      gatePassNo: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      insuranceNo: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      automailerGroup: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      docketNo: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      noOfBoxes: /^[0-9\s]*$/, // Allow numbers and spaces
      pkgUom: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      grossWeight: /^[0-9\s]*$/, // Allow numbers and spaces
      gwtUom: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      transportName: /^[a-zA-Z\s]*$/, // Allow alphabets and spaces
      packingSlipNo: /^[0-9\s]*$/, // Allow numbers and spaces
      bin: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      taxType: /^[a-zA-Z0-9\s]*$/, // Allow alphabets, numbers, and spaces
      remarks: /^[a-zA-Z0-9\s]*$/ // Allow alphabets, numbers, and spaces
    };

    // Determine the error message based on the field and validation pattern
    const getErrorMessage = (fieldName) => {
      if (patterns[fieldName]) {
        if (fieldName === 'noOfBoxes' || fieldName === 'grossWeight' || fieldName === 'packingSlipNo') {
          return 'Only numbers are allowed.';
        } else if (
          fieldName === 'containerNO' ||
          fieldName === 'deliveryTerms' ||
          fieldName === 'payTerms' ||
          fieldName === 'grWaiverNo' ||
          fieldName === 'bankName' ||
          fieldName === 'automailerGroup' ||
          fieldName === 'pkgUom' ||
          fieldName === 'gwtUom' ||
          fieldName === 'transportName'
        ) {
          return 'Only alphabets are allowed.';
        } else {
          return 'Only alphabets and numbers are allowed.';
        }
      }
      return '';
    };

    // Validate the input and display errors if necessary
    if (patterns[name] && !patterns[name].test(value)) {
      setFieldErrors({
        ...fieldErrors,
        [name]: getErrorMessage(name)
      });
    } else {
      // Clear errors and update the form data in uppercase
      setFieldErrors({ ...fieldErrors, [name]: '' });
      setFormData({ ...formData, [name]: value.toUpperCase() });
    }

    // Restore the cursor position after the form data update
    setTimeout(() => {
      inputElement.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleDeleteRow = (id) => {
    setLrNoDetailsTable(lrNoDetailsTable.filter((row) => row.id !== id));
  };
  const handleKeyDown = (e, row) => {
    if (e.key === 'Tab' && row.id === lrNoDetailsTable[lrNoDetailsTable.length - 1].id) {
      e.preventDefault();
      handleAddRow();
    }
  };

  const handleClear = () => {
    setDeliveryChallanDocId('');
    setEditBuyerOrderNo('');
    setFormData({
      // deliveryChallanDocId: '',
      docDate: dayjs(),
      buyerOrderNo: '',
      pickReqDate: null,
      invoiceNo: '',
      containerNO: '',
      vechileNo: '',
      exciseInvoiceNo: '',
      commercialInvoiceNo: '',
      boDate: null,
      buyer: '',
      deliveryTerms: '',
      payTerms: '',
      grWaiverNo: '',
      grWaiverDate: null,
      bankName: '',
      grWaiverClosureDate: null,
      gatePassNo: '',
      gatePassDate: null,
      insuranceNo: '',
      billTo: '',
      shipTo: '',
      automailerGroup: '',
      docketNo: '',
      noOfBoxes: '',
      pkgUom: '',
      grossWeight: '',
      gwtUom: '',
      transportName: '',
      transporterDate: '',
      packingSlipNo: '',
      bin: '',
      taxType: '',
      remarks: '',
      freeze: false
    });
    setLrNoDetailsTable([
      {
        pickRequestNo: '',
        prDate: null,
        partNo: '',
        partDescription: '',
        outBoundBin: '',
        shippedQty: '',
        unitRate: '',
        skuValue: '',
        discount: '',
        tax: '',
        gstTax: '',
        amount: '',
        sgst: '',
        cgst: '',
        igst: '',
        totalGst: '',
        billAmount: '',
        remarks: ''
      }
    ]);
    setLrNoDetailsError('');
    setFieldErrors({
      docDate: new Date(),
      buyerOrderNo: '',
      pickReqDate: null,
      invoiceNo: '',
      containerNO: '',
      vechileNo: '',
      exciseInvoiceNo: '',
      commercialInvoiceNo: '',
      boDate: null,
      buyer: '',
      deliveryTerms: '',
      payTerms: '',
      grWaiverNo: '',
      grWaiverDate: null,
      bankName: '',
      grWaiverClosureDate: null,
      gatePassNo: '',
      gatePassDate: null,
      insuranceNo: '',
      billTo: '',
      shipTo: '',
      automailerGroup: '',
      docketNo: '',
      noOfBoxes: '',
      pkgUom: '',
      grossWeight: '',
      gwtUom: '',
      transportName: '',
      transporterDate: '',
      packingSlipNo: '',
      bin: '',
      taxType: '',
      remarks: ''
    });
    getDeliveryChallanDocId();
  };

  useEffect(() => {
    // Ensure the refs array always matches the length of lrNoDetailsTable
    if (lrNoDetailsRefs.current.length < lrNoDetailsTable.length) {
      const diff = lrNoDetailsTable.length - lrNoDetailsRefs.current.length;
      lrNoDetailsRefs.current = [
        ...lrNoDetailsRefs.current,
        ...Array(diff)
          .fill()
          .map(() => ({
            outBoundBin: React.createRef(),
            unitRate: React.createRef(),
            skuValue: React.createRef(),
            discount: React.createRef(),
            tax: React.createRef(),
            gstTax: React.createRef(),
            amount: React.createRef(),
            sgst: React.createRef(),
            cgst: React.createRef(),
            igst: React.createRef(),
            totalGst: React.createRef(),
            billAmount: React.createRef()
          }))
      ];
    }
  }, [lrNoDetailsTable.length]);

  const handleSave = async () => {
    const errors = {};
    let firstInvalidFieldRef = null;

    if (!formData.buyerOrderNo) {
      errors.buyerOrderNo = 'Buyer Order No is required';
    }
    if (!formData.pickReqDate) {
      errors.pickReqDate = 'Pick Req Date is required';
    }
    if (!formData.invoiceNo) {
      errors.invoiceNo = 'Invoice No is required';
    }
    if (!formData.containerNO) {
      errors.containerNO = 'Container NO is required';
    }
    if (!formData.vechileNo) {
      errors.vechileNo = 'Vehicle No is required';
    }
    if (!formData.exciseInvoiceNo) {
      errors.exciseInvoiceNo = 'Excise Invoice No is required';
    }
    if (!formData.commercialInvoiceNo) {
      errors.commercialInvoiceNo = 'Commercial Invoice No is required';
    }
    if (!formData.deliveryTerms) {
      errors.deliveryTerms = 'Delivery Terms is required';
    }
    if (!formData.payTerms) {
      errors.payTerms = 'Pay Terms is required';
    }
    if (!formData.grWaiverNo) {
      errors.grWaiverNo = 'Gr Waiver No is required';
    }
    if (!formData.grWaiverDate) {
      errors.grWaiverDate = 'Gr Waiver Date is required';
    }
    if (!formData.bankName) {
      errors.bankName = 'Bank Name is required';
    }
    if (!formData.grWaiverClosureDate) {
      errors.grWaiverClosureDate = 'Gr Waiver Closure Date is required';
    }
    if (!formData.gatePassNo) {
      errors.gatePassNo = 'Gate Pass NO is required';
    }
    if (!formData.gatePassDate) {
      errors.gatePassDate = 'Gate Pass Date is required';
    }
    if (!formData.insuranceNo) {
      errors.insuranceNo = 'Insurance No is required';
    }
    // if (!formData.automailerGroup) {
    //   errors.automailerGroup = 'Automailer Group is required';
    // }
    // if (!formData.docketNo) {
    //   errors.docketNo = 'Docket No is required';
    // }
    // if (!formData.noOfBoxes) {
    //   errors.noOfBoxes = 'No of Boxes is required';
    // }
    // if (!formData.pkgUom) {
    //   errors.pkgUom = 'Pkg Uom is required';
    // }
    // if (!formData.grossWeight) {
    //   errors.grossWeight = 'Gross Weight is required';
    // }
    // if (!formData.gwtUom) {
    //   errors.gwtUom = 'Gwt Uom is required';
    // }
    // if (!formData.transportName) {
    //   errors.transportName = 'Transport Name is required';
    // }
    // if (!formData.transporterDate) {
    //   errors.transporterDate = 'Transport Date is required';
    // }
    // if (!formData.packingSlipNo) {
    //   errors.packingSlipNo = 'Packing Slip No is required';
    // }
    // if (!formData.bin) {
    //   errors.bin = 'Location is required';
    // }
    // if (!formData.taxType) {
    //   errors.taxType = 'Tax Type is required';
    // }
    // if (!formData.remarks) {
    //   errors.remarks = 'Remarks is required';
    // }

    let lrNoDetailsTableValid = true;
    const newTableErrors = lrNoDetailsTable.map((row, index) => {
      const rowErrors = {};
      if (!row.outBoundBin) {
        rowErrors.outBoundBin = 'OutBound Bin is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].outBoundBin;
      }
      if (!row.unitRate) {
        rowErrors.unitRate = 'Unit Rate is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].unitRate;
      }
      if (!row.skuValue) {
        rowErrors.skuValue = 'Pack/SKU/Value is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].skuValue;
      }
      if (!row.discount) {
        rowErrors.discount = 'Discount is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].discount;
      }
      if (!row.tax) {
        rowErrors.tax = 'Tax is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].tax;
      }
      if (!row.gstTax) {
        rowErrors.gstTax = 'Gst Tax is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].gstTax;
      }
      if (!row.amount) {
        rowErrors.amount = 'Amount is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].amount;
      }
      if (!row.sgst) {
        rowErrors.sgst = 'SGST is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].sgst;
      }
      if (!row.cgst) {
        rowErrors.cgst = 'CGST is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].cgst;
      }
      if (!row.igst) {
        rowErrors.igst = 'IGST is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].igst;
      }
      if (!row.totalGst) {
        rowErrors.totalGst = 'Total Gst is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].totalGst;
      }
      if (!row.billAmount) {
        rowErrors.billAmount = 'Bill Amount is required';
        lrNoDetailsTableValid = false;
        if (!firstInvalidFieldRef) firstInvalidFieldRef = lrNoDetailsRefs.current[index].billAmount;
      }

      return rowErrors;
    });

    setLrNoDetailsError(newTableErrors);

    if (!lrNoDetailsTableValid || Object.keys(errors).length > 0) {
      // Focus on the first invalid field
      if (firstInvalidFieldRef && firstInvalidFieldRef.current) {
        firstInvalidFieldRef.current.focus();
      }
    } else {
      // Proceed with form submission
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && lrNoDetailsTableValid) {
      setIsLoading(true);
      const lrNoDetailsVO = lrNoDetailsTable.map((row) => ({
        pickRequestNo: row.pickRequestNo,
        prDate: dayjs().format('YYYY-MM-DD'),
        partNo: row.partNo,
        partDescription: row.partDescription,
        outBoundBin: row.outBoundBin,
        shippedQty: parseInt(row.shippedQty),
        unitRate: parseInt(row.unitRate),
        skuValue: parseInt(row.skuValue),
        discount: parseInt(row.discount),
        tax: parseInt(row.tax),
        gstTax: parseInt(row.gstTax),
        amount: parseInt(row.amount),
        sgst: parseInt(row.sgst),
        cgst: parseInt(row.cgst),
        igst: parseInt(row.igst),
        totalGst: parseInt(row.totalGst),
        billAmount: parseInt(row.billAmount),
        remarks: row.remarks
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
        branchCode: cbranch,
        client: client,
        createdBy: loginUserName,
        customer: customer,
        warehouse: warehouse,
        orgId: orgId,
        finYear: finYear,
        buyerOrderNo: formData.buyerOrderNo,
        pickReqDate: formData.pickReqDate,
        invoiceNo: formData.invoiceNo,
        containerNO: formData.containerNO,
        vechileNo: formData.vechileNo,
        exciseInvoiceNo: formData.exciseInvoiceNo,
        commercialInvoiceNo: formData.commercialInvoiceNo,
        boDate: dayjs(formData.boDate).format('YYYY-MM-DD'),
        buyer: formData.buyer,
        deliveryTerms: formData.deliveryTerms,
        payTerms: formData.payTerms,
        grWaiverNo: formData.grWaiverNo,
        grWaiverDate: dayjs(formData.grWaiverDate).format('YYYY-MM-DD'),
        bankName: formData.bankName,
        grWaiverClosureDate: dayjs(formData.grWaiverClosureDate).format('YYYY-MM-DD'),
        gatePassNo: formData.gatePassNo,
        gatePassDate: dayjs(formData.gatePassDate).format('YYYY-MM-DD'),
        insuranceNo: formData.insuranceNo,
        billTo: formData.billTo,
        shipTo: formData.shipTo,
        automailerGroup: formData.automailerGroup,
        docketNo: formData.docketNo,
        noOfBoxes: formData.noOfBoxes,
        pkgUom: formData.pkgUom,
        grossWeight: formData.grossWeight,
        gwtUom: formData.gwtUom,
        transportName: formData.transportName,
        transporterDate: dayjs(formData.transporterDate).format('YYYY-MM-DD'),
        packingSlipNo: formData.packingSlipNo,
        bin: formData.bin,
        taxType: formData.taxType,
        remarks: formData.remarks,
        deliveryChallanDetailsDTO: lrNoDetailsVO
      };

      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `deliverychallan/createUpdatedDeliveryChallan`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          handleClear();
          getAllDeliveryChallan();
          getDeliveryChallanDocId();
          showToast('success', editId ? ' Delivery Challan Updated Successfully' : 'Delivery Challan created successfully');
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Delivery Challan creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', error.message);
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleView = () => {
    setListView(!listView);
  };
  const GeneratePdf = (row) => {
    console.log('PDF-Data =>', row.original);
    setPdfData(row.original);
    setDownloadPdf(true);
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
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
              toEdit={getDeliverChallanById}
              isPdf={true}
              GeneratePdf={GeneratePdf}
            />
            {downloadPdf && <GeneratePdfDeliveryChallanpdf row={pdfData} />}
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
                  name="deliveryChallanDocId"
                  value={deliveryChallanDocId}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Document Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docDate', date)}
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
                    label="Buyer Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="buyerOrderNo"
                    value={editBuyerOrderNo}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              ) : (
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.buyerOrderNo}>
                    <InputLabel id="buyerOrderNo">
                      {
                        <span>
                          Buyer Order No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="buyerOrderNo"
                      label="Buyer Order No"
                      value={formData.buyerOrderNo}
                      onChange={handleBuyerOrderChange}
                      name="buyerOrderNo"
                      disabled={formData.freeze}
                    >
                      {buyerOrderList.length === 0 && (
                        <MenuItem value="">
                          <em>No Data Found</em>
                        </MenuItem>
                      )}
                      {buyerOrderList.map((buyer) => (
                        <MenuItem key={buyer.id} value={buyer.buyerOrderNo}>
                          {buyer.buyerOrderNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.buyerOrderNo && <FormHelperText>{fieldErrors.buyerOrderNo}</FormHelperText>}
                  </FormControl>
                </div>
              )}
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Pick Req Date"
                      value={formData.pickReqDate ? dayjs(formData.pickReqDate, 'YYYY-MM-DD') : null}
                      onChange={() => {}}
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
                <TextField
                  label="Invoice No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  // onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Container No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="containerNO"
                  value={formData.containerNO}
                  onChange={handleInputChange}
                  error={!!fieldErrors.containerNO}
                  helperText={fieldErrors.containerNO}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Vehicle No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="vechileNo"
                  value={formData.vechileNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.vechileNo}
                  helperText={fieldErrors.vechileNo}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Excise Invoice No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="exciseInvoiceNo"
                  value={formData.exciseInvoiceNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.exciseInvoiceNo}
                  helperText={fieldErrors.exciseInvoiceNo}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Commercial Invoice No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="commercialInvoiceNo"
                  value={formData.commercialInvoiceNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.commercialInvoiceNo}
                  helperText={fieldErrors.commercialInvoiceNo}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="BO Date"
                      value={formData.boDate ? dayjs(formData.boDate, 'YYYY-MM-DD') : null}
                      onChange={() => {}}
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
                <TextField
                  label="Buyer"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="buyer"
                  value={formData.buyer}
                  // onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Delivery Terms <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="deliveryTerms"
                  value={formData.deliveryTerms}
                  onChange={handleInputChange}
                  error={!!fieldErrors.deliveryTerms}
                  helperText={fieldErrors.deliveryTerms}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Pay Terms <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="payTerms"
                  value={formData.payTerms}
                  onChange={handleInputChange}
                  error={!!fieldErrors.payTerms}
                  helperText={fieldErrors.payTerms}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      GR Waiver No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="grWaiverNo"
                  value={formData.grWaiverNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.grWaiverNo}
                  helperText={fieldErrors.grWaiverNo}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="GR Waiver Date"
                      value={formData.grWaiverDate ? dayjs(formData.grWaiverDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('grWaiverDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.grWaiverDate}
                      helperText={fieldErrors.grWaiverDate && 'Required'}
                      disabled={formData.freeze}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Bank Name <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  error={!!fieldErrors.bankName}
                  helperText={fieldErrors.bankName}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="GR Waiver Closure Date"
                      value={formData.grWaiverClosureDate ? dayjs(formData.grWaiverClosureDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('grWaiverClosureDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.grWaiverClosureDate}
                      helperText={fieldErrors.grWaiverClosureDate && 'Required'}
                      disabled={formData.freeze}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Gate Pass No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="gatePassNo"
                  value={formData.gatePassNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.gatePassNo}
                  helperText={fieldErrors.gatePassNo}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Gate Pass Date"
                      value={formData.gatePassDate ? dayjs(formData.gatePassDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('gatePassDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={fieldErrors.gatePassDate}
                      helperText={fieldErrors.gatePassDate && 'Required'}
                      disabled={formData.freeze}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label={
                    <span>
                      Insurance No <span className="asterisk">*</span>
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="insuranceNo"
                  value={formData.insuranceNo}
                  onChange={handleInputChange}
                  error={!!fieldErrors.insuranceNo}
                  helperText={fieldErrors.insuranceNo}
                  disabled={formData.freeze}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Bill To"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="billTo"
                  value={formData.billTo}
                  // onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  label="Ship To"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="shipTo"
                  value={formData.shipTo}
                  // onChange={handleInputChange}
                  disabled
                />
              </div>

              {/* <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
                  label="Active"
                />
              </div> */}
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
                  <Tab value={0} label="LR No Details" />
                  <Tab value={1} label="Other Info" />
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
                            <table className="table table-bordered">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">Pick Request No</th>
                                  <th className="px-2 py-2 text-white text-center">PR Date</th>
                                  <th className="px-2 py-2 text-white text-center">Part No</th>
                                  <th className="px-2 py-2 text-white text-center">Part Description</th>
                                  <th className="px-2 py-2 text-white text-center">Out Bound Location</th>
                                  <th className="px-2 py-2 text-white text-center">Shipped Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Unit Rate</th>
                                  <th className="px-2 py-2 text-white text-center">Pack/SKU/Value</th>
                                  <th className="px-2 py-2 text-white text-center">Discount</th>
                                  <th className="px-2 py-2 text-white text-center">Tax</th>
                                  <th className="px-2 py-2 text-white text-center">GST Tax</th>
                                  <th className="px-2 py-2 text-white text-center">Amount</th>
                                  <th className="px-2 py-2 text-white text-center">SGST</th>
                                  <th className="px-2 py-2 text-white text-center">CGST</th>
                                  <th className="px-2 py-2 text-white text-center">IGST</th>
                                  <th className="px-2 py-2 text-white text-center">Total GST</th>
                                  <th className="px-2 py-2 text-white text-center">Bill Amount</th>
                                  <th className="px-2 py-2 text-white text-center">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lrNoDetailsTable.map((row, index) => (
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
                                        style={{ width: '200px' }}
                                        value={row.pickRequestNo}
                                        className="form-control"
                                        disabled // Disable the input field
                                      />
                                    </td>

                                    <td className="border px-2 py-2">
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                          value={row.prDate ? dayjs(row.prDate, 'YYYY-MM-DD') : null}
                                          slotProps={{
                                            textField: { size: 'small', clearable: true, style: { width: '200px' }, disabled: true } // Disable the DatePicker
                                          }}
                                          format="DD-MM-YYYY"
                                        />
                                      </LocalizationProvider>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.partNo}
                                        className="form-control"
                                        disabled // Disable the input field
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        style={{ width: '250px' }}
                                        value={row.partDescription}
                                        className="form-control"
                                        disabled // Disable the input field
                                      />
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.outBoundBin}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.outBoundBin}
                                        onChange={(e) => {
                                          const value = e.target.value.toUpperCase(); // Convert value to uppercase

                                          // Regex to allow alphabets and numbers only
                                          const regex = /^[a-zA-Z0-9]*$/;

                                          if (regex.test(value)) {
                                            // Update table data if the value is valid
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, outBoundBin: value } : r))
                                            );

                                            // Clear error for this field
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                outBoundBin: ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            // Set error if the value is invalid
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                outBoundBin: 'Only alphabets and numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.outBoundBin ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.outBoundBin && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].outBoundBin}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="number"
                                        style={{ width: '100px' }}
                                        value={row.shippedQty}
                                        className="form-control"
                                        disabled // Disable the input field
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.unitRate}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.unitRate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unitRate: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], unitRate: !value ? 'Unit Rate is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            // Invalid input (alphabet or special character)
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unitRate: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.unitRate ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.unitRate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].unitRate}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.skuValue}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.skuValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, skuValue: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                skuValue: !value ? 'Pack/SKU/Value is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                skuValue: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.skuValue ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.skuValue && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].skuValue}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.discount}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.discount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, discount: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], discount: !value ? 'Discount is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discount: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.discount ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.discount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].discount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.tax}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.tax}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, tax: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], tax: !value ? 'Tax is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                tax: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.tax ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.tax && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].tax}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.gstTax}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.gstTax}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, gstTax: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                gstTax: !value ? 'Gst Tax is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            // Invalid input (alphabet or special character)
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                gstTax: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.gstTax ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.gstTax && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].gstTax}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.amount}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.amount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, amount: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: !value ? 'Amount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                amount: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.amount ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.amount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].amount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.sgst}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.sgst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, sgst: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sgst: !value ? 'SGST is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                sgst: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.sgst ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.sgst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].sgst}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.cgst}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.cgst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cgst: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cgst: !value ? 'CGST is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cgst: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.cgst ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.cgst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].cgst}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.igst}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.igst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, igst: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                igst: !value ? 'IGST is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                igst: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.igst ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.igst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].igst}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.totalGst}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.totalGst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, totalGst: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = { ...newErrors[index], totalGst: !value ? 'Total Gst is required' : '' };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                totalGst: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.totalGst ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.totalGst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].totalGst}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        ref={lrNoDetailsRefs.current[index]?.billAmount}
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.billAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) {
                                            setLrNoDetailsTable((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, billAmount: value.toUpperCase() } : r))
                                            );
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                billAmount: !value ? 'Bill Amount is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setLrNoDetailsError((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                billAmount: 'Only numbers are allowed'
                                              };
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disabled={formData.freeze}
                                        className={lrNoDetailsError[index]?.billAmount ? 'error form-control' : 'form-control'}
                                      />
                                      {lrNoDetailsError[index]?.billAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {lrNoDetailsError[index].billAmount}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        style={{ width: '100px' }}
                                        value={row.remarks}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLrNoDetailsTable((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, remarks: value.toUpperCase() } : r))
                                          );
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, row)}
                                        className="form-control"
                                        disabled={formData.freeze}
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
                {value === 1 && (
                  <>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Automailer Group"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="automailerGroup"
                          value={formData.automailerGroup}
                          onChange={handleInputChange}
                          error={!!fieldErrors.automailerGroup}
                          helperText={fieldErrors.automailerGroup}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Docket No"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="docketNo"
                          value={formData.docketNo}
                          onChange={handleInputChange}
                          error={!!fieldErrors.docketNo}
                          helperText={fieldErrors.docketNo}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="No Of Boxes"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="noOfBoxes"
                          value={formData.noOfBoxes}
                          onChange={handleInputChange}
                          error={!!fieldErrors.noOfBoxes}
                          helperText={fieldErrors.noOfBoxes}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="PKG UOM"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="pkgUom"
                          value={formData.pkgUom}
                          onChange={handleInputChange}
                          error={!!fieldErrors.pkgUom}
                          helperText={fieldErrors.pkgUom}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Gross Weight"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="grossWeight"
                          value={formData.grossWeight}
                          onChange={handleInputChange}
                          error={!!fieldErrors.grossWeight}
                          helperText={fieldErrors.grossWeight}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="GWT UOM"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="gwtUom"
                          value={formData.gwtUom}
                          onChange={handleInputChange}
                          error={!!fieldErrors.gwtUom}
                          helperText={fieldErrors.gwtUom}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Transporter Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="transportName"
                          value={formData.transportName}
                          onChange={handleInputChange}
                          error={!!fieldErrors.transportName}
                          helperText={fieldErrors.transportName}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled" size="small">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={formData.transporterDate ? dayjs(formData.transporterDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('transporterDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={fieldErrors.transporterDate}
                              helperText={fieldErrors.transporterDate && 'Required'}
                              disabled={formData.freeze}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Packing Slip No"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="packingSlipNo"
                          value={formData.packingSlipNo}
                          onChange={handleInputChange}
                          error={!!fieldErrors.packingSlipNo}
                          helperText={fieldErrors.packingSlipNo}
                          disabled={formData.freeze}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Bin"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="bin"
                          value={formData.bin}
                          onChange={handleInputChange}
                          error={!!fieldErrors.bin}
                          helperText={fieldErrors.bin}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Tax Type"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="taxType"
                          value={formData.taxType}
                          onChange={handleInputChange}
                          error={!!fieldErrors.taxType}
                          helperText={fieldErrors.taxType}
                          disabled={formData.freeze}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          label="Remarks"
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleInputChange}
                          error={!!fieldErrors.remarks}
                          helperText={fieldErrors.remarks}
                          disabled={formData.freeze}
                        />
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
export default DeliveryChallen;
