/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import {
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import find from 'lodash/find';

import CancelBookingModalWindow from './cancelBookingModalWindow';

const RescheduleOrCancelBooking = ({
  bookingItem, openRescheduleModalWindow, cancelBookingActionComplete,
}) => {
  const [isOpen, openCloseModal] = useState(false);
  const [isDropdownOpen, setDropDown] = useState(false);
  const [reschedule, setRescheduleOrCancel] = useState(false);

  const toggleDropDown = () => {
    setDropDown(!isDropdownOpen);
  };
  const { deleteInfo } = useSelector((state) => state.bookingInfo);
  const { categories } = useSelector((state) => state.bookingInfo);

  useEffect(() => {
    if (!isOpen
      && deleteInfo
      && deleteInfo.data
    ) cancelBookingActionComplete();
  }, [isOpen]);

  const openCancelBookingModal = () => {
    openCloseModal(!isOpen);
  };

  const openReScheduleBookingModal = () => {
    if (reschedule) {
      openCloseModal(true);
      setRescheduleOrCancel(true);
    } else {
      openCloseModal(false);
      setRescheduleOrCancel(false);
    }
  };

  let cancelBookingModalWindow;

  if (isOpen) {
    cancelBookingModalWindow = (
      <CancelBookingModalWindow
        bookingItem={bookingItem}
        modalWindowOpen={isOpen}
        reschedule={reschedule}
        openModalWindow={openCancelBookingModal}
        openBookModalWindow={openRescheduleModalWindow}
        category={categories && categories.data && bookingItem.space && bookingItem.space.category_id && bookingItem.space.category_id.id && find(categories.data, { id: bookingItem.space.category_id.id })}
      />
    );
  }

  return (
    <>
      {/* <ButtonDropdown
        size="sm"
        isOpen={isDropdownOpen}
        toggle={toggleDropDown}
      >
        <DropdownToggle
          caret
          className="font-size-xsmall bismark2Dropdown"
        >
          CANCEL
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => openReScheduleBookingModal('reschedule')}>Reschedule</DropdownItem>
          <DropdownItem onClick={() => openCancelBookingModal()}>Cancel</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown> */}
      <Button size="sm" className="font-size-xsmall buttonBismark2" onClick={() => openCancelBookingModal()}>
        CANCEL
      </Button>
      {cancelBookingModalWindow}
    </>
  );
};

RescheduleOrCancelBooking.propTypes = {
  bookingItem: PropTypes.shape({
    planned_in: PropTypes.string,
    duration: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    planned_out: PropTypes.string,
    name: PropTypes.string,
    space: PropTypes.shape({
      category_id: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number,
      }),
    }),
  }).isRequired,
  cancelBookingActionComplete: PropTypes.func.isRequired,
  openRescheduleModalWindow: PropTypes.func.isRequired,
};

export default RescheduleOrCancelBooking;
