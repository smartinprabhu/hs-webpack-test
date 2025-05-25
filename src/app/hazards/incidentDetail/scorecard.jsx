/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';


import {
  getColumnArrayById, 
  numToFloatView, integerKeyPress,
} from '../../util/appUtils';
import chartOptions from '../data/barCharts.json';
import { updateSlaAudit } from '../ctService';

const appModels = require('../../util/appModels').default;

const Scorecard = React.memo(({ auditDetails }) => {
  const dispatch = useDispatch();

  const [isNcShow, setIsNcShow] = useState(false);
  const [isIoShow, setIsIoShow] = useState(false);

  const [feeValue, setFeeValue] = useState(false);

  const sections = auditDetails && auditDetails.sla_category_logs ? auditDetails.sla_category_logs : [];

  useEffect(() => {
    if (auditDetails) {
      setFeeValue(auditDetails.monthly_billing_value);
    }
  }, [auditDetails]);

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
      data.push({
        data: getColumnArrayById(values, 'target'),
        label: 'Target Value',
        backgroundColor: getColorCode('Target Value'),
      });
      data.push({
        data: getColumnArrayById(values, 'achieved_score'),
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

  const handleInputChange = (event) => {
    const { value } = event.target;
    setFeeValue(value);
    const payload = {
      monthly_billing_value: value,
    };
    dispatch(updateSlaAudit(auditDetails.id, appModels.SLAAUDIT, payload));
  };

  const handleInputKeyChange = (event) => {
    const { value } = event.target;
    setFeeValue(value);
  };

  function getManagementFee(value) {
    let count = value;
    if (feeValue && auditDetails.management_fee) {
      count = (feeValue * auditDetails.management_fee) / 100;
    }
    return count;
  }

  function getManagementFeeRisk(value) {
    let count = value;
    if (feeValue && auditDetails.management_fee) {
      count = (auditDetails.penalty_cost * getManagementFee(auditDetails.management_fee_cost)) / 100;
    }
    return numToFloatView(count);
  }

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
          <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
            {sections && sections.length > 0 && (
            <div>
              <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="sticky-th">Category</th>
                    <th className="p-2 sticky-th sticky-head cursor-default text-right">Target Value</th>
                    <th className="p-2 sticky-th sticky-head cursor-default text-right">Achieved Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((section) => (
                    <tr key={section.sla_category_id}>
                      <td className="p-2 sticky-td">{section.sla_category_id && section.sla_category_id.name ? section.sla_category_id.name : ''}</td>
                      <td className="p-2 sticky-td text-right">{section.target}</td>
                      <td align="right" className="p-2 sticky-td text-right">{numToFloatView(section.achieved_score)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2 sticky-td font-weight-800">#</td>
                    <td className="p-2 sticky-td text-right font-weight-800">
                      {numToFloatView(getAvgTotal('target') / sections.length)}
                    </td>
                    <td align="right" className="p-2 sticky-td text-right font-weight-800">
                      {numToFloatView(
                        (getAvgTotal('achieved_score') / sections.length),
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
            )}
          </Col>
        </Row>
        <Row className="scoreCard-table">
          <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
            {auditDetails && (
            <div>
              <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="sticky-th text-right">Monthly Billing Value (Lakhs)</th>
                    <th className="p-2 sticky-th sticky-head cursor-default text-right">Management Fee (Lakhs)</th>
                    <th className="p-2 sticky-th sticky-head cursor-default text-right">Penality Applicable %</th>
                    <th className="p-2 sticky-th sticky-head cursor-default text-right">Management Fee @ Risk (Lakhs)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 sticky-td  text-right">
                      <Input
                        type="text"
                        className="m-0 position-relative"
                        name="answerValue"
                        autoComplete="off"
                        disabled={auditDetails.state !== 'Submitted' && auditDetails.state !== 'Reviewed'}
                        onPaste={(e) => preventPaste(e)}
                        onKeyPress={integerKeyPress}
                        defaultValue={auditDetails.monthly_billing_value}
                        value={feeValue}
                        onChange={handleInputKeyChange}
                        onBlur={handleInputChange}
                      />
                    </td>
                    <td className="p-2 sticky-td  text-right">{getManagementFee(auditDetails.management_fee_cost)}</td>
                    <td className="p-2 sticky-td  text-right">{numToFloatView(auditDetails.penalty_cost)}</td>
                    <td className="p-2 sticky-td  text-right">{getManagementFeeRisk(auditDetails.management_fee_risk)}</td>
                  </tr>
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
            )}
          </Col>
        </Row>
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
