/* eslint-disable react/forbid-prop-types */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Label, Input, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
  truncate,
} from '../../util/appUtils';

const dynamicCheckboxFilter = (props) => {
  const {
    data, dataGroup, setDataGroup, selectedValues, onCheckboxChange, filtervalue, filterBy, toggleClose, target, openPopover, title, keyword
  } = props;
  const response = data;

  const handleCheckboxChange = (event) => {
    onCheckboxChange(event);
  };

  useEffect(() => {
    if (openPopover && keyword && keyword.length > 1) {
      const ndata = response.data && response.data.length && response.data.filter((item) => {
        const searchValue = item[filtervalue] ? item[filtervalue][1].toString().toUpperCase() : '';
        const s = keyword.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setDataGroup(ndata);
    } else {
      setDataGroup(response && response.data ? response.data : []);
    }
  }, [openPopover, keyword,response])
  
  const { userInfo } = useSelector((state) => state.user);
  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (response && response.err) ? generateErrorMessage(response) : userErrorMsg;
  return (
    <>
      <div className="pl-1">
        <Popover className="Add-Columns" trigger="legacy" target={target} toggle={toggleClose} placement="bottom" isOpen={openPopover}>
          <PopoverHeader>
            {title}
            <img
              aria-hidden="true"
              alt="close"
              src={closeCircleIcon}
              onClick={toggleClose}
              className="cursor-pointer mr-1 mt-1 float-right"
            />
          </PopoverHeader>
          <PopoverBody>
            <div className="thin-scrollbar filter-popover">
              {((response && response.loading) || isUserLoading) && (
                <Loader />
              )}
              {response && !response.loading && dataGroup && dataGroup.length ? dataGroup.map((filterItem, index) => (
                filterItem[filtervalue] && (
                  <span className="mb-1 d-block font-weight-500" key={filterItem[filtervalue]}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxcitemaction${filterItem[filtervalue][0]}${index}`}
                        value={filterBy && filterBy === 'name' ? filterItem[filtervalue][1] : filtervalue === 'type_of_visitor' ? filterItem.type_of_visitor : filterItem[filtervalue][0]}
                        name={filtervalue === 'type_of_visitor' ? filterItem.type_of_visitor : filterItem[filtervalue][1]}
                        checked={selectedValues.some((selectedValue) => parseInt(selectedValue) === parseInt(filterItem[filtervalue][0])) || selectedValues.some((selectedValue) => (selectedValue) === (filterItem[filtervalue][1])) || selectedValues.some((selectedValue) => (selectedValue) === (filterItem[filtervalue][0])) || selectedValues.some((selectedValue) => (selectedValue) === (filterItem.type_of_visitor))}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor={`checkboxcitemaction${filterItem[filtervalue][0]}${index}`}>
                        <Tooltip title={filterItem[filtervalue][1]} placement="top">
                          {filtervalue === 'type_of_visitor' ? <span>{filterItem.type_of_visitor}</span> : <span>{truncate(filterItem[filtervalue][1], 27)}</span>}
                        </Tooltip>
                      </Label>
                      {' '}
                    </div>
                  </span>
                )
              )) :''}
              {((response && response.err) || isUserError) && (
                <ErrorContent errorTxt={errorMsg} />
              )}
            </div>
          </PopoverBody>
        </Popover>
      </div>
    </>
  );
};

dynamicCheckboxFilter.defaultProps = {
  filterBy: false,
};

dynamicCheckboxFilter.propTypes = {
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

export default dynamicCheckboxFilter;
