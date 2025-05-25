import {
  IconButton,
  Menu,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  faArrowCircleRight,
  faCheckCircle,
  faStoreAlt,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuItem from '@mui/material/MenuItem';
import ErrorContent from '@shared/errorContent';
import { BsThreeDotsVertical } from 'react-icons/bs';

import Loader from '@shared/loading';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import OrderLines from '../pantryDetail/orderLines';

import {
  OrdersStatusJson,
} from '../../commonComponents/utils/util';
import {
  TabPanel,
  extractNameObject,
  generateErrorMessage,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfModuleOperations,
} from '../../util/appUtils';
import {
  resetUpdateParts,
} from '../../workorders/workorderService';
import ActionCodes from '../data/actionCodes.json';
import customData from '../data/customData.json';
import ActionPantry from '../pantryDetail/actionItems/actionPantry';

const faIcons = {
  Draft: faStoreAlt,
  Order: faCheckCircle,
  Confirm: faCheckCircle,
  Deliver: faArrowCircleRight,
  Cancel: faTimesCircle,
};

const PantryDetails = () => {
  const dispatch = useDispatch();
  const { pantryDetails } = useSelector((state) => state.pantry);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const [actionModal, showActionModal] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [actionHead, setActionHead] = useState('');
  const [actionMethod, setActionMethod] = useState('');
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const detailData = pantryDetails && pantryDetails.data && pantryDetails.data.length && pantryDetails.data[0];

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code');

  const tabs = ['Pantry Overview', 'Products'];
  const [value, setValue] = useState(0);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchStatus = (statusName, head, method, actions) => {
    setActionValue(statusName);
    setActionHead(head);
    setActionMethod(method);
    setSelectedActionImage(actions.heading);
    showActionModal(true);
    handleClose();
  };

  const cancelStateChange = () => {
    setAnchorEl(null);
    dispatch(resetUpdateParts());
  };

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const prState = detailData && detailData.state ? detailData.state : '';
    if (actionName === 'Ordered' && prState === 'Draft') {
      allowed = true;
    }
    if (actionName === 'Confirmed' && prState === 'Ordered') {
      allowed = true;
    }
    if (actionName === 'Delivered' && prState === 'Confirmed') {
      allowed = true;
    }
    if (actionName === 'Cancelled' && (prState === 'Draft' || prState === 'Ordered' || prState === 'Confirmed')) {
      allowed = true;
    }
    return allowed;
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const checkState = (val) => (
    <Box>
      {OrdersStatusJson.map(
        (status) => val === status.status && (
          <Box
            sx={{
              backgroundColor: status.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: status.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {val}
          </Box>
        ),
      )}
    </Box>
  );

  return (
    <>
      {detailData && (
      <Box>
        <DetailViewHeader
          mainHeader={getDefaultNoValue(detailData.name)}
          status={detailData.state ? checkState(detailData.state) : '-'}
          subHeader={(
            <>
              Space :
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.space_id, 'space_name'))}
              ,
              {' '}

              Location :
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}
            </>
                    )}
          actionComponent={(
            <Box>
              <IconButton
                sx={{
                  margin: '0px 5px 0px 5px',
                }}
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
              >
                <BsThreeDotsVertical color="#ffffff" />
              </IconButton>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {customData && customData.pantryStates && (
                  customData && customData.pantryStates.map((actions) => (
                    allowedOperations.includes(ActionCodes[actions.value]) && (
                      checkActionAllowed(actions.value) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                          onClick={() => switchStatus(actions.label, actions.heading, actions.methodName, actions)}
                        >
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faIcons[actions.heading]}
                          />
                          {actions.label}
                        </MenuItem>
                      )
                    )
                  ))
                )}
              </Menu>
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
                    header: 'General Information',
                    leftSideData: [
                      {
                        property: 'Location',
                        value: getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name')),
                      },
                      {
                        property: 'Employee Name',
                        value: detailData.order_create_type === 'External'
                          ? getDefaultNoValue(detailData.employee_name) : getDefaultNoValue(extractNameObject(detailData.employee_id, 'name')),
                      },

                    ],
                    rightSideData: [
                      {
                        property: 'Created From',
                        value: getDefaultNoValue(detailData.order_create_type),
                      },
                      {
                        property: 'Employee Email',
                        value: detailData.order_create_type === 'External'
                          ? getDefaultNoValue(detailData.employee_email) : getDefaultNoValue(extractNameObject(detailData.employee_id, 'work_email')),
                      },
                    ],
                  },
                  {
                    header: 'Pantry Information',
                    leftSideData: [
                      {
                        property: 'Pantry Name',
                        value: getDefaultNoValue(extractNameObject(detailData.pantry_id, 'name')),
                      },
                      {
                        property: 'Ordered On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailData.ordered_on, userInfo, 'datetime')),
                      },
                      {
                        property: 'Cancelled On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailData.cancelled_on, userInfo, 'datetime')),
                      },
                      {
                        property: (detailData.cancelled_on) && 'Reason for Cancellation by Pantry',
                        value: getDefaultNoValue(detailData.reason_for_cancellation_pantry),
                      },
                      {
                        property: (detailData.cleant_on) && 'Cleaned by',
                        value: getDefaultNoValue(extractNameObject(detailData.cleant_by, 'name')),
                      },
                    ],
                    rightSideData: [
                      {
                        property: ' Confirmed On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailData.confirmed_on, userInfo, 'datetime')),
                      },
                      {
                        property: ' Delivered On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailData.delivered_on, userInfo, 'datetime')),
                      },
                      {
                        property: (detailData.cancelled_on) && 'Reason for Cancellation by Employee',
                        value: getDefaultNoValue(detailData.reason_for_cancellation),
                      },
                      {
                        property: (detailData.cancelled_on) && 'Cancelled by',
                        value: getDefaultNoValue(extractNameObject(detailData.cancelled_by_id, 'name')),
                      },
                      {
                        property: (detailData.cleant_on) && 'Cleaned on',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailData.cleant_on, userInfo, 'datetime')),
                      },
                    ],
                  },
                  {
                    header: 'Company Information',
                    leftSideData: [
                      {
                        property: 'Company Name',
                        value: getDefaultNoValue(extractNameObject(detailData.company_id, 'name')),
                      },
                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <OrderLines />
            </TabPanel>
          </Box>
        </Box>
      </Box>
      )}
      {actionModal && (
      <ActionPantry
        atFinish={() => {
          showActionModal(false); cancelStateChange(); setSelectedActionImage('');
        }}
        actionValue={actionValue}
        actionHead={actionHead}
        actionMethod={actionMethod}
        details={pantryDetails}
        actionModal
      />
      )}
      {pantryDetails && pantryDetails.loading && <Loader />}
      {
        pantryDetails && pantryDetails.err && (
          <ErrorContent errorTxt={generateErrorMessage(pantryDetails)} />
        )
      }
    </>

  );
};
export default PantryDetails;
