/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../util/appUtils';
import {
  getVendorTags,
} from '../../purchase/purchaseService';
import GeneralInfo from './generalInfo';
import PantryInfo from './pantryInfo';
import SchedulerInfo from './warrantyInfo';

const appModels = require('../../util/appModels').default;

const PantryOverview = () => {
  const dispatch = useDispatch();
  const { pantryDetails } = useSelector((state) => state.pantry);

  useEffect(() => {
    if (pantryDetails && pantryDetails.data && pantryDetails.data.length && pantryDetails.data.length > 0) {
      const hourlyId = pantryDetails.data[0].hours_ids;
      if (hourlyId && hourlyId.length > 0) {
        dispatch(getVendorTags(hourlyId, appModels.PPMCALENDARHOURS));
      }
    }
  }, [pantryDetails]);

  return (
    <>
      {pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) && (
        <div>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detailData={pantryDetails} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">PANTRY INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1">
                    <PantryInfo detailData={pantryDetails} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">COMPANY INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <SchedulerInfo detailData={pantryDetails} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {pantryDetails.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(pantryDetails && pantryDetails.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(pantryDetails)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
PantryOverview.propTypes = {
};
PantryOverview.defaultProps = {
  isInspection: false,
};
export default PantryOverview;
