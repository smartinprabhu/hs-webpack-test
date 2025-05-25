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
import {
  TextField
} from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Table
} from 'reactstrap';

import addIcon from '@images/icons/plusCircleGrey.svg';
import makeStyles from '@mui/styles/makeStyles';
import { infoValue } from '../../adminSetup/utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  root: {
    '& .MuiFormLabel-asterisk': {
      color: 'red',
    },
  },
});

const ProductForm = (props) => {
  const {
    setPartsData,
    partsData,
    // setPartsAdd,
    tableData,
    initialData,
  } = props;
  const [partsAdd, setPartsAdd] = useState(false);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];

    newData.push(initialData);
    setPartsData(newData);
    setPartsAdd(Math.random);
  };

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

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

  const onNameChange = (e, index, field) => {
    const newData = partsData;
    newData[index][field] = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Table responsive id="spare-part">
          {tableData && (
          <thead className="bg-lightblue">
            <tr>
              {tableData.map((hd) => (
                <th className="p-2 min-width-160 border-0">
                  {hd.headerName}
                  {hd.isRequired && (<span className="text-danger ml-1">*</span>)}
                  {' '}
                  {hd.infoText && infoValue(hd.infoText)}
                </th>
              ))}
              <th className="p-2 min-width-160 border-0">
                <span className="invisible">Del</span>
              </th>
            </tr>
          </thead>
          )}
          <tbody>
            <tr>
              <td colSpan="7" className="text-left">
                <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-5">Add a Line</span>
                </div>
              </td>
            </tr>
            {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
              <>
                {!pl.isRemove && (
                <tr key={index}>
                  { tableData.map((hd) => (
                    hd.fieldType === 'textField' && (
                    <td className="p-2">
                      <TextField
                        variant="outlined"
                        type="text"
                        name={[hd.fieldName]}
                        size="small"
                        className="w-100"
                        value={pl[hd.fieldName]}
                        placeholder={hd.placeholder}
                        onChange={(e) => onNameChange(e, index, hd.fieldName)}
                        onKeyDown={hd.keyDownFuntion}
                        inputProps={{ maxLength: hd.maxLength ? hd.maxLength : 150 }}
                        InputLabelProps={{ shrink: true }}
                      />

                    </td>
                    )))}
                  <td className="p-2 align-middle">
                    {/* <FontAwesomeIcon className="mr-2 ml-4 cursor-pointer" size="xl" icon={faPlus} onClick={loadEmptyTd} />
                            <span className="font-weight-400 d-inline-block" /> */}
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="lg" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                  </td>
                </tr>
                )}
              </>
            )))}
          </tbody>
        </Table>
      </Box>
    </>
  );
};

ProductForm.propTypes = {
  tableHeader: PropTypes.oneOfType([PropTypes.array]).isRequired,
  tableBody: PropTypes.oneOfType([PropTypes.array]).isRequired,
  partsData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  setPartsData: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductForm;
