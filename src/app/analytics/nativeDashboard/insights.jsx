/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { getTotal } from '../utils/utils';
import {
  newpercalculate,
} from '../../util/staticFunctions';

const Insights = () => {
  const { nativeDashboard } = useSelector((state) => state.analytics);

  const total = getTotal(nativeDashboard && nativeDashboard.data ? nativeDashboard.data : []);
  return (
    <>
      <Row className="m-0">
        {
          (nativeDashboard && nativeDashboard.data) && nativeDashboard.data.map((actions) => (
            actions.ks_dashboard_item_type === 'ks_tile' && (
              <Col sm="12" md="12" lg="3" xs="12" className="p-4" key={actions.name}>
                <Card
                  className="border-0 bg-med-blue h-100 text-center"
                >
                  <CardTitle className="m-0 pt-4">
                    <h6 className="pb-3 font-weight-800">
                      {actions.name}
                    </h6>
                  </CardTitle>
                  <Tooltip title={`${actions.name}(${actions.datasets && actions.datasets[0] ? actions.datasets && actions.datasets[0] : 0})`}>
                    <CardBody id="Tooltip-Insights" className="pb-4 pl-4 pr-4 pt-0">
                      <div className="tileChart">
                        <CircularProgressbarWithChildren
                          value={newpercalculate(total, actions.datasets)}
                          strokeWidth={9}
                          styles={buildStyles({
                            textColor: '#3a4354',
                            backgroundColor: '#c1c1c1',
                            pathColor: '#4d626e',
                          })}
                        >
                          <div className="m-1 font-size-13">
                            <strong>{parseFloat(actions.datasets).toFixed(0)}</strong>
                          </div>
                          <div className="font-11 text-grayish-blue">
                            <strong>{`${newpercalculate(total, actions.datasets)}%`}</strong>
                          </div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </CardBody>
                  </Tooltip>
                </Card>
                <br />
              </Col>
            )
          ))
        }
      </Row>
    </>
  );
};

export default Insights;
