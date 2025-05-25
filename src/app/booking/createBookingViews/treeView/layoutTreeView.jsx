/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useSelector } from 'react-redux';

import RecursiveTreeViewLayout from './recursiveTreeViewLayout';
import { buildTreeViewObj, getSpaceFromNodeId } from './buildTreeViewData';
import SelectedSpaceView from './selectedSpaceView';

const LayoutTreeView = ({
  // eslint-disable-next-line react/prop-types
  data, workSpaceSelect, BookingData, treeBookingType, setSelectedNodeChild, setEmployees, getGroupWorkStations, setSpaceAvailabilityData
}) => {
  const { userRoles } = useSelector((state) => state.user);

  const [removeNode, isRemoveNode] = useState();
  const [removeAllNodes, isRemoveAllNodes] = useState();
  const [selectedWorkspace, setSelectedSpace] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [treeViewData, setTreeViewData] = useState([]);
  const [allEmployees, selectedAllEmployees] = useState([]);
  // const { userRoles } = useSelector((state) => state.config);
  const { removedNodeWithEmployee } = useSelector((state) => state.bookingInfo);
  const { multidaysAvailabilityInfo } = useSelector((state) => state.bookingInfo);
  const [sortingAsec, setSortingAsec] = useState(false);
  const [sortingDsec, setSortingDsec] = useState(false);
  const [selectedSpaceNameValue, setSelectedSpaceNameValue] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const onTreeNodeSelect = (node, employee, remove, removeAll) => {
    isRemoveNode(remove);
    isRemoveAllNodes(removeAll);
    setSelectedSpace(node);
    setSelectedEmployee(employee);
  };

  const setSelectedSpaceView = (treeData, employees) => {
    setTreeViewData(treeData);
    selectedAllEmployees(employees);
  };

  useEffect(() => {
    if (removedNodeWithEmployee !== []) {
      isRemoveNode(removedNodeWithEmployee);
    }
  }, [removedNodeWithEmployee]);

  const updateWorkSpace = (workSpaceObj, employee) => {
    workSpaceSelect(workSpaceObj, employee, allEmployees);
  };

  const removeSelectedNodeWithEmployee = (node) => {
    isRemoveNode(node);
  };

  const onChangeFunction = (e) => {
    setSelectedSpaceNameValue(e);
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12" className="d-block">
        <RecursiveTreeViewLayout
          data={selectedSpaceNameValue && selectedSpaceNameValue.length >= 2 ? buildTreeViewObj(data, userRoles && userRoles.data, selectedSpaceNameValue, sortingAsec, sortingDsec) : buildTreeViewObj(data, userRoles && userRoles.data, null , sortingAsec, sortingDsec)}
          BookingData={BookingData}
          removeNodeWithEmp={removeNode}
          setSpaceAvailabilityData={setSpaceAvailabilityData}
          getGroupWorkStations={getGroupWorkStations}
          setTreeDataToSelectedSpaceView={setSelectedSpaceView}
          treeBookingType={treeBookingType}
          setSelectedNodeChild={setSelectedNodeChild}
          setEmployees={setEmployees}
          setSortingAsec={setSortingAsec}
          sortingAsec={sortingAsec}
          sortingDsec={sortingDsec}
          setSortingDsec={setSortingDsec}
          onChangeFunction={onChangeFunction}
          setSelectedSpaceNameValue={setSelectedSpaceNameValue}
          selectedSpaceNameValue={selectedSpaceNameValue}
        />
      </Col>
      {selectedWorkspace && (
        <Col sm="6" className="bg-buffer">
          <SelectedSpaceView
            workSpace={getSpaceFromNodeId(data, selectedWorkspace.id)}
            employee={selectedEmployee}
            removeNode={removeNode}
            removeAll={removeAllNodes}
            updateWorkSpace={updateWorkSpace}
          />
        </Col>
      )}
      {/* {treeViewData && multidaysAvailabilityInfo && multidaysAvailabilityInfo.data && (
        <>
          <Col sm="12" md="12" lg="6" className="bg-buffer pl-0">
            <SelectedSpaceView
              removeNodeWithEmployee={removeSelectedNodeWithEmployee}
              removeAll={removeAllNodes}
              updateWorkSpace={updateWorkSpace}
              treeViewData={treeViewData}
            />
          </Col>
        </>
      )} */}
    </Row>
  );
};

LayoutTreeView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.number,
        space_name: PropTypes.string,
        space_number: PropTypes.string,
        space_type: PropTypes.oneOfType([
          PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number,
              name: PropTypes.string,
            }),
          ),
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
          }),
        ]),
        space_sub_type: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      },
    ),
  ).isRequired,
  BookingData: PropTypes.shape({
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
  treeBookingType: PropTypes.string,
};

LayoutTreeView.defaultProps = {
  treeBookingType: '',
};
export default LayoutTreeView;
