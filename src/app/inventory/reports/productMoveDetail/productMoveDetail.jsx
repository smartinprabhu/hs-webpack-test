import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import ProductMoveDetailInfo from './detailInfo';

const ProductMoveDetail = () => {
  const { pmDetails } = useSelector((state) => state.inventory);

  return (
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
        <ProductMoveDetailInfo detail={pmDetails} />
      </Col>
    </Row>
  );
};

export default ProductMoveDetail;
