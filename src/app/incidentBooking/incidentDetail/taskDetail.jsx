/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box } from "@mui/system";
import { Markup } from 'interweave';

import Documents from "../../commonComponents/documents";
import DetailViewHeader from "../../commonComponents/detailViewHeader";
import DetailViewTab from "../../commonComponents/detailViewTab";
import DetailViewLeftPanel from "../../commonComponents/detailViewLeftPanel";
import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
  truncateFrontSlashs,
  TabPanel,
  truncateStars,

} from '../../util/appUtils';
import { getTaskStateLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const TaskDetail = (props) => {
  const {
    detailData,
  } = props;
  const [value, setValue] = useState(0);
  const viewData = detailData || false;

  const { incidentDetailsInfo } = useSelector((state) => state.hxIncident);
  const { userInfo } = useSelector((state) => state.user);

  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;

  const isManagable = inspDeata && (inspDeata.state === 'Analyzed' || inspDeata.state === 'Remediated' || inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged' || inspDeata.state === 'Work in Progress');

  function isValidUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && inspDeata.probability_id && inspDeata.probability_id.remediate_authority_id && inspDeata.probability_id.remediate_authority_id.id && userRoleId === inspDeata.probability_id.remediate_authority_id.id) {
      res = true;
    }
    return res;
  }

  return (
    <>
      {viewData && (
        <Box>
          <DetailViewHeader
            // mainHeader={viewData && viewData.name
            // ? viewData.name : 'Task'}
            mainHeader={getDefaultNoValue(extractNameObject(viewData.task_type_id, 'name'))}
            status={getDefaultNoValue(getTaskStateLabel(detailData.state))}
            subHeader={
              <>
                {getDefaultNoValue(extractNameObject(viewData.assigned_id, 'name'))}
              </>
            }
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <DetailViewTab
                value={value}
                handleChange={(e, value) => setValue(value)}
                tabs={['Summary', 'Attachments']}
              />
              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: "Task Information",
                      leftSideData: [
                        /*{
                          property: "Task Type",
                          value: getDefaultNoValue(extractNameObject(viewData.task_type_id, 'name'))
                        },
                        {
                          property: "Title",
                          value: getDefaultNoValue((viewData.name))
                        },
                        {
                          property: "Assigned To",
                          value: getDefaultNoValue(extractNameObject(viewData.assigned_id, 'name'))
                        },*/
                        {
                          property: "Target Date",
                          value: getDefaultNoValue(getCompanyTimezoneDate(viewData.target_date, userInfo, 'datetime'))
                        },
                        {
                          property: "Description",
                          value: <Markup content={truncateFrontSlashs(truncateStars(viewData.description))} />
                        }
                        /*{
                          property: "Status",
                          value: getDefaultNoValue(getTaskStateLabel(detailData.state))
                        },*/
                      ]
                    }]}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Documents
                  viewId={viewData.id}
                  reference={viewData.name}
                  resModel="hx.incident_analysis"
                  model={appModels.DOCUMENT}
                  isManagable={isManagable && isValidUser()}
                />
              </TabPanel>
            </Box>
          </Box>
        </Box>
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
