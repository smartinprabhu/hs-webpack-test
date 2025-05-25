/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
} from '../../../util/appUtils';

import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';

const ValidatorsInfo = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
  <>
    <DetailViewLeftPanel
      panelData={[
        {
          header: 'VALIDATORS INFORMATION',
          leftSideData: [
            {
              property: 'Maker',
              value: detailData && detailData.maker_ids.map((mi) => (getDefaultNoValue(mi.name))),
            },
            {
              property: 'Checker',
              value: detailData && detailData.checker_ids.map((ci) => (getDefaultNoValue(ci.name))),
            },
            {
              property: 'Approver',
              value: detailData && detailData.approver_ids.map((ci) => (getDefaultNoValue(ci.name))),
            },
            {
              property: 'Second Level Approver',
              value: detailData && detailData.second_approver_ids.map((ai) => (
                <span key={ai.id} className="mr-2 p-0 font-weight-700 text-capital">{ getDefaultNoValue(ai.name) }</span>
              )),
            },
          ],
        },
      ]}
    />

    {/*  <Row>
      <Col sm="12" md="12" xs="12" lg="12">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Maker</span>
        </Row>
        <Row className="m-0">
          {detailData && detailData.maker_ids.map((mi) => (
            <span key={mi.id} className="mr-2 p-0 font-weight-700 text-capital">{ getDefaultNoValue(mi.name) }</span>
          ))}
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="12" xs="12" lg="12">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Checker</span>
        </Row>
        <Row className="m-0">
          {detailData && detailData.checker_ids.map((ci) => (
            <span key={ci.id} className="mr-2 p-0 font-weight-700 text-capital">{ getDefaultNoValue(ci.name) }</span>
          ))}
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="12" xs="12" lg="12">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Approver</span>
        </Row>
        <Row className="m-0">
          {detailData && detailData.approver_ids.map((ai) => (
            <span key={ai.id} className="mr-2 p-0 font-weight-700 text-capital">{ getDefaultNoValue(ai.name) }</span>
          ))}
        </Row>
      </Col>
    </Row>
    <p className="mt-2" /> */}
  </>
  )
  );
};

ValidatorsInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ValidatorsInfo;
