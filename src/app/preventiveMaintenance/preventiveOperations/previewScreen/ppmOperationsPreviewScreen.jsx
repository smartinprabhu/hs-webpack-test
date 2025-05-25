/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { useFormikContext } from 'formik';
import { Row, Col, Table } from 'reactstrap';

import {
  getDefaultNoValue, extractTextObject,
} from '@util/appUtils';
import { getPpmCategoryLabel } from '../../utils/utils';

const PpmOperationsPreviewScreen = () => {
  const { values: formValues } = useFormikContext();

  return (
    <>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">Maintenance Information</span>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Title</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.name)}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.type_category ? formValues.type_category.label : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Maintenance Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.maintenance_type ? formValues.maintenance_type.label : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Asset Category</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.asset_category_id && formValues.asset_category_id.name ? formValues.asset_category_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Equipment Category</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.category_id && formValues.category_id.path_name ? formValues.category_id.path_name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Duration (Hours)</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.order_duration)}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
      {formValues.check_list_ids && formValues.check_list_ids.length > 0 && (
      <>
        <span className="d-inline-block pb-1 mb-2 font-weight-bold">PPM Check List</span>
        <Row className="mb-3">
          <Col lg={12}>
            <Table responsive id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    Chek lists
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Type
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Asset
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {formValues.check_list_ids && formValues.check_list_ids.map((checkListData, index) => (
                  <tr key={index}>
                    <td>
                      {extractTextObject(checkListData.check_list_id)}
                    </td>
                    <td>
                      {getPpmCategoryLabel(checkListData.category_type && checkListData.category_type.length > 0 ? checkListData.category_type[0] : '')}
                    </td>
                    <td>
                      {checkListData.category_type && checkListData.category_type.length > 0 && checkListData.category_type[0] === 'e'
                        ? getDefaultNoValue(extractTextObject(checkListData.equipment_id)) : getDefaultNoValue(extractTextObject(checkListData.location_id))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr className="m-1" />
          </Col>
        </Row>
      </>
      )}
      {formValues.tool_ids && formValues.tool_ids.length > 0 && (
      <>
        <span className="d-inline-block pb-1 mb-2 font-weight-bold">PPM Tools</span>
        <Row className="mb-3">
          <Col xs={12} sm={6} md={6} lg={6}>
            {formValues.tool_ids && formValues.tool_ids.map((toolListData, index) => (
              <span className="font-weight-500" key={index}>
                {toolListData.name}
                ,
                {' '}
              </span>
            ))}
            <hr className="m-1" />
          </Col>
        </Row>
      </>
      )}
      {formValues.parts_lines && formValues.parts_lines.length > 0 && (
      <>
        <span className="d-inline-block pb-1 mb-2 font-weight-bold">PPM Parts</span>
        <Row className="mb-3">
          <Col lg={12}>
            <Table responsive id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    Spare Part
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Quantity
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Short Description
                  </th>
                  <th className="p-2 w-25 border-0">
                    Product Type
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Product Category
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {formValues.parts_lines && formValues.parts_lines.map((partLines, index) => (
                  <tr key={index}>
                    <td>
                      {extractTextObject(partLines.parts_id)}
                    </td>
                    <td>
                      {partLines.parts_qty}
                    </td>
                    <td>
                      {partLines.name}
                    </td>

                    <td>
                      {partLines.parts_type}
                    </td>
                    <td>
                      {partLines.parts_categ_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr className="m-1" />
          </Col>
        </Row>
      </>
      )}
    </>
  );
};

export default PpmOperationsPreviewScreen;
