/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Container,
  Card,
  CardHeader,
  Table,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import Button from '@mui/material/Button';

import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import { useSelector, useDispatch } from 'react-redux';
import find from 'lodash/find';
import uniqBy from 'lodash/uniqBy';
import pull from 'lodash/pull';

import MaintenanceImage from '@images/alertMessageBlack.svg';
import removeIcon from '@images/remove.png';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { getDateFormat } from '@shared/dateTimeConvertor';

import { saveBulkClean } from './adminMaintenanceService';

const ConfirmCleaningModalWindow = ({
  openConfirmCleaning, setOpenClose, bulkCleaningObj, checkedRows, setCheckRows, setIsAllChecked,
}) => {
  const [bulkCleanObj, setBulkCleanObj] = useState([]);
  const {
    workorder,
  } = useSelector((state) => state.bookingWorkorder);
  const dispatch = useDispatch();
  const [disableRemoveButton, setDisableRemoveButton] = useState(false);
  const { bulkOrders } = useSelector((state) => state.bookingWorkorder);
  const setCleanModalWindow = () => {
    setOpenClose(!openConfirmCleaning);
  };
  const { userRoles } = useSelector((state) => state.user);

  useEffect(() => {
    if (bulkCleaningObj && bulkCleaningObj && bulkCleaningObj.booking_ids && bulkCleaningObj.booking_ids.length > 0) {
      const bulkclean = [];
      bulkCleaningObj.booking_ids.map((booking) => {
        if (find(workorder.data, (order) => order.id === booking)) {
          bulkclean.push(find(workorder.data, (order) => order.id === booking));
          setBulkCleanObj(uniqBy(bulkclean, 'id'));
        }
      });
    } else {
      setBulkCleanObj([]);
    }
  }, [bulkCleaningObj]);

  const bulkClean = () => {
    dispatch(saveBulkClean(bulkCleaningObj.booking_ids, bulkCleaningObj.employee_id, bulkCleaningObj.start_date, bulkCleaningObj.end_date, bulkCleaningObj));
  };

  const removeSelectedBooking = (book) => {
    const updateBulkCleanObj = bulkCleanObj.filter((bookingres) => bookingres.id !== book.id);
    setBulkCleanObj(updateBulkCleanObj);
    const uncheckItem = pull(checkedRows, book.id);
    setCheckRows(uncheckItem);
    setIsAllChecked(false);
  };

  return (
    <div>
      <Modal className="confirm-cleaning" isOpen={openConfirmCleaning} toggle={setCleanModalWindow} size={bulkOrders && bulkOrders.data ? 'sm' : 'lg'}>
        <ModalHeader className="modal-category-header mb-2">
          <Row>
            <Col sm="8" xs="8">
              <h3>
                Confirm Cleaning
              </h3>
            </Col>
            <Col sm="4" xs="4">
              {bulkOrders && !bulkOrders.data && (
                <CancelButtonGrey openCloseModalWindow={setCleanModalWindow} className="mt-3" />
              )}
            </Col>
          </Row>
        </ModalHeader>
        <hr className="m-0" />
        <ModalBody>
          <Container>
            {bulkOrders && !bulkOrders.data && (
            <>
              <Card>
                <CardHeader className="p-2 bg-lightgrey border-0">
                  <img src={MaintenanceImage} height="20" width="20" alt="maintenance" className="mr-2" />
                  <span className="font-weight-800">
                    Maintenance
                  </span>
                </CardHeader>
              </Card>
              <div className="pl-4 pr-4 pt-1 pb-0">
                {bulkCleaningObj && bulkCleaningObj.booking_ids && bulkCleaningObj.booking_ids.length > 0 && (
                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 bt-0 ">
                        <span
                          aria-hidden="true"
                        >
                          Space Name
                        </span>
                      </th>
                      <th className="p-2 bt-0">
                        <span
                          aria-hidden="true"
                        >
                          Space Type
                        </span>
                      </th>
                      <th className="p-2 bt-0">
                        <span
                          aria-hidden="true"
                        >
                          Planned In
                        </span>
                      </th>
                      <th className="p-2 bt-0">
                        <span
                          aria-hidden="true"
                        >
                          Planned Out
                        </span>
                      </th>
                      <th className="p-2 bt-0">
                        {}
                        <span />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkCleanObj && bulkCleanObj.length > 0 && bulkCleanObj.map((book) => (
                      <tr key={book.id}>
                        <td className="px-2">
                          {book.asset.name}
                        </td>
                        <td className="px-2">
                          {book.space_category.name}
                        </td>
                        <td className="px-2">
                          {book.booking && book.booking.planned_in && (
                            <>{getDateFormat(book.booking.planned_in, userRoles.data, 'datetime')}</>
                          )}
                        </td>
                        <td className="px-2">
                          {book.booking && book.booking.planned_out && (
                            <>{getDateFormat(book.booking.planned_out, userRoles.data, 'datetime')}</>
                          )}
                        </td>
                        {!disableRemoveButton && (
                        <td className="px-2">
                          <Button
                          variant="contained"
                            className="btn-removeButton"
                            size="sm"
                            onClick={() => removeSelectedBooking(book)}
                          >
                            <img
                              src={removeIcon}
                              alt="space"
                              height="15"
                              width="15"
                              // onClick={cancelWindow}
                              aria-hidden="true"
                              className="mr-1"
                            />
                            Remove
                          </Button>
                        </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                )}
                {bulkCleaningObj && bulkCleaningObj.booking_ids && bulkCleaningObj.booking_ids.length === 0 && (
                <div className="text-center mt-4">
                  Please select atleast one Booking
                </div>
                )}
              </div>
            </>
            )}
            {bulkOrders && bulkOrders.data && (
              <SuccessAndErrorFormat response={bulkOrders} successMessage="Cleaning is success." />
            )}
            {bulkOrders && bulkOrders.err && bulkOrders.err.error && bulkOrders.err.error.message && (
              <SuccessAndErrorFormat response={bulkOrders} />
            )}
          </Container>

        </ModalBody>
        <ModalFooter>
          {bulkOrders && !bulkOrders.data && !bulkOrders.err && (
            <Button variant="contained" disabled={bulkCleaningObj && bulkCleaningObj.booking_ids && bulkCleaningObj.booking_ids.length === 0} className="confirm-btn float-right" onClick={() => { bulkClean(); setDisableRemoveButton(true); }}>
              {bulkOrders && bulkOrders.loading && (
                <Spinner size="sm" color="light" className="mr-2" />
              )}
              Confirm
            </Button>
          )}
          {bulkOrders && (bulkOrders.data || bulkOrders.err) && (
            <Button variant="contained" color="confirm-btn" className="float-right" onClick={() => { setDisableRemoveButton(false); setCleanModalWindow(); }}>
              Ok
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

ConfirmCleaningModalWindow.propTypes = {
  openConfirmCleaning: PropTypes.bool,
  setOpenClose: PropTypes.func,
  bulkCleaningObj: PropTypes.shape({
    end_date: PropTypes.string,
    start_date: PropTypes.string,
    employee_id: PropTypes.number,
    booking_ids: PropTypes.arrayOf(PropTypes.number),
  }),
};

ConfirmCleaningModalWindow.defaultProps = {
  openConfirmCleaning: undefined,
  setOpenClose: undefined,
  bulkCleaningObj: undefined,
};

export default ConfirmCleaningModalWindow;
