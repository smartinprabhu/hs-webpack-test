/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row, Col, Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
} from '../../../../util/appUtils';

const CourierInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const [selectedImage, showSelectedImage] = useState(false);
  const [modal, setModal] = useState(false);

  const toggleImage = (image) => {
    showSelectedImage(image);
    setModal(!modal);
  };

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Name</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.sent_to)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Address</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.address)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Delivered On</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.delivered_on, userInfo, 'datetime'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Delivered By</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.delivered_by, 'name'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Courier</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.courier_id, 'name'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Tracking Number</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.tracking_no)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Agent Name</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.agent_name)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Signature</span>
            </Row>
            <Row className="m-0">
              {detailData.signature
                ? (
                  <img
                    src={detailData.signature ? `data:image/png;base64,${detailData.signature}` : ''}
                    alt="employee_image"
                    className="mr-2 cursor-pointer"
                    width="45"
                    height="45"
                    aria-hidden="true"
                    onClick={() => toggleImage(detailData.signature ? `data:image/png;base64,${detailData.signature}` : '')}
                  />
                )
                : ' - '}
              <Modal isOpen={modal} size="lg">
                <ModalHeader toggle={toggleImage}>{detailData.agent_name}</ModalHeader>
                <ModalBody>
                  {selectedImage
                    ? (
                      <img
                        src={selectedImage || ''}
                        alt={detailData.agent_name}
                        width="100%"
                        height="100%"
                        aria-hidden="true"
                      />
                    )
                    : ''}
                </ModalBody>
              </Modal>
            </Row>
            <p className="mt-2" />
          </Col>
        </Row>
      </>
      )}
    </>
  );
};

CourierInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default CourierInfo;
