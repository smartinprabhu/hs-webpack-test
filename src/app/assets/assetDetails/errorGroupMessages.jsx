/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  Collapse,
  Col,
  Row,
} from 'reactstrap';
import {
  faAngleDown, faAngleUp, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as PropTypes from 'prop-types';

const ErrorGroupMessages = (props) => {
  const {
    data,
  } = props;
  const [currentTab, setActive] = useState(false);

  function getQueryInKey(array) {
    let result = false;
    if (array && array.length) {
      result = array[0].field;
    }
    return result;
  }

  function getMessages(arr, field) {
    let result = [];
    if (arr && arr.length && field) {
      result = arr.filter((item) => item.field === field);
    }
    return result;
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0">
          {data && data.length > 0 && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  {data.map((mg) => (
                    <div
                      id="accordion"
                      className="accordion-wrapper mb-3 border-0"
                      key={getQueryInKey(mg)}
                    >
                      <Card className="border-0">
                        <CardHeader id={`heading${getQueryInKey(mg)}`} className="p-2 bg-lightgrey border-0">
                          <Button
                            block
                            color="text-dark"
                            id={`heading${getQueryInKey(mg)}`}
                            className="text-left m-0 p-0 border-0 box-shadow-none"
                            onClick={() => setActive(currentTab === getQueryInKey(mg) ? false : getQueryInKey(mg))}
                            aria-expanded={currentTab}
                            aria-controls={`collapse${getQueryInKey(mg)}`}
                          >
                            <span className="collapse-heading font-weight-800 text-capital font-family-tab">
                              {getQueryInKey(mg)}
                              {'     '}
                              (
                              {getMessages(mg, getQueryInKey(mg)) && getMessages(mg, getQueryInKey(mg)).length ? `${getMessages(mg, getQueryInKey(mg)).length} records` : ''}
                              )
                            </span>
                            {currentTab === getQueryInKey(mg)
                              ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                              : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleDown} />}
                          </Button>
                        </CardHeader>

                        <Collapse
                          isOpen={currentTab === getQueryInKey(mg)}
                          data-parent="#accordion"
                          id={`collapse${getQueryInKey(mg)}`}
                          className="border-0"
                          aria-labelledby={`heading${getQueryInKey(mg)}`}
                        >
                          <div className="p-2 form-modal-scroll thin-scrollbar">
                            {mg && getMessages(mg, getQueryInKey(mg)).map((ms) => (
                              <p className={ms.type === 'error' ? 'text-danger font-family-tab' : 'text-info font-family-tab'} key={ms.field}>
                                <FontAwesomeIcon
                                  color={ms.type === 'error' ? 'danger' : 'primary'}
                                  className="mr-2"
                                  icon={faInfoCircle}
                                />
                                <span className={ms.type === 'error' ? 'text-danger font-family-tab' : 'text-info font-family-tab'}>
                                  {ms.message}
                                  {'   '}
                                  {ms.rows && ms.rows.from ? `at row ${ms.rows.from}` : '' }
                                </span>
                              </p>
                            ))}
                          </div>
                        </Collapse>
                      </Card>
                    </div>
                  ))}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};

ErrorGroupMessages.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default ErrorGroupMessages;
