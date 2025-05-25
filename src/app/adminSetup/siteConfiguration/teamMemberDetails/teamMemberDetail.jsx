import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import TeamDetailInfo from './detailInfo';
import TeamDetailTabs from './detailTabs';

const TeamMemberDetail = () => {
  const { userDetails } = useSelector((state) => state.setup);

  return (
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 audits-list thin-scrollbar">
        <TeamDetailInfo detail={userDetails} />
        <TeamDetailTabs detail={userDetails} />
      </Col>
    </Row>
  );
};

export default TeamMemberDetail;
