/* eslint-disable no-sequences */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Table,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { Tooltip, Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import assetIcon from '@images/icons/assetDefault.svg';

import DrawerHeader from '@shared/drawerHeader';
import ErrorContent from '@shared/errorContent';

import {
  getDefaultNoValue,
  extractNameObject,
  translateText,
  getColumnArrayById,
} from '../util/appUtils';
import {
  getAssetDetail,
} from '../assets/equipmentService';
import Readings from '../assets/assetDetails/readings';

const appModels = require('../util/appModels').default;

const FloorAssets = (props) => {
  const {
    assetsList,
    eqId,
  } = props;

  const dispatch = useDispatch();

  const [isViewReadings, setViewReadings] = useState(false);

  const [viewTitle, setViewTitle] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewLines, setViewLines] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const loadAsset = (id) => {
    dispatch(getAssetDetail(id, appModels.EQUIPMENT, 'school'));
  };

  const closeView = () => {
    setViewTitle(false);
    setViewReadings(false);
    setViewId(false);
    setViewLines([]);
  };

  const openView = (name, id, lines) => {
    setViewTitle(name);
    setViewId(id);
    setViewLines(getColumnArrayById(lines, 'id'));
    setViewReadings(true);
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className={`p-2 cursor-pointer ${eqId === assetData[i].id ? 'text-info font-weight-800' : ''}`} aria-hidden onClick={() => loadAsset(assetData[i].id)}>
            <Tooltip title={getDefaultNoValue(extractNameObject(assetData[i].location_id, 'path_name'))} placement="top">
              {getDefaultNoValue(extractNameObject(assetData[i].location_id, 'space_name'))}
            </Tooltip>
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].serial)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].category_id, 'name'))}</td>
          <td className="p-2">
              <Button
                 variant="contained"
                size="sm"
                className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                onClick={() => openView(getDefaultNoValue(extractNameObject(assetData[i].location_id, 'space_name')), assetData[i].id, assetData[i].reading_lines_ids)}
              >
                View Readings
              </Button>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      {(assetsList && assetsList.length > 0) && (
      <div className="sensor-table-scroll thin-scrollbar p-0">
        <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
          <thead>
            <tr>
              <th className="p-2 min-width-100">
                {translateText('Location', userInfo)}
              </th>
              <th className="p-2 min-width-100">
                {translateText('Serial Number', userInfo)}
              </th>
              <th className="p-2 min-width-100">
                {translateText('Category', userInfo)}
              </th>
              <th className="p-2 min-width-100">
                Manage
              </th>
            </tr>
          </thead>
          <tbody>
            {getRow(assetsList)}
          </tbody>
        </Table>
        <hr className="m-0" />
      </div>
      )}

      {assetsList && assetsList.length === 0 && (
      <ErrorContent errorTxt="No Data Found" />
      )}
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue-no-scroll"
        width="70%"
        visible={isViewReadings}
      >

        <DrawerHeader
          title={viewTitle}
          imagePath={assetIcon}
          closeDrawer={() => closeView()}
        />
        <Readings
          ids={viewLines}
          viewId={viewId}
          type="equipment"
          setViewModal={{}}
          viewModal={{}}
          setEquipmentDetails={{}}
          editReadings
        />
      </Drawer>
    </>
  );
};

FloorAssets.propTypes = {
  assetsList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  eqId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

export default FloorAssets;
