/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Markup } from 'interweave';
import { Drawer } from 'antd';

import ticketIcon from '@images/icons/ticketBlue.svg';
import DrawerHeader from '@shared/drawerHeader';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
  truncateFrontSlashs,
  truncateStars,
} from '../../../util/appUtils';
import {
  getTicketDetail,
} from '../../../helpdesk/ticketService';
import TicketDetail from '../../../helpdesk/viewTicket/ticketDetail';

const appModels = require('../../../util/appModels').default;

const GeneralInfo = (props) => {
  const {
    detailData, setDetailModal,
  } = props;

  const dispatch = useDispatch();

  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
  }, [userInfo, viewId]);

  const onView = (id) => {
    setViewId(id);
    setDetailModal(false);
    setViewModal(true);
  };

  const onViewReset = () => {
    setViewId(0);
    setViewModal(false);
    setDetailModal(true);
  };

  return (
    <>
      {detailData && (
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Date of Deadline</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date_deadline, userInfo, 'date'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Responsibe</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.user_id, 'name'))}</span>
          </Row>
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Audit</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractNameObject(detailData.audit_id, 'name'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Helpdesk</span>
          </Row>
          {detailData.helpdesk_id && !detailData.helpdesk_id.id && (
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.helpdesk_id, 'ticket_number'))}</span>
            </Row>
          )}
          {detailData.helpdesk_id && detailData.helpdesk_id.id && (
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-info text-capital cursor-pointer" aria-hidden onClick={() => onView(detailData.helpdesk_id.id)}>
                {getDefaultNoValue(extractNameObject(detailData.helpdesk_id, 'ticket_number'))}
              </span>
            </Row>
          )}
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="12" xs="12" lg="12">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Description</span>
          </Row>
          <Row className="m-0">
            <Markup content={truncateFrontSlashs(truncateStars(detailData.description))} />
          </Row>
          <p className="mt-2" />
        </Col>
      </Row>
      )}
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={viewModal}
      >
        <DrawerHeader
          title={ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0)
            ? `${'Ticket'}${' - '}${getDefaultNoValue(ticketDetail.data[0].ticket_number)}` : 'Ticket'}
          imagePath={ticketIcon}
          isEditable={false}
          closeDrawer={() => onViewReset()}
          onEdit={false}
          onPrev={false}
          onNext={false}
        />
        <TicketDetail isIncident={false} setViewModal={setViewModal} />
      </Drawer>
    </>
  );
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailModal: PropTypes.func.isRequired,
};
export default GeneralInfo;
