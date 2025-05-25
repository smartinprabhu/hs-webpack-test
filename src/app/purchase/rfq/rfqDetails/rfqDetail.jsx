import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import RfqDetailInfo from './detailInfo';
import RfqDetailTabs from './detailTabs';

const RfqDetail = (props) => {
  const { isEdit, afterReset, isPurchaseOrder } = props;
  const { quotationDetails } = useSelector((state) => state.purchase);

  const reload = () => {
    if (afterReset) afterReset();
  };
  return (
    <>
      <Row className="m-0 bg-lightblue">
        <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
          <RfqDetailInfo detail={quotationDetails} isEdit={isEdit} afterReset={() => reload()} isPurchaseOrder={isPurchaseOrder} />
          <RfqDetailTabs detail={quotationDetails} />
        </Col>
      </Row>
    </>
  );
};

RfqDetail.defaultProps = {
  isPurchaseOrder: false,
};

RfqDetail.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterReset: PropTypes.func.isRequired,
  isPurchaseOrder: PropTypes.bool,
};

export default RfqDetail;
