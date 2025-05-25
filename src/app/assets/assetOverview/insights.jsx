/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import assetIcon from '@images/icons/assetBlue.svg';
import Loader from '@shared/loading';
import { getTotal } from '../utils/utils';
import './assetOverview.scss';
import { getAssetDashboard, getEquipmentFilters } from '../equipmentService';
import {
  newpercalculate,
} from '../../util/staticFunctions';
import {
  truncate, generateErrorMessage,
  generateArrayFromValue,
} from '../../util/appUtils';
import { setCurrentTab } from '../../inventory/inventoryService';
import insightData from './data/insights.json';

const Insights = (props) => {
  const { menuType } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const isITAsset = !!(menuType && menuType === 'ITAsset');
  const dashboardName = isITAsset ? 'IT Asset Dashboard' : 'Assets';
  const [values, setValue] = useState([]);

  const { assetDashboard } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getAssetDashboard(dashboardName));
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(setCurrentTab(''));
    dispatch(getEquipmentFilters([]));
  }, []);

  const onLoadAssets = (data) => {
    if (data.tags && data.tags.length && data.label) {
      data.tags = data.tags.filter((tag) => tag.label === data.label)
    }
    if (data) {
      setValue(data.tags);
      if (data.type === 'Components') {
        dispatch(setCurrentTab('Components'));
        dispatch(getEquipmentFilters(data.tags));
      } else if (data.type === 'Accessories') {
        dispatch(setCurrentTab('Accessories'));
        dispatch(getEquipmentFilters(data.tags));
      } else if (data.type === 'Equipments') {
        dispatch(setCurrentTab('Equipments'));
        dispatch(getEquipmentFilters(data.tags));
      } else {
        dispatch(getEquipmentFilters(data.tags));
      }
    }
  };

  if (values && values.length && !isITAsset) {
    return (<Redirect to="/assets/equipments" />);
  }
  if (values && values.length && isITAsset) {
    return (<Redirect to="/itasset/equipments" />);
  }

  const total = getTotal(assetDashboard && assetDashboard.data ? assetDashboard.data : [], isITAsset);
  const loadInsights = isITAsset ? insightData.dashboardStatus : insightData.dashboardTiles;

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (assetDashboard && assetDashboard.err) ? generateErrorMessage(assetDashboard) : userErrorMsg;

  const gridData = generateArrayFromValue(assetDashboard && assetDashboard.data ? assetDashboard.data : [], 'ks_dashboard_item_type', 'ks_tile');
  const gridCards = gridData.sort((a, b) => a.sequence - b.sequence);

  return (
    <>
      <Row className="m-0 pl-3 pt-2 itasset-title">
        <h6 className="mt-2 ml-2">
          {' '}
          <img src={assetIcon} alt="assets" className="mr-2" height="20" width="20" />
          ASSETS
        </h6>
      </Row>
      <Row className="m-0 pt-2 pl-3 pr-3 pb-3 insights-card">
        {gridCards && gridCards.map((actions) => (
          <Col sm="12" md="12" lg="3" xs="12" className="p-1" key={actions.name}>
            <Card
              className="border-0 bg-med-blue h-100 text-center"
            >
              <CardTitle className="m-0 pt-4">
                <h6 className="pb-3 font-weight-800">
                  {actions.name}
                </h6>
              </CardTitle>
              <Tooltip title={`${actions.name}(${actions.datasets && actions.datasets[0] ? actions.datasets && actions.datasets[0] : 0})`}>
                <CardBody id="Tooltip-Insights" className="pb-1 pl-5 pr-5 pt-0">
                  <CircularProgressbarWithChildren
                    value={actions.datasets && actions.code && actions.code !== 'TA' ? newpercalculate(total, actions.datasets) : '100'}
                    strokeWidth={9}
                    styles={buildStyles({
                      textColor: '#3a4354',
                      backgroundColor: '#c1c1c1',
                      pathColor: '#4d626e',
                    })}
                  >
                    <div className="m-1 font-size-13">
                      <strong>{actions.datasets}</strong>
                    </div>
                    {actions.datasets && actions.code && actions.code !== 'TA' ? (
                      <div className="font-11 text-grayish-blue">
                        <strong>{`${newpercalculate(total, actions.datasets)}%`}</strong>
                      </div>
                    ) : ''}
                  </CircularProgressbarWithChildren>
                </CardBody>
              </Tooltip>
              <CardFooter className="bg-med-blue border-0 pt-0">
                {actions.datasets && actions.datasets[0] !== 0 && actions.code && actions.code !== 'TA' ? (
                  <Button
                     variant="contained"
                    size="sm"
                    onClick={() => onLoadAssets(loadInsights[actions.code] ? loadInsights[actions.code] : false)}
                    className="bg-white  text-dark rounded-pill  mb-1"
                  >
                    <small className="text-center font-weight-800">
                      Go to
                      {' '}
                      {truncate(actions.name, 10)}
                    </small>
                    <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowRight} />
                  </Button>
                )
                  : (
                    actions.code !== 'TA'
                      ? (
                        <Button  variant="contained" size="sm" disabled className="bg-white  text-dark rounded-pill  mb-1">
                          <small className="text-center font-weight-800">
                            Go to
                            {' '}
                            {truncate(actions.name, 10)}
                          </small>
                          <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowRight} />
                        </Button>
                      ) : (<p />)
                  )}
              </CardFooter>
            </Card>
            <br />
          </Col>
        ))}
      </Row>
      {((assetDashboard && assetDashboard.loading) || isUserLoading) && (
        <div className="mb-4 mt-2">
          <Loader />
        </div>
      )}
      {((assetDashboard && assetDashboard.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
    </>
  );
};

Insights.propTypes = {
  menuType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
Insights.defaultProps = {
  menuType: false,
};

export default Insights;
