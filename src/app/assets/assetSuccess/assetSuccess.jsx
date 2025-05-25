/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage,
  getAllCompanies,
} from '../../util/appUtils';
import {
  getEquipmentList, getEquipmentCount,
} from '../equipmentService';

const appModels = require('../../util/appModels').default;

function AssetSuccess() {
  const dispatch = useDispatch();
  const offsetValue = 0;
  const limit = 10;
  const fields = ['name', 'state', 'location_id', 'category_id', 'equipment_seq', 'maintenance_team_id'];
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { addAssetInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addAssetInfo && addAssetInfo.data)) {
      const statusValues = [];
      const categories = [];
      const customFilters = '';
      dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, statusValues, categories, customFilters));
    }
  }, [userInfo, addAssetInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addAssetInfo && addAssetInfo.data)) {
      const statusValues = [];
      const categories = [];
      const customFilters = '';
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, limit, offsetValue, fields, statusValues, categories, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, addAssetInfo]);

  return (
    <>
      {addAssetInfo && addAssetInfo.data && (
        <h5 className="text-center text-success" data-testid="success-case">
          <FontAwesomeIcon size="lg" className="action-fa-button-lg" icon={faCheck} />
          {' '}
          {' '}
          The asset has been created successfully.
        </h5>
      )}
      {addAssetInfo && addAssetInfo.err && (
        <ErrorContent errorTxt={generateErrorMessage(addAssetInfo)} />
      )}
      {addAssetInfo && addAssetInfo.loading && (
        <span data-testid="loading-case">
          <Loader />
        </span>
      )}
    </>
  );
}

export default AssetSuccess;
