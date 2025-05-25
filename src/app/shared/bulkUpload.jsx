/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
// import ReactFileReader from 'react-file-reader';
import {
  FormHelperText, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ExcelRenderer } from 'react-excel-renderer';
import {
  Button, Dialog, DialogContent, DialogActions,
} from '@mui/material';

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
import filesBlackIcon from '@images/icons/filesBlack.svg';
import fileMini from '@images/icons/fileMini.svg';
import DialogHeader from '../commonComponents/dialogHeader';

import {
  getDefaultNoValue,
} from '../util/appUtils';
import { bytesToSize } from '../util/staticFunctions';
import { createImportId, uploadImport, resetUploadImport } from '../assets/equipmentService';
import ErrorGroupMessages from '../assets/assetDetails/errorGroupMessages';
import { AddThemeColor } from '../themes/theme';

const appModels = require('../util/appModels').default;
const appConfig = require('../config/appConfig').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const BulkUpload = (props) => {
  const {
    bulkUploadModal, atFinish, targetModel, modalTitle, modalMsg, testFields, uploadFields, sampleTamplate, labels,
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
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [rows, setRows] = useState([]);

  const fileInput = React.createRef();

  const { userInfo } = useSelector((state) => state.user);
  const { bulkImportInitiateInfo, bulkUploadInfo } = useSelector((state) => state.equipment);

  const loading = ((uploadInfo && uploadInfo.loading) || (bulkUploadInfo && bulkUploadInfo.loading));

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
    if (userInfo && userInfo.data) {
      const payload = {
        model: appModels.BASEIMPORT,
        args: [{ res_model: targetModel }],
        values: { res_model: targetModel },
      };
      dispatch(createImportId(appModels.BASEIMPORT, payload));
    }
  }, []);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const handleUploadData = () => {
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: testFields,
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
        args: uploadFields,
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

  const labelsLength = labels && labels.length ? labels.length : 0;

  const getRowData = (item) => {
    const tableTd = [];
    if (labelsLength && item) {
      for (let i = 0; i < labelsLength; i += 1) {
        tableTd.push(
          <td className="p-2 font-weight-400">{getDefaultNoValue(item[i])}</td>,
        );
      }
    }
    return tableTd;
  };

  const getRow = (assetData) => {
    const tableTr = [];
    if (assetData.length && assetData.length >= 1) {
      for (let i = 1; i < assetData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            {getRowData(assetData[i])}
          </tr>,
        );
      }
    }
    return tableTr;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={bulkUploadModal}
    >
      <DialogHeader title={modalTitle} imagePath={importMiniIcon} onClose={toggle} />
      <DialogContent>
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
                      {imgSize && (<FormHelperText><span className="text-danger">Upload files less than 20 MB</span></FormHelperText>)}
                    </Col>
                  </Col>
                </Row>
                <Row className="pl-3">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Button
                      type="button"
                      size="sm"
                      variant="contained"
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
                      className="ticket-btn float-right"
                      variant="outlined"
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                    >
                      <a href={sampleTamplate} style={AddThemeColor({})} target="_blank" rel="noreferrer" download={sampleTamplate}>
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
                        {labels && labels.map((tl) => (
                          <th className="p-2 min-width-100" key={tl}>
                            <span>
                              {tl}
                            </span>
                          </th>
                        ))}
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
                      {commonError}
                    </span>
                  </p>
                </div>
              )}
              {(isFilesUploaded) && (
                <SuccessAndErrorFormat
                  response={bulkUploadInfo}
                  successMessage={modalMsg}
                />
              )}
            </>
          )}
        </Card>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
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
                    className="float-right"
                    onClick={() => handleBack()}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    size="sm"
                    disabled={loading || isError || (bulkUploadInfo && bulkUploadInfo.err)}
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
      </DialogActions>
    </Dialog>
  );
};

BulkUpload.propTypes = {
  bulkUploadModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  targetModel: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  modalTitle: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  modalMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  testFields: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  uploadFields: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  sampleTamplate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  labels: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};
export default BulkUpload;
