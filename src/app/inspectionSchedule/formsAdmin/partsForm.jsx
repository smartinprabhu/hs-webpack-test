/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles } from '@material-ui/core/styles';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import PropTypes from 'prop-types';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addIcon from '@images/icons/plusCircleGrey.svg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, ModalBody,
  Input,
  Table,
} from 'reactstrap';
import {
  Box,
} from '@mui/material';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getAllowedCompanies, extractOptionsObject,
} from '../../util/appUtils';
import {
  getTaskParts, getPartsData, getProductsList,
} from '../../preventiveMaintenance/ppmService';
import Selection from '../../commonComponents/multipleFormFields/selectionMultiple';
import SearchModal from '../forms/searchModal';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const PartsForm = (props) => {
  const {
    operation,
    setFieldValue,
  } = props;
  const quantity = '1.000';
  const dispatch = useDispatch();
  const classes = useStyles();
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState('');
  const [partsAdd, setPartsAdd] = useState(false);
  const [partId, setPartId] = useState(false);
  const [partIndex, setPartIndex] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);
  const [operationData, setOperationData] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    productInfo, productIdInfo, partsSelected,
    taskPartsList,
  } = useSelector((state) => state.ppm);

  const loadEmptyTd = () => {
    const newData = partsSelected && partsSelected.length ? partsSelected : [];
    newData.push({
      parts_id: '', parts_qty: '', name: '', parts_uom: 1,
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  useEffect(() => {
    if (operation.parts_lines && operation.parts_lines.length && (userInfo && userInfo.data)) {
      dispatch(getTaskParts(companies, appModels.TASKPARTS, operation.parts_lines));
    } else {
      setPartsData([]);
      dispatch(getPartsData([]));
    }
  }, [operation]);

  useEffect(() => {
    if ((taskPartsList && taskPartsList.data && taskPartsList.data.length)) {
      const newArrData = taskPartsList.data.map((cl) => ({
        ...cl,
        id: cl.id,
        parts_id: cl.parts_id,
        parts_qty: cl.parts_qty,
        name: cl.name,
        parts_type: cl.parts_type,
        parts_categ_id: cl.parts_categ_id ? cl.parts_categ_id[1] : '',
        parts_uom: cl.parts_uom ? cl.parts_uom[0] : '',
      }));
      setPartsData(newArrData);
      dispatch(getPartsData(newArrData));
    }
  }, [taskPartsList]);

  const onNameChange = (e, index) => {
    const newData = partsData;
    newData[index].name = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    newData[index].parts_qty = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].parts_id = [e.id, e.name];
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  return (
    <>
      <Box>
        {partsSelected && partsSelected.length === 0 || Object.keys(partsSelected).length === 0 ? (
          <ErrorContent errorTxt="No Data Found" />
        )
          : (
            <>
              <div colSpan="5" className="text-right">
                <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-5">
                    Add Spare Part
                  </span>
                </div>
              </div>
              <Table responsive>
                {/* <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    <Typography>
                      {' '}
                      Spare Part
                      {infoValue('tools')}
                    </Typography>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <Typography>
                      {' '}
                      Quantity
                      {infoValue('tools')}
                    </Typography>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <Typography>
                      {' '}
                      Short Description
                      {infoValue('tools')}

                    </Typography>
                  </th>
                  <th className="p-2 border-0" align="right">
                    <span className="invisible"><Typography>DEL</Typography></span>
                  </th>
                </tr>
              </thead> */}
                <tbody>
                  {/* <tr>
                  <td colSpan="5" className="text-right">
                    <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                      <span className="mr-5">
                        Add Spare Part
                      </span>
                    </div>
                  </td>
                </tr> */}
                  {(partsSelected && partsSelected.length > 0 && partsSelected.map((pl, index) => (
                    <tr key={pl.id}>
                      <td className="border-0">
                        <Selection
                          isMultipleForm
                          paramsSet={(e) => onProductChange(e, index)}
                          paramsValue={pl.parts_id && pl.parts_id.name ? pl.parts_id.name : pl.parts_id && pl.parts_id.length ? pl.parts_id[1] : ''}
                          paramsId={Math.random()}
                          callData={getProductsList}
                          dropdownsInfo={productInfo}
                          dropdownOptions={extractOptionsObject(productInfo, pl.parts_id)}
                          moduleName={appModels.PRODUCT}
                          columns={['id', 'name']}
                          indexValue={index}
                          advanceSearchHeader="Spare Parts List"
                          placeholderText=" Spare Part"
                        />
                      </td>
                      <td className="border-0">
                        <Input type="input" name="quantity" value={pl.parts_qty} onChange={(e) => onQuantityChange(e, index)} placeholder="Quantity" />
                      </td>
                      <td className="border-0">
                        <Input type="input" name="name" value={pl.name} onChange={(e) => onNameChange(e, index)} placeholder=" Short Description" />
                      </td>
                      {/* <td>
                      <Input type="input" name="productType" disabled defaultValue={pl.parts_type ? getProductTypeLabel(pl.parts_type) : ''} />
                    </td>
                    <td>
                      <Input type="input" name="productCategory" disabled defaultValue={pl && pl.parts_categ_id ? pl.parts_categ_id : ''} />
                    </td> */}
                      <td className="border-0">
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="lg" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                      </td>
                    </tr>
                  )))}
                </tbody>
              </Table>
            </>
          )}
        {taskPartsList && taskPartsList.loading && (
        <div className="text-center mt-3 mb-3">
          <Loader />
        </div>
        )}
      </Box>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={['name']}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            modalName={modalName}
            setFieldValue={setFieldValue}
            arrayValues={arrayList}
            arrayIndex={arrayIndex}
            operationData={operationData}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

PartsForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default PartsForm;
