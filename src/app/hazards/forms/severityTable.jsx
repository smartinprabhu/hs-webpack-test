/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Modal,
  ModalBody,
} from 'reactstrap';
import { Tooltip, Popover } from 'antd';
import { Markup } from 'interweave';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import ModalNoPadHead from '@shared/modalNoPadHead';

import {
  getHxSeverities,
} from '../ctService';
import {
  truncateStars, truncateFrontSlashs,
} from '../../util/appUtils';

import { getProbablities, getProbablitiesBySev } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const SeverityTable = (props) => {
  const {
    afterReset,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');

  const [probabilities, setProbabilities] = useState([]);

  const [desc, setDesc] = useState('');

  const [modalName, setModalName] = useState('');

  const [descModal, setDescModal] = useState('');

  const {
    hxSeverities,
    hxIncidentConfig,
  } = useSelector((state) => state.hxIncident);

  const { userInfo } = useSelector((state) => state.user);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  useEffect(() => {
    if (configData && userCompanyId) {
      const tempLevel = configData.severity_access ? configData.severity_access : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      dispatch(getHxSeverities(domain, appModels.HXSEVERITY));
      setProbabilities([]);
    }
  }, []);

  const sevData = hxSeverities && hxSeverities.data ? hxSeverities.data : [];

  const content = (data) => {
    <Markup content={truncateFrontSlashs(truncateStars(data))} />;
  };

  /* useEffect(() => {
    if (hxSeverities && hxSeverities.data) {
      let newArr = [];
      for (let i = 0; i < hxSeverities.data.length; i + 1) {
        newArr = [...hxSeverities.data[i].probability_ids, ...probabilities];
      }
      setProbabilities([...new Map(newArr.map((item) => [item.id, item])).values()]);
    }
  }, []); */

  const handleRowClick = (data1, data2) => {
    setFieldValue('severity_id', data1);
    const data3 = { id: data2.id, name: data2.title_id && data2.title_id.name ? data2.title_id.name : '' };
    setFieldValue('probability_id', data3);
    if (afterReset) afterReset();
  };

  const showDesc = (descp, name) => {
    setDesc(descp);
    setModalName(name);
    setDescModal(true);
  };

  return (
    <div>
      <Table responsive className="mb-0 mt-2 font-weight-400" width="100%">
        <thead className="bg-gray-light">
          <tr>
            <th className="sticky-th">#</th>
            {hxSeverities && hxSeverities.data && getProbablities(hxSeverities.data).map((pr) => (
              <th className="sticky-th text-center" key={pr.id} align="center">
                <Tooltip title={pr.description} placement="top">
                  {pr.title_id && pr.title_id.name ? pr.title_id.name : ''}
                </Tooltip>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hxSeverities && hxSeverities.data && hxSeverities.data.map((hs) => (
            <tr>
              <td className="p-2 sticky-td">
                {hs.name}
                <span className="text-info cursor-pointer">
                  <FontAwesomeIcon onClick={() => showDesc(hs.description, hs.name)} className="ml-1" size="sm" icon={faInfoCircle} />
                </span>
              </td>
              {getProbablities(hxSeverities.data).map((pr1) => (
                <>
                  {getProbablitiesBySev(hxSeverities.data, hs.id, pr1.title_id && pr1.title_id.id ? pr1.title_id.id : pr1.id).length > 0 && getProbablitiesBySev(hxSeverities.data, hs.id, pr1.title_id && pr1.title_id.id ? pr1.title_id.id : pr1.id).map((pd) => (
                    <td
                      className="p-2 sticky-td cursor-pointer text-center"
                      style={{ backgroundColor: pd.risk_rating_id.color, color: pd.risk_rating_id.color ? 'white' : '' }}
                      onClick={() => handleRowClick(hs, pd)}
                      aria-hidden
                    >
                      <Tooltip title={pd.risk_rating_id.description} placement="top">
                        {pd.risk_rating_id && pd.risk_rating_id.name ? pd.risk_rating_id.name : ''}
                      </Tooltip>
                    </td>
                  ))}
                  {getProbablitiesBySev(hxSeverities.data, hs.id, pr1.title_id && pr1.title_id.id ? pr1.title_id.id : pr1.id).length === 0 && (
                  <td
                    className="p-2 sticky-td cursor-pointer"
                  />
                  )}
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <hr className="m-0" />
      <Modal size="xl" className="modal-xxl" isOpen={descModal}>
        <ModalNoPadHead title={modalName} fontAwesomeIcon={faInfoCircle} closeModalWindow={() => setDescModal(false)} />
        <ModalBody className="">
          <Markup content={truncateFrontSlashs(truncateStars(desc))} />
        </ModalBody>
      </Modal>
    </div>

  );
};

SeverityTable.propTypes = {
  afterReset: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default SeverityTable;
