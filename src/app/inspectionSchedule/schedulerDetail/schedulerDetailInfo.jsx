/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  DropdownToggle,
  DropdownMenu,
  ButtonDropdown,
  DropdownItem,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCog,
} from '@fortawesome/free-solid-svg-icons';

import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../util/appUtils';
import {
  getWorkOrderPriorityFormLabel,
} from '../../workorders/utils/utils';

const SchedulerDetailInfo = (props) => {
  const { detailData } = props;

  const defaultActionText = 'Inspection Actions';

  const [selectedActions] = useState(defaultActionText);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {viewData && (
      <Row className="mt-3 globalModal-header-cards">
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500">
                    ASSET
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(viewData.category_type === 'Equipment' ? extractNameObject(viewData.equipment_id, 'name') : extractNameObject(viewData.space_id, 'space_name'))}
                  </p>
                  <span className="font-weight-500 font-tiny">
                    {viewData.category_type === 'Equipment' ? getDefaultNoValue(extractNameObject(viewData.equipment_id, 'equipment_seq'))
                      : getDefaultNoValue(extractNameObject(viewData.space_id, 'sequence_asset_hierarchy'))}
                  </span>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={assetDefault} alt="asset" width="30" className="mt-3" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    LOCATION
                  </p>
                  <p className="mb-0 font-weight-700">
                    {viewData.category_type === 'Equipment'
                      ? getDefaultNoValue(viewData.equipment_id && viewData.equipment_id.location_id && viewData.equipment_id.location_id.path_name
                        ? viewData.equipment_id.location_id.path_name : '')
                      : getDefaultNoValue(extractNameObject(viewData.space_id, 'path_name'))}
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={locationBlack} alt="asset" width="20" className="mt-3" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    PRIORITY
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(getWorkOrderPriorityFormLabel(viewData.priority))}
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={logsIcon} alt="asset" width="25" className="mt-3" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    ACTIONS
                  </p>
                  <p className="mb-0 font-weight-700">
                    <div className="mt-2">
                      <ButtonDropdown className="actionDropdown">
                        <DropdownToggle
                          caret
                          className="pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left"
                        >
                          <span className="font-weight-700">
                            <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                            {selectedActions}
                            <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            id="switchAction"
                            className="pl-2"
                          />
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={handPointerBlack} alt="asset" width="20" className="mt-3" />
                </Col>
              </Row>
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
