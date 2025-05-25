/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Spinner,
  Table,
  Toast,
  ToastBody,
  ToastHeader,
  Badge,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ReactFileReader from 'react-file-reader';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import download from '@images/icons/download.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getEquipmentDocument, onDocumentCreatesAttach, fileDownloads,
  resetDeleteAttatchment, getDeleteAttatchment,
} from '../ticketService';
import { bytesToSize } from '../../util/staticFunctions';
import {
  getLocalTimeSeconds, generateErrorMessage, getListOfModuleOperations, splitDocument, getTypeOfDocument, getDefaultNoValue, extractTextObject,
} from '../../util/appUtils';
import { getDocuments } from '../utils/utils';
import actionCodes from '../data/attatchmentActionCodes.json';

const appModels = require('../../util/appModels').default;

const Attachments = React.memo((props) => {
  const {
    viewId, ticketId, ticketNumber, resModel, model, additionalExtensions, isManagable,isModule, isCreateAllowed, isDownloadAllowed, isDeleteAllowed,
  } = props;
  const [show, setShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [documentReady, setDocumentReady] = useState('');
  const [imgSize, setimgSize] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [companyId, setCompanyId] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(false);
  const [selectedDocViewId, setSelectedDocViewId] = useState(false);
  const [imageView, setImgView] = useState(false);
  const [imageName, setImgName] = useState('');
  const [fileImageSize, setFileImageSize] = useState(false);
  const [fileValue, setFileValue] = useState({});
  const [finish, setFinish] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [finishDownload, setFinishDownload] = useState(false);
  const [modalDownload, setModalDownload] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedDocName, setSelectedDocName] = useState(false);

  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    equipmentDocuments, documentCreateAttach, downloadDocument,
    deleteAttatchmentInfo,
  } = useSelector((state) => state.ticket);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Attachments', 'code');

  let isCreatable = allowedOperations.includes(actionCodes['Add Document']);
  let isDeletable = allowedOperations.includes(actionCodes['Delete Document']);
  let isDownloadble = true;

  if (resModel === 'hx.incident_analysis' || resModel === 'hx.ehs_hazards_analysis' || resModel === 'hx.incident_analysis_checklist' || resModel === 'hx.sla.kpi_audit_line' || resModel === 'hx.tracker_line' || resModel === 'hx.ehs_hazards_analysis_checklist') {
    isCreatable = isManagable;
    isDeletable = isManagable;
  }

  if (isModule) {
    isCreatable = isCreateAllowed;
    isDeletable = isDeleteAllowed;
    isDownloadble = isDownloadAllowed;
  }

  const toastToggle = () => setShow(!show);
  const errorToggle = () => setErrorShow(!errorShow);
  const toggle = () => {
    setModal(false);
    setSelectedDocViewId(false);
  };

  useEffect(() => {
    if (errorShow) {
      let isMounted = true;
      setTimeout(() => {
        if (isMounted) {
          setErrorShow(false);
        }
      }, 3000);
      return () => { isMounted = false; };
    }
  }, [errorShow]);

  useEffect(() => {
    if (show && documentCreateAttach && !documentCreateAttach.loading) {
      let isMounted = true;
      setTimeout(() => {
        if (isMounted) {
          setShow(false);
        }
      }, 3000);
      return () => { isMounted = false; };
    }
  }, [show, documentCreateAttach]);

  const toggleAlert = () => {
    setModalAlert(false);
    setFinish(false);
  };

  const toggleDownload = () => {
    if (document.getElementById('fileUpload') && document.getElementById('fileUpload').value) {
      document.getElementById('fileUpload').value = null;
    }
    setModalDownload(false);
    setFinishDownload(false);
    setSelectedDocId(false);
  };

  const toggleDelete = () => {
    setModalDelete(!modalDelete);
    setSelectedDocName(false);
    setSelectedDocId(false);
    if (deleteAttatchmentInfo && deleteAttatchmentInfo.data) {
      dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
    }
    dispatch(resetDeleteAttatchment());
    document.getElementById('fileUploadsv1').value = null;
  };

  const removeFile = (id) => {
    dispatch(getDeleteAttatchment(id));
  };

  useEffect(() => {
    if (finish) {
      if (bytesToSize(fileImageSize)) {
        dispatch(onDocumentCreatesAttach(fileValue));
      } else {
        setimgSize(true);
        setErrorShow(true);
        setShow(false);
      }
    }
  }, [finish, documentReady]);

  useEffect(() => {
    if (finishDownload) {
      dispatch(fileDownloads(viewId, selectedDocId, resModel, model));
    }
  }, [finishDownload]);

  useEffect(() => {
    if (selectedDocViewId) {
      dispatch(fileDownloads(viewId, selectedDocViewId, resModel, model));
    }
  }, [selectedDocViewId]);

  useEffect(() => {
    if (documentCreateAttach && documentCreateAttach.data) {
      dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
    }
  }, [documentCreateAttach]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setCompanyId(userInfo.data.company.id);
    }
  }, [userInfo]);

  function documentDownload(datas, type, filename) {
    setImgView(false);
    setSelectedDocViewId(false);
    if (selectedDocId) {
      const element = document.createElement('a');
      element.setAttribute('href', `data:${type};base64,${encodeURIComponent(datas)}`);
      element.setAttribute('download', filename);
      element.setAttribute('id', 'file');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      setSelectedDocId(false);
      document.body.removeChild(element);
    }
  }

  useEffect(() => {
    if ((downloadDocument && downloadDocument.data) && downloadDocument.data.length > 0) {
      documentDownload(downloadDocument.data[0].datas, downloadDocument.data[0].mimetype, downloadDocument.data[0].datas_fname);
      setFinishDownload(false);
      setModalDownload(false);
    } else {
      setFinishDownload(false);
      setModalDownload(false);
    }
  }, [downloadDocument]);

  function documentView(datas, type, filename) {
    setSelectedDocId(false);
    const imgSrc = `data:${type};base64,${datas}`;
    setImgView(imgSrc);
    setImgName(filename);
    setModal(true);
  }

  useEffect(() => {
    if (selectedDocViewId && (downloadDocument && downloadDocument.data) && downloadDocument.data.length > 0) {
      documentView(downloadDocument.data[0].datas, downloadDocument.data[0].mimetype, downloadDocument.data[0].datas_fname);
    }
  }, [selectedDocViewId, downloadDocument]);

  const handleFilesDoc = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files !== undefined) {
      const { name } = files.fileList[0];
      const allTypes = /.(pdf|xlsx|docx|msg|xlsxs|csv)$/i;
      if (name && !name.match(allTypes)) {
        setimgValidation(true);
        setErrorShow(true);
        setShow(false);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        const photoname = files.fileList[0].name;
        const fname = `${getLocalTimeSeconds(new Date())}-${ticketNumber}`.replace(/\s+/g, '');
        const filedata = files.base64.replace(remfile, '');
        const fileSize = files.fileList[0].size;
        const values = {
          datas: filedata, datas_fname: photoname, name: fname, company_id: companyId, res_model: resModel, res_id: viewId,
        };
        setFileImageSize(fileSize);
        setFileValue(values);
        setModalAlert(true);
      }
    }
  };

  const handleDocRemove = (id, name) => {
    setSelectedDocId(id);
    setSelectedDocName(name);
    setModalDelete(true);
  };

  function getRow(documentData) {
    const tableTr = [];
    for (let i = 0; i < documentData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 text-left" width="50%">{splitDocument(documentData[i])}</td>
          <td className="p-2 text-left" width="25%">{getTypeOfDocument(documentData[i])}</td>
          <td className="p-2 text-left" width="50%">{documentData[i].description}</td>
          {documentData[i].res_model === appModels.BREAKDOWNTRACKER && (
            <td className="p-2 text-left" width="50%">
              {documentData[i] && documentData[i].ir_attachment_categ && documentData[i].ir_attachment_categ.length ? (
                <div className="text-center">
                  <Badge color="dark" className="p-1 mb-1 bg-zodiac text-center">{getDefaultNoValue(extractTextObject(documentData[i].ir_attachment_categ))}</Badge>
                </div>
              )
                : (
                  <div className="text-center">
                    <Badge color="dark" className="p-1 mb-1 bg-zodiac text-center">Others</Badge>
                  </div>
                )}
            </td>
          )}
          <td className="p-2 text-center" width="25%">
            {' '}
            {isDownloadble && (
            <Tooltip title="Download" placement="top">
              <img
                src={download}
                className="mr-2 cursor-pointer"
                alt="download"
                height="15"
                aria-hidden="true"
                onClick={() => {
                  setModalDownload(true); setSelectedDocId(documentData[i].id);
                }}
                value={document.id}
              />
            </Tooltip>
            )}
            {isDeletable && (
              <Tooltip title="Delete" placement="top">
                <FontAwesomeIcon
                  size="sm"
                  className="cursor-pointer mr-1"
                  icon={faTrashAlt}
                  onClick={() => handleDocRemove(documentData[i].id, documentData[i].datas_fname)}
                />
              </Tooltip>
            )}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const equipmentAttachment = (equipmentDocuments && equipmentDocuments.data) ? getDocuments(equipmentDocuments.data) : [];
  const resModelName = (equipmentDocuments && equipmentDocuments.data) ? equipmentDocuments.data[0].res_model : [];

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (equipmentDocuments && equipmentDocuments.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (equipmentDocuments && equipmentDocuments.err) ? generateErrorMessage(equipmentDocuments) : userErrorMsg;
  const errorMsgDocument = (documentCreateAttach && documentCreateAttach.err) ? generateErrorMessage(documentCreateAttach) : userErrorMsg;

  return (
    <>
      <Row>
        <Col md="12" lg="12">
          <div className="text-left text-info font-11  ml-2">
            <FontAwesomeIcon size="sm" icon={faInfoCircle} />
            {' '}
            Allowed file types: .pdf, .xlsx, .docx, .msg, .xlsxs, .csv
          </div>
          <div className="text-right mt-3 text-line-height-2">
            {isCreatable && (
              <ReactFileReader handleFiles={handleFilesDoc} elementId="fileUpload" fileTypes="*" base64>
                {(documentCreateAttach && documentCreateAttach.loading) ? (
                  <Spinner animation="border" size="sm" className="float-right text-primary ml-1" variant="secondary" />
                )
                  : (
                    <>
                      <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                      <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                    </>
                  )}
              </ReactFileReader>
            )}
            {imgValidation
              ? (
                <Toast isOpen={errorShow} className="mt-2">
                  <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                  <ToastBody className="text-left">
                    Upload pdf,excel,word
                    {' '}
                    {additionalExtensions && additionalExtensions.length && `, ${additionalExtensions[0]}` }
                    {' '}
                    only
                  </ToastBody>
                </Toast>
              ) : ''}
            {imgSize
              ? (
                <Toast isOpen={errorShow} className="mt-2">
                  <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                  <ToastBody className="text-left">
                    Upload files less than 20 MB
                  </ToastBody>
                </Toast>
              ) : ''}

            {documentCreateAttach && documentCreateAttach.data && (
              <Toast isOpen={show} className="mt-2">
                <ToastHeader icon="success" toggle={toastToggle}>SUCCESS</ToastHeader>
                <ToastBody className="text-left">
                  Document uploaded successfully...
                </ToastBody>
              </Toast>
            )}
            {((documentCreateAttach && documentCreateAttach.err) || isUserError) && (
              <Toast isOpen={show} className="mt-2">
                <ToastHeader icon="danger" toggle={toastToggle}>FAILED</ToastHeader>
                <ToastBody className="text-left">
                  <ErrorContent errorTxt={errorMsgDocument} />
                </ToastBody>
              </Toast>
            )}
            <br />
          </div>
        </Col>
      </Row>
      {((equipmentDocuments && equipmentDocuments.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
      {loading && (
        <Card className="border-0">
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}
      {(equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length > 0) && (equipmentAttachment.length <= 0) && (
        <ErrorContent errorTxt="No data found." />
      )}
      {(equipmentAttachment.length > 0) && (
        <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table thin-scrollbar" width="100%">
          <thead>
            <tr>
              <th className="p-2 border-top-0 text-left">
                <span aria-hidden="true">
                  Name
                </span>
              </th>
              <th className="p-2 border-top-0 text-left">
                <span aria-hidden="true">
                  Type
                </span>
              </th>
              <th className="p-2 border-top-0 text-left">
                <span aria-hidden="true">
                  Description
                </span>
              </th>
              {resModelName === appModels.BREAKDOWNTRACKER && (
                <th className="p-2 border-top-0 text-left">
                  <span aria-hidden="true">
                    Category
                  </span>
                </th>
              )}
              <th className="p-2 border-top-0 text-center">
                <span aria-hidden="true">
                  Download
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {getRow(equipmentAttachment)}
          </tbody>
        </Table>
      )}
      <Modal isOpen={modal} size="lg">
        <ModalHeader toggle={toggle}>{imageName}</ModalHeader>
        <ModalBody>
          <img src={imageView} alt="view document" width="100%" />
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
        <hr className="m-0" />
        <ModalBody>
          Are you sure, you want to upload this document ?
        </ModalBody>
        <ModalFooter>
          <Button variant="contained" color="primary" onClick={() => { setFinish(true); setShow(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
          {' '}
          <Button  variant="contained" onClick={() => { document.getElementById('fileUpload').value = null; setFinish(false); setModalAlert(false); }}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalDownload} toggle={toggleDownload} size="md">
        <ModalHeaderComponent size="md" title="Download Document" closeModalWindow={toggleDownload} />
        <hr className="m-0" />
        <ModalBody className="pl-4 ml-1">
          Are you sure, you want to download the document?
        </ModalBody>
        <ModalFooter>
          <Button variant="contained" color="primary" onClick={() => { setFinishDownload(true); setModalDownload(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalDelete} toggle={toggleDelete} size="md">
        <ModalHeaderComponent size="md" title="Delete Document" closeModalWindow={toggleDelete} />
        <hr className="m-0" />
        <ModalBody className="pl-4 ml-1">
          {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && !deleteAttatchmentInfo.loading && !deleteAttatchmentInfo.err && (
            <span>
              Are you sure, you want to remove
              {'  '}
              {selectedDocName}
              {'  '}
              document?
            </span>
          )}
          {deleteAttatchmentInfo && deleteAttatchmentInfo.loading && (
            <Loader />
          )}
          {deleteAttatchmentInfo && deleteAttatchmentInfo.err && (
            <SuccessAndErrorFormat response={deleteAttatchmentInfo} />
          )}
          {(deleteAttatchmentInfo && deleteAttatchmentInfo.data) && (
            <SuccessAndErrorFormat
              response={deleteAttatchmentInfo}
              successMessage="Document removed successfully..."
            />
          )}
        </ModalBody>
        <ModalFooter>
          {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && (
            <Button color="primary" variant="contained" disabled={deleteAttatchmentInfo.loading} onClick={() => removeFile(selectedDocId)}>Remove</Button>
          )}
          {deleteAttatchmentInfo && deleteAttatchmentInfo.data && (
            <Button color="primary" variant="contained" onClick={() => toggleDelete()}>Ok</Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
});

Attachments.defaultProps = {
  ticketId: false,
};

Attachments.propTypes = {
  viewId: PropTypes.number.isRequired,
  ticketId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  resModel: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  ticketNumber: PropTypes.string.isRequired,
};

export default Attachments;
