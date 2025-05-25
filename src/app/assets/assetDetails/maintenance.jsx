/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Statistic } from 'antd';

import Loader from '@shared/loading';
import { getMaintenanceTypeGroups } from '../equipmentService';
import {
  getWorkorderFilter,
} from '../../workorders/workorderService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import WorkOrder from '../../workorders/workorders';
import { getMNValue } from '../utils/utils';
import assetActionData from '../data/assetsActions.json';
import { Drawer } from '@mui/material';
import DrawerHeader from '../../commonComponents/drawerHeader';

const appModels = require('../../util/appModels').default;

const Maintenance = (props) => {
  const { id, setViewModal, setEquipmentDetails } = props;
  const dispatch = useDispatch();
  const { maintenanceGroups, equipmentsDetails } = useSelector((state) => state.equipment);

  const [isRedirect, setRedirect] = useState(false);
  const equipmentName = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].name : false;

  useEffect(() => {
    if (id) {
      dispatch(getMaintenanceTypeGroups(id, appModels.ORDER));
    }
  }, [id]);
  /* useEffect(() => {
    if (id) {
      dispatch(getMaintenanceTypeDueGroups(id, appModels.ORDER, today));
    }
  }, [id]); */

  // const dueData = (maintenanceDueGroups && maintenanceDueGroups.data) ? maintenanceDueGroups.data : [];

  const onLoadWorkOrders = (code, label, total) => {
    if (equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length && total) {
      const filters = [{
        key: 'equipment_id',
        value: equipmentsDetails.data[0].id,
        label: equipmentsDetails.data[0].name,
        type: 'ids',
        filter: 'Asset'
      }];
      const types = [{ id: code, label }];
      const filterValues = {
        states: [],
        teams: [],
        priorities: [],
        maintenanceTypes: types,
        customFilters: filters,
      };
      dispatch(getWorkorderFilter(filterValues));
      setViewModal(true);
      setEquipmentDetails(false);
      setRedirect(true);
    }
  };

  /* if (isRedirect) {
    return (<Redirect to="/maintenance/workorders" />);
  } */

  const closeWorkOrder = () => {
    const filterValues = {
      states: [],
      teams: [],
      priorities: [],
      maintenanceTypes: [],
      customFilters: [],
    };
    dispatch(getWorkorderFilter(filterValues));
    dispatch(setInitialValues(false, false, false, false));
    setRedirect(false);
    setViewModal(true);
    setEquipmentDetails(true);
  };

  return (
    <>
      <Row>
        {(maintenanceGroups && !maintenanceGroups.loading) && (
          assetActionData && assetActionData.maintenanceTypes.map((item) => (
            <Col key={item.value} sm="6" md="3" lg="3" xs="6" className="p-1">
              <Card className="border-0 bg-white h-100 text-center">
                <CardTitle className="m-0 pt-3">
                  <span className="font-weight-700">
                    {item.label}
                  </span>
                </CardTitle>
                <CardBody className="p-2 cursor-pointer" onClick={() => onLoadWorkOrders(item.value, item.label, getMNValue(maintenanceGroups.data, item.value, 'count'))}>
                  <Statistic
                    value={getMNValue(maintenanceGroups.data, item.value, 'count')}
                  />
                </CardBody>
              </Card>
            </Col>
          ))
        )}
        { /* (maintenanceGroups && maintenanceGroups.data) && (
          assetActionData && assetActionData.maintenanceTypes.map((item) => (
            <Col key={item.value} sm="6" md="3" lg="3" xs="6" className="p-1">
              <Card className="p-1">
                <CardBody className="p-1">
                  <Row className="mb-3">
                    <Col sm="12" md="12" lg="12" xs="12">
                      <span className="p-0 font-weight-800">
                        {item.label}
                      </span>
                      <span className="p-0 float-right text-primary font-weight-800">
                        {getMNValue(maintenanceGroups.data, item.value, 'count')}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    {assetActionData && assetActionData.stateTypes.map((st) => (
                      <Col sm="6" md="4" lg="4" xs="6" className="text-center p-0" key={st.value}>
                        <p className="p-0 font-weight-500 mb-2">
                          {getMTValueByState(maintenanceGroups.data, item.value, st.value)}
                        </p>
                        <small>
                          {st.label}
                        </small>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))
                    ) */ }
        {(maintenanceGroups && maintenanceGroups.loading) && (
          <Col sm="12" md="12" lg="12" xs="12" className="p-3">
            <Loader />
          </Col>
        )}
        { /* <Col sm="12" md="12" lg="12" xs="12" className="p-1">
          <div className="mt-1 p-1">

            <CardBody className="p-1">
              {barChartDetails}
            </CardBody>
          </div>
        </Col> */ }
      </Row>
      <Drawer
        PaperProps={{
          sx: { width: "85%" },
        }}
        anchor="right"
        open={isRedirect}
      >
        <DrawerHeader
          headerName="Workorders"
          imagePath=""
          onClose={closeWorkOrder}
        />
        <WorkOrder isDrawer={isRedirect} />
      </Drawer>
    </>
  );
};

Maintenance.defaultProps = {
  setViewModal: () => { },
  setEquipmentDetails: () => { },
};

Maintenance.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  setViewModal: PropTypes.func,
  setEquipmentDetails: PropTypes.func,
};

export default Maintenance;
