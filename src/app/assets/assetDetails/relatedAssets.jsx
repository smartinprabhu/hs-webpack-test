/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Collapse,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp, faChevronDown, faCircle,
} from '@fortawesome/free-solid-svg-icons';
import 'react-vertical-timeline-component/style.min.css';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getReleatedAssets } from '../equipmentService';
import './style.scss';
import { getEquipmentStateText } from '../utils/utils';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const RelatedAssets = (props) => {
  const { ids, name } = props;
  const dispatch = useDispatch();
  const [isCollapse, setCollapse] = useState(true);
  const { releatedAssets } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (ids) {
      dispatch(getReleatedAssets(appModels.EQUIPMENT, ids));
    }
  }, [ids]);

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="ml-3">
          <Row>
            <Col md="8" sm="8" xs="8" lg="8">
              <p className="m-0 font-weight-800">
                <FontAwesomeIcon className="text-primary mr-1" size="sm" icon={faCircle} />
                {' '}
                {name}
                <FontAwesomeIcon className="ml-3 cursor-pointer" onClick={() => setCollapse(!isCollapse)} size="sm" icon={isCollapse ? faChevronUp : faChevronDown} />
              </p>
            </Col>
          </Row>
          <Collapse isOpen={isCollapse}>
            <div className="p-2 ml-2">
              {(releatedAssets && releatedAssets.data) && releatedAssets.data.map((item) => (
                <p className="mb-2" key={item.equipment_number}>
                  <small>
                    {item.name}
                    {' '}
                    (
                    {getEquipmentStateText(item.state)}
                    )
                  </small>
                </p>
              ))}
              {releatedAssets && releatedAssets.loading && (
                <Loader />
              )}
              {(releatedAssets && releatedAssets.err) && (
              <ErrorContent errorTxt={generateErrorMessage(releatedAssets)} />
              )}
            </div>
          </Collapse>
        </Col>
      </Row>

    </>
  );
};

RelatedAssets.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
};

export default RelatedAssets;
