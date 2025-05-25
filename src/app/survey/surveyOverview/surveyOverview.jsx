import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import './surveyOverview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import ResponseSurvey from './responseSurvey';
import AnswerSurvey from './answerSurvey';
import { getMenuItems } from '../../util/appUtils';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const surveyOverview = () => {
  const subMenu = 'Insights';
  const module = 'Survey'
  const [isOldDashboard, setOldDashboard] = useState(false)
  const { userRoles } = useSelector((state) => state.user);
  const { surveyDashboard } = useSelector((state) => state.survey);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);
  if (!isMenu) {
    return (<Redirect to="/survey" />);
  }

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'surveyOverview' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'surveyOverview-mainCard' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'surveyOverview-survey' : ''}`}>
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
            {isOldDashboard && (
              <>
                <Insights surveyDashboard={surveyDashboard} />
                <Row className="m-0 p-3 surveyOverview-graphs">
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0 surveyOverview-ResponseSurvey">
                    <ResponseSurvey surveyDashboard={surveyDashboard} />
                  </Col>
                </Row>
                <Row className="m-0 p-3 surveyOverview-graphs">
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0 surveyOverview-AnswerSurvey">
                    <AnswerSurvey surveyDashboard={surveyDashboard} />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0 surveyOverview-alarms asset-insight-notifications">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12">
                  <Notifications modelName={appModels.SURVEY} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default surveyOverview;
