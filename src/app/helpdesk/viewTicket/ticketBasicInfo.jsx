/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../util/appUtils';

import TicketInfo from './ticketDetails/ticketInfo';
import AssetInfo from './ticketDetails/assetInfo';
import SlaInfo from './ticketDetails/slaInfo';
import SlaLevelInfo from './ticketDetails/slaLevelInfo';
import LastCommentInfo from './ticketDetails/lastCommentInfo';

const TicketBasicInfo = (props) => {
  const {
    detailData,
    isIncident,
    setParentTicket, setCurrentTicket,
    type,
  } = props;

  const ticketData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {ticketData && (
        <div>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">TICKET INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <TicketInfo detailData={ticketData} type={type} isIncident={isIncident} setParentTicket={setParentTicket} setCurrentTicket={setCurrentTicket} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ASSET INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AssetInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">LAST COMMENT INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <LastCommentInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">SLA INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <SlaInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="8" xs="12" lg="8" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ESCALATION MATRIX</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1">
                    <SlaLevelInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {detailData && detailData.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(detailData && detailData.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(detailData)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

TicketBasicInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  isIncident: PropTypes.bool,
  setParentTicket: PropTypes.func.isRequired,
  setCurrentTicket: PropTypes.func.isRequired,
};

TicketBasicInfo.defaultProps = {
  isIncident: false,
};

export default TicketBasicInfo;
