import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import DetailInfo from './detailInfo';

const InventoryReportDetail = () => {
  const { invReportDetails } = useSelector((state) => state.inventory);

  return (
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
        <DetailInfo detail={invReportDetails} />
      </Col>
    </Row>
  );
};

export default InventoryReportDetail;
