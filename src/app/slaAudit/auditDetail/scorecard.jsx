/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useMemo, useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Input,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  getColumnArrayByDecimal,
  numToFloatView, decimalKeyPressDown, isJsonString, getJsonString,
} from '../../util/appUtils';
import chartOptions from '../data/barCharts.json';
import { updateSlaAudit } from '../auditService';

const appModels = require('../../util/appModels').default;

const Scorecard = React.memo(({ auditDetails, isPreview }) => {
  const dispatch = useDispatch();

  const [feeValue, setFeeValue] = useState(false);
  const [poHash, setPoHash] = useState(false);
  const [poValue, setPoValue] = useState(false);
  const [occupancySlab, setOccupancySlab] = useState(false);
  const [noTargetFeeValue, setNoTargetFeeValue] = useState(false);

  const [feeValue1, setFeeValue1] = useState(false);
  const [poHash1, setPoHash1] = useState(false);
  const [poValue1, setPoValue1] = useState(false);
  const [occupancySlab1, setOccupancySlab1] = useState(false);
  const [noTargetFeeValue1, setNoTargetFeeValue1] = useState(false);

  const sections = auditDetails && auditDetails.sla_category_logs ? auditDetails.sla_category_logs : [];

  const { slaAuditConfig } = useSelector((state) => state.slaAudit);

  const hasTarget = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].has_target;

  useMemo(() => {
    if (auditDetails) {
      setFeeValue(auditDetails.monthly_billing_value);
      setNoTargetFeeValue(auditDetails.has_targe_management_fee);
      setPoHash(auditDetails.po_no ? auditDetails.po_no : '');
      setPoValue(auditDetails.po_value ? auditDetails.po_value : '');
      setOccupancySlab(auditDetails.occupancy_slab ? auditDetails.occupancy_slab : '');

      setFeeValue1(auditDetails.monthly_billing_value);
      setNoTargetFeeValue1(auditDetails.has_targe_management_fee);
      setPoHash1(auditDetails.po_no ? auditDetails.po_no : '');
      setPoValue1(auditDetails.po_value ? auditDetails.po_value : '');
      setOccupancySlab1(auditDetails.occupancy_slab ? auditDetails.occupancy_slab : '');
    }
  }, [auditDetails]);

  const isSum = !!(hasTarget && auditDetails && auditDetails.sla_json_data && isJsonString(auditDetails.sla_json_data) && getJsonString(auditDetails.sla_json_data)
  && getJsonString(auditDetails.sla_json_data).data_show_type && getJsonString(auditDetails.sla_json_data).data_show_type === 'sum');

  const isDirectBilling = auditDetails && auditDetails.sla_json_data && isJsonString(auditDetails.sla_json_data) && getJsonString(auditDetails.sla_json_data)
    && getJsonString(auditDetails.sla_json_data).risk_calculation && getJsonString(auditDetails.sla_json_data).risk_calculation === 'billing_value_only';

  const isCustomName = auditDetails && auditDetails.sla_json_data && isJsonString(auditDetails.sla_json_data) && getJsonString(auditDetails.sla_json_data)
    && getJsonString(auditDetails.sla_json_data).risk_custom_name;

  const isSumValue = auditDetails && auditDetails.sla_json_data && isJsonString(auditDetails.sla_json_data) && getJsonString(auditDetails.sla_json_data)
   && getJsonString(auditDetails.sla_json_data).exclude_weightage && getJsonString(auditDetails.sla_json_data).exclude_weightage === 'yes';

  const actionsData = [];

  function getNCCount() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'non_conformity');
    if (data && data.length) {
      res = data.length;
    }
    return res;
  }

  function getIOCount() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'improvement');
    if (data && data.length) {
      res = data.length;
    }
    return res;
  }

  function getNCData() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'non_conformity');
    if (data && data.length) {
      res = data;
    }
    return res;
  }

  function getIOData() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'improvement');
    if (data && data.length) {
      res = data;
    }
    return res;
  }

  function getAvgTotal(field) {
    let count = 0;
    for (let i = 0; i < sections.length; i += 1) {
      count += sections[i][field];
    }
    return count;
  }

  function getColorCode(label) {
    let res = '';
    if (label === 'Target Value') {
      res = '#6699ff';
    } else if (label === 'Achieved Score') {
      res = '#ff9933';
    }
    return res;
  }

  function getTitles(array) {
    const count = [];
    if (array) {
      for (let i = 0; i < array.length; i += 1) {
        count.push((array[i].sla_category_id && array[i].sla_category_id.name ? array[i].sla_category_id.name : ''));
      }
    }
    return count; // return column data..
  }

  function getDatasets(values, labels) {
    let result = {};
    if (values) {
      const data = [];
      if (hasTarget) {
        data.push({
          data: getColumnArrayByDecimal(values, 'target'),
          label: 'Target Value',
          backgroundColor: getColorCode('Target Value'),
        });
      }
      data.push({
        data: getColumnArrayByDecimal(values, isSum ? 'achieved_score_sum' : 'achieved_score'),
        label: 'Achieved Score',
        backgroundColor: getColorCode('Achieved Score'),
      });
      result = {
        datasets: data,
        labels,
      };
    }
    return result;
  }

  const preventPaste = (e) => {
    alert('Copying and pasting is not allowed!');
    e.preventDefault();
  };

  const handleInputKeyChange = (event) => {
    const { value } = event.target;
    setFeeValue(value);
  };

  const handleInputKeyFeeChange = (event) => {
    const { value } = event.target;
    setNoTargetFeeValue(value);
  };

  const handleInputKeyChange1 = (event) => {
    const { value } = event.target;
    setPoHash(value);
  };

  const handleInputKeyChange2 = (event) => {
    const { value } = event.target;
    setPoValue(value);
  };

  const handleInputKeyChange3 = (event) => {
    const { value } = event.target;
    setOccupancySlab(value);
  };

  function getManagementFee(value) {
    let count = value;
    if (feeValue && auditDetails.management_fee) {
      count = (feeValue * auditDetails.management_fee) / 100;
    }
    return count;
  }

  function getManagementPenaltyAmt(value, weightage, penaltyPer) {
    let count = 0;
    if (value && weightage) {
      const percount = (value * weightage) / 100;
      count = (percount * penaltyPer) / 100;
    }
    return count;
  }

  function getManagementFeeRisk(value) {
    let count = value;
    if (isSumValue) {
      const sumValue = 100 - getAvgTotal('achieved_score_sum');
      if (isDirectBilling) {
        if (feeValue && sumValue) {
          count = (sumValue * feeValue) / 100;
        }
      } else if (!isDirectBilling) {
        if (feeValue && auditDetails.management_fee) {
          count = (sumValue * getManagementFee(auditDetails.management_fee_cost)) / 100;
        }
      }
    } else if (!isSumValue) {
      if (isDirectBilling) {
        if (feeValue && auditDetails.penalty_cost) {
          count = (auditDetails.penalty_cost * feeValue) / 100;
        }
      } else if (!isDirectBilling) {
        if (feeValue && auditDetails.management_fee) {
          count = (auditDetails.penalty_cost * getManagementFee(auditDetails.management_fee_cost)) / 100;
        }
      }
    }
    return numToFloatView(count);
  }

  const sortCategories = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a.sla_category_id.sequence - b.sla_category_id.sequence);
    return dataSections;
  };

  function getRangeScore(value, ranges) {
    let score = 0;
    if (ranges && ranges.length) {
      const rangesData = ranges.filter((item) => parseFloat(parseFloat(item.min).toFixed(2)) <= parseFloat(parseFloat(value).toFixed(2)) && parseFloat((parseFloat(item.max).toFixed(2))) >= parseFloat((parseFloat(value).toFixed(2))));
      if (rangesData && rangesData.length) {
        score = rangesData[0].score;
      }
    }

    return score;
  }

  function getAvgTotalAmt() {
    let count = 0.00;
    for (let i = 0; i < sections.length; i += 1) {
      count += getManagementPenaltyAmt(noTargetFeeValue, sections[i].weightage, sections[i].penatly);
    }
    return parseFloat(count).toFixed(2);
  }

  function getManagementFeeRiskNoTarget() {
    let count = 0;
    const penaltyAmt = parseFloat(getAvgTotalAmt());
    const mFee = noTargetFeeValue;
    if (penaltyAmt && mFee) {
      const pa = parseFloat(penaltyAmt);
      const mgFee = parseFloat(mFee);
      if (parseFloat(pa) > parseFloat(mgFee)) {
        count = mFee;
      } else {
        count = penaltyAmt;
      }
    }
    return numToFloatView(count);
  }

  function getLogs() {
    let newData = [];
    const ansLines = [];

    if (sections && sections.length > 0) {
      for (let i = 0; i < sections.length; i += 1) {
        newData = [1, sections[i].id, {
          // penatly: getRangeScore(isSum ? sections[i].achieved_score_sum : sections[i].achieved_score, sections[i].sla_penalty_metric_id && sections[i].sla_penalty_metric_id.scale_line_ids ? sections[i].sla_penalty_metric_id.scale_line_ids : []),
          penalty_amount: parseFloat(getManagementPenaltyAmt(noTargetFeeValue, sections[i].weightage, sections[i].penatly)),
        }];
        ansLines.push(newData);
      }
    }
    return ansLines;
  }

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (parseFloat(feeValue1 || 0) !== parseFloat(value || 0)) {
      setFeeValue1(value);
      setFeeValue(value);
      const payload = {
        monthly_billing_value: parseFloat(value),
      };
      /* if (!hasTarget && getLogs() && getLogs().length > 0) {
        payload = {
          monthly_billing_value: parseFloat(value),
          sla_category_logs: getLogs(),
        };
      } */
      dispatch(updateSlaAudit(auditDetails.id, appModels.SLAAUDIT, payload));
    }
  };

  const handleInputFeeChange = (event) => {
    const { value } = event.target;
    // auditDetails.has_targe_management_fee = value;
    if (parseFloat(noTargetFeeValue1 || 0) !== parseFloat(value || 0)) {
      setNoTargetFeeValue(value);
      setNoTargetFeeValue1(value);
      let payload = {
        monthly_billing_value: parseFloat(feeValue),
        has_targe_management_fee: parseFloat(value),
      };
      if (!hasTarget && getLogs() && getLogs().length > 0) {
        payload = {
          monthly_billing_value: parseFloat(feeValue),
          has_targe_management_fee: parseFloat(value),
          sla_category_logs: getLogs(),
          has_target_amount_penalized: parseFloat(getManagementFeeRiskNoTarget()),
        };
      }
      dispatch(updateSlaAudit(auditDetails.id, appModels.SLAAUDIT, payload));
    }
  };

  const handleInputPoChange = (event, field) => {
    const { value } = event.target;
    let val = parseFloat(auditDetails[field] ? auditDetails[field] : 0);
    if (field === 'occupancy_slab') {
      val = parseFloat(occupancySlab1 || 0);
    } else if (field === 'po_value') {
      val = parseFloat(poValue1 || 0);
    } else if (field === 'po_no') {
      val = parseFloat(poHash1 || 0);
    }

    if (val !== parseFloat(value || 0)) {
      if (field === 'occupancy_slab') {
        setOccupancySlab1(value);
      } else if (field === 'po_value') {
        setPoValue1(value);
      } else if (field === 'po_no') {
        setPoHash1(value);
      }

      const payload = {
        [field]: value,
      };
      dispatch(updateSlaAudit(auditDetails.id, appModels.SLAAUDIT, payload));
    }
  };

  return (
    <Card className="p-2 border-0 bg-white score-card">
      <CardBody className="pt-2">
        {sections && sections.length > 0 && (
          <div>
            <Bar
              key="Audit Scorecard"
              height="300"
              data={getDatasets(sections, getTitles(sections))}
              options={chartOptions.options}
            />
          </div>
        )}
        <Row className="scoreCard-table">
          <Col sm="12" md="12" lg="12" xs="12" className="p-0 bg-white instructions-scroll thin-scrollbar">
            {sections && sections.length > 0 && (
              <div>
                <Table>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="sticky-th table-column z-Index-1060 font-family-tab">Category</th>
                      {!hasTarget && (
                        <th className="p-2 font-family-tab table-column z-Index-1060 sticky-th sticky-head cursor-default text-right">Weightage (%)</th>
                      )}
                      {hasTarget && (
                        <th className="p-2 font-family-tab table-column z-Index-1060 sticky-th sticky-head cursor-default text-right">Target Value</th>
                      )}
                      <th className="p-2 font-family-tab table-column z-Index-1060 sticky-th sticky-head cursor-default text-right">Achieved Score</th>
                      {!hasTarget && (
                        <>
                          <th className="p-2 font-family-tab table-column z-Index-1060 sticky-th sticky-head cursor-default text-right">Penatly (%)</th>
                          <th className="p-2 font-family-tab table-column z-Index-1060 sticky-th sticky-head cursor-default text-right">Penalty Amount</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {sortCategories(sections).map((section) => (
                      <tr key={section.sla_category_id}>
                        <td className="p-2 sticky-td font-family-tab">{section.sla_category_id && section.sla_category_id.name ? section.sla_category_id.name : ''}</td>
                        {!hasTarget && (
                          <td className="p-2 font-family-tab sticky-td text-right">{parseInt(section.weightage)}</td>
                        )}
                        {hasTarget && (
                          <td className="p-2 font-family-tab sticky-td text-right">{section.target}</td>
                        )}
                        <td align="right" className="p-2 font-family-tab sticky-td text-right">{numToFloatView(isSum ? section.achieved_score_sum : section.achieved_score)}</td>
                        {!hasTarget && (
                          <>
                            <td className="p-2 font-family-tab sticky-td text-right">
                              {numToFloatView(section.penatly)}
                            </td>
                            <td className="p-2 font-family-tab sticky-td text-right">
                              {parseFloat(getManagementPenaltyAmt(noTargetFeeValue, section.weightage, section.penatly)).toFixed(2)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-2 font-family-tab sticky-td font-weight-800">#</td>
                      {!hasTarget && (
                        <td className="p-2 font-family-tab sticky-td text-right font-weight-800">
                          {getAvgTotal('weightage')}
                        </td>
                      )}
                      {hasTarget && (
                        <td className="p-2 font-family-tab sticky-td text-right font-weight-800">
                          {isSum ? numToFloatView(getAvgTotal('target')) : numToFloatView(getAvgTotal('target') / sections.length)}
                        </td>
                      )}
                      <td align="right" className="p-2 font-family-tab sticky-td text-right font-weight-800">
                        {isSum ? numToFloatView(getAvgTotal('achieved_score_sum')) : numToFloatView(
                          (getAvgTotal('achieved_score') / sections.length),
                        )}
                      </td>
                      {!hasTarget && (
                        <>
                          <td className="p-2 sticky-td font-family-tab text-right font-weight-800">
                            Sum
                          </td>
                          <td className="p-2 sticky-td font-family-tab text-right font-weight-800">
                            {getAvgTotalAmt()}
                          </td>
                        </>
                      )}
                    </tr>
                    {!hasTarget && (
                      <tr>
                        <td className="p-2 sticky-td font-weight-800" />
                        <td className="p-2 sticky-td font-weight-800" />
                        <td className="p-2 sticky-td font-weight-800" />
                        <td className="p-2 sticky-td font-weight-800 text-right font-family-tab">Amount to be penalised</td>
                        <td className="p-2 sticky-td font-weight-800 text-right font-family-tab">{getManagementFeeRiskNoTarget()}</td>
                      </tr>

                    )}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
            )}
          </Col>
        </Row>
        {!isPreview && (
          <Row className="scoreCard-table">
            <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
              {auditDetails && (
                <div>
                  <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="sticky-th font-family-tab">Monthly Billing Value (INR)</th>
                        <th className="p-2 sticky-th sticky-head cursor-default text-right font-family-tab">Management Fee (INR)</th>
                        {hasTarget && (
                          <>
                            <th className="p-2 sticky-th sticky-head cursor-default text-right font-family-tab">Penalty Applicable %</th>

                            <th className="p-2 sticky-th sticky-head cursor-default text-right font-family-tab">{isCustomName || 'Management Fee @ Risk (INR)'}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 sticky-td text-right font-family-tab">
                          <Input
                            type="text"
                            className="m-0 position-relative"
                            name="answerValue"
                            autoComplete="off"
                            disabled={auditDetails.state !== 'Submitted' && auditDetails.state !== 'Reviewed'}
                            onPaste={(e) => preventPaste(e)}
                            onKeyDown={decimalKeyPressDown}
                            defaultValue={auditDetails.monthly_billing_value}
                            value={feeValue}
                            onChange={handleInputKeyChange}
                            onBlur={handleInputChange}
                          />
                        </td>
                        {hasTarget ? (
                          <td className="p-2 sticky-td font-family-tab text-right">{getManagementFee(auditDetails.management_fee_cost)}</td>
                        ) : (
                          <td className="p-2 sticky-td font-family-tab float-right">
                            <Input
                              type="text"
                              className="m-0 position-relative text-right"
                              name="answerValue"
                              autoComplete="off"
                              disabled={auditDetails.state !== 'Submitted' && auditDetails.state !== 'Reviewed'}
                              onPaste={(e) => preventPaste(e)}
                              onKeyDown={decimalKeyPressDown}
                              defaultValue={auditDetails.has_targe_management_fee}
                              value={noTargetFeeValue}
                              onChange={handleInputKeyFeeChange}
                              onBlur={handleInputFeeChange}
                            />
                          </td>
                        )}
                        {hasTarget && (
                          <>
                            <td className="p-2 sticky-td font-family-tab text-right">{isSumValue ? numToFloatView(100 - getAvgTotal('achieved_score_sum')) : numToFloatView(auditDetails.penalty_cost)}</td>
                            <td className="p-2 sticky-td font-family-tab text-right">{getManagementFeeRisk(auditDetails.management_fee_risk)}</td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </Table>
                  <hr className="m-0" />
                </div>
              )}
            </Col>
          </Row>
        )}
        {!isPreview && !hasTarget && (
          <Row className="scoreCard-table">
            <Col sm="12" md="6" lg="6" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
              {auditDetails && (
                <div>
                  <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="sticky-th width-200px font-family-tab">PO#</th>
                        <th className="p-2 sticky-th sticky-head font-family-tab cursor-default">PO Value</th>
                        <th className="p-2 sticky-th sticky-head font-family-tab cursor-default">Occupancy Slab %</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 sticky-td text-right font-family-tab" align="right">
                          <Input
                            type="text"
                            className="m-0 position-relative text-right"
                            name="answerValue1"
                            autoComplete="off"
                            disabled={auditDetails.state !== 'Submitted' && auditDetails.state !== 'Reviewed'}
                            // onPaste={(e) => preventPaste(e)}
                            // onKeyDown={decimalKeyPressDown}
                            defaultValue={auditDetails.po_no}
                            value={poHash}
                            onChange={handleInputKeyChange1}
                            onBlur={(e) => handleInputPoChange(e, 'po_no')}
                          />
                        </td>
                        <td className="p-2 sticky-td text-right font-family-tab" align="right">
                          <Input
                            type="text"
                            className="m-0 position-relative text-right"
                            name="answerValue2"
                            autoComplete="off"
                            disabled={auditDetails.state !== 'Submitted' && auditDetails.state !== 'Reviewed'}
                            onPaste={(e) => preventPaste(e)}
                            onKeyDown={decimalKeyPressDown}
                            defaultValue={auditDetails.po_value}
                            value={poValue}
                            onChange={handleInputKeyChange2}
                            onBlur={(e) => handleInputPoChange(e, 'po_value')}
                          />
                        </td>
                        <td className="p-2 sticky-td text-right font-family-tab" align="right">
                          <Input
                            type="text"
                            className="m-0 position-relative text-right"
                            name="answerValue3"
                            autoComplete="off"
                            disabled={auditDetails.state !== 'Submitted' && auditDetails.state !== 'Reviewed'}
                            onPaste={(e) => preventPaste(e)}
                            onKeyDown={decimalKeyPressDown}
                            defaultValue={auditDetails.occupancy_slab}
                            value={occupancySlab}
                            onChange={handleInputKeyChange3}
                            onBlur={(e) => handleInputPoChange(e, 'occupancy_slab')}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <hr className="m-0" />
                </div>
              )}
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
});

Scorecard.propTypes = {
  auditDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default Scorecard;
