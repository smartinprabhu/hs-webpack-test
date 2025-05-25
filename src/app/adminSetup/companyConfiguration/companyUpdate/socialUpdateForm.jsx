/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import { InputField } from '@shared/formFields';
import formFields from './formFields.json';

const SocialUpdateForm = () => (

  <>
    <Card className="no-border-radius mb-2">
      <CardBody className="p-0 bg-porcelain">
        <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Social Media</p>
      </CardBody>
    </Card>
    <Row className="p-1">
      {formFields && formFields.socialFields && formFields.socialFields.map((fields) => (
        <React.Fragment key={fields.id}>
          <Col sm="6" md="6" xs="12" lg="6">
            <InputField
              name={fields.name}
              label={fields.label}
              type={fields.type}
              formGroupClassName="m-1"
              readOnly={fields.readonly}
              maxLength="30"
            />
          </Col>
        </React.Fragment>
      ))}
    </Row>
  </>
);
export default SocialUpdateForm;
