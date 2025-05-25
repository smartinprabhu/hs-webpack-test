/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import Button from '@mui/material/Button';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import compact from 'lodash/compact';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import SelectedSpaceView from '../createBookingViews/treeView/selectedSpaceView';

import FloorViewLayout from '../createBookingViews/floorView/floorViewLayout';
import BookingLayoutViews from '../createBookingViews/listView/bookingLayoutViews';
import LayoutTreeView from '../createBookingViews/treeView/layoutTreeView';
import BookingFilters from '../createBookingViews/bookingFilters/bookingFilters';
import {
  removeBooking, saveMultidaysBookingData,
  resetBooking, getFloorView, setMapExpansionInfo,
  setBookingData, addGuestData, setRefresh,
} from '../bookingService';

import ConfirmBookingModalWindow from './confirmBookingModalWindow';
import Loading from '../../shared/loading';
import multidayBookingObj from './buildSaveBookingObject';
import CancelButtonGrey from '../../shared/cancelButtonGreyRounded';
import bookingProcess from '@images/bookingProcessBlue.ico';
import '../createBookingViews/treeView/selectedSapceView.scss';

const appModels = require('../../util/appModels').default;

export const CategoryName = React.createContext();

const BookingLayout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.config);
  const [viewType, changeView] = useState(userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.default_view_for_booking ? userRoles.data.booking.default_view_for_booking : 'Tree view');
  const [mapId, setFloorMapId] = useState();
  const [treeViewBookingType, setTreeViewBookingType] = useState('individual');
  const [floorName, setfloorName] = useState();
  const [expantion, setExpantion] = useState(null);
  const [floorViewType, floorViewUpdate] = useState({
    floorView: '',
  });

  const BookingData = useSelector((state) => state.bookingInfo.bookingInfo);
  const {
    savedDataToSpaceView, floorView, multidaysAvailabilityInfo, saveHostInfo, refreshInfo, mapExpansionInfo,
  } = useSelector((state) => state.bookingInfo);
  const { saveBookingLayoutViews } = useSelector((state) => state.myBookings);
  const [category, setCategory] = useState('');
  const [selectGroupWorkStation, getGroupWorkStations] = useState([]);
  const [selectedGroupEmployees, setGroupEmployees] = useState();
  const [allEmployees, setAllEmployees] = useState();
  const [treeViewData, setTreeViewData] = useState([]);
  const [spaceAvailabilityData, setSpaceAvailabilityData] = useState([]);
  const [selectedNode, setSelectedNode] = useState();
  const [workStationForTree, setWorkStationForTree] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [classData, setClassData] = useState('');

  const [openmodalPreview, openPreviewModalWindow] = useState(false);
  const openPreview = () => {
    dispatch(resetBooking());
    openPreviewModalWindow(!openmodalPreview);
  };

  const setSelectedSpaceView = (treeData, employeesData) => {
    setTreeViewData(treeData);
    setAllEmployees(employeesData);
  };

  useEffect(() => {
    if (savedDataToSpaceView && savedDataToSpaceView.BuildTreeData && savedDataToSpaceView.DropDownEmployees) {
      setSelectedSpaceView(savedDataToSpaceView.BuildTreeData, savedDataToSpaceView.DropDownEmployees);
    }
  }, [savedDataToSpaceView]);

  const enableFinish = () => {
    if (selectGroupWorkStation && selectGroupWorkStation.length > 0) {
      if (BookingData && BookingData.workStationType && BookingData.workStationType.type !== 'room' && employees && employees.length && employees.length !== selectGroupWorkStation.length) {
        return true;
      }
      const array = [];
      selectGroupWorkStation.map((workStation) => {
        if (workStation.multidaysBookings && workStation.multidaysBookings.length === 0) {
          array.push(workStation);
        }
      });
      if (array && array.length) {
        return true;
      }
      return false;
    } return true;
  };

  const setSelectedNodeChild = (node) => {
    setSelectedNode(node);
  };

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    window.addEventListener('beforeunload', alertUser);
    return () => {
      // eslint-disable-next-line no-use-before-define
      window.removeEventListener('beforeunload', alertUser);
    };
  }, [window]);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    if (treeViewBookingType) {
      getGroupWorkStations([]);
    }
  }, [treeViewBookingType]);

  useEffect(() => {
    if (BookingData && BookingData.site
      && userRoles && userRoles.data && userRoles.data.filters && BookingData.workStationType) {
      setWorkStationForTree([]);
      if (category && category.id) {
        BookingData.workStationType = category;
        setBookingData(BookingData);
      }
      dispatch(getFloorView(appModels.LOCATION, userInfo && userInfo.data && userInfo.data.company.id));
      getGroupWorkStations([]);
    }
  }, [BookingData, category, refreshInfo]);

  const setBookingTypeForTreeView = (type) => {
    setTreeViewBookingType(type);
  };

  useEffect(() => {
    if (refreshInfo && refreshInfo.reset && BookingData && BookingData.site
      && userRoles && userRoles.data && userRoles.data.filters && BookingData.workStationType) {
      setWorkStationForTree([]);
      changeView(refreshInfo.type);
      // dispatch(setRefresh(false));
      getGroupWorkStations([]);
    }
  }, [BookingData, refreshInfo]);

  const saveBooking = () => {
    if (BookingData && BookingData.bookingId) dispatch(removeBooking(BookingData.bookingId));
    const selectGroupWorkStationData = JSON.parse(JSON.stringify(selectGroupWorkStation));
    const bookingObj = JSON.parse(JSON.stringify(BookingData));
    const userObj = JSON.parse(JSON.stringify(userInfo));
    let selectedGroupEmployeesObj;
    if (selectedGroupEmployees) selectedGroupEmployeesObj = JSON.parse(JSON.stringify(selectedGroupEmployees));
    const treeViewBookingTypeObj = JSON.parse(JSON.stringify(treeViewBookingType));
    const allEmployeesData = JSON.parse(JSON.stringify(allEmployees));
    const bookSpaceData = multidayBookingObj(selectGroupWorkStationData, bookingObj, userObj, selectedGroupEmployeesObj, treeViewBookingTypeObj, allEmployeesData, saveHostInfo);
    if (bookSpaceData && bookSpaceData.length) dispatch(saveMultidaysBookingData(bookSpaceData));
  };

  useEffect(() => {
    if (multidaysAvailabilityInfo && multidaysAvailabilityInfo.data && multidaysAvailabilityInfo.data.length > 0) {
      const treeData = [];
      treeData.push(multidaysAvailabilityInfo && multidaysAvailabilityInfo.data);
      setWorkStationForTree(compact(uniqBy(treeData.flat(), 'id')));
    } else if (multidaysAvailabilityInfo && multidaysAvailabilityInfo.err && selectedNode && selectedNode.id) {
      const findIndexOfSelectedNode = findIndex(workStationForTree, { id: selectedNode.id });
      if (findIndexOfSelectedNode >= 0) {
        workStationForTree[findIndexOfSelectedNode].error = multidaysAvailabilityInfo.err;
        setWorkStationForTree(workStationForTree);
      }
    }
  }, [multidaysAvailabilityInfo]);

  const workSpaceSelect = (workStation, employee, selectedAllEmployees) => {
    if (selectedAllEmployees) setAllEmployees(selectedAllEmployees);
    if (employee) {
      setGroupEmployees(employee);
      getGroupWorkStations(workStation);
    }
    getGroupWorkStations(workStation);
  };

  const updateWorkSpace = (workSpaceObj, employee) => {
    workSpaceSelect(workSpaceObj, employee, savedDataToSpaceView.AllEmployees);
  };

  const dashboardRedirect = () => {
    dispatch(addGuestData(false));
    if(saveBookingLayoutViews) {
    history.push({ pathname: '/mybookings' });
    } else {
      history.push({ pathname: '/' });
    }
  };

  useEffect(() => {
    if (savedDataToSpaceView && !savedDataToSpaceView.Expand) {
      setClassData('col-lg-6 selected-Space bg-buffer float-right pl-0 pr-0');
    }
    if (savedDataToSpaceView && savedDataToSpaceView.Expand) {
      setClassData('col-lg-12 bg-buffer float-right pl-0 pr-0');
    }
  }, [savedDataToSpaceView]);

  const loadFloorView = (data) => {
    setFloorMapId(data.id);
    setfloorName(data.space_name);
  };

  useEffect(() => {
    dispatch(setMapExpansionInfo(false));
  }, []);

  useEffect(() => {
    if (viewType === 'floor' || viewType === 'Map View') {
      floorViewUpdate({
        ...floorViewType,
        floorView: <FloorViewLayout
          setExpantion={setExpantion}
          workSpaceSelect={workSpaceSelect}
          setSpaceAvailabilityData={setSpaceAvailabilityData}
          floorId={mapId}
          BookingData={BookingData}
          treeBookingType={treeViewBookingType}
          getGroupWorkStations={getGroupWorkStations}
          category={category}
          setEmployees={setEmployees}
        />,
      });
    } else if (viewType === 'tree' || viewType === 'Tree view') {
      floorViewUpdate({
        ...floorViewType,
        floorView:
  <CategoryName.Provider value={category.name || (BookingData && BookingData.workStationType && BookingData.workStationType.name)}>
    <LayoutTreeView
      data={workStationForTree}
      BookingData={BookingData}
      workSpaceSelect={workSpaceSelect}
      setSpaceAvailabilityData={setSpaceAvailabilityData}
      getGroupWorkStations={getGroupWorkStations}
      treeBookingType={treeViewBookingType}
      setSelectedNodeChild={setSelectedNodeChild}
      setEmployees={setEmployees}
    />
  </CategoryName.Provider>,
      });
    } else {
      floorViewUpdate({
        ...floorViewType,
        floorView: '',
      });
    }
  }, [viewType, mapId, treeViewBookingType, multidaysAvailabilityInfo, workStationForTree]);
  if (BookingData && BookingData.site && BookingData.date) {
    return (
      <Row className="mt-3 m-0 booking-layout">
        <Col sm="12" md="12" lg="12">
          {!mapExpansionInfo && (
            <Row>
              <Col xs="3" sm="2" md="2" lg="1" className="mb-3">
                <img src={bookingProcess} width="50" height="50" alt="bookingProcess" />
              </Col>
              <Col xs="6" sm="7" md="7" lg="8" className="pl-0 ml-n2">
                <h2 className="meeting-room-header">Book Meeting Room / Desk / Office</h2>
              </Col>
              <Col xs="3" sm="3" md="3" lg="3">
                <CancelButtonGrey openCloseModalWindow={dashboardRedirect} className="mt-3" />
              </Col>
            </Row>
          )}
          <Card>
            {!mapExpansionInfo && (
              <CardHeader className="bufferBackground px-3 py-2">
                <Row>
                  <Col sm="12" md="5" lg="3" xs="12" className="pt-2 layout-text">
                    Layout
                    <>
                      <Button className={`ml-2 roundCorners ${viewType === 'tree' || viewType === 'Tree view' ? 'tree-floor-btn' : 'tree-floor-outline-btn'} `} outline  variant="contained" size="sm" onClick={() => changeView('tree')} disabled={multidaysAvailabilityInfo && multidaysAvailabilityInfo.loading}>Tree View</Button>
                      <Button className={`ml-2 roundCorners ${viewType === 'floor' || viewType === 'Map View'? 'tree-floor-btn' : 'tree-floor-outline-btn'} `} outline  variant="contained" size="sm" onClick={() => changeView('floor')} disabled={multidaysAvailabilityInfo && multidaysAvailabilityInfo.loading}>Map View</Button>
                    </>
                  </Col>
                  <Col sm="12" md="7" lg="9" xs="12" className="pt-2">
                    <>
                      <BookingFilters
                        viewType={viewType}
                        bookingData={BookingData}
                        loadFloorView={loadFloorView}
                        setCategoryId={setCategory}
                        floorName={floorName}
                      />
                    </>
                  </Col>
                </Row>

              </CardHeader>
            )}
            <CardBody className="min-height-380px">
              <div className={savedDataToSpaceView.Expand ? 'col-lg-12 float-left' : 'col-lg-6 float-left'}>
                <BookingLayoutViews
                  expantion={expantion}
                  BookingData={BookingData}
                  floorId={mapId}
                  viewType={viewType}
                  setBookingType={setBookingTypeForTreeView}
                  workSpaceSelect={workSpaceSelect}
                />
                {(floorView && !floorView.loading || multidaysAvailabilityInfo && !multidaysAvailabilityInfo.loading) && floorView.data && floorViewType.floorView}
                {(floorView && floorView.loading || multidaysAvailabilityInfo && multidaysAvailabilityInfo.loading) && (
                <div className="text-center p-5" data-testid="loader">
                  <Loading />
                </div>
                )}
              </div>
              <Col sm="9" md="6" lg="6" xs="12" className="pt-2 pb-5 float-right">
                  {spaceAvailabilityData && spaceAvailabilityData.length !==0 && multidaysAvailabilityInfo && !multidaysAvailabilityInfo.loading && multidaysAvailabilityInfo.data && (
                    <div className="mt-2 ml-2 p-2 text-center flex-container">
                      <div className="flex-child">
                        <strong>Available {spaceAvailabilityData[0].workstationtype.type} : </strong>
                        <span>{spaceAvailabilityData[0].ready}</span>
                      </div>
                      <div className="flex-child">
                        <strong>Booked {spaceAvailabilityData[0].workstationtype.type} : </strong>
                        <span>{spaceAvailabilityData[0].booked}</span>
                      </div>
                      <div className="flex-child">
                        <strong>Occupied {spaceAvailabilityData[0].workstationtype.type} : </strong>
                        <span>{spaceAvailabilityData[0].occupied}</span>
                      </div>
                    </div>
                  )}
                </Col>
              <div className="ml-5">
                {viewType === 'floor' && savedDataToSpaceView && savedDataToSpaceView.FloorObject && savedDataToSpaceView.FloorObject.length > 0 ? (
                  <Col sm="12" md="12" className={classData}>
                    <SelectedSpaceView
                      workSpace={savedDataToSpaceView.FloorObject}
                      updateWorkSpace={updateWorkSpace}
                      viewType={viewType}
                      colSize
                      expand={savedDataToSpaceView.Expand}
                    />
                  </Col>
                ) : null}
                {treeViewData && multidaysAvailabilityInfo && multidaysAvailabilityInfo.data && (
                  <Col sm="12" md="12" lg="6" className={classData}>
                    <SelectedSpaceView
                      viewType={viewType}
                      updateWorkSpace={updateWorkSpace}
                      treeViewData={treeViewData}
                    />
                  </Col>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" className="mt-3 pb-3">
        
          <Button
            type="button"
            className={enableFinish() ? 'cursor-disabled next-btn float-right' : ' next-btn float-right'}
             variant="contained"
            onClick={openPreview}
            disabled={enableFinish()}
            data-testid="next"
          >
            Next
          </Button>
          <Button
          variant="contained"
            type="button"
            className="mr-2 float-right back-button"
            onClick={dashboardRedirect}
            data-testid="back"
          >
            Back
          </Button>
        </Col>
        {selectGroupWorkStation && selectGroupWorkStation.length > 0 && (
          <ConfirmBookingModalWindow
            bookingData={BookingData}
            selectWorkStation={selectGroupWorkStation}
            saveBooking={saveBooking}
            openmodalPreview={openmodalPreview}
            openPreview={openPreview}
            selectedEmployees={allEmployees}
            treeViewBookingType={treeViewBookingType}
          />
        )}
      </Row>
    );
  }
  return (
    <Redirect to="/" />
  );
};

export default BookingLayout;
