/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import locationBlack from '@images/drawerLite/locationLite.svg';
import ppmLite from '@images/drawerLite/ppmLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import {
  getDefaultNoValue,
} from '../../util/appUtils';
import {
  getWorkOrderPriorityFormLabel,
} from '../../workorders/utils/utils';

const BasicInfo = () => {
  const { ppmDetail } = useSelector((state) => state.ppm);
  const [isRedirect] = useState(false);

  const ppmDetails = ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0) ? ppmDetail.data[0] : '';

  if (isRedirect) {
    return (<Redirect to="/maintenance/workorders" />);
  }

  return (
    <>
      <Row className="mt-0 globalModal-header-cards">
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    CATEGORY
                  </p>
                  <span className="mb-0 font-weight-700">
                    {ppmDetails.category_type === 'e'
                      ? 'Equipment' : 'Space'}
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
                    {ppmDetails.category_type === 'e' ? 'ASSET' : 'LOCATION'}
                  </p>
                  <p className="mb-0 font-weight-700">
                    {ppmDetails.category_type === 'e'
                      ? getDefaultNoValue(ppmDetail.data && ppmDetails.category_id ? ppmDetails.category_id[1] : '')
                      : getDefaultNoValue(ppmDetail.data && ppmDetails.asset_category_id ? ppmDetails.asset_category_id[1] : '')}
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
                    {getWorkOrderPriorityFormLabel(ppmDetails.priority)}
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
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    TEAM
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(ppmDetail.data && ppmDetails.maintenance_team_id ? ppmDetails.maintenance_team_id[1] : '')}
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={ppmLite} alt="asset" width="20" className="mt-3" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default BasicInfo;
