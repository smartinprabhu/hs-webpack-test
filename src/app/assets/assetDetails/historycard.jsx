/* eslint-disable no-loop-func */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Tooltip, Drawer } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import workOrdersBlue from '@images/icons/workOrders.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';
import { getHistoryCard } from '../equipmentService';
import {
  getDefaultNoValue, generateErrorMessage, getCompanyTimezoneDate, extractTextObject,
} from '../../util/appUtils';
import {
  getWorkOrderMaintenanceType,
} from '../utils/utils';
import {
  getOrderDetail,
} from '../../workorders/workorderService';
import './style.scss';
import OrderDetail from '../../workorders/viewWorkorder/orderDetail';
import DataExport from '../dataExport/historycardExport';

const appModels = require('../../util/appModels').default;

const HistoryCard = React.memo((props) => {
  const {
    ids, setViewModal, viewModal, setEquipmentDetails, isEquipmentDetails, isITAsset,
  } = props;
  const dispatch = useDispatch();
  const [addLink, setAddLink] = useState(false);

  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('date');
  const [enter, setEnter] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [exportType, setExportType] = useState();
  const { userInfo } = useSelector((state) => state.user);
  const { assetHistoryCard, equipmentsDetails } = useSelector((state) => state.equipment);

  const equipmentName = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].name : false;
  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : [];

  useEffect(() => {
    if (ids && !isITAsset) {
      dispatch(getHistoryCard(ids, appModels.HISTORYCARD, sortField, sortBy));
    }
  }, [ids, sortField, sortBy]);

  useEffect(() => {
    if (ids && isITAsset && enter) {
      dispatch(getHistoryCard(ids, appModels.HISTORYCARD, sortField, sortBy));
      setEnter(false);
    }
  }, [enter]);

  useEffect(() => {
    if (!viewModal) {
      setExportType('');
    }
  }, [viewModal]);

  useEffect(() => {
    if (!isEquipmentDetails) {
      setExportType('');
    }
  }, [isEquipmentDetails]);

  const openWorkOrder = (orderId) => {
    setOrderName('');
    if (orderId && orderId.length && orderId.length > 0) {
      dispatch(getOrderDetail(orderId[0], appModels.ORDER));
      setAddLink(true);
      setViewModal(false);
      setEquipmentDetails(false);
      setOrderName(orderId[1]);
    }
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 w-15">
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].date, userInfo, 'datetime'))}
          </td>
          <td className="p-2 w-35">{getDefaultNoValue(assetData[i].nature_of_work)}</td>
          <td className="p-2 w-15">{getWorkOrderMaintenanceType(assetData[i].maintenance_type)}</td>
          <td className="p-2 w-15">{getDefaultNoValue(extractTextObject(assetData[i].employee_id))}</td>
          <td className="p-2 w-20">
            <Tooltip title="View workorder">
              <Button
                 variant="contained"
                size="sm"
                disabled={!assetData[i].order_id}
                className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                onClick={() => { openWorkOrder(assetData[i].order_id); }}
              >
                View workorder
              </Button>
            </Tooltip>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  function getITAssetRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 w-15">
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].date, userInfo, 'datetime'))}
          </td>
          <td className="p-2 w-15">{getWorkOrderMaintenanceType(assetData[i].maintenance_type)}</td>
          <td className="p-2 w-15">{getDefaultNoValue(assetData[i].checkout_to)}</td>
          {assetData[i].checkout_to === 'Employee'
            ? <td className="p-2 w-20">{getDefaultNoValue(extractTextObject(assetData[i].employee_id))}</td> : ''}
          {assetData[i].checkout_to === 'Location'
            ? <td className="p-2 w-20">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</td> : ''}
          {assetData[i].checkout_to === 'Equipment'
            ? <td className="p-2 w-20">{getDefaultNoValue(extractTextObject(assetData[i].asset_id))}</td> : ''}
          <td className="p-2 w-25">{getDefaultNoValue(assetData[i].nature_of_work)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  const closeWorkOrder = () => {
    setAddLink(false);
    setViewModal(true);
    setEquipmentDetails(true);
  };

  return (
    <>
      <Row className="asset-history-tab">
        <Col sm="12" md="12" lg="12" xs="12">
          <>
            {(assetHistoryCard && assetHistoryCard.data && assetHistoryCard.data.length && assetHistoryCard.data.length > 0) && (
              <span className="float-right mr-4">
                <Tooltip title="Download PDF" placement="top">
                  <FontAwesomeIcon
                    aria-hidden="true"
                    size="lg"
                    className="cursor-pointer"
                    icon={faFilePdf}
                    onClick={() => {
                      setExportType('pdf');
                    }}
                  />
                </Tooltip>
                <DataExport
                  afterReset={() => setExportType(false)}
                  assetHistoryCard={assetHistoryCard.data}
                  equipmentData={equipmentData}
                  setExportType={setExportType}
                  exportType={exportType}
                  isITAsset={isITAsset}
                />
              </span>
            )}
          </>
        </Col>
      </Row>
      <Row  className="asset-history-tab">
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
          {(assetHistoryCard && assetHistoryCard.data && assetHistoryCard.data.length && assetHistoryCard.data.length > 0) && (
            isITAsset
              ? (
                <div>
                  <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="p-2 w-15">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); setEnter(true); }}>
                            Date
                          </span>
                        </th>
                        <th className="p-2 W-15">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('maintenance_type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); setEnter(true); }}>
                            Operation
                          </span>
                        </th>
                        <th className="p-2 W-15">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('checkout_to'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); setEnter(true); }}>
                            Entity Type
                          </span>
                        </th>
                        <th className="p-2 W-20">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('employee_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); setEnter(true); }}>
                            Entity
                          </span>
                        </th>
                        <th className="p-2 W-25">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('nature_of_work'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); setEnter(true); }}>
                            Notes
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getITAssetRow(assetHistoryCard && assetHistoryCard.data ? assetHistoryCard.data : [])}
                    </tbody>
                  </Table>
                  <hr className="m-0" />
                </div>
              )
              : (
                <div>
                  <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="p-2 w-15">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Date
                          </span>
                        </th>
                        <th className="p-2 W-35">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('nature_of_work'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Nature of Work | Breakdown
                          </span>
                        </th>
                        <th className="p-2 W-15">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('maintenance_type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Type
                          </span>
                        </th>
                        <th className="p-2 W-25">
                          <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('employee_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Performed By
                          </span>
                        </th>
                        <th className="p-2 W-10">
                          Manage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRow(assetHistoryCard && assetHistoryCard.data ? assetHistoryCard.data : [])}
                    </tbody>
                  </Table>
                  <hr className="m-0" />
                </div>
              )
          )}
          {assetHistoryCard && assetHistoryCard.loading && (
          <Loader />
          )}
          {(assetHistoryCard && assetHistoryCard.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetHistoryCard)} />
          )}
        </Col>
      </Row>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={addLink}
      >
        <DrawerHeader
          title={orderName}
          isEditable={false}
          pathName={equipmentName}
          imagePath={workOrdersBlue}
          closeDrawer={closeWorkOrder}
          onEdit={false}
          onPrev={false}
          onNext={false}
        />
        <OrderDetail setViewModal={setViewModal} />
      </Drawer>
    </>
  );
});

HistoryCard.defaultProps = {
  setViewModal: () => {},
  setEquipmentDetails: () => {},
  isITAsset: false,
};

HistoryCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
  setViewModal: PropTypes.func,
  setEquipmentDetails: PropTypes.func,
  viewModal: PropTypes.bool.isRequired,
  isEquipmentDetails: PropTypes.bool.isRequired,
  isITAsset: PropTypes.bool,
};

export default HistoryCard;
