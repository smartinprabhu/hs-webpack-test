/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import searchBlueIcon from '@images/icons/searchBlue.svg';
import actionsBlue from '@images/icons/actionsBlue.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import eyeBlueIcon from '@images/icons/eyeBlue.svg';

import './helpdeskOverview.scss';
import {
  getHelpdeskFilter, getTicketCount,
} from '../ticketService';
import actionList from './data/actions.json';
import actionCodes from '../data/helpdeskActionCodes.json';
import { getListOfOperations, noSpecialChars, getAllowedCompanies } from '../../util/appUtils';

const faIcons = {
  faPlusCircle: addIcon,
  faEye: eyeBlueIcon,
  faSearch: searchBlueIcon,
};
const appModels = require('../../util/appModels').default;

const ActionList = () => {
  const dispatch = useDispatch();
  const [isLookup, showLookup] = useState(false);
  const [isRedirect, setRedirect] = useState(false);
  const [id, setId] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const onIdChange = (e) => {
    if (e.target.value && e.target.value.match('^[a-zA-Z0-9 ]*$') != null) {
      setId(e.target.value);
    } else {
      setId('');
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const filterValues = {
        states: null, categories: null, priorities: null, customFilters: null,
      };
      dispatch(getHelpdeskFilter(filterValues));
      const statusValues = [];
      const categories = [];
      const priorities = [];
      const customFilters = '';
      dispatch(getTicketCount(companies, appModels.HELPDESK, statusValues, categories, priorities, customFilters));
    }
  }, [userInfo]);

  const onIDLoad = () => {
    const filters = [{
      key: 'ticket_number', value: id, label: 'ID', type: 'id',
    }];
    const filterValues = {
      statusValues: [],
      categories: [],
      priorities: [],
      customFilters: filters,
    };
    dispatch(getHelpdeskFilter(filterValues));
    showLookup(false); setId('');
    setRedirect(true);
  };

  if (isRedirect) {
    return (<Redirect to="/helpdesk/tickets" />);
  }

  return (
    <Card className="p-2 mt-2 rounded-0 border-0">
      <CardTitle className="mb-0">
        <h6>
          <img src={actionsBlue} alt="actions" className="mr-2" width="20" height="20" />
          ACTIONS
        </h6>
      </CardTitle>
      <CardBody className="p-0 ml-3">
        <Row className="ml-2 mr-2 action">
          {
            actionList && actionList.map((actions, index) => (
              actions.id === 2 ? (
                <Col sm="6" md="6" lg="6" xs="12" key={actions.id} className="pr-0 mb-2">
                  <Link to={actions.url} id={`action${index}`} onClick={() => showLookup(!isLookup)} className="hoverColor btn btn-default border-silverfoil-2px p-1 text-left w-100">
                    <img src={faIcons[actions.icon]} className="mr-2" alt={actions.name} height="15" width="15" />
                    <span className="font-weight-400 font-11">{actions.name}</span>
                  </Link>
                </Col>
              )
                : (
                  <React.Fragment key={actions.id}>
                    {(allowedOperations.includes(actionCodes[actions.name]) || actions.name === 'View All Tickets') && (
                      <Col xs="12" sm="6" md="6" lg="6" key={actions.id} className="pr-0 mb-2">
                        <Link to={actions.url} id={`action${index}`} className="hoverColor btn btn-default border-silverfoil-2px p-1 text-left w-100">
                          <img src={faIcons[actions.icon]} className="mr-2" alt={actions.name} height="15" width="15" />
                          <span className="font-weight-400 font-11">{actions.name}</span>
                        </Link>
                      </Col>
                    )}
                  </React.Fragment>
                )
            ))
          }
        </Row>
        <Modal className="border-radius-50px lookupModal" isOpen={isLookup}>
          <ModalHeader className="modal-justify-header">
            <Row>
              <Col sm="12" md="12" lg="12" xs="12" className="pr-0">
                <Button
                   variant="contained"
                  size="sm"
                  onClick={() => { showLookup(false); setId(''); }}
                  className=" hoverColor margin-top-10px pb-05 pt-05 font-11 border-color-red-gray bg-white text-red-gray rounded-pill float-right mb-1 mr-3"
                >
                  Cancel
                  <img className="ml-2 mt-n2px " src={closeCircleWhiteIcon} alt="cancel" width="10" height="10" />
                </Button>

                <h5 className="font-weight-800 mb-0">
                  <img src={searchBlueIcon} className="mr-3" alt="lookup" width="22" height="22" />
                  Lookup by Ticket Number
                </h5>
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <div>
              <FormGroup className="pl-4 ml-2 mr-3">
                <Input
                  type="text"
                  name="id"
                  placeholder="Enter ID"
                  value={id}
                  onKeyPress={noSpecialChars}
                  onChange={onIdChange}
                  minLength="8"
                  maxLength="17"
                  pattern="[a-zA-Z0-9 ]"
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
