/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ThemeProvider } from '@material-ui/core/styles';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import preventiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import workordersWhite from '@images/icons/workorderTransparent.svg';
import location from '@images/icons/locationBlack.svg';
import assetIcon from '@images/icons/assetDefault.svg';
import scheduleDate from '@images/icons/scheduleDate.ico';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import inProgressNoCircle from '@images/icons/inProgressNoCircle.svg';
import completedNoCircle from '@images/icons/activeGreen.svg';
import theme from '../../util/materialTheme';
import {
  generateErrorMessage, truncate, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getPPMViewerData } from '../../preventiveMaintenance/ppmService';
import {
  getWorkorderFilter,
} from '../../workorders/workorderService';

const eventDetails = (props) => {
  const {
    eventList, atFinish, eventDetailModel, companyDetails, isInspection,
  } = props;
  const dispatch = useDispatch();
  const statusInprogress = ['assigned', 'in_progress', 'ready'];
  const statusCompleted = ['Completed', 'done'];
  const [isRedirect, setRedirect] = useState(false);
  const [modal, setModal] = useState(eventDetailModel);
  const [event, setEvent] = useState({});
  const [company, setCompany] = useState('');
  const [detail, setDetail] = useState([]);
  const [isButtonHover, setButtonHover] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(0);
  const { userInfo } = useSelector((state) => state.user);

  const {
    ppmViewData,
  } = useSelector((state) => state.ppm);

  function loadChecklistType(cType) {
    let resType = '';
    if (cType) {
      if (cType === 'e') {
        resType = 'Equipment';
      } else {
        resType = 'Space';
      }
    }
    return resType;
  }

  function loadChecklistDetail(cDetail) {
    const resDetail = {};
    if (cDetail) {
      resDetail.orders = [];
      resDetail.category_type = loadChecklistType(cDetail.type);
      resDetail.space_name = cDetail.name;
      resDetail.path_name = cDetail.space && cDetail.space.path_name ? cDetail.space.path_name : '';
      resDetail.team_id = false;
      resDetail.equipment_name = cDetail.name;
      resDetail.equipment_number = cDetail.equipment ? cDetail.equipment.equipment_seq : '';
      resDetail.location_id = cDetail.equipment ? cDetail.equipment.location_id : false;
    }
    return resDetail;
  }

  const toggle = () => {
    setCurrentSpace(0);
    setModal(!modal);
    atFinish();
  };

  useEffect(() => {
    if (companyDetails && companyDetails.data) {
      const companyName = companyDetails.data.company.name;
      setCompany(companyName);
    }
  }, [companyDetails]);

  useEffect(() => {
    if (eventList) {
      setEvent(eventList);
      if (eventList && Object.keys(eventList).length && Object.keys(eventList).length > 0) {
        dispatch(getPPMViewerData(eventList.orderId, isInspection));
      }
    }
  }, [eventList]);

  useEffect(() => {
    if (ppmViewData && ppmViewData.data && ppmViewData.data.assets && ppmViewData.data.assets.length > 0 && detail && detail.length === 0) {
      setDetail(ppmViewData.data.assets[0]);
    }
  }, [ppmViewData, detail]);

  useEffect(() => {
    if (ppmViewData && ppmViewData.data && ppmViewData.data.assets && !ppmViewData.data.assets.length
      && ppmViewData.data.check_list_ids && ppmViewData.data.check_list_ids.length > 0 && detail && detail.length === 0) {
      setDetail(loadChecklistDetail(ppmViewData.data.check_list_ids[0]));
    }
  }, [ppmViewData, detail]);

  useEffect(() => {
    setModal(eventDetailModel);
    setDetail([]);
  }, [eventDetailModel]);

  useEffect(() => {
    if (event && event.orders && event.orders.length) {
      setDetail(event.orders[0]);
    }
  }, [event, modal]);

  /* const getImage = (status) => {
    let image = '';
    if (statusInprogress.includes(status)) {
      image = <img src={inProgress} className="mr-2" width="15" height="15" alt="inprogress" />;
    } else if (statusCompleted.includes(status)) {
      image = <img src={completed} className="mr-2" width="15" height="15" alt="completed" />;
    } else {
      image = <img src={completed} className="mr-2 invisible" width="15" height="15" alt="completed" />;
    }
    return image;
  }; */

  function getChecklists(listData) {
    let result = [];
    if (listData) {
      result = [...new Map(listData.map((item) => [item.id, item])).values()];
    }
    return result;
  }

  const getImageByCategory = (category) => {
    let image = '';
    if (category === 'Equipment' || category === 'e') {
      image = <img src={assetIcon} className="mr-2" width="15" height="15" alt="equipment" />;
    } else if (category === 'Space' || category === 'ah') {
      image = <img src={location} className="mr-2" width="15" height="15" alt="space" />;
    }
    return image;
  };

  const getStatus = (status) => {
    let image = '';
    if (statusInprogress.includes(status)) {
      image = (
        <span className="text-yellow pr-2 pl-2 mr-2 font-weight-800">
          <img src={inProgressNoCircle} className="mr-1 mb-1" alt="workorder" height="15" width="15" />
          In Progress
        </span>
      );
    } else if (statusCompleted.includes(status)) {
      image = (
        <span className="text-green pr-2 pl-2 mr-2 font-weight-800">
          <img src={completedNoCircle} className="mr-1 mb-1" alt="workorder" height="15" width="15" />
          Completed
        </span>
      );
    }
    return image;
  };

  const getClassByStatus = (status) => {
    let cName = '';
    if (statusInprogress.includes(status)) {
      cName = 'text-yellow';
    } else if (statusCompleted.includes(status)) {
      cName = 'text-green';
    }
    return cName;
  };

  const getBackgroundColor = (status) => {
    let cName = '';
    if (statusInprogress.includes(status)) {
      cName = 'bg-color-orange';
    } else if (statusCompleted.includes(status)) {
      cName = 'bg-color-green';
    }
    return cName;
  };

  const getDetailName = (type, woList) => {
    let image = '';
    if (type === 'Equipment') {
      image = (
        <Tooltip title={woList.equipment_name} placement="top">
          <ListItemText primary={truncate(woList.equipment_name, 16)} className={getClassByStatus(woList.orders && woList.orders.length ? woList.orders[0].state : '')} />
        </Tooltip>
      );
    } else if (type === 'Space') {
      image = (
        <Tooltip title={woList.space_name} placement="top">
          <ListItemText primary={truncate(woList.space_name, 16)} className={getClassByStatus(woList.orders && woList.orders.length ? woList.orders[0].state : '')} />
          {' '}
        </Tooltip>
      );
    }
    return image;
  };

  const getDetailNameChecklists = (type, woList) => {
    let image = '';
    if (type === 'e') {
      image = (
        <Tooltip title={woList.name} placement="top">
          <ListItemText primary={truncate(woList.name, 16)} />
        </Tooltip>
      );
    } else if (type === 'ah') {
      image = (
        <Tooltip title={woList.name} placement="top">
          <ListItemText primary={truncate(woList.name, 16)} />
          {' '}
        </Tooltip>
      );
    }
    return image;
  };

  const onLoadWorkorderId = (id) => {
    const filters = [{
      key: 'id', value: id, label: 'ID', type: 'id',
    }];
    const filterValues = {
      statusValues: [],
      teams: [],
      priorities: [],
      customFilters: filters,
    };
    dispatch(getWorkorderFilter(filterValues));
    setRedirect(true);
  };

  const handleChecklistData = (cdata) => {
    setCurrentSpace(cdata.id);
    setDetail(loadChecklistDetail(cdata));
  };

  if (isRedirect) {
    return (<Redirect to="/maintenance/workorders" />);
  }

  const isData = ppmViewData && ppmViewData.data && ((ppmViewData.data.check_list_ids && ppmViewData.data.check_list_ids.length && ppmViewData.data.check_list_ids.length > 0)
  || (ppmViewData.data.assets && ppmViewData.data.assets.length && ppmViewData.data.assets.length > 0)) && detail && detail !== '{}';

  const isNoData = ppmViewData && ppmViewData.data && ((ppmViewData.data.check_list_ids && ppmViewData.data.check_list_ids.length === 0)
  || (ppmViewData.data.assets && ppmViewData.data.assets.length === 0));

  return (
    <Modal size="lg" className="border-radius-50px modal-dialog-centered" isOpen={eventDetailModel}>
      <ModalHeader className="modal-equipment-header text-grey">
        <Row className="m-0">
          <Col sm="12" md="12" lg="12" xs="12" className="pl-0">
            <Button
               variant="contained"
              onClick={toggle}
              onMouseLeave={() => setButtonHover(false)}
              onMouseEnter={() => setButtonHover(true)}
              className="hoverColor bg-white text-dark padding-btn-1  rounded-pill mr-2 float-right"
            >
              <img src={isButtonHover ? closeCircleWhiteIcon : closeCircleIcon} height="15" width="15" className="mr-2 mb-1" alt="close" />
              <span className="mr-2 font-14">Close</span>
            </Button>
            <h4 className="mb-0 mt-1">
              <img
                alt="preventiveMaintenance"
                width="25"
                height="25"
                className="mr-2 mb-2 font-weight-700"
                src={preventiveMaintenance}
              />
              {Object.keys(event).length > 0 ? event.name : ''}
            </h4>
          </Col>
        </Row>
      </ModalHeader>
      <ModalBody className="pt-0 mb-3 text-grey">
        <Row className="m-0">
          <Col md="12" sm="12" xs="12" lg="12">
            <Card className="bg-lightblue mb-2">
              <CardBody className="p-0 font-tiny">
                <Row className="m-2 pt-1 pb-1">
                  <Col md="4" sm="4" xs="12" lg="4" className="border-right">
                    <div className="font-weight-700 justify-content-center d-flex">
                      <img
                        alt="preventiveMaintenance"
                        src={scheduleDate}
                        width="22"
                        height="22"
                        className="mr-3 mt-2"
                      />
                      <span>
                        {getCompanyTimezoneDate(event.start, userInfo, 'datetime')}
                        <br />
                        {getCompanyTimezoneDate(event.end, userInfo, 'datetime')}
                      </span>
                    </div>
                  </Col>
                  <Col md="4" sm="4" xs="12" lg="4" className="border-right">
                    <div className="font-weight-700 justify-content-center d-flex">
                      <img
                        alt="preventiveMaintenance"
                        width="22"
                        height="22"
                        src={location}
                        className="mr-3 mt-2"
                      />
                      <span className="mt-2">
                        {company}
                      </span>
                    </div>
                  </Col>
                  <Col md="4" sm="4" xs="12" lg="4">
                    <div className="font-weight-700 justify-content-center text-center p-2">
                      <span>
                        <div className="mr-2 d-inline">Completed</div>
                        {Object.keys(event).length > 0 && event.displayName ? event.displayName : '0'}
                      </span>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="pt-2 m-0">
          <Col md="4" sm="4" lg="4" xs="12" className="pr-0">
            <Card className="p-0 h-100">
              <CardTitle className="p-2 bg-lightblue mb-1 text-center border-bottom sfilterarrow">
                <h5 className="font-size-13 mb-0 textwrapdots font-weight-700">
                  {Object.keys(event).length > 0 ? event.name : ''}
                </h5>
              </CardTitle>
              <div className="mb-3 overflow-auto event_sideBar thin-scrollbar">
                <ThemeProvider theme={theme}>
                  {(ppmViewData && ppmViewData.loading) && (
                  <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                    <Loader />
                  </div>
                  )}
                  <List>
                    {ppmViewData && ppmViewData.data && ppmViewData.data.assets && ppmViewData.data.assets.map((wo, index) => (
                      wo.orders
                        ? (
                          <ListItem
                            button
                            key={wo.id}
                            selected={index === currentSpace}
                            className={index === currentSpace ? getBackgroundColor(wo.orders && wo.orders.length ? wo.orders[0].state : '') : ''}
                            onClick={() => { setCurrentSpace(index); setDetail(wo); }}
                          >
                            {' '}
                            {/* getImage(wo.orders && wo.orders.length ? wo.orders[0].state : '') */}
                            {getImageByCategory(wo.category_type)}
                            {getDetailName(wo.category_type, wo)}
                          </ListItem>
                        ) : ''
                    ))}
                    {ppmViewData && ppmViewData.data && ppmViewData.data.check_list_ids && getChecklists(ppmViewData.data.check_list_ids).map((cl) => (
                      <ListItem
                        button
                        key={cl.id}
                        selected={cl.id === currentSpace}
                        onClick={() => handleChecklistData(cl)}
                      >
                        {' '}
                        {/* getImage(wo.orders && wo.orders.length ? wo.orders[0].state : '') */}
                        {getImageByCategory(cl.type)}
                        {getDetailNameChecklists(cl.type, cl)}
                      </ListItem>
                    ))}
                  </List>
                  {(ppmViewData && ppmViewData.err) && (
                  <div className="mb-2 mt-3 p-5">
                    <ErrorContent errorTxt={generateErrorMessage(ppmViewData)} />
                  </div>
                  )}
                  {isNoData ? (
                    <div className="mb-2 mt-3 p-5">
                      <p className="text-danger text-center">No data found...</p>
                    </div>
                  ) : (<span />)}
                </ThemeProvider>
              </div>
            </Card>
          </Col>
          <Col md="8" sm="8" lg="8" xs="12">
            <Card className="mb-2 h-100">
              <CardBody className="pt-1 pb-1">
                {(ppmViewData && ppmViewData.err) && (
                <div className="mb-2 mt-3 p-5">
                  <ErrorContent errorTxt={generateErrorMessage(ppmViewData)} />
                </div>
                )}
                {(ppmViewData && ppmViewData.loading) && (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
                )}
                {isNoData ? (
                  <div className="mb-2 mt-3 p-5">
                    <p className="text-danger text-center">No data found...</p>
                  </div>
                ) : (<span />)}
                <Row>
                  {isData ? (
                    <Col md="12" sm="12" lg="12" xs="12" className="pt-2 pb-2">
                      <h5 className="d-inline-block pb-1 border-bottom-dark font-weight-700">Quick Info</h5>
                      <span className="float-right">
                        {getStatus(
                          detail && detail.orders && detail.orders.length ? detail.orders[0].state : '',
                        )}
                        <Button
                          type="button"
                          variant="contained"
                          onClick={() => onLoadWorkorderId(detail && detail.orders && detail.orders.length ? detail.orders[0].id : '')}
                          className={detail && detail.orders && detail.orders.length && detail.orders[0].id ? 'btn-navyblue font-11' : 'btn-default font-11'}
                          disabled={!(detail && detail.orders && detail.orders.length && detail.orders[0].id)}
                        >
                          <img src={workordersWhite} className="mr-1" alt="workorder" height="17" width="15" />
                          Open Work Order
                        </Button>
                      </span>
                    </Col>
                  ) : (<Col />)}
                </Row>
                {isData ? (
                  <div>
                    {detail.category_type === 'Space'
                      ? (
                        <>
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Space</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.space_name}</div>
                            </Col>
                          </Row>
                          <hr className="mt-2 mb-2" />
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Location</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.path_name}</div>
                            </Col>
                          </Row>
                          <hr className="mt-2 mb-2" />
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Maintenance Team</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.team_id && detail.team_id.name ? detail.team_id.name : 'Not Assigned'}</div>
                            </Col>
                          </Row>
                        </>
                      )
                      : (
                        <>
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Asset</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.equipment_name}</div>
                            </Col>
                          </Row>
                          <hr className="mt-2 mb-2" />
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Asset Number</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.equipment_number}</div>
                            </Col>
                          </Row>
                          <hr className="mt-2 mb-2" />
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Location</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.location_id && detail.location_id.name ? detail.location_id.name : 'Not Assigned'}</div>
                            </Col>
                          </Row>
                          <hr className="mt-2 mb-2" />
                          <Row>
                            <Col md="12" sm="12" xs="12" lg="12">
                              <span className="font-tiny font-weight-400 mb-2">Maintenance Team</span>
                              <br />
                              <div className="font-weight-700 mt-2 ml-2">{detail.team_id && detail.team_id.name ? detail.team_id.name : 'Not Assigned'}</div>
                            </Col>
                          </Row>
                        </>
                      )}
                  </div>
                ) : (<span />)}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

eventDetails.propTypes = {
  eventDetailModel: PropTypes.bool.isRequired,
  eventList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  companyDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default eventDetails;
