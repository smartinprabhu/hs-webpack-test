/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col, Modal, ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  InputField, FormikAutocomplete,
} from '@shared/formFields';
import {
  generateErrorMessage,
  avoidSpaceOnFirstCharacter,
} from '../../../util/appUtils';
import {
  getPcList,
} from '../../pantryService';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {

    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      name,
      parentId,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    parent_id,
  } = formValues;
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const columns = ['id', 'name', 'display_name'];
  const [extraModal, setExtraModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    pcInfo,
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getPcList(appModels.PRODUCTCATEGORY, categoryKeyword));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  let categoryOptions = [];

  if (pcInfo && pcInfo.loading) {
    categoryOptions = [{ display_name: 'Loading..' }];
  }

  if (pcInfo && pcInfo.data) {
    categoryOptions = pcInfo.data;
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSearchModal = () => {
    setModelValue(appModels.PRODUCTCATEGORY);
    setFieldName('parent_id');
    setModalName('Parent Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('parent_id', '');
    setCategoryOpen(false);
  };

  return (
    <>

      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={name.name}
              label={name.label}
              autoComplete="off"
              isRequired
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
              onKeyPress={formValues && formValues.name === '' ? avoidSpaceOnFirstCharacter : true}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={parentId.name}
              label={parentId.label}
              labelClassName="mb-2"
              formGroupClassName="mb-1 w-100"
              open={categoryOpen}
              oldValue={getOldData(parent_id)}
              value={parent_id && parent_id.display_name ? parent_id.display_name : getOldData(parent_id)}
              size="small"
              onOpen={() => {
                setCategoryOpen(true);
                setCategoryKeyword('');
              }}
              onClose={() => {
                setCategoryOpen(false);
                setCategoryKeyword('');
              }}
              loading={pcInfo && pcInfo.loading && categoryOpen}
              getOptionSelected={(option, value) => option.display_name === value.display_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
              apiError={(pcInfo && pcInfo.err) ? generateErrorMessage(pcInfo) : false}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCategoryKeywordChange}
                  variant="outlined"
                  value={categoryKeyword}
                  className={((getOldData(parent_id)) || (parent_id && parent_id.id) || (categoryKeyword && categoryKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {pcInfo && pcInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(parent_id)) || (parent_id && parent_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCategoryKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSearchModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setFieldValue={setFieldValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
