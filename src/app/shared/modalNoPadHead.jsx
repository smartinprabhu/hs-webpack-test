/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  ModalHeader, Row, Col, Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ModalNoPadHead = (props) => {
  const {
    title, imagePath, fontAwesomeIcon, closeModalWindow,
  } = props;
  return (
    <ModalHeader className="modal-justify-header">
      <Row sm="12" md="12" lg="12" xs="12">
        <Col
          sm="12"
          lg="8"
          md="8"
        >
          <Row className="content-center">
            {fontAwesomeIcon ? <FontAwesomeIcon size="lg" className="ml-2 mr-2" icon={fontAwesomeIcon} /> : ''}
            {imagePath ? (<img src={imagePath} className="mr-2" alt="altImage" width="25" height="25" />) : ''}
            <div>
              <h4 className="font-weight-800 mb-0 ml-0 float-left">{title}</h4>
            </div>
          </Row>
        </Col>
        <Col sm="4" md="4" lg="4" id="close_button">
          <Button className="cancelButton pb-0 px-2 float-right buttonGrey greyButton" outline size="sm" onClick={closeModalWindow}>
            Cancel
            <FontAwesomeIcon icon={faTimesCircle} className="ml-2" />
          </Button>
        </Col>
      </Row>
    </ModalHeader>
  );
};
ModalNoPadHead.propTypes = {
  title: PropTypes.string.isRequired,
  imagePath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  fontAwesomeIcon: PropTypes.shape({}),
  closeModalWindow: PropTypes.func.isRequired,
};

ModalNoPadHead.defaultProps = {
  imagePath: undefined,
  fontAwesomeIcon: undefined,
};
export default ModalNoPadHead;
