/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import ReactFileReader from 'react-file-reader';
import { Image, Tooltip } from 'antd';

import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { bytesToSize } from '../../util/staticFunctions';
import {
  getLocalTimeSeconds, truncate,
} from '../../util/appUtils';

const ImageUpload = React.memo((props) => {
  const {
    viewId, ticketId, ticketNumber, resModel, companyId, onCurrentChange,
  } = props;
  const [show, setShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [documentReady, setDocumentReady] = useState('');
  const [imgSize, setimgSize] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [fileImageSize, setFileImageSize] = useState(false);
  const [fileValue, setFileValue] = useState({});
  const [finish, setFinish] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [equipmentImages, setEquipmentImages] = useState([]);

  const errorToggle = () => setErrorShow(!errorShow);

  const toggleAlert = () => {
    setModalAlert(!modalAlert);
    document.getElementById('fileUploadsv1').value = null;
    setFinish(false);
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
        // fileUpload(fileValue);
        fileValue.dataid = ticketId;
        const arr = [...equipmentImages, ...[fileValue]];
        const data = [...new Map(arr.map((item) => [item.name, item])).values()];
        const checklistData = data.filter((item) => item.dataid === ticketId);
        setEquipmentImages(checklistData);
      } else {
        setimgSize(true);
        setErrorShow(true);
        setShow(false);
      }
    }
  }, [finish, documentReady]);

  const handleFiles = (files) => {
    onCurrentChange();
    setimgValidation(false);
    setimgSize(false);
    if (files !== undefined) {
      const { name } = files.fileList[0];
      if (name && !name.match(/.(jpg|jpeg|svg|png|pdf|xlsx|ppt|docx|xls)$/i)) {
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

  return (
    <>
      <Row>
        <Col md="12" lg="12">
          { /* <div className="text-left font-11 text-info ml-2">
            <FontAwesomeIcon size="sm" icon={faInfoCircle} />
            {' '}
            Allowed file types: .jpg, .jpeg, .png, .svg
  </div> */ }
          <div className="text-right mt-3 text-line-height-2 mr-3">
            <ReactFileReader handleFiles={handleFiles} elementId="fileUploadsv1" fileTypes="*" base64>
              <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
              <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
            </ReactFileReader>
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
            <br />
          </div>
        </Col>
      </Row>
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
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeaderComponent size="sm" title="Upload Image" closeModalWindow={toggleAlert} />
        <hr className="m-0" />
        <ModalBody>
          Are you sure, you want to upload this document ?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { setFinish(true); setShow(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

ImageUpload.defaultProps = {
  ticketId: false,
};

ImageUpload.propTypes = {
  viewId: PropTypes.number.isRequired,
  ticketId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  companyId: PropTypes.number.isRequired,
  resModel: PropTypes.string.isRequired,
  onCurrentChange: PropTypes.func.isRequired,
  ticketNumber: PropTypes.string.isRequired,
};

export default ImageUpload;
