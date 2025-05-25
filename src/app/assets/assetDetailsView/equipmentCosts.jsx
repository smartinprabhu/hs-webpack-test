/* eslint-disable no-loop-func */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { Button, Drawer } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import TrackerCheck from '@images/sideNavImages/breakdownTracker_black.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import workOrdersBlue from '@images/icons/workOrders.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getReadings,
  getAssetDetail,
  resetUpdateEquipment,
} from '../equipmentService';
import {
  getDefaultNoValue, generateErrorMessage, getCompanyTimezoneDate, extractTextObject,
  numToFloat, truncate,
} from '../../util/appUtils';
import {
  getTrackerDetail,
} from '../../breakdownTracker/breakdownService';
import {
  getWorkOrderMaintenanceType,
} from '../utils/utils';

import './style.scss';
import OrderDetail from '../../workorders/viewWorkorder/orderDetail';
import DataExport from '../dataExport/equipmentCostExport';
import WorkorderDetails from '../../workorders/workorderDetails/workorderDetails';
import DrawerHeader from '../../commonComponents/drawerHeader';
import TrackerDetailView from '../../breakdownTracker/breakdownDetailView/breakdownDetails';

const appModels = require('../../util/appModels').default;

const HistoryCard = React.memo((props) => {
  const {
    ids, setViewModal, isEquipmentDetails, isITAsset,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [addLink, setAddLink] = useState(false);

  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('date');
  const [enter, setEnter] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [exportType, setExportType] = useState();
  const [view1Modal, setView1Modal] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { assetReadings, equipmentsDetails, updateEquipment } = useSelector((state) => state.equipment);
  const {
    trackerDetails,
  } = useSelector((state) => state.breakdowntracker);

  const equipmentName = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].name : false;
  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : [];

  useEffect(() => {
    if (ids) {
      const fields = ['id', 'name', 'category_id', 'amount', 'date', 'related_model', 'related_model_id', 'description'];
      dispatch(getReadings(ids, appModels.EQUIPMENTCOST, false, false, fields));
    }
  }, [ids]);

  const openOrder = (orderId, orderModel) => {
    if (history && history.location && history.location.pathname) {
      const pathName = history.location.pathname;
      if (pathName === '/breakdown-tracker') {
        setViewModal(false);
      } else {
        setView1Modal(true);
      }
    }
    if (orderModel === 'hx.breakdown_tracker') {
      dispatch(getTrackerDetail(orderId, orderModel));
    }
  };

  const trackerData = trackerDetails && trackerDetails.data && trackerDetails.data.length > 0
    ? trackerDetails.data[0]
    : '';

  const drawertitleName = (
    <Tooltip title={trackerData.name} placement="right">
      {truncate(trackerData.name, '50')}
    </Tooltip>
  );

  function getITAssetRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 w-15">
            <span className="word-break-content">
              {getDefaultNoValue(assetData[i].name)}
            </span>
          </td>
          <td className="p-2 w-20">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</td>
          <td className="p-2 w-15">
            {numToFloat(assetData[i].amount)}
          </td>
          <td className="p-2 w-15">
            <span className="word-break-content">
              {getCompanyTimezoneDate(assetData[i].date, userInfo, 'date')}
            </span>
          </td>
          <td className="p-2 w-15">
            <span className="word-break-content">
              {getDefaultNoValue(assetData[i].description)}
            </span>
          </td>
          <td className="p-2 w-20">
            <Tooltip title={`View${' '}${getDefaultNoValue(extractTextObject(assetData[i].category_id))}`}>
              <Button
                variant="contained"
                disabled={!assetData[i].related_model_id}
                className="pb-05 pt-05 font-11 rounded-pill mb-1 mr-2"
                onClick={() => { openOrder(assetData[i].related_model_id, assetData[i].related_model); }}
              >
                View
                {' '}
                {getDefaultNoValue(extractTextObject(assetData[i].category_id))}
              </Button>
            </Tooltip>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const onViewReset = () => {
    setView1Modal(false);
    if (updateEquipment && updateEquipment.data) {
      dispatch(getAssetDetail(equipmentsDetails.data[0].id, appModels.EQUIPMENT, false));
      dispatch(resetUpdateEquipment());
    }
  };

  return (
    <>
      <Row className="asset-history-tab">
        <Col sm="12" md="12" lg="12" xs="12">
          <>
            {(assetReadings && assetReadings.data && assetReadings.data.length && assetReadings.data.length > 0) && (
            <span className="float-right mr-4">
              <Tooltip title="Download PDF" placement="top">
                <FontAwesomeIcon
                  aria-hidden="true"
                  size="lg"
                  className="cursor-pointer mr-2"
                  icon={faFilePdf}
                  onClick={() => {
                    setExportType('pdf');
                  }}
                />
              </Tooltip>
              <Tooltip title="Download Excel" placement="top">
                <FontAwesomeIcon
                  aria-hidden="true"
                  size="lg"
                  className="cursor-pointer"
                  icon={faFileExcel}
                  onClick={() => {
                    setExportType('excel');
                  }}
                />
              </Tooltip>
              <DataExport
                afterReset={() => setExportType(false)}
                assetHistoryCard={exportType === 'excel' ? assetReadings : assetReadings.data}
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
      <Row className="asset-history-tab">
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
          {(assetReadings && assetReadings.data && assetReadings.data.length && assetReadings.data.length > 0)
            ? (
              <div>
                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="p-2 w-15">
                        Title
                      </th>
                      <th className="p-2 W-15">
                        Category
                      </th>
                      <th className="p-2 W-15">
                        Amount
                      </th>
                      <th className="p-2 W-15">
                        Date
                      </th>
                      <th className="p-2 W-25">
                        Description
                      </th>
                      <th className="p-2 W-10">
                        Manage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getITAssetRow(assetReadings && assetReadings.data ? assetReadings.data : [])}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
            ) : ''}
          {assetReadings && assetReadings.loading && (
          <Loader />
          )}
          {(assetReadings && assetReadings.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetReadings)} />
          )}
          {ids && ids.length === 0 && (assetReadings && !assetReadings.err) && (
          <ErrorContent errorTxt="No Data Found." />
          )}
        </Col>
      </Row>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={view1Modal}
      >
        <DrawerHeader
          headerName={
            trackerDetails
              && trackerDetails.data
              && trackerDetails.data.length > 0
              && !trackerDetails.loading
              ? drawertitleName
              : 'Breakdown Tracker'
          }
          imagePath={TrackerCheck}
          onClose={onViewReset}
        />
        <TrackerDetailView
          editId={
            trackerDetails
              && trackerDetails.data
              && trackerDetails.data.length > 0
              ? trackerDetails.data[0].id
              : false
          }
          isAsset
        />
      </Drawer>
    </>
  );
});

HistoryCard.defaultProps = {
  setEquipmentDetails: () => {},
  isITAsset: false,
};

HistoryCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
  setEquipmentDetails: PropTypes.func,
  isEquipmentDetails: PropTypes.bool.isRequired,
  isITAsset: PropTypes.bool,
};

export default HistoryCard;
