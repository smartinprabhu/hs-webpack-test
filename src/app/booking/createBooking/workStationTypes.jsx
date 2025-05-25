/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import { apiURL } from '../../util/appUtils';

import './shifts.scss';
import {
  getCategoriesOfWorkStations,
} from '../bookingService';

const appConfig = require('@app/config/appConfig').default;

const momentRange = extendMoment(moment);

const WorkStationTypes = ({ setWorkStationType, workStationType, changeDate }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.bookingInfo);

  useEffect(() => {
    dispatch(getCategoriesOfWorkStations());
  }, []);

  useEffect(() => {
    changeDate(momentRange.range(moment().startOf('day')._d, moment().startOf('day')._d));
  }, []);

  return (
    <>
      <Row className="m-0">
        {categories && categories.data && categories.data.length > 0 && (
          categories.data.map((workspaceType) => (
            <React.Fragment key={`${workspaceType.id}`}>
              <Col
                sm="12"
                md="12"
                lg="2"
                className={
                  `bg-azure mx-2 px-0 mt-2 text-center cursor-pointer ${workspaceType.id === workStationType.id ? 'border-color-manatee-1px border-radius-2px b-r-sm' : ''}`
                }
                onClick={() => setWorkStationType(workspaceType)}
              >
                <div>
                  <img src={`${apiURL}${workspaceType.file_path}`} height="90" width="90" alt="workspace" />
                </div>
                <h4 className="ws-name mb-3">
                  {workspaceType.name}
                </h4>
              </Col>
            </React.Fragment>
          ))
        )}
      </Row>
      {categories && categories.loading && (
        <div className="text-center" data-testid="loader">
          <Loading />
        </div>
      )}

      {categories && categories.err && categories.err.error && categories.err.error.message && (
        <SuccessAndErrorFormat response={categories} />
      )}
    </>
  );
};

WorkStationTypes.propTypes = {
  setWorkStationType: PropTypes.func,
  changeDate: PropTypes.func,
  workStationType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ]),
};

WorkStationTypes.defaultProps = {
  setWorkStationType: () => { },
  workStationType: undefined,
  changeDate: () => { },
};
export default WorkStationTypes;
