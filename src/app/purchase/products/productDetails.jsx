import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, CircularProgress, Menu, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import InventoryBlack from '@images/sideNavImages/inventory_black.svg';
import Drawer from '@mui/material/Drawer';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import assetMiniBlueIcon from '@images/drawerLite/assetLite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import fileMini from '@images/icons/fileMini.svg';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import importMiniIcon from '@images/icons/importMiniBlue.svg';
import productTemplate from '@images/templates/product_template.xlsx';
import { FormControl, FormHelperText } from '@material-ui/core';
import axios from 'axios';
import { ExcelRenderer } from 'react-excel-renderer';
import fieldsArgs from '../../inventory/data/importFields.json';
import {
  createImportId,
  resetUpdateScrap,
  resetUploadImport, setBulkUploadTrue,
  uploadImport,
} from '../../inventory/inventoryService';
import {
 clearEditProduct, clearSellerIdsInfo, clearTableData, clearTaxesInfo, getProductDetails 
} from "../purchaseService";
import {
  TabPanel,
  extractTextObject,
  getDefaultNoValue,
  getListOfModuleOperations,
  numToFloat,
} from '../../util/appUtils';


import customDataJson from './data/customData.json';

import {
  faFile,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DialogHeader from '../../commonComponents/dialogHeader';
import { bytesToSize } from '../../util/staticFunctions';
import AuditLog from '../../assets/assetDetails/auditLog';
import ErrorGroupMessages from '../../inventory/productCategory/errorGroupMessages';
import { generateErrorMessageWhileUploading } from '../../util/customErrorMessages';
import AddProduct from './addProduct';
import actionCodesPurchase from './data/actionCodes.json';
import ProductReorderingRules from './details/productBasicDetails/productReorderingRules';

const appModels = require('../../util/appModels').default;
const appConfig = require('../../config/appConfig').default;

const ProductDetails = ({
  model,
}) => {
  const { productDetailsInfo, productsInfo, companyPrice } = useSelector((state) => state.purchase);
  const dispatch = useDispatch();
  const defaultActionText = 'Product Actions';
  const [product, setProduct] = useState(false);

  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [actionModal, showActionModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, showSelectedImage] = useState(false);

  const [viewProduct, setViewProduct] = useState(false);
  const tabs = (model === 'product.product_report_view' || model === 'product.company_product_report_view')
    ? ['Product Overview', 'Reordering Rules']
    : ['Product Overview', 'Reordering Rules', 'Audit Logs'];
  const { actionResultInfo } = useSelector((state) => state.inventory);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isStartable = allowedOperations.includes(actionCodesPurchase['Add Product']);
  const isValidatable = allowedOperations.includes(actionCodesPurchase['Validate Adjustment']);
  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);

  useEffect(() => {
    if (userInfo && userInfo.data && productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0)) {
      setProduct(productDetailsInfo.data[0]);
    }
  }, [productDetailsInfo, userInfo]);

  const toggleImage = (image) => {
    showSelectedImage(image);
    setModal(!modal);
  };

  useEffect(() => {
    if (selectedActions === 'Product Bulk Upload') {
      handleClose();
      showBulkUploadModal(true);
    }
  }, [enterAction]);

  const toggle = () => {
    setModal(false);
    showBulkUploadModal(false);
    setSelectedActionImage('');
    showBulkUploadModal(false);
  };

  const getType = (productType) => {
    const filteredType = customDataJson.productType.filter((data) => data.value === productType);
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onUpdateReset = () => {
    dispatch(resetUpdateScrap());
    setEditLink(false);
  };

  const getRQuantity = (id) => {
    const pdata = productsInfo && productsInfo.data ? productsInfo.data : [];
    const filteredType = pdata.filter((data) => data.id === id);
    if (filteredType && filteredType.length) {
      return filteredType[0].reserved_quantity;
    }
    return 0;
  };

  const getAvailQuantity = (id) => {
    const pdata = productsInfo && productsInfo.data ? productsInfo.data : [];
    const filteredType = pdata.filter((data) => data.id === id);
    if (filteredType && filteredType.length) {
      return filteredType[0].qty_available;
    }
    return product.qty_available;
  };

  const detailData = productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0) ? productDetailsInfo.data[0] : '';
  const loading = productDetailsInfo && productDetailsInfo.loading;

  const editReset = () => {
    setEditLink(false);
    if (detailData && detailData.id) {
      dispatch(getProductDetails(appModels.PRODUCT, detailData.id));
    }
    setEdit(false);
    setEditId(false);
    dispatch(clearEditProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
    dispatch(clearSellerIdsInfo());
  };

  const [moveNext, setMoveNext] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileName, setFileName] = useState(false);
  const [uploadInfo, setUploadInfo] = useState({});
  const [fileObjectData, setFileData] = useState(false);
  const [isMainCalled, setMainCalled] = useState(false);
  const WEBAPPAPIURL = `${appConfig.WEBAPIURL}/`;

  const [rows, setRows] = useState([]);

  const fileInput = React.createRef();

  const { bulkImportInitiateInfo, bulkUploadInfo } = useSelector((state) => state.inventory);

  const loadings = ((uploadInfo && uploadInfo.loading) || (bulkUploadInfo && bulkUploadInfo.loading));

  const MessagesList = bulkUploadInfo && bulkUploadInfo.data && bulkUploadInfo.data.messages && bulkUploadInfo.data.messages.length ? bulkUploadInfo.data.messages : false;
  const errorMessages = MessagesList ? MessagesList.filter((item) => item.type === 'error') : false;
  const isError = errorMessages && errorMessages.length;
  const isFilesUploaded = bulkUploadInfo && bulkUploadInfo.data && (!isError && isMainCalled);
  const Messages = !isMainCalled && isError ? errorMessages : false;

  function getQueryInArrays(array) {
    let result = false;
    if (array && array.length) {
      result = array.reduce((h, obj) => Object.assign(h, { [obj.field]: (h[obj.field] || []).concat(obj) }), {});
    }
    return result;
  }

  const isFieldMessages = !!(Messages && Messages.length && Messages.filter((item) => item.field) && Messages.filter((item) => item.field).length);

  const groupErrorFields = Messages ? getQueryInArrays(Messages) : false;
  const groupMessages = groupErrorFields ? Object.values(groupErrorFields) : false;

  const commonError = !isFieldMessages && isError && Messages && Messages.length && Messages[0].message ? Messages[0].message : false;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(resetUploadImport());
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && bulkUploadModal) {
      const payload = {
        model: appModels.BASEIMPORT,
        args: [{ res_model: appModels.PRODUCT }],
        values: { res_model: appModels.PRODUCT },
      };
      dispatch(createImportId(appModels.BASEIMPORT, payload));
    }
  }, [bulkUploadModal]);

  const handleUploadData = () => {
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: fieldsArgs.fields,
        ids: `[${bulkImportInitiateInfo.data[0]}]`,
      };
      dispatch(uploadImport(payload));
    }
  };

  const handleUploadDataOrg = () => {
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: fieldsArgs.ulpoadFields,
        ids: `[${bulkImportInitiateInfo.data[0]}]`,
      };
      dispatch(uploadImport(payload));
      setMainCalled(true);
    }
  };

  const handleFileUpload = () => {
    setMoveNext(true);
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      setUploadInfo({ loading: true, data: null, err: null });
      const data = {
        import_id: bulkImportInitiateInfo.data[0], file: fileObjectData,
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}base_import/set_file_api`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: appConfig.WEBAPIURL,
          endpoint: window.localStorage.getItem('api-url'),
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          setUploadInfo({ loading: false, data: response.data.status, err: null });
          handleUploadData();
        })
        .catch((error) => {
          setUploadInfo({ loading: false, data: null, err: error });
          handleUploadData();
        });
    }
  };

  const handleUploadReset = () => {
    setMoveNext(false);
    setimgValidation(false);
    setimgSize(false);
    setFileData(false);
    setFileName(false);
    dispatch(resetUploadImport());
    setModal(!modal);
    setMainCalled(false);
    atFinish();
    dispatch(setBulkUploadTrue(Math.random()));
  };

  const handleBack = () => {
    setMoveNext(false);
    setMainCalled(false);
    dispatch(resetUploadImport());
  };

  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const onFileSet = (e) => {
    e.target.value = null;
  };

  const getCost = (id) => {
    const res = companyPrice && companyPrice.data && companyPrice.data.length && companyPrice.data[0].value ? companyPrice.data[0].value : 0;
    // const pdata = productsInfo && productsInfo.data ? productsInfo.data : [];
    // const filteredType = pdata.filter((data) => data.id === id);
    // console.log(filteredType);
    // if (filteredType && filteredType.length) {
    //   return filteredType[0].standard_price;
    // }
    return res;
  };

  const renderFile = (fileObj) => {
    // just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const rowData = resp.rows.filter((item) => (item && item.length));
        setRows(rowData);
      }
    });
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      const fileObj = event.target.files[0];
      const { name } = event.target.files[0];
      setFileName(name);
      renderFile(fileObj);
      setimgValidation(false);
      setimgSize(false);
      if (name && !name.match(/.(csv|xls|xlsx)$/i)) {
        setimgValidation(true);
      } else if (!bytesToSize(event.target.files[0].size)) {
        setimgSize(true);
      } else {
        setFileData(fileObj);
        setFileName(name);
      }
    }
  };

  const getRow = (productData) => {
    const tableTr = [];
    if (productData.length && productData.length >= 1) {
      for (let i = 1; i < productData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][0])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][1])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][2])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][3])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][4])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][5])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][6])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][7])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][8])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][9])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][10])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(productData[i][11])}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  };

  return (
    <>
      {detailData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(extractTextObject(product.categ_id))}
              /* status={
                detailData.state
                  ? checkAuditStatus(detailData.state)
                  : "-"
              } */
            subHeader={(
              <>
                {detailData.create_date
                    && userInfo.data
                    && userInfo.data.timezone
                  ? moment
                    .utc(detailData.create_date)
                    .local()
                    .tz(userInfo.data.timezone)
                    .format('yyyy MMM Do, hh:mm A')
                  : '-'}
                {' '}

              </>
              )}
            actionComponent={(
              <Box>
                <Button
                  type="button"
                  variant="outlined"
                  className="ticket-btn"
                  sx={{
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                  }}
                  onClick={() => {
                    setEditLink(true);
                    handleClose(false);
                    setEditId(detailData.id);
                    setEdit(true);
                  }}
                >
                  Edit
                </Button>
                {/* <IconButton
                    sx={{
                      margin: "0px 5px 0px 5px",
                    }}
                    id="demo-positioned-button"
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleMenuClick}
                  >
                    <BsThreeDotsVertical color="#ffffff" />
                  </IconButton> */}
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >

                  <MenuItem
                    sx={{
                      font: 'normal normal normal 15px Suisse Intl',
                    }}
                    id="switchAction"
                    className="pl-2"
                    key={0}
                      /*  disabled={
                         !checkActionAllowedDisabled(actions.displayname)
                       } */
                    onClick={() => { handleClose(); showBulkUploadModal(true); }}
                  >
                    <img src={importMiniIcon} className="mr-2" height="15" width="15" alt="upload" />
                    Bulk Upload

                  </MenuItem>

                </Menu>
              </Box>
              )}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              height: '100%',
            }}
          >
            <Box
              sx={{
                width: '75%',
              }}
            >
              <DetailViewTab
                value={value}
                handleChange={handleTabChange}
                tabs={tabs}
              />

              <TabPanel value={value} index={0}>

                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: 'GENERAL INFORMATION',
                      leftSideData:
                          [
                            {
                              property: 'Unit of Measure',
                              value: getDefaultNoValue(extractTextObject(detailData.uom_id)),
                            },
                            {
                              property: 'Specification',
                              value: getDefaultNoValue(detailData.specification),
                            },
                            {
                              property: 'Brand',
                              value: getDefaultNoValue(detailData.brand),
                            },
                            {
                              property: 'Product Code',
                              value: getDefaultNoValue(detailData.unique_code),
                            },
                          ],
                      rightSideData:
                          [
                            {
                              property: 'Preferred Vendor',
                              value: getDefaultNoValue(extractTextObject(detailData.preferred_vendor)),
                            },
                            {
                              property: 'Department',
                              value: getDefaultNoValue(extractTextObject(detailData.department_id)),
                            },
                            {
                              property: 'Cost',
                              //value: getDefaultNoValue(numToFloat(detailData.standard_price)),
                              value: companyPrice && companyPrice.loading ? <CircularProgress size={14} color="primary" /> : getCost(),
                            },
                          ],
                    },

                    /*  {
                         header: "ADDITIONAL INFORMATION",
                         leftSideData: [
                           {
                             property: "Reorder Level",
                             value: getDefaultNoValue(numToFloat(detailData.reordering_min_qty)),
                           },
                           {
                             property: "Alert Level",
                             value: getDefaultNoValue(numToFloat(detailData.alert_level_qty)),
                           },

                         ],
                         rightSideData: [
                           {
                             property: "Reorder Quantity",
                             value: getDefaultNoValue(numToFloat(detailData.reordering_max_qty)),
                           }
                         ]
                       }, */

                  ]}
                />

              </TabPanel>
              <TabPanel value={value} index={1}>
                <ProductReorderingRules detailData={productDetailsInfo.data[0]} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <AuditLog ids={productDetailsInfo.data[0].message_ids} />
              </TabPanel>
            </Box>

            <Box
              sx={{
                width: '25%',
                height: '100%',
                backgroundColor: '#F6F8FA',
              }}
            >
              <DetailViewRightPanel
                  // panelOneHeader="PRODUCT NAME"
                  // panelOneLabel={getDefaultNoValue((product.name))}
                  //                  panelOneValue1={getDefaultNoValue((detailData.display_name))}
                  // panelOneValue2={getDefaultNoValue(detailData.mobile)}
                  //   panelThreeHeader="Inventory Information"
                panelThreeData={[
                  {
                    header: 'PRODUCT IMAGE',
                    value: product.image_medium
                      ? (
                        <div className="text-center">
                          <img
                            src={product.image_medium && product && !product.loading ? `data:image/png;base64,${product.image_medium}` : assetMiniBlueIcon}
                            alt="visitor_image"
                            className="mr-2 cursor-pointer"
                            width="100"
                            height="100"
                            aria-hidden="image"
                            onClick={() => toggleImage(product.image_medium ? `data:image/png;base64,${product.image_medium}` : assetMiniBlueIcon)}
                          />
                        </div>
                      ) : ' - ',
                  },
                  {
                    header: 'PRODUCT TYPE',
                    value: getDefaultNoValue(getType(product.type)),
                  },
                  /* {
                      header: "PRODUCT CATEGORY",
                      value: getDefaultNoValue(extractTextObject(product.categ_id)),
                    }, */
                  {
                    header: 'QUANTITY ON HAND',
                    value: getDefaultNoValue(numToFloat(getAvailQuantity(product.id))),
                  },
                  {
                    header: 'RESERVED QUANTITY',
                    value: getDefaultNoValue(numToFloat(getRQuantity(product.id))),
                  },

                ]}
              />
            </Box>
          </Box>

          <Drawer
            PaperProps={{
              sx: { width: '50%' },
            }}
            anchor="right"
            open={editLink}
          >

            <DrawerHeader
              headerName="Update Products"
              imagePath={InventoryBlack}
              onClose={() => { setEditLink(false); setEdit(false); setEditId(false); }}
            />
            <AddProduct
              reset={() => { editReset(); }}
              closeModal={() => { setEditLink(false); }}
              viewProduct={viewProduct}
              isEdit={isEdit}
              editId={editId}
              isUpdate={editLink ? Math.random() : false}
              visibility={editLink}
            />

          </Drawer>

          <Dialog maxWidth="xl" open={bulkUploadModal}>
            <DialogHeader title="Products Bulk Upload" response={actionResultInfo} onClose={toggle} imagePath={importMiniIcon} sx={{ width: '500px' }} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F6F8FA',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10%',
                    fontFamily: 'Suisse Intl',
                  }}
                >
                  {!moveNext
                    ? (
                      <Row>
                        <Col xs="12" sm="12" md="12" lg="12">
                          <Col xs={12} sm={12} md={12} lg={12}>
                              <div className="text-center">
                                <FormControl>
                                  {!fileObjectData && (
                                  <>
                                    { /* <ReactFileReader
                          multiple
                          elementId="fileUpload"
                          handleFiles={handleFiles}
                          fileTypes=".csv,.xls,.xlsx"
                          base64
                        >
                          <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                            <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                            <p className="font-weight-500">Select a Excel file</p>
                            <p className="font-weight-500">(Upload files less than 20 MB)</p>
                          </div>
                        </ReactFileReader> */ }
                                    <div aria-hidden="true" onClick={openFileBrowser.bind(this)} className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                                          <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                                          <p className="font-weight-500 mb-0">Select a Excel file</p>
                                          <p className="font-weight-500">(Upload files less than 20 MB)</p>
                                          <input type="file" accept=".csv,.xls,.xlsx" ref={fileInput} hidden onChange={fileHandler} onClick={(event) => onFileSet(event)} />
                                        </div>
                                  </>
                                  )}
                                  {fileObjectData && (
                                  <div className="position-relative text-center">
                                    <img
                                          src={fileMini}
                                          height="150"
                                          width="150"
                                          className="ml-3"
                                          alt="uploaded"
                                        />
                                    <p>{fileName}</p>
                                    <div className="position-absolute topright-img-close">
                                          <img
                                            aria-hidden="true"
                                            src={closeCircleIcon}
                                            className="cursor-pointer"
                                            onClick={() => {
                                              setimgValidation(false);
                                              setimgSize(false);
                                              setFileData(false);
                                              setFileName(false);
                                            }}
                                            alt="remove"
                                          />
                                        </div>
                                  </div>
                                  )}
                                </FormControl>
                                <br />
                                <Button
                                  type="button"
                                  size="sm"
                                  className="mt-2 ticket-btn"
                                  variant="outlined"
                                  sx={{
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#fff',
                                    },
                                  }}
                                >
                                  <a href={productTemplate} target="_blank" rel="noreferrer" download={productTemplate}>
                                    <FontAwesomeIcon
                                      color="primary"
                                      className="mr-2"
                                      icon={faFile}
                                    />
                                    Download Template
                                  </a>
                                </Button>
                                {imgValidation && (<FormHelperText><span className="text-danger">Choose Excel Only...</span></FormHelperText>)}
                                {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 20MB...</span></FormHelperText>)}
                              </div>
                            </Col>
                        </Col>
                      </Row>
                    ) : ''}
                  {moveNext && fileObjectData && (
                  <>
                    {loadings && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                    )}
                    {!isFilesUploaded && !loadings && (
                    <div className="form-modal-scroll thin-scrollbar">
                      <Table responsive className="mb-0 font-weight-400 border-0" width="100%">
                              <thead className="bg-lightgrey">
                                <tr>
                                  <th className="p-2 min-width-100">
                                    <span>
                                      Department
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Product Category
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Product Name
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Specification
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Brand Name
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Stock On Hand
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Unit of Measure
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Cost
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Reorder Level
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Alert Level
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Reorder Quantity
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span>
                                      Vendor
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {getRow(rows || [])}
                              </tbody>
                            </Table>
                    </div>
                    )}
                    {bulkUploadInfo && bulkUploadInfo.err && (
                    <SuccessAndErrorFormat response={bulkUploadInfo} />
                    )}
                    {isFieldMessages && isError && Messages && (
                    <ErrorGroupMessages data={groupMessages || []} />
                    )}
                    {commonError && (
                    <div className="p-2">
                      <p className="text-danger">
                              <FontAwesomeIcon
                                color="danger"
                                className="mr-2"
                                icon={faInfoCircle}
                              />
                              <span className="text-danger">
                                {generateErrorMessageWhileUploading(commonError)}
                              </span>
                            </p>
                    </div>
                    )}
                    {(isFilesUploaded) && (
                    <SuccessAndErrorFormat
                      response={bulkUploadInfo}
                      successMessage="Products uploaded successfully..."
                    />
                    )}
                  </>
                  )}

                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>

              {!moveNext
                ? (<Button variant="contained" disabled={!fileObjectData} onClick={() => handleFileUpload()}>Next</Button>)
                : (
                  <>
                    {!isFilesUploaded && (
                    <>
                      <Button variant="contained" onClick={() => handleBack()}>Back</Button>
                      <Button variant="contained" disabled={loadings || isError || (bulkUploadInfo && bulkUploadInfo.err)} onClick={() => handleUploadDataOrg()}>Upload</Button>
                    </>
                    )}
                    {isFilesUploaded && (
                    <Button variant="contained" onClick={() => handleUploadReset()}>Ok</Button>
                    )}
                  </>
                )}
            </DialogActions>
          </Dialog>
        </Box>
      )}
      {loading && (
        <Loader />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '15px',
        }}
      >
        <Dialog size="lg" open={modal}>
          <DialogHeader title={detailData.name} imagePath={false} onClose={() => { showSelectedImage(false); setModal(!modal); }} sx={{ width: '500px' }} />
          <DialogContent>
            <div className="text-center">
              {selectedImage
                ? (
                  <img
                    src={selectedImage || ''}
                    alt={detailData.name}
                    width="50%"
                    height="50%"
                    aria-hidden="true"
                  />
                )
                : ''}
            </div>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};
/*   <>
    <ProductDetailsInfo detail={productDetailsInfo} />
    <ProductDetailsTabs detail={productDetailsInfo} />
  </>
);
}; */

export default ProductDetails;
