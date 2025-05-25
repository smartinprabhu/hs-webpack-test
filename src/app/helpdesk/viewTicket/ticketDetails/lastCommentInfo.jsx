/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Markup } from 'interweave';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
  truncateFrontSlashs,
  truncateStars,
} from '../../../util/appUtils';
import { setTicketCurrentTab } from '../../ticketService';

const LastCommentInfo = (props) => {
  const {
    detailData,
  } = props;

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const onLoadNotes = () => {
    dispatch(setTicketCurrentTab('Notes'));
  };

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Last Comment
          </span>
        </Row>
          {!detailData.log_note && (
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.log_note)}</span>
          </Row>
          )}
        {detailData.log_note && (
        <Row className="m-0 cursor-pointer">
          <span aria-hidden className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar" onClick={() => onLoadNotes()}>
            <Markup content={truncateFrontSlashs(truncateStars(detailData.log_note))} />
          </span>
        </Row>
        )}
        <p className="mt-2" />
        {(detailData.log_note) && (detailData.log_note_date || detailData.last_commented_by) && (
          <>
            <Row className="m-0">
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 light-text">
                  Last Commented on
                </span>
              </Col>
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 light-text">
                  Last Commented by
                </span>
              </Col>
            </Row>
            <Row className="m-0">
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.log_note_date, userInfo, 'datetime'))}</span>
              </Col>
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.last_commented_by)}</span>
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

LastCommentInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default LastCommentInfo;
