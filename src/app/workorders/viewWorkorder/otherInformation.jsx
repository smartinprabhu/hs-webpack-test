/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Card,
  CardHeader,
  Collapse,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import datesIcon from '@images/icons/dates.svg';
import logsIcon from '@images/icons/logs.svg';
import bookIcon from '@images/icons/book.svg';
import costingIcon from '@images/icons/costing.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  getDefaultNoValue, getCompanyTimezoneDate, getTimeFromFloat, generateErrorMessage,
} from '../../util/appUtils';
import '../../assets/locationDetails/styles.scss';
import workorderData from '../data/workorderActions.json';

const faIcons = {
  1: datesIcon,
  2: costingIcon,
  3: bookIcon,
  4: logsIcon,
};

const OtherInformation = () => {
  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);
  const [currentId, setCurrentId] = useState(1);

  const {
    workorderDetails,
  } = useSelector((state) => state.workorder);

  const {
    userInfo,
  } = useSelector((state) => state.user);

  function getinitial() {
    const accordn = [];
    for (let i = 0; i < workorderData.otherTags.length + 1; i += 1) {
      if (i === 0) {
        accordn.push(true);
      } else {
        accordn.push(false);
      }
    }
    setAccordian(accordn);
  }
  useEffect(() => {
    getinitial();
  }, []);

  function toggleAccordion(tab, id) {
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    setCurrentId(id);
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon(faAngleDown);
      } else {
        setIcon(faAngleUp);
      }
    }
    setAccordian(state);
  }

  return (
    <>
      {workorderDetails && workorderDetails.loading && (
      <Loader />
      )}
      {(workorderData && workorderData.otherTags) && workorderData.otherTags.map((asset, index) => (
        <div
          id="accordion"
          className="accordion-wrapper mb-3 border-0"
          key={asset.id}
        >
          <Card className="border-0">
            <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
              <Button
                block
                color="text-dark"
                id={`heading${index}`}
                className="text-left m-0 p-0 border-0"
                onClick={() => toggleAccordion(index, asset.id)}
                aria-expanded={accordion[index]}
                aria-controls={`collapse${index}`}
              >
                <img src={faIcons[asset.id]} className="mr-3 ml-2 font-weight-800" alt={asset.name} />
                <span className="collapse-heading font-weight-800">
                  {asset.name}
                  {' '}
                </span>
                {accordion[index]
                  ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                  : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
              </Button>
            </CardHeader>

            <Collapse
              isOpen={accordion[index]}
              data-parent="#accordion"
              id={`collapse${index}`}
              className="border-0"
              aria-labelledby={`heading${index}`}
            >
              {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
                <Row className="mb-1 ml-1 mr-1 mt-3">
                  {currentId === 1 ? (
                    <>
                      <Col sm="12" md="12" xs="12" lg="6">
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Scheduled Period</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {getDefaultNoValue(getCompanyTimezoneDate(workorderDetails.data[0].date_start_scheduled, userInfo, 'datetime'))}
                            <br />
                            {getDefaultNoValue(getCompanyTimezoneDate(workorderDetails.data[0].date_scheduled, userInfo, 'datetime'))}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Requested Date</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(workorderDetails.data[0].date_planned, userInfo, 'datetime'))}</span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Planned Duration</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getTimeFromFloat(workorderDetails.data[0].order_duration))}</span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                      <Col sm="12" md="12" xs="12" lg="6">
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Execution Period</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {getDefaultNoValue(getCompanyTimezoneDate(workorderDetails.data[0].date_start_execution, userInfo, 'datetime'))}
                            <br />
                            {getDefaultNoValue(getCompanyTimezoneDate(workorderDetails.data[0].date_execution, userInfo, 'datetime'))}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Actual Duration</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getTimeFromFloat(workorderDetails.data[0].actual_duration))}</span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Worked Duration</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getTimeFromFloat(workorderDetails.data[0].worked_hours))}</span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                    </>
                  )
                    : (<Col sm="12" md="12" xs="12" lg="12" />)}

                  {currentId === 2 ? (
                    <>
                      <Col sm="12" md="12" xs="12" lg="12">
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Allocated Resourses</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {getDefaultNoValue(workorderDetails.data[0].n_resourse)}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                      <Col sm="12" md="12" xs="12" lg="6">
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Planned Material Cost</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].std_mat_cost}
                            .00
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Planned Tool Cost</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].std_tool_cost}
                            .00
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Planned Labour Cost</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].std_labour_cost}
                            .00
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                      <Col sm="12" md="12" xs="12" lg="6">
                        <Row className="m-0">
                          <span className="m-0 p-0">Actual Material Cost</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">
                            {workorderDetails.data[0].act_mat_cost}
                            .00
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Actual Tool Cost</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].act_tool_cost}
                            .00
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Actual Labour Cost</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].act_labour_cost}
                            .00
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                    </>
                  )
                    : (<Col sm="12" md="12" xs="12" lg="12" />)}

                  {currentId === 3 ? (
                    <>
                      <Col sm="12" md="12" xs="12" lg="12">
                        <h5>Photo Required</h5>
                      </Col>
                      <Col sm="12" md="12" xs="12" lg="6">
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">At Start</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].at_start_mro ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">At Review</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].at_review_mro ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                      <Col sm="12" md="12" xs="12" lg="6">

                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">At Done</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].at_done_mro ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">Enforce Time</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].enforce_time ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>

                      <Col sm="12" md="12" xs="12" lg="6">
                        <h5>QR</h5>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">QR Scan At Start</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].is_qr_at_scan_start ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">QR Scan At Done</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].is_qr_at_scan_done ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                      <Col sm="12" md="12" xs="12" lg="6">
                        <h5>NFC</h5>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">NFC Scan At Start</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].is_nfc_scan_at_start ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-400">NFC Scan At Done</span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-800">
                            {workorderDetails.data[0].is_nfc_scan_at_done ? 'Yes' : 'No'}
                          </span>
                        </Row>
                        <hr className="mt-2" />
                      </Col>
                    </>
                  )
                    : (<Col sm="12" md="12" xs="12" lg="12" />)}

                </Row>
              )}
            </Collapse>
          </Card>
        </div>
      ))}
      {(workorderDetails && workorderDetails.err) && (
      <ErrorContent errorTxt={generateErrorMessage(workorderDetails)} />
      )}
    </>
  );
};
export default OtherInformation;
