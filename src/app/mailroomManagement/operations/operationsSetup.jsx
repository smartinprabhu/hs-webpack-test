/* eslint-disable import/no-unresolved */
import React from 'react';

import Navbar from '../navbar/navbar';
import OperationsSegments from './operationsSegments';

const OperationsSetup = () => {
  const subMenu = 'Operations';

  return (
    
    /* <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border mailRoomManagement-overview">
      <Col sm="12" md="12" lg="12">
        <Row className="p-0">
          <Col sm="12" md="12" lg="12" className="p-0"> */
            <OperationsSegments />
         /*  </Col>
        </Row>
      </Col>
    </Row> */

  );
};

export default OperationsSetup;
