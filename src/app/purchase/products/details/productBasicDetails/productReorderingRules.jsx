import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  Dialog, DialogContent, DialogContentText, Drawer, Tooltip,
} from '@mui/material';

import DrawerHeader from '../../../../commonComponents/drawerHeader';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import CreateList from '@shared/listViewFilters/create';
import editIcon from '@images/icons/edit.svg';
import Button from '@mui/material/Button';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import {
  resetDelete, getDelete,
} from '../../../../pantryManagement/pantryService';

import {
  getReOrderingRules, clearAddReOrderingRule, getReorderRuleDetails, clearEditReOderingRule,
} from '../../../purchaseService';
import AddReorderingRules from '../../reorderingRules/addReorderingRules';
import {
  getAllowedCompanies, getDefaultNoValue, numToFloat, generateErrorMessage, getListOfModuleOperations,
} from '../../../../util/appUtils';
import actionCodes from '../../../../inventory/data/actionCodes.json';

const appModels = require('../../../../util/appModels').default;

const ProductReorderingRules = ({ detailData }) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [reOrderingRule, setReOrderingRule] = useState('');

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const {
    reOrderingRulesInfo, reOrderingRuleDetailsInfo,
  } = useSelector((state) => state.purchase);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Add Reorder Rule']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Reorder Rule']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Reorder Rule']);

  const companies = getAllowedCompanies(userInfo);

  const productId = detailData && detailData.product_id && detailData.product_id.length ? detailData.product_id[0] : detailData.id;

  const onEditReorderingRule = (id) => {
    setEdit(true);
    setReOrderingRule(id);
  };

  useEffect(() => {
    if (deleteInfo && deleteInfo.data) {
      if (productId) {
        dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, false, false, false, false, false, false, [productId]));
      }
    }
  }, [deleteInfo]);

  const onEditReset = () => {
    setEdit(false);
    dispatch(clearEditReOderingRule());
    if (productId) {
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, false, false, false, false, false, false, [productId]));
    }
  };
  const onAddReset = () => {
    setOpenModal(false);
    dispatch(clearAddReOrderingRule());
    if (productId) {
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, false, false, false, false, false, false, [productId]));
    }
  };
  useEffect(() => {
    if (productId) {
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, false, false, false, false, false, false, [productId]));
    }
  }, [detailData]);

  useEffect(() => {
    if (reOrderingRule) {
      dispatch(getReorderRuleDetails(appModels.REORDERINGRULES, reOrderingRule));
    }
  }, [reOrderingRule]);

  const onClickRemoveData = (id, name) => {
    dispatch(resetDelete());
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, 'stock.warehouse.orderpoint', 'toggle_active'));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const getRow = (reorderData) => {
    const tableTr = [];
    for (let i = 0; i < reorderData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">
            {getDefaultNoValue(reorderData[i].name)}
          </td>
          <td className="p-2">
            {getDefaultNoValue(reorderData[i].location_id ? reorderData[i].location_id[1] : '')}
          </td>
          <td className="p-2">
            {getDefaultNoValue(reorderData[i].warehouse_id ? reorderData[i].warehouse_id[1] : '')}
          </td>
          <td className="p-2">
            {getDefaultNoValue(numToFloat(reorderData[i].product_min_qty))}
          </td>
          <td className="p-2">
            {getDefaultNoValue(numToFloat(reorderData[i].product_max_qty))}
          </td>
          <td className="p-2">
            {getDefaultNoValue(numToFloat(reorderData[i].product_alert_level_qty))}

          </td>
          <td className="p-2">
            {getDefaultNoValue(numToFloat(reorderData[i].qty_multiple))}
          </td>
          {(isEditable || isDeleteable) && (
          <td>
            {isEditable && (
            <Tooltip title="Edit">
              <img
                aria-hidden="true"
                src={editIcon}
                className="cursor-pointer ml-1 mr-3"
                height="12"
                width="12"
                alt="edit"
                onClick={() => { onEditReorderingRule(reorderData[i].id); }}
              />
            </Tooltip>
            )}
            {isDeleteable && (
            <Tooltip title="Delete">
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => onClickRemoveData(reorderData[i].id, reorderData[i].name)}
              />
            </Tooltip>
            )}
          </td>
          )}
        </tr>,
      );
    }
    return tableTr;
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
        <h6>
          Reordering Rules
          {isCreatable && (
            <span className="float-right">
              <span className="float-right">
                <CreateList name="Add" showCreateModal={() => setOpenModal(true)} />
              </span>
            </span>
          )}
        </h6>
        {reOrderingRulesInfo && reOrderingRulesInfo.data && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                  <th className="p-2 min-width-80">
                    Location
                  </th>
                  <th className="p-2 min-width-80">
                    Warehouse
                  </th>
                  <th className="p-2 min-width-80">
                    Reorder Level
                  </th>
                  <th className="p-2 min-width-80">
                    Reorder Quantity
                  </th>
                  <th className="p-2 min-width-80">
                    Alert Level
                  </th>
                  <th className="p-2 min-width-120">
                    Unit Of Measure
                  </th>
                  {(isEditable || isDeleteable) && (
                  <th className="p-2 min-width-80">
                    Action
                  </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {getRow(reOrderingRulesInfo && reOrderingRulesInfo.data ? reOrderingRulesInfo.data : [])}
              </tbody>
            </Table>
          </div>
        )}
        {reOrderingRulesInfo && reOrderingRulesInfo.loading && (
          <Loader />
        )}
        {(reOrderingRulesInfo && reOrderingRulesInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(reOrderingRulesInfo)} />
        )}
      </Col>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={openModal}
      >
        <DrawerHeader
          headerName="Create Reordering Rules"
          imagePath={InventoryBlue}
          onClose={() => setOpenModal(false)}
        />
        <AddReorderingRules closeAddModal={() => setOpenModal(false)} afterReset={onAddReset} product={detailData} defaultWarehouse defaultLocation />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={isEdit}
      >
        <DrawerHeader
          headerName="Update Reordering Rules"
          imagePath={InventoryBlue}
          onClose={() => setEdit(false)}
        />
        {reOrderingRuleDetailsInfo && !reOrderingRuleDetailsInfo.loading && (<AddReorderingRules closeEditModal={() => setEdit(false)} afterReset={onEditReset} editId={reOrderingRule} reOrderingRule={reOrderingRule} />)}
        {reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.loading && (
          <Loader />
        )}
        {(reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(reOrderingRuleDetailsInfo)} />
        )}
      </Drawer>
      <Dialog maxWidth={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'} open={deleteModal}>
        <DialogHeader title="Delete Product Reordering Rule" imagePath={false} onClose={() => onRemoveDataCancel()} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} ?`}
            </p>
            )}
            {deleteInfo && deleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(deleteInfo && deleteInfo.err) && (
            <SuccessAndErrorFormat response={deleteInfo} />
            )}
            {(deleteInfo && deleteInfo.data) && (
            <SuccessAndErrorFormat
              response={deleteInfo}
              successMessage="Product Reordering Rule removed successfully.."
            />
            )}
            <div className="pull-right mt-3">
              {deleteInfo && !deleteInfo.data && (
              <Button
                size="sm"
                disabled={deleteInfo && deleteInfo.loading}
                variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
              )}
              {deleteInfo && deleteInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Row>
  );
};
export default ProductReorderingRules;
