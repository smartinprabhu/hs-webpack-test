/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import * as PropTypes from 'prop-types';
import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { Box } from "@mui/system";
//import tabs from './tabs.json';
import {
  getDefaultNoValue,
  getListOfOperations,
  htmlToReact,
  extractTextObject,
  extractNameObject,
  getAllCompanies,
  getCompanyTimezoneDate,
  truncateHTMLTags,
  TabPanel,
} from "../../util/appUtils";
import AuditLog from '../../assets/assetDetails/auditLog';
import LogNotes from './logNotes';
import AuditBasicDetails from './additionalDetails/auditBasicDetails';
import Assessments from './assessments';
import DrawerHeader from "../../commonComponents/drawerHeader";
import DetailViewHeader from "../../commonComponents/detailViewHeader";
import DetailViewTab from "../../commonComponents/detailViewTab";
import DetailViewRightPanel from "../../commonComponents/detailViewRightPanel";
import DetailViewLeftPanel from "../../commonComponents/detailViewLeftPanel";
import {
  cjStatusJson,
} from "../../commonComponents/utils/util";

import { newpercalculate } from '../../util/staticFunctions';
// import ScoreCard from './scorecard';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const AuditDetailTabs = (props) => {
  const { detailData, setSavedQuestions } = props;
  const [currentTab, setActive] = useState('');

  const tabs = ["Tracker Items", "Audit Log", "Additional Info"];

  const [value, setValue] = useState(0);
  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  useEffect(() => {
    if (detail) {
      setActive(detail && (detail.state === 'Submitted' || detail.state === 'Reviewed' || detail.state === 'Approved') ? 'Tracker Items' : 'Tracker Items');
    }
  }, [detailData]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const changeTab = (key) => {
    setActive(key);
  };
  const rangeData = detail && detail.tracker_lines && detail.tracker_lines.length ? detail.tracker_lines.filter((item) => !item.is_not_applicable && item.answer && item.mro_activity_id.type !== 'Computed') : false;

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  const percentage = newpercalculate(getTotalQtnsCount(), rangeData && rangeData.length ? rangeData.length : 0);


  function getTotalQtnsCount() {
    let res = 0;
    const totalData = detail && detail.tracker_lines && detail.tracker_lines.length ? detail.tracker_lines.filter((item) => !item.is_not_applicable && item.mro_activity_id.type !== 'Computed') : 0;
    res = totalData && totalData.length ? totalData.length : 0;
    return res;
  }

  const checkConsumptionStatus = (val) => {
    return (
      <Box>
        {cjStatusJson.map(
          (status) =>
            val === status.status && (
              <Box
                sx={{
                  backgroundColor: status.backgroundColor,
                  padding: "4px 8px 4px 8px",
                  border: "none",
                  borderRadius: "4px",
                  color: status.color,
                  fontFamily: "Suisse Intl",
                }}
              >
                {val}
              </Box>
            )
        )}
      </Box>
    );
  };

  return (
    <>
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
            handleChange={handleTabChange}
            tabs={tabs}
          />

          <TabPanel value={value} index={0}>
            <Assessments detailData={detailData} setSavedQuestions={setSavedQuestions} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <LogNotes />
            <div className="mt-3 mb-3" />
            <AuditLog ids={detail.message_ids} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AuditBasicDetails detailData={detail} />
          </TabPanel>
        </Box>


        {/* <Box
          sx={{
            width: "25%",
            height: "100%",
            backgroundColor: "#F6F8FA",
          }}
        >
          <DetailViewRightPanel
            panelOneHeader="PERIOD"
            panelOneLabel={getDefaultNoValue(detail.audit_for)}
            panelOneValue1={getDefaultNoValue(extractNameObject(detail.company_id, 'name'))}
            panelOneValue2={getDefaultNoValue(detail.mobile)}
            panelThreeHeader="Tracker Information"
            panelThreeData={[
              {
                header: "Status",
                value:
                  detail.state
                    ? checkConsumptionStatus(detail.state)
                    : "-",
              },
              {
                header: "COVERAGE",
                value:
                  <>
                   <p className="mb-0">
                      <span className="mb-0 font-weight-800 font-size-17px">
                      {rangeData && rangeData.length ? rangeData.length : 0}
                      </span>
                      <span className="mb-0 font-weight-500">
                        {`/ 
                        ${getTotalQtnsCount()}`}
                      </span>
                    </p>
                    <Progress value={percentage} color={getProgressColor(percentage)}>
                      {percentage}
                      {' '}
                      %
                    </Progress>
                  </>
              },
              /*{
                header: "Created on",
                value: getDefaultNoValue(
                  getCompanyTimezoneDate(
                    detail.created_on,
                    userInfo,
                    "datetime"
                  )
                ),
              },
              {
                header: "Start Date",
                value: getDefaultNoValue(
                  getCompanyTimezoneDate(
                    detail.start_date,
                    userInfo,
                    "datetime"
                  )
                ),
              },
              {
                header: "End Date",
                value: getDefaultNoValue(
                  getCompanyTimezoneDate(
                    detail.end_date,
                    userInfo,
                    "datetime"
                  )
                ),
              },
            ]}
          />
        </Box> */}
      </Box>
      {/* <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs activeKey={currentTab} onChange={changeTab}>
              {detail && (detail.state === 'Submitted' || detail.state === 'Reviewed' || detail.state === 'Approved') && (
                <>
                  {tabs && tabs.tabsSubList.map((tabData) => (
                    <TabPane tab={tabData.name} key={tabData.name} />
                  ))}
                </>
              )}
              {detail && (detail.state !== 'Submitted' && detail.state !== 'Reviewed' && detail.state !== 'Approved') && (
              <>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </>
              )}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Tracker Items'
                ? (
                  <Assessments detailData={detailData} setSavedQuestions={setSavedQuestions} />
                )
                : ''}
              { /* currentTab === 'Summary'
                ? (
                  <ScoreCard auditDetails={detail} />
                
                : '' *
              {currentTab === 'Audit Log'
                ? (
                  <>
                    <LogNotes />
                    <div className="mt-3 mb-3" />
                    <AuditLog ids={detail.message_ids} />
                  </>
                )
                : ''}
              {currentTab === 'Additional Info'
                ? (
                  <AuditBasicDetails detailData={detail} />
                )
                : ''}
            </div>
          </Col>
        </Row>
        <br />
      </CardBody>
      )}
      {detailData && detailData.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(detailData && detailData.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(detailData)} />
      </CardBody>
      )}
    </Card> */}
    </>
  );
};

AuditDetailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default AuditDetailTabs;
