/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import {
  Button,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import ComplianceCheck from '@images/icons/complianceCheck.svg';
import {
  getDefaultNoValue, getListOfOperations, truncate, extractNameObject, TabPanel, getCompanyTimezoneDate, numToValidFloatView,
} from '../../util/appUtils';
import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';

import actionCodes from '../data/complianceActionCodes.json';
import {
  getComplianceDetail,
} from '../complianceService';
import CreateCompliance from '../forms/createCompliance';

const appModels = require('../../util/appModels').default;

const faIcons = {
//   ESCALATETICKET: escalate,
//   ESCALATETICKETACTIVE: escalate,
};

const ComplianceDetails = ({
  onViewEditReset,
  editId,
  setEditId,
  isIncident,
  setViewModal,
  setParentTicket,
  setCurrentTicket,
}) => {
  const defaultActionText = 'Compliance Actions';

  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    complianceDetails,
  } = useSelector((state) => state.waste);
  const {
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const tabs = ['Overview', 'Document References'];

  const detailedData = complianceDetails && complianceDetails.data && complianceDetails.data.length
    ? complianceDetails.data[0]
    : false;

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [editModal, showEditModal] = useState(false);

  const closeEditModalWindow = () => {
    showEditModal(false);
  };

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) && (complianceDetails && complianceDetails.data)) {
      dispatch(getComplianceDetail(complianceDetails.data[0].id, appModels.WASTETRACKER));
    }
  }, [tenantUpdateInfo]);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const complianceData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : '';
  const viewData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : false;

  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={truncate(getDefaultNoValue(detailedData.operation), '30')}
            status=""
            subHeader={getDefaultNoValue(extractNameObject(detailedData.type, 'name'))}
            actionComponent={(
              <Box>
                {complianceDetails
                    && !complianceDetails.loading
                    && complianceDetails.data
                    && complianceDetails.data.length > 0
                    && allowedOperations.includes(actionCodes['Edit Compliance Obligation']) && (
                      <Button
                        type="button"
                        variant="outlined"
                        className="ticket-btn"
                        sx={{
                          backgroundColor: '#fff',
                          '&:hover': {
                            backgroundColor: '#fff',
                          },
                        }}
                        onClick={() => {
                          showEditModal(true);
                          handleClose(false);
                          setEditId(complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0].id : false);
                        }}
                      >
                        Edit
                      </Button>
                )}

              </Box>
              )}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              height: '100%',
            }}
          >
            <Box
              sx={{
                width: '100%',
              }}
            >
              <DetailViewTab
                value={value}
                handleChange={handleTabChange}
                tabs={tabs}
              />
              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: 'Waste Information',
                      leftSideData:
                          [
                            {
                              property: 'Weight (KG)',
                              value: numToValidFloatView(detailedData.weight),
                            },
                            {
                              property: 'Logged On',
                              value: getCompanyTimezoneDate(detailedData.logged_on, userInfo, 'datetime'),
                            },
                            {
                              property: 'Carried By',
                              value: getDefaultNoValue(detailedData.carried_by),
                            },
                            {
                              property: 'Security By',
                              value: getDefaultNoValue(detailedData.security_by),
                            },
                          ],
                      rightSideData:
                          [
                            {
                              property: 'Vendor',
                              value: getDefaultNoValue(detailedData.vendor),
                            },
                            {
                              property: 'Tenant',
                              value: getDefaultNoValue(detailedData.tenant),
                            },
                            {
                              property: 'Accompanied By',
                              value: getDefaultNoValue(detailedData.accompanied_by),
                            },
                          ],
                    },

                  ]}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Documents
                  viewId={detailedData.id}
                  ticketNumber={detailedData.name}
                  resModel={appModels.WASTETRACKER}
                  model={appModels.DOCUMENT}
                  complianceFormat
                />
              </TabPanel>

            </Box>
          </Box>
        </Box>
      )}
      <Drawer
        PaperProps={{
          sx: { width: '40%' },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Update Waste Tracker"
          imagePath={ComplianceCheck}
          onClose={closeEditModalWindow}
        />
        <CreateCompliance editId={editId} closeModal={closeEditModalWindow} />
      </Drawer>
    </>
  );
};
export default ComplianceDetails;
