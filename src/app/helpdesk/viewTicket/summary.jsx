/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getCompanyTimezoneDate, getDefaultNoValue,
} from '../../util/appUtils';
import {
  getMTLabel, getTicketOrderStateText,
} from '../utils/utils';

const Summary = () => {
  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);
  const {
    userInfo,
  } = useSelector((state) => state.user);

  return (
    <>
      {ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
        <div className="max-height-550 thin-scrollbar overflow-auto pr-2">
          <Card className="no-border-radius">
            <CardBody className="p-0 bg-porcelain">
              <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">REQUESTOR INFO</p>
            </CardBody>
          </Card>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Company</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(ticketDetail.data[0].company_id ? ticketDetail.data[0].company_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Email</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].email)}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Requested On</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getCompanyTimezoneDate(ticketDetail.data[0].create_date, userInfo, 'datetime')}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Requestor</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">
                  {getDefaultNoValue(ticketDetail.data[0].requestee_id ? ticketDetail.data[0].requestee_id[1] : getDefaultNoValue(ticketDetail.data[0].person_name))}
                </span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Mobile</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].mobile)}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Close Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(getCompanyTimezoneDate(ticketDetail.data[0].close_time, userInfo, 'datetime'))}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
          </Row>
          <Card className="no-border-radius">
            <CardBody className="p-0 bg-porcelain">
              <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">ASSET INFO</p>
            </CardBody>
          </Card>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Asset Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                  {ticketDetail.data[0].type_category && ticketDetail.data[0].type_category === 'equipment' ? 'Equipment' : 'Space'}
                </span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Maintenance Team</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].maintenance_team_id ? ticketDetail.data[0].maintenance_team_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Vendor</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].vendor_id ? ticketDetail.data[0].vendor_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">MO Status</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(getTicketOrderStateText(ticketDetail.data[0].mro_state))}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              {ticketDetail.data[0].type_category === 'equipment' && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Equipment</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                    {getDefaultNoValue(ticketDetail.data[0].equipment_id
                      ? ticketDetail.data[0].equipment_id[1] : '')}
                  </span>
                </Row>
                <hr className="mt-2" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Equipment Location</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                    {getDefaultNoValue(ticketDetail.data[0].equipment_location_id
                      ? ticketDetail.data[0].equipment_location_id[1] : '')}
                  </span>
                </Row>
                <hr className="mt-2" />
              </>
              )}
              {ticketDetail.data[0].type_category === 'asset' && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Space</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                    {getDefaultNoValue(ticketDetail.data[0].asset_id
                      ? ticketDetail.data[0].asset_id[1] : '')}
                  </span>
                </Row>
                <hr className="mt-2" />
              </>
              )}
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Maintenance Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(getMTLabel(ticketDetail.data[0].maintenance_type))}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
          </Row>
        </div>
      )}
      {ticketDetail.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(ticketDetail && ticketDetail.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={ticketDetail.err.statusText ? ticketDetail.err.statusText : 'Something went wrong'} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default Summary;
