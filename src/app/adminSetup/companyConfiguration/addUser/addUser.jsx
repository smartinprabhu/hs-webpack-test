/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ticketIcon from '@images/icons/ticketBlue.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import {
  createUser,
  resetCreateUser, resetUpdateUser,
  updateUser,
  checkUserExists,
  resetUsersCount,
} from '../../setupService';
import validationSchema from './formModel/validationSchema';
import userFormModel from './formModel/userFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  getColumnArrayById, isArrayColumnExists, trimJsonObject,
  extractValueObjects, getAllowedCompanies,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import {
  getTrimmedArray,
} from '../../../workorders/utils/utils';
import Basic from './forms/basic';
import Advanced from './forms/advanced';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = userFormModel;

const AddUser = (props) => {
  const {
    afterReset,
    directToView,
    isModal,
    closeEditModal,
    editData,
    closeModal,
  } = props;
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [saveUser, setSaveUser] = useState(false);
  const [payloadData, setPayload] = useState({});
  const { userInfo } = useSelector((state) => state.user);
  const {
    createUserInfo, userDetails, updateUserInfo,
    existsUserCount,
  } = useSelector((state) => state.setup);
  const { siteDetails } = useSelector((state) => state.site);

  const userNotExists = existsUserCount && existsUserCount.data;
  const userExists = existsUserCount && existsUserCount.err;

  useEffect(() => {
    if ((userInfo && userInfo.data) && (createUserInfo && !createUserInfo.data && !createUserInfo.err && !createUserInfo.loading)
      && (userNotExists) && !userExists) {
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(createUser(appModels.TEAMMEMEBERS, payloadData));
      setSaveUser(true);
      // if (afterReset) afterReset();
    }
  }, [userInfo, existsUserCount]);

  useEffect(() => {
    if ((createUserInfo && createUserInfo.err)) {
      dispatch(resetUsersCount());
    }
  }, [userInfo, createUserInfo]);

  useEffect(() => {
    dispatch(resetUsersCount());
    dispatch(resetCreateUser());
  }, []);

  // const onCancel = () => {
  //   dispatch(resetCreateUser());
  //   dispatch(resetUsersCount());
  //   if (afterReset) afterReset();
  // };

  const onCancelEdit = () => {
    dispatch(resetUpdateUser());
    dispatch(resetUsersCount());
    if (afterReset) afterReset();
  };

  const companyId = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  function handleSubmit(values) {
    if (editData) {
      if (!existsUserCount) {
        // closeEditModal();
        afterReset();
      }
      setIsOpenSuccessAndErrorModalWindow(true);
      let postDataValues = { ...values };

      postDataValues = {
        name: values.name,
        email: values.email,
        biometric: values.biometric,
        employee_id_seq: values.employee_id_seq ? values.employee_id_seq : '',
        vendor_id_seq: values.vendor_id_seq,
        user_role_id: values.user_role_id ? values.user_role_id.id : false,
        active: values.active === 'yes',
        resource_calendar_id: values.resource_calendar_id ? values.resource_calendar_id.id : false,
        hr_department: values.hr_department ? values.hr_department.id : false,
        associates_to: extractValueObjects(values.associates_to),
        vendor_id: extractValueObjects(values.vendor_id),
        default_user_role_id: extractValueObjects(values.default_user_role_id),
        designation_id: extractValueObjects(values.designation_id),
        // password: values.password,
        phone_number: values.phone_number ? values.phone_number : '',
        // autogenerate_temporary_password: values.autogenerate_temporary_password,
        is_sow_employee: values.is_sow_employee,
        is_mobile_user: values.is_mobile_user === 'yes',
        company_id: extractValueObjects(values.company_id),
      };

      if (isArrayColumnExists(values.company_ids ? values.company_ids : [], 'id')) {
        let selectedCompanies = getColumnArrayById(values.company_ids, 'id');
        const appendSelectedCompany = extractValueObjects(values.company_id);
        const isParentExists = selectedCompanies.filter((item) => item === appendSelectedCompany);
        if (isParentExists && !isParentExists.length) {
          selectedCompanies = [appendSelectedCompany, ...selectedCompanies];
        }
        postDataValues.company_ids = [[6, false, selectedCompanies]];
      }

      if (editData.email === values.email) {
        delete postDataValues.email;
      }

      const id = userDetails && userDetails.data ? userDetails.data[0].id : '';
      dispatch(updateUser(id, postDataValues, appModels.TEAMMEMEBERS));
    } else {
      if (!existsUserCount) {
      //  closeEditModal();
        // afterReset();
      }
      // closeModal();
      const roleIds = values.user_role_id ? values.user_role_id.id : false;
      const employeeStatus = values.active === 'yes';
      const resourceCalendarId = values.resource_calendar_id ? values.resource_calendar_id.id : false;
      const hrDepartment = values.hr_department ? values.hr_department.id : false;
      const isMobileUser = values.is_mobile_user === 'yes';
      const associatesTo = extractValueObjects(values.associates_to);
      const vendorId = extractValueObjects(values.vendor_id);
      const defaultUserRoleId = extractValueObjects(values.default_user_role_id);
      const designationId = extractValueObjects(values.designation_id);
      const phone = values.phone_number ? values.phone_number : '';
      const employeeId = values.employee_id_seq ? values.employee_id_seq : '';
      const companyId = extractValueObjects(values.company_id);

      const postData = { ...values };
      postData.phone_number = phone;
      postData.company_id = companyId;
      postData.user_role_id = roleIds;
      postData.active = employeeStatus;
      postData.resource_calendar_id = resourceCalendarId;
      postData.hr_department = hrDepartment;
      postData.is_mobile_user = isMobileUser;
      postData.associates_to = associatesTo;
      postData.vendor_id = vendorId;
      postData.default_user_role_id = defaultUserRoleId;
      postData.designation_id = designationId;
      postData.employee_id_seq = employeeId;
      postData.biometric = values.biometric ? values.biometric : Math.floor(100000 + Math.random() * 900000);

      if (isArrayColumnExists(values.company_ids ? values.company_ids : [], 'id')) {
        const trimmedArray = getTrimmedArray(values.company_ids, 'id', companyId);
        const selectedCompany = [values.company_id];
        const appendSelectedCompany = [...selectedCompany, ...trimmedArray];
        postData.company_ids = [[6, false, getColumnArrayById(appendSelectedCompany, 'id')]];
      } else if (userInfo && userInfo.data) {
        postData.company_ids = [[6, false, [companyId]]];
      }

      const payload = { model: appModels.TEAMMEMEBERS, values: postData };
      if (!saveUser) {
        dispatch(checkUserExists(companyId, appModels.TEAMMEMEBERS, postData.email));
        setPayload(payload);
      }
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    // closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    if (afterReset) afterReset();
    setSaveUser(false);
  };

  function checkValidation(isValid, dirty, values, createUserInfo, existsUserCount) {
    let validation;
    if (!(isValid && dirty) || (!values.company_ids || !values.company_ids.length)
      || ((createUserInfo && createUserInfo.loading) || (existsUserCount && existsUserCount.loading))) {
      validation = true;
    } else if ((extractValueObjects(values.associates_to) === 'Vendor' || extractValueObjects(values.associates_to) === 'Tenant') && values.vendor_id === '') {
      validation = true;
    } else {
      validation = false;
    }

    return validation;
  }

  return (
    <Row className="drawer-list thin-scrollbar pt-2 ml-3">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editData ? trimJsonObject(editData) : formInitialValues}
          // validationSchema={validationSchema(editData && editData.oauth_uid ? editData.oauth_uid : '')}
          validationSchema={validationSchema(editData && editData.id ? editData.id : false)}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, errors, values, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                  padding: '5px 25px 20px 25px',
                  flexGrow: 1,
                }}
                className="createFormScrollbar"
              >
                <ThemeProvider theme={theme}>
                  <Basic errors={errors} formField={formField} userExists={userExists} setFieldValue={setFieldValue} selectedUser={editData} reloadData={reload} />
                  <Advanced formField={formField} selectedUser={editData} setFieldValue={setFieldValue} />
                </ThemeProvider>
                {((createUserInfo && createUserInfo.loading) || (existsUserCount && existsUserCount.loading) || (userDetails && userDetails.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(userNotExists && createUserInfo && createUserInfo.err) && (
                <SuccessAndErrorFormat response={createUserInfo} />
                )}
                {(userExists) ? (
                  <div className="text-danger text-center mt-3">
                    <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                    Email ID already exists..
                  </div>
                ) : (<span />)}
                {updateUserInfo && updateUserInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(updateUserInfo && updateUserInfo.err) && (
                <SuccessAndErrorFormat response={updateUserInfo} />
                )}
                {!editData && (
                <>
                  {(createUserInfo && !createUserInfo.data) && (
                  <div className={isModal ? 'bg-lightblue float-right' : 'bg-lightblue float-right sticky-button-85drawer'}>
                    <Button
                        // disabled={!(isValid && dirty) || (!values.company_ids || !values.company_ids.length)
                        //   || ((createUserInfo && createUserInfo.loading) || (existsUserCount && existsUserCount.loading))}
                      disabled={checkValidation(isValid, dirty, values, createUserInfo, existsUserCount)}
                      type="submit"
                      size="sm"
                      variant="contained"
                    >
                      Create
                    </Button>
                  </div>
                  )}
                </>
                )}
                {editData && editData.id && (
                <>
                  {(updateUserInfo && !updateUserInfo.data) && (
                  <div className={isModal ? 'bg-lightblue float-right' : 'bg-lightblue float-right sticky-button-85drawer'}>

                    <Button
                      disabled={!isValid || (updateUserInfo && updateUserInfo.loading) || ((extractValueObjects(values.associates_to) === 'Vendor' || extractValueObjects(values.associates_to) === 'Tenant') && values.vendor_id === '')}
                      type="submit"
                      size="sm"
                      variant="contained"
                    >
                      Update
                    </Button>
                  </div>
                  )}
                </>
                )}
                <SuccessAndErrorModalWindow
                  isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                  setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                  type={editData ? 'update' : 'create'}
                  successOrErrorData={editData ? updateUserInfo : createUserInfo}
                  headerImage={ticketIcon}
                  headerText="Users"
                  successRedirect={handleReset.bind(null, resetForm)}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddUser.defaultProps = {
  editData: undefined,
  isModal: false,
};

AddUser.propTypes = {
  afterReset: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
  directToView: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editData: PropTypes.any,
  closeEditModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AddUser;
