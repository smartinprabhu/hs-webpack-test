/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addIcon from '@images/icons/plusCircleBlue.svg';
import {
  TextField
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody, Col, Input, Row, Table
} from 'reactstrap';
import {
  getPartsData
} from '../../../../preventiveMaintenance/ppmService';
import { decimalKeyPress, numToFloat } from '../../../../util/appUtils';
import customData from '../data/customData.json';

const ProductForm = (props) => {
  const {
    editId,
    subCategoryValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    subcategory_ids
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState(subCategoryValues);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');

  const { pcInfo } = useSelector((state) => state.site);
  const { partsSelected } = useSelector((state) => state.ppm);

  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    setPartsData([]);
    dispatch(getPartsData([]));
  }, []);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (subcategory_ids && subcategory_ids.length > 0) {
      setPartsData(subcategory_ids);
    }
  }, [subcategory_ids]);

  useEffect(() => {
    if (partsSelected) {
      setPartsData(partsSelected);
    }
  }, [partsSelected]);

  useEffect(() => {
    if (editId && (pcInfo && pcInfo.data && pcInfo.data.length && pcInfo.data[0].subcategory_ids && pcInfo.data[0].subcategory_ids.length)
      && (updateProductCategoryInfo && !updateProductCategoryInfo.err)) {
      const newArrData = pcInfo.data[0].subcategory_ids.map((cl) => ({
        ...cl,
        id: cl.id,
        name: cl.name,
        priority: cl.priority,
        sla_timer: numToFloat(cl.sla_timer),
      }));
      setFieldValue('subcategory_ids', newArrData);
      setPartsData(newArrData);
      setPartsAdd(Math.random());
    }
  }, [editId, pcInfo]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('subcategory_ids', partsData);
    }
  }, [partsData]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, name: '', priority: '', sla_timer: numToFloat(0),
    });
    setPartsData(newData);
    // setFieldValue('subcategory_ids', newData);
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

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    newData[index].sla_timer = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onCategoryChange = (e, index) => {
    const newData = partsData;
    newData[index].name = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].priority = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  function getConditionLabel(value) {
    let res = '';

    if (customData && customData.priorityText[value]) {
      res = customData.priorityText[value].label;
    }

    return res;
  }

  return (
    <>

      <Card className="no-border-radius mb-2 mt-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Sub Category</p>
        </CardBody>
      </Card>
      <Row className="">
        <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Sub Category Name
                  {' '}
                  <span className="text-danger ml-1">*</span>
                </th>
                <th className="p-2 min-width-160 border-0">
                  Priority
                  {' '}
                  <span className="text-danger ml-1">*</span>
                </th>
                <th className="p-2 min-width-160 border-0">
                  Planned Duration L1
                </th>
                <th className="p-2 min-width-160 border-0">
                  <span className="invisible">Del</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-left">
                  <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    <span className="mr-5">Add a Line</span>
                  </div>
                </td>
              </tr>
              {(subcategory_ids && subcategory_ids.length > 0 && subcategory_ids.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <tr key={index}>
                      <td className="p-2">
                        <Input
                          type="text"
                          name="name"
                          value={pl.name}
                          onChange={(e) => onCategoryChange(e, index)}
                        />
                      </td>
                      <td className="p-2">
                        <Autocomplete
                          open={openId === index}
                          formGroupClassName="m-1"
                          onOpen={() => {
                            setOpen(index);
                          }}
                          onClose={() => {
                            setOpen('');
                          }}
                          disableClearable
                          oldvalue={getConditionLabel(pl.priority)}
                          value={pl.priority && pl.priority.label ? pl.priority.label : getConditionLabel(pl.priority)}
                          getOptionSelected={(option, value) => option.label === value.label}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                          options={customData.priorityTypes}
                          onChange={(e, data) => { onProductChange(data, index); }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              className="without-padding"
                              placeholder="Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="text"
                          onKeyPress={decimalKeyPress}
                          name="sla_timer"
                          value={pl.sla_timer}
                          onChange={(e) => onQuantityChange(e, index)}
                          maxLength="7"
                        />
                      </td>
                      <td className="p-2">
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                      </td>
                    </tr>
                  )}
                </>
              )))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

ProductForm.propTypes = {
  subCategoryValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default ProductForm;
