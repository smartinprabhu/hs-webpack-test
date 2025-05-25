/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button, ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import classNames from 'classnames';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertUtcTimetoCompanyTimeZone, getCurrentTimeZoneTime } from '@shared/dateTimeConvertor';
import find from 'lodash/find';

import PreScreeningModalWindow from './preScreening/preScreeningModalWindow';
import AccessModalWindow from './access/accessModal';
import OccupySpaceModalWindow from './occupySpace/occupySpaceModalWindow';
import ReleaseModalWindow from './release/releaseModal';

import getBookingAction from '../util/getBookingAction';
import CancelBookingModalWindow from './reScheduleOrCancelBooking/cancelBookingModalWindow';
import { StringsMeta } from '../util/appUtils';

const BookingActionButton = ({ bookingItem, bookingActionComplete, openRescheduleModalWindow }) => {
  const [isPreScreenOpen, openClosePreScreenModal] = useState(false);
  const [isAccessOpen, openCloseAccessModal] = useState(false);
  const [isOccupySpaceOpen, openCloseOccupySpaceModal] = useState(false);
  const [isReleaseOpen, openCloseReleaseModal] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState(null);
  const [isOpen, openCloseModal] = useState(false);
  const [isDropdownOpen, setDropDown] = useState(false);
  const [reschedule, setRescheduleOrCancel] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.config);
  const { preScreeningProcess } = useSelector((state) => state.preScreening);
  const { accessInfo } = useSelector((state) => state.access);
  const { occupyResponse } = useSelector((state) => state.occupy);
  const { releaseInfo } = useSelector((state) => state.release);
  const { deleteInfo } = useSelector((state) => state.bookingInfo);
  const { categories } = useSelector((state) => state.bookingInfo);
  const companyTimeZone=userInfo &&userInfo.data &&userInfo.data.company && userInfo.data.company.timezone

  const isBookingAction = (bookingData) => {
    if (userInfo &&userInfo.data && userInfo.data.company) {
      return getBookingAction(bookingData, userRoles.data, userInfo.data.company.timezone);
    } return undefined;
  };

  const toggleDropDown = () => {
    setDropDown(!isDropdownOpen);
  };

  useEffect(() => {
    if ((!isPreScreenOpen
      && preScreeningProcess
      && preScreeningProcess.data
      && preScreeningProcess.data.length)
      || preScreeningProcess.err
    ) {
      bookingActionComplete();
    }
  }, [isPreScreenOpen]);

  useEffect(() => {
    if ((!isAccessOpen
      && accessInfo
      && accessInfo.data
      && accessInfo.data.message)
      || accessInfo.err
    ) bookingActionComplete();
  }, [isAccessOpen]);

  useEffect(() => {
    if ((!isReleaseOpen
      && releaseInfo
      && releaseInfo.data
      && releaseInfo.data.length)
      || releaseInfo.err
    ) bookingActionComplete();
  }, [isReleaseOpen]);

  useEffect(() => {
    if ((!isOccupySpaceOpen
      && occupyResponse
      && occupyResponse.data
      && occupyResponse.data.length)
      || occupyResponse.err
    ) bookingActionComplete();
  }, [isOccupySpaceOpen]);

  useEffect(() => {
    if (!isOpen
      && deleteInfo
      && deleteInfo.data
    ) bookingActionComplete();
  }, [isOpen]);

  const openPreScreeningModalWindow = () => {
    openClosePreScreenModal(!isPreScreenOpen);
  };

  const openAccessModalWindow = () => {
    openCloseAccessModal(!isAccessOpen);
  };

  const openOccupySpaceModalWindow = () => {
    openCloseOccupySpaceModal(!isOccupySpaceOpen);
  };

  const openReleaseModalWindow = () => {
    openCloseReleaseModal(!isReleaseOpen);
  };

  const openBookingModelWindow = (bookingData, name) => {
    setSelectedBookingItem(bookingData);
    if (name === StringsMeta.PRE_SCREEN) openPreScreeningModalWindow();
    if (name === StringsMeta.ACCESS) openAccessModalWindow();
    if (name === StringsMeta.OCCUPY) openOccupySpaceModalWindow();
    if (name === StringsMeta.RELEASE) openReleaseModalWindow();
  };

  let spaceOccupyProcessModalWindow;
  if (isPreScreenOpen && selectedBookingItem) {
    spaceOccupyProcessModalWindow = (
      <PreScreeningModalWindow
        bookingData={selectedBookingItem}
        modalWindowOpen={isPreScreenOpen}
        openModalWindow={openPreScreeningModalWindow}
      />
    );
  }

  if (isAccessOpen && selectedBookingItem) {
    spaceOccupyProcessModalWindow = (
      <AccessModalWindow
        modalWindowOpen={isAccessOpen}
        openModalWindow={openAccessModalWindow}
        bookingItem={selectedBookingItem}
      />
    );
  }

  if (isOccupySpaceOpen && selectedBookingItem) {
    spaceOccupyProcessModalWindow = (
      <OccupySpaceModalWindow
        bookingData={selectedBookingItem}
        modalWindowOpen={isOccupySpaceOpen}
        openModalWindow={openOccupySpaceModalWindow}
      />
    );
  }

  if (isReleaseOpen) {
    spaceOccupyProcessModalWindow = (
      <ReleaseModalWindow
        bookingItem={selectedBookingItem}
        modalWindowOpen={isReleaseOpen}
        openModalWindow={openReleaseModalWindow}
      />
    );
  }

  const openCancelBookingModal = () => {
    openCloseModal(!isOpen);
    if (reschedule) {
      setRescheduleOrCancel(true);
    } else {
      setRescheduleOrCancel(false);
    }
  };

  const isButtonDisabled = (bookingObj) => {
    if (isBookingAction(bookingObj) && isBookingAction(bookingObj).length === 1) {
      if (isBookingAction(bookingObj)[0] === StringsMeta.OCCUPY) {
        const plannedInBefore = convertUtcTimetoCompanyTimeZone(bookingObj.planned_in_before, 'D MMM YYYY HH:mm:ss', companyTimeZone);
        const currentTimeZoneTime =  getCurrentTimeZoneTime('D MMM YYYY HH:mm:ss', companyTimeZone);
        if (plannedInBefore > currentTimeZoneTime) {
          return true;
        }
      }
      return false;
    } if (isBookingAction(bookingObj) && isBookingAction(bookingObj)[1] === StringsMeta.OCCUPY) {
      const plannedInBefore = convertUtcTimetoCompanyTimeZone(bookingObj.planned_in_before, 'D MMM YYYY HH:mm:ss',companyTimeZone);
      const currentTimeZoneTime =getCurrentTimeZoneTime('D MMM YYYY HH:mm:ss', companyTimeZone);
      if (plannedInBefore > currentTimeZoneTime) {
        return true;
      }
    }
    return false;
  };

  const btnClass = classNames({
    'cursor-disabled': isBookingAction(bookingItem) && isBookingAction(bookingItem)[0] === StringsMeta.RELEASED,
    'pr-2px': isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 2 && isButtonDisabled(bookingItem),
    'pr-0': isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 2 && !isButtonDisabled(bookingItem),
    'font-size-xsmall': true,
  });

  let cancelBookingModalWindow;

  if (isOpen) {
    cancelBookingModalWindow = (
      <CancelBookingModalWindow
        bookingItem={bookingItem}
        modalWindowOpen={isOpen}
        openModalWindow={openCancelBookingModal}
        reschedule={reschedule}
        openBookModalWindow={openRescheduleModalWindow}
        category={categories && categories.data && bookingItem.space && bookingItem.space.category_id && bookingItem.space.category_id.id && find(categories.data, { id: bookingItem.space.category_id.id })}
      />
    );
  }

  return (
    <div>
      <ButtonGroup id="bookingButton">
        <Button
          size="sm"
          className={`${btnClass} buttonBismark2`}
          disabled={isButtonDisabled(bookingItem)}
          onClick={
            () => openBookingModelWindow(
              bookingItem,
              isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 1 ? isBookingAction(bookingItem)[0] : isBookingAction(bookingItem)[1],
            )
          }
        >
          {isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 1 ? (
            <>
              {isBookingAction(bookingItem)[0]}
            </>
          ) : (
            <>
              {isBookingAction(bookingItem) && isBookingAction(bookingItem).length && isBookingAction(bookingItem)[1]}
            </>
          )}
        </Button>
        {isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 2 && (
          <ButtonDropdown isOpen={isDropdownOpen} toggle={toggleDropDown} size="sm">
            <DropdownToggle
              className="bismark2Dropdown border-r-3"
            >
              {' '}
              |
              {' '}
              <span className="circle-dropdown ml-1"><FontAwesomeIcon icon={faCaretDown} size="xs" className="mb-1px" /></span>
            </DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem onClick={() => openCancelBookingModal('reschedule')}>Reschedule</DropdownItem> */}
              <DropdownItem onClick={() => openCancelBookingModal()}>Cancel</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        )}
      </ButtonGroup>
      {spaceOccupyProcessModalWindow}
      {cancelBookingModalWindow}
    </div>
  );
};

BookingActionButton.defaultProps = {
  openRescheduleModalWindow: () => { },
};

BookingActionButton.propTypes = {
  bookingItem: PropTypes.shape({
    planned_in: PropTypes.string,
    duration: PropTypes.number,
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    planned_out: PropTypes.string,
    name: PropTypes.string,
    space: PropTypes.shape({
      category_id: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number,
      }),
    }),
  }).isRequired,
  bookingActionComplete: PropTypes.func.isRequired,
  openRescheduleModalWindow: PropTypes.func,
};

export default BookingActionButton;
