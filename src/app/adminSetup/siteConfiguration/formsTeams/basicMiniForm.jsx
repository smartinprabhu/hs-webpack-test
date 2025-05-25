/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  Dialog, DialogContent, DialogContentText, TextField
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table
} from 'reactstrap';

import addIcon from '@images/icons/plusCircleGrey.svg';
import makeStyles from '@mui/styles/makeStyles';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  avoidSpaceOnFirstCharacter,
  generateErrorMessage,
  getAllowedCompanies
} from '../../../util/appUtils';
import {
  getTeamCategory,
} from '../../setupService';
import SearchModalUnique from './searchModalUnique';
import { infoValue } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  root: {
    '& .MuiFormLabel-asterisk': {
      color: 'red',
    },
  },
});

const ProductForm = (props) => {
  const {
    formField,
    setFieldValue,
    setPartsData,
    partsData,
    setPartsAdd,
  } = props;
  const { values } = useFormikContext();
  const { values: formValues } = useFormikContext();
  const dispatch = useDispatch();
  const [teamCategoryOpen, setTeamCategoryOpen] = useState(false);
  const [teamCategoryKeyword, setTeamCategoryKeyword] = useState('');
  const [workingTimeOpen, setWorkingTimeOpen] = useState(false);
  const [workingTimeKeyword, setWorkingTimeKeyword] = useState('');
  const [maintenanceCostOpen, setMaintenanceCostOpen] = useState(false);
  const [maintenanceCostKeyword, setMaintenanceCostKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [modalName, setModalName] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [placeholderName, setPlaceholder] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [columns, setColumns] = useState([]);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    maintenanceCostInfo, teamCategoryInfo, workingTimeInfo,
  } = useSelector((state) => state.setup);

  const classes = useStyles();

  /* useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getWorkingTime(companies, appModels.RESOURCECALENDAR, workingTimeKeyword));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getMaintenanceCostAnalysis(companies, appModels.ACCOUNT, maintenanceCostKeyword));
      }
    })();
  }, []); */

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    const defaultData = userInfo && userInfo.data && userInfo.data.company;
    newData.push({
      id: false,
      maintenance_cost_analytic_account_id: maintenanceCostInfo && maintenanceCostInfo.data.length && maintenanceCostInfo.data[0],
      resource_calendar_id: workingTimeInfo && workingTimeInfo.data.length && workingTimeInfo.data[0],
      company_id: defaultData.id,
      // team_category_id: teamCategoryInfo && teamCategoryInfo.data && teamCategoryInfo.data.length && teamCategoryInfo.data[0],
      team_category_id: '',
      name: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  /* useEffect(() => {
    if (!didLoad && workingTimeInfo && workingTimeInfo.data && workingTimeInfo.data.length
      && maintenanceCostInfo && maintenanceCostInfo.data && maintenanceCostInfo.data.length) {
      loadEmptyTd();
      setDidLoad(true);
    }
  }, [maintenanceCostInfo]); */

  /* useEffect(() => {
    if (!didLoad && workingTimeInfo && workingTimeInfo.data && workingTimeInfo.data.length
      && maintenanceCostInfo && maintenanceCostInfo.data && maintenanceCostInfo.data.length
      && teamCategoryInfo && teamCategoryInfo.data && teamCategoryInfo.data.length) {
      loadEmptyTd();
      setDidLoad(true);
    }
  }, [teamCategoryInfo]); */

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof teamCategoryOpen === 'number') {
        await dispatch(getTeamCategory(companies, appModels.CATEGORY, teamCategoryKeyword));
      }
    })();
  }, [userInfo, teamCategoryOpen, teamCategoryKeyword]);

  /* useEffect(() => {
    if (workingTimeInfo && workingTimeInfo.data && workingTimeInfo.data.length) {
      const defaultData = workingTimeInfo.data;
      if (defaultData && defaultData.length && !values.resource_calendar_id) {
        setFieldValue('resource_calendar_id', defaultData[0]);
      }
    }
  }, [workingTimeInfo]);

  useEffect(() => {
    if (maintenanceCostInfo && maintenanceCostInfo.data && maintenanceCostInfo.data.length) {
      const defaultData = maintenanceCostInfo.data;
      if (defaultData && defaultData.length && !values.maintenance_cost_analytic_account_id) {
        setFieldValue('maintenance_cost_analytic_account_id', defaultData[0]);
      }
    }
  }, [maintenanceCostInfo]);
  useEffect(() => {
    if (userInfo && userInfo.data) {
      const defaultData = userInfo && userInfo.data && userInfo.data.company;
      if (defaultData && defaultData.id) {
        setFieldValue('company_id', defaultData);
      }
    }
  }, [userInfo]); */

  const onTeamCategoryKeywordChange = (event) => {
    setTeamCategoryKeyword(event.target.value);
  };

  let teamCategoryOptions = [];

  if (teamCategoryInfo && teamCategoryInfo.loading) {
    teamCategoryOptions = [{ name: 'Loading..' }];
  }
  if (teamCategoryInfo && teamCategoryInfo.data) {
    teamCategoryOptions = teamCategoryInfo.data;
  }

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

  const onTeamChange = (e, index) => {
    const newData = partsData;
    newData[index].team_category_id = [e.id, e.name];
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onNameChange = (e, index) => {
    const newData = [...partsData];
    newData[index] = { ...newData[index], name: e.target.value };
    setPartsData(newData);
    setPartsAdd(Math.random());
    if (e.target.value && index + 1 === newData.length) {
      loadEmptyTd();
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Table id="spare-part">
          <thead className="bg-lightblue">
            <tr>
              <th className="p-2 min-width-160 border-0 font-family-tab table-column-no-top z-Index-1210">
                Name
                <span className="text-danger ml-1">*</span>
                {infoValue('teamname')}
              </th>
              <th className="p-2 min-width-160 border-0 font-family-tab table-column-no-top z-Index-1210">
                Category
                <span className="text-danger ml-1">*</span>
                {infoValue('teamcategory')}
              </th>
              <th className="p-2 min-width-160 border-0 font-family-tab table-column-no-top z-Index-1210" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan="7" className="text-left table-column-no-bg bg-white z-Index-1210">
                <div aria-hidden="true" className="font-weight-800 text-lightblue bg-white cursor-pointer mb-1" onClick={loadEmptyTd}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-5 font-family-tab">Add Team</span>
                </div>
              </th>
            </tr>
            {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
              <>
                {!pl.isRemove && (
                  <tr key={index}>
                    <td className="p-2">
                      <TextField
                        variant="outlined"
                        type="text"
                        name="name"
                        size="small"
                        className="w-100"
                        value={pl.name}
                        onChange={(e) => onNameChange(e, index)}
                        onKeyDown={pl && pl.name ? '' : avoidSpaceOnFirstCharacter}
                        inputProps={{ maxLength: 150 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </td>
                    <td className="p-2">
                      <>
                        <Autocomplete
                          name={formField.teamCategory.name}
                          label={formField.teamCategory.label}
                          isRequired={formField.teamCategory.required}
                          className="bg-white w-100"
                          open={teamCategoryOpen === index}
                          size="small"
                          value={pl.team_category_id && pl.team_category_id.length
                            ? pl.team_category_id[1] : pl.team_category_id && pl.team_category_id.name
                              ? pl.team_category_id.name : ''}
                          onOpen={() => {
                            setTeamCategoryOpen(index);
                            setTeamCategoryKeyword('');
                          }}
                          onClose={() => {
                            setTeamCategoryOpen(false);
                            setTeamCategoryKeyword('');
                          }}
                          disableClearable
                          onChange={(e, data) => { onTeamChange(data, index); }}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={teamCategoryOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              onChange={onTeamCategoryKeywordChange}
                              // label={(formField.teamCategory.label)}
                              variant="outlined"
                              // InputLabelProps={{ classes, shrink: true }}
                              className="without-padding"
                              placeholder="Select Category"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {teamCategoryInfo && teamCategoryInfo.loading && teamCategoryOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(teamCategoryInfo && teamCategoryInfo.err && teamCategoryOpen)
                          && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamCategoryInfo)}</span></FormHelperText>)}
                      </>
                    </td>
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
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalUnique
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              modalName={modalName}
              onProductChange={onTeamChange}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

ProductForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  productValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default ProductForm;
