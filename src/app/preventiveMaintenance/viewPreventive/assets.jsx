/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Table,
  Label,
  FormFeedback,
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, DatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';

import DetailViewFormat from '@shared/detailViewFormat';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';

import {
  getTaskChecklists, getOperationData, getInspectionOrders, resetInspectionOrders,
  getTypeId,
} from '../ppmService';
import {
  getDefaultNoValue, extractTextObject, getAllowedCompanies,
  generateErrorMessage, extractIdObject, defaultTimeZone, getDateAndTimeForDifferentTimeZones
} from '../../util/appUtils';
import { getppmForLabel } from '../utils/utils';
import {
  getExtraSelectionMultiple, getExtraSelection,
} from '../../helpdesk/ticketService';
import ChecklistPrint from '../reports/reportList/checklistPrint';

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;

const Assets = ({ isInspection }) => {
  const dispatch = useDispatch();

  const [downloadModal, setDownloadModal] = useState(false);

  const [date, changeDate] = useState(false);
  const [datesValue, setDatesValue] = useState([]);

  const [equipmentId, setEquipmentId] = useState(false);
  const [spaceId, setSpaceId] = useState(false);

  const [downloadType, setDownloadType] = useState('pdf');
  const [sortField, setSortField] = useState('date');
  const [sortBy, setSortBy] = useState('DESC');

  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmDetail, ppmOperationData, taskCheckLists, inspectionOrders,
    typeId,
  } = useSelector((state) => state.ppm);
  const {
    listDataMultipleInfo, listDataInfo,
  } = useSelector((state) => state.ticket);
  const companies = getAllowedCompanies(userInfo);

  const limit = 200;
  const offset = 0;

  const isData = inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length ? inspectionOrders.data.data[0] : false;
  const isError = inspectionOrders && inspectionOrders.data ? !inspectionOrders.data.status : false;

  const equipmentsLength = ppmDetail && ppmDetail.data && ppmDetail.data.length ? ppmDetail.data[0].equipment_ids.length : 0;
  const spacesLength = ppmDetail && ppmDetail.data && ppmDetail.data.length ? ppmDetail.data[0].location_ids.length : 0;
  const isTask = !!(ppmDetail && ppmDetail.data && ppmDetail.data.length && ppmDetail.data[0].task_id);
  const taskId = ppmDetail && ppmDetail.data && ppmDetail.data.length && ppmDetail.data[0].task_id ? ppmDetail.data[0].task_id : false;

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    const tooLate = datesValue[0] && current.diff(datesValue[0], 'days') > 30;
    const tooEarly = datesValue[1] && datesValue[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  function exportTableToExcel(tableID, fileTitle = '') {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  useEffect(() => {
    dispatch(resetInspectionOrders());
  }, []);

  useEffect(() => {
    if (inspectionOrders && inspectionOrders.data && isData && downloadType && (date && date.length)) {
      if (downloadType === 'pdf') {
        setTimeout(() => {
          /* const content = document.getElementById('print-checklist-report');
          const pri = document.getElementById('print_frame').contentWindow;
          pri.document.open();
          pri.document.write(content.innerHTML);
          pri.document.close(); */
          // pri.focus();
          // pri.print();
          const div = document.getElementById('print-checklist-report');
          // Create a window object.
          const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
          document.title = 'Inspection Checklist Report';
          win.document.write(div.outerHTML); // Write contents in the new window.
          win.document.close();
          dispatch(resetInspectionOrders());
          setEquipmentId(false);
          setEquipmentId(false);
          changeDate(false);
          setDatesValue([]);
          setDownloadModal(false);
        }, 1000);
      } else {
        exportTableToExcel('export-checklist-report', 'Inspection Checklist Report');
        setEquipmentId(false);
        setEquipmentId(false);
        changeDate(false);
        setDatesValue([]);
        dispatch(resetInspectionOrders());
        setDownloadModal(false);
      }
    }
  }, [inspectionOrders]);

  useEffect(() => {
    if (ppmDetail && ppmDetail.data && ppmDetail.data.length) {
      const fields = ['id', 'path_name'];
      const otherFieldName = 'id';
      const otherFieldValue = ppmDetail.data[0].location_ids;
      dispatch(getExtraSelection(companies, appModels.SPACE, limit, offset, fields, false, otherFieldName, otherFieldValue));
      const eqfields = ['id', 'name'];
      const searchValueMultiple = `[["company_id","in",[${companies}]],["id","in",[${ppmDetail.data[0].equipment_ids}]]]`;
      dispatch(getExtraSelectionMultiple(companies, appModels.EQUIPMENT, limit, offset, eqfields, searchValueMultiple));
    }
  }, [ppmDetail]);

  useEffect(() => {
    if (ppmDetail && ppmDetail.data && ppmDetail.data.length && ppmDetail.data[0].task_id) {
      const id = ppmDetail.data[0].task_id[0];
      dispatch(getOperationData(id, appModels.TASK));
    }
  }, [ppmDetail]);

  useEffect(() => {
    if (ppmOperationData && ppmOperationData.data && ppmOperationData.data.length) {
      dispatch(getTaskChecklists(companies, appModels.TASKCHECKLIST, false, ppmOperationData.data[0].check_list_ids));
    }
  }, [ppmOperationData]);

  const checklistOperation = taskCheckLists && taskCheckLists.data && taskCheckLists.data.length > 0 ? getDefaultNoValue(extractTextObject(taskCheckLists.data[0].check_list_id)) : ' - ';

  const type = ppmDetail && ppmDetail.data && ppmDetail.data.length > 0 ? getDefaultNoValue(getppmForLabel(ppmDetail.data[0].category_type)) : ' - ';

  let typeName = ' - ';
  let typeEqId = false;
  let typeSpId = false;
  if (listDataMultipleInfo && listDataMultipleInfo.data) {
    typeName = listDataMultipleInfo.data.length > 0 ? getDefaultNoValue(listDataMultipleInfo.data[0].name) : ' - ';
    typeEqId = listDataMultipleInfo.data.length > 0 ? getDefaultNoValue(listDataMultipleInfo.data[0].id) : ' - ';
  }

  if (listDataInfo && listDataInfo.data) {
    typeName = listDataInfo.data.length > 0 ? getDefaultNoValue(listDataInfo.data[0].path_name) : ' - ';
    typeSpId = listDataInfo.data.length > 0 ? getDefaultNoValue(listDataInfo.data[0].id) : ' - ';
  }

  const showDetailsView = (equipment, space, dType) => {
    setSpaceId(false);
    setEquipmentId(false);
    setDownloadType(dType);
    setSpaceId(space || (typeSpId ? [typeSpId, typeName] : false));
    setEquipmentId(equipment || (typeEqId ? [typeEqId, typeName] : false));
    setDownloadModal(true);
  };

  const showDetailsViewAsset = (equipment, space, dType) => {
    setEquipmentId(false);
    setSpaceId(space);
    setDownloadType(dType);
    setEquipmentId(equipment);
    setDownloadModal(true);
  };

  const showDetailsViewSpace = (equipment, space, dType) => {
    setSpaceId(false);
    setSpaceId(space);
    setEquipmentId(equipment);
    setDownloadType(dType);
    setDownloadModal(true);
  };

  const closeReport = () => {
    dispatch(resetInspectionOrders());
    setEquipmentId(false);
    setEquipmentId(false);
    changeDate(false);
    setDatesValue([]);
    setDownloadModal(false);
  };

  const downloadReport = () => {
    if ((userInfo && userInfo.data && userInfo.data.company) && (date && date.length) && taskId) {
      dispatch(getTypeId({
        preventiveFor: 'e',
        scheduleValue: { id: extractIdObject(taskId), name: extractTextObject(taskId) },
        date,
        spaceValue: spaceId ? { id: extractIdObject(spaceId), name: extractTextObject(spaceId) } : false,
        equipValue: equipmentId ? { id: extractIdObject(equipmentId), name: extractTextObject(equipmentId) } : false,
      }));
      let start = '';
      let end = '';
      const preventiveFor = equipmentId ? 'e' : 'ah';
      const assetId = equipmentId ? [extractIdObject(equipmentId)] : [extractIdObject(spaceId)];
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0], date[1] )
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }

      dispatch(getInspectionOrders(start, end, preventiveFor, assetId));
    }
  };

  const getTableRow = (assetData, i) => (
    <tr key={i}>
      <td className="p-2">
        {assetData[i].equipment_id
          ? getDefaultNoValue(extractTextObject(assetData[i].equipment_id)) : assetData[i].location_id
            ? getDefaultNoValue(extractTextObject(assetData[i].location_id)) : typeName}
      </td>
      <td className="p-2">{assetData[i].category_type ? getDefaultNoValue(getppmForLabel(assetData[i].category_type)) : type}</td>
      <td className="p-2 cursor-pointer">{getDefaultNoValue(extractTextObject(assetData[i].check_list_id))}</td>
      {isInspection && (
        <td className="p-2">
          <Tooltip title="Print Inspection Report">
            <FontAwesomeIcon
              aria-hidden
              className="ml-2 cursor-pointer"
              size="lg"
              icon={faFilePdf}
              onClick={() => showDetailsView(assetData[i].equipment_id, assetData[i].location_id, 'pdf')}
            />
          </Tooltip>
          <Tooltip title="Export Inspection Report">
            <FontAwesomeIcon
              aria-hidden
              className="ml-2 cursor-pointer"
              size="lg"
              icon={faFileExcel}
              onClick={() => showDetailsView(assetData[i].equipment_id, assetData[i].location_id, 'excel')}
            />
          </Tooltip>
        </td>
      )}
    </tr>
  );
  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        getTableRow(assetData, i),
      );
    }
    return tableTr;
  }

  const getAssetTableRow = (assetData, i, eqId) => (
    <tr key={i}>
      <td className="p-2">
        {getDefaultNoValue(assetData[i].name)}
      </td>
      <td className="p-2">Equipment</td>
      <td className="p-2">{checklistOperation}</td>
      {isInspection && (
        <td className="p-2">
          <Tooltip title="Print Inspection Report">
            <FontAwesomeIcon
              aria-hidden
              className="ml-2 cursor-pointer"
              size="lg"
              icon={faFilePdf}
              onClick={() => showDetailsViewAsset(eqId, false, 'pdf')}
            />
          </Tooltip>
          <Tooltip title="Export Inspection Report">
            <FontAwesomeIcon
              aria-hidden
              className="ml-2 cursor-pointer"
              size="lg"
              icon={faFileExcel}
              onClick={() => showDetailsViewAsset(eqId, false, 'excel')}
            />
          </Tooltip>
        </td>
      )}
    </tr>
  );
  function getAssetRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      const eqId = [assetData[i].id, assetData[i].name];
      tableTr.push(getAssetTableRow(assetData, i, eqId));
    }
    return tableTr;
  }

  const getSpaceTableRow = (assetData, i, spId) => (
    <tr key={i}>
      <td className="p-2">
        {getDefaultNoValue(assetData[i].path_name)}
      </td>
      <td className="p-2">Space</td>
      <td className="p-2">{checklistOperation}</td>
      {isInspection && (
        <td className="p-2">
          <Tooltip title="Print Inspection Report">
            <FontAwesomeIcon
              aria-hidden
              className="ml-2 cursor-pointer"
              size="lg"
              icon={faFilePdf}
              onClick={() => showDetailsViewSpace(false, spId, 'pdf')}
            />
          </Tooltip>
          <Tooltip title="Export Inspection Report">
            <FontAwesomeIcon
              aria-hidden
              className="ml-2 cursor-pointer"
              size="lg"
              icon={faFileExcel}
              onClick={() => showDetailsViewSpace(false, spId, 'excel')}
            />
          </Tooltip>
        </td>
      )}
    </tr>
  );
  function getSpaceRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      const spId = [assetData[i].id, assetData[i].path_name];
      tableTr.push(getSpaceTableRow(assetData, i, spId));
    }
    return tableTr;
  }

  const onDateRangeChange = (dates) => {
    changeDate(dates);
  };

  const loading = ((ppmDetail && ppmDetail.loading) || (ppmOperationData && ppmOperationData.loading) || (taskCheckLists && taskCheckLists.loading));
  const assetsloading = ((ppmDetail && ppmDetail.loading) || (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataInfo && listDataInfo.loading));

  return (
    <>
      <div>
        {(loading || assetsloading) && (
          <div className="text-center">
            <Loader />
          </div>
        )}
      </div>

      <Row>
        {(isTask && equipmentsLength <= 1 && spacesLength <= 1) && (
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 assets-list-tab bg-white comments-list thin-scrollbar">
          {!loading && !assetsloading && (ppmDetail && ppmDetail.data && ppmDetail.data.length > 0 && ppmDetail.data[0].task_id) && (taskCheckLists && taskCheckLists.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2">
                    <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('equipment_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Name
                    </span>
                  </th>
                  <th className="p-2">
                    <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('category_type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Type
                    </span>
                  </th>
                  <th className="p-2">
                    <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('check_list_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Checklist
                    </span>
                  </th>
                  {isInspection && (
                  <th className="p-2 min-width-100">
                    Action
                  </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {getRow(taskCheckLists && taskCheckLists.data ? taskCheckLists.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {!loading && (
            <>
              <DetailViewFormat detailResponse={taskCheckLists} />
              <DetailViewFormat detailResponse={ppmOperationData} />
            </>
          )}
        </Col>
        )}
        {(equipmentsLength > 1 || spacesLength > 1 || !isTask) && (
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white assets-list-tab comments-list thin-scrollbar">
          {!loading && !assetsloading && ((listDataMultipleInfo && listDataMultipleInfo.data) || (listDataInfo && listDataInfo.data)) && (
          <div>
            <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2">
                    <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Name
                    </span>
                  </th>
                  <th className="p-2">
                    <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('category_type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Type
                    </span>
                  </th>
                  <th className="p-2">
                    <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('Checklist'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Checklist
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getAssetRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                {getSpaceRow(listDataInfo && listDataInfo.data ? listDataInfo.data : [])}
              </tbody>
            </Table>
            {/*  <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                  <th className="p-2 min-width-100">
                    Type
                  </th>
                  <th className="p-2 min-width-160">
                    Checklist
                  </th>
                </tr>
              </thead>
              <tbody>
                {getAssetRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                {getSpaceRow(listDataInfo && listDataInfo.data ? listDataInfo.data : [])}
              </tbody>
          </Table> */}
                <hr className="m-0" />
              </div>
            )}
            {!assetsloading && listDataInfo && !listDataInfo.data && (
              <>
                {(listDataMultipleInfo && listDataMultipleInfo.err) && (listDataMultipleInfo && listDataMultipleInfo.err) && (
                  <DetailViewFormat detailResponse={listDataMultipleInfo} />
                )}
              </>
            )}
            {!assetsloading && listDataMultipleInfo && !listDataMultipleInfo.data && (
              <>
                {(listDataInfo && listDataInfo.err) && (listDataInfo && listDataInfo.err) && (
                  <DetailViewFormat detailResponse={listDataInfo} />
                )}
              </>
            )}
          </Col>
        )}
      </Row>
      <Col md="12" sm="12" lg="12" className="d-none">
        <ChecklistPrint typeId={typeId} inspectionOrders={inspectionOrders} />
      </Col>
      <Modal size="lg" className="border-radius-50px modal-dialog-centered" isOpen={downloadModal}>
        <ModalHeaderComponent title="Download Inspection Report" imagePath={false} closeModalWindow={() => closeReport()} />
        <ModalBody className="mt-0 pt-0">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12" className="p-1">
              <Row>
                <Col sm="12" md="3" lg="3" xs="12" />
                <Col sm="12" md="8" lg="8" xs="12">
                  <h6>
                    Maintenance Operation :
                    {'    '}
                    {extractTextObject(taskId)}
                  </h6>
                  {!taskId && (
                    <FormFeedback className="text-danger m-1 font-tiny display-block">Maintenance Operation Not Found.</FormFeedback>
                  )}
                </Col>
                <Col sm="12" md="1" lg="1" xs="12" />
              </Row>
              <Row>
                <Col sm="12" md="3" lg="3" xs="12" />
                <Col sm="12" md="8" lg="8" xs="12">
                  <h6>
                    {equipmentId ? 'Equipment :' : 'Space :'}
                    {'    '}
                    {equipmentId ? extractTextObject(equipmentId) : extractTextObject(spaceId)}
                  </h6>
                </Col>
                <Col sm="12" md="1" lg="1" xs="12" />
              </Row>
              {!isData && (
                <>
                  <Row>
                    <Col sm="12" md="3" lg="3" xs="12" />
                    <Col sm="12" md="6" lg="6" xs="12">
                      <Label className="mb-0">Date Range</Label>
                      <div>
                        <RangePicker
                          onCalendarChange={(val) => { setDatesValue(val); changeDate(val)}}
                          onChange={onDateRangeChange}
                          disabledDate={disabledDate}
                          value={date}
                          format="DD-MM-y"
                          size="small"
                          className="mt-1 mx-wd-220"
                        />
                        {!date && (
                          <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
                        )}
                      </div>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" />
                  </Row>
                </>
              )}
              {inspectionOrders && inspectionOrders.loading && (
                <div className="mb-3 mt-3 text-center">
                  <Loader />
                </div>
              )}
              {(inspectionOrders && inspectionOrders.err) && (
                <ErrorContent errorTxt={generateErrorMessage(inspectionOrders)} />
              )}
              {(isError) && (
                <ErrorContent errorTxt="No Data Found" />
              )}
              {!isData && (
                <div className="float-right mt-2 mr-5">
                  <Button
                    disabled={!date || (inspectionOrders && inspectionOrders.loading) || !taskId}
                    type="submit"
                    size="sm"
                    onClick={() => downloadReport()}
                     variant="contained"
                  >
                    Submit
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

Assets.propTypes = {
  isInspection: PropTypes.bool,
};
Assets.defaultProps = {
  isInspection: false,
};

export default Assets;
