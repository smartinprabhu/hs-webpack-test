/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Col, Row,
  Button,
  CardHeader,
  Collapse,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  faAngleDown, faAngleUp, faUser, faToolbox,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getCompanyTimezoneDate,
  getGroupWithCountForObj,
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
  resetEmployeeChecklists,
} from '../../ppmService';
import './sidebar/stickyTable.css';

const reportEmployees = React.memo((props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();

  const [icon, setIcon] = useState(faAngleDown);
  const [accordion, setAccordian] = useState([]);
  const [accordion1, setAccordian1] = useState([]);
  const [employee, setEmployee] = useState(false);
  const [icon1, setIcon1] = useState(faAngleDown);
  const [team, setTeam] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    typeId,
    employeeChecklists,
  } = useSelector((state) => state.ppm);

  const getinitial = () => {
    if ((employeeChecklists && employeeChecklists.data && employeeChecklists.data.length > 0)) {
      const assets = getGroupWithCountForObj(employeeChecklists && employeeChecklists.data ? employeeChecklists.data : [], 'employee_id');
      const accordn = [];
      for (let i = 0; i < assets.length; i += 1) {
        // If first collapse want to open default then add true
        accordn.push(false);
      }
      setAccordian(accordn);
    }
  };

  const getinitial1 = (employeeId) => {
    if ((employeeChecklists && employeeChecklists.data && employeeChecklists.data.length > 0)) {
      const assets = getGroupWithCountForObj(employeeChecklists && employeeChecklists.data
        ? employeeChecklists.data.filter((item) => item.employee_id && item.employee_id.id && item.employee_id.id === employeeId) : [], 'maintenance_team_id');
      const accordn = [];
      for (let i = 0; i < assets.length; i += 1) {
        accordn.push(false);
      }
    }
    setAccordian1(accordn);
  }

  function getTeamData() {
    let res = [];
    if (employee) {
      res = getGroupWithCountForObj(employeeChecklists && employeeChecklists.data
        ? employeeChecklists.data.filter((item) => item.employee_id && item.employee_id.id && item.employee_id.id === employee) : [], 'maintenance_team_id');
    }
    return res;
  }

  useEffect(() => {
    if ((employeeChecklists && employeeChecklists.data && employeeChecklists.data.length > 0)) {
      getinitial();
    }
  }, [employeeChecklists]);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetCreateChecklistReport());
    dispatch(resetPurchaseState());
    dispatch(resetDetailChecklistReport());
    dispatch(resetChecklistReport());
    dispatch(resetEmployeeChecklists());
    dispatch(resetPrint());
    if (afterReset) afterReset();
  };

  const loading = (userInfo && userInfo.loading) || (employeeChecklists && employeeChecklists.loading);

  let errorText = <div />;
  if ((!loading)
    && ((employeeChecklists && employeeChecklists.err) || (employeeChecklists && employeeChecklists.data && !employeeChecklists.data.length))) {
    errorText = '';
  } else if ((!loading) && typeId && ((typeId && !typeId.date) || typeId.date === null)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />
    );
  }

  const toggleAccordion = (tab, empValue) => {
    setEmployee(empValue && empValue.id ? empValue.id : false);
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon(faAngleDown);
      } else {
        setIcon(faAngleUp);
      }
    }
    getinitial1(empValue && empValue.id ? empValue.id : false);
    setAccordian(state);
  };

  const toggleAccordion1 = (tab, teamValue) => {
    setTeam(teamValue && teamValue.id ? teamValue.id : false);
    const prevState = accordion1;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon1(faAngleDown);
      } else {
        setIcon1(faAngleUp);
      }
    }
    setAccordian1(state);
  };

  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = employeeChecklists && employeeChecklists.data && employeeChecklists.data.length ? employeeChecklists.data : false;

  const isErr = !loading && employeeChecklists && employeeChecklists.data && !employeeChecklists.data.length;

  return (
    <>
      <Card className={collapse ? 'filter-margin-right p-1 bg-lightblue h-100' : 'p-1 bg-lightblue h-100'}>
        <CardBody className="p-1 bg-color-white m-0">
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              <div className="content-inline">
                <span className="p-0 mr-2 font-medium">
                  <>
                    <span onClick={() => redirectToAllReports()} aria-hidden="true" className="cursor-pointer font-weight-800">
                      All Reports
                      {' '}
                      /
                      {' '}
                    </span>
                    <span className="font-weight-500">
                      {reportName}
                      {' '}
                    </span>
                    {selectedReportDate && (
                      <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                        Report Date :
                        {' '}
                        {selectedReportDate}
                      </span>
                    )}
                  </>
                </span>
              </div>
            </Col>
          </Row>
          {typeId && typeId.date && typeId.date.length > 0 && !loading && (isData) && getGroupWithCountForObj(isData, 'employee_id').map((md, index) => (
            <div
              id="accordion"
              className="accordion-wrapper mb-3 border-0"
              key={md.id}
            >
              <Card className="border-0">
                <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
                  <Button
                    block
                    color="text-dark"
                    id={`heading${index}`}
                    className="text-left m-0 p-0 border-0 box-shadow-none"
                    onClick={() => toggleAccordion(index, md.employee_id)}
                    aria-expanded={accordion[index]}
                    aria-controls={`collapse${index}`}
                  >
                    <FontAwesomeIcon className="mr-3 ml-2 font-weight-800" size="lg" icon={faUser} />
                    <span className="collapse-heading font-weight-800">
                      {md.employee_id && md.employee_id.name ? md.employee_id.name : ''}
                      {' '}
                    </span>
                    {accordion[index]
                      ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                      : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
                    <span className="float-right mr-3 font-weight-700">
                      {md.count}
                    </span>
                  </Button>
                </CardHeader>

                <Collapse
                  isOpen={accordion[index]}
                  data-parent="#accordion"
                  id={`collapse${index}`}
                  className="border-0 comments-list thin-scrollbar"
                  aria-labelledby={`heading${index}`}
                >
                  {(isData) && getTeamData().map((tm, index1) => (
                    <Card className="border-0 ml-3 mt-3">
                      <CardHeader id={`heading${index1}team`} className="p-2 bg-lightgrey border-0">
                        <Button
                          block
                          color="text-dark"
                          id={`heading${index1}team`}
                          className="text-left m-0 p-0 border-0 box-shadow-none"
                          onClick={() => toggleAccordion1(index1, tm.maintenance_team_id)}
                          aria-expanded={accordion1[`${index1}team`]}
                          aria-controls={`collapse${index1}team`}
                        >
                          <FontAwesomeIcon className="mr-3 ml-2 font-weight-800" size="lg" icon={faToolbox} />
                          <span className="collapse-heading font-weight-800">
                            {tm.maintenance_team_id && tm.maintenance_team_id.name ? tm.maintenance_team_id.name : ''}
                            {' '}
                          </span>
                          {accordion1[index1]
                            ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                            : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon1} />}
                          <span className="float-right mr-3 font-weight-700">
                            {tm.count}
                          </span>
                        </Button>
                      </CardHeader>

                      <Collapse
                        isOpen={accordion1[index1]}
                        data-parent="#accordion"
                        id={`collapse${index1}team`}
                        className="border-0 comments-list thin-scrollbar"
                        aria-labelledby={`heading${index1}team`}
                      >
                        <p>Hi</p>
                      </Collapse>
                    </Card>
                  ))}
                </Collapse>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="mb-3 mt-3 text-center">
              <Loader />
            </div>
          )}
          {(employeeChecklists && employeeChecklists.err) && (
            <ErrorContent errorTxt={generateErrorMessage(employeeChecklists)} />
          )}
          {(isErr) && (
            <ErrorContent errorTxt="No Data Found" />
          )}
          {errorText}
        </CardBody>
      </Card>
    </>
  );
});

reportEmployees.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
reportEmployees.defaultProps = {
  collapse: false,
};

export default reportEmployees;
