/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/function-component-definition */
/* eslint-disable array-callback-return */
/* eslint-disable no-inner-declarations */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import {
  Modal, ModalBody, Col, Row, Form, FormGroup, Label, Input, ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import PropTypes from 'prop-types';
import guestLogo from '@images/guestLogo.png';
import { Formik } from 'formik';
import {
  saveGuest, saveNewGuestInfo, resetGuestDataInfo, updateGuest, resetGuestInfo,
} from '../bookingService';
import { noNumbersAllowed } from '../../util/appUtils';
import './shifts.scss';
import { getGuestList } from '../../userProfile/userProfileService';
import countriesDialCodes from '../../data/countryCodes.json';

const GuestModalWindow = (props) => {
  const {
    guestModalOpen, setGuestModalOpen, guestName, guest, employeeId, editGuestModalOpen, setEditGuestModalOpen,
  } = props;
  const dispatch = useDispatch();
  const {
    saveHostInfo, guestSaveInfo,
  } = useSelector((state) => state.bookingInfo);
  const { updateGuestINFO } = useSelector((state) => state.bookingInfo);
  const [isError, setIsError] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const [isDialCode, setIsDialCode] = useState([]);
  const dialCodesData = countriesDialCodes.countries;
  const [mobile, setMobile] = useState('');
  const [closeButtonDisable, setCloseButtonDisable] = useState(false);

  useEffect(() => {
    if (guestSaveInfo && guestSaveInfo.data) {
      dispatch(saveNewGuestInfo(guestSaveInfo.data));
    }
  }, [guestSaveInfo]);

  useEffect(() => {
    if (userInfo &&userInfo.data && userInfo.data.company && userInfo.data.company.timezone && dialCodesData) {
      const countryCode = dialCodesData.filter((country) => country.timezone === userInfo.data.company.timezone);
      setIsDialCode(countryCode);
    }
  }, [userInfo, dialCodesData]);

  const toggleCloseModal = () => {
    setGuestModalOpen(false);
    dispatch(resetGuestInfo());
    if (guest && guest.id) {
      dispatch(resetGuestInfo());
      dispatch(getGuestList(userInfo &&userInfo.data && userInfo.data.employee && userInfo.data.employee.id, ''));
    } else {
      dispatch(resetGuestInfo());
      dispatch(resetGuestDataInfo());
      dispatch(getGuestList(userInfo &&userInfo.data && userInfo.data.employee && userInfo.data.employee.id, ''));
    }
  };

  const okToggleCloseModal = () => {
    setEditGuestModalOpen(false);
    dispatch(resetGuestInfo());
    if (guest && guest.id) {
      dispatch(resetGuestInfo());
      dispatch(getGuestList(userInfo.data.employee.id, ''));
    } else {
      dispatch(resetGuestInfo());
      dispatch(resetGuestDataInfo());
      dispatch(getGuestList(userInfo.data.employee.id, ''));
    }
  };

  useEffect(() => {
    if (guestSaveInfo && guestSaveInfo.loading) {
      setCloseButtonDisable(true);
    } else {
      setCloseButtonDisable(false);
    }
  }, [guestSaveInfo]);

  const formInitialValues = {
    firstName: guest ? guest.name.split(' ')[0] : guestName ? guestName.split(' ')[0] : '',
    lastName: guest ? guest.name.split(' ')[1] : guestName ? guestName.split(' ')[1] : '',
    email: guest ? guest.email : '',
    mobile: guest ? guest.phone_number : '',
  };
  function stringContainsNumber(_string) {
    return /\d/.test(_string);
  }
  const currentValidationSchema = (values) => {
    let numberexist = false;
    const errors = {};
    if (!values.email) {
      errors.email = 'Email Address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    } else if (values.email) {
      const userEmailValid = values.email.split('@');
      if (userEmailValid[userEmailValid.length - 1].split('').filter((e) => e === '.').length > 1) {
        errors.email = 'invalid email';
      }
      if (userEmailValid[1].toLowerCase() === 'nttdata.com') {
        errors.email = 'This is an internal NTT DATA email address, guest booking is not permitted';
      }
    }
    if (values.firstName && values.firstName.length <= 25) {
      numberexist = stringContainsNumber(values.firstName);
      if (numberexist === true) {
        errors.firstName = 'First Name should not have numbers  ';
      }
    } else if (values.firstName && values.firstName.length > 25) {
      numberexist = stringContainsNumber(values.firstName);
      if (numberexist === true) {
        errors.firstName = 'First Name should not have numbers and First Name is too large ';
      } else {
        errors.firstName = 'First Name is too large';
      }
    } else if (!values.firstName) {
      errors.firstName = 'First Name is Required';
    }
    if (values.lastName && values.lastName.length <= 35) {
      numberexist = stringContainsNumber(values.lastName);
      if (numberexist === true) {
        errors.lastName = 'Last Name should not have numbers  ';
      }
    } else if (values.lastName && values.lastName.length > 25) {
      numberexist = stringContainsNumber(values.lastName);
      if (numberexist === true) {
        errors.lastName = 'Last Name should not have numbers and First Name is too large ';
      } else {
        errors.lastName = 'Last Name is too large';
      }
    }
    return errors;
  };

  const handleChangeMobile = (e) => {
    const validateCallingCode = dialCodesData.filter((country) => country.callingCode === e);
    if (e && e.length && isValidPhoneNumber(e)) {
      setIsError(false);
    } else if (e === undefined) {
      setIsError(false);
    } else if (validateCallingCode && validateCallingCode[0] && validateCallingCode[0].callingCode && validateCallingCode[0].callingCode.length) {
      setIsError(false);
    } else {
      setIsError(true);
    }
    setMobile(e);
  };

  const submitHandler = (values) => {
    if (guest && guest.id) {
      if (values) {
        const postData = {
          name: `${values.firstName} ${values.lastName ? values.lastName : ''}`,
          phone: mobile !== undefined ? mobile : '',
        };
        if (values.email !== guest.email) {
          postData.email = values.email;
        }
        dispatch(updateGuest(guest.id, postData, employeeId));
      }
    } else {
      const object = {
        name: `${values.firstName} ${values.lastName ? values.lastName : ''}`,
        email: values.email,
        phone: mobile !== undefined ? mobile : '',
      };
      dispatch(saveGuest(userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id, object));
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validate={currentValidationSchema}
      onSubmit={submitHandler}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        dirty,
      }) => (
        <Modal className="guest-modal-window" isOpen={guestModalOpen || editGuestModalOpen} size={guestSaveInfo && guestSaveInfo.data ? 'sm' : 'md'}>
          <div className="mt-2">
            <ModalHeaderComponent title={(guest && guest.id) ? 'Edit Guest' : 'New Guest'} imagePath={guestLogo} closeModalWindow={(guest && guest.id) ? okToggleCloseModal : toggleCloseModal} closeButtonDisable={closeButtonDisable} response={guestSaveInfo} />
          </div>
          <hr className="m-0" />
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              {guestSaveInfo && guestSaveInfo.data ? '' : updateGuestINFO && updateGuestINFO.data ? '' : (
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="firstName">
                        First Name
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                        // eslint-disable-next-line no-sequences
                        onKeyPress={(event) => { event.key === ' ' ? event.preventDefault() : noNumbersAllowed(event); }}
                      />
                      <p className="text-danger ml-1 mt-1 font-11">{errors.firstName ? errors.firstName : ''}</p>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="website">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                        onKeyPress={(event) => { event.key === ' ' ? event.preventDefault() : noNumbersAllowed(event); }}
                      />
                      <p className="text-danger ml-1 mt-1 font-11">{errors.lastName ? errors.lastName : ''}</p>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email">
                        E-mail Address
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                      <p className="text-danger ml-1  mt-1 font-11">{errors.email ? errors.email : ''}</p>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="mobile">Mobile Number</Label>
                      <PhoneInput
                        international
                        className="MobileNumber-field"
                        countryCallingCodeEditable={false}
                        defaultCountry={isDialCode && isDialCode.length ? isDialCode[0].countrycode : ''}
                        type="input"
                        name="mobile"
                        id="mobile"
                        placeholder="Enter"
                        value={values.mobile}
                        onBlur={handleBlur}
                        onChange={(e) => { handleChangeMobile(e); }}
                      />
                      <p className="text-danger ml-1 mt-1 font-11">{isError ? 'Invalid Mobile Number' : ''}</p>
                    </FormGroup>
                  </Col>
                </Row>
              )}
              {guestSaveInfo && guestSaveInfo.data && (
              <h5 className="text-center text-success mt-2 font-size-17px">
                Guest added successfully.
              </h5>
              )}
              {guestSaveInfo && guestSaveInfo.loading && (
              <span className="text-center mt-2">
                <Loader />
              </span>
              )}
              {guestSaveInfo && guestSaveInfo.err && guestSaveInfo.err.error && (
              <h5 className="text-center text-danger mt-2 font-size-17px">
                {guestSaveInfo.err.error.message}
              </h5>
              )}
              {updateGuestINFO && updateGuestINFO.data && (
              <h5 className="text-center text-success mt-2 font-size-17px">
                Guest updated successfully.
              </h5>
              )}
              {updateGuestINFO && updateGuestINFO.loading && (
              <span className="text-center mt-2">
                <Loader />
              </span>
              )}
              {updateGuestINFO && updateGuestINFO.err && updateGuestINFO.err.error && (
              <h5 className="text-center text-danger mt-2 font-size-17px">
                {updateGuestINFO.err.error.message}
              </h5>
              )}
            </ModalBody>
            <ModalFooter>
              {!(guest && guest.id) ? (guestSaveInfo && (guestSaveInfo.data) ? (
                <>
                  {!guestSaveInfo.err && (
                  <Button variant="contained" onClick={toggleCloseModal}>
                    Ok
                  </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="submit"
                    disabled={!(isValid && dirty) || (guestSaveInfo && guestSaveInfo.loading) || isError}
                     variant="contained"
                  >
                    Add
                  </Button>
                </>
              )) : (updateGuestINFO && updateGuestINFO.data
                ? (<Button variant="contained" className="ok-btn" onClick={okToggleCloseModal}>Ok</Button>) : (
                  <Button
                    disabled={!(isValid) || isError}
                    type="submit"
                     variant="contained"
                    size="sm"
                  >
                    Update
                  </Button>
                )
              )}
            </ModalFooter>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
GuestModalWindow.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
  }),
  guestModalOpen: PropTypes.bool.isRequired,
  setGuestModalOpen: PropTypes.func.isRequired,
  guestName: PropTypes.string.isRequired,
  editGuestModalOpen: PropTypes.bool,
  setEditGuestModalOpen: PropTypes.func,
  employeeId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
GuestModalWindow.defaultProps = {
  employeeId: undefined,
  editGuestModalOpen: false,
  setEditGuestModalOpen: () => { },
};

export default GuestModalWindow;
