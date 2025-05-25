/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent, DialogContentText, } from '@mui/material';
import MuiTooltip from '@shared/muiTooltip';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';
import MailsLogs from '@shared/mailsLogs';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import { getCustomStatusName } from '../utils/utils';

const LogNotes = () => {
  const { workPermitDetail, workPermitConfig } = useSelector((state) => state.workpermit);
  const { userInfo } = useSelector((state) => state.user);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  const [showLogs, setShowLogs] = useState(false);
  const [currentLog, setCurrentLog] = useState(false);

  const onMailLogsView = (id) => {
    setCurrentLog(id);
    setShowLogs(true);
  };

  const onClose = () => {
    setCurrentLog(false);
    setShowLogs(false);
  };

  const loading = workPermitDetail && workPermitDetail.loading;
  const isErr = workPermitDetail && workPermitDetail.err;
  const inspDeata = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length ? workPermitDetail.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.status_logs && inspDeata.status_logs.length > 0);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(getCustomStatusName(assetData[i].from_state, wpConfig))}</td>
          <td className="p-2">
            <div className="display-flex-div content-center">
              <p className="m-0">
                {getDefaultNoValue(getCustomStatusName(assetData[i].to_state, wpConfig))}
              </p>
              <MuiTooltip title="Email Logs">
                <p className="m-0 text-info cursor-pointer" aria-hidden onClick={() => onMailLogsView(assetData[i].id)}>
                  <FontAwesomeIcon
                    className="ml-2"
                    icon={faEnvelope}
                  />

                </p>
              </MuiTooltip>
            </div>
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].performed_by, 'name')}</td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].performed_on, userInfo, 'datetime'))}
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].description)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="pr-3 pl-3 pb-3 pt-2 products-list-tab max-form-content thin-scrollbar product-orders">
        {isChecklist && (
          <div>
            <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    From State
                  </th>
                  <th className="p-2 min-width-160">
                    To State
                  </th>
                  <th className="p-2 min-width-160">
                    Performed By
                  </th>
                  <th className="p-2 min-width-160">
                    Performed On
                  </th>
                  <th className="p-2 min-width-160">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(workPermitDetail.data.length > 0 ? workPermitDetail.data[0].status_logs : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={workPermitDetail} />
        {!isErr && inspDeata && !isChecklist && !loading && (
          <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
      <Dialog size="xl" fullWidth open={showLogs}>
        <DialogHeader fontAwesomeIcon={faEnvelope} title={"Email Logs"} imagePath={false} onClose={onClose} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <MailsLogs modelId={inspDeata ? inspDeata.id : false} statusId={currentLog} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Row>
  );
};

export default LogNotes;
