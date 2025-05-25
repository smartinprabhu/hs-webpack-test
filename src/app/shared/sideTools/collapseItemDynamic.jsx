/* eslint-disable react/forbid-prop-types */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Label, Collapse, Row, Col, Input, FormGroup,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
  truncate,
} from '../../util/appUtils';

const CollapseItemDynamic = (props) => {
  const {
    data, dataGroup, title, selectedValues, onCollapse, isOpen, onCheckboxChange, placeholder, onSearchChange, filtervalue, filterBy,
  } = props;
  const response = data;

  const handleCheckboxChange = (event) => {
    onCheckboxChange(event);
  };

  const onInputSearchChange = (event) => {
    onSearchChange(event);
  };
  const { userInfo } = useSelector((state) => state.user);
  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (response && response.err) ? generateErrorMessage(response) : userErrorMsg;

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
      <Collapse isOpen={isOpen} className="filter-checkbox ">
        {(response && response.data && response.data.length > 10) && (
        <FormGroup className="mt-2 mb-2">
          <Input type="input" name="dynamicSearchValue" placeholder={placeholder} onChange={onInputSearchChange} id="dynamicSearchValue" className="border-radius-50px" />
        </FormGroup>
        )}
        <div className="pl-1">
          {((response && response.loading) || isUserLoading) && (
          <Loader />
          )}
          {dataGroup && dataGroup.map((filterItem, index) => (
            filterItem[filtervalue] && (
            <span className="mb-1 d-block font-weight-500" key={filterItem[filtervalue]}>
              <div className="checkbox">
                <Input
                  type="checkbox"
                  id={`checkboxcitemaction${filterItem[filtervalue][0]}${index}`}
                  value={filterBy && filterBy === 'name' ? filterItem[filtervalue][1] : filterItem[filtervalue][0]}
                  name={filterItem[filtervalue][1]}
                  checked={filterBy && filterBy === 'name'
                    ? selectedValues.some((selectedValue) => (selectedValue) === (filterItem[filtervalue][1]))
                    : selectedValues.some((selectedValue) => parseInt(selectedValue) === parseInt(filterItem[filtervalue][0]))}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor={`checkboxcitemaction${filterItem[filtervalue][0]}${index}`}>
                  <Tooltip title={filterItem[filtervalue][1]} placement="top">
                    <span>{truncate(filterItem[filtervalue][1], 27)}</span>
                  </Tooltip>
                </Label>
                {' '}
              </div>
            </span>
            )
          ))}
          {((response && response.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
          )}
        </div>
      </Collapse>
      <hr className="mt-2" />
    </>
  );
};

CollapseItemDynamic.defaultProps = {
  filterBy: false,
};

CollapseItemDynamic.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  dataGroup: PropTypes.array.isRequired,
  selectedValues: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  filtervalue: PropTypes.string.isRequired,
  filterBy: PropTypes.string,
  onCollapse: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default CollapseItemDynamic;
