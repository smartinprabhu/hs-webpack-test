/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import {
  Row, Col, Card, CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import UserActionsImage from '@images/actionsBackground.svg';
import bookingIcon from '@images/myBookingsBlue.ico';
import guestIcon from '@images/myGuestsBlue.ico';
import ticketIcon from '@images/covidIncidentBlue.ico';
import userActionsData from '../data/userActions.json';
import './dashboard.scss';
import {
  getListOfOperations,
} from '../util/appUtils';
import actionCodes from '../booking/data/bookingAccess.json';

const iconsJson = {
  'Bookings in calendar view': bookingIcon,
  'My Guests': guestIcon,
  'Raise A Ticket': ticketIcon,
};

const UserActions = () => {
  const history = useHistory();
  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const isCovidInfoObj = (userRoles && userRoles.data
    && userRoles.data.covid && userRoles.data.covid.enable_covid_config);
  const isGeneralObj = () => (userRoles && userRoles.data && userRoles.data.general);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const routeChange = (route, name) => {
    if (name === 'Bookings in calendar view') history.push(route);
    if (name === 'My Guests') history.push(route);
    if (name === 'Raise A Ticket') history.push(route);
  };
  const action = (actions) => (
    <Card className="mt-3" key={actions.id}>
      <CardBody className="p-3">
        <Row onClick={() => routeChange(actions.route, actions.name)}>
          <Col className="d-flex" sm={isCovidInfoObj ? '10' : '10'} md={isCovidInfoObj ? '10' : '10'} lg={isCovidInfoObj ? '10' : '10'} xs="10">
            <img src={iconsJson[actions.name]} width="45" height="45" alt="actions" />
            <h3 className="mt-2 ml-2 cursor-pointer font-weight-700 pr-0 myActions">{actions.name}</h3>
          </Col>
          {/* <Col sm={isCovidInfoObj ? '8' : '8'} md={isCovidInfoObj ? '8' : '8'} lg={isCovidInfoObj ? '8' : '8'} xs="7" className="pl-0">
            <h3 className="mt-2 ml-2 cursor-pointer font-weight-700 pr-0 myActions">{actions.name}</h3>
          </Col> */}
          <Col sm="2" md="2" lg="2" xs="2">
            <ChevronRightIcon className="float-right mt-2 font-size-30px" />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );

  return (
    <Row className="bg-azure rounded m-0 p-3 user-actions dashboardTileHeight h-100">
      <Col sm={isCovidInfoObj ? '7' : '10'} md={isCovidInfoObj ? '7' : '10'} lg={isCovidInfoObj ? '7' : '10'}>
        {!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent) ? (
          <>
            <h2>My Actions</h2>
            {userActionsData && userActionsData.data.map((actions) => (
              <React.Fragment key={actions.id}>
                {actions.name === 'Raise A Ticket' ? (
                  <>
                    {isGeneralObj.enable_raise_ticket && (
                    <>{action(actions)}</>
                    )}
                  </>
                ) : (
                  <>
                    {allowedOperations.includes(actionCodes[actions.name]) && (
                      action(actions)
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </>
        ) : ' '}
      </Col>
      {userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent ? (
        <div sm={isCovidInfoObj} className="ml-11 mb-2 mybookings">
          <img
            src={UserActionsImage}
            height="140"
            className="mt-auto w-inherit"
            alt="Helixsense Portal"
          />
        </div>
      )
        : (
          <Col sm={isCovidInfoObj ? '5' : '12'} className="ml-11 mb-2 p-0 float-right">
            <img
              src={UserActionsImage}
              height="140"
              className="mt-auto w-inherit"
              alt="Helixsense Portal"
            />
          </Col>
        )}
    </Row>
  );
};

export default UserActions;
