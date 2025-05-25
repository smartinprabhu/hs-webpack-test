import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { logout } from './auth/auth';

const NotFound = () => {
  const dispatch = useDispatch();

  const onHomeClick = () => {
    window.location.href = '/';
    dispatch(logout());
  };

  return (
    <Row className="p-3">
      <Col sm="12" md="4" xs="12" lg="4" />
      <Col sm="12" md="4" xs="12" lg="4">
        <Card className="h-100 text-center">
          <h5 className="ml-3 mb-1 mt-2 font-weight-800 text-pale-sky">Access Denied</h5>
          <hr className="mb-0 mt-0 mr-2 ml-2" />
          <CardBody className="p-0">
            <div className="p-3">
              Your access to this resource is restricted. Please contact your admin/support.
              <hr className="mb-0"/>
              <Button
                className="normal-btn float-right mt-2 mb-2 "
                variant="contained"
                onClick={() => onHomeClick()}
              >
                Close
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="4" xs="12" lg="4" />
    </Row>
  );
};

export default NotFound;
