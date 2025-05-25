/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import Box from '@mui/system/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {
  Table,
} from 'reactstrap';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getColumnArrayById,
  getDefaultNoValue,
  extractNameObject,
  getAllowedCompanies,
} from '../../util/appUtils';

import MuiTextFieldStatic from '../../commonComponents/formFields/muiTextFieldStatic';
import MuiAutoCompleteStatic from '../../commonComponents/formFields/muiAutocompleteStatic';
import Assets from '../../assets/equipments';
import appModels from '../../util/appModels';

const AddAssets = ({
  formValues, setFormValues, equipments, setEquipments, spaces, setSpaces,
}) => {
  const [multipleModal, setMultipleModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [multipleSpaceModal, setMultipleSpaceModal] = useState(false);

  const [checkedSpaceRows, setSpaceCheckRows] = useState([]);
  const [isSpaceAllChecked, setIsSpaceAllChecked] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const onTitleChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      name: value,
    }));
  };

  const onYearChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      year: value.year,
    }));
  };

  const handleTypeChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category_type: event.target.value,
    }));
    if (event.target.value === 'e') {
      setSpaces([]);
      setSpaceCheckRows([]);
      setIsSpaceAllChecked(false);
    } else if (event.target.value === 'ah') {
      setEquipments([]);
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  const removeData = (id) => {
    const newData = equipments.filter((item) => item.id !== id);
    setEquipments(newData);
  };

  const removeSpaceData = (id) => {
    const newData = spaces.filter((item) => item.id !== id);
    setSpaces(newData);
  };

  const [yearOpen, setYearOpen] = React.useState(false);

  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => ({ year: (currentYear + i).toString() }));
    return years;
  };

  const onAssetModalChange = (data) => {
    const newData = data.filter((item) => item.name);
    const allData = [...newData, ...equipments];
    const newData1 = [...new Map(allData.map((item) => [item.id, item])).values()];
    setEquipments(newData1);
    setMultipleModal(false);
  };

  const onSpaceModalChange = (field, data) => {
    const newData = data.filter((item) => item.space_name);
    const allData = [...newData, ...spaces];
    const newData1 = [...new Map(allData.map((item) => [item.id, item])).values()];
    setSpaces(newData1);
    setMultipleSpaceModal(false);
  };

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      if (checkedRows && checkedRows.length + 1 === equipments.length) {
        setIsAllChecked(true);
      }
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
    }
  };

  const handleSpaceTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setSpaceCheckRows((state) => [...state, values]);
      if (checkedSpaceRows && checkedSpaceRows.length + 1 === spaces.length) {
        setIsSpaceAllChecked(true);
      }
    } else {
      setSpaceCheckRows(checkedSpaceRows.filter((item) => item.id !== values.id));
      setIsSpaceAllChecked(false);
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = equipments;
      const newArr = [...data, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  const handleSpaceTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = spaces;
      const newArr = [...data, ...checkedSpaceRows];
      setSpaceCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsSpaceAllChecked(true);
    } else {
      setSpaceCheckRows([]);
      setIsSpaceAllChecked(false);
    }
  };

  const onOpenModal = () => {
    if (formValues.category_type === 'e') {
      setMultipleSpaceModal(false);
      setMultipleModal(true);
    } else if (formValues.category_type === 'ah') {
      setMultipleModal(false);
      setMultipleSpaceModal(true);
    }
  };

  const getFiledData = (data) => getColumnArrayById(data, 'id');

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: '100vh',
        overflow: 'auto',
        marginBottom: '30px',
      }}
    >
      <FormControl
        sx={{
          width: '100%',
          padding: '10px 0px 20px 30px',
          // maxHeight: '600px',
          // overflowY: 'scroll',
          overflow: 'auto',
          borderTop: '1px solid #0000001f',
        }}
      >
        <MuiTextFieldStatic
          fullWidth
          sx={{
            width: '100%',
          }}
          name="name"
          label="PPM Title"
          isRequired
          placeholder="Enter PPM Title"
          setFieldValue={onTitleChange}
          variant="standard"
          value={formValues.name}
        />
        <Box
          sx={{
            width: '60%',
            display: 'flex',
            gap: '35px',
          }}
        >
          <Box
            sx={{
              marginTop: '20px',
              width: '20%',
            }}
          >
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              options={getYearsList()}
              name="year"
              label="Maintenance Year"
              isRequired
              open={yearOpen}
              value={formValues.year}
              setValue={onYearChange}
              onOpen={() => {
                setYearOpen(true);
              }}
              onClose={() => {
                setYearOpen(false);
              }}
              getOptionSelected={(option, value) => option.year === value.year}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.year)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Maintenance Year</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
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
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              width: '30%',
            }}
          >
            <FormControl>
              <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={formValues.category_type}
                onChange={handleTypeChange}
              >
                <FormControlLabel value="e" control={<Radio size="small" />} label="Equipment" />
                <FormControlLabel value="ah" control={<Radio size="small" />} label="Space" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box
            sx={{
              marginTop: '30px',
              width: '30%',
            }}
          >
            <Button
              type="button"
              sx={{
                color: 'white',
              }}
              variant="contained"
              className=""
              onClick={() => onOpenModal()}
            >
              Add
              {' '}
              {formValues.category_type === 'e' ? 'Equipments' : 'Spaces'}
            </Button>
          </Box>
        </Box>
      </FormControl>
      {formValues && formValues.category_type === 'e' && equipments && equipments.length > 0 && (
        <div className="p-3">
          <p className="font-family-tab">
            Selected Assets:
            {equipments.length}
          </p>
          <Table responsive>
            <thead className="bg-gray-light font-family-tab">
              <tr>
                <th className="p-2 min-width-100">
                  Name
                </th>
                <th className="p-2 min-width-160">
                  Reference Number
                </th>
                <th className="p-2 min-width-160">
                  Category
                </th>
                <th className="p-2 min-width-160">
                  Block
                </th>
                <th className="p-2 min-width-160">
                  Floor
                </th>
                <th className="p-2 min-width-160">
                  Space
                </th>
                <th className="p-2 min-width-160">
                  Maintenance Team
                </th>
                <th />
              </tr>
            </thead>
            <tbody className="font-family-tab">
              {equipments.map((eq, index) => (
                <tr key={eq.id}>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.name)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.equipment_seq)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.category_id, 'name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.block_id, 'space_name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.floor_id, 'space_name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.location_id, 'path_name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.maintenance_team_id, 'name'))}</span></td>
                  <td className="p-2 align-middle">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="md" icon={faTrashAlt} onClick={() => removeData(eq.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {formValues && formValues.category_type === 'ah' && spaces && spaces.length > 0 && (
        <div className="p-3">
          <p className="font-family-tab">
            Selected Spaces:
            {spaces.length}
          </p>
          <Table responsive>
            <thead className="bg-gray-light font-family-tab">
              <tr>
                <th className="p-2 min-width-100">
                  Name
                </th>
                <th className="p-2 min-width-160">
                  Full Path
                </th>
                <th className="p-2 min-width-160">
                  Category
                </th>

                <th />
              </tr>
            </thead>
            <tbody className="font-family-tab">
              {spaces.map((eq, index) => (
                <tr key={eq.id}>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.space_name)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.path_name)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.asset_category_id && eq.asset_category_id.length > 0 ? eq.asset_category_id[1] : '')}</span></td>
                  <td className="p-2 align-middle">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="md" icon={faTrashAlt} onClick={() => removeSpaceData(eq.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Dialog
        ModalProps={{
          sx: { zIndex: '1100' },
        }}
        maxWidth="xl"
        open={multipleModal}
      >
        <DialogHeader title="Select Assets" imagePath={false} onClose={() => { setMultipleModal(false); }} rightButton />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#F6F8FA',
                padding: '0px',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Suisse Intl',
              }}
            >

              <Assets
                isSearch
                fields={columns}
                onAssetChange={onAssetModalChange}
                oldAssets={equipments && equipments.length > 0 ? getFiledData(equipments) : []}
                afterReset={() => { setMultipleModal(false); }}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        ModalProps={{
          sx: { zIndex: '1100' },
        }}
        maxWidth="xl"
        minWidth="xl"
        open={multipleSpaceModal}
      >
        <DialogHeader title="Select Spaces" imagePath={false} onClose={() => { setMultipleSpaceModal(false); }} rightButton />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#F6F8FA',
                padding: '0px',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Suisse Intl',
              }}
            >
              <MultipleSearchModal
                modelName={appModels.SPACE}
                afterReset={() => { setMultipleSpaceModal(false); }}
                fieldName="location_ids"
                fields={['space_name', 'path_name', 'asset_category_id', 'id']}
                company={userInfo && userInfo.data ? companies : ''}
                setFieldValue={onSpaceModalChange}
                otherFieldName={false}
                noBuildings
                otherFieldValue={false}
                headers={['Path Name', 'Space Name', 'Category']}
                oldValues={spaces && spaces.length > 0 ? getFiledData(spaces) : []}
              />

            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddAssets;
