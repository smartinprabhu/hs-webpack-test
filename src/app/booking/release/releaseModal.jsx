import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal, ModalBody, Container, Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { TimeZoneDateConvertor } from '@shared/dateTimeConvertor';
import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import saveReleaseData from './releaseService';

import './release.scss';

const ReleaseModalWindow = ({ modalWindowOpen, openModalWindow, bookingItem }) => {
  const dispatch = useDispatch();
  const [status, releaseStatus] = useState(false);
  const [GuestMessage, showGuestMessage] = useState(false);
  const saveRelease = () => {
    dispatch(saveReleaseData(bookingItem.space.id, bookingItem.id));
    releaseStatus(true);
  };
  const { releaseInfo } = useSelector((state) => state.release);
  useEffect(() => {
    if (bookingItem && bookingItem.visitor && bookingItem.visitor.is_guest) {
      showGuestMessage(true);
    } else {
      showGuestMessage(false);
    }
  }, [bookingItem]);

  return (
    <Modal className="release-space-modal" isOpen={modalWindowOpen} toggle={openModalWindow} id="release">
      <ModalBody>
        {((releaseInfo && releaseInfo.data && !releaseInfo.data.length) || !releaseInfo.err) && (
          <CancelButtonGrey openCloseModalWindow={openModalWindow} />
        )}
        <Container className="border-bottom">
          <h2>Release Workspace</h2>
          {((releaseInfo && releaseInfo.data && !releaseInfo.data.length) || !releaseInfo.err) && (
            <h4 className="light-text text-center pt-3 pb-3">
              Do you want to release the
              {' '}
              {bookingItem.space.space_name}
              {' '}
              assigned to you for
              {' '}
              <TimeZoneDateConvertor date={bookingItem.planned_in} format="DD/MMMM/YYYY" />
              {' '}
              Shift
              {bookingItem.shift.name}
              ?
            </h4>
          )}
          {GuestMessage && (
            <div className="text-center">
              Are you sure you want to Release this Guest booking?
            </div>
          )}
          {releaseInfo && releaseInfo.data && releaseInfo.data.length > 0 && (
            <div className="text-center text-success my-3">
              <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
              {releaseInfo.message || (
                <span>
                  The
                    {' '}
                  <span className="font-weight-700">
                    {bookingItem.space.name}
                  </span>
                    {' '}
                  assigned to you for
                    {' '}
                  <span className="font-weight-700">
                    <TimeZoneDateConvertor date={bookingItem.planned_in} format="DD/MMMM/YYYY" />
                  </span>
                    {' '}
                  <span className="font-weight-700">
                    Shift
                    {bookingItem.shift.name}
                  </span>
                    {' '}
                  has been released successfully.
                </span>
              )}
            </div>
          )}
          {releaseInfo && releaseInfo.err && releaseInfo.err.error
            && releaseInfo.err.error.message && (
              <div className="mb-2">
                <SuccessAndErrorFormat response={releaseInfo} />
              </div>
          )}
        </Container>
        <div className="my-3">
          {(status && releaseInfo && releaseInfo.data && releaseInfo.data.length)
            || releaseInfo.err
            ? <Button type="button" className="float-right"  variant="contained" onClick={openModalWindow}>Ok</Button>
            : (
              <Button type="button" className="float-right"  variant="contained" onClick={() => saveRelease()}>
                {releaseInfo && releaseInfo.loading && (
                  <Spinner size="sm" color="light" />
                )}
                <span className="ml-2" />
                Confirm
              </Button>
            )}
        </div>
      </ModalBody>
    </Modal>
  );
};

ReleaseModalWindow.propTypes = {
  modalWindowOpen: PropTypes.bool.isRequired,
  openModalWindow: PropTypes.func.isRequired,
  bookingItem: PropTypes.shape({
    id: PropTypes.number,
    access_status: PropTypes.bool,
    visitor: PropTypes.shape({
      is_guest: PropTypes.bool,
    }),
    company: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    planned_in: PropTypes.string,
    space: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    shift: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default ReleaseModalWindow;
