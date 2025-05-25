/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import {
  getTicketChannelFormLabel,
  getIssueTypeLabel,
} from '../../utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
  htmlToReact, truncateHTMLTags,
} from '../../../util/appUtils';
import {
  getNumberToCommas,
} from '../../../util/staticFunctions';
import { setTicketCurrentTab } from '../../ticketService';

const TicketInfo = (props) => {
  const {
    detailData,
    isIncident,
    setParentTicket,
    setCurrentTicket,
    type,
  } = props;

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const {
    workorderDetails,
  } = useSelector((state) => state.workorder);
  const {
    maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);

  const woData = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0] : false;

  const onLoadNotes = () => {
    dispatch(setTicketCurrentTab('Notes'));
  };

  const isConstraintsShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_constraints;
  const isCostShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_cost;

  const isTenantShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_tenant;

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Subject
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar">
              {getDefaultNoValue(detailData.subject)}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Description
            </span>
          </Row>
          <Row className="m-0">
            {detailData.description && detailData.description !== '' && truncateHTMLTags(detailData.description).length > 0
              ? <p className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar" dangerouslySetInnerHTML={{ __html: htmlToReact(detailData.description) }} />
              : '-'}
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Created on
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Assigned To
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}</span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.employee_id))}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Due Date
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Channel
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.sla_end_date, userInfo, 'datetime'))}
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getTicketChannelFormLabel(detailData.channel))}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          {isIncident ? (
            <>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Incident Type
                  </span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Severity
                  </span>
                </Col>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.incident_type_id))}</span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.incident_severity_id))}</span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          ) : (
            <>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Issue Type
                  </span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Parent Ticket
                  </span>
                </Col>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getIssueTypeLabel(detailData.issue_type))}</span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  {detailData.parent_id && detailData.parent_id.length > 0 ? (
                    <span
                      aria-hidden
                      className="m-0 p-0 font-weight-700 text-info cursor-pointer text-capital"
                      onClick={() => { setParentTicket(detailData.parent_id[0]); setCurrentTicket(detailData.id); }}
                    >
                      {getDefaultNoValue(extractTextObject(detailData.parent_id))}
                    </span>
                  ) : (
                    <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.parent_id))}</span>
                  )}
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )}
          <Row className="m-0">
            {/* <span className="m-0 p-0 light-text">
            Priority
          </span> */}
            <Col sm="12" md={!isIncident && !type ? 4 : 6} xs="12" lg={!isIncident && !type ? 4 : 6} className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Priority
              </span>
            </Col>
            {!isIncident && !type && (
            <Col sm="12" md={!isIncident && !type ? 4 : 6} xs="12" lg={!isIncident && !type ? 4 : 6} className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Ticket Type
              </span>
            </Col>
            )}
            {isCostShow && (
            <>
              <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                <span className="m-0 p-0 light-text">
                  Cost
                </span>
              </Col>
            </>
            )}
          </Row>
          <Row className="m-0">
            <Col sm="12" md={!isIncident && !type ? 4 : 6} xs="12" lg={!isIncident && !type ? 4 : 6} className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.priority_id))}</span>
            </Col>
            {!isIncident && !type && (
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.ticket_type)}</span>
            </Col>
            )}
            {isCostShow && (
            <>
              <Col sm="12" md={!isIncident && !type ? 4 : 6} xs="12" lg={!isIncident && !type ? 4 : 6} className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar">
                  {getDefaultNoValue(getNumberToCommas(detailData.cost))}
                </span>
              </Col>
            </>
            )}

          </Row>
          <p className="mt-2" />
          {isConstraintsShow && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Constraints
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar">
                  {getDefaultNoValue(detailData.constraints)}
                </span>
              </Row>
            </>
          )}
          <p className="mt-2" />
          {woData && detailData.state_id && detailData.state_id[1] === 'On Hold' && detailData.mro_order_id && (
            <>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    On Hold Reason
                  </span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    On Hold Remarks
                  </span>
                </Col>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(woData.pause_reason_id))}</span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(woData.reason)}</span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )}
          {detailData.state_id && detailData.state_id[1] === 'On Hold' && !detailData.mro_order_id && (
            <>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    On Hold Reason
                  </span>
                </Col>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.pause_reason_id))}</span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )}
          {(detailData.state_id) && (detailData.state_id[1] === 'Customer Closed' || detailData.state_id[1] === 'Staff Closed' || detailData.state_id[1] === 'Closed') && (
            <>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Closed on
                  </span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Closed by
                  </span>
                </Col>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.close_time, userInfo, 'datetime'))}</span>
                </Col>
                <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.closed_by_id))}</span>
                </Col>
              </Row>
              <p className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Close Comment
                </span>
              </Row>
              <Row className="m-0">
                {detailData.close_comment && detailData.close_comment !== '' && truncateHTMLTags(detailData.close_comment).length > 0
                  ? <p className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar" dangerouslySetInnerHTML={{ __html: htmlToReact(detailData.close_comment) }} />
                  : '-'}
              </Row>
              <p className="mt-2" />
            </>
          )}
          {isTenantShow && !type && (
            <>
              <Row className="m-0">
                <Col sm="12" md="6" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 light-text">
                    Tenant
                  </span>
                </Col>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.tenant_name)}</span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )}
        </>
      )}
    </>
  );
};

TicketInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setParentTicket: PropTypes.func.isRequired,
  setCurrentTicket: PropTypes.func.isRequired,
  isIncident: PropTypes.bool,
};

TicketInfo.defaultProps = {
  isIncident: false,
};

export default TicketInfo;
