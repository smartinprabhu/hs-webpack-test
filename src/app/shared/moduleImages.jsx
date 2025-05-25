/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';

import Assets from '@images/sideNavImages/white/assets_white.svg';
import Audit from '@images/sideNavImages/white/auditSystem_white.svg';
import BuildingCompliance from '@images/sideNavImages/white/buildingCompliance_white.svg';
import Gatepass from '@images/sideNavImages/white/gatepass_white.svg';
import Helpdesk from '@images/sideNavImages/white/helpdesk_white.svg';
import Incident from '@images/sideNavImages/white/incident_white.svg';
import Inspection from '@images/sideNavImages/white/inspection_white.svg';
import Inventory from '@images/sideNavImages/white/inventory_white.svg';
import Mailroom from '@images/sideNavImages/white/mailroomManagement_white.svg';
import Pantry from '@images/sideNavImages/white/pantry_white.svg';
import PPM from '@images/sideNavImages/white/ppm_white.svg';
import Survey from '@images/sideNavImages/white/survey_white.svg';
import VMS from '@images/sideNavImages/white/vms_white.svg';
import Workorder from '@images/sideNavImages/white/workorder_white.svg';
import WorkPermit from '@images/sideNavImages/white/workpermit_white.svg';

const defaultIcon = {
  'SLA KPI': Audit,
  'Building Compliance': BuildingCompliance,
  'Work Permit': WorkPermit,
  Audit,
  'Visitor Management': VMS,
  Inventory,
  Mailroom,
  Incident,
  Pantry,
  Survey,
  Gatepass,
  '52 Week PPM': PPM,
  'HX Inspection Checklist': Inspection,
  Helpdesk,
  Assets,
  'Work Order': Workorder,
};

const ModuleImages = (props) => {
  const {
    moduleName,
  } = props;

  return (
    <img
      src={moduleName && defaultIcon[moduleName] ? defaultIcon[moduleName] : Assets}
      width="20"
      height="20"
      style={{ color: 'white', borderRadius: '50%' }}
      alt="highLight"
      id="Tooltip"
    />
  );
};

ModuleImages.propTypes = {
  moduleName: PropTypes.string.isRequired,
};

export default ModuleImages;
