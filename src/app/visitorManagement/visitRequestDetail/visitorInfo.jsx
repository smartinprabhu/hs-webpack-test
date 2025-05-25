/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

import userImage from '@images/userProfile.jpeg';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../util/appUtils';

const AuditorInfo = (props) => {
  const {
    detailData,
  } = props;
  const [selectedImage, showSelectedImage] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => {
    showSelectedImage(false);
    setModal(!modal);
  };

  const toggleImage = (image) => {
    showSelectedImage(image);
    setModal(!modal);
  };

  const documentDownload = (datas, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:image/png;base64,${encodeURIComponent(datas)}`);
    element.setAttribute('download', filename);
    element.setAttribute('id', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  return (
    detailData && (
    <>
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Name</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.visitor_name)}</span>
          </Row>
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Photo</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">
              {detailData.image_medium
                ? (
                  <img
                    src={detailData.image_medium ? `data:image/png;base64,${detailData.image_medium}` : userImage}
                    alt="visitor_image"
                    className="mr-2 cursor-pointer"
                    width="35"
                    height="35"
                    aria-hidden="true"
                    onClick={() => toggleImage(detailData.image_medium ? `data:image/png;base64,${detailData.image_medium}` : userImage)}
                  />
                ) : ' - '}
            </span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Phone</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.phone)}</span>
          </Row>
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Email</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.email)}</span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Visitor Company</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.organization)}</span>
          </Row>
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">ID Proof</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.id_proof))}</span>
          </Row>
        </Col>

      </Row>
      <p className="mt-2" />

      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">ID Proof Number</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.Visitor_id_details)}</span>
          </Row>
        </Col>
      </Row>

      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Attachment</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700">
          {detailData.attachment
            ? (
              <>
                <img
                  src={detailData.attachment ? `data:image/png;base64,${detailData.attachment}` : ''}
                  alt="attachment"
                  className="mr-2 cursor-pointer"
                  width="35"
                  height="35"
                  aria-hidden="true"
                  onClick={() => toggleImage(detailData.attachment ? `data:image/png;base64,${detailData.attachment}` : '')}
                />
                <FontAwesomeIcon
                  className="cursor-pointer"
                  icon={faDownload}
                  onClick={() => documentDownload(detailData.attachment, `${detailData.visitor_name} ${extractTextObject(detailData.id_proof)}`)}
                />
              </>
            ) : ' - '}
        </span>
      </Row>
      <p className="mt-2" />
      <Modal isOpen={modal} size="lg">
        <ModalHeader toggle={toggle}>{detailData.visitor_name}</ModalHeader>
        <ModalBody>
          {selectedImage
            ? (
              <img
                src={selectedImage || ''}
                alt={detailData.visitor_name}
                width="100%"
                height="100%"
                aria-hidden="true"
              />
            )
            : ''}
        </ModalBody>
      </Modal>
    </>
    ));
};

AuditorInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AuditorInfo;
