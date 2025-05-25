import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import VendorDetailInfo from './detailInfo';
import VendorDetailTabs from './detailTabs';

const VendorDetail = () => {
  const { vendorDetails } = useSelector((state) => state.purchase);

  return (
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
        <VendorDetailInfo detail={vendorDetails} />
        <VendorDetailTabs detail={vendorDetails} />
      </Col>
    </Row>
  );
};

export default VendorDetail;
