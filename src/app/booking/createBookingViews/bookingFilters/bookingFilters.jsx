/* eslint-disable max-len */
/* eslint-disable no-alert */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { setRefresh } from '../../bookingService';
// eslint-disable-next-line import/no-cycle
import BookingModalWindow from '../../createBooking/bookingModalWindow';
import '../../booking.scss';
import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';

// const appConfig = require('@app/config/appConfig').default;

const BookingFilters = ({
  viewType, loadFloorView, floorName,
  //  setCategoryId, bookingData
}) => {
  const dispatch = useDispatch();
  const [shiftDropDownOpen, shiftDropDownToggle] = useState();
  // const [categoryDropDown, categoryToggle] = useState();
  const [isOpen, openCloseModal] = useState(false);
  const BookingData = useSelector((state) => state.bookingInfo.bookingInfo);
  let {
    floorView,
    // categories
  } = useSelector((state) => state.bookingInfo);

  function compare( firstSpace, secondSpace ) {
    if ( firstSpace.sort_sequence < secondSpace.sort_sequence ){
      return -1;
    }
    if ( firstSpace.sort_sequence > secondSpace.sort_sequence ){
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    if(floorView && floorView.data && floorView.data.length){
      let childData = floorView.data;
      childData = childData.sort(compare);
      floorView = uniqBy(union(childData, floorView), 'id');
      loadFloorView(floorView[0]);
    }
  }, [floorView]);


  const openBookingModalWindow = () => {
    openCloseModal(!isOpen);
  };
  const setPageRefresh = () => {
    const obj = {
      type: 'floor',
      reset: true,
    };
    dispatch(setRefresh(obj));
  };

  let myBookingModal;
  if (isOpen) {
    myBookingModal = (
      <BookingModalWindow
        shiftModalWindowOpen={isOpen}
        openModalWindow={openBookingModalWindow}
        bookingData={BookingData}
        viewType={viewType}
        filter
      />
    );
  }

  return (
    <span>
      {(viewType !== 'tree' && viewType !== 'Tree view') && floorView && floorView.data && (
        <>
          <span className="strong filter-by-text">
            Filter By
          </span>
          <span className="ml-3">
            <ButtonDropdown isOpen={shiftDropDownOpen} toggle={() => shiftDropDownToggle(!shiftDropDownOpen)} className="mr-2">
              <DropdownToggle caret className="whiteDropDown bg-white py-1">
                {floorName || (floorView && floorView.data && floorView.data[0] && floorView.data[0].space_name)}
              </DropdownToggle>
              <DropdownMenu>
                {floorView.data.map((floor) => (
                  <React.Fragment key={floor.id}>
                    {floor.file_path && (
                      <DropdownItem
                        className={`text-center ${floorName === floor.space_name ? 'cursor-disabled' : ''}`}
                        disabled={floorName === floor.space_name}
                        onClick={() => loadFloorView(floor)}
                      >
                        {floor.space_name}
                      </DropdownItem>
                    )}
                  </React.Fragment>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
          </span>
        </>
      )}
      {/* ToDO: this needs to be uncommented as per the functionality later when required */}
      {/* <ButtonDropdown isOpen={categoryDropDown} toggle={() => categoryToggle(!categoryDropDown)} className="ml-2">
        <DropdownToggle caret className="whiteDropDown py-1">
          Categories
        </DropdownToggle>
        <DropdownMenu>
          {categories
            && categories.data
            && categories.data.length > 0
            && categories.data.map((category) => (
              <DropdownItem
                disabled={bookingData && bookingData.workStationType && bookingData.workStationType.name === category.name}
                className="px-2"
                key={category.id}
                onClick={() => setCategoryId(category)}
              >
                <img
                  className="mt-n1"
                  src={`${window.location.origin}${category.file_path}`}
                  height="25"
                  width="25"
                  alt="workspace"
                />
                <span className="ml-1">
                  {category.name}
                </span>
              </DropdownItem>
            ))}
        </DropdownMenu>
      </ButtonDropdown> */}
      <Tooltip placement="top" target="refresh" title="Reset">
        <Button
          className="float-right refresh-btn"
          id="refresh"
          size="sm"
          onClick={() => setPageRefresh()}
        >
          <FontAwesomeIcon
            className="fa-2x refresh-icon text-center"
            icon={faSyncAlt}
          />
        </Button>
      </Tooltip>
      {myBookingModal}
    </span>
  );
};

BookingFilters.propTypes = {
  viewType: PropTypes.string.isRequired,
  loadFloorView: PropTypes.func,
  // setCategoryId: PropTypes.func,
  floorName: PropTypes.string,
  bookingData: PropTypes.shape({
    site: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      planned_in: PropTypes.string,
      planned_out: PropTypes.string,
    }),
    workStationType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
};

BookingFilters.defaultProps = {
  loadFloorView: () => { },
  // setCategoryId: () => { },
  floorName: '',
};

export default BookingFilters;
