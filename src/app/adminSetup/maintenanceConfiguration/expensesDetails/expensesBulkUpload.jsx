/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {  
  Card,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Table,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
// import ReactFileReader from 'react-file-reader';
import {
  FormHelperText, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ExcelRenderer } from 'react-excel-renderer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faFile,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import importMiniIcon from '@images/icons/importMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import fileMini from '@images/icons/fileMini.svg';
import expenseTemplate from '@images/templates/opex_template.xlsx';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';
import { bytesToSize } from '../../../util/staticFunctions';
import { createImportId, uploadImport, resetUploadImport } from '../maintenanceService';
import fieldsArgs from '../data/importFields.json';
import ErrorGroupMessages from './errorGroupMessages';

const appModels = require('../../../util/appModels').default;
const appConfig = require('../../../config/appConfig').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const ExpensesBulkUpload = (props) => {
  const {
    bulkUploadModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [modal, setModal] = useState(bulkUploadModal);
  const [moveNext, setMoveNext] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileName, setFileName] = useState(false);
  const [uploadInfo, setUploadInfo] = useState({});
  const [fileObjectData, setFileData] = useState(false);
  const [isMainCalled, setMainCalled] = useState(false);
  const WEBAPPAPIURL = `${window.location.origin}/`;

  const [rows, setRows] = useState([]);

  const fileInput = React.createRef();

  const { userInfo } = useSelector((state) => state.user);
  const { bulkImportExpensesInfo, bulkUploadExpenses } = useSelector((state) => state.maintenance);

  const loading = ((uploadInfo && uploadInfo.loading) || (bulkUploadExpenses && bulkUploadExpenses.loading));

  const MessagesList = bulkUploadExpenses && bulkUploadExpenses.data && bulkUploadExpenses.data.messages && bulkUploadExpenses.data.messages.length ? bulkUploadExpenses.data.messages : false;
  const errorMessages = MessagesList ? MessagesList.filter((item) => item.type === 'error') : false;
  const isError = errorMessages && errorMessages.length;
  const isFilesUploaded = bulkUploadExpenses && bulkUploadExpenses.data && (!isError && isMainCalled);
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
    if (userInfo && userInfo.data) {
      const payload = {
        model: appModels.BASEIMPORT,
        args: [{ res_model: appModels.OPERATIONALEXPANSES }],
        values: { res_model: appModels.OPERATIONALEXPANSES },
      };
      dispatch(createImportId(appModels.BASEIMPORT, payload));
    }
  }, []);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const handleUploadData = () => {
    if (bulkImportExpensesInfo && bulkImportExpensesInfo.data && bulkImportExpensesInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: fieldsArgs.fields,
        ids: `[${bulkImportExpensesInfo.data[0]}]`,
      };
      dispatch(uploadImport(payload));
    }
  };

  const handleUploadDataOrg = () => {
    if (bulkImportExpensesInfo && bulkImportExpensesInfo.data && bulkImportExpensesInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: fieldsArgs.uploadFields,
        ids: `[${bulkImportExpensesInfo.data[0]}]`,
      };
      dispatch(uploadImport(payload));
      setMainCalled(true);
    }
  };

  const handleFileUpload = () => {
    setMoveNext(true);
    if (bulkImportExpensesInfo && bulkImportExpensesInfo.data && bulkImportExpensesInfo.data.length) {
      setUploadInfo({ loading: true, data: null, err: null });
      const data = {
        import_id: bulkImportExpensesInfo.data[0], file: fileObjectData,
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
          portalDomain: window.location.origin,
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
      console.log(event.target.files[0]);
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

  const getRow = (assetData) => {
    const tableTr = [];
    if (assetData.length && assetData.length >= 1) {
      for (let i = 1; i < assetData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][0])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][1])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][2])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][3])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][4])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][5])}</td>
            <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i][6])}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  };

  return (
    <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={bulkUploadModal}>
      <ModalHeaderComponent title="Expenses Bulk Upload" imagePath={importMiniIcon} closeModalWindow={toggle} size="lg" />
      <ModalBody className="pt-1">
        <Card className="border-0  mt-2">
          {!moveNext
            ? (
              <>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <FormControl className={classes.margin}>
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
                      {imgValidation && (<FormHelperText><span className="text-danger">Choose Excel Only...</span></FormHelperText>)}
                      {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                    </Col>
                  </Col>
                </Row>
                <br />
                <Row className="pl-3">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Button
                      type="button"
                      size="sm"
                      className="text-navy-blue border-primary bg-white mr-4"
                    >
                      <FontAwesomeIcon
                        color="primary"
                        className="mr-2"
                        icon={faQuestion}
                      />
                      Help
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="text-green border-success bg-white mr-4"
                    >
                      <a href={expenseTemplate} target="_blank" rel="noreferrer" download={expenseTemplate}>
                        <FontAwesomeIcon
                          color="primary"
                          className="mr-2"
                          icon={faFile}
                        />
                        Download Template
                      </a>
                    </Button>
                  </Col>
                </Row>
              </>
            ) : ''}
          {moveNext && fileObjectData && (
            <>
              {loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {!isFilesUploaded && !loading && (
                <div className="form-modal-scroll thin-scrollbar">
                  <Table responsive className="mb-0 font-weight-400 border-0" width="100%">
                    <thead className="bg-lightgrey">
                      <tr>
                        <th className="p-2 min-width-100">
                          <span>
                            Title
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span>
                            Type Id
                          </span>
                        </th>

                        <th className="p-2 min-width-160">
                          <span>
                            Consumption Cost
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span>
                            Unit Cost
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span>
                            Total Cost
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span>
                            From Date
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span>
                            To Date
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
              {bulkUploadExpenses && bulkUploadExpenses.err && (
              <SuccessAndErrorFormat response={bulkUploadExpenses} />
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
                    {commonError}
                  </span>
                </p>
              </div>
              )}
              {(isFilesUploaded) && (
              <SuccessAndErrorFormat
                response={bulkUploadExpenses}
                successMessage="Expenses uploaded successfully..."
              />
              )}
            </>
          )}
        </Card>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {!moveNext
          ? (
            <Button
              type="button"
               variant="contained"
              size="sm"
              disabled={!fileObjectData}
              className="float-right"
              onClick={() => handleFileUpload()}
            >
              Next
            </Button>
          )
          : (
            <>
              {!isFilesUploaded && (
              <>
                <Button
                  type="button"
                   variant="contained"
                  size="sm"
                  className="float-right btn-cancel"
                  onClick={() => handleBack()}
                >
                  Back
                </Button>
                <Button
                  type="button"
                   variant="contained"
                  size="sm"
                  disabled={loading || isError || (bulkUploadExpenses && bulkUploadExpenses.err)}
                  className="float-right"
                  onClick={() => handleUploadDataOrg()}
                >
                  Upload
                </Button>
              </>
              )}
              {isFilesUploaded && (
              <Button
                type="button"
                 variant="contained"
                size="sm"
                className="float-right"
                onClick={() => handleUploadReset()}
              >
                Ok
              </Button>
              )}
            </>
          )}
      </ModalFooter>
    </Modal>
  );
};

ExpensesBulkUpload.propTypes = {
  bulkUploadModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ExpensesBulkUpload;
