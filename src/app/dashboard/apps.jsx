/* eslint-disable import/no-unresolved */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import handPointer from '@images/icons/handPointer.svg';
import asset from '@images/icons/asset.svg';
import spaceManagement from '@images/icons/spaceManagement.svg';
import helpdesk from '@images/icons/helpdesk.svg';
import preventiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import workOrders from '@images/icons/workOrders.svg';
import purchase from '@images/icons/purchase.svg';
import adminSetup from '@images/icons/adminSetup.svg';
import analytics from '@images/icons/analytics.svg';
import smartClean from '@images/icons/assetBlue.svg';
import inventoryBlue from '@images/icons/inventoryBlue.svg';
import iotSystem from '@images/icons/iotSystem.svg';
import incident from '@images/icons/incidentManagement.svg';
import audit from '@images/icons/audit.svg';
import predictiveMaintenance from '@images/icons/predictiveMaintenance.svg';
import vendorManagement from '@images/icons/vendorManagement.svg';
import compliance from '@images/icons/complianceBlue.svg';
import visitorPass from '@images/icons/visitorpassBlue.svg';
import activeGreen from '@images/icons/activeGreen.svg';
import inspectionChecklistBlue from '@images/icons/inspectionChecklistBlue.svg';
import mailroomInnerBlue from '@images/icons/mailroomInnerBlue.svg';
import tankerBlue from '@images/icons/tankerBlue.svg';
import workPermitBlue from '@images/icons/workPermitBlue.svg';
import itAssetBlue from '@images/icons/itAssetBlue.svg';
import auditBlue from '@images/icons/auditBlue.svg';
import windyBlue from '@images/airquality/windyBlue.svg';
import breakdownBlue from '@images/icons/breakTrackerBlue.svg';

import pantryBlueIcon from '@images/icons/pantry/pantryBlue.svg';
import checklistSurveyBlue from '@images/icons/checklistSurveyBlue.svg';

import { getColumnArrayByIdCase } from '../util/appUtils';
import './dashboard.scss';
import appsList from '../data/apps.json';

const appIcon = {
  'Asset Registry': asset,
  'HSpace - Space Management': spaceManagement,
  Helpdesk: helpdesk,
  '52 Week PPM': preventiveMaintenance,
  'Work Orders': workOrders,
  'Admin Setup': adminSetup,
  Analytics: analytics,
  Purchase: purchase,
  Inventory: inventoryBlue,
  'IOT System': iotSystem,
  'Incident Management': incident,
  'Energy Management': predictiveMaintenance,
  'Smart Washroom': smartClean,
  'Audit & Compilance': audit,
  'Predictive Maintenance': predictiveMaintenance,
  'Vendor Management': vendorManagement,
  'Building Compliance': compliance,
  'Visitor Management': visitorPass,
  Survey: checklistSurveyBlue,
  'Pantry Management': pantryBlueIcon,
  'Inspection Schedule': inspectionChecklistBlue,
  'Mail Room Management': mailroomInnerBlue,
  'Commodity Transactions': tankerBlue,
  'Work Permit': workPermitBlue,
  'IT Asset Management': itAssetBlue,
  'Audit System': auditBlue,
  'Air Quality Monitoring': windyBlue,
  'Breakdown Tracker': breakdownBlue,
};

const Apps = () => {
  const { userRoles } = useSelector((state) => state.user);
  // const [showMore, setShowMore] = useState(false);

  const menuNames = getColumnArrayByIdCase(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'name');

  const sideNavMenus = userRoles && userRoles.data
    && (Object.keys(userRoles.data.allowed_modules).length !== 0 || userRoles.data.allowed_modules.length > 0)
    ? userRoles.data.allowed_modules : [];

  function getMenuDisplayname(name) {
    let menuDisplayName = '';
    sideNavMenus.map((data) => {
      if (data.name === name) {
        menuDisplayName = data.display;
      }
    })
    return menuDisplayName;
  }

  return (
    <>
      <Row className="m-0 Apps-list pr-3 pl-3 pt-0 pb-0">
        <Col md="12" lg="12" sm="12" xs="12" className="p-2">
          <h3 className="text-lightblue">
            <img src={handPointer} alt="handPointer" className="mr-2" />
            Apps
          </h3>
        </Col>
      </Row>
      <Row className="m-0 pr-3 pl-3 pt-0 pb-0 ml-4 app-list">
        {appsList && appsList.map((actions) => (
          (menuNames && (menuNames.includes(actions.name.toLowerCase()))) && (
            <Col md="6" lg="3" xs="12" sm="6" className="p-2" key={actions.id}>
              <Link to={actions.url} className="p-0">
                <Card className="apps">
                  <CardHeader className="text-right bg-white text-white" title="Active Application">
                    <img src={activeGreen} alt="activeapplication" />
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm="12" xs="12" md="12" lg="12" className="text-center">
                        <img src={appIcon[actions.name]} alt="actions" className="mr-2" height="35" width="35" />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12" xs="12" md="12" lg="12" className="text-center">
                        <div className="text-line-height-11 mt-1">
                          <small className="text-grey">{getMenuDisplayname(actions.name) ? getMenuDisplayname(actions.name) : actions.displayName}</small>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Link>
            </Col>
          )))}
        { /* appsList && appsList.map((actions) => (
          (menuNames && (!menuNames.includes(actions.name.toLowerCase()))) && (
          <Col md="6" lg="3" xs="12" sm="6" className="p-2" key={actions.id}>
            {showMore && (
            <Card className="bg-azure">
              <CardBody className="p-2 mt-2">
                <Row>
                  <Col sm="12" xs="12" md="12" lg="12" className="text-center">
                    <img src={appIcon[actions.name]} alt="actions" className="mr-2" height="35" width="35" />
                  </Col>
                </Row>
                <Row>
                  <Col sm="12" xs="12" md="12" lg="12" className="text-center">
                    <div className="text-line-height-11 mt-1">
                      <small className="text-grey">{actions.displayName}</small>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            )}
          </Col>
            ))) */ }
      </Row>
      {/* appsList && appsList.map((actions) => (
        (menuNames && (!menuNames.includes(actions.name.toLowerCase()))) && (
          <Row className="ml-0 mt-3 mr-3 float-right">
            {showMore ? (
              <div className="float-right mt-n4">
                <Button color="link" onClick={() => setShowMore(false)}>Show less</Button>
              </div>
            ) : (
              <div className="float-right mt-n4">
                <Button color="link" onClick={() => setShowMore(true)}>Show more</Button>
              </div>
            )}
          </Row>
            ))) */ }
    </>
  );
};
export default Apps;
