/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import {
  Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Result, Button } from 'antd';

import PageLoader from '@shared/pageLoader';
import FallBackLoaderCoponent from '@shared/componentsLoading';

import applicationDetails from './app/util/ClientDetails.json';
import Footer from './app/core/footer';
import InternalServerErr from './app/internalServerError/internalServerError';
import AuthService from './app/util/authService';

import './app.scss';

const appConfig = require('./app/config/appConfig').default;

const VisitorPass = lazy(() => import('./app/visitorRequest/basicInfo'));
const ExternalReport = lazy(() => import('./app/externalReport/externalReport'));
const VisitApproval = lazy(() => import('./app/visitorRequest/visitApproval'));
const WpApproval = lazy(() => import('./app/externalWorkPermit/publicWorkPermit'));
const PublicAudit = lazy(() => import('./app/publicAudit/basicInfo'));
const GatePassApproval = lazy(() => import('./app/externalGatePass/gatePassApproval'));
const CompanyVisitorPass = lazy(() => import('./app/companyLevelExternalVisitRequest/hostValidation'));
const HostVisitorPass = lazy(() => import('./app/visitRequestHost/basicInfo'));
const teamMemberInvitation = lazy(() => import('./app/memberPasswordUpdate/basicInfo'));
const OneQR = lazy(() => import('./app/externalOneQR/externalOneQR'));
const PantryOrder = lazy(() => import('./app/externalPantry/basicInfo'));

const SurveyForm = lazy(() => import('./app/feedback/basicInfo'));
const FeedbackForm = lazy(() => import('./app/feedbackSurvey/configuration'));

const JumpLogin = lazy(() => import('./app/auth/jumpLogin'));
const AccountIdLogin = lazy(() => import('./app/auth/accountIdLogin'));

// const ExternalOccupancy = lazy(() => import('./app/nocDashboards/assetsDashboard/dashboardPublicView'));
const ExternalPPM = lazy(() => import('./app/externalPPM/ppmSummary'));

