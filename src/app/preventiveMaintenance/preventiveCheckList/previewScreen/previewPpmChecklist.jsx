/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { useFormikContext } from 'formik';
import { Row, Col } from 'reactstrap';
import { Table } from '@material-ui/core';

import {
  getDefaultNoValue,
} from '@util/appUtils';
import { getQuestionTypeLabel } from '../../utils/utils';

const PreviewPpmChecklist = () => {
  const { values: formValues } = useFormikContext();
  return (
    <>
      <Row className="m-0">
        <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue">
          <span className="d-inline-block pb-1 mb-2 font-family-tab font-weight-bold">Checklist Info</span>
          <Row className="mb-3">
            <Col xs={12} sm={6} md={6} lg={6}>
              <Row className="m-0">
                <span className="font-family-tab m-1">Title</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 font-family-tab font-weight-500">{getDefaultNoValue(formValues.name)}</span>
              </Row>
              <hr className="m-1" />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mx-0 mt-3">
        <Col sm="12" className="bg-lightblue">
          <Table responsive>
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 font-family-tab min-width-160 border-0">
                  Question Group
                </th>
                <th className="p-2 font-family-tab min-width-160 border-0">
                  Question Name
                </th>
                <th className="p-2 font-family-tab min-width-160 border-0">
                  Type of Question
                </th>
              </tr>
            </thead>
            <tbody>
              {formValues && formValues.activity_lines && formValues.activity_lines.map((activity, index) => (
                <tr key={index}>
                  <td className="p-2 font-family-tab">
                    {' '}
                    {activity.mro_quest_grp_id && activity.mro_quest_grp_id.name ? activity.mro_quest_grp_id.name : ''}
                    {' '}
                  </td>
                  <td className="p-2 font-family-tab">{getDefaultNoValue(activity.name)}</td>
                  <td className="p-2 font-family-tab">{getDefaultNoValue(getQuestionTypeLabel(activity.type))}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default PreviewPpmChecklist;
