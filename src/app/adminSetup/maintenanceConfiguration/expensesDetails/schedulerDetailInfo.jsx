/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  DropdownToggle,
  ButtonDropdown,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCog,
} from '@fortawesome/free-solid-svg-icons';
import importMiniIcon from '@images/icons/importMini.svg';
import plusCircleBlueIcon from '@images/icons/plusCircleBlue.svg';

import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const SchedulerDetailInfo = (props) => {
  const { detailData } = props;

  const defaultActionText = 'OpEx Actions';
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  useEffect(() => {
    if (selectedActions === 'Asset Bulk Upload') {
      showBulkUploadModal(true);
    }
  }, [enterAction]);

  const faIcons = {
    ADDLOCATION: plusCircleBlueIcon,
    ADDLOCATIONACTIVE: plusCircleBlueIcon,
    ASSETBULKUPLOAD: importMiniIcon,
    ASSETBULKUPLOADACTIVE: importMiniIcon,
  };

  return (
    <>
      {viewData && (
      <Row className="mt-12 globalModal-header-cards">
        <Col sm="12" md="6" lg="6" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    TITLE
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(viewData.name)}
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={logsIcon} alt="asset" width="25" className="mt-3" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="6" lg="6" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    ACTIONS
                  </p>
                  <p className="mb-0 font-weight-700">
                    <div className="mt-2">
                      <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown pr-2">
                        <DropdownToggle
                          caret
                          className={selectedActionImage !== '' ? 'bg-white text-navy-blue pb-05 pt-05 font-11 rounded-pill text-left' : 'btn-navyblue pb-05 pt-05 font-11 rounded-pill text-left'}
                        >
                          {selectedActionImage !== ''
                            ? (
                              <img alt="add" className="mr-2 pb-2px" src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" />
                            ) : ''}
                          <span className="font-weight-700">
                            {!selectedActionImage && (
                            <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                            )}
                            {selectedActions}
                            <FontAwesomeIcon size="sm" color="primary" className="float-right ml-1 mt-1" icon={faChevronDown} />
                          </span>
                        </DropdownToggle>
                      </ButtonDropdown>
                    </div>
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={handPointerBlack} alt="asset" width="20" className="mt-3" />
                </Col>
              </Row>
              {bulkUploadModal && (
              <ExpensesBulkUpload
                atFinish={() => {
                  showBulkUploadModal(false);
                }}
                bulkUploadModal
              />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      )}
    </>
  );
};

SchedulerDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default SchedulerDetailInfo;
