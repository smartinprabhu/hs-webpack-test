/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';

import { CheckboxField, InputField, FormikAutocomplete } from '@shared/formFields';
import {
  getCovidResources,
} from '../../../setupService';
import {
  getTeamList, getPartners,
} from '../../../../assets/equipmentService';
import { getCategoryList, getSubCategoryList } from '../../../../helpdesk/ticketService';
import {
  lettersOnly, decimalKeyPress, generateErrorMessage, getAllowedCompanies,
} from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const CovidResource = (props) => {
  const {
    formField: {
      covidTitle,
      allowedOccupancyPer,
      enableScreening,
      allowAfterNonCompliance,
      enableCovidConfig,
      enableReportCovidIncident,
      enableLandingPageId,
      enableOtherResourcesId,
      safetyResourcesId,
      enableWorkspaceInstructionId,
      helpLineId,
      ticketCategoryId,
      subCategoryId,
      maintenanceTeamId,
    },
  } = props;
  const dispatch = useDispatch();

  const [landingOpen, setLandingOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const [landingKeyword, setLandingKeyword] = useState('');
  const [wsKeyword, setWsKeyword] = useState('');
  const [otherKeyword, setOtherKeyword] = useState('');
  const [safetyKeyword, setSafetyKeyword] = useState('');
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');

  const { values: formValues } = useFormikContext();
  const {
    enable_landing_page_id, enable_other_resources_id, safety_resources_id, enable_workspace_instruction_id,
    help_line_id, ticket_category_id, sub_category_id, maintenance_team_id,
  } = formValues;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { covidResources } = useSelector((state) => state.setup);
  const { teamsInfo, partnersInfo } = useSelector((state) => state.equipment);
  const { categoryInfo, subCategoryInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && landingOpen) {
        await dispatch(getCovidResources(companies, appModels.COVIDRESOURCE, landingKeyword));
      }
    })();
  }, [userInfo, landingOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && customerOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'customer', customerKeyword));
      }
    })();
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [userInfo, teamKeyword, teamOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen) {
        await dispatch(getCategoryList(companies, appModels.TICKETCATEGORY, categoryKeyword));
      }
    })();
  }, [userInfo, categoryKeyword, categoryOpen]);

  useEffect(() => {
    (async () => {
      if (subCategoryOpen && (userInfo && userInfo.data) && ((ticket_category_id && ticket_category_id.id) || (ticket_category_id && ticket_category_id.length && ticket_category_id.length > 0))) {
        const cid = ticket_category_id && ticket_category_id.id ? ticket_category_id.id : ticket_category_id[0];
        await dispatch(getSubCategoryList(companies, appModels.TICKETSUBCATEGORY, cid, subCategoryKeyword));
      }
    })();
  }, [userInfo, ticket_category_id, subCategoryKeyword, subCategoryOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && otherOpen) {
        await dispatch(getCovidResources(companies, appModels.COVIDRESOURCE, otherOpen));
      }
    })();
  }, [userInfo, otherKeyword, otherOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && wsOpen) {
        await dispatch(getCovidResources(companies, appModels.COVIDRESOURCE, wsKeyword));
      }
    })();
  }, [userInfo, wsKeyword, wsOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && safetyOpen) {
        await dispatch(getCovidResources(companies, appModels.COVIDRESOURCE, safetyKeyword));
      }
    })();
  }, [userInfo, safetyKeyword, safetyOpen]);

  const onLandingKeywordChange = (event) => {
    setLandingKeyword(event.target.value);
  };

  const onOtherKeywordChange = (event) => {
    setOtherKeyword(event.target.value);
  };

  const onWsKeywordChange = (event) => {
    setWsKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onSafetyKeywordChange = (event) => {
    setSafetyKeyword(event.target.value);
  };

  const onKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onSubKeywordChange = (event) => {
    setSubCategoryKeyword(event.target.value);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  let landingOptions = [];
  let otherOptions = [];
  let wsOptions = [];
  let safetyOptions = [];
  let teamOptions = [];
  let categoryOptions = [];
  let subCategoryOptions = [];
  let customerOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }

  if (categoryInfo && categoryInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }

  if (subCategoryInfo && subCategoryInfo.loading) {
    subCategoryOptions = [{ name: 'Loading..' }];
  }

  if (covidResources && covidResources.loading) {
    if (landingOpen) {
      landingOptions = [{ name: 'Loading..' }];
    }
    if (otherOpen) {
      otherOptions = [{ name: 'Loading..' }];
    }
    if (wsOpen) {
      wsOptions = [{ name: 'Loading..' }];
    }
    if (safetyOpen) {
      safetyOptions = [{ name: 'Loading..' }];
    }
  }

  if (covidResources && covidResources.data) {
    if (landingOpen) {
      const arr = [...landingOptions, ...covidResources.data];
      landingOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (otherOpen) {
      const arr = [...otherOptions, ...covidResources.data];
      otherOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (wsOpen) {
      const arr = [...wsOptions, ...covidResources.data];
      wsOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (safetyOpen) {
      const arr = [...safetyOptions, ...covidResources.data];
      safetyOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  if (enable_landing_page_id && enable_landing_page_id.length && enable_landing_page_id.length > 0) {
    const oldId = [{ id: enable_landing_page_id[0], name: enable_landing_page_id[1] }];
    const newArr = [...landingOptions, ...oldId];
    landingOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (enable_other_resources_id && enable_other_resources_id.length && enable_other_resources_id.length > 0) {
    const oldId = [{ id: enable_other_resources_id[0], name: enable_other_resources_id[1] }];
    const newArr = [...otherOptions, ...oldId];
    otherOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (enable_workspace_instruction_id && enable_workspace_instruction_id.length && enable_workspace_instruction_id.length > 0) {
    const oldId = [{ id: enable_workspace_instruction_id[0], name: enable_workspace_instruction_id[1] }];
    const newArr = [...wsOptions, ...oldId];
    wsOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (safety_resources_id && safety_resources_id.length && safety_resources_id.length > 0) {
    const oldId = [{ id: safety_resources_id[0], name: safety_resources_id[1] }];
    const newArr = [...safetyOptions, ...oldId];
    safetyOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0) {
    const oldId = [{ id: maintenance_team_id[0], name: maintenance_team_id[1] }];
    const newArr = [...teamOptions, ...oldId];
    teamOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (teamsInfo && teamsInfo.data) {
    const arr = [...teamOptions, ...teamsInfo.data];
    teamOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (ticket_category_id && ticket_category_id.length && ticket_category_id.length > 0) {
    const oldId = [{ id: ticket_category_id[0], name: ticket_category_id[1] }];
    const newArr = [...categoryOptions, ...oldId];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (categoryInfo && categoryInfo.data) {
    const arr = [...categoryOptions, ...categoryInfo.data];
    categoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (sub_category_id && sub_category_id.length && sub_category_id.length > 0) {
    const oldId = [{ id: sub_category_id[0], name: sub_category_id[1] }];
    const newArr = [...subCategoryOptions, ...oldId];
    subCategoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (subCategoryInfo && subCategoryInfo.data) {
    const arr = [...subCategoryOptions, ...subCategoryInfo.data];
    subCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (help_line_id && help_line_id.length && help_line_id.length > 0) {
    const oldId = [{ id: help_line_id[0], name: help_line_id[1] }];
    const newArr = [...customerOptions, ...oldId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...subCategoryOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldLpId = enable_landing_page_id && enable_landing_page_id.length && enable_landing_page_id.length > 0 ? enable_landing_page_id[1] : '';
  const oldOrId = enable_other_resources_id && enable_other_resources_id.length && enable_other_resources_id.length > 0 ? enable_other_resources_id[1] : '';
  const oldWsId = enable_workspace_instruction_id && enable_workspace_instruction_id.length && enable_workspace_instruction_id.length > 0 ? enable_workspace_instruction_id[1] : '';
  const oldSrId = safety_resources_id && safety_resources_id.length && safety_resources_id.length > 0 ? safety_resources_id[1] : '';
  const oldTeamId = maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0 ? maintenance_team_id[1] : '';
  const oldCategoryId = ticket_category_id && ticket_category_id.length && ticket_category_id.length > 0 ? ticket_category_id[1] : '';
  const oldSubCategoryId = sub_category_id && sub_category_id.length && sub_category_id.length > 0 ? sub_category_id[1] : '';
  const oldHelpId = help_line_id && help_line_id.length && help_line_id.length > 0 ? help_line_id[1] : '';

  return (
    <Row>
      <Col xs={12} sm={6} lg={6} md={6}>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={covidTitle.name}
            label={covidTitle.label}
            labelClassName="font-weight-500"
            onKeyPress={lettersOnly}
            type="text"
            maxLength="25"
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={enableLandingPageId.name}
            label={enableLandingPageId.label}
            oldValue={oldLpId}
            labelClassName="font-weight-500"
            value={enable_landing_page_id && enable_landing_page_id.name ? enable_landing_page_id.name : oldLpId}
            open={landingOpen}
            size="small"
            onOpen={() => {
              setLandingOpen(true);
              setLandingKeyword('');
            }}
            onClose={() => {
              setLandingOpen(false);
              setLandingKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={landingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onLandingKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {covidResources && covidResources.loading && landingOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(covidResources && covidResources.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(covidResources)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enableScreening.name}
            label={enableScreening.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={enableOtherResourcesId.name}
            label={enableOtherResourcesId.label}
            oldValue={oldOrId}
            labelClassName="font-weight-500"
            value={enable_other_resources_id && enable_other_resources_id.name ? enable_other_resources_id.name : oldOrId}
            open={otherOpen}
            size="small"
            onOpen={() => {
              setOtherOpen(true);
              setOtherKeyword('');
            }}
            onClose={() => {
              setOtherOpen(false);
              setOtherKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={otherOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onOtherKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {covidResources && covidResources.loading && otherOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(covidResources && covidResources.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(covidResources)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={safetyResourcesId.name}
            label={safetyResourcesId.label}
            oldValue={oldSrId}
            labelClassName="font-weight-500"
            value={safety_resources_id && safety_resources_id.name ? safety_resources_id.name : oldSrId}
            open={safetyOpen}
            size="small"
            onOpen={() => {
              setSafetyOpen(true);
              setSafetyKeyword('');
            }}
            onClose={() => {
              setSafetyOpen(false);
              setSafetyKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={safetyOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onSafetyKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {covidResources && covidResources.loading && safetyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(covidResources && covidResources.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(covidResources)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={allowedOccupancyPer.name}
            label={allowedOccupancyPer.label}
            labelClassName="font-weight-500"
            onKeyPress={decimalKeyPress}
            type="text"
            maxLength="10"
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={allowAfterNonCompliance.name}
            label={allowAfterNonCompliance.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enableCovidConfig.name}
            label={enableCovidConfig.label}
          />
        </Col>
        <Col sm="12" md="12" xs="12" lg="12">
          <FormikAutocomplete
            name={helpLineId.name}
            label={helpLineId.label}
            oldValue={oldHelpId}
            labelClassName="font-weight-500"
            value={help_line_id && help_line_id.name ? help_line_id.name : oldHelpId}
            open={customerOpen}
            size="small"
            onOpen={() => {
              setCustomerOpen(true);
              setCustomerKeyword('');
            }}
            onClose={() => {
              setCustomerOpen(false);
              setCustomerKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={customerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(partnersInfo && partnersInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={enableWorkspaceInstructionId.name}
            label={enableWorkspaceInstructionId.label}
            oldValue={oldWsId}
            labelClassName="font-weight-500"
            value={enable_workspace_instruction_id && enable_workspace_instruction_id.name ? enable_workspace_instruction_id.name : oldWsId}
            open={wsOpen}
            size="small"
            onOpen={() => {
              setWsOpen(true);
              setWsKeyword('');
            }}
            onClose={() => {
              setWsOpen(false);
              setWsKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
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
                      {covidResources && covidResources.loading && wsOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(covidResources && covidResources.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(covidResources)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={enableReportCovidIncident.name}
            label={enableReportCovidIncident.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <FormikAutocomplete
            name={ticketCategoryId.name}
            label={ticketCategoryId.label}
            oldValue={oldCategoryId}
            labelClassName="font-weight-500"
            value={ticket_category_id && ticket_category_id.name ? ticket_category_id.name : oldCategoryId}
            open={categoryOpen}
            size="small"
            onOpen={() => {
              setCategoryOpen(true);
              setCategoryKeyword('');
            }}
            onClose={() => {
              setCategoryOpen(false);
              setCategoryKeyword('');
            }}
            loading={categoryInfo && categoryInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoryInfo && categoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(categoryInfo && categoryInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(categoryInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <FormikAutocomplete
            name={subCategoryId.name}
            label={subCategoryId.label}
            oldValue={oldSubCategoryId}
            labelClassName="font-weight-500"
            value={sub_category_id && sub_category_id.name ? sub_category_id.name : oldSubCategoryId}
            open={subCategoryOpen}
            size="small"
            onOpen={() => {
              setSubCategoryOpen(true);
              setSubCategoryKeyword('');
            }}
            onClose={() => {
              setSubCategoryOpen(false);
              setSubCategoryKeyword('');
            }}
            loading={subCategoryInfo && subCategoryInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={subCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onSubKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {subCategoryInfo && subCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(subCategoryInfo && subCategoryInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(subCategoryInfo)}</span></FormHelperText>) }
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={maintenanceTeamId.name}
            label={maintenanceTeamId.label}
            labelClassName="font-weight-500"
            oldValue={oldTeamId}
            value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : oldTeamId}
            open={teamOpen}
            size="small"
            onOpen={() => {
              setTeamOpen(true);
              setTeamKeyword('');
            }}
            onClose={() => {
              setTeamOpen(false);
              setTeamKeyword('');
            }}
            loading={teamsInfo && teamsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={teamOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onTeamKeywordChange}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(teamsInfo && teamsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>) }
        </Col>
      </Col>
    </Row>
  );
};

CovidResource.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default CovidResource;
