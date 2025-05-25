import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import PurchaseAgreementDetailInfo from './detailInfo';
import PurchaseAgreementDetailTabs from './detailTabs';

const PurchaseAgreementDetail = () => {
  const { purchaseAgreementDetails } = useSelector((state) => state.purchase);

  return (
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
        <PurchaseAgreementDetailInfo detail={purchaseAgreementDetails} />
        <PurchaseAgreementDetailTabs detail={purchaseAgreementDetails} />
      </Col>
    </Row>
  );
};

export default PurchaseAgreementDetail;
