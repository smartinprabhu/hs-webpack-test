/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  ModalHeader, Row, Col, Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import {
  Typography,
  IconButton,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import MuiTooltip from '@shared/muiTooltip';

const ModalHeaderComponent = (props) => {
  const {
    title, imagePath, fontAwesomeIcon, subtitle, closeModalWindow, size, response,
  } = props;
  return (
    <ModalHeader className="modal-justify-header">
      <Row sm="12" md="12" lg="12" xs="12">
        <Col
          sm={response && (response.data || response.status) ? '12' : size === 'sm' ? `${7}` : `${9}`}
          lg={response && (response.data || response.status) ? '12' : size === 'sm' ? `${7}` : `${9}`}
          md={response && (response.data || response.status) ? '12' : size === 'sm' ? `${7}` : `${9}`}
        >
          <Row className="ml-2">
            {fontAwesomeIcon ? <FontAwesomeIcon className="mx-2 fa-2x" icon={fontAwesomeIcon} /> : ''}
            {imagePath ? (<img src={imagePath} className="mr-2" alt="altImage" width="25" height="25" />) : ''}
            <div>
              <h4 className="font-weight-800 mb-0 ml-0 font-family-tab float-left">{title}</h4>
              <br />
              <p className="font-weight-600 float-left text-red-gray">{subtitle}</p>
            </div>
          </Row>
        </Col>
        {response && (response.data || response.status) ? '' : (
          <Col sm={size === 'sm' ? `${5}` : `${3}`} lg={size === 'sm' ? `${5}` : `${3}`} md={size === 'sm' ? `${5}` : `${3}`}>
            <MuiTooltip title={<Typography>Close</Typography>}>
              <IconButton
                onClick={closeModalWindow}
                className="btn float-right"
                type="button"
              >
                <IoCloseOutline size={28} />
              </IconButton>
            </MuiTooltip>
          </Col>
        )}
      </Row>
    </ModalHeader>
  );
};
ModalHeaderComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  imagePath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  fontAwesomeIcon: PropTypes.shape({}),
  closeModalWindow: PropTypes.func.isRequired,
  size: PropTypes.string,
  response: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.shape({}),
      }),
    ),
    PropTypes.shape({
      data: PropTypes.shape({}),
    }),
    PropTypes.shape({
      data: PropTypes.array,
    }),
    PropTypes.shape({
      data: PropTypes.bool,
    }),
  ]),
};

ModalHeaderComponent.defaultProps = {
  imagePath: undefined,
  subtitle: undefined,
  fontAwesomeIcon: undefined,
  size: undefined,
  response: {},
};
export default ModalHeaderComponent;
