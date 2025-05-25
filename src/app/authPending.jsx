import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const { userInfo } = useSelector((state) => state.user);

  const onHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <Row className="p-3">
      <Col sm="12" md="4" xs="12" lg="4" />
      <Col sm="12" md="4" xs="12" lg="4">
        <Card className="h-100 text-center">
          <h5 className="ml-3 mb-1 mt-2 font-weight-800 text-pale-sky">User Approval is Pending</h5>
          <hr className="mb-0 mt-0 mr-2 ml-2" />
          <CardBody className="p-0">
            <div className="p-3">
              Welcome
              {' '}
              {userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : ''}
              !
              <br />
              Please wait! while the user access configuration and approval is in progress. For more info, you may contact your facility admin.
              <br />
              Thank you
              <br />
              <span className="font-tiny cursor-pointer advancedUrl" aria-hidden onClick={() => onHomeClick()}>Click here to refresh</span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="4" xs="12" lg="4" />
    </Row>
  );
};

export default NotFound;
