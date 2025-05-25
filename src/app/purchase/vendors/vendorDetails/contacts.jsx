/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getVendorContacts } from '../../purchaseService';
import {
  getDefaultNoValue,
  generateErrorMessage,
  generateTag,
} from '../../../util/appUtils';
import '../../../helpdesk/viewTicket/style.scss';

const appModels = require('../../../util/appModels').default;

const Contacts = (props) => {
  const { ids } = props;
  const dispatch = useDispatch();

  const { vendorContacts } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (ids) {
      dispatch(getVendorContacts(ids, appModels.PARTNER));
    }
  }, [ids]);

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(vendorContacts && vendorContacts.data) && vendorContacts.data.map((log) => (
            <div key={log.id} className="mb-1 mt-0 user-info-div">
              <div className="user-info-circle">
                <span className="font-weight-800 user-info-label">{generateTag(log.name, 2)}</span>
              </div>
              <div className="user-info-text">
                <h5>{log.name}</h5>
                <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getDefaultNoValue(log.mobile)}</p>
                <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getDefaultNoValue(log.email)}</p>
              </div>
            </div>
          ))}
          {vendorContacts && vendorContacts.loading && (
          <Loader />
          )}
          {(vendorContacts && vendorContacts.err) && (
          <ErrorContent errorTxt={generateErrorMessage(vendorContacts)} />
          )}
        </Col>
      </Row>

    </>
  );
};

Contacts.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default Contacts;
