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

import {
  getDefaultNoValue,
  extractTextObject,
} from '../../util/appUtils';

const FacilityInfo = (props) => {
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

  return (detailData && (
  <>
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Name</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.employee_id))}</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Photo</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">
            {detailData.employee_image
              ? (
                <img
                  src={detailData.employee_image ? `data:image/png;base64,${detailData.employee_image}` : ''}
                  alt="employee_image"
                  className="mr-2 cursor-pointer"
                  width="35"
                  height="35"
                  aria-hidden="true"
                  onClick={() => toggleImage(detailData.employee_image)}
                />
              )
              : ' - '}
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
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.employee_phone)}</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Email</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.employee_email)}</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Host Name</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.host_name)}</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Host Email</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.host_email)}</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    { /* <Row className="m-0">
      <span className="m-0 p-0 light-text">Allowed Host Company</span>
    </Row>
    <Row className="m-0">
      <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.allowed_sites_id))}</span>
    </Row>
              <p className="mt-2" /> */ }
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
  )
  );
};

FacilityInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default FacilityInfo;
