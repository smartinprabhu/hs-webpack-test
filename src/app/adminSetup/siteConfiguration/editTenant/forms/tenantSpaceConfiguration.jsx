/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row, Label, Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { CheckboxField, InputField, FormikAutocomplete } from '@shared/formFields';
import {
  getSpacesList,
} from '../../../../helpdesk/ticketService';
import {
  getSpaceSubTypes,
} from '../../../../assets/equipmentService';
import {
  getCheckList,
} from '../../../maintenanceConfiguration/maintenanceService';
import {
  getNeighbourhoods,
  loadNeighbourhoods,
} from '../../../employees/employeeService';
import {
  getChecklistSelected,
} from '../../../setupService';
import {
  generateErrorMessage, integerKeyPress, decimalKeyPress, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
  getAllowedCompanies,
} from '../../../../util/appUtils';
import siteConfigureData from '../../data/siteConfigureData.json';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(1.25),
    width: '100%',
  },
}));

const appModels = require('../../../../util/appModels').default;

const TenantSpaceConfiguration = (props) => {
  const {
    setFieldValue,
    formField: {
      onSpotSpaceBooking,
      createWorkSchedule,
      generateMorAr,
      requireChecklist,
      workScheduleGracePeriod,
      enablePrescreen,
      prescreenPeriod,
      prescreenIsMandatory,
      bookFromOutlook,
      enableAccess,
      skipOccupy,
      detectMask,
      faceDetectionMandatory,
      prereleaseRequired,
      prereleasePeriod,
      autoRelease,
      autoReleaseGracePeriod,
      enableGroupBooking,
      enableBookingForOthers,
      prescreenRequiredEverySchedule,
      conferenceRoomSpaceId,
      officeRoomSpaceId,
      workStationSpaceId,
      buildingSpaceId,
      conferenceSubtypeId,
      officeSubtypeId,
      workstationSubtypeId,
      futureLimit,
      futureLimitUom,
      minimumDuration,
      minimumDurationUom,
      bufferPeriod,
      bufferPeriodUom,
      checkListIds,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [conferenceOpen, setConferenceOpen] = useState(false);
  const [conferenceKeyword, setConferenceKeyword] = useState('');
  const [officeOpen, setOfficeOpen] = useState(false);
  const [officeKeyword, setOfficeKeyword] = useState('');
  const [workstationOpen, setWorkstationOpen] = useState(false);
  const [wsKeyword, setWsKeyword] = useState('');
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [buildingKeyword, setBuildingKeyword] = useState('');
  const [conferenceOpen1, setConferenceOpen1] = useState(false);
  const [conferenceKeyword1, setConferenceKeyword1] = useState('');
  const [officeOpen1, setOfficeOpen1] = useState(false);
  const [officeKeyword1, setOfficeKeyword1] = useState('');
  const [workstationOpen1, setWorkstationOpen1] = useState(false);
  const [wsKeyword1, setWsKeyword1] = useState('');
  const [fluOpen, setFluOpen] = useState(false);
  const [mduOpen, setMduOpen] = useState(false);
  const [bpuOpen, setBpuOpen] = useState(false);
  const [clOpen, setClOpen] = useState(false);
  const typeId = false;

  const { values: formValues } = useFormikContext();
  const {
    conference_room_space_id, office_room_space_id, workstation_space_id, building_space_id,
    conference_room_space_sub_type_id, office_room_space_sub_type_id, workstation_space_sub_type_id,
    future_limit_uom, minimum_duration_uom, buffer_period_uom, check_list_ids, require_checklist,
  } = formValues;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { spacesInfo } = useSelector((state) => state.ticket);
  const { spaceSubTypesInfo } = useSelector((state) => state.equipment);
  const { checklistInfo } = useSelector((state) => state.maintenance);
  const { tenantDetail, checklistSelected } = useSelector((state) => state.setup);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if ((userInfo && userInfo.data) && (tenantDetail && tenantDetail.data)) {
      const limit = 100;
      const offset = 0;
      const customFiltersList = '';
      const sortBy = 'DESC';
      const sortField = 'create_date';
      dispatch(getCheckList(companies, appModels.PPMCHECKLIST, limit, offset, customFiltersList, sortBy, sortField));
    }
  }, [userInfo, tenantDetail]);

  useEffect(() => {
    if (tenantDetail && tenantDetail.data) {
      const ids = tenantDetail.data[0].space_neighbour_ids ? tenantDetail.data[0].space_neighbour_ids : [];
      dispatch(getNeighbourhoods(ids, appModels.SPACE));
    }
  }, [tenantDetail]);

  useEffect(() => {
    if (tenantDetail && tenantDetail.data) {
      const ids = tenantDetail.data[0].check_list_ids ? tenantDetail.data[0].check_list_ids : [];
      dispatch(getChecklistSelected(ids, appModels.PPMCHECKLIST));
    }
  }, [tenantDetail]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        const sortBy = 'DESC';
        const sortField = 'create_date';
        await dispatch(loadNeighbourhoods(companies, appModels.SPACE, sortBy, sortField));
      }
    })();
  }, [userInfo, tenantDetail]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && conferenceOpen) {
        await dispatch(getSpacesList(companies, appModels.SPACE, conferenceKeyword));
      }
    })();
  }, [userInfo, conferenceKeyword, conferenceOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && officeOpen) {
        await dispatch(getSpacesList(companies, appModels.SPACE, officeKeyword));
      }
    })();
  }, [userInfo, officeKeyword, officeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && workstationOpen) {
        await dispatch(getSpacesList(companies, appModels.SPACE, wsKeyword));
      }
    })();
  }, [userInfo, wsKeyword, workstationOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && buildingOpen) {
        await dispatch(getSpacesList(companies, appModels.SPACE, buildingKeyword));
      }
    })();
  }, [userInfo, buildingKeyword, buildingOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && conferenceOpen1) {
        await dispatch(getSpaceSubTypes(companies, appModels.SPACESUBTYPE, typeId, conferenceKeyword1));
      }
    })();
  }, [userInfo, conferenceKeyword1, conferenceOpen1]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && officeOpen1) {
        await dispatch(getSpaceSubTypes(companies, appModels.SPACESUBTYPE, typeId, officeKeyword1));
      }
    })();
  }, [userInfo, officeKeyword1, officeOpen1]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && workstationOpen1) {
        await dispatch(getSpaceSubTypes(companies, appModels.SPACESUBTYPE, typeId, wsKeyword1));
      }
    })();
  }, [userInfo, wsKeyword1, workstationOpen1]);

  const onConferenceKeywordChange = (event) => {
    setConferenceKeyword(event.target.value);
  };

  const onOfficeKeywordChange = (event) => {
    setOfficeKeyword(event.target.value);
  };

  const onWsKeywordChange = (event) => {
    setWsKeyword(event.target.value);
  };

  const onBuildingKeywordChange = (event) => {
    setBuildingKeyword(event.target.value);
  };

  const onConferenceKeywordChange1 = (event) => {
    setConferenceKeyword1(event.target.value);
  };

  const onOfficeKeywordChange1 = (event) => {
    setOfficeKeyword1(event.target.value);
  };

  const onWsKeywordChange1 = (event) => {
    setWsKeyword1(event.target.value);
  };

  let conferenceOptions = [];
  let officeOptions = [];
  let wsOptions = [];
  let buildingOptions = [];

  let conferenceOptions1 = [];
  let officeOptions1 = [];
  let wsOptions1 = [];

  if (spacesInfo && spacesInfo.loading) {
    if (conferenceOpen) {
      conferenceOptions = [{ path_name: 'Loading..' }];
    }
    if (officeOpen) {
      officeOptions = [{ path_name: 'Loading..' }];
    }
    if (workstationOpen) {
      wsOptions = [{ path_name: 'Loading..' }];
    }
    if (buildingOpen) {
      buildingOptions = [{ path_name: 'Loading..' }];
    }
  }

  if (spaceSubTypesInfo && spaceSubTypesInfo.loading) {
    if (conferenceOpen1) {
      conferenceOptions1 = [{ name: 'Loading..' }];
    }
    if (officeOpen1) {
      officeOptions1 = [{ name: 'Loading..' }];
    }
    if (workstationOpen1) {
      wsOptions1 = [{ name: 'Loading..' }];
    }
  }

  if (conference_room_space_id && conference_room_space_id.length && conference_room_space_id.length > 0) {
    const oldId = [{ id: conference_room_space_id[0], path_name: conference_room_space_id[1] }];
    const newArr = [...conferenceOptions, ...oldId];
    conferenceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (office_room_space_id && office_room_space_id.length && office_room_space_id.length > 0) {
    const oldId = [{ id: office_room_space_id[0], path_name: office_room_space_id[1] }];
    const newArr = [...officeOptions, ...oldId];
    officeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (workstation_space_id && workstation_space_id.length && workstation_space_id.length > 0) {
    const oldId = [{ id: workstation_space_id[0], path_name: workstation_space_id[1] }];
    const newArr = [...wsOptions, ...oldId];
    wsOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (building_space_id && building_space_id.length && building_space_id.length > 0) {
    const oldId = [{ id: building_space_id[0], path_name: building_space_id[1] }];
    const newArr = [...buildingOptions, ...oldId];
    buildingOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (conference_room_space_sub_type_id && conference_room_space_sub_type_id.length && conference_room_space_sub_type_id.length > 0) {
    const oldId = [{ id: conference_room_space_sub_type_id[0], name: conference_room_space_sub_type_id[1] }];
    const newArr = [...conferenceOptions1, ...oldId];
    conferenceOptions1 = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (office_room_space_sub_type_id && office_room_space_sub_type_id.length && office_room_space_sub_type_id.length > 0) {
    const oldId = [{ id: office_room_space_sub_type_id[0], name: office_room_space_sub_type_id[1] }];
    const newArr = [...officeOptions1, ...oldId];
    officeOptions1 = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (workstation_space_sub_type_id && workstation_space_sub_type_id.length && workstation_space_sub_type_id.length > 0) {
    const oldId = [{ id: workstation_space_sub_type_id[0], name: workstation_space_sub_type_id[1] }];
    const newArr = [...wsOptions1, ...oldId];
    wsOptions1 = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (spacesInfo && spacesInfo.data) {
    if (conferenceOpen) {
      const arr = [...conferenceOptions, ...spacesInfo.data];
      conferenceOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (officeOpen) {
      const arr = [...officeOptions, ...spacesInfo.data];
      officeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (workstationOpen) {
      const arr = [...wsOptions, ...spacesInfo.data];
      wsOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (buildingOpen) {
      const arr = [...buildingOptions, ...spacesInfo.data];
      buildingOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  if (spaceSubTypesInfo && spaceSubTypesInfo.data) {
    if (conferenceOpen1) {
      const arr = [...conferenceOptions1, ...spaceSubTypesInfo.data];
      conferenceOptions1 = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (officeOpen1) {
      const arr = [...officeOptions1, ...spaceSubTypesInfo.data];
      officeOptions1 = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (workstationOpen1) {
      const arr = [...wsOptions1, ...spaceSubTypesInfo.data];
      wsOptions1 = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  const oldCrId = conference_room_space_id && conference_room_space_id.length && conference_room_space_id.length > 0 ? conference_room_space_id[1] : '';
  const oldOrId = office_room_space_id && office_room_space_id.length && office_room_space_id.length > 0 ? office_room_space_id[1] : '';
  const oldWsId = workstation_space_id && workstation_space_id.length && workstation_space_id.length > 0 ? workstation_space_id[1] : '';
  const oldBsId = building_space_id && building_space_id.length && building_space_id.length > 0 ? building_space_id[1] : '';

  const oldCrId1 = conference_room_space_sub_type_id && conference_room_space_sub_type_id.length && conference_room_space_sub_type_id.length > 0 ? conference_room_space_sub_type_id[1] : '';
  const oldOrId1 = office_room_space_sub_type_id && office_room_space_sub_type_id.length && office_room_space_sub_type_id.length > 0 ? office_room_space_sub_type_id[1] : '';
  const oldWsId1 = workstation_space_sub_type_id && workstation_space_sub_type_id.length && workstation_space_sub_type_id.length > 0 ? workstation_space_sub_type_id[1] : '';

  return (
    <Row>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>General Settings</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={onSpotSpaceBooking.name}
            label={onSpotSpaceBooking.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={createWorkSchedule.name}
            label={createWorkSchedule.label}
          />
        </Col>
        <Row>
          <Col xs={12} sm={6} lg={6} md={6}>
            <InputField
              name={futureLimit.name}
              label={futureLimit.label}
              labelClassName="font-weight-500"
              onKeyPress={integerKeyPress}
              type="text"
              maxLength="3"
            />
          </Col>
          <Col sm="6" md="6" xs="12" lg="6" className="mt-3">
            <FormikAutocomplete
              name={futureLimitUom.name}
              label=""
              labelClassName="font-weight-500"
              formGroupClassName="mt-1 w-100"
              oldValue={future_limit_uom || ''}
              value={future_limit_uom && future_limit_uom.label ? future_limit_uom.label : future_limit_uom}
              open={fluOpen}
              size="small"
              onOpen={() => {
                setFluOpen(true);
              }}
              onClose={() => {
                setFluOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={siteConfigureData.dates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="bg-white without-padding"
                  placeholder="Search & Select"
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
          </Col>
          <Col xs={12} sm={6} lg={6} md={6}>
            <InputField
              name={minimumDuration.name}
              label={minimumDuration.label}
              labelClassName="font-weight-500"
              onKeyPress={integerKeyPress}
              type="text"
              maxLength="3"
            />
          </Col>
          <Col sm="6" md="6" xs="12" lg="6" className="mt-3">
            <FormikAutocomplete
              name={minimumDurationUom.name}
              label=""
              labelClassName="font-weight-500"
              formGroupClassName="mt-1 w-100"
              oldValue={minimum_duration_uom || ''}
              value={minimum_duration_uom && minimum_duration_uom.label ? minimum_duration_uom.label : minimum_duration_uom}
              open={mduOpen}
              size="small"
              onOpen={() => {
                setMduOpen(true);
              }}
              onClose={() => {
                setMduOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={siteConfigureData.times}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="bg-white without-padding"
                  placeholder="Search & Select"
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
          </Col>
          <Col xs={12} sm={6} lg={6} md={6}>
            <InputField
              name={bufferPeriod.name}
              label={bufferPeriod.label}
              labelClassName="font-weight-500"
              onKeyPress={integerKeyPress}
              type="text"
              maxLength="3"
            />
          </Col>
          <Col sm="6" md="6" xs="12" lg="6" className="mt-3">
            <FormikAutocomplete
              name={bufferPeriodUom.name}
              label=""
              labelClassName="font-weight-500"
              formGroupClassName="mt-1 w-100"
              oldValue={buffer_period_uom || ''}
              value={buffer_period_uom && buffer_period_uom.label ? buffer_period_uom.label : buffer_period_uom}
              open={bpuOpen}
              size="small"
              onOpen={() => {
                setBpuOpen(true);
              }}
              onClose={() => {
                setBpuOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={siteConfigureData.times}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="bg-white without-padding"
                  placeholder="Search & Select"
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
          </Col>
        </Row>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Maintenance</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={generateMorAr.name}
            label={generateMorAr.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={requireChecklist.name}
            label={requireChecklist.label}
          />
        </Col>
        {require_checklist && (
        <Col sm="12" md="12" xs="12" lg="12">
          <FormControl className={classes.margin}>
            <Label for={checkListIds.name}>
              {checkListIds.label}
            </Label>
            {(checklistInfo && checklistInfo.loading) || (checklistSelected && checklistSelected.loading) ? (
              <Spinner />
            )
              : (
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  limitTags={3}
                  id="tags-filled"
                  name={checkListIds.name}
                  label={checkListIds.label}
                  open={clOpen}
                  size="small"
                  onOpen={() => {
                    setClOpen(true);
                  }}
                  onClose={() => {
                    setClOpen(false);
                  }}
                  loading={checklistInfo && checklistInfo.loading}
                  options={checklistInfo && checklistInfo.data ? getArrayFromValuesById(checklistInfo.data, isAssociativeArray(check_list_ids), 'id') : []}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  defaultValue={checklistSelected && checklistSelected.data ? checklistSelected.data : []}
                  onChange={(e, data) => setFieldValue('check_list_ids', data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Search & Select"
                      className="bg-white without-padding"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(checklistInfo && checklistInfo.loading) || (checklistSelected && checklistSelected.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            {(checklistInfo && checklistInfo.err && !checklistInfo.loading && !checklistInfo.data) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(checklistInfo)}</span></FormHelperText>
            )}
          </FormControl>
        </Col>
        )}
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={workScheduleGracePeriod.name}
            label={workScheduleGracePeriod.label}
            labelClassName="font-weight-500"
            onKeyPress={integerKeyPress}
            type="text"
            maxLength="2"
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Prescreen</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enablePrescreen.name}
            label={enablePrescreen.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={prescreenPeriod.name}
            label={prescreenPeriod.label}
            labelClassName="font-weight-500"
            onKeyPress={decimalKeyPress}
            type="text"
            maxLength="10"
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={prescreenIsMandatory.name}
            label={prescreenIsMandatory.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Booking</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={bookFromOutlook.name}
            label={bookFromOutlook.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Access</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enableAccess.name}
            label={enableAccess.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={skipOccupy.name}
            label={skipOccupy.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={detectMask.name}
            label={detectMask.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={faceDetectionMandatory.name}
            label={faceDetectionMandatory.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Prerelease</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={prereleaseRequired.name}
            label={prereleaseRequired.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={prereleasePeriod.name}
            label={prereleasePeriod.label}
            labelClassName="font-weight-500"
            onKeyPress={decimalKeyPress}
            type="text"
            maxLength="10"
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={autoRelease.name}
            label={autoRelease.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={autoReleaseGracePeriod.name}
            label={autoReleaseGracePeriod.label}
            labelClassName="font-weight-500"
            onKeyPress={integerKeyPress}
            type="text"
            maxLength="5"
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Space Sub Types</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={conferenceSubtypeId.name}
            label={conferenceSubtypeId.label}
            oldValue={oldCrId1}
            labelClassName="font-weight-500"
            value={conference_room_space_sub_type_id && conference_room_space_sub_type_id.name ? conference_room_space_sub_type_id.name : oldCrId1}
            open={conferenceOpen1}
            size="small"
            onOpen={() => {
              setConferenceOpen1(true);
              setConferenceKeyword1('');
            }}
            onClose={() => {
              setConferenceOpen1(false);
              setConferenceKeyword1('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={conferenceOptions1}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onConferenceKeywordChange1}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceSubTypesInfo && spaceSubTypesInfo.loading && conferenceOpen1 ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spaceSubTypesInfo && spaceSubTypesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceSubTypesInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={officeSubtypeId.name}
            label={officeSubtypeId.label}
            oldValue={oldOrId1}
            labelClassName="font-weight-500"
            value={office_room_space_sub_type_id && office_room_space_sub_type_id.name ? office_room_space_sub_type_id.name : oldOrId1}
            open={officeOpen1}
            size="small"
            onOpen={() => {
              setOfficeOpen1(true);
              setOfficeKeyword1('');
            }}
            onClose={() => {
              setOfficeOpen1(false);
              setOfficeKeyword1('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={officeOptions1}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onOfficeKeywordChange1}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceSubTypesInfo && spaceSubTypesInfo.loading && officeOpen1 ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spaceSubTypesInfo && spaceSubTypesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceSubTypesInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={workstationSubtypeId.name}
            label={workstationSubtypeId.label}
            oldValue={oldWsId1}
            labelClassName="font-weight-500"
            value={workstation_space_sub_type_id && workstation_space_sub_type_id.name ? workstation_space_sub_type_id.name : oldWsId1}
            open={workstationOpen1}
            size="small"
            onOpen={() => {
              setWorkstationOpen1(true);
              setWsKeyword1('');
            }}
            onClose={() => {
              setWorkstationOpen1(false);
              setWsKeyword1('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={wsOptions1}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onWsKeywordChange1}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceSubTypesInfo && spaceSubTypesInfo.loading && workstationOpen1 ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spaceSubTypesInfo && spaceSubTypesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceSubTypesInfo)}</span></FormHelperText>) }
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-2">
        <h6>Parent Spaces</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={conferenceRoomSpaceId.name}
            label={conferenceRoomSpaceId.label}
            oldValue={oldCrId}
            labelClassName="font-weight-500"
            value={conference_room_space_id && conference_room_space_id.path_name ? conference_room_space_id.path_name : oldCrId}
            open={conferenceOpen}
            size="small"
            onOpen={() => {
              setConferenceOpen(true);
              setConferenceKeyword('');
            }}
            onClose={() => {
              setConferenceOpen(false);
              setConferenceKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={conferenceOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onConferenceKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spacesInfo && spacesInfo.loading && conferenceOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={officeRoomSpaceId.name}
            label={officeRoomSpaceId.label}
            oldValue={oldOrId}
            labelClassName="font-weight-500"
            value={office_room_space_id && office_room_space_id.path_name ? office_room_space_id.path_name : oldOrId}
            open={officeOpen}
            size="small"
            onOpen={() => {
              setOfficeOpen(true);
              setOfficeKeyword('');
            }}
            onClose={() => {
              setOfficeOpen(false);
              setOfficeKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={officeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onOfficeKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spacesInfo && spacesInfo.loading && officeOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={workStationSpaceId.name}
            label={workStationSpaceId.label}
            oldValue={oldWsId}
            labelClassName="font-weight-500"
            value={workstation_space_id && workstation_space_id.path_name ? workstation_space_id.path_name : oldWsId}
            open={workstationOpen}
            size="small"
            onOpen={() => {
              setWorkstationOpen(true);
              setWsKeyword('');
            }}
            onClose={() => {
              setWorkstationOpen(false);
              setWsKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={wsOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onWsKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spacesInfo && spacesInfo.loading && workstationOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={buildingSpaceId.name}
            label={buildingSpaceId.label}
            oldValue={oldBsId}
            labelClassName="font-weight-500"
            value={building_space_id && building_space_id.path_name ? building_space_id.path_name : oldBsId}
            open={buildingOpen}
            size="small"
            onOpen={() => {
              setBuildingOpen(true);
              setBuildingKeyword('');
            }}
            onClose={() => {
              setBuildingOpen(false);
              setBuildingKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={buildingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onBuildingKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spacesInfo && spacesInfo.loading && buildingOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>) }
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <h6>Group Booking</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enableGroupBooking.name}
            label={enableGroupBooking.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enableBookingForOthers.name}
            label={enableBookingForOthers.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={prescreenRequiredEverySchedule.name}
            label={prescreenRequiredEverySchedule.label}
          />
        </Col>
      </Col>
    </Row>
  );
};

TenantSpaceConfiguration.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default TenantSpaceConfiguration;
