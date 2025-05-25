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
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';

import ticketIcon from '@images/icons/ticketBlue.svg';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import { resetBulkAdd } from '../../../helpdesk/actions';
import {
  createBulkData,
} from '../../../helpdesk/ticketService';
import {
  trimArrayofObjectValue, getArrayFormatCreateSingle,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import formInitialValues from './formModel/formInitialValues';
import userFormModel from './formModel/userFormModel';
import validationSchema from './formModel/validationSchema';

import { last } from '../../../util/staticFunctions';
import validationSchemaChild from './formModel/validationSchemaChild';
import validationSchemaFloor from './formModel/validationSchemaFloor';
import Basic from './forms/basicFormMiniTable';
import { checkRequiredFields } from '../../utils/utils';
import customData from './data/companyData.json';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = userFormModel;

const AddLocation = (props) => {
  const {
    category,
    afterReset,
    editData,
  } = props;
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);

  const [refresh, setRefresh] = useState('1');
  const { userInfo } = useSelector((state) => state.user);
  const {
    createBulkInfoAdd,
  } = useSelector((state) => state.ticket);
  const { siteDetails } = useSelector((state) => state.site);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

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

  function checkDataTypeFloor(arr) {
    const value = last(arr);
    if (value && typeof value === 'object') {
      return arr.id;
    }
    if (value && typeof value === 'number') {
      return arr && arr.length > 2 ? arr[1] : last(arr);
    }
    return false;
  }

  function checkFloor(arr) {
    const value = arr;

    if (value && value.length) {
      return arr && arr.length > 1 ? arr[1] : '';
    }
    return false;
  }

  function handleSubmit(values) {
    const BlockId = values.parent_id ? checkDataType(values.parent_id) : '';
    const FloorId = values.parent_id ? checkDataType(values.parent_id) : false;
    let newArr = partsData;
    if (category === 'Building') {
      newArr = newArr.map((v) => ({ ...v, space_name: `${customData?.facilityData?.manage_building?.prefix || ''}${v.space_name || ''}` }));
    }
    if (category === 'Floor') {
      newArr = newArr.map((v) => ({ ...v, space_name: `${customData?.facilityData?.manage_floor?.prefix || ''}${v.space_name || ''}` }));
      newArr = newArr.map((v) => ({ ...v, parent_id: BlockId }));
    }
    if ((category === 'Wing')) {
      newArr = newArr.map((v) => ({ ...v, space_name: `${customData?.facilityData?.manage_wing?.prefix || ''}${v.space_name || ''}` }));
      newArr = newArr.map((v) => ({ ...v, parent_id: FloorId }));
      newArr = newArr.map((v) => ({ ...v, floor_id: values.parent_id ? checkFloor(values.parent_id) : false }));
    }
    if ((category === 'Room')) {
      newArr = newArr.map((v) => ({ ...v, space_name: `${customData?.facilityData?.manage_room?.prefix || ''}${v.space_name || ''}` }));
      newArr = newArr.map((v) => ({ ...v, parent_id: FloorId }));
      newArr = newArr.map((v) => ({ ...v, floor_id: values.parent_id ? checkFloor(values.parent_id) : false }));
    }
    if ((category === 'Space')) {
      newArr = newArr.map((v) => ({ ...v, space_name: `${customData?.facilityData?.manage_space?.prefix || ''}${v.space_name || ''}` }));
      newArr = newArr.map((v) => ({ ...v, parent_id: FloorId }));
      newArr = newArr.map((v) => ({ ...v, floor_id: values.parent_id ? checkFloor(values.parent_id) : false }));
    }
    setIsOpenSuccessAndErrorModalWindow(true);
    dispatch(createBulkData(appModels.SPACE, getArrayFormatCreateSingle(trimArrayofObjectValue(newArr, ['space_name', 'max_occupancy', 'area_sqft']))));
  }

  const handleReset = (resetForm) => {
    resetForm();
    dispatch(resetBulkAdd());
    // closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="pt-2">
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
                className={category === 'Building' ? 'createFormScrollbar pt-0' : 'pt-0'}
              >
                <ThemeProvider theme={theme}>
                  <Basic formField={formField} setRefresh={setRefresh} refresh={refresh} spaceCategory={category} setFieldValue={setFieldValue} setPartsData={setPartsData} partsData={partsData} setPartsAdd={setPartsAdd} selectedUser={editData} reloadData={reload} />
                </ThemeProvider>
                {((createBulkInfoAdd && createBulkInfoAdd.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}

                {(createBulkInfoAdd && !createBulkInfoAdd.data) && (
                  <div className="bg-lightblue sticky-button-85drawer">
                    <Button
                      disabled={(partsData && partsData.length <= 0) || (!checkRequiredFields(partsData, category))
                        || (!(values && values.parent_id && checkDataType(values.parent_id)) && category === 'Floor')
                        || ((!(values && values.parent_id && checkDataType(values.parent_id))) && (!(checkDataType(values.floor_id))) && (category === 'Wing' || category === 'Room' || category === 'Space'))}
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
                  successOrErrorData={createBulkInfoAdd}
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
