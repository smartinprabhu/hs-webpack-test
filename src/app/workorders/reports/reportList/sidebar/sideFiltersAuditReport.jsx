/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Col, FormGroup, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import {
  getEvaluationReport,
} from '../../../workorderService';
import {
  getAllowedCompanies, getYearList, getCompanyTimezoneDate, addZeroMonth,
} from '../../../../util/appUtils';
import {
  getSelectedReportDate,
} from '../../../../preventiveMaintenance/ppmService';
import monthData from '../../../data/month.json';

const SideFiltersAuditReport = () => {
  const dispatch = useDispatch();

  const defaultYear = new Date().getFullYear();
  const defaultMonth = new Date().getMonth();
  const [year, setYear] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [open, setOpen] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [yearValue, setYearValue] = useState(defaultYear);
  const [monthValue, setMonthValue] = useState(defaultMonth);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    const yearList = getYearList();
    if (userInfo && userInfo.data && yearList) {
      setYear(yearList.map((mt) => ({
        ...mt, value: mt, label: mt.toString(),
      })));
    }
  }, [userInfo]);

  const monthSelected = monthValue && monthValue.value ? monthValue.value : monthValue;
  const yearSelected = yearValue && yearValue.value ? yearValue.value : yearValue;

  useEffect(() => {
    if (userInfo && userInfo.data && yearValue !== '' && monthValue !== '') {
      const values = { company_id: companies, month: monthSelected, year: yearSelected };
      const dateByMonthYear = `${yearSelected}-${addZeroMonth(monthSelected)}-01`;
      const companyTimezoneDate = getCompanyTimezoneDate(dateByMonthYear, userInfo, 'monthyear');
      dispatch(getSelectedReportDate(companyTimezoneDate));
      dispatch(getEvaluationReport(values));
    }
  }, [userInfo, yearValue, monthValue]);

  const getMonthByValue = (e) => {
    const columnArray = monthData && monthData.month.filter((ar) => ar.value === e.toString());
    const monthName = columnArray && columnArray.length > 0 ? columnArray[0].label : '';
    return monthName;
  };

  return (
    <>
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY MONTH</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <br />
      <Collapse isOpen={statusCollapse}>
        <div>
          <FormGroup>
            <Autocomplete
              name="year"
              size="small"
              open={openYear}
              onOpen={() => {
                setOpenYear(true);
              }}
              onClose={() => {
                setOpenYear(false);
              }}
              onChange={(event, newValue) => {
                setYearValue(newValue);
              }}
              defaultValue={yearValue ? yearValue.toString() : ''}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={year}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Autocomplete
              name="month"
              size="small"
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              onChange={(event, newValue) => {
                setMonthValue(newValue);
              }}
              defaultValue={monthValue ? getMonthByValue(monthValue) : ''}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={monthData.month}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
    </>
  );
};

export default SideFiltersAuditReport;
