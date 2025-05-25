/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  CardBody,
  CardTitle,
  Collapse,
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import {
  Grid, Card, CardContent, Typography, Box, CircularProgress,
} from '@mui/material';

import Occupancy from '@images/sideNavImages/occupancy_black.svg';
import completedIcon from '@images/inspection/completedIcon.svg';
import upcomingIcon from '@images/inspection/upcomingIcon.svg';
import scheduledIcon from '@images/inspection/scheduled_black.svg';
import missedIcon from '@images/inspection/missed.svg';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import {
  generateErrorMessage,
} from '../../util/appUtils';
import {
  newpercalculate,
} from '../../util/staticFunctions';
import {
  getInspectionTeamsDashboard,
} from '../../preventiveMaintenance/ppmService';
import { getDashboardFilters } from '../inspectionService';

import './complianceOverview.scss';
import customData from './data/customData.json';

const faIcons = {
  Scheduled: scheduledIcon,
  Completed: completedIcon,
  Upcoming: upcomingIcon,
  Missed: missedIcon,
};

const InspectionByTeam = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const { inspectionTeamsDashboard, inspectionDashboardDate } = useSelector((state) => state.ppm);

  const [isRedirect, setRedirect] = useState(false);

  const [teamCollapse, setTeamCollapse] = useState(false);

  useEffect(() => {
    if (inspectionDashboardDate && inspectionDashboardDate.data && teamCollapse) {
      const start = moment(inspectionDashboardDate.data[0]).utc().format('YYYY-MM-DD');
      const end = moment(inspectionDashboardDate.data[1]).utc().format('YYYY-MM-DD');
      // dispatch(getInspectionTeamsDashboard(start, end));
    }
  }, [inspectionDashboardDate, teamCollapse]);

  const onLoadViewer = (status, teams, name, count) => {
    if (count && status && status !== 'Scheduled') {
      const filters = [{
        customOptions: {
          label: 'Maintenance Team',
          value: 'maintenance_team_id',
        },
        customSelectedOptions: [{ id: teams, value: teams, label: name }],
        statusOptions: [
          {
            label: status,
            value: status,
          }],
        teams: [teams],
        status: [status],
        teamName: name,
        selectDate: inspectionDashboardDate && inspectionDashboardDate.data
          ? [moment(inspectionDashboardDate.data[0]).utc().format('YYYY-MM-DD'), moment(inspectionDashboardDate.data[1]).utc().format('YYYY-MM-DD')]
          : [],
      }];
      dispatch(getDashboardFilters(filters));
      setRedirect(true);
      history.push({ pathname: '/inspection-overview/inspection-viewer' });
    }
  };

  const colorClasses = customData.states;
  const stateCodes = customData.stateTeamList ? customData.stateTeamList : false;

  const isDataExists = (inspectionTeamsDashboard && inspectionTeamsDashboard.data && inspectionTeamsDashboard.data)
    && inspectionTeamsDashboard.data.filter((item) => (item.completed_count > 0 || item.missed_count > 0 || item.total_count > 0 || item.upcoming_count > 0));

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (inspectionTeamsDashboard && inspectionTeamsDashboard.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (inspectionTeamsDashboard && inspectionTeamsDashboard.err) ? generateErrorMessage(inspectionTeamsDashboard) : userErrorMsg;

  return (
    <Card className="p-2 box-shadow-grey by-teams-card h-100">
      <CardTitle className="mb-1 mt-1 bg-lightgrey cursor-pointer" onClick={() => setTeamCollapse(!teamCollapse)}>
        <h6 className="mt-1 mb-0 ml-2" style={{ fontSize: '15px', fontWeight: 'bold' }}>
          By Teams
          <span>
            {teamCollapse
              ? <FontAwesomeIcon className="float-right font-weight-300 mr-2" size="lg" icon={faAngleUp} />
              : <FontAwesomeIcon className="float-right font-weight-300 mr-2" size="lg" icon={faAngleDown} />}
          </span>
        </h6>
      </CardTitle>
      <Collapse isOpen={teamCollapse}>
        <CardBody className="pt-2 pl-0 pb-1 max-form-content thin-scrollbar">
          <Grid container spacing={2}>
            {inspectionTeamsDashboard
      && inspectionTeamsDashboard.data
      && !loading
      && inspectionTeamsDashboard.data.map((team) => (
        (team.completed_count > 0
          || team.missed_count > 0
          || team.total_count > 0
          || team.upcoming_count > 0) && (
          <Grid item xs={12} md={12} lg={6} key={team.id}>
            <Card sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, .125)', boxShadow:'none' }}>
              {' '}
              {/* bg-lightblue equivalent */}
              <Box sx={{
                backgroundColor: '#f8f9fa', p: 1, display: 'flex', alignItems: 'center',
              }}
              >
                {' '}
                {/* background-alice-grey */}
                <img src={Occupancy} className="mr-2" alt="Team" height="20" width="20" />
                <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: '600', color: '#666060' }}>{team.name}</Typography>
              </Box>
              <CardContent className='pb-1' sx={{ pt: 2 }}>
                <Grid container spacing={1}>
                  {team
                    && stateCodes
                    && stateCodes.map((sc) => (
                      <Grid
                        item
                        xs={12}
                        md={3}
                        lg={3}
                        key={sc.value}
                        sx={{
                          p: 1,
                          cursor:
                            team[sc.value] && sc.label !== 'Scheduled' ? 'pointer' : 'default',
                        }}
                        onClick={() => onLoadViewer(sc.label, team.id, team.name, team[sc.value])}
                      >
                        <Card sx={{ borderBottom: `2px solid ${colorClasses[sc.label].strokeObj.pathColor}` }}>
                          <CardContent sx={{ paddingBottom: '5px !important', textAlign: 'center' }}>
                            <img src={faIcons[sc.label]} alt="imae" height="16" width="16" />
                            <Typography
                              variant="h5"
                              sx={{
                                mt: 1,
                                mb: 0,
                                fontWeight: 800,
                                fontSize:'15px',
                                color: colorClasses[sc.label].strokeObj.pathColor,
                              }}
                            >
                              {team[sc.value]}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1,
                                fontSize: '0.75rem',
                                color: colorClasses[sc.label].strokeObj.pathColor,
                              }}
                            >
                              {sc.value !== 'total_count'
                                ? `${newpercalculate(team.total_count, team[sc.value])}%`
                                : '-'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1,
                                mb: 0,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: colorClasses[sc.label].strokeObj.pathColor,
                              }}
                            >
                              {sc.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )
      ))}
          </Grid>
          {loading && (
            <div className="mb-2 mt-3 p-5" data-testid="loading-case">
              <Loader />
            </div>
          )}
          {((inspectionTeamsDashboard && inspectionTeamsDashboard.err) || isUserError) && (
            <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
          )}
          {(inspectionTeamsDashboard && inspectionTeamsDashboard.data && isDataExists && isDataExists.length === 0) && (
            <ErrorContent errorTxt="No text" />
          )}
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default InspectionByTeam;
