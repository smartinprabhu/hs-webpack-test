/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import {  Row, Col} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';

import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import editWhiteIcon from '@images/icons/editWhite.svg';
import editIcon from '@images/icons/edit.svg';
import BasicHeader from './surveyDetail/basicHeader';

const DrawerHeader = (props) => {
  const {
    title, pathName, imagePath, closeDrawer, isEditable, onNext, onPrev, onEdit, viewAnswers, afterReset, setViewModal,
  } = props;
  const { surveyDetails } = useSelector((state) => state.survey);

  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);

  const renderPath = () => (
    <>
      { pathName && pathName !== ''
        ? (
          <span aria-hidden="true" className="font-weight-800 mr-1 font-medium link-text cursor-pointer" onClick={closeDrawer}>
            {pathName}
            {' '}
            /
          </span>
        )
        : ''}
      {title && title !== ''
        ? (
          <span className="font-weight-800 font-medium cursor-pointer">
            {title}
          </span>
        )
        : ''}
    </>
  );

  const handleAnswerView = () => {
    if (afterReset) afterReset();
  };

  return (
    <Row>
      <Col md={12} sm={12} xs={12} lg={12} className="m-0 p-0">
        <h5 className="m-0 p-0">
          {imagePath && (
            <img
              alt={title}
              width="25"
              height="25"
              className="mr-2 font-weight-700"
              src={imagePath}
            />
          )}
          {!pathName ? title : renderPath()}
          <span className="float-right">
            <BasicHeader detail={surveyDetails} setViewModal={setViewModal} afterReset={() => handleAnswerView()} viewAnswers={viewAnswers} />
            {isEditable && (
              <Button
                variant="contained"
                size="sm"
                onClick={onEdit}
                onMouseLeave={() => setButtonHover1(false)}
                onMouseEnter={() => setButtonHover1(true)}
                className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
              >
                <img src={isButtonHover1 ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                <span className="mr-2">Edit</span>
              </Button>
            )}
            <Button
              variant="contained"
              size="sm"
              onClick={closeDrawer}
              onMouseLeave={() => setButtonHover(false)}
              onMouseEnter={() => setButtonHover(true)}
              className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mr-2 mb-1 "
            >
              <img src={isButtonHover ? closeCircleWhiteIcon : closeCircleIcon} className="mr-2 pb-05" height="auto" width="12" alt="close" />
              <span className="mr-2">Close</span>
            </Button>
            {onNext && (
            <>
              <Tooltip title="Prev" placement="left">
                <FontAwesomeIcon className="cursor-pointer ml-1 mr-2" onClick={onPrev} size="lg" icon={faArrowLeft} />
              </Tooltip>
              <Tooltip title="Next" placement="right">
                <FontAwesomeIcon className="cursor-pointer mr-1 ml-2" onClick={onNext} size="lg" icon={faArrowRight} />
              </Tooltip>
            </>
            )}
          </span>
        </h5>
      </Col>
    </Row>
  );
};

DrawerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  imagePath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  pathName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  closeDrawer: PropTypes.func.isRequired,
  isEditable: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onNext: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onPrev: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onEdit: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  afterReset: PropTypes.func.isRequired,
  viewAnswers: PropTypes.bool.isRequired,
  setViewModal: PropTypes.func.isRequired,
};

DrawerHeader.defaultProps = {
  imagePath: false,
  pathName: false,
  isEditable: false,
  onNext: false,
  onPrev: false,
  onEdit: false,
};

export default DrawerHeader;
