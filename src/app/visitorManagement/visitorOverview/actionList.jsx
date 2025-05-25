/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';

import actionsBlueIcon from '@images/icons/actionsBlue.svg';
import eyeBlueIcon from '@images/icons/eyeBlue.svg';
import searchBlueIcon from '@images/icons/searchBlue.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import './workordersOverview.scss';
import {
  getVisitorRequestFilters, getVisitorRequestCount,
} from '../visitorManagementService';
import actionList from './data/actions.json';
import { noSpecialChars } from '../../util/appUtils';

const faIcons = {
  faEye: eyeBlueIcon,
  faSearch: searchBlueIcon,
};

const appModels = require('../../util/appModels').default;

const ActionList = () => {
  const dispatch = useDispatch();
  const [isLookup, showLookup] = useState(false);
  const [isRedirect, setRedirect] = useState(false);
  const [id, setId] = useState('');

  const onIDChange = (e) => {
    if (e.target.value && e.target.value.match('^[a-zA-Z0-9 ]*$') != null) {
      setId(e.target.value);
    } else {
      setId('');
    }
  };

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const filterValues = {
        states: null, teams: null, priorities: null, customFilters: null,
      };
      dispatch(getVisitorRequestFilters(filterValues));
      const statusValues = [];
      const teams = [];
      const priorities = [];
      const customFilters = '';
      dispatch(getVisitorRequestCount(userInfo.data.company.id, appModels.ORDER, statusValues, teams, priorities, customFilters));
    }
  }, [userInfo]);

  const onIDLoad = () => {
    const filters = [{
      key: 'name', value: id, label: 'ID', type: 'id',
    }];
    const filterValues = {
      statusValues: [],
      teams: [],
      priorities: [],
      customFilters: filters,
    };
    dispatch(getVisitorRequestFilters(filterValues));
    showLookup(false); setId('');
    setRedirect(true);
  };

  if (isRedirect) {
    return (<Redirect to="/maintenance/workorders" />);
  }

  return (
    <Card className="p-2 mt-2 rounded-0 border-0">
      <CardTitle className="mb-0">
        <h6>
          <img src={actionsBlueIcon} alt="Actions" className="mr-2" height="20" width="20" />
          ACTIONS
        </h6>
      </CardTitle>
      <CardBody className="p-0 ml-3">
        <Row className="ml-2 mr-2 action">
          {
            actionList && actionList.map((actions, index) => (
              actions.id === 2 ? (
                <Col sm="6" md="6" lg="6" key={actions.id} className="pr-0 mb-2">
                  <Link to={actions.url} id={`action${index}`} onClick={() => showLookup(!isLookup)} className="hoverColor btn btn-default border-silverfoil-2px p-1 text-left w-100">
                    <img src={faIcons[actions.icon]} className="mr-2" alt={actions.name} height="15" width="15" />
                    <span className="font-weight-400 font-11">{actions.name}</span>
                  </Link>
                </Col>
              )
                : (
                  <Col xs="6" sm="6" md="6" lg="6" key={actions.id} className="pr-0 mb-2">
                    <Link to={actions.url} id={`action${index}`} className="hoverColor btn btn-default border-silverfoil-2px p-1 text-left w-100">
                      <img src={faIcons[actions.icon]} className="mr-2" alt={actions.name} height="15" width="15" />
                      <span className="font-weight-400 font-11">{actions.name}</span>
                    </Link>
                  </Col>
                )
            ))
          }
        </Row>
        <Modal className="border-radius-50px lookupModal" isOpen={isLookup}>
          <ModalHeaderComponent title="Lookup by Work Order" imagePath={searchBlueIcon} closeModalWindow={() => { showLookup(false); setId(''); }} />
          <ModalBody>
            <div>
              <FormGroup className="pl-4 mr-3 ml-2">
                <Input
                  type="text"
                  name="id"
                  placeholder="Enter ID."
                  value={id}
                  onKeyPress={noSpecialChars}
                  onChange={onIDChange}
                  minLength="8"
                  maxLength="17"
                  className="border-radius-50px bg-thin-grey font-medium"
                />
              </FormGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!id}
              onClick={() => onIDLoad()}
              type="button"
              variant="contained"
            >
              Search
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};
export default ActionList;
