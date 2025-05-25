/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  CardTitle, UncontrolledTooltip, Row, Col,
} from 'reactstrap';

import collapseIcon from '@images/collapse.png';

const CardTitleCustom = (props) => {
  const {
    filtersIcon, onCollapse,
  } = props;

  return (
    <>
      <CardTitle className="mt-2 ml-2 mb-1 mr-2">
        <Row lg="12" sm="12" md="12">
          <Col lg="10" sm="10" md="10" className="mr-0">
            <h4>
              Filters
            </h4>
          </Col>
          {filtersIcon && (
          <Col lg="2" sm="2" md="2" className="mt-1">
            <img
              src={collapseIcon}
              height="25px"
              aria-hidden="true"
              width="25px"
              alt="Collapse"
              onClick={() => onCollapse()}
              className="cursor-pointer collapse-margin-left-align"
              id="collapse"
            />
            <UncontrolledTooltip target="collapse" placement="right">
              Collapse
            </UncontrolledTooltip>
          </Col>
          )}
        </Row>
      </CardTitle>
      <hr className="m-0 border-color-grey ml-2px" />
    </>
  );
};

CardTitleCustom.propTypes = {
  filtersIcon: PropTypes.bool.isRequired,
  onCollapse: PropTypes.func.isRequired,
};

export default CardTitleCustom;
