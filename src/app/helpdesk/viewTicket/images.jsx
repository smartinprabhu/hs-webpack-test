/* eslint-disable consistent-return */
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
  Toast,
  ToastBody,
  ToastHeader,
  Badge,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle, faDownload, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Image, Tooltip } from 'antd';

import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getEquipmentDocument, onDocumentCreates, fileDownloads,
  resetDeleteAttatchment, getDeleteAttatchment,
} from '../ticketService';
import { bytesToSize } from '../../util/staticFunctions';
import {
  getLocalTimeSeconds, generateErrorMessage, truncate, getListOfModuleOperations, extractTextObject, getDefaultNoValue,
} from '../../util/appUtils';
import { getImages } from '../utils/utils';
import actionCodes from '../data/attatchmentActionCodes.json';

const appModels = require('../../util/appModels').default;

const Images = React.memo((props) => {
  const {
    viewId, ticketId, ticketNumber, resModel, model, isManagable, isModule, isCreateAllowed, isDownloadAllowed, isDeleteAllowed,
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
  const [preview, setPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedDocName, setSelectedDocName] = useState(false);

  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    equipmentDocuments, documentCreate, downloadDocument,
    deleteAttatchmentInfo,
  } = useSelector((state) => state.ticket);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Attachments', 'code');

  let isCreatable = allowedOperations.includes(actionCodes['Add Image']);
  let isDeletable = allowedOperations.includes(actionCodes['Delete Image']);
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

  const toggleAlert = () => {
    setModalAlert(!modalAlert);
    document.getElementById('fileUploadsv1').value = null;
    setFinish(false);
  };

  const toggleDownload = () => {
    setModalDownload(!modalDownload);
    setFinishDownload(false);
    setSelectedDocId(false);
    if (document.getElementById('fileUploadsv1') && document.getElementById('fileUploadsv1').value) {
      document.getElementById('fileUploadsv1').value = null;
    }
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
    if (show || errorShow) {
      let isMounted = true;
      setTimeout(() => {
        if (isMounted) {
          setShow(false);
          setErrorShow(false);
        }
      }, 3000);
      return () => { isMounted = false; };
    }
  }, [show, errorShow]);

  useEffect(() => {
    if (finish) {
      if (bytesToSize(fileImageSize)) {
        dispatch(onDocumentCreates(fileValue));
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
    if (documentCreate && documentCreate.data) {
      dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
    }
  }, [documentCreate]);

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

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files !== undefined) {
      const { name } = files.fileList[0];
      if (name && !name.match(/.(jpg|jpeg|svg|png)$/i)) {
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

  const equipmentImages = (equipmentDocuments && equipmentDocuments.data) ? getImages(equipmentDocuments.data) : [];

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (equipmentDocuments && equipmentDocuments.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (equipmentDocuments && equipmentDocuments.err) ? generateErrorMessage(equipmentDocuments) : userErrorMsg;
  const errorMsgDocument = (documentCreate && documentCreate.err) ? generateErrorMessage(documentCreate) : userErrorMsg;

  return (
    <>
      <Row>
        <Col md="12" lg="12">
          <div className="text-left font-11 text-info ml-2">
            <FontAwesomeIcon size="sm" icon={faInfoCircle} />
            {' '}
            Allowed file types: .jpg, .jpeg, .png, .svg
          </div>
          <div className="text-right  mt-3 text-line-height-2">
            {isCreatable && (
              <ReactFileReader handleFiles={handleFiles} elementId="fileUploadsv1" fileTypes="image/*" base64>
                {(documentCreate && documentCreate.loading) ? (
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
                    Upload .jpg, .png, .svg only
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

            {documentCreate && documentCreate.data && (
              <Toast isOpen={show} className="mt-2">
                <ToastHeader icon="success" toggle={toastToggle}>SUCCESS</ToastHeader>
                <ToastBody className="text-left">
                  Image uploaded successfully...
                </ToastBody>
              </Toast>
            )}
            {((documentCreate && documentCreate.err) || isUserError) && (
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
      {(equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length > 0) && (equipmentImages.length <= 0) && (
        <ErrorContent errorTxt="No data found." />
      )}
      {loading && (
        <Card className="border-0">
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}
      <Row className="ml-1 mr-1">
        <Image.PreviewGroup>
          {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
            <div className="mr-3 mb-3">
              <Image
                width={100}
                height={100}
                src={`data:${document.mimetype};base64,${document.datas}`}
              />
              <br />
              <Tooltip title={document.datas_fname} placement="top">
                <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
              </Tooltip>
              {isDownloadble && (
              <Tooltip title="Download" placement="top">
                <FontAwesomeIcon
                  size="sm"
                  className="cursor-pointer mt-1 float-right"
                  icon={faDownload}
                  onClick={() => { setSelectedDocId(document.id); setPreview(false); setModalDownload(true); setImagePreview(''); }}
                />
              </Tooltip>
              )}
              {isDeletable && (
                <Tooltip title="Delete" placement="top">
                  <FontAwesomeIcon
                    size="sm"
                    className="cursor-pointer mt-1 mr-2 float-right"
                    icon={faTrashAlt}
                    onClick={() => { setSelectedDocId(document.id); setSelectedDocName(document.datas_fname); setPreview(false); setModalDelete(true); setImagePreview(''); }}
                  />
                </Tooltip>
              )}
              <br />
              {document.res_model === appModels.BREAKDOWNTRACKER && (
                document && document.ir_attachment_categ && document.ir_attachment_categ.length ? (
                  <div className="text-center">
                    <Badge color="dark" className="p-1 mb-1 bg-zodiac text-center">{getDefaultNoValue(extractTextObject(document.ir_attachment_categ))}</Badge>
                  </div>
                )
                  : (
                    <div className="text-center">
                      <Badge color="dark" className="p-1 mb-1 bg-zodiac text-center">Others</Badge>
                    </div>
                  )
              )}
            </div>
          ))}
        </Image.PreviewGroup>
        {/* (equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
          <Col sm="3" md="3" lg="3" xs="3" className="p-1" key={document.id}>
            <img
              src={`data:${document.mimetype};base64,${document.datas}`}
              alt="view document"
              className="w-100 cursor-pointer"
              height="100px"
              aria-hidden="true"
              onClick={() => { setPreview(true); setImagePreview(`data:${document.mimetype};base64,${document.datas}`); setSelectedDocId(document.id); }}
            />
          </Col>
        )) */}
      </Row>
      <Modal isOpen={modal} size="lg">
        <ModalHeader toggle={toggle}>{imageName}</ModalHeader>
        <ModalBody>
          <img src={imageView} alt="view document" width="100%" />
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeaderComponent size="sm" title="Upload Image" closeModalWindow={toggleAlert} />
        <hr className="m-0" />
        <ModalBody>
          Are you sure, you want to upload this image ?
        </ModalBody>
        <ModalFooter>
          <Button variant="contained" color="primary" onClick={() => { setFinish(true); setShow(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalDownload} toggle={toggleDownload} size="md">
        <ModalHeaderComponent size="md" title="Download Image" closeModalWindow={toggleDownload} />
        <hr className="m-0" />
        <ModalBody className="pl-4 ml-1">
          Are you sure, you want to download this image?
        </ModalBody>
        <ModalFooter>
          <Button variant="contained" color="primary" onClick={() => { setFinishDownload(true); setModalDownload(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalDelete} toggle={toggleDelete} size="md">
        <ModalHeaderComponent size="md" title="Delete Image" closeModalWindow={toggleDelete} />
        <hr className="m-0" />
        <ModalBody className="pl-4 ml-1">
          {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && !deleteAttatchmentInfo.loading && !deleteAttatchmentInfo.err && (
            <span>
              Are you sure, you want to remove
              {'  '}
              {selectedDocName}
              {'  '}
              image?
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
              successMessage="Image removed successfully..."
            />
          )}
        </ModalBody>
        <ModalFooter>
          {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && (
            <Button variant="contained" color="primary" disabled={deleteAttatchmentInfo.loading} onClick={() => removeFile(selectedDocId)}>Remove</Button>
          )}
          {deleteAttatchmentInfo && deleteAttatchmentInfo.data && (
            <Button variant="contained" color="primary" onClick={() => toggleDelete()}>Ok</Button>
          )}
        </ModalFooter>
      </Modal>
      <Modal isOpen={preview} size="md">
        <ModalHeader toggle={() => { setPreview(false); setImagePreview(''); }}>IMAGE</ModalHeader>
        <ModalBody>
          <img
            src={imagePreview || ''}
            alt="view attachment"
            width="100%"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-cancel"
            size="sm"
            variant="contained"
            onClick={() => {
              setPreview(false);
              setImagePreview('');
            }}
          >
            Cancel
          </Button>
          <Button
             variant="contained"
            size="sm"
            onClick={() => { setModalDownload(true); setPreview(false); setImagePreview(''); }}
          >
            Download
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

Images.defaultProps = {
  ticketId: false,
};

Images.propTypes = {
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

export default Images;
