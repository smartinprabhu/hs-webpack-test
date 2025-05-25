/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, Col, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getSpaceChilds, getFloorChilds, storeSelectedSpace } from '../equipmentService';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const SpaceSelection = (props) => {
  const { data, oldSpaceId } = props;
  const dispatch = useDispatch();
  const [collapses, setCollapses] = useState([]);
  const [roomCollapses, setRoomCollapses] = useState([]);
  const [viewId, setViewId] = useState(0);
  const [oldId, setOldId] = useState(0);
  const [spaceName, setSpaceName] = useState('');
  const [loadChilds, setLoadChilds] = useState(false);
  const [spaceType, setSpaceType] = useState('Floor');

  const { userInfo } = useSelector((state) => state.user);

  const { spaceChilds, getFloorsInfo, floorChilds } = useSelector((state) => state.equipment);

  useEffect(() => {
    setOldId(oldSpaceId);
  }, [oldSpaceId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (collapses.length === 0) && (data && data.length > 0)) {
      setCollapses(() => [data[0].id]);
      dispatch(getFloorChilds(userInfo.data.company.id, appModels.SPACE, data[0].id));
    }
  }, [data]);

  useEffect(() => {
    if (userInfo && userInfo.data && loadChilds) {
      if (spaceType === 'Room') {
        dispatch(getSpaceChilds(userInfo.data.company.id, appModels.SPACE, viewId));
      }
      if (spaceType === 'Floor') {
        dispatch(getFloorChilds(userInfo.data.company.id, appModels.SPACE, viewId));
      }
    }
  }, [userInfo, spaceType, viewId, loadChilds]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId && !loadChilds) {
      const selectedSpace = { id: viewId, name: spaceName };
      dispatch(storeSelectedSpace(selectedSpace));
    }
  }, [userInfo, viewId, loadChilds]);

  const handleCollapseChange = (id, type) => {
    setLoadChilds(true);
    if (!collapses.includes(id)) {
      if (type === 'Floor') {
        setCollapses([id]);
      }
      if (type === 'Room') {
        setRoomCollapses([id]);
      }
      setViewId(id);
      setSpaceType(type);
    } else {
      if (type === 'Floor') {
        setCollapses([]);
        setRoomCollapses([]);
      }
      if (type === 'Room') {
        setRoomCollapses([]);
      }
    }
  };
  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (getFloorsInfo && getFloorsInfo.err) ? generateErrorMessage(getFloorsInfo) : userErrorMsg;

  return (
    <Card className="p-1 bg-lightblue">
      <CardBody className="pt-0 mt-2 activity-list position-relative thin-scrollbar">
        {((getFloorsInfo && getFloorsInfo.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {data && data.map((item) => (
          <div key={item.id} className="mb-1 mt-1">
            <Row>
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p
                  aria-hidden="true"
                  className="ml-3 mb-0 mt-0 font-weight-800 collapse-heading cursor-pointer"
                >
                  {item.space_name}
                </p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon
                  className="mr-2 cursor-pointer"
                  onClick={() => handleCollapseChange(item.id, 'Floor')}
                  size="sm"
                  icon={collapses.some((selectedValue) => selectedValue === item.id) ? faChevronUp : faChevronRight}
                />
              </Col>
            </Row>
            <Collapse isOpen={collapses.some((selectedValue) => selectedValue === item.id)}>
              {((floorChilds && floorChilds.loading) || isUserLoading) && (
              <div className="mb-2 mt-4">
                <Loader />
              </div>
              )}
              {(floorChilds && floorChilds.data) && floorChilds.data.map((room) => (
                room.id !== oldId && (
                <div key={room.id} className="mb-2 mt-2">
                  <Row>
                    <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                      <p
                        className={(room.id === viewId) && !loadChilds ? 'ml-3 mb-0 mt-0 p-1 collapse-heading font-weight-800 display-table badge-primary cursor-pointer'
                          : ' collapse-heading ml-3 mb-0 mt-0 font-weight-500 cursor-pointer'}
                        aria-hidden="true"
                        onClick={() => { setViewId(room.id); setSpaceName(room.path_name); setLoadChilds(false); }}
                      >
                        {room.space_name}
                      </p>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                      <FontAwesomeIcon
                        className="mr-2 cursor-pointer"
                        onClick={() => handleCollapseChange(room.id, 'Room')}
                        size="sm"
                        icon={roomCollapses.some((selectedValue) => selectedValue === room.id) ? faChevronUp : faChevronRight}
                      />
                    </Col>
                  </Row>
                  <Collapse isOpen={roomCollapses.some((selectedValue) => selectedValue === room.id)}>
                    <div className="ml-2">
                      {(spaceChilds && spaceChilds.loading) && (
                      <div className="mb-2 mt-4">
                        <Loader />
                      </div>
                      )}
                      {(spaceChilds && spaceChilds.data) && spaceChilds.data.map((space) => (
                        space.id !== oldId && (
                        <p
                          key={space.id}
                          aria-hidden="true"
                          className={space.id === viewId ? 'p-1 m-0 font-weight-800 display-table badge-primary cursor-pointer' : 'p-1 m-0 font-weight-500 cursor-pointer'}
                          onClick={() => { setViewId(space.id); setSpaceName(space.path_name); setSpaceType('Space'); setLoadChilds(false); }}
                        >
                          {space.name}
                        </p>
                        )
                      ))}
                      {(spaceChilds && spaceChilds.err) && (
                      <ErrorContent errorTxt={generateErrorMessage(spaceChilds)} />
                      )}
                    </div>
                  </Collapse>
                </div>
                )
              ))}
              {(floorChilds && floorChilds.err) && (
              <ErrorContent errorTxt={generateErrorMessage(floorChilds)} />
              )}
            </Collapse>
          </div>
        ))}
        {((getFloorsInfo && getFloorsInfo.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
        )}
      </CardBody>
    </Card>
  );
};

SpaceSelection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      space_name: PropTypes.string,
    }),
  ).isRequired,
  oldSpaceId: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        space_name: PropTypes.string,
      }),
    ),
    PropTypes.shape({
      id: PropTypes.number,
      space_name: PropTypes.string,
    }),
  ]).isRequired,
};

export default SpaceSelection;
