import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

// import TeamDetailInfo from './detailInfo';
import TeamDetailTabs from './teamDetailTabs';
import DetailHeader from './detailHeader';

const TeamDetail = ({closeEditModalWindow, onAddReset}) => {
  const { teamDetail } = useSelector((state) => state.setup);

  return (
    <Row className="bg-lightblue">
      <Col sm="12" md="12" lg="12" xs="12" className="px-2 thin-scrollbar">
        <DetailHeader closeEditModalWindow={closeEditModalWindow} onAddReset={onAddReset}/>
        {/* <TeamDetailInfo detail={teamDetail} /> */}
        {/* <TeamDetailTabs detail={teamDetail} /> */}
      </Col>
    </Row>
  );
};

export default TeamDetail;
