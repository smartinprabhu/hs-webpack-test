/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  CardBody,
} from 'reactstrap';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import { generateErrorMessage } from '../util/appUtils';

const DetailViewFormat = (props) => {
  const {
    detailResponse,
  } = props;

  return (
    <>
      {detailResponse && detailResponse.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(detailResponse && detailResponse.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(detailResponse)} />
      </CardBody>
      )}
    </>
  );
};

DetailViewFormat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  detailResponse: PropTypes.any.isRequired,
};

export default DetailViewFormat;
