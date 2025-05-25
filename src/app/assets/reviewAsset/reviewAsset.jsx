import React from 'react';
import { useFormikContext } from 'formik';
import {
  Row,
} from 'reactstrap';

import BasicDetails from './basicDetails';
import WarrantyDetails from './warrantyDetails';
import AdditionalDetails from './additionalDetails';

export default function ReviewAsset() {
  const { values: formValues } = useFormikContext();
  return (
    <>
      <h5 className="mb-3">
        Summary
      </h5>
      <Row>
        <BasicDetails formValues={formValues} />
        <WarrantyDetails formValues={formValues} />
        <AdditionalDetails formValues={formValues} />
      </Row>
    </>
  );
}
