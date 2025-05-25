/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import {
  Modal, ModalBody, ModalFooter, Table, ModalHeader,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { clearMultipleDaysSpacesData, clearCapLimitData } from '../bookingService';
import { StringsMeta } from '../../util/appUtils';

const CapLimitModal = ({
  capLimitModal, setCapLimitModal, capsLimitInfo, setSelectedFloor, setSpacesTrue,
}) => {
  const dispatch = useDispatch();
  const toggleCloseModal = () => {
    setCapLimitModal(false);
    setSelectedFloor(null);
    setSpacesTrue(false);
    dispatch(clearMultipleDaysSpacesData());
    dispatch(clearCapLimitData());
  };

  return (

    <Modal isOpen={capLimitModal} size="md">
      <div className="mt-2">
        <ModalHeader className="modal-justify-header">
          List of participants with the cap limit
        </ModalHeader>
      </div>
      <ModalBody>
        <>

          <Table responsive className="mb-0">
            <thead className="bg-gray-light">
              <tr>
                <th className="p-2 min-width-140">
                  <span aria-hidden="true" className="cursor-pointer d-inline-block">
                    Employee Name
                  </span>
                </th>

                <th className="p-2 min-width-140">
                  <span aria-hidden="true" className="cursor-pointer d-inline-block">
                    Available Limit
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {capsLimitInfo && capsLimitInfo.data && capsLimitInfo.data.length && capsLimitInfo.data.map((data) => (
                <tr key={data.employeeId}>
                  {data && !data.validity && (
                    <>
                      <td className="font-weight-400 ">{data.employeeName}</td>
                      <td className="font-weight-400">{data['available-limit']}</td>
                    </>
                  )}
                </tr>
              ))}
              <tr className="text-danger">
                <td colSpan="2">
                  <p className="mt-2 mb-0 pb-0 font-size-12px text-center">
                    {StringsMeta.CAPLIMIT_ERROR_MESSAGE}
                  </p>
                </td>
              </tr>

            </tbody>
          </Table>
        </>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" onClick={toggleCloseModal}  variant="contained">Ok</Button>
      </ModalFooter>
    </Modal>
  );
};

CapLimitModal.defaultProps = {
  setSelectedFloor: () => { },
  capLimitModal: false,
};
CapLimitModal.propTypes = {
  capLimitModal: PropTypes.bool,
  setCapLimitModal: PropTypes.func.isRequired,
  capsLimitInfo: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  setSelectedFloor: PropTypes.func,
  setSpacesTrue: PropTypes.func.isRequired,
};
export default CapLimitModal;
