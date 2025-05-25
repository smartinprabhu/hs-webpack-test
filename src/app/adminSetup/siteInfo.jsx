/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import building from '@images/icons/building.png';
import companyBuilding from '@images/building.jpg';
import ErrorContent from '@shared/errorContent';

import Loader from '@shared/loading';
import {
  getDefaultNoValue,
} from '../util/appUtils';

const SiteInfo = () => {
  const { companyDetail } = useSelector((state) => state.setup);

  return (
    <>
      <Card className="border-0 h-100">
        {companyDetail && (companyDetail.data && companyDetail.data.length > 0) && (
          <>
            <CardTitle className="mt-2 ml-2 mb-1 mr-2 border-bottom-dark pb-2">
              <span className="p-2 font-weight-600 font-side-heading">
                <img src={building} alt="building" width="12" className="mr-2" />
                {' '}
                {' '}
                <span className="font-weight-500">{getDefaultNoValue(companyDetail.data[0].name)}</span>
              </span>
            </CardTitle>
            <CardBody data-testid="success-case" className="p-3">
              <Row className="pb-2">
                <Col md="12" className="text-center">
                  <img src={companyDetail.data[0].logo ? `data:image/png;base64,${companyDetail.data[0].logo}` : companyBuilding} alt="logo" width="100%" height="100%" />
                </Col>
              </Row>
              <Row className="mb-1 mt-1 ml-0">
                <h5 className="font-weight-800 mb-1 text-uppercase">{getDefaultNoValue(companyDetail.data[0].name)}</h5>
              </Row>
              <Row className="pb-2">
                <Col md="12">
                  <div className="border-bottom pb-1">
                    <small className="font-weight-400 text-muted mr-1">
                      Site Address
                    </small>
                    <br />
                    <div>
                      <span>
                        {getDefaultNoValue(companyDetail.data[0].street)}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col md="12">
                  <div className="border-bottom pb-1">
                    <small className="font-weight-400 text-muted mr-1">
                      Country
                    </small>
                    <br />
                    <span>
                      {getDefaultNoValue(companyDetail.data[0].country_id ? companyDetail.data[0].country_id[1] : '')}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col md="12">
                  <div className="border-bottom pb-1">
                    <small className="font-weight-400 text-muted mr-1">
                      Website
                    </small>
                    <br />
                    <span>
                      {getDefaultNoValue(companyDetail.data[0].website)}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col md="12">
                  <div className="border-bottom pb-1">
                    <small className="font-weight-400 text-muted mr-1">
                      Category
                    </small>
                    <br />
                    <span>
                      {getDefaultNoValue(companyDetail.data[0].res_company_categ_id ? companyDetail.data[0].res_company_categ_id[1] : '')}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col md="12">
                  <div className="border-bottom pb-1">
                    <small className="font-weight-400 text-muted mr-1">
                      Total Square Feet
                    </small>
                    <br />
                    <span>
                      {getDefaultNoValue(companyDetail.data[0].area_sqft)}
                    </span>
                  </div>
                </Col>
              </Row>
              { /* <Row className="pb-2">
                <Col md="12">
                  <div className="border-bottom pb-1">
                    <small className="font-weight-400 text-muted mr-1">
                      Number of Users
                    </small>
                    <br />
                    <span>
                      {getDefaultNoValue(companyDetail.data[0].user_ids ? companyDetail.data[0].user_ids.length : '')}
                    </span>
                  </div>
                </Col>
              </Row> */ }
              <Row className="pb-2">
                <Col md="12">
                  <div>
                    <small className="font-weight-400 text-muted mr-1">
                      Occupancy
                    </small>
                    <br />
                    <span>
                      {companyDetail.data[0].occupancy ? companyDetail.data[0].occupancy : 0}
                    </span>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </>
        )}
        {companyDetail && companyDetail.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}

        {(companyDetail && companyDetail.err) && (
          <CardBody className="p-0">
            <ErrorContent errorTxt={companyDetail.err.statusText ? companyDetail.err.statusText : 'Something went wrong'} />
          </CardBody>
        )}
      </Card>
    </>
  );
};
export default SiteInfo;
