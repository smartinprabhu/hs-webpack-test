/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  CardBody,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap';
import {
  Button, Box, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Form, Formik } from 'formik';

import profileInfo from '@images/profileInfo.png';
import profileInfoActive from '@images/profileInfoActive.png';
import building from '@images/userBuilding.png';
import buildingActive from '@images/userBuildingActive.png';
import userImage from '@images/userProfile.jpeg';
import Loader from '@shared/loading';
import PageLoader from '@shared/pageLoader';
import guestLogo from '@images/guestLogo.png';
import MuiTooltip from '@shared/muiTooltip';

import guestTableData from '../data/guestTableData.json';
import {
  updateUserProfileImage, resetUpdateImageData, resetDeleteGuest, deleteGuest, updateUserLanguage, resetLanguageData,
  getGuestList,
} from './userProfileService';
import './userProfile.scss';
import { bytesToSize } from '../util/staticFunctions';
import { detectMimeType, trimJsonObject } from '../util/appUtils';
import AuthService from '../util/authService';
import { getUserDetails } from '../user/userService';
import UpdatePassword from '../adminSetup/companyRegistration/updatePassword/updatePassword';

import checkoutFormModel from './checkoutFormModel';
import formInitialValues from './formInitialValues';
import MuiTextField from '../commonComponents/formFields/muiTextField';
import DialogHeader from '../commonComponents/dialogHeader';
import { AddThemeColor } from '../themes/theme';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const UserProfile = () => {
  const {
    formId,
    formField: {
      firstName,
      lastName,
      email,
      mobile,
      password,
      company,
      designation,
      name,
    },
  } = checkoutFormModel;
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    updateImage, guestListInfo, deleteGuestList, updateLangInfo,
  } = useSelector((state) => state.userProfile);
  const { userTncInfo } = useSelector((state) => state.header);
  const guestTableFields = guestTableData.fields;
  const loading = (userInfo && userInfo.data && userInfo.data.loading) || (guestListInfo && guestListInfo.loading);
  const [currentTab, setActive] = useState('Contact Details');
  const [guest, setGuest] = useState({});
  const [guestDeleteData, setGuestDeleteData] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const authService = AuthService();
  const [documentReady, setDocumentReady] = useState('');
  const [show, setShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileImageSize, setFileImageSize] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [modalAlert, setModalAlert] = useState(false);
  const [finish, setFinish] = useState(false);
  const [openValues, setOpenValues] = useState([]);
  const [updatePasswordModal, showUpdatePasswordModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(false);
  const [guestModalDeleteOpen, setGuestModalDeleteOpen] = useState(false);
  const [editGuestModalOpen, setEditGuestModalOpen] = useState(false);
  const isUserError = userInfo && userInfo.data && userInfo.data.err;
  const showGuestEdit = false;

  const [profileImage, setProfileImage] = useState(false);

  const convertToBase64 = async (url, headers) => {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch image, status ${response.status}`);
      }
      const blob = await response.blob();

      // Ensure reader is properly awaited
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Store base64 data in local storage
      setProfileImage(base64Data);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      setProfileImage(false);
    }
  };

  const [show1, setShow1] = useState(false);
  const [errorShow1, setErrorShow1] = useState(false);

  const updateImageSuccess = updateImage && updateImage.data ? (updateImage.data.data || updateImage.data.status) : false;
  const updateLangSuccess = updateLangInfo && updateLangInfo.data ? (updateLangInfo.data.data || updateLangInfo.data.status) : false;

  const table_wrapper = {
    overflowY: 'scroll',
    height: 240,
  };

  const tableStyle = {
    width: '98%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  };

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };
  const errorToggle = () => setErrorShow(!errorShow);
  const toggleAlert = () => {
    setModalAlert(!modalAlert);
    setFinish(false);
    setEdit(false);
  };
  const toastToggle = () => setShow(!show);

  const toggleDeleteModal = () => {
    setGuestModalDeleteOpen(false);
  };

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.image_url) {
      const clogo = userInfo.data.image_url;
      /* const headers = {
        portalDomain: window.location.origin === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : window.location.origin,
      };
      convertToBase64(getBaseDomain(clogo), headers); */
      setProfileImage(`data:${detectMimeType(clogo)};base64,${clogo}`);
    } else {
      setProfileImage(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && currentTab === 'Guest List') {
      dispatch(getGuestList(userInfo.data.employee.id, ''));
    }
  }, [userInfo, currentTab]);

  const deleteGuestDetails = (guestDetails) => (
    <>
      {!(deleteGuestList && deleteGuestList.err && (deleteGuestList.err.message || deleteGuestList.err.error.message)) && (
        <tr>
          <td className="text-center font-weight-400">{guestDetails && guestDetails.name}</td>
          <td><span className="text-center font-weight-400">{guestDetails && guestDetails.email}</span></td>
          <td><span className="text-center font-weight-400">{guestDetails && guestDetails.phone_number ? guestDetails.phone_number : '-'}</span></td>
        </tr>
      )}
    </>
  );

  const oktoggleDeleteModal = () => {
    if (!(deleteGuestList && deleteGuestList.err)) {
      dispatch(getGuestList(userInfo.data.employee.id, ''));
    }
    dispatch(resetDeleteGuest());
    setGuestModalDeleteOpen(false);
  };

  const deleteGuestItem = () => {
    const employeeId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id;
    dispatch(deleteGuest(employeeId, guest));
    setGuestDeleteData(true);
  };
  const resetLangInfo = () => { dispatch(getUserDetails(authService.getAccessToken())); dispatch(resetLanguageData()); };

  useEffect(() => {
    if (show || errorShow) {
      let isMounted = true;
      setTimeout(() => {
        if (isMounted) {
          setShow(false);
          setEdit(false);
          setErrorShow(false);
        }
      }, 3000);
      setTimeout(() => {
        dispatch(resetUpdateImageData());
      }, 5000);
      return () => { isMounted = false; };
    }
  }, [show, errorShow]);

  useEffect(() => {
    if (show1 || errorShow1) {
      let isMounted = true;
      setTimeout(() => {
        if (isMounted) {
          setShow1(false);
          setErrorShow1(false);
        }
      }, 3000);
      return () => { isMounted = false; };
    }
  }, [show1, errorShow1]);

  useEffect(() => {
    if ((updateImageSuccess) || (updateImage && updateImage.err)) {
      setShow(true);
    }
  }, [updateImage]);

  useEffect(() => {
    if ((updateLangSuccess) || (updateLangInfo && updateLangInfo.err)) {
      setShow1(true);
    }
  }, [updateLangInfo]);

  const removeProfilePicture = () => {
    const payload = { image: null };
    dispatch(updateUserProfileImage(userInfo.data.id, payload));
    setModalAlert(false);
    setPreview(false);
  };

  useEffect(() => {
    if (finish) {
      if (bytesToSize(fileImageSize)) {
        const payload = { image: fileDataImage };
        dispatch(updateUserProfileImage(userInfo.data.id, payload));
      } else {
        setFileImageSize(true);
        setErrorShow(true);
        setShow(false);
      }
    }
  }, [finish, documentReady]);

  const handleLanguageChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      const payload = { lang: value };
      dispatch(updateUserLanguage(userInfo.data.id, payload));
    }
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    setFileImageSize(false);
    if (files !== undefined) {
      const { type } = files.fileList[0];
      if (!type.includes('image')) {
        setimgValidation(true);
        setErrorShow(true);
        setModalAlert(false);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        const fileData = files.base64.replace(remfile, '');
        const fileSize = files.fileList[0].size;
        setFileDataImage(fileData);
        setFileImageSize(fileSize);
        setViewImage(files.base64);
        setModalAlert(true);
      }
    }
  };

  const icons = {
    Company: building,
    'Contact Details': profileInfo,
    'Guest List': guestLogo,
  };

  const activeIcons = {
    Company: buildingActive,
    'Contact Details': profileInfoActive,
    'Guest List': guestLogo,
  };

  const [editId, setEditId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleEditClick = () => {
    setEditMode(true);
  };

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

  const handleValidationClose = () => setimgValidation(false);
  const handleSizeClose = () => setFileImageSize(false);

  return (
    <div className="user-profile-page">
      <Box sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: '30px 160px 35px 35px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10%',
        fontFamily: 'Suisse Intl',
        border: '20px solid rgba(118, 118, 118, 0.1607843137) !important',
      }}
      >
        <div className="ml-2" style={{ fontWeight: '800', fontSize: 'large' }}>
          Personal Info
        </div>
        <p className="ml-2">Update your photo and Personal details here</p>
        <Row className="profileBackGround m-1" />
        {userInfo && userInfo.loading && (
          <div className="text-center">
            <PageLoader />
          </div>
        )}
        <CardBody className="pr-2 cardStyle">
          <img
            src={profileImage || userImage}
            className="mb-4 border-radius-50 user-profile-circle userProfileImage cursor-pointer"
            alt="user"
            onClick={() => { setPreview(true); }}
          />
          {updateImage && updateImage.loading && (
            <div className="text-center">
              <PageLoader />
              <Loader />
            </div>
          )}
          <Formik
            enableReinitialize
            initialValues={editId && userInfo && userInfo.data ? trimJsonObject(userInfo.data[0]) : formInitialValues}
          //  validationSchema ={validationSchema(editId)}
          //   onSubmit={handleSubmit}
          >
            {({
              isValid, dirty, values, setFieldValue, resetForm,
            }) => (
              <Form id={formId} style={{ marginTop: '-60px' }}>
                {userInfo && userInfo.data && (
                <Box sx={{ padding: '0px 0px 0px 20px', width: '100%' }}>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Name</p>
                    </Col>
                    <>
                      {editMode && userInfo.data.firstName && userInfo.data.lastName ? (
                        <Col md="4" sm="4" lg="4" xs="12" className="p-0 mt-4">
                          {console.log(userInfo.data.firstName && userInfo.data.lastName, 'serInfo.data.firstName && userInfo.data.lastName')}
                          <MuiTextField
                            sx={{ width: '190%', marginBottom: '20px' }}
                            name="firstName"
                            label="First name"
                            maxLength="150"
                            setFieldValue={setFieldValue}
                            variant="standard"
                            value={userInfo.data.firstName}
                          />
                          <MuiTextField
                            sx={{ width: '190%', marginBottom: '20px' }}
                            name="lastName"
                            label="Last name"
                            maxLength="150"
                            setFieldValue={setFieldValue}
                            variant="standard"
                            value={userInfo.data.lastName}
                          />
                        </Col>
                      ) : (
                        <>
                          {editMode && userInfo.data.name && (
                          <Col md="4" sm="4" lg="4" xs="12" className="p-0 mt-4">
                            <MuiTextField
                              sx={{ width: '190%', marginBottom: '20px' }}
                              name="name"
                              label="Name"
                              maxLength="150"
                              setFieldValue={setFieldValue}
                              variant="standard"
                              value={userInfo.data.lastName}
                            />
                          </Col>
                          )}
                        </>
                      )}
                      {editMode && userInfo.data.firstName && userInfo.data.lastName ? (
                        <>
                          <Col md="4" sm="4" lg="4" xs="12" className="p-0 mt-4">
                            <div className="detailInfo">{userInfo.data.firstName}</div>
                          </Col>
                          <Col md="4" sm="4" lg="4" xs="12" className="p-0 mt-4">
                            <div className="detailInfo">{userInfo.data.lastName}</div>
                          </Col>
                        </>
                      ) : (
                        <>
                          {!editMode && userInfo.data.name && userInfo.data.name && (
                          <div className="detailInfo">{userInfo.data.name}</div>
                          )}
                        </>
                      )}
                      {/* {!editMode && userInfo.data.name && userInfo.data.name && (
                          <div className="detailInfo">{userInfo.data.name}</div>
                        )} */}
                    </>
                  </Row>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Email Address</p>
                    </Col>
                    <Col md="4" sm="4" lg="4" xs="12" className="p-0">
                      {editMode && userInfo.data.email && userInfo.data.email.email && (
                      <MuiTextField
                        sx={{ width: '190%', marginBottom: '20px' }}
                        name={email.name}
                        label={email.label}
                        maxLength="150"
                        setFieldValue={setFieldValue}
                        variant="standard"
                      />
                      )}
                      {!editMode && userInfo.data.email && userInfo.data.email.email && (
                      <div className="detailInfo">{userInfo.data.email.email}</div>
                      )}
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Company</p>
                    </Col>
                    <Col md="4" sm="4" lg="4" xs="12" className="p-0">
                      {editMode && userInfo.data.company && userInfo.data.company.name && (
                      <MuiTextField
                        sx={{ width: '90%', marginBottom: '20px' }}
                        name={userInfo.data.company.name}
                        label={userInfo.data.company.name}
                        setFieldValue={setFieldValue}
                        variant="standard"
                      />
                      )}
                      {!editMode && userInfo.data.company && userInfo.data.company.name && (
                      <div className="detailInfo">{userInfo.data.company.name}</div>
                      )}
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Job Title</p>
                    </Col>
                    <Col md="4" sm="4" lg="4" xs="12" className="p-0">
                      {editMode && userInfo.data.designation && (
                      <MuiTextField
                        sx={{ width: '90%', marginBottom: '20px' }}
                        name={designation.name}
                        label={designation.label}
                        maxLength="150"
                        setFieldValue={setFieldValue}
                        variant="standard"
                      />
                      )}
                      {!editMode && userInfo.data.designation && (
                      <div className="detailInfo">{userInfo.data.designation.name ? userInfo.data.designation.name : '-'}</div>
                      )}
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Your Photo</p>
                      <p>This will be displayed on your profile</p>
                    </Col>
                    <Col md="1" sm="1" lg="1" xs="1" className="p-0">
                      <img
                        src={profileImage || userImage}
                        className="border-radius-50 user-profile-circle your-profile cursor-pointer"
                        alt="user"
                        onClick={() => {
                          setPreview(true);
                        }}
                      />
                    </Col>
                    <Col md="2" sm="2" lg="2" xs="12" className="pt-2 mt-3">
                      <span className="password cursor-pointer" style={{ color: AddThemeColor({}).color }}>
                        <ReactFileReader handleFiles={handleFiles} elementId="fileUploads" fileTypes="image/*" base64>
                          Update Photo
                        </ReactFileReader>
                      </span>
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Phone Number</p>
                    </Col>
                    <Col md="4" sm="4" lg="4" xs="12" className="p-0">
                      {editMode && userInfo.data.phone_number && (
                      <MuiTextField
                        sx={{ width: '90%', marginBottom: '20px' }}
                        name={mobile.name}
                        label={mobile.label}
                        setFieldValue={setFieldValue}
                        inputProps={{ maxLength: 10 }}
                      />
                      )}

                      {!editMode && userInfo.data.designation && (
                      <div className="detailInfo">{userInfo.data.phone_number ? userInfo.data.phone_number : '-'}</div>
                      )}
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col md="3" sm="3" lg="3" xs="12" className="p-0 mt-4">
                      <p className="personal-info">Password</p>
                    </Col>
                    {editMode
                      ? (
                        <>
                          <Col md="4" sm="4" lg="4" xs="12" className="p-0">
                            <MuiTextField
                              sx={{ width: '90%', marginBottom: '20px' }}
                              name={password.name}
                              label={password.label}
                              maxLength="150"
                              setFieldValue={setFieldValue}
                              variant="standard"
                              type={showPassword ? 'text' : 'password'}
                              InputProps={{
                                endAdornment: (
                                  <MuiTooltip>
                                    <span className="text-info personal-info cursor-pointer">
                                      <FontAwesomeIcon
                                        onClick={() => setShowPassword((prevState) => !prevState)}
                                        className="ml-2 custom-fav-icon"
                                        size="sm"
                                        icon={faEye}
                                      />
                                    </span>
                                  </MuiTooltip>
                                ),
                              }}
                            />
                          </Col>
                          <Col md="4" sm="4" lg="4" xs="12" className="p-0 mt-4">
                            {/* {!userInfo.data.oauth_uid && ( */}
                            <span className="password cursor-pointer" style={{ color: AddThemeColor({}).color }} onClick={() => { showUpdatePasswordModal(true); }}>Change Password</span>
                            {/* )} */}
                          </Col>
                        </>
                      )
                      : (
                        <Col md="4" sm="4" lg="4" xs="12" className="p-0 mt-4">
                          {/* {!userInfo.data.oauth_uid && ( */}
                          <span className="password cursor-pointer" style={{ color: AddThemeColor({}).color }} onClick={() => { showUpdatePasswordModal(true); }}>Change Password</span>
                          {/* )} */}
                        </Col>
                      )}
                  </Row>
                </Box>
                )}
                <Dialog size="md" open={updatePasswordModal}>
                  <DialogHeader title={PasswordHeading} imagePath={false} onClose={() => { showUpdatePasswordModal(false); }} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <UpdatePassword
                        afterReset={() => { showUpdatePasswordModal(false); }}
                      />
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Box>

      <Stack spacing={2} sx={{ width: '100%' }}>
        {imgValidation && (
        <Snackbar open={imgValidation} autoHideDuration={5000} onClose={handleValidationClose}>
          <Alert onClose={handleValidationClose} severity="error" sx={{ width: '100%' }}>
            Upload image only
          </Alert>
        </Snackbar>
        )}
        {errorShow && (
        <Snackbar open={errorShow} autoHideDuration={5000} onClose={handleSizeClose}>
          <Alert onClose={handleSizeClose} severity="error" sx={{ width: '100%' }}>
            Upload files less than 20 MB
          </Alert>
        </Snackbar>
        )}
      </Stack>

      <Modal className="remove-profile-photo" isOpen={preview} size="md">
        <ModalHeader toggle={() => setPreview(false)}>PROFILE IMAGE</ModalHeader>
        <ModalBody>
          <img
            src={profileImage || userImage}
            alt="view document"
            width="100%"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            onClick={() => { setEdit(true); setModalAlert(!modalAlert); setPreview(false); }}
          >
            Remove
          </Button>
        </ModalFooter>
      </Modal>
      <Modal className="change-profile-image" isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeader toggle={toggleAlert}>{edit ? (<>REMOVE IMAGE</>) : (<>UPDATE IMAGE</>)}</ModalHeader>
        <ModalBody>
          {edit ? (
            <>
              Are you sure, you want to remove this image ?
              <br />
              <div className="text-center mt-2">
                <img
                  src={profileImage || userImage}
                  alt="view document"
                  className="text-center border-radius-50"
                  width="60"
                  height="60"
                />
              </div>
            </>
          ) : (
            <>
              Are you sure, you want to update this image ?
              <br />
              <div className="text-center">
                <img
                  src={viewImage}
                  alt="view document"
                  className="text-center border-radius-50"
                  width="60"
                  height="60"
                />
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {edit ? (
            <Button
              variant="contained"
              onClick={() => { removeProfilePicture(); }}
            >
              Remove
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={
                () => {
                  setFinish(true);
                  setDocumentReady(Math.random());
                  setModalAlert(false);
                }
              }
            >
              Update
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserProfile;
