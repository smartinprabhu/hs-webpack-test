/* eslint-disable new-cap */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import ticketIcon from '@images/icons/ticketBlue.svg';
import DetailViewFormat from '@shared/detailViewFormat';
import {
  truncate,
} from '../../../util/appUtils';

const BasicHeader = (props) => {
  const { detail } = props;
  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <>
      <Card className="border-0 h-100">
        {detailData && (
        <CardBody data-testid="success-case" className="pb-1 pt-1 pl-2 pr-2">
          <Row>
            <Col sm="12" md="5" lg="5" xs="12" className="card-mb-3">
              <h4 className="mb-0 ml-1">
                <img src={ticketIcon} alt="ticket" width="15" height="15" className="w-auto ml-2 mr-2" />
                {truncate(detailData.name, 30)}
              </h4>
              <div className="ml-4 pl-3">
                <span
                  className="mr-2 font-weight-500 font-tiny"
                >
                  {detailData.pantry_sequence}
                </span>
              </div>
            </Col>
            <Col sm="12" md="7" lg="7" xs="12">
              <span className="float-right" />
            </Col>
          </Row>
        </CardBody>
        )}
        <DetailViewFormat detailResponse={detail} />
      </Card>
    </>
  );
};

BasicHeader.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default BasicHeader;
