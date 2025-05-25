/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';

import ticketIcon from '@images/icons/ticketBlue.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import {
  createSpace,
} from '../../../assets/equipmentService';
import {
  getAllowedCompanies, generatePassword,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import formInitialValues from './formModel/formInitialValues';
import userFormModel from './formModel/userFormModel';
import validationSchema from './formModel/validationSchema';

import validationSchemaChild from './formModel/validationSchemaChild';
import validationSchemaFloor from './formModel/validationSchemaFloor';
import Basic from './forms/basicFormMini';
import { last } from '../../../util/staticFunctions';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = userFormModel;

const AddLocation = (props) => {
  const {
    category,
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

  const [refresh, setRefresh] = useState('1');
  const { userInfo } = useSelector((state) => state.user);
  const {
    createSpaceInfo,
  } = useSelector((state) => state.equipment);
  const { siteDetails } = useSelector((state) => state.site);

  const companyId = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  function checkDataType(arr) {
    const value = last(arr);
    if (value && typeof value === 'object') {
      return arr.id;
    }
    if (value && typeof value === 'number') {
      return last(arr);
    }
    return false;
  }


  function handleSubmit(values) {
    setIsOpenSuccessAndErrorModalWindow(true);
    const assetCategory = values.asset_category_id ? values.asset_category_id.id : '';
    const BlockId = values.parent_id ? values.parent_id.id : '';
    const FloorId = values.parent_id ? checkDataType(values.parent_id) : false;
    const postData = {
      space_name: values.space_name, name: generatePassword(4), asset_category_id: assetCategory, max_occupancy: values.max_occupancy, area_sqft: values.area_sqft,
    };

    if (values.asset_category_id && values.asset_category_id.name === 'Floor') {
      postData.parent_id = BlockId;
    }
    if ((values.asset_category_id && values.asset_category_id.name === 'Room') || (values.asset_category_id && values.asset_category_id.name === 'Space')) {
      postData.parent_id = FloorId;
      postData.floor_id = FloorId;
    }

    const payload = { model: appModels.SPACE, values: postData };
    dispatch(createSpace(appModels.SPACE, payload));
  }

  const handleReset = (resetForm) => {
    resetForm();
    // closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pt-2">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={category === 'Building' ? validationSchema : category === 'Floor' ? validationSchemaFloor : validationSchemaChild}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                  padding: '20px 25px',
                  flexGrow: 1,
                }}
                className="createFormScrollbar"
              >
                <ThemeProvider theme={theme}>
                  <Basic formField={formField} setRefresh={setRefresh} refresh={refresh} spaceCategory={category} setFieldValue={setFieldValue} selectedUser={editData} reloadData={reload} />
                </ThemeProvider>
                {((createSpaceInfo && createSpaceInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}

                {(createSpaceInfo && !createSpaceInfo.data) && (
                  <div className="bg-lightblue sticky-button-1250drawer">
                    <Button
                      disabled={!(isValid && dirty)}
                      type="button"
                      size="sm"
                      variant="contained"
                      onClick={() => handleSubmit(values)}
                    >
                      Create
                    </Button>
                  </div>
                )}
                <SuccessAndErrorModalWindow
                  isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                  setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                  type={editData ? 'update' : 'create'}
                  successOrErrorData={createSpaceInfo}
                  headerImage={ticketIcon}
                  headerText={category}
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

AddLocation.defaultProps = {
  editData: undefined,
  isModal: false,
  closeModal: () => { },
};

AddLocation.propTypes = {
  afterReset: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
  directToView: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editData: PropTypes.any,
  closeEditModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func,
};

export default AddLocation;
