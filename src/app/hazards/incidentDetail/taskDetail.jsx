/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import TaskBasicDetail from './taskBasicDetail';
import Documents from '../../commonComponents/documents';

const appModels = require('../../util/appModels').default;

const TaskDetail = (props) => {
  const {
    detailData,
  } = props;

  const viewData = detailData || false;

  const { incidentDetailsInfo } = useSelector((state) => state.hazards);
  const { userInfo } = useSelector((state) => state.user);

  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;

  const isManagable = inspDeata && (inspDeata.state === 'Analyzed' || inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged');

 /* function isValidUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && inspDeata.probability_id && inspDeata.probability_id.remediate_authority_id && inspDeata.probability_id.remediate_authority_id.id && userRoleId === inspDeata.probability_id.remediate_authority_id.id) {
      res = true;
    }
    return res;
  } */

  return (
    <>
      {viewData && (
      <Card className="bg-white mt-3">
        <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">TASK INFORMATION</p>
        <hr className="mb-0 mt-0 mr-2 ml-2" />
        <CardBody className="p-0">
          <div className="mt-1 pl-3">
            <TaskBasicDetail detailData={viewData} />
            <br />
            <Documents
              viewId={viewData.id}
              reference={viewData.name}
              resModel="hx.ehs_hazards_analysis"
              model={appModels.DOCUMENT}
              isManagable={isManagable}
            />
          </div>
        </CardBody>
      </Card>
      )}
    </>
  );
};

TaskDetail.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default TaskDetail;
