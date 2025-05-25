import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Card, CardBody,
} from 'reactstrap';

const reportSelect = ({ collapse }) => (
  <Card className={'border-0 p-1 bg-lightblue h-100'}>
    <CardBody className="p-1 bg-color-white m-0">
      <div className={collapse ? 'text-center justify-content-center font-17 mt-25p mb-25p max-height-75' : 'text-center justify-content-center font-17 mt-25p'}>
        Please select a Report.
      </div>
    </CardBody>
  </Card>
);

reportSelect.propTypes = {
  collapse: PropTypes.bool,
};
reportSelect.defaultProps = {
  collapse: false,
};

export default reportSelect;
