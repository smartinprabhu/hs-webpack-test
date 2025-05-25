import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import DetailHeader from './detailHeader';

const TeamDetail = ({ onAddReset, closeEditModal, isAdminSetup }) => {
  const { userDetails } = useSelector((state) => state.setup);

  return (
    <Row className="bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="px-2 thin-scrollbar">
        <DetailHeader onAddReset={onAddReset} closeEditModal={closeEditModal} isAdminSetup={isAdminSetup}/>
        {/* <TeamMemberDetailTabs detail={userDetails} /> */}
      </Col>
    </Row>
  );
};

export default TeamDetail;
