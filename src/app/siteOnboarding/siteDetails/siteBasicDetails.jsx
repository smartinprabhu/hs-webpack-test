/* eslint-disable import/no-unresolved */
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { useSelector } from 'react-redux';
import workpermitBlueIcon from '@images/icons/workPermitBlue.svg';
import pantryBlueIcon from '@images/icons/pantry/pantryBlue.svg';
import assetLogo from '@images/icons/asset.svg';
import helpdesk from '@images/icons/helpdesk.svg';
import workorder from '@images/icons/workOrders.svg';
import preventiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import inspectionChecklist from '@images/icons/inspectionChecklistBlue.svg';
import inventoryBlue from '@images/icons/inventoryBlue.svg';
import visitorLogo from '@images/icons/visitorpassBlue.svg';
import gatePassBlueIcon from '@images/icons/gatepass.svg';
import incident from '@images/icons/incidentManagement.svg';
import mailroomBlue from '@images/icons/mailroomBlue.svg';
import auditBlue from '@images/icons/auditBlue.svg';
import TrackerCheck from '@images/sideNavImages/auditSystem_blue.svg';
import * as PropTypes from 'prop-types';
import React from 'react';
import {
  Card,
  CardBody, Col,
  Row,
} from 'reactstrap';
import {
  generateErrorMessage,
} from '../../util/appUtils';
import HelpdeskInfo from './helpdesk/helpdeskInfo';
import InspectionScheduleInfo from './inspectionSchedule/inspectionScheduleInfo';
import WorkPermitInfo from './workPermit/workPermitInfo';
import PantryInfo from './pantryManagement/pantryInfo';
import AssetInfo from './asset/assetInfo';
import PreventiveMaintenanceInfo from './preventiveMaintenance/preventiveMaintenanceInfo';
import VisitorManagementInfo from './visitorManagement/visitorManagementInfo';
import MaintenanceInfo from './maintenance/maintenanceInfo';
import InventoryInfo from './inventory/inventoryInfo';
import GatePassInfo from './gatePass/gatePassInfo';
import IncidentInfo from './incident/incidentInfo';
import MailRoomInfo from './mailRoomManagement/mailRoomInfo';
import AuditSystemInfo from './auditSystem/auditSystemInfo';
import SlaKpiInfo from './slaKpi/slaKpiInfo';
import allowedModule from './allowedmodule.json';

const faIcons = {
  ASSET: assetLogo,
  HELPDESK: helpdesk,
  WORKORDER: workorder,
  INSPECTION: inspectionChecklist,
  PREVENTIVEMAINTENANCE: preventiveMaintenance,
  INVENTORY: inventoryBlue,
  VISITORMANAGEMENT: visitorLogo,
  WORKPERMIT: workpermitBlueIcon,
  PANTRYMANAGEMENT: pantryBlueIcon,
  GATEPASS: gatePassBlueIcon,
  INCIDENT: incident,
  MAILROOMMANAGEMENT: mailroomBlue,
  AUDITSYSTEM: auditBlue,
  SLAKPI: TrackerCheck,
};

const SiteBasicDetails = (props) => {
  const {
    detailData,
    setDetailViewClose,
  } = props;
  const {
    onBoardCopyInfo,
  } = useSelector((state) => state.site);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const componentName = {
    ASSET: <AssetInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    HELPDESK: <HelpdeskInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    WORKORDER: <MaintenanceInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    INSPECTION: <InspectionScheduleInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    PREVENTIVEMAINTENANCE: <PreventiveMaintenanceInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    INVENTORY: <InventoryInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    VISITORMANAGEMENT: <VisitorManagementInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    WORKPERMIT: <WorkPermitInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    PANTRYMANAGEMENT: <PantryInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    GATEPASS: <GatePassInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    INCIDENT: <IncidentInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    MAILROOMMANAGEMENT: <MailRoomInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    AUDITSYSTEM: <AuditSystemInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
    SLAKPI: <SlaKpiInfo detailData={viewData} setDetailViewClose={setDetailViewClose} />,
  };
  const onBoardData = onBoardCopyInfo && onBoardCopyInfo.data && onBoardCopyInfo.data.length ? onBoardCopyInfo.data : [];

  const listSelectedValues = (dataValue, col) => {
    const newArray = [];
    if (dataValue && dataValue.length && dataValue.length > 0) {
      for (let i = 0; i < dataValue.length; i += 1) {
        const newValue = dataValue[i][col].code;
        newArray.push(newValue);
      }
    }
    const value = newArray;
    return value;
  };

  const menuList = listSelectedValues(onBoardData, 'hx_onboard_module_id');

  return (
    <>
      {viewData && menuList && menuList.length && menuList.length > 0 ? (
        <div className="detailview-drawer cursor-pointer">
          <Row className="p-0 work-permit-overview transactions-cards">
            {menuList && menuList.length && menuList.map((menu) => (
              allowedModule && allowedModule.data && allowedModule.data[menu] && (
                <Col sm="12" md="4" xs="12" lg="4" className="p-1">
                  <Card className="h-100">
                    <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">
                      {' '}
                      <img src={faIcons[allowedModule.data[menu].name]} alt="assets" width="15" height="15" className="mb-1 mr-2" />
                      {allowedModule.data[menu].displayname}
                    </p>
                    <hr className="mb-0 mt-0 mr-2 ml-2" />
                    <CardBody className="p-0">
                      <div className="mt-1 pl-3">
                        {componentName[allowedModule.data[menu].name]}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )
            ))}
          </Row>
        </div>
      ) : ''}
      {
        detailData && detailData.loading && (
          <Card>
            <CardBody className="mt-4">
              <Loader />
            </CardBody>
          </Card>
        )
      }
      {
        (detailData && detailData.err) && (
          <Card>
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(detailData)} />
            </CardBody>
          </Card>
        )
      }
      {
        (menuList && !menuList.length) && (
          <Card>
            <CardBody>
              <ErrorContent errorTxt="Please select modules" />
            </CardBody>
          </Card>
        )
      }
    </>
  );
};

SiteBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailViewClose: PropTypes.func.isRequired,
};
export default SiteBasicDetails;
