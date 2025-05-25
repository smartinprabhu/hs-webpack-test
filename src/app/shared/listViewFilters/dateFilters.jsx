/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Tooltip } from 'antd';
import moment from 'moment-timezone';

import {
  Popover, PopoverHeader, PopoverBody, Row, Col, Input,
} from 'reactstrap';

import calendarMiniIcon from '@images/icons/calendarMini.svg';
import filtersFields from '@shared/data/filtersFields.json';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import { setInitialValues } from '../../purchase/purchaseService';
import '../../purchase/rfq/rfqDetails/receiveProducts/style.scss';
import {storeDateFilters} from '../../visitorManagement/visitorManagementService'

const { RangePicker } = DatePicker;

const ListDateFilters = (props) => {
  const {
    dateFilters, handleCustomFilterClose,  onClickRadioButton, customFilters, onChangeCustomDate, idNameFilter, classNameFilter,handleCustomDateChange, customVariable, setCustomVariable,
  } = props;
  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [datefilterList, setDatefilterList] = useState([]);

  const dispatch = useDispatch();
  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const { customDateFilters } = useSelector((state)=>state.visitorManagement)

  useEffect(() => {
    if(customDateFilters && customDateFilters.length && customDateFilters[0] !== null ) {
      setSelectedDate(customDateFilters);
    }
  }, [customDateFilters]);

  const handleRadioboxChange = (event) => {
    setDatefilterList([]);
    const { value } = event.target;
    if (value === 'Custom') {
      const filters = [{
        key: value, value, label: value, type: 'date',
      }];
      setDatefilterList(filters);
      setSelectedDate([null, null]);
    } else {
      setDatefilterList([]);
      onClickRadioButton(event);
      dispatch(setInitialValues(false, false, false, false));
    }
  };

  useEffect(() => {
    setDatefilterList([]);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const start = `${moment(selectedDate[0]).utc().format('YYYY-MM-DD')}`;
        const end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')}`;
        onChangeCustomDate(start, end);
        dispatch(setInitialValues(false, false, false, false));
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      setCustomVariable(selectedDate);
    } else {
      setCustomVariable(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (customFilters) {
      {
        customFilters && customFilters.length ? customFilters.map((cf) => {
          if (cf.type === 'customdate' && !(customVariable)) {
            handleCustomFilterClose(cf.value, cf);
          }
        }) : ''
      }
    }
  }, [customFilters, customVariable]);

  const onDateRangeChange = (dates) => {
    setSelectedDate(dates);
    dispatch(storeDateFilters([null,null]))
  };
  
  const datefilterNew = datefilterList && datefilterList.length > 0 ? datefilterList : dateFilters;

  return (
    <>
      <Tooltip title="Date Filters" placement="top">
        <img
          aria-hidden="true"
          id={idNameFilter || 'DateFilters'}
          alt="DateFilters"
          onClick={() => { dispatch(setInitialValues(true, false, false, false)); setDatefilterList([]); }}
          className="cursor-pointer mr-2"
          src={calendarMiniIcon}
        />
      </Tooltip>
      <Popover placement="bottom" isOpen={filterInitailValues.filter} target={idNameFilter || 'DateFilters'} className={classNameFilter || 'popoverDate'}>
        <PopoverHeader>
          Date Filters
          <img
            aria-hidden="true"
            src={closeCircleIcon}
            className="cursor-pointer mr-1 mt-1 float-right"
            alt="close"
            onClick={() => { setDatefilterList([]); dispatch(setInitialValues(false, false, false, false)); }}
          />
        </PopoverHeader>
        <PopoverBody>
          <Row>
            <Col md="12" sm="12" lg="12">
              <div className="p-3 ml-2">
                {filtersFields && filtersFields.dateFilters.map((df) => (
                  <div className="mb-2 font-weight-800" key={df.label}>
                    <Input
                      type="radio"
                      value={df.label}
                      name="datefilter"
                      className="mt-3px"
                      checked={datefilterNew.some((selectedValue) => selectedValue.label === df.label)}
                      onChange={handleRadioboxChange}
                    />
                    {df.label === 'Custom' && datefilterNew.some((selectedValue) => selectedValue.label === 'Custom') ? (
                      <>
                        <span className="mb-3">{df.label}</span>
                        <br />
                        <RangePicker
                          onChange={onDateRangeChange}
                          value={selectedDate}
                          format="DD-MM-y"
                          size="small"
                          allowClear={true}
                          className="mt-1 mx-wd-210"
                        />
                      </>
                    ) : <span>{df.label}</span>}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </PopoverBody>
      </Popover>
    </>
  );
};

ListDateFilters.defaultProps = {
  idNameFilter: false,
  classNameFilter: false,
  customVariable: false,
  customFilters: [],
  setCustomVariable: () => { },
};

ListDateFilters.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dateFilters: PropTypes.array.isRequired,
  customFilters: PropTypes.array,
  onClickRadioButton: PropTypes.func.isRequired,
  handleCustomFilterClose: PropTypes.func.isRequired,
  onChangeCustomDate: PropTypes.func.isRequired,
  handleCustomDateChange: PropTypes.func.isRequired,
  classNameFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  customVariable: PropTypes.func,
};

export default ListDateFilters;
