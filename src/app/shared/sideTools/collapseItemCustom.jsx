/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Label, Collapse, Row, Col, Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

const CollapseItemCustom = (props) => {
  const {
    data, title, selectedValues, onCollapse, isOpen, onCheckboxChange,
  } = props;

  const handleCheckboxChange = (event) => {
    onCheckboxChange(event);
  };

  return (
    <>
      <Row className="m-0 checkBoxFilter-title">
        <Col md="8" xs="8" sm="8" lg="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">
            BY
            {'  '}
            {title}
          </p>
        </Col>
        <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => onCollapse()} size="sm" icon={isOpen ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={isOpen} className="filter-checkbox">
        <div>
          {data && data.map((mt) => (
            <span className="mb-1 d-block font-weight-500" key={mt.value}>
              <div className="checkbox">
                <Input
                  type="checkbox"
                  id={`checkboxasaction${mt.value}`}
                  name={mt.label}
                  value={mt.value}
                  checked={selectedValues.some((selectedValue) => selectedValue === mt.value)}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor={`checkboxasaction${mt.value}`}>
                  <span>{mt.label}</span>
                </Label>
                {' '}
              </div>
            </span>
          ))}
        </div>
      </Collapse>
      <hr className="mt-2" />
    </>
  );
};

CollapseItemCustom.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedValues: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onCollapse: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

export default CollapseItemCustom;
