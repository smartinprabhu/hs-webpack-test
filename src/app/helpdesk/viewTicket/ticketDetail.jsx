import React from 'react';
import * as PropTypes from 'prop-types';

import BasicInfo from './basicInfo';
import TicketsSegments from './ticketsSegments';

const TicketDetail = (props) => {
  const {
    isIncident, isFITTracker, setViewModal, setParentTicket, setCurrentTicket, type
  } = props;
  return (
    <>
      <BasicInfo isIncident={isIncident} isFITTracker={isFITTracker} setViewModal={setViewModal} type={type} />
      <TicketsSegments isIncident={isIncident} setParentTicket={setParentTicket} setCurrentTicket={setCurrentTicket} type={type} />
    </>
  );
};
TicketDetail.propTypes = {
  isIncident: PropTypes.bool,
  setViewModal: PropTypes.func.isRequired,
  setParentTicket: PropTypes.func.isRequired,
  setCurrentTicket: PropTypes.func.isRequired,
};
TicketDetail.defaultProps = {
  isIncident: false,
};

export default TicketDetail;
