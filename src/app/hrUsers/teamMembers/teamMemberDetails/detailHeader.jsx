import {
  faCheckCircle,
  faTimesCircle,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import {
  Row,
  Col,
  Table,
} from 'reactstrap';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, IconButton, Menu, MenuItem, Drawer, Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import Loader from '@shared/loading';
import { Box } from '@mui/system';
import teamMemberIcon from '@images/teamMemberBlue.svg';
import ErrorContent from '@shared/errorContent';
import { BsThreeDotsVertical } from 'react-icons/bs';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddUser from '../../../adminSetup/companyConfiguration/addUser/addUser';
import ActionMembers from '../../../adminSetup/siteConfiguration/actionMembers';
import customData from '../../../adminSetup/siteConfiguration/teamMemberDetails/data/customData.json';
import { getUserDetails, resetCreateTeam } from '../../../adminSetup/setupService';
import Teams from '../../../adminSetup/siteConfiguration/teamMemberDetails/teams';
import DetailViewHeader from '../../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../../commonComponents/detailViewTab';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { UsersStatusJson } from '../../../commonComponents/utils/util';
import {
  resetActionData,
} from '../../../workorders/workorderService';
import actionCodes1 from '../../../adminSetup/data/actionCodes.json';
import {
  extractTextObject, getAllowedCompanies,
  getArrayFromValuesByIdIn,
  getListOfModuleOperations,
  getDefaultNoValue,
  getListOfOperations, TabPanel, generateErrorMessage,
} from '../../../util/appUtils';
import actionCodes from '../../data/actionCodes.json';
import UpdatePassword from './updatePassword/updatePassword';

const appModels = require('../../../util/appModels').default;

const DetailHeader = ({ onAddReset, closeEditModal, isAdminSetup }) => {
  const { userDetails, allowedCompanies } = useSelector((state) => state.setup);
  const defaultActionText = 'Team Member Actions';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updatePasswordModal, showUpdatePasswordModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [editId, setEditId] = useState([]);
  const [editData, setEditData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const companies = getAllowedCompanies(userInfo);
  const [value, setValue] = useState(0);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');
  const loading = userDetails && userDetails.loading;
  const detailData = userDetails && userDetails.data && userDetails.data.length > 0 ? userDetails.data[0] : false;
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const faIcons = {
    APPROVE: faCheckCircle,
    APPROVEACTIVE: faCheckCircle,
    CANCEL: faTimesCircle,
    CANCELACTIVE: faTimesCircle,
    'CHANGE PASSWORD': faKey,
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      showActionModal(true);
    }
  }, [enterAction]);

  const PasswordHeading = useMemo(() => (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <div className="ml-2" style={{ fontWeight: '600' }}>
          Please create a strong password
        </div>
        <p className="ml-2">
          Minimum 8 Characters
        </p>
      </Col>
    </Row>
  ), []);

  function checkActionAllowed(actionName) {
    let allowed = false;
    const whState = userDetails && userDetails.data ? userDetails.data[0].state : '';
    if (whState === 'Cancelled') {
      allowed = false;
    }
    if (actionName === 'Change Password' && allowedOperations.includes(actionCodes['Change Password'])) {
      allowed = true;
    }
    if (actionName === 'Approve' && (whState === 'Registered')) {
      allowed = true;
    }
    if (actionName === 'Cancel' && (whState === 'Registered' || whState === 'Approved')) {
      allowed = true;
    }
    return allowed;
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchActionItem = (action) => {
    handleClose();
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    if (action.displayname === 'Change Password') {
      showUpdatePasswordModal(true);
    }
  };
  const atFinish = () => {
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, detailData.id));
  };

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

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = ['General', 'Teams'];

  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const selectedCompanies = getArrayFromValuesByIdIn(userCompanies, detailData.company_ids, 'id');
  const isParent = userInfo && userInfo.data && userInfo.data.is_parent;

  const isSiteEdit = allowedOperations.includes(actionCodes['Edit Site Team Member']);

  const isEditable = (isParent && (allowedOperations.includes(actionCodes['Edit Team Member']) || (allowedOperations1.includes(actionCodes1['Edit User'])))) || isSiteEdit;

  return (
    <>
      {userDetails && userDetails.loading && <Loader />}
      {
        userDetails && userDetails.err && (
          <ErrorContent errorTxt={generateErrorMessage(userDetails)} />
        )
      }
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
                  {/* {allowedOperations.includes(actionCodes['Add Comment']) && (
                    <Comments
                      detailData={userDetails}
                      model={appModels.TEAMMEMEBERS}
                      messageType="comment"
                      getDetail={getUserDetails}
                      setTab={setValue}
                      tab={value}
                    />
                  )}
                  {allowedOperations.includes(actionCodes.Close)
                    && checkActionAllowed(
                      'Close Ticket',
                      userDetails,
                    ) && (
                      <Button
                        type="button"
                        className="ticket-btn"
                        onClick={() => switchActionItem({
                          name: 'CANCEL',
                          displayname: 'Close',
                        })}
                      >
                        Close
                      </Button>
                  )} */}
                  {userDetails
                    && !userDetails.loading
                    && userDetails.data
                    && userDetails.data.length > 0
                    && userDetails.data[0].state
                    && userDetails.data[0].state.length > 0
                    && userDetails.data[0].state !== 'Cancelled'
                   && isEditable
                     && (
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
                         setEditId(detailData.id);
                         setEditData(detailData);
                       }}
                     >
                       Edit
                     </Button>
                     )}
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
                    {customData && customData.actionItems.map((actions) => (
                      checkActionAllowed(actions.displayname) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                          disabled={!checkActionAllowed(actions.displayname)}
                          onClick={() => switchActionItem(actions)}
                        >
                          {/* <img
                            src={faIcons[actions.name]}
                            alt="team"
                            className="mr-2"
                            height="15"
                            width="15"
                          /> */}
                          <FontAwesomeIcon
                            className="mr-2"
                            color="primary"
                            icon={faIcons[actions.name]}
                          />
                            {actions.displayname}
                        </MenuItem>
                      )
                    ))}
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
                        header: 'Basic Information',
                        leftSideData: [
                          {
                            property: 'Email',
                            value: getDefaultNoValue(detailData.email),
                          },
                          {
                            property: 'Mobile',
                            value: getDefaultNoValue(detailData.phone_number),
                          },
                          {
                            property: 'Department',
                            value: getDefaultNoValue(extractTextObject(detailData.hr_department)),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Allowed Sites',
                            value: (
                              <span className="font-weight-800">
                                {selectedCompanies && selectedCompanies.length > 0 && selectedCompanies.map((item, index) => (
                                  <span className="mr-1" key={item.id}>
                                    {item.name}
                                    {'  '}
                                    {selectedCompanies.length !== (index + 1) && (<span>,</span>)}
                                    {'  '}
                                  </span>
                                ))}
                                {selectedCompanies && selectedCompanies.length === 0 && (
                                <span className="mr-1">{getDefaultNoValue('')}</span>
                                )}
                              </span>
                            ),
                          },
                          {
                            property: 'Current Site',
                            value: (
                              <span className="font-weight-800">
                                <span className="mr-1">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
                              </span>
                            ),
                          },
                        ],
                      },
                      {
                        header: 'Additional Information',
                        leftSideData: [
                          {
                            property: 'Employee ID',
                            value: getDefaultNoValue(detailData.employee_id_seq),
                          },
                          {
                            property: 'Associates To',
                            value: getDefaultNoValue(detailData.associates_to),
                          },
                          {
                            property: 'Designation',
                            value: getDefaultNoValue(extractTextObject(detailData.designation_id)),
                          },
                          {
                            property: 'Mobile User Only',
                            value: (detailData.is_mobile_user ? 'Yes' : 'No'),
                          },
                          {
                            property: 'Vendor ID',
                            value: getDefaultNoValue(detailData.vendor_id_seq),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Bio-Metric ID',
                            value: getDefaultNoValue(detailData.biometric),
                          },
                          {
                            property: 'Shift',
                            value: getDefaultNoValue(extractTextObject(detailData.resource_calendar_id)),
                          },
                          {
                            property: 'Associate Entity',
                            value: getDefaultNoValue(extractTextObject(detailData.vendor_id)),
                          },
                          {
                            property: 'Is SOW Employee',
                            value: (detailData.is_sow_employee ? 'Yes' : 'No'),
                          },
                        ],
                      },
                    ]}
                  />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Teams />
                </TabPanel>
              </Box>
            </Box>
            {actionModal && (
            <ActionMembers
              atFinish={atFinish}
              actionText={actionText}
              actionCode={actionCode}
              details={userDetails}
              actionModal
            />
            )}
            <Drawer
              PaperProps={{
                sx: { width: '85%' },
              }}
              anchor="right"
              open={editLink}
            >
              <DrawerHeader
                headerName={isAdminSetup ? 'Edit User' : 'Edit Team Member'}
                imagePath={teamMemberIcon}
                onClose={() => { setEditLink(); }}
              />
              <AddUser
                closeModal={() => { closeEditModal(); setEditLink(); }}
                directToView={false}
                editData={editData}
                afterReset={() => { onAddReset(); setEditLink(); }}
                isDrawer
              />
            </Drawer>
            <Dialog size="md" open={updatePasswordModal}>
              <DialogHeader title={PasswordHeading} imagePath={false} onClose={() => { dispatch(resetCreateTeam()); dispatch(resetActionData()); showUpdatePasswordModal(false); }} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <UpdatePassword
                    afterReset={() => { dispatch(resetActionData()); dispatch(resetCreateTeam()); showUpdatePasswordModal(false); }}
                    memberId={detailData.id}
                    userId={detailData.user_id && detailData.user_id.length ? detailData.user_id[0] : false}
                  />
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </Box>
          {/* <Row className="mt-3 globalModal-header-cards">
                        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
                            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0 ml-2">
                                <CardBody className="p-2">
                                    <Row className="m-0">
                                        <Col sm="12" md="9" lg="9" xs="12" className="">
                                            <p className="mb-0 font-weight-500 font-tiny">
                                                NAME
                                            </p>
                                            <p className="mb-0 font-weight-700">
                                                {getDefaultNoValue(detailData.name)}
                                            </p>
                                        </Col>
                                        <Col sm="12" md="3" lg="3" xs="12" className="">
                                            <img
                                                aria-hidden="true"
                                                src={teamMemberIcon}
                                                alt="team"
                                                className="mt-3"
                                                width="30"
                                                height="30"
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
                            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                                <CardBody className="p-2">
                                    <Row className="m-0">
                                        <Col sm="12" md="9" lg="9" xs="12" className="">
                                            <p className="mb-0 font-weight-500 font-tiny">
                                                CURRENT USER ROLE
                                            </p>
                                            <p className="mb-0 font-weight-700">
                                                {getDefaultNoValue(extractTextObject(detailData.user_role_id))}
                                            </p>
                                        </Col>
                                        <Col sm="12" md="3" lg="3" xs="12" className="">
                                            <img src={locationBlack} alt="team" width="20" className="mt-3" />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
                            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                                <CardBody className="p-2">
                                    <Row className="m-0">
                                        <Col sm="12" md="9" lg="9" xs="12" className="">
                                            <p className="mb-0 font-weight-500 font-tiny">
                                                STATUS
                                            </p>
                                            <p className="mb-0 font-weight-700 text-info">
                                                {getDefaultNoValue(detailData.state)}
                                            </p>
                                        </Col>
                                        <Col sm="12" md="3" lg="3" xs="12" className="">
                                            <img src={logsIcon} alt="team" width="25" className="mt-3" />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
                            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0 mr-2">
                                <CardBody className="p-2">
                                    <Row className="m-0">
                                        <Col sm="12" md="10" lg="10" xs="12" className="">
                                            <p className="mb-0 font-weight-500 font-tiny">
                                                ACTIONS
                                            </p>
                                            {(!userDetails.loading) && (
                                                <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="mr-2 actionDropdown">
                                                    <DropdownToggle caret className={selectedActionImage !== '' ? 'bg-white text-navy-blue text-left pb-05 pt-05 font-11 rounded-pill'
                                                        : 'pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left'}>
                                                        {selectedActionImage !== ''
                                                            ? (
                                                                <FontAwesomeIcon
                                                                    className="mr-2"
                                                                    color="primary"
                                                                    icon={faIcons[`${selectedActionImage}`]}
                                                                />
                                                            ) : ''}
                                                        <span className="font-weight-700">
                                                            {selectedActions}
                                                            <FontAwesomeIcon size="sm" color="primary" className="float-right ml-1 mt-1" icon={faChevronDown} />
                                                        </span>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="w-100">
                                                        {customData && customData.actionItems.map((actions) => (
                                                            <>
                                                                {checkActionAllowed(actions.displayname) && (<>
                                                                    <DropdownItem
                                                                        id="switchAction"
                                                                        className="pl-2"
                                                                        key={actions.id}
                                                                        disabled={!checkActionAllowed(actions.displayname)}
                                                                        onClick={() => switchActionItem(actions)}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            className="mr-2"
                                                                            icon={faIcons[actions.name]}
                                                                        />
                                                                        {actions.displayname}
                                                                    </DropdownItem>
                                                                </>)}
                                                            </>
                                                        ))}
                                                    </DropdownMenu>
                                                </ButtonDropdown>
                                            )}
                                        </Col>
                                        <Col sm="12" md="2" lg="2" xs="12" className="">
                                            <img src={handPointerBlack} alt="asset" width="20" className="mt-3" />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>

                    </Row> */}
        </>
      )}
    </>
  );
};
export default DetailHeader;
