import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import PurchaseRequestInfo from './detailInfo';
import PurchaseRequestTabs from './detailTabs';

const PurchaseRequestDetail = () => {
  const { requestDetails } = useSelector((state) => state.purchase);
  return (
    <>
      <Row className="m-0 bg-lightblue">
        <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
          <PurchaseRequestInfo detail={requestDetails} />
          <PurchaseRequestTabs detail={requestDetails} />
        </Col>
      </Row>
    </>
  );
};
export default PurchaseRequestDetail;
