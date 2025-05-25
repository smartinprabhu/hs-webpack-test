/* eslint-disable no-loop-func */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Table,
  ModalBody,
  Modal,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Drawer, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
} from '@fortawesome/free-solid-svg-icons';

import TrackerCheck from '@images/icons/incidentManagement.svg';
import editIcon from '@images/icons/edit.svg';
import addIcon from '@images/icons/plusCircleMini.svg';

import DrawerHeader from '@shared/drawerHeader';
import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import CreateDataEmpty from '@shared/createDataEmpty';

import {
  getDefaultNoValue, extractNameObject, getCompanyTimezoneDate,
} from '../../util/appUtils';

import Documents from '../../commonComponents/documents';
import { getTaskStateLabel, getSLATimeClosedReport } from '../utils/utils';

import UpdateTask from './updateTask';
import TaskDetail from './taskDetail';

const appModels = require('../../util/appModels').default;

const Tasks = () => {
  const { incidentDetailsInfo } = useSelector((state) => state.hazards);
  const { userInfo } = useSelector((state) => state.user);

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [currentId, setCurrentId] = useState(false);
  const [currentName, setCurrentName] = useState(false);
  const [actionModal, showActionModal] = useState(false);

  const [detailDatas, setDetailData] = useState(false);

  const [dataId, setDataId] = useState(false);

  const [saveType, setSaveType] = useState(false);

  const [infoModal, setInfoModal] = useState(false);
  const [infoDesc, setInfoDesc] = useState('');

  const [detailInfo, setDetail] = useState('');

  const loading = incidentDetailsInfo && incidentDetailsInfo.loading;
  const isErr = incidentDetailsInfo && incidentDetailsInfo.err;
  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.analysis_ids && inspDeata.analysis_ids.length > 0);

  const onOpenAttachment = (id, name) => {
    setCurrentId(id);
    setCurrentName(name);
    setAttachmentModal(true);
  };

  const onOpenInfo = (data) => {
    setDetail(data);
    setInfoModal(true);
  };

  const onOpenUpdate = (data) => {
    setSaveType('edit');
    setDetailData(data);
    setDataId(inspDeata.id);
    setCurrentName(data.name);
    showActionModal(true);
  };

  const onOpenAdd = () => {
    setSaveType('add');
    setDetailData({
      id: '', name: '', state: 'Open', task_type_id: '', summary_incident: '', description: '', target_date: '', assigned_id: {},
    });
    setDataId(inspDeata.id);
    setCurrentName('Add Task');
    showActionModal(true);
  };

  const onCloseUpdate = () => {
    setDetailData(false);
    showActionModal(false);
  };

  const isManagable = inspDeata && (inspDeata.state === 'Analyzed' || inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged');

  const iEditable = inspDeata && (inspDeata.state === 'Analyzed' || inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged');

  /* function isValidUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && inspDeata.probability_id && inspDeata.probability_id.remediate_authority_id && inspDeata.probability_id.remediate_authority_id.id && userRoleId === inspDeata.probability_id.remediate_authority_id.id) {
      res = true;
    }
    return res;
  } */

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].assigned_id, 'name'))}</td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].create_date, userInfo, 'date'))}
          </td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].target_date, userInfo, 'date'))}
          </td>
          <td className="p-2">
            {' '}
            {getSLATimeClosedReport(assetData[i].target_date, assetData[i].create_date) !== '-' && (new Date() > new Date(assetData[i].target_date)) && assetData[i].state !== 'Completed' && (
              <span className="text-danger">
                Elapsed (
                {getDefaultNoValue(getSLATimeClosedReport(assetData[i].target_date, assetData[i].create_date))}
                )
              </span>
            )}
            {(new Date() <= new Date(assetData[i].target_date)) && assetData[i].state !== 'Completed' && (
              <span className="text-success">
                {getDefaultNoValue(getSLATimeClosedReport(assetData[i].target_date, assetData[i].create_date))}
              </span>
            )}
          </td>
          <td className="p-2">{getDefaultNoValue(getTaskStateLabel(assetData[i].state))}</td>
          <td>
            <Tooltip title="View">
              <span className="text-info cursor-pointer">
                <FontAwesomeIcon onClick={() => onOpenInfo(assetData[i])} className="ml-2 custom-fav-icon" size="sm" icon={faEye} />
              </span>
            </Tooltip>
            {iEditable && assetData[i].state !== 'Completed' && (
            <Tooltip title="Edit">
              <img src={editIcon} aria-hidden="true" className="ml-2 mb-1 cursor-pointer" alt="addequipment" height="15" width="15" onClick={() => onOpenUpdate(assetData[i])} />
            </Tooltip>
            )}

          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab form-modal-scroll thin-scrollbar product-orders">
        <div className="font-weight-800 float-right mb-1">
          {isManagable && (
          <Tooltip title="Add">
            <img src={addIcon} aria-hidden="true" className="mr-2 mb-1 cursor-pointer" alt="addequipment" height="15" width="15" onClick={() => onOpenAdd()} />
          </Tooltip>
          )}
        </div>
        {isChecklist && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Title
                  </th>
                  <th className="p-2 min-width-160">
                    Assigned To
                  </th>
                  <th className="p-2 min-width-160">
                    Create Date
                  </th>
                  <th className="p-2 min-width-160">
                    Target Date
                  </th>
                  <th className="p-2 min-width-160">
                    No of Days / Elapsed
                  </th>
                  <th className="p-2 min-width-160">
                    Status
                  </th>
                  <th className="p-2 min-width-160">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(incidentDetailsInfo.data.length > 0 ? incidentDetailsInfo.data[0].analysis_ids : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={incidentDetailsInfo} />
        {!isErr && inspDeata && !(isManagable) && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        {!isErr && inspDeata && (isManagable) && !isChecklist && !loading && (
        <CreateDataEmpty text="Add your recommendations here." onCreate={() => onOpenAdd()} />
        )}
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={attachmentModal}>
          <ModalHeaderComponent title={currentName} imagePath={false} closeModalWindow={() => { setAttachmentModal(false); }} />
          <ModalBody className="mt-0 pt-0">
            <Documents
              viewId={currentId}
              reference={currentName}
              resModel="hx.ehs_hazards_analysis"
              model={appModels.DOCUMENT}
              isManagable={isManagable}
            />
          </ModalBody>
        </Modal>
        <Drawer
          title=""
          closable={false}
          width="60%"
          className="drawer-bg-lightblue-no-scroll"
          visible={infoModal}
        >
          <DrawerHeader
            title={detailInfo && detailInfo.name
              ? detailInfo.name : 'Task'}
            imagePath={TrackerCheck}
            closeDrawer={() => setInfoModal(false)}
          />
          <TaskDetail detailData={detailInfo} />
        </Drawer>
        {actionModal && (
        <UpdateTask
          atCancel={() => onCloseUpdate()}
          detailData={detailDatas}
          actionModal={actionModal}
          displayName={currentName}
          dataId={dataId}
          type={saveType}
          inspDeata={inspDeata}
        />
        )}
      </Col>
    </Row>
  );
};

export default Tasks;
