/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getReadingsDetail, getDataLines } from '../equipmentService';
import {
  getConditionLabel, getRecurrenceLabel, getTodoLabel, getMaintainLabel, getPriorityTypesLabel,
} from '../utils/utils';

const appModels = require('../../util/appModels').default;

const ReadingsDetailInfo = (props) => {
  const {
    editData,
  } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { assetReadingsDetail, dataLines } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (editData) {
      const viewId = editData ? editData.id : '';
      dispatch(getReadingsDetail(viewId, appModels.READINGSLINE));
    }
  }, [editData]);

  useEffect(() => {
    if (assetReadingsDetail && assetReadingsDetail.data && assetReadingsDetail.data.length > 0) {
      const ids = assetReadingsDetail.data[0].dataline_lines_ids;
      if (ids.length > 0) {
        dispatch(getDataLines(ids, appModels.DATALINE));
      }
    }
  }, [assetReadingsDetail]);

  function getRow() {
    const tableTr = [];
    if (dataLines && dataLines.data && dataLines.data.length > 0) {
      for (let i = 0; i < dataLines.data.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{dataLines.data[i].number}</td>
            <td className="p-2">{dataLines.data[i].name}</td>
            <td className="p-2">{dataLines.data[i].rank}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  return (
    <>
      {assetReadingsDetail && (assetReadingsDetail.data && assetReadingsDetail.data.length > 0) && (
        <div>
          <Row className="mb-3 ml-1 mr-1">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <h6 className="mb-3">Reading Configuration</h6>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Name</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].reading_id ? assetReadingsDetail.data[0].reading_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Reading Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].type ? assetReadingsDetail.data[0].type : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Unit of Measure</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].uom_id ? assetReadingsDetail.data[0].uom_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Data Format</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].data_type)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Status</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].is_active ? 'Active' : 'Inactive')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Allow Smart Logger</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].is_allow_manual_reading ? 'Yes' : 'No')}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <h6 className="mb-3">Validation Configuration</h6>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Validate Entry</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].validation_required ? 'Yes' : 'No')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Minimum Value</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].validation_min_float_value)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Maximum Value</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].validation_max_float_value)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Validation Error Message</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].validation_error_msg)}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
          </Row>
          <hr />
          <Row className="mb-3 ml-1 mr-1">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <h6 className="mb-3">Analytics Configuration</h6>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Analyze By</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">
                  {getDefaultNoValue(getConditionLabel(assetReadingsDetail.data[0].condition))}
                </span>
              </Row>
              <hr className="mt-3" />
              {assetReadingsDetail.data[0].condition && assetReadingsDetail.data[0].condition === 'Delta' && (
                <>
                  <Row className="m-0">
                    <h6 className="mb-3">Delta</h6>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Aggregate Timeperiod</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">
                      <span className="m-0 p-0 font-weight-800 text-capital">
                        {getDefaultNoValue((assetReadingsDetail.data[0].aggregate_timeperiod ? assetReadingsDetail.data[0].aggregate_timeperiod[1] : ''))}
                      </span>
                    </span>
                  </Row>
                  <hr className="mt-3" />
                </>
              )}
              {assetReadingsDetail.data[0].condition && assetReadingsDetail.data[0].condition === 'Run Hour' && (
                <>
                  <Row className="m-0">
                    <h6 className="mb-3">Run Hour</h6>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">ThresholdValue</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].threshold)}</span>
                  </Row>
                  <hr className="mt-3" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Recurrent</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getRecurrenceLabel(assetReadingsDetail.data[0].recurrent))}</span>
                  </Row>
                  <hr className="mt-3" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Order Generated On Quotient</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].order_generated_on_quotient)}</span>
                  </Row>
                  <hr className="mt-3" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Propagate</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].is_propagate ? 'Yes' : 'No')}</span>
                  </Row>
                  <hr className="mt-3" />
                </>
              )}
              {assetReadingsDetail.data[0].condition && assetReadingsDetail.data[0].condition === 'Threshold' && (
              <>
                <Row className="m-0">
                  <h6 className="mb-3">Threshold</h6>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Threshold Min</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].threshold_min)}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Threshold Max</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].threshold_max)}</span>
                </Row>
                <hr className="mt-3" />
              </>
              )}
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <h6 className="mb-3">Actions</h6>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">To Do</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getTodoLabel(assetReadingsDetail.data[0].to_do))}</span>
              </Row>
              <hr className="mt-3" />
              {assetReadingsDetail.data[0].to_do && assetReadingsDetail.data[0].to_do === 'Maintenance Order' && (
                <>
                  <Row className="m-0">
                    <h6 className="mb-3">Maintenance Order</h6>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Checklist</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{(assetReadingsDetail.data[0].check_list_id ? assetReadingsDetail.data[0].check_list_id[1] : '')}</span>
                  </Row>
                  <hr className="mt-3" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Team Category</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">
                      {getDefaultNoValue((assetReadingsDetail.data[0].team_category_id ? assetReadingsDetail.data[0].team_category_id[1] : ''))}
                    </span>
                  </Row>
                  <hr className="mt-3" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Maintenace Type</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getMaintainLabel(assetReadingsDetail.data[0].maintenance_type))}</span>
                  </Row>
                  <hr className="mt-3" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].is_mro_propagate ? 'Yes' : 'No')}</span>
                  </Row>
                  <hr className="mt-3" />
                </>
              )}
              {assetReadingsDetail.data[0].to_do && assetReadingsDetail.data[0].to_do === 'Alarm' && (
              <>
                <Row className="m-0">
                  <h6 className="mb-3">Alarm</h6>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Alarm Name</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].alarm_name)}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Priority</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getPriorityTypesLabel(assetReadingsDetail.data[0].priority))}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Category</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">
                    <span className="m-0 p-0 font-weight-800 text-capital">
                      {getDefaultNoValue((assetReadingsDetail.data[0].category_id ? assetReadingsDetail.data[0].category_id[1] : ''))}
                    </span>
                  </span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Alarm Recipients</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">
                    <span className="m-0 p-0 font-weight-800 text-capital">
                      {getDefaultNoValue((assetReadingsDetail.data[0].alarm_recipients ? assetReadingsDetail.data[0].alarm_recipients[1] : ''))}
                    </span>
                  </span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Propagate Alarms</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].is_propagate_alarms ? 'Yes' : 'No')}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Notification Message</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].message)}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Description</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].description)}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Alarm Actions</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">
                    {getDefaultNoValue((assetReadingsDetail.data[0].alarm_actions ? assetReadingsDetail.data[0].alarm_actions[1] : ''))}
                  </span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Font Awesome Icon</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].font_awesome_icon)}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">TTL (Minutes)</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].ttl)}</span>
                </Row>
                <hr className="mt-3" />
              </>
              )}
              {assetReadingsDetail.data[0].to_do && assetReadingsDetail.data[0].to_do === 'Reading Logs' && (
              <>
                <Row className="m-0">
                  <h6 className="mb-3">Reading Logs</h6>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Measured On</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(assetReadingsDetail.data[0].date, userInfo, 'datetime'))}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Measure Value</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(assetReadingsDetail.data[0].value)}</span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Measure</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">
                    <span className="m-0 p-0 font-weight-800 text-capital">
                      {getDefaultNoValue((assetReadingsDetail.data[0].measure_id ? assetReadingsDetail.data[0].measure_id[1] : ''))}
                    </span>
                  </span>
                </Row>
                <hr className="mt-3" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Equipment</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-800 text-capital">
                    <span className="m-0 p-0 font-weight-800 text-capital">
                      {getDefaultNoValue((assetReadingsDetail.data[0].log_equipment_id ? assetReadingsDetail.data[0].log_equipment_id[1] : ''))}
                    </span>
                  </span>
                </Row>
                <hr className="mt-3" />
              </>
              )}
            </Col>
          </Row>
          <Row className="mb-3 ml-1 mr-1">
            {assetReadingsDetail.data[0].dataline_lines_ids && assetReadingsDetail.data[0].dataline_lines_ids.length > 0
              ? (
                <Col sm="12" md="12" xs="12" lg="12">
                  <span className="m-0 p-0 font-weight-800">Dataline</span>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Rank(1-10)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRow()}
                    </tbody>
                  </Table>
                </Col>
              )
              : ''}
          </Row>
        </div>
      )}
      {assetReadingsDetail.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(assetReadingsDetail && assetReadingsDetail.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(assetReadingsDetail)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
ReadingsDetailInfo.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  editData: PropTypes.array.isRequired,
};
export default ReadingsDetailInfo;
