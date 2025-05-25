/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import {
  CircularProgress,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import useStyles from './styles';
import checkoutFormModel from './FormModel/checkoutFormModel';
import UpdateSpaceForm from './updateSpaceForm';
import { getSpaceData } from '../assets/equipmentService';
import { updateSpaceDetails } from './spaceService';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const UpdateSpaceModel = (props) => {
  const {
    id, latitude, longitude, atFinish, setPopoverOpen, popoverOpen, openUpdateModal, setOpenUpdateModal, setPopoverClose, setSpaceDraggable,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [updateResult, setUpdateResult] = useState({});

  const toggle = () => {
    setPopoverClose(false);
    setUpdateResult({});
    setOpenUpdateModal(!openUpdateModal);
    if (openUpdateModal) {
      if (atFinish) {
        atFinish();
      }
    }
  };

  const { getSpaceInfo } = useSelector((state) => state.equipment);
  const { updateSpace } = useSelector((state) => state.space);

  useEffect(() => {
    if (updateSpace && updateSpace.data) {
      setUpdateResult({ status: 'success', data: {} });
    } else if (updateSpace && updateSpace.err) {
      setUpdateResult({ status: 'error', data: {} });
    }
  }, [updateSpace]);

  useEffect(() => {
    if (updateSpace) {
      dispatch(getSpaceData(appModels.SPACE, id));
    }
  }, [updateSpace]);

  useEffect(() => {
    if (openUpdateModal) {
      setUpdateResult({});
    }
  }, [openUpdateModal]);

  useEffect(() => {
    if (popoverOpen) {
      setPopoverOpen(false);
    }
  }, [popoverOpen]);

  function handleSubmit(values) {
    setPopoverClose(false);
    setSpaceDraggable(false);
    const spaceStatus = values.space_status;
    const employeeId = values.employee_id && values.employee_id.id ? values.employee_id.id : values.employee_id;
    let bookingAllowed = values.is_booking_allowed;
    if (bookingAllowed === '1') {
      bookingAllowed = true;
    } else if (bookingAllowed === '0') {
      bookingAllowed = false;
    }
    const postData = { ...values };

    postData.space_status = spaceStatus;
    postData.employee_id = employeeId;
    postData.is_booking_allowed = bookingAllowed;
    postData.latitude = latitude;
    postData.longitude = longitude;
    const payload = postData;
    dispatch(updateSpaceDetails(id, payload));
  }

  return (
    <>
      <Modal isOpen={openUpdateModal} toggle={toggle} size={updateResult && updateResult.status ? 'sm' : 'lg'}>
        <ModalHeaderComponent closeModalWindow={toggle} title="Update a Space" response={updateResult} />
        <ModalBody className="pt-0">
          {(updateResult && !updateResult.status && updateSpace && !updateSpace.loading) && (
            <Formik
              initialValues={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0] : {}}
              onSubmit={handleSubmit}
              setFieldValue
            >
              {({ isSubmitting }) => (
                <Form id={formId}>
                  <UpdateSpaceForm updateResult={updateResult} formField={formField} formValues={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0] : {}} />
                  <div className={`${classes.wrapper} float-right`}>
                    <>
                      <Button onClick={toggle} className={`${classes.button} roundCorners btn-cancel`}>
                        Cancel
                      </Button>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                       variant="contained"
                        className={`${classes.button} roundCorners`}
                      >
                        Update
                      </Button>
                    </>
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          )}
          {updateSpace && updateSpace.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {updateResult.status === 'error' && (
            <SuccessAndErrorFormat response={updateSpace} />
          )}
          {updateResult.status === 'success' && (
            <SuccessAndErrorFormat response={updateSpace} successMessage="Space updated successfully.." />
          )}
        </ModalBody>
        {updateResult && updateResult.status && (
          <ModalFooter>
            <Button onClick={toggle} variant="contained" className={`${classes.button} roundCorners mt-0`}>
              Ok
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </>
  );
};

UpdateSpaceModel.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  latitude: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  longitude: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  popoverOpen: PropTypes.bool,
  setPopoverOpen: PropTypes.func,
  setOpenUpdateModal: PropTypes.func,
  openUpdateModal: PropTypes.bool,
  atFinish: PropTypes.func.isRequired,
  setPopoverClose: PropTypes.func.isRequired,
  setSpaceDraggable: PropTypes.func,
};

UpdateSpaceModel.defaultProps = {
  setOpenUpdateModal: undefined,
  openUpdateModal: undefined,
  setPopoverOpen: undefined,
  popoverOpen: undefined,
  setSpaceDraggable: () => { },
};

export default UpdateSpaceModel;
