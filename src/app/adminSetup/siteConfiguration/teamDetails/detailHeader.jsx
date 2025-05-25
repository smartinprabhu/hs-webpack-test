/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import ErrorContent from '@shared/errorContent';
import teamsIcon from '@images/teamsBlue.svg';
import Loader from '@shared/loading';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Drawer, Button } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment-timezone';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import DetailViewHeader from '../../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../../commonComponents/detailViewTab';
import AddTeam from '../addTeam';
import {
  TabPanel,
  extractTextObject,
  getArrayFromValuesByIdIn,
  getDefaultNoValue, getListOfOperations, numToFloat, generateErrorMessage,
} from '../../../util/appUtils';
import Members from './members';
import Spaces from './spaces';

const DetailHeader = (props) => {
  const { closeEditModalWindow, onAddReset } = props;
  const defaultActionText = 'Team Actions';
  const dispatch = useDispatch();
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [editLink, setEditLink] = useState(false);
  const [editData, setEditData] = useState([]);
  const [modal, setModal] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { teamDetail, allowedCompanies } = useSelector((state) => state.setup);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const loading = teamDetail && teamDetail.loading;
  const detailData = teamDetail && teamDetail.data && teamDetail.data.length > 0 ? teamDetail.data[0] : false;

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  function checkActionAllowed(actionName) {
    let allowed = false;
    const whState = teamDetail && teamDetail.data ? teamDetail.data[0].state : '';
    if (whState === 'Cancelled') {
      allowed = false;
    }
    if (actionName === 'Approve' && (whState === 'Registered')) {
      allowed = true;
    }
    if (actionName === 'Cancel' && (whState === 'Registered' || whState === 'Approved')) {
      allowed = true;
    }
    return allowed;
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const checkUserTeamStatus = (val) => (
    <Box>
      {UsersStatusJson.map(
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
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = ['General', 'Team Members', 'Spaces'];
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  const selectedCompanies = getArrayFromValuesByIdIn(userCompanies, detailData.company_ids, 'id');

  return (
    <>
      {detailData && (
      <>
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailData.name)}
            status={
          detailData.state && detailData.state
            ? checkUserTeamStatus(detailData.state)
            : '-'
        }
            subHeader={(
              <>
                {detailData.create_date
              && userInfo.data
              && userInfo.data.timezone
                  ? moment
                    .utc(detailData.create_date)
                    .local()
                    .tz(userInfo.data.timezone)
                    .format('yyyy MMM Do, hh:mm A')
                  : '-'}
                {' '}
              </>
        )}
            actionComponent={(
              <Box>

                {teamDetail && teamDetail.data && teamDetail.data.length && (
                <Button
                  type="button"
                  variant="outlined"
                  sx={{
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                  }}
                  className="ticket-btn"
                  onClick={() => {
                    setEditLink(true);
                    handleClose(false);
                    setEditData(teamDetail && (teamDetail.data && teamDetail.data.length > 0) ? teamDetail.data[0] : false);
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
                      header: 'Basic Information',
                      leftSideData: [
                        {
                          property: 'Maintenance Costs Analytic Account',
                          value: getDefaultNoValue(extractTextObject(detailData.maintenance_cost_analytic_account_id)),
                        },
                        {
                          property: 'Working Time',
                          value: getDefaultNoValue(extractTextObject(detailData.resource_calendar_id)),
                        },
                        {
                          property: 'Hourly Labour Cost',
                          value: numToFloat(detailData.labour_cost_unit),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Responsible',
                          value: getDefaultNoValue(extractTextObject(detailData.responsible_id)),
                        },
                      ],
                    },
                  ]}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Members />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Spaces />
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </>
      )}
      {teamDetail && teamDetail.loading && <Loader />}
      {
        teamDetail && teamDetail.err && (
          <ErrorContent errorTxt={generateErrorMessage(teamDetail)} />
        )
      }
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editLink}
      >
        <DrawerHeader
          headerName="Update Team"
          imagePath={teamsIcon}
          onClose={() => {
            setEditLink(false);
            //  onViewReset();
          }}
        />
        <AddTeam
          closeModal={closeEditModalWindow}
          editData={editData}
          afterReset={() => { onAddReset(); setEditLink(false); }}
          isDrawer
        />
      </Drawer>

    </>
  );
};

DetailHeader.propTypes = {
};

DetailHeader.defaultProps = {
  isITAsset: false,
  categoryType: false,
};
export default DetailHeader;
