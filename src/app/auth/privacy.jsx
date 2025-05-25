/* eslint-disable max-len */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Card,
  CardBody,
  Row,
} from 'reactstrap';
import React from 'react';
import DOMPurify from 'dompurify';

import policyJson from './policy.json';
import appConfig from '../config/appConfig';

const ViewPrivacy = () => (

  <Card className="border-0 text-line-height-1">
    <CardBody className="text-justify pt-0">
      <Row dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policyJson[appConfig.CLIENTNAME], { USE_PROFILES: { html: true } }) }} />
    </CardBody>
  </Card>
);

export default ViewPrivacy;
