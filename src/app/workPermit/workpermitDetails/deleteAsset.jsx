/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';

import { updateProductCategory } from '../../pantryManagement/pantryService';
import {
  detectMob,
  getColumnArrayById,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const DeleteAsset = React.memo(({
  wpId, isAdd, deleteId, equipments, spaces, type, editData, onClose,
}) => {
  const dispatch = useDispatch();

  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  const { userInfo } = useSelector((state) => state.user);

  const onDeleteAsset = () => {
    if (wpId) {
      let postDataValues = {};
      if (type === 'equipment') {
        const data = equipments.filter((item) => (item.id !== deleteId));
        postDataValues = {
          equipment_ids: [[6, 0, getColumnArrayById(data, 'id')]],
        };
        if (data && data.length === 1) {
          postDataValues.equipment_id = data[0].id;
        }
      } else if (type === 'space') {
        const data = spaces.filter((item) => (item.id !== deleteId));
        postDataValues = {
          space_ids: [[6, 0, getColumnArrayById(data, 'id')]],
        };
        if (data && data.length === 1) {
          postDataValues.space_id = data[0].id;
        }
      }
      dispatch(updateProductCategory(wpId, appModels.WORKPERMIT, postDataValues));
    }
  };

  const isMobileView = detectMob();

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: isMobileView ? '5px' : '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >

            {!isAdd && !(updateProductCategoryInfo && updateProductCategoryInfo.data) && !updateProductCategoryInfo.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-0">
                <p className="font-family-tab text-center">
                  Are you sure, you want to delete
                  {' '}
                  {type === 'space' ? editData.space_name : editData.name}
                  {' '}
                  ?
                </p>
              </Col>
            </Row>
            )}
            {updateProductCategoryInfo && updateProductCategoryInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
            <SuccessAndErrorFormat response={false} staticErrorMsg="Something went wrong.." />
            )}
            {updateProductCategoryInfo && updateProductCategoryInfo.data && !updateProductCategoryInfo.loading && (
            <SuccessAndErrorFormat response={updateProductCategoryInfo} successMessage={`${!isAdd ? (type === 'space' ? editData.space_name : editData.name) : ''} ${!isAdd ? 'deleted' : `${type === 'space' ? 'Spaces' : 'Equipment'} added`} successfully.`} />
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!isAdd && !(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
          <>
            <Button
              type="button"
              variant="contained"
              className="reset-btn"
              disabled={(updateProductCategoryInfo && updateProductCategoryInfo.data) || updateProductCategoryInfo.loading}
              onClick={() => onClose()}
            >
              No

            </Button>
            <Button
              type="button"
              variant="contained"
              className="submit-btn"
              disabled={(updateProductCategoryInfo && updateProductCategoryInfo.data) || updateProductCategoryInfo.loading}
              onClick={() => onDeleteAsset()}
            >
              Yes

            </Button>
          </>
        )}
        {(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onClose()}
          disabled={updateProductCategoryInfo.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>

    </>
  );
});

export default DeleteAsset;
