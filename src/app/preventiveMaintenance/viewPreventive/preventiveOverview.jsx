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
import PurchaseInfo from './purchaseInfo';
import SchedulerInfo from './warrantyInfo';

const appModels = require('../../util/appModels').default;

const PreventiveOverview = () => {
  const dispatch = useDispatch();
  const { ppmDetail } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (ppmDetail && ppmDetail.data && ppmDetail.data.length && ppmDetail.data.length > 0) {
      const hourlyId = ppmDetail.data[0].hours_ids;
      if (hourlyId && hourlyId.length > 0) {
        dispatch(getVendorTags(hourlyId, appModels.PPMCALENDARHOURS));
      }
    }
  }, [ppmDetail]);

  return (
    <>
      {ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0) && (
        <div>
          <Row className="p-0 ppm-overview">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detailData={ppmDetail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">MAINTANENCE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <PurchaseInfo detailData={ppmDetail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">SCHEDULER INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <SchedulerInfo detailData={ppmDetail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {ppmDetail.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(ppmDetail && ppmDetail.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(ppmDetail)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
PreventiveOverview.propTypes = {
};
PreventiveOverview.defaultProps = {
  isInspection: false,
};
export default PreventiveOverview;
