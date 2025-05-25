/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';

import {
  Popover, PopoverHeader, PopoverBody, Input, Label,
} from 'reactstrap';
import columnsMiniIcon from '@images/icons/columnsMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import { setInitialValues } from '../../purchase/purchaseService';

const Columns = (props) => {
  const {
    columns, handleColumnChange, columnFields, idNameFilter, classNameFilter,
  } = props;

  const dispatch = useDispatch();
  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const onClickColumnCheckbox = (event) => {
    handleColumnChange(event);
  };

  return (
    <>
      <Tooltip title="Add Colums" placement="top">
        <img
          aria-hidden="true"
          id={idNameFilter || 'Columns'}
          alt="Columns"
          className="cursor-pointer mr-2"
          src={columnsMiniIcon}
          onClick={() => dispatch(setInitialValues(false, false, true, false))}
        />
      </Tooltip>
      <Popover placement="bottom" isOpen={filterInitailValues.columns} target={idNameFilter || 'Columns'} className={classNameFilter || 'additional-fields popoverSearch'}>
        <PopoverHeader>
          Additional Fields
          <img
            src={closeCircleIcon}
            className="cursor-pointer mr-1 mt-1 float-right"
            onClick={() => dispatch(setInitialValues(false, false, false, false))}
            alt="close"
            aria-hidden="true"
          />
        </PopoverHeader>
        <PopoverBody className="p-0 additional-field-list thin-scrollbar">
          <div>
            {columns && columns.length > 0 && columns.map((tc) => (
              <React.Fragment key={tc.value}>
                <div className="p-3">
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${tc.value}`}
                      value={tc.value}
                      name={tc.label}
                      checked={columnFields.some((selectedValue) => selectedValue === tc.value)}
                      onChange={onClickColumnCheckbox}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${tc.value}`}><span className="ml-2 collapse-heading">{tc.label}</span></Label>
                  </div>
                </div>
                <hr className="mb-0 mt-0" />
              </React.Fragment>
            ))}
          </div>
        </PopoverBody>
      </Popover>
    </>
  );
};

Columns.defaultProps = {
  idNameFilter: false,
  classNameFilter: false,
};

Columns.propTypes = {
  columns: PropTypes.array.isRequired,
  handleColumnChange: PropTypes.func.isRequired,
  columnFields: PropTypes.array.isRequired,
  idNameFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  classNameFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default Columns;
