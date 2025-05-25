/* eslint-disable max-len */
/* eslint-disable no-undef */
// recommended by webpacker
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { LicenseInfo } from '@mui/x-license-pro';

// Import dependencies

import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import MUIThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'antd/dist/antd.less';
import 'antd/dist/antd.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import store from './store';
import * as serviceWorker from './serviceWorker';
import Components from './componentIndex';
import './index.scss';
import './oldIndex.scss';
import { AddThemeColor } from './app/themes/theme';
import { ThemeProvider } from './app/ThemeContext'; // Import your custom ThemeProvider

const appConfig = require('./app/config/appConfig').default;

// Import media
require.context('@images', true);

const MUILICENSEKEY = appConfig.MUI_LICENSE_KEY;

LicenseInfo.setLicenseKey(MUILICENSEKEY);

const theme = createTheme({
  palette: {
    primary: {
      main: AddThemeColor({}).color,
    },
    secondary: {
      main: '#fff',
    },
  },
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-container');
  const root = ReactDOM.createRoot(container);

  const windowPath = window.location.pathname;
  const whiteList = ['/accountlogin', '/visitorpass', '/visitapproval', '/visitinvitation', '/visitorpass/companylevel', '/survey/', '/ticket/', '/feedback', '/wp', '/audit/', '/saml/signin', '/airquality-dashboard', '/teammember/invitation', '/oneqr', '/public-occupancy', '/52week/external', 'inspection-viewer/', '/audit-checklists/perform'];
  const pathExist = whiteList.includes(windowPath);
  const visitorExist = (windowPath.search('/visitorpass') !== -1) || (windowPath.search('/visitapproval') !== -1) || (windowPath.search('/visitorpass/companylevel') !== -1) || (windowPath.search('/visitinvitation') !== -1);
  const feedbackExists = (windowPath.search('/survey/') !== -1);
  const externalHelpdeskExists = (windowPath.search('/ticket/') !== -1);
  const feedbackSurveyExists = (windowPath.search('/feedback') !== -1);
  const wpApprovalExists = (windowPath.search('/wp') !== -1);
  const gpApprovalExists = (windowPath.search('/gp') !== -1);
  const auditExists = (windowPath.search('/audit/') !== -1);
  const jumpcloudExists = (windowPath.search('/saml/signin') !== -1);
  const aqDashboardExists = (windowPath.search('/airquality-dashboard') !== -1);
  const teamMemberInvitationExists = (windowPath.search('/teammember/invitation') !== -1);
  const oneQRExists = (windowPath.search('/oneqr') !== -1);
  const publicOccExists = (windowPath.search('/public-occupancy') !== -1);
  const accountLoginExists = (windowPath.search('/accountlogin') !== -1);
  const externalPPMExists = (windowPath.search('/52week/external') !== -1);
  const externalInspectionExists = (windowPath.search('inspection-viewer/') !== -1);
  const externalAuditPerformExists = (windowPath.search('/audit-checklists/perform') !== -1);

  const isNotPublic = !pathExist && !visitorExist && !feedbackExists && !externalHelpdeskExists
  && !feedbackSurveyExists && !wpApprovalExists && !auditExists && !jumpcloudExists && !gpApprovalExists && !aqDashboardExists && !teamMemberInvitationExists && !oneQRExists && !publicOccExists && !accountLoginExists && !externalPPMExists;

  const type = isNotPublic ? 'Internal' : 'External';
  const ComponentToRender = Components[type];

  root.render(
    <Provider store={store}>
      <CookiesProvider>
        <ThemeProvider>
          {' '}
          {/* Wrap with your custom ThemeProvider */}
          <MUIThemeProvider theme={theme}>
            <CssBaseline>
              <ComponentToRender />
            </CssBaseline>
          </MUIThemeProvider>
        </ThemeProvider>
      </CookiesProvider>
    </Provider>,
  );
});

serviceWorker.register();
