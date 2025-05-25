/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */

import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import PropTypes, { node } from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  faArrowUp, faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  Checkbox, Divider, Paper,
} from '@material-ui/core';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Popover,
  PopoverBody,
  Tooltip,
  Badge,
  Spinner,
  PopoverHeader,
  UncontrolledTooltip,
} from 'reactstrap';
import {
  // faCompressAlt, faExpandAlt,
  faInfoCircle, faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TreeItem from '@material-ui/lab/TreeItem';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import pull from 'lodash/pull';
import find from 'lodash/find';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';

import { faPlusCircle } from '@images/icons/fontAwesomeIcons';
import FontAwesomeIconComponent from '@shared/fontAwesomeIconComponent';
import DisplayTimezone from '@shared/timezoneDisplay';
import { TimeZoneDateConvertor, getUtcTimefromZone } from '@shared/dateTimeConvertor';
import Loading from '@shared/loading';
import CapLimitModalWindow from '../../createBooking/capLimitModal';
import { StringsMeta } from '../../../util/appUtils';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import './selectedSapceView.scss';
import bookingStatus from '../../../data/bookingStatus.json';
import { CategoryName } from '../../createBooking/bookingLayout';
import {
  setSavedDataToSpaceView, clearCapLimitData, getMultidaysAvailabilitySpacesInfo, setAvailabilitySpaceId, clearMultipleDaysSpacesData, saveHostData, getSpacesCapBookingData, setErrorMessage, setDisableFields,
} from '../../bookingService';
import SaveGuestModal from '../../createBooking/saveGuestModal';


const { useStyles } = require('../../../util/formClasses');

const RecursiveTreeViewLayout = ({
  setSpaceAvailabilityData, getGroupWorkStations, data, BookingData, setTreeDataToSelectedSpaceView, treeBookingType, removeNodeWithEmp, setSelectedNodeChild, setEmployees, sortingDsec, sortingAsec, setSortingDsec, setSortingAsec,
  onChangeFunction, setSelectedSpaceNameValue, selectedSpaceNameValue,
}) => {
  const categoryName = useContext(CategoryName);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    multidaysAvailabilityInfo, addGuestInfo, guestListInfo, saveHostInfo, hostData, removedNodeWithEmployee, floorView, workStations, saveNewGuest, capsLimitInfo, savedParticipantsData, savedGuestData,
  } = useSelector((state) => state.bookingInfo);
  // For building selected workstations with employees
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [multiSelectedEmployees, setMultiSelectedEmployees] = useState([]);
  const [multiSelectedEmployeesDropDown, setMultiSelectedEmployeesDropDown] = useState([]);
  const [buildTreeData, setTreeData] = useState([]);
  const [selecteEmployeeIds, setSelectedEmp] = useState([]);
  const [bookingTooltip, setbookingTooltip] = useState();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [bookingToolTipOpen, setBookingToolTipOpen] = useState(false);
  
  const [spacesTrue, setSpacesTrue] = useState(false);

  const [guestKeyword, setGuestKeyword] = useState('');
  const [addGuest, setAddGuest] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [individualGuest, setIndividualGuest] = useState('');
  const [dropDownEmployees, setDropDownEmployees] = useState([]);
  const [validateGetSpaces, setValidateGetSpaces] = useState(false);

  // For Expand and collapse of nodes
  const [expanded, setExpanded] = useState(['root']);
  const [expandFloor, setExpandFloor] = useState('');
  // const { userRoles } = useSelector((state) => state.config);
  const disablePartialBooking = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.disable_partial_booking;
  const partialBookingSpace = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.disabled_space_categories;
  const nodesToExpand = [];
  const companyTimeZone=userInfo &&userInfo.data &&userInfo.data.company&&userInfo.data.company.timezone

  const [capLimitModal, setCapLimitModal] = useState(false);
  const [empCapLimitArray, setEmpCapLimitArray] = useState([]);
  useEffect(() => {
    if (capsLimitInfo && capsLimitInfo.err && capsLimitInfo.err.error && capsLimitInfo.err.error.message) {
      setSpacesTrue(false);
      setValidateGetSpaces(false);
      dispatch(clearMultipleDaysSpacesData());
      dispatch(setDisableFields(false));
    }
    if (capsLimitInfo && capsLimitInfo.data && capsLimitInfo.data.length) {
      if (capsLimitInfo.data.find((limit) => limit.validity === false)) {
        setCapLimitModal(true);
        setSpacesTrue(false);
        setValidateGetSpaces(false);
        dispatch(clearMultipleDaysSpacesData());
        dispatch(setDisableFields(false));
      } else {
        setSpacesTrue(true);
      }
    }
  }, [capsLimitInfo]);
  
  useEffect (() => {
    let occupied =0;
    let ready= 0;
    let booked= 0;
    let dataCollection;
    if(multidaysAvailabilityInfo && multidaysAvailabilityInfo.data && multidaysAvailabilityInfo.data.length) {
      multidaysAvailabilityInfo.data.map((space) => {
        if(space.status === "Booked" && space.child_count === 0 && space.asset_categ_type === BookingData.workStationType.type) {
          booked = booked + 1;
        } else if(space.status === "Ready" && space.child_count === 0 && space.asset_categ_type === BookingData.workStationType.type) {
         ready = ready + 1;
        } else if(space.status === "Occupied" && space.child_count === 0 && space.asset_categ_type === BookingData.workStationType.type) {
          occupied = occupied + 1;
         }
      })
    }
    if(BookingData && BookingData.workStationType) {
      dataCollection = [{
       "occupied" : occupied,
       "ready": ready,
       "booked": booked,
       "workstationtype": BookingData.workStationType
     }]
   }
    setSpaceAvailabilityData(dataCollection);
  }, [multidaysAvailabilityInfo]);

  useEffect(() => {
    if (capsLimitInfo && capsLimitInfo.data && capsLimitInfo.data.length === 0) {
      setSpacesTrue(true);
    }
  }, [capsLimitInfo]);

  useEffect(() => {
    if (savedGuestData && !savedGuestData.length) {
      setIndividualGuest(savedGuestData);
    }
  }, [savedGuestData, spacesTrue]);

  useEffect(() => {
    if (savedParticipantsData && !savedParticipantsData.length && treeBookingType === 'group') {
      const message = StringsMeta.PARTICIPANTS_NOT_SELECTED_MESSAGE;
      dispatch(setErrorMessage(message));
    } else {
      dispatch(setErrorMessage(false));
    }
  }, [treeBookingType, savedParticipantsData]);

  useEffect(() => {
    if(multidaysAvailabilityInfo && multidaysAvailabilityInfo.data){
      multidaysAvailabilityInfo.data.map((space) => {
         if(space.sort_sequence === 1 && space.asset_categ_type === 'floor'){
          setExpandFloor(space.id);
         }
      })
    }
  }, [multidaysAvailabilityInfo]);

  useEffect(() => {
    if (treeBookingType && expandFloor) {
      dispatch(setDisableFields(false));
      setExpanded(['root', JSON.stringify(expandFloor)]);
    }
  }, [treeBookingType, addGuestInfo, expandFloor]);

  useEffect(() => {
    if (multiSelectedEmployees && multiSelectedEmployees.length) {
      const empArray = [];
      multiSelectedEmployees.filter((datas) => {
        if (datas && datas.type !== 'guest') {
          const obj = {
            employeeName: `${datas.name}`,
            employeeId: `${datas.id}`,
            company: `${userInfo.data.main_company.id}`,
            host: `${datas.is_host}`,
            from_time: `${getUtcTimefromZone(BookingData.site.planned_in, 'YYYY-MM-DD HH:mm:ss', companyTimeZone)}`,
            end_time: `${getUtcTimefromZone(BookingData.site.planned_out, 'YYYY-MM-DD HH:mm:ss', companyTimeZone)}`,
            space_type: `${BookingData.workStationType.id}`,
          };
          empArray.push(obj);
          setEmpCapLimitArray(empArray);
        }
      });
    }
  }, [multiSelectedEmployees]);

  useEffect(() => {
    if (multiSelectedEmployees && multiSelectedEmployees.length) {
      const empArray = [];
      if (buildTreeData && buildTreeData.length) {
        buildTreeData.map((obj) => {
          empArray.push(obj.employee);
        });
        const emp = difference(multiSelectedEmployees, empArray);
        setDropDownEmployees(uniqBy(emp, 'id'));
      } else {
        setDropDownEmployees(uniqBy(multiSelectedEmployees, 'id'));
      }
    }
  }, [multiSelectedEmployees, validateGetSpaces]);

  useEffect(() => {
    if (saveNewGuest && saveNewGuest.length) {
      setGuestKeyword('');
    }
  }, [saveNewGuest]);

  useEffect(() => {
    if (buildTreeData) {
      setTreeDataToSelectedSpaceView(buildTreeData, dropDownEmployees);
      const payload = {
        BuildTreeData: buildTreeData, DropDownEmployees: dropDownEmployees,
      };
      dispatch(setSavedDataToSpaceView(payload));
    }
  }, [buildTreeData]);

  useEffect(() =>{
    if(multidaysAvailabilityInfo && multidaysAvailabilityInfo.loading){
      setSelectedSpaceNameValue([]);
    }
  }, [multidaysAvailabilityInfo]);
  useEffect(() => {
    if (removedNodeWithEmployee) {
      const multiSelectEmp = dropDownEmployees;
      let selectedNodeIds = selectedNodes;
      let treeviewObj = buildTreeData;
      let empIds = selecteEmployeeIds;
      multiSelectEmp.push(removedNodeWithEmployee.employee);
      setDropDownEmployees(multiSelectEmp);
      treeviewObj = filter(treeviewObj, (node) => node.id !== removedNodeWithEmployee.id);
      setTreeData(treeviewObj);
      selectedNodeIds = pull(selectedNodeIds, removedNodeWithEmployee.id);
      empIds = pull(empIds, (removedNodeWithEmployee && removedNodeWithEmployee.employee && removedNodeWithEmployee.employee.id));
      setSelectedNodes(selectedNodeIds);
      setSelectedEmp(empIds);
    }
  }, [removedNodeWithEmployee]);
  let selectNodes = [];
  const pushAndRemoveNodes = (node, checked) => {
    selectNodes = [...selectedNodes];
    if (checked && treeBookingType !== 'individual' && BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && selectedNodes.length === 1) {
      setSelectedNodes([...selectedNodes]);
    } else if (checked) {
      selectNodes.push(node.id);
      setSelectedNodes(selectNodes);
    } else {
      selectNodes = pull(selectNodes, node.id);
      setSelectedNodes(selectNodes);
    }
  };
  const removeEmpWhenUnchecked = (selectedNode) => {
    const unCheckedNode = find(buildTreeData, { id: selectedNode.id });
    if (unCheckedNode) {
      const removeEmployeeId = pull(selecteEmployeeIds, unCheckedNode.employee.id);
      const setEmployeeToMultiSelectedEmployees = [...dropDownEmployees];
      setEmployeeToMultiSelectedEmployees.push(unCheckedNode.employee);
      setDropDownEmployees(uniqBy(setEmployeeToMultiSelectedEmployees, 'id'));
      setSelectedEmp(removeEmployeeId);
      const removeNodeFromBuildTreeData = filter(
        buildTreeData,
        (node) => node.id !== unCheckedNode.id,
      );
      setTreeData(removeNodeFromBuildTreeData);
    }
  };

  const checkAvailability = (selectedNode) => {
    dispatch(setAvailabilitySpaceId(selectedNode.id));
  };

  const getPlannedUtcTime = (time) => getUtcTimefromZone(time, 'YYYY-MM-DD HH:mm:ss',companyTimeZone);

  useEffect(() => {
    if (guestListInfo && guestListInfo.err && guestListInfo.err.data && guestListInfo.err.data.length === 0) {
      setAddGuest(true);
    }
  }, [guestListInfo]);

  useEffect(() => {
  }, [spacesTrue]);

  // useEffect(() => {
  //   if (BookingData && BookingData.site && spacesTrue && validateGetSpaces
  //     && userRoles && userRoles.data && userRoles.data.filters && BookingData.workStationType && hostData && hostData.id) {
  //     dispatch(getMultidaysAvailabilitySpacesInfo(
  //       userRoles.data.filters.building_space.id,
  //       getPlannedUtcTime(BookingData.site.custom_planned_in ? BookingData.site.custom_planned_in : BookingData.site.planned_in, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
  //       getPlannedUtcTime(BookingData.site.custom_planned_out ? BookingData.site.custom_planned_out : BookingData.site.planned_out),
  //       BookingData.site.id,
  //       BookingData.workStationType.id,
  //       hostData.id,
  //     ));
  //   }
  // }, [spacesTrue]);

  useEffect(() => {
    if (userInfo &&userInfo.data && userInfo.data.company && spacesTrue) {
      dispatch(getMultidaysAvailabilitySpacesInfo(
        userRoles.data.filters.building_space.id,
        getPlannedUtcTime(BookingData.site.custom_planned_in ? BookingData.site.custom_planned_in : BookingData.site.planned_in, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
        getPlannedUtcTime(BookingData.site.custom_planned_out ? BookingData.site.custom_planned_out : BookingData.site.planned_out),
        BookingData.site.id,
        BookingData.workStationType.id,
        hostData.id,
      ));
    }
  }, [userInfo, spacesTrue]);

  useEffect(() => {
    if (empCapLimitArray && empCapLimitArray.length
      && userRoles && userRoles.data && userRoles.data.cap_limit && userRoles.data.cap_limit.enable_cap_limit && userRoles.data.cap_limit.allowed_categories && userRoles.data.cap_limit.allowed_categories.length
      && find(userRoles.data.cap_limit.allowed_categories, (categ) => categ === BookingData.workStationType.name)) {
      dispatch(getSpacesCapBookingData(empCapLimitArray));
    } else {
      setSpacesTrue(true);
    }
  }, [spacesTrue, empCapLimitArray]);

  const bookingType = BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room';

  const onCheckBoxClick = (selectedNode, event) => {
    if (event.target.checked && treeBookingType !== 'individual' && BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && selectedNodes.length === 1) {
      setSelectedNodes([...selectedNodes]);
    } else if (dropDownEmployees && dropDownEmployees.length === 0 && event.target.checked && !bookingType) {
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (dropDownEmployees
      && dropDownEmployees.length === 0
      && !event.target.checked && !bookingType) {
      removeEmpWhenUnchecked(selectedNode);
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (dropDownEmployees
      && dropDownEmployees.length === 1
      && event.target.checked && !bookingType) {
      selectedNode.employee = dropDownEmployees[0];
      const pushNodeToTree = [...buildTreeData];
      pushNodeToTree.push(selectedNode);
      setTreeData(pushNodeToTree);
      if (!selecteEmployeeIds.length) {
        const empId = [];
        empId.push(dropDownEmployees[0].id);
        setSelectedEmp(uniq(empId.flat(), 'id'));
        setDropDownEmployees([]);
      } else {
        const empId = [...selecteEmployeeIds];
        empId.push(dropDownEmployees[0].id);
        setSelectedEmp(uniq(empId.flat(), 'id'));
        setDropDownEmployees([]);
      }
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (dropDownEmployees
      && dropDownEmployees.length === 1
      && !event.target.checked && !bookingType) {
      removeEmpWhenUnchecked(selectedNode);
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (dropDownEmployees
      && dropDownEmployees.length > 1
      && event.target.checked && !bookingType) {
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (dropDownEmployees
      && dropDownEmployees.length > 1
      && !event.target.checked && !bookingType) {
      removeEmpWhenUnchecked(selectedNode);
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (event.target.checked && bookingType) {
      selectedNode.employee = hostData;
      const pushNodeToTree = [...buildTreeData];
      pushNodeToTree.push(selectedNode);
      setTreeData(pushNodeToTree);
      const removedEmp = filter(
        dropDownEmployees,
        (emp) => emp.id !== hostData.id,
      );
      setDropDownEmployees(removedEmp);
      pushAndRemoveNodes(selectedNode, event.target.checked);
    } else if (!event.target.checked && bookingType) {
      removeEmpWhenUnchecked(selectedNode);
      pushAndRemoveNodes(selectedNode, event.target.checked);
    }
    if (event.target.checked
      && dropDownEmployees
      && dropDownEmployees.length === 1) {
      selectedNode.employee = dropDownEmployees[0];
      const pushNodeToTree = [...buildTreeData];
      pushNodeToTree.push(selectedNode);
      setTreeData(pushNodeToTree);
      pushAndRemoveNodes(selectedNode, event.target.checked);
      checkAvailability(selectedNode);
    }
  };
  useEffect(() => {
  }, [selecteEmployeeIds]);
  const setEmployeeToSelectedNode = (selectedEmp, node) => {
    const treeData = [...buildTreeData];
    const empId = [...selecteEmployeeIds];
    const multiSelectData = [...dropDownEmployees];
    const checkExistedEmployee = find(
      treeData,
      (workStationNode) => workStationNode.id === node.id,
    );
    if (checkExistedEmployee && checkExistedEmployee.employee) {
      checkAvailability(node);
      multiSelectData.push(checkExistedEmployee.employee);
      setDropDownEmployees(multiSelectData);
      setMultiSelectedEmployeesDropDown(multiSelectData);
      const employeeIndex = findIndex(empId, { id: checkExistedEmployee.id });
      empId[selecteEmployeeIds && selecteEmployeeIds.length] = selectedEmp.id;
      setSelectedEmp(uniq(empId.flat(), 'id'));
      const nodeIndex = findIndex(treeData, { id: node.id });
      treeData[nodeIndex].employee = selectedEmp;
      setTreeData(treeData);
    } else {
      empId.push(selectedEmp.id);
      setSelectedEmp(uniq(empId.flat(), 'id'));
      node.employee = selectedEmp;
      treeData.push(node);
      setTreeData(treeData);
      checkAvailability(node);
    }
    const employeeSelectToNode = filter(
      multiSelectData,
      (selectData) => selectData.id !== selectedEmp.id,
    );
    setDropDownEmployees(employeeSelectToNode);
  };

  const mapChildren = (children) => {
    children.map((node) => {
      nodesToExpand.push(node.treeNodeId);
      mapChildren(node.children);
      return nodesToExpand;
    });
  };

  useEffect(() => {
    if (hostData) {
      dispatch(saveHostData(hostData));
      setSpacesTrue(false);
      setValidateGetSpaces(false);
      dispatch(clearMultipleDaysSpacesData());
    }
  }, [hostData, addGuestInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.employee) {
      dispatch(clearMultipleDaysSpacesData());
    }
  }, [userInfo]);
 
  useEffect(() => {
    const array = [];
    array.push(uniq(savedParticipantsData, 'id'));
    array.push(uniq(savedGuestData, 'id'));
    if (treeBookingType === 'individual' && BookingData && BookingData.workStationType && addGuestInfo && addGuestInfo.data && individualGuest && individualGuest.id) {
      array.push([individualGuest]);
    } else {
      array.push([hostData]);
    }
    setMultiSelectedEmployees(array.flat());
    setEmployees(array.flat());
  }, [hostData, savedParticipantsData, savedGuestData, guestKeyword, addGuestInfo, individualGuest, spacesTrue]);

  useEffect(() => {
    if (addGuestInfo && !addGuestInfo.data) {
      const removeEmployeeFromFloorData = filter(
        buildTreeData,
        (workspace) => workspace.employee.type !== 'guest',
      );
      setTreeData(removeEmployeeFromFloorData);

      let selectNode = [...selectedNodes];
      const removeNode = filter(buildTreeData, (node) => node.employee.type === 'guest');
      const empIds = [];
      if (removeNode && removeNode.length) {
        removeNode.map((emp) => {
          empIds.push(emp.id);
        });
        selectNode = selectNode.filter((el) => !empIds.includes(el));
        setSelectedNodes(selectNode);
        let selectEmployeeIds = [...selecteEmployeeIds];
        selectEmployeeIds = selectEmployeeIds.filter((el) => !empIds.includes(el));
        setSelectedEmp(uniq(selectEmployeeIds.flat(), 'id'));
      }
    }
  }, [addGuestInfo]);

  const validateGuestOrParticipant = () => {
    if (multiSelectedEmployees && multiSelectedEmployees.length) {
      const guestType = multiSelectedEmployees.filter((item) => item && item.type === 'guest');
      const participantType = multiSelectedEmployees.filter((item) => item && item.type === 'participant');
      if (guestType.length && participantType.length) {
        return StringsMeta.EMPLOYEE_OR_GUEST;
      }
      if (guestType.length) {
        return StringsMeta.SELECT_GUEST;
      }
      if (participantType.length) {
        return StringsMeta.SELECT_EMPLOYEE;
      }
      return StringsMeta.SELECT_HOST;
    }
  };
  const checkSpaceCategory = (node) => {
    if (partialBookingSpace.length !== 0) {
      return partialBookingSpace.map((item) => item).includes(node && node.spaceCategory && node.spaceCategory.name);
    }
    return false;
  };
  const resetBookingData = () => {
    setTreeData([]);
    setSelectedEmp([]);
    setSpacesTrue(false);
    setValidateGetSpaces(false);
    getGroupWorkStations([]);
    setExpanded(['root']);
    setSelectedNodes([]);
    setTreeDataToSelectedSpaceView([]);
    dispatch(clearMultipleDaysSpacesData());
    dispatch(clearCapLimitData());
    dispatch(setDisableFields(false));
  };

  useEffect(() => {
    if (addGuestInfo) {
      setAddGuest(false);
      setGuestKeyword('');
      setIndividualGuest('');
      setTreeData([]);
      setSelectedEmp([]);
      setSelectedNodes([]);
    }
  }, [addGuestInfo]);

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };
  const toggle = () => { setPopoverOpen(false); setBookingToolTipOpen(false); };
  const bookingPopover = (bookingItem) => (
    <React.Fragment key={bookingItem.id}>
      <Row className="text-left">
        <Col sm="12">
          Emp Name:
          {' '}
          {bookingItem.employee_name}
          {' '}
          {bookingItem.is_host && (
            <Badge color="success" className="float-right">
              Host
            </Badge>
          )}
        </Col>
        <Col sm="12">
          Emp Number:
          {' '}
          {bookingItem.employee_number}
        </Col>
        <Col sm="12">
          Booked Time:
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_in} format="YYYY-MM-D" />
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_in} format="LT" />
          {' '}
          <DisplayTimezone />
          {' '}
          -
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_out} format="YYYY-MM-D" />
          {' '}
          <TimeZoneDateConvertor date={bookingItem.planned_out} format="LT" />
          {' '}
          <DisplayTimezone />
        </Col>
      </Row>
    </React.Fragment>
  );
  const showToolTip = (node) => {
    const array = [];
    let bookingIndex = 1;
    if (node.shifts && node.shifts.length) {
      node.shifts.map((shift) => {
        if (shift.bookings && shift.bookings.length) {
          shift.bookings.map((booking) => {
            if (BookingData && BookingData.workStationType && ((BookingData.workStationType.type === 'room' && booking.is_host === true) || BookingData.workStationType.type !== 'room')) {
              array.push(booking);
            }
          });
        }
      });
    }
    if (array.length) {
      return (
        <>
          {array.map((item, index) => (
            // eslint-disable-next-line no-plusplus
            <React.Fragment key={bookingIndex++}>
              {index < 2 ? (
                <>
                  {bookingPopover(item)}
                  <hr className="my-2 tooltipBorder" />
                </>
              ) : ''}
              {index === 3 ? (<span className="font-weight-800">...</span>) : ''}
            </React.Fragment>
          ))}
        </>
      );
    }
  };
  let index = 1;

  const label = (node) => (
    <div
      className={
        (selectedNodes.includes(node.id) && node && node.children && node.children.length === 0)
          ? classes.selectedLabelRoot : classes.labelRoot
      }
    >
      <Row className={node && node.spaceCategory && node.childCount === 0 && BookingData && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id ? 'w-100 ml-n18' : 'w-100'}>
        {node && node.spaceCategory && node.children && node.children.length === 0 && BookingData && BookingData.workStationType
        && BookingData.workStationType.id === node.spaceCategory.id && BookingData.workStationType.type === 'room' && node.status !== 'Partial' && (
          <Col sm="1" xs="2" md="1" lg="1" className="p-0">
            <Checkbox
              id={`checkbox-${node.id}`}
              data-testid={`checkboxTest-${node.id}`}
              onClick={(event) => onCheckBoxClick(node, event)}
              color={(node.status === 'Ready to occupy' && node.max_occupancy !== 0) ? 'primary' : 'secondary'}
              className="p-0"
              disabled={!treeBookingType || !node.isBookingAllowed || node.status === 'Partial' || node.status === 'Booked'
                || !node.is_booking_allowed
                || (!selectedNodes.includes(node.id)
                  && !dropDownEmployees.length)
                || (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && multiSelectedEmployees.length > node.max_occupancy && true)
                || (!selectedNodes.includes(node.id)
                  && dropDownEmployees.length > 0
                  && dropDownEmployees.length
                  + selecteEmployeeIds.length === selectedNodes.length)}
              checked={selectedNodes.includes(node.id)}
            />
          </Col>
        )}
        {node && node.spaceCategory && node.children && node.children.length === 0 && BookingData && BookingData.workStationType
        && BookingData.workStationType.id === node.spaceCategory.id && BookingData.workStationType.type === 'room' && node.status === 'Partial' && (
          <Col sm="1" xs="2" md="1" lg="1" className="p-0">
            <Checkbox
              id={`checkbox-${node.id}`}
              data-testid={`checkboxTest-${node.id}`}
              onClick={(event) => onCheckBoxClick(node, event)}
              color={(disablePartialBooking && checkSpaceCategory(node) && node.max_occupancy !== 0) ? 'secondary' : 'primary'}
              className="p-0"
              disabled={!treeBookingType || !node.isBookingAllowed || (node.status === 'Partial' && disablePartialBooking && checkSpaceCategory(node)) || node.status === 'Booked'
                || !node.is_booking_allowed
                || (!selectedNodes.includes(node.id)
                  && !dropDownEmployees.length)
                || (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && multiSelectedEmployees.length > node.max_occupancy && true)
                || (!selectedNodes.includes(node.id)
                  && dropDownEmployees.length > 0
                  && dropDownEmployees.length
                  + selecteEmployeeIds.length === selectedNodes.length)}
              checked={selectedNodes.includes(node.id)}
            />
          </Col>
        )}
        {node && node.spaceCategory && node.children && node.children.length === 0 && BookingData && BookingData.workStationType
        && BookingData.workStationType.id === node.spaceCategory.id && BookingData.workStationType.type !== 'room' && node.status !== 'Partial' && (
          <Col sm="1" xs="2" md="1" lg="1" className="p-0">
            <Checkbox
              id={`checkbox-${node.id}`}
              data-testid={`checkboxTest-${node.id}`}
              onClick={(event) => onCheckBoxClick(node, event)}
              color={(node.status === 'Ready to occupy') ? 'primary' : 'secondary'}
              className="p-0"
              disabled={!treeBookingType || !node.isBookingAllowed || (node.status === 'Partial' && disablePartialBooking && checkSpaceCategory(node)) || node.status === 'Booked'
                || !node.is_booking_allowed
                || (!selectedNodes.includes(node.id)
                  && !dropDownEmployees.length)
                || (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && multiSelectedEmployees.length > node.max_occupancy && true)
                || (!selectedNodes.includes(node.id)
                  && dropDownEmployees.length > 0
                  && dropDownEmployees.length
                  + selecteEmployeeIds.length === selectedNodes.length)}
              checked={selectedNodes.includes(node.id)}
            />
          </Col>
        )}
        {node && node.spaceCategory && node.children && node.children.length === 0 && BookingData && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id
        && BookingData.workStationType.type !== 'room' && node.status === 'Partial' && (
          <Col sm="1" xs="2" md="1" lg="1" className="p-0">
            <Checkbox
              id={`checkbox-${node.id}`}
              data-testid={`checkboxTest-${node.id}`}
              onClick={(event) => onCheckBoxClick(node, event)}
              color={(disablePartialBooking && checkSpaceCategory(node)) ? 'secondary' : 'primary'}
              className="p-0"
              disabled={!treeBookingType || !node.isBookingAllowed || (node.status === 'Partial' && disablePartialBooking && checkSpaceCategory(node)) || node.status === 'Booked'
                || !node.is_booking_allowed
                || (!selectedNodes.includes(node.id)
                  && !dropDownEmployees.length)
                || (BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && multiSelectedEmployees.length > node.max_occupancy && true)
                || (!selectedNodes.includes(node.id)
                  && dropDownEmployees.length > 0
                  && dropDownEmployees.length
                  + selecteEmployeeIds.length === selectedNodes.length)}
              checked={selectedNodes.includes(node.id)}
            />
          </Col>
        )}
        <Col sm="11" xs="10" md="11" lg="11" className="pl-2">
          <Row>
            <Col sm="12" className="occupancy">
              {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && node.status !== 'Partial' && (
                <span className={(node.is_booking_allowed && node.max_occupancy !== 0)
                  || node.is_parent
                  ? 'font-weight-700' : 'font-weight-300 text-amethyst-smoke'}
                >
                  {node.name}
                </span>
              )}
              {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && node.status === 'Partial' && (
                <span className={(node.is_booking_allowed && node.max_occupancy !== 0 && disablePartialBooking && checkSpaceCategory(node))
                  || node.is_parent
                  ? 'font-weight-300 text-amethyst-smoke' : 'font-weight-700'}
                >
                  {node.name}
                </span>
              )}
              {BookingData && BookingData.workStationType && BookingData.workStationType.type !== 'room' && node.status !== 'Partial' && (
                <><span className={(node.is_booking_allowed)
                  || node.is_parent
                  ? 'font-weight-700' : 'font-weight-300 text-amethyst-smoke'}
                >
                  {node.name}
                </span>
                {selectedSpaceNameValue && selectedSpaceNameValue.length >= 2 && node ? (
                  <div className='font-size-10px'
                  >
                    {node.path_name}
                  </div>
                ) : ''}
                </>
              )}
              {BookingData && BookingData.workStationType && BookingData.workStationType.type !== 'room' && node.status === 'Partial' && (
                <>
                <span className={(node.is_booking_allowed && disablePartialBooking && checkSpaceCategory(node))
                  || node.is_parent
                  ? 'font-weight-300 text-amethyst-smoke' : 'font-weight-700'}
                >
                  {node.name}
                </span>
                {selectedSpaceNameValue && selectedSpaceNameValue.length >=2 && node ? (
                  <div className='font-size-10px'
                  >
                    {node.path_name}
                  </div>
                ) : ''}
                </>
              )}
              {userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.show_occupant && (node.status === 'Partial' || node.status === 'Booked') && (
                <FontAwesomeIcon
                  id={`booking-${node.id}`}
                  onMouseOver={() => { setBookingToolTipOpen(true); setbookingTooltip(node.id); }}
                  onClick={() => { setbookingTooltip(node.id); setPopoverOpen(true); setBookingToolTipOpen(false); }}
                  icon={faInfoCircle}
                  className={selectedSpaceNameValue && selectedSpaceNameValue.length ? "float-right ml-1 pathName" : "float-right ml-1 mt-1"}
                />
              )}
              {node.max_occupancy >= 0 && node.spaceCategory && node.spaceCategory.id && BookingData && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id
                && BookingData.workStationType.type === 'room' && (
                  <span className="label label-secondary mt-1 float-right">
                    Occupancy
                    {' '}
                    {node.max_occupancy}
                  </span>
              )}
              {node.max_occupancy > 0 && node.spaceCategory && node.spaceCategory.id && BookingData && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id
                && BookingData.workStationType.type !== 'room'
                && (
                  <span className="label label-secondary mt-1 float-right">
                    Occupancy
                    {' '}
                    {node.max_occupancy}
                  </span>
                )}
            </Col>
            {userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.show_occupant && node.id === bookingTooltip && (node.status === 'Partial' || node.status === 'Booked') && (
              <>
                <Popover
                  placement="top"
                  isOpen={popoverOpen}
                  target={`booking-${node.id}`}
                  toggle={toggle}
                  trigger="legacy"
                >
                  <PopoverHeader className="pop-head">Booking Details</PopoverHeader>
                  <PopoverBody className="bookingPopover thin-scrollbar">
                    <Row className="text-left">
                      <Col sm="12">
                        Space Name:
                        {' '}
                        {node.space_name}
                      </Col>
                      <Col sm="12">
                        Space Status:
                        {' '}
                        {node.status}
                      </Col>
                    </Row>
                    {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                      <Row sm="12" className="m-0">
                        Occupancy:
                        {' '}
                        {node.max_occupancy}
                      </Row>
                    )}
                    <hr className="my-2 tooltipBorder" />
                    {node.shifts && node.shifts.length && node.shifts.map((shift) => (
                      // eslint-disable-next-line no-plusplus
                      <div key={index++}>
                        <span className="font-weight-800">
                          {shift.bookings && shift.bookings.length
                            ? (<TimeZoneDateConvertor date={shift.planned_in} format="dddd D  MMMM YYYY" />)
                            : ''}
                        </span>
                        {shift.bookings && shift.bookings.length ? shift.bookings.map((bookingItem) => (
                          <React.Fragment key={bookingItem.id}>
                            {BookingData && BookingData.workStationType && ((BookingData.workStationType.type === 'room' && bookingItem.is_host === true) || BookingData.workStationType.type !== 'room')
                              ? (bookingPopover(bookingItem)) : ''}
                            {shift.bookings.length > 1 && ((BookingData.workStationType.type === 'room' && bookingItem.is_host === true) || BookingData.workStationType.type !== 'room') ? (<br />) : ''}
                          </React.Fragment>
                        )) : ''}
                        {shift.bookings && shift.bookings.length ? (<hr className="my-2 tooltipBorder" />) : ''}
                      </div>
                    ))}
                  </PopoverBody>
                </Popover>
                {!popoverOpen && (
                  <Tooltip
                    placement="top"
                    toggle={toggle}
                    target={`booking-${node.id}`}
                    isOpen={bookingToolTipOpen}
                  >
                    <Row className="text-left">
                      <Col sm="12">
                        Space Name:
                        {' '}
                        {node.space_name}
                      </Col>
                      <Col sm="12">
                        Space Status:
                        {' '}
                        {node.status}
                      </Col>
                    </Row>
                    {BookingData && BookingData.workStationType && BookingData.workStationType.type === 'room' && (
                      <Row className="m-0">
                        Occupancy:
                        {' '}
                        {node.max_occupancy}
                      </Row>
                    )}
                    <hr className="my-2 tooltipBorder" />
                    {showToolTip(node)}
                  </Tooltip>
                )}
              </>
            )}
            {BookingData && node.spaceCategory && node.spaceCategory.id && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id && BookingData.workStationType.type === 'room'
              && node.max_occupancy ? (
                <Col sm="12">
                  <span
                    className={(bookingStatus[node.status] && bookingStatus[node.status].color
                      ? `${bookingStatus[node.status].color} ${classes.statusMsg}`
                      : '')}
                  >
                    {node.status}
                  </span>
                  {node.max_occupancy === 0 && (
                  <span className={`text-success ${classes.statusMsg}`}>
                    {' '}
                    (Max occupancy is limited to
                    {' '}
                    {node.max_occupancy}
                    )
                  </span>
                  )}

                  {node.max_occupancy !== 0 && (
                  <span className={(multiSelectedEmployeesDropDown.length > node.max_occupancy) ? `text-danger ${classes.statusMsg}` : `text-success ${classes.statusMsg}`}>
                    {' '}
                    (Max occupancy is limited to
                    {' '}
                    {node.max_occupancy}
                    )
                  </span>
                  )}
                </Col>
              ) : (
                <Col
                  sm="12"
                  className={(bookingStatus[node.status] && bookingStatus[node.status].color
                    ? `${bookingStatus[node.status].color} ${classes.statusMsg}`
                    : '')}
                >
                  {(node && node.spaceCategory && node.spaceCategory.id
                  && node.children
                  && node.children.length === 0
                  && node.status)
                  && BookingData && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id
                  && node.isBookingAllowed && BookingData.workStationType.type !== 'room' && (
                    <>
                      {node.status}
                    </>
                  )}
                  {(node && node.spaceCategory && node.spaceCategory.id
                  && node.children
                  && node.children.length === 0
                  && node.status)
                  && BookingData && BookingData.workStationType && BookingData.workStationType.id === node.spaceCategory.id
                  && node.isBookingAllowed && BookingData.workStationType.type === 'room' && node.max_occupancy === 0 && (
                    <>
                      (Max occupancy is limited to
                      {' '}
                      {node.max_occupancy}
                      )
                    </>
                  )}
                  {node
                  && node.spaceCategory
                  && node.spaceCategory.id
                  && node.children
                  && node.children.length === 0
                  && !node.isBookingAllowed
                  && BookingData
                  && BookingData.workStationType
                  && BookingData.workStationType.id === node.spaceCategory.id && (
                    <div className="text-danger">
                      Not a bookable space
                    </div>
                  )}
                </Col>
              )}
          </Row>
        </Col>
      </Row>
      {
        node
        && node.children
        && node.children.length === 0
        && node.is_booking_allowed
        && node.isBookingAllowed && (
          <Row className="mt-2">
            <Col
              sm={{ size: 11, offset: 1 }}
              className="pl-0"
            >
              {selectedNodes.includes(node.id) && (
                <Select
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  placeholder={(BookingData.workStationType && BookingData.workStationType.type === 'room' && treeBookingType !== 'individual') ? 'Select Host' : validateGuestOrParticipant()}
                  // eslint-disable-next-line max-len
                  defaultValue={(selectedNodes.includes(node.id) && BookingData.workStationType && BookingData.workStationType.type === 'room' && treeBookingType === 'group' ? saveHostInfo : '')
                    || (selectedNodes.includes(node.id)
                      && dropDownEmployees.length === 0
                      && buildTreeData.length >= 1
                      && buildTreeData
                      && buildTreeData[buildTreeData.length - 1]
                      && buildTreeData[buildTreeData.length - 1].employee
                      ? buildTreeData[buildTreeData.length - 1].employee
                      && buildTreeData[buildTreeData.length - 1].employee : '')}
                  onChange={(value) => setEmployeeToSelectedNode(value, node)}
                  options={BookingData.workStationType.type === 'room' && saveHostInfo && saveHostInfo.id ? [] : dropDownEmployees}
                  isDisabled={(dropDownEmployees && dropDownEmployees.length === 0) || (BookingData.workStationType.type === 'room')}
                />
              )}
            </Col>
          </Row>
        )
      }
    </div>
  );

  const [selectedTreeChild, setSelectedTreeChild] = useState({});

  const fetchChildObjects = (node) => {
    setSelectedNodeChild(node);
    setSelectedTreeChild(node.id);
    dispatch(getMultidaysAvailabilitySpacesInfo(node.id,
      getPlannedUtcTime(BookingData.site.custom_planned_in ? BookingData.site.custom_planned_in : BookingData.site.planned_in),
      getPlannedUtcTime(BookingData.site.custom_planned_out ? BookingData.site.custom_planned_out : BookingData.site.planned_out), BookingData.site.id, BookingData.workStationType.id));
  };

  const renderTreeChild = (nodes) => {
    return (
      <div>
      { nodes && (
        <TreeItem
          classes={{
            label: selectedNodes.includes(nodes.id)
              && nodes && nodes.children && nodes.children.length === 0
              ? classes.selectedLabel
              : classes.label,
            expanded: classes.expanded,
          }}
          key={nodes.treeNodeId}
          nodeId={nodes.treeNodeId}
          label={label(nodes)}
          onClick={floorView && floorView.data.find((floor) => floor.id === nodes.id) && nodes && nodes.children && !nodes.children.length && !nodes.err ? () => fetchChildObjects(nodes) : undefined}
        >
          {nodes.spaceCategory && BookingData && BookingData.workStationType && BookingData.workStationType.id === nodes.spaceCategory.id && nodes.childCount === 0 ? null : (
            <>
              {nodes.childCount > 0 && nodes && nodes.children && nodes.children.length === 0 ? (
                <span className="text-danger ml-2"> No spaces available for booking</span>
              ) : (
                <>
                  {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTreeChild(node)) : null}
                </>
              )}
              {workStations && nodes.id === selectedTreeChild && workStations.loading && (
                <div className="text-center">
                  <Spinner size="sm" color="dark" />
                </div>
              )}
              {nodes && nodes.children && nodes.children.length === 0 && nodes.err && nodes.err.error && nodes.err.error.message && (
                <div className="text-danger ml-2">
                  {' '}
                  {nodes.err.error.message}
                </div>
              )}
            </>
          )}
        </TreeItem>
      )}
      {!nodes && (
        <div className="text-danger text-center">
          Spaces are not available
        </div>
      )}
      </div>
    );
  };

  const getValidation = () => {
    if (treeBookingType === 'individual') {
      if (addGuestInfo && addGuestInfo.data) {
        if (savedGuestData && savedGuestData.length !== 0) {
          return false;
        }
        return true;
      }
      return false;
    }
    if (addGuestInfo && addGuestInfo.data) {
      if (savedGuestData && savedGuestData.length >= 1) {
        return false;
      }
      return true;
    }
    return false;
  };

  const addGuestModal = ({ children }) => (
    <Paper>
      {children}
      <Divider variant="middle" />
      <div className="d-flex justify-content-center p-2">
        <Button
          className="roundCorners btn-secondary text-white  btn btn-outline-secondary btn-sm"
          onMouseDown={(event) => { event.preventDefault(); }}
          onClick={() => setGuestModalOpen(!guestModalOpen)}
        >
          <FontAwesomeIconComponent faIcon={faPlusCircle} iconStyles="mr-1" />
          Add Guest
        </Button>
      </div>
    </Paper>
  );

  return (
    <div>
      <Row className="mb-4">
        <Col sm="12">
          {guestModalOpen && (
            <SaveGuestModal
              guestModalOpen={guestModalOpen}
              setGuestModalOpen={setGuestModalOpen}
            />
          )}
        </Col>
      </Row>
      {hostData !== null && !getValidation() && multidaysAvailabilityInfo && multidaysAvailabilityInfo.data ? (
        <Card id="slimScroll">
          <CardHeader className="bufferBackground">
            <span className="mt-2 tree-view-spaces-header">
              Spaces for
              {' '}
              {categoryName}
            </span>
            <TextField
              value={selectedSpaceNameValue}
              className="searchInput"
              placeholder="Search..."
              onChange={(e) => {
                onChangeFunction(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton className='iconButton'>
                      <SearchIcon className='searchIcon iconButton'/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <UncontrolledTooltip placement="top" target="faArrowDown">
              Decreasing Order
            </UncontrolledTooltip>
            <UncontrolledTooltip placement="top" target="faArrowUp">
              Increasing Order
            </UncontrolledTooltip>
            <FontAwesomeIcon className="outline-none cursor-pointer ml-1 mr-2 arrowButton" onClick={() => { setSortingDsec(true); setSortingAsec(false); }}  size="lg" icon={faArrowDown} id="faArrowDown"/>
            <FontAwesomeIcon className="outline-none cursor-pointer ml-1 mr-2 arrowButton" onClick={() => { setSortingAsec(true); setSortingDsec(false); }} size="lg" icon={faArrowUp} id="faArrowUp"/>
          </CardHeader>
          <CardBody className="treeViewHeight tree-view-text-color pr-2">
            <TreeView
              className={classes.root}
              defaultCollapseIcon={<ExpandMoreIcon className="MuiTreeItem-iconContainer"/>}
              defaultExpanded={['root']}
              defaultExpandIcon={<ChevronRightIcon className="MuiTreeItem-iconContainer"/>}
              onNodeToggle={handleChange}
              multiSelect
              expanded={expanded}
            >
              {renderTreeChild(data)}
            </TreeView>
          </CardBody>
        </Card>
      ) : multidaysAvailabilityInfo && multidaysAvailabilityInfo.err && multidaysAvailabilityInfo.err.error ? (
        // eslint-disable-next-line react/jsx-no-comment-textnodes
        <div className="text-center text-danger">
          No spaces available
        </div>
      ) : ''}
      {capsLimitInfo && capsLimitInfo.err && capsLimitInfo.err.error && (
        <Row className="text-danger ml-5">
          <div className="ml-5">
            <FontAwesomeIcon className="mr-2 font-size-20px mb-n2px" size="sm" icon={faExclamationCircle} />
            {capsLimitInfo.err.error.message}
          </div>
        </Row>
      )}
      {capLimitModal && (
        <div>
          <CapLimitModalWindow setSpacesTrue={setSpacesTrue} capLimitModal={capLimitModal} setCapLimitModal={setCapLimitModal} capsLimitInfo={capsLimitInfo} />
        </div>
      )}
    </div>
  );
};

RecursiveTreeViewLayout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any.isRequired,
  BookingData: PropTypes.shape({
    site: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      planned_in: PropTypes.string,
      planned_out: PropTypes.string,
    }),
    workStationType: PropTypes.shape({
      enableBookingCap: PropTypes.bool,
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
  setTreeDataToSelectedSpaceView: PropTypes.func,
  treeBookingType: PropTypes.string,
};

RecursiveTreeViewLayout.defaultProps = {
  setTreeDataToSelectedSpaceView: () => { },
  treeBookingType: '',
};

export default RecursiveTreeViewLayout;
