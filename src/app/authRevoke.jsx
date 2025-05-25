import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { logout } from './auth/auth';

const AuthRevoke = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(logout());
    }, 5000);
  }, [])

  return (
    <Row className="p-3">
      <Col sm="12" md="4" xs="12" lg="4" />
      <Col sm="12" md="4" xs="12" lg="4">
        <Card className="h-100 text-center">
          <h5 className="ml-3 mb-1 mt-2 font-weight-800 text-pale-sky">
            Access request is Revoked
          </h5>
          <hr className="mb-0 mt-0 mr-2 ml-2" />
          <CardBody className="p-0">
            <div className="p-3">
              Your access request to the application has been revoked. For more info, you may contact your facility admin.
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
export default AuthRevoke