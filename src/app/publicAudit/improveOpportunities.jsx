/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Row, Col, Table, Input,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import DOMPurify from 'dompurify';

import addIcon from '@images/icons/plusCircleBlue.svg';

import { getLocalDateDBFormat } from '../util/appUtils';

const ImproveOpportunities = (props) => {
  const {
    onHide
  } = props;
  const [partsData, setPartsData] = useState(window.localStorage.getItem('opportunities') ? JSON.parse(window.localStorage.getItem('opportunities')) : []);
  const [partsAdd, setPartsAdd] = useState(false);

  const saveData = () => {
    window.localStorage.setItem('opportunities', JSON.stringify(partsData));
    if (onHide) onHide();
  };

  const cancelData = () => {
    setPartsData([]);
    window.localStorage.setItem(('opportunities'), []);
    if (onHide) onHide();
  };

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      name: '', date_deadline: '', type_action: 'improvement', description: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const removeData = (e, index) => {
    const newData = partsData;
    newData.splice(index, 1);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDataChange = (e, index, field) => {
    const newData = partsData;
    if (field !== 'date_deadline') {
      newData[index][field] = DOMPurify.sanitize(e.target.value);
    } else {
      newData[index][field] = `${getLocalDateDBFormat(e.target.value)} 18:30:00`;
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  return (
    <Row>
      <Col xs={12} sm={12} md={12} lg={12} className="">
        <div className="calendar-form-content thin-scrollbar">
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Category/Action
                </th>
                <th className="p-2 min-width-160 border-0">
                  Deadline
                </th>
                <th className="p-2 min-width-160 border-0">
                  Description
                </th>
                <th className="p-2 border-0">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody>
              {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
                <tr key={index}>
                  <td>
                    <Input type="textarea" name="name" value={pl.name} maxLength={300} onChange={(e) => onDataChange(e, index, 'name')} />
                    <span className="text-danger font-11">300 characters are allowed</span>
                  </td>
                  <td>
                    <Input type="date" name="date_deadline" value={getLocalDateDBFormat(pl.date_deadline)} min={moment(new Date()).format('YYYY-MM-DD')} onChange={(e) => onDataChange(e, index, 'date_deadline')} />
                  </td>
                  <td>
                    <Input type="textarea" name="description" value={pl.description} maxLength={300} onChange={(e) => onDataChange(e, index, 'description')} />
                    <span className="text-danger font-11">300 characters are allowed</span>
                  </td>
                  <td>
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                  </td>
                </tr>
              )))}
              <tr>
                <td colSpan="4" className="text-left">
                  <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    <span className="mr-5">Add another Opportunity</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <hr className="mt-0" />
        <div className="float-right">
          <Button
            type="button"
            size="md"
            className="rounded-pill mr-2"
            onClick={() => cancelData()}
             variant="contained"
          >
            <span>Reset</span>
          </Button>
          <Button
            type="button"
            size="md"
            className="rounded-pill mr-2"
            disabled={!partsData.length}
            onClick={() => saveData()}
             variant="contained"
          >
            <span>Save</span>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

ImproveOpportunities.propTypes = {
  onHide: PropTypes.func.isRequired,
};

export default ImproveOpportunities;
