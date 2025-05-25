/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import workordersWhite from '@images/icons/workorderTransparent.svg';
import Loader from '@shared/loading';
import {
  getWorkorderFilter,
} from '../../workorders/workorderService';
import './style.scss';
import {
  getPreventiveOrder,
} from '../ppmService';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const Summary = () => {
  const {
    ppmDetail, orderPreventive,
  } = useSelector((state) => state.ppm);
  const { userInfo } = useSelector((state) => state.user);
  const [addLink, setAddLink] = useState(false);
  const dispatch = useDispatch();

  const onLoadWorkorderId = (WorkorderId) => {
    const filters = [{
      key: 'id', value: WorkorderId, label: 'ID', type: 'id',
    }];
    const filterValues = {
      statusValues: [],
      teams: [],
      priorities: [],
      customFilters: filters,
    };
    dispatch(getWorkorderFilter(filterValues));
    setAddLink(true);
  };

  useEffect(() => {
    if (ppmDetail && ppmDetail.data && ppmDetail.data.length > 0) {
      const ids = ppmDetail.data.length > 0 ? ppmDetail.data[0].id : [];
      dispatch(getPreventiveOrder(ids, appModels.ORDER));
    }
  }, [ppmDetail]);

  const ppmSummary = orderPreventive && (orderPreventive.data && orderPreventive.data.length > 0) ? orderPreventive.data : '';

  const ppmFor = ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0) ? ppmDetail.data[0].category_type : '';

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (ppmDetail && ppmDetail.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (ppmDetail && ppmDetail.err) ? generateErrorMessage(ppmDetail) : userErrorMsg;

  if (addLink) {
    return (<Redirect to="/maintenance/workorders" />);
  }

  return (
    <>
      {ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0) && (
      <div className="summary-list thin-scrollbar card border-0">
        {ppmSummary && ppmSummary.map((actions) => (
          <Row key={actions.id} className="m-0">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue mb-2">
                <CardBody className="pt-1 pb-1">
                  <Row className="pb-2 pt-1">
                    <Col md="8" sm="8" xs="8" lg="8">
                      {(ppmFor === 'e') && (
                        <span className="font-weight-800 mb-2">{actions.equipment_id && actions.equipment_id[1] ? actions.equipment_id[1] : ''}</span>
                      )}
                      {(ppmFor === 'ah') && (
                        <span className="font-weight-800 mb-2">{actions.space_block_id && actions.space_block_id[1] ? actions.space_block_id[1] : ''}</span>
                      )}
                      <br />
                      <div className="font-tiny font-weight-400 mt-2 ml-2">Location</div>
                      {(ppmFor === 'e') && (
                      <span className="font-tiny font-weight-800 ml-3">{actions.equipment_location_id && actions.equipment_location_id[1] ? actions.equipment_location_id[1] : ''}</span>
                      )}
                      {(ppmFor === 'ah') && (
                        <span className="font-tiny font-weight-800 ml-3">{actions.asset_id && actions.asset_id[1] ? actions.asset_id[1] : ''}</span>
                      )}
                    </Col>
                    <>
                      <Col md="4" xs="4" sm="4" lg="4">
                        <Button
                          type="button"
                          onClick={() => onLoadWorkorderId(actions.id)}
                          className={actions.id
                            ? 'mb-2 mt-2 pt-1 pb-1 pr-2 pl-2 btn-navyblue font-11 text-left textwrapdots w-100'
                            : 'mb-2 mt-2 pt-1 pb-1 pr-2 pl-2 btn-default font-11 text-left textwrapdots w-100'}
                          disabled={!actions.id}
                        >
                          <img src={workordersWhite} className="mr-1" alt="workorder" height="17" width="15" />
                          Open Work Order
                        </Button>
                      </Col>
                    </>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ))}
      </div>
      )}
      {(orderPreventive && orderPreventive.loading) && !loading && (
      <Loader />
      )}
      {(orderPreventive && orderPreventive.err) && (
      <ErrorContent errorTxt={generateErrorMessage(orderPreventive)} />
      )}
      {loading && (
      <div className="mb-2 mt-3 p-5" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {((ppmDetail && ppmDetail.err) || isUserError) && (
      <ErrorContent errorTxt={errorMsg} />
      )}
    </>
  );
};
export default Summary;