const PublicApp = () => {
  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const serverError = authService.getServerError();
  const sessionExpiry = authService.getSessionExpiry();
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Simulate loading time
  }, []);

  const windowPath = window.location.pathname;
  const whiteList = ['/accountlogin', '/visitorpass', '/visitapproval', '/visitinvitation', '/visitorpass/companylevel', '/survey', '/ticket', '/feedback', '/wp', '/audit', '/saml/signin', '/airquality-dashboard', '/teammember/invitation', '/oneqr', '/public-occupancy', '/pantry-order', '/52week/external', '/inspection-overview'];
  const pathExist = whiteList.includes(windowPath);
  const visitorExist = (windowPath.search('/visitorpass') !== -1) || (windowPath.search('/visitapproval') !== -1) || (windowPath.search('/visitorpass/companylevel') !== -1) || (windowPath.search('/visitinvitation') !== -1);
  const feedbackExists = (windowPath.search('/survey') !== -1);
  const externalHelpdeskExists = (windowPath.search('/ticket') !== -1);
  const feedbackSurveyExists = (windowPath.search('/feedback') !== -1);
  const wpApprovalExists = (windowPath.search('/wp') !== -1);
  const gpApprovalExists = (windowPath.search('/gp') !== -1);
  const auditExists = (windowPath.search('/audit') !== -1);
  const jumpcloudExists = (windowPath.search('/saml/signin') !== -1);
  const aqDashboardExists = (windowPath.search('/airquality-dashboard') !== -1);
  const teamMemberInvitationExists = (windowPath.search('/teammember/invitation') !== -1);
  const oneQRExists = (windowPath.search('/oneqr') !== -1);
  const publicOccExists = (windowPath.search('/public-occupancy') !== -1);
  const accountLoginExists = (windowPath.search('/accountlogin') !== -1);
  const pantryExists = (windowPath.search('/pantry-order') !== -1);
  const externalPPMExists = (windowPath.search('/52week/external') !== -1);
  const externalInspectionExists = (windowPath.search('/inspection-overview') !== -1);

  useEffect(() => {
    const favicon = document.getElementById('favicon');
    applicationDetails.map((details) => {
      if (details.client === appConfig.CLIENTNAME) {
        document.title = details.title;
        favicon.setAttribute('href', details.favicon);
      }
    });
  }, []);

  const isBasePath = !!(appConfig.BASE_PATH && appConfig.BASE_PATH.includes('/v3'));

  useEffect(() => {
    authService.clearServerError();
    if (!isAuthenticated && !accountLoginExists && !pathExist && !visitorExist && !feedbackExists && !externalHelpdeskExists && !feedbackSurveyExists && !wpApprovalExists && !auditExists && !jumpcloudExists && !gpApprovalExists && !aqDashboardExists && !teamMemberInvitationExists && !oneQRExists && !publicOccExists && !pantryExists && !externalPPMExists && !externalInspectionExists) {
      window.location.pathname = isBasePath ? '/v3' : '/';
    }
  }, [isAuthenticated, pathExist]);

  const ErrorFallback = ({ resetErrorBoundary }) => (
    <div role="alert" className="p-3 text-center">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button onClick={resetErrorBoundary} type="primary">Try again</Button>}
      />
    </div>
  );

  let publicUrlCondition = false;

  if (ISAPIGATEWAY === 'true') {
    publicUrlCondition = ((!isAuthenticated) || (!sessionExpiry) || (sessionExpiry !== '1'));
  } else {
    publicUrlCondition = ((!isAuthenticated) || (!sessionExpiry) || (sessionExpiry !== '1'));
  }

  return (
    <div>
      {!loading && (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
      >
        <Suspense fallback={<FallBackLoaderCoponent />}>
          <Router basename={isBasePath ? '/v3' : '/'}>
            <Switch>
              <Route exact path="/accountlogin/:accountid" component={AccountIdLogin} />
              <Route exact path="/visitorpass/:uuid" component={VisitorPass} />
              <Route exact path="/visitapproval/:uuid" component={VisitApproval} />
              <Route exact path="/survey/:uuid" component={SurveyForm} />
              <Route exact path="/ticket/:uuid" component={ExternalReport} />
              <Route exact path="/feedback/:uuid/:c_uuid/:ruuid/:type" component={FeedbackForm} />
              <Route exact path="/wp/:suuid/:ruuid" component={WpApproval} />
              <Route exact path="/audit/:uuid/:suuid" component={PublicAudit} />
              <Route exact path="/saml/signin" component={JumpLogin} />
              <Route exact path="/gp/:suuid/:ruuid" component={GatePassApproval} />
              <Route exact path="/visitorpass/companylevel/:uuid" component={CompanyVisitorPass} />
              <Route exact path="/visitinvitation/:uuid" component={HostVisitorPass} />
              <Route exact path="/teammember/invitation/:uuid" component={teamMemberInvitation} />
              <Route exact path="/oneqr/:uuid" component={OneQR} />
              { /* <Route exact path="/public-occupancy/dashboard/:uuid" component={ExternalOccupancy} /> */ }
              <Route exact path="/pantry-order/:uuid" component={PantryOrder} />
              <Route exact path="/52week/external/:uuid" component={ExternalPPM} />
            </Switch>
          </Router>
        </Suspense>
      </ErrorBoundary>
      )}
      {loading && (
      <div className="main-layout" id="app-main-content">
        <div className="lazy-loader-box">
          <PageLoader type="max" />
        </div>
      </div>
      )}
      {!loading && serverError && (
        <div>
          <Router basename={isBasePath ? '/v3' : '/'}>
            <div className="main-content">
              <Switch>
                <Route exact path="/server-error" component={InternalServerErr} />
              </Switch>
            </div>
          </Router>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PublicApp;
