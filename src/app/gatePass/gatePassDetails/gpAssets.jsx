/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Label,
  Card,
  CardBody,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGridStringOperators,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid-pro';
import { Box } from '@mui/system';
import {
  Button, Dialog, DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import {
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import DetailViewFormat from '@shared/detailViewFormat';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import DialogHeader from '../../commonComponents/dialogHeader';
import CommonGrid from '../../commonComponents/commonGridStaticData';
import MuiNoFormTextField from '../../commonComponents/formFields/muiNoFormTextField';

import {
  getDefaultNoValue, extractNameObject, getAllowedCompanies,
  generateErrorMessage, getListOfModuleOperations, truncate,
} from '../../util/appUtils';
import { assetStatusJson } from '../../commonComponents/utils/util';
import {
  getLabelList,
} from '../../siteOnboarding/siteService';
import { updateEquipmentData, resetUpdateEquipment } from '../../assets/equipmentService';
import {
  getGatePassDetails,
} from '../gatePassService';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const SlaMatrix = () => {
  const {
    gatePassDetails,
    gatePassLoading,
  } = useSelector((state) => state.gatepass);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const loading = gatePassDetails && gatePassDetails.loading;
  const isErr = gatePassDetails && gatePassDetails.err;
  const inspDeata = gatePassDetails && gatePassDetails.data && gatePassDetails.data.length ? gatePassDetails.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.asset_lines && inspDeata.asset_lines.length > 0);

  const dispatch = useDispatch();
  const limit = 10;
  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [pageData, setPageData] = useState([]);

  const [currentAsset, setCurrentAsset] = useState(false);
  const [currentModal, setCurrentModal] = useState(false);
  const [currentData, setCurrentData] = useState(false);

  const [attName, setAttName] = useState('');
  const [attValue, setAttValue] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');

  const [addAttributeModal, showAddAttributeModal] = useState(false);

  const { labelListInfo } = useSelector((state) => state.site);
  const {
    updateEquipment,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Gate Pass', 'code');

  const isAttributeCreatable = allowedOperations.includes(actionCodes['Create Asset Attribute']);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        asset_id: true,
        parts_qty: true,
        description: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (updateEquipment && updateEquipment.data && inspDeata) {
      dispatch(getGatePassDetails(inspDeata.id, appModels.GATEPASS, 'noLoad'));
    }
  }, [updateEquipment]);

  useEffect(() => {
    if (inspDeata && currentAsset) {
      const data = inspDeata.asset_lines && inspDeata.asset_lines ? inspDeata.asset_lines : [];
      const newData = data.filter((item) => item.id === currentAsset);
      setCurrentData(newData && newData.length ? newData[0] : false);
    }
  }, [gatePassDetails]);

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    const endValue = offsetValue + limit;
    setPage(page);
    const paginatedData = inspDeata.asset_lines.slice(offsetValue, Math.min(endValue, inspDeata.asset_lines.length));
    setPageData(paginatedData);
  };

  const onViewAttributes = (id) => {
    dispatch(resetUpdateEquipment());
    setCurrentAsset(id);
    setCurrentModal(true);
    const data = inspDeata.asset_lines && inspDeata.asset_lines ? inspDeata.asset_lines : [];
    const newData = data.filter((item) => item.id === id);
    setCurrentData(newData && newData.length ? newData[0] : false);
  };

  const onCloseAttributes = () => {
    dispatch(resetUpdateEquipment());
    setCurrentModal(false);
    setCurrentAsset(false);
    setCurrentData(false);
  };

  useEffect(() => {
    if (isChecklist) {
      setPageData(inspDeata.asset_lines.slice(0, 10));
    } else {
      setPageData([]);
    }
  }, [gatePassDetails]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getLabelList(companies, appModels.SPACELABEL, nameKeyword));
    }
  }, [nameKeyword]);

  const getValue = (value) => {
    let fieldValue = value || '-';
    if (Array.isArray(fieldValue)) {
      fieldValue = value[1];
    } else if (fieldValue && typeof fieldValue === 'object' && !Object.keys(fieldValue).length) {
      fieldValue = '-';
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
      fieldValue = value.name;
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.path_name) {
      fieldValue = value.path_name;
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.space_name) {
      fieldValue = value.space_name;
    }
    return fieldValue;
  };

  const CheckStatus = (val) => (
    <>
      {val.json && val.json.map((statusData) => (
        <strong>
          {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
          <Box
            sx={{
              backgroundColor: statusData.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: statusData.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {statusData.text}
          </Box>
          )}
        </strong>
      ))}
    </>
  );

  const columns = () => (
    [
      {
        field: 'asset_id',
        headerName: 'Name',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => extractNameObject(params.value, 'name'),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'parts_qty',
        headerName: 'Quantity (kg)',
        flex: 1,
        minWidth: 100,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 2, // More space for longer text
        minWidth: 200,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        renderCell: (params) => {
          const val = params.value;
          const displayValue = getDefaultNoValue(val);
          return displayValue && displayValue.length > 50 ? (
            <Tooltip title={displayValue} placement="top">
              <span>{truncate(displayValue, 50)}</span>
            </Tooltip>
          ) : (
            <span>{displayValue}</span>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 120,
        editable: true,
        filterable: false,
        valueGetter: (params) => getValue(params.value),
        renderCell: (val) => (
          <Tooltip title="View Asset Additional Data">
            <span className="font-weight-400 d-inline-block" />
            <FontAwesomeIcon
              className="mr-1 ml-1 cursor-pointer"
              size="sm"
              icon={faEye}
            />
          </Tooltip>
        ),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
    ]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].location_id, 'path_name'))}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].category_id, 'name'))}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].serial)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].brand)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  const addAttributeWindow = () => {
    dispatch(resetUpdateEquipment());
    setAttName('');
    setAttValue('');
    showAddAttributeModal(true);
  };

  const closeAttributeWindow = () => {
    dispatch(resetUpdateEquipment());
    setAttName('');
    setAttValue('');
    showAddAttributeModal(false);
  };

  const onFilterChange = (data) => {
    if (data.items && data.items.length) {
      setPage(0);
    }
  };

  const onNameKeyWordChange = (e) => {
    setNameKeyword(e.target.value);
  };

  const onValueChange = (field, data) => {
    setAttValue(data);
  };

  const onAttributeCreate = () => {
    const postData = {
      space_label_ids: [[0, 0,
        {
          space_label_id: attName && attName.id ? attName.id : false,
          space_value: attValue,
        }]],
    };
    const newData = gatePassDetails.data[0].asset_lines.filter((item) => item.id === currentAsset);
    if (newData && newData[0] && newData[0].asset_id && newData[0].asset_id.id) {
      dispatch(updateEquipmentData(newData[0].asset_id.id, postData, appModels.EQUIPMENT));
    }
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab product-orders">
        {isChecklist && (
          <div>
            <CommonGrid
              className="reports-table-tab"
              componentClassName="commonGrid"
              tableData={gatePassDetails.data[0].asset_lines}
              page={page}
              columns={columns()}
              rowCount={gatePassDetails.data[0].asset_lines.length}
              limit={limit}
              checkboxSelection
              pagination
              disableRowSelectionOnClick
              exportFileName="Assets Info"
              listCount={gatePassDetails.data[0].asset_lines.length}
              visibleColumns={visibleColumns}
              onFilterChanges={onFilterChange}
              removeData={onViewAttributes}
              setVisibleColumns={setVisibleColumns}
              loading={gatePassDetails && gatePassDetails.loading}
              err={gatePassDetails && gatePassDetails.err}
              noHeader
              handlePageChange={handlePageChange}
            />
          </div>
        )}
        <DetailViewFormat detailResponse={gatePassDetails} />
        {!isErr && inspDeata && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        <Dialog maxWidth="md" open={currentModal}>
          <DialogHeader title={currentData && currentData.asset_id && currentData.asset_id.name ? currentData.asset_id.name : 'Asset'} imagePath={false} onClose={() => onCloseAttributes()} sx={{ width: '800px' }} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Row>
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="p-2 bg-lightblue h-100">
                    <CardBody className="bg-color-white p-1 m-0">
                      <Row className="pl-2 pr-2 pb-0 pt-0">
                        <Col sm="12" md="7" lg="7" xs="12">
                          <div className="mt-2">
                            <span className="p-0 font-weight-600 font-medium mr-2">
                              Total :
                              {' '}
                              {currentData && currentData.asset_id && currentData.asset_id.space_label_ids && currentData.asset_id.space_label_ids.length}
                            </span>
                          </div>
                        </Col>
                        <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                          {isAttributeCreatable && (
                          <Tooltip title="Add Attribute" placement="top">
                            <img
                              aria-hidden="true"
                              id="Add"
                              alt="Add"
                              className="cursor-pointer mr-3 mt-2"
                              onClick={addAttributeWindow}
                              src={plusCircleMiniIcon}
                            />
                          </Tooltip>
                          )}
                        </Col>
                      </Row>
                      {gatePassLoading && (
                      <div className="text-center mt-3">
                        <Loader />
                      </div>
                      )}
                      {!gatePassLoading && (
                      <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
                        {(currentData && currentData.asset_id && currentData.asset_id.space_label_ids.length > 0) && (
                        <Table responsive>
                          <thead className="bg-gray-light">
                            <tr>
                              <th className="p-2 min-width-160">
                                Name
                              </th>
                              <th className="p-2 min-width-160">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.asset_id.space_label_ids.map((cs) => (
                              <tr key={cs.id}>
                                <td className="p-2">{getDefaultNoValue(extractNameObject(cs.space_label_id, 'name'))}</td>
                                <td className="p-2">{getDefaultNoValue(cs.space_value)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        )}
                        {!(currentData && currentData.asset_id && currentData.asset_id.space_label_ids.length > 0) && (
                        <SuccessAndErrorFormat response={false} staticErrorMsg="No Data Found." />
                        )}
                      </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog maxWidth="md" open={addAttributeModal}>
          <DialogHeader hideClose={updateEquipment && updateEquipment.data} title="Create Asset Attribute" imagePath={false} onClose={() => closeAttributeWindow()} sx={{ width: '800px' }} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Row>
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="p-2 bg-lightblue h-100">
                    <CardBody className="bg-color-white p-1 m-0">
                      <div>
                        {updateEquipment && updateEquipment.loading && (
                        <div className="text-center mt-3">
                          <Loader />
                        </div>
                        )}
                        {(updateEquipment && updateEquipment.err) && (
                        <SuccessAndErrorFormat response={updateEquipment} />
                        )}
                        {(updateEquipment && updateEquipment.data) && (
                        <SuccessAndErrorFormat response={updateEquipment} successMessage="Attribute added successfully.." />
                        )}
                      </div>
                      {!(updateEquipment.loading) && !(updateEquipment && updateEquipment.data) && (
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          gap: '3%',
                        }}
                      >

                        <Box
                          sx={{
                            width: '45%',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Label for="product_id">
                              Name
                              <span className="text-danger ml-1">*</span>
                            </Label>
                            <Autocomplete
                              name="pause_reason_id"
                              size="small"
                              onChange={(_event, newValue) => {
                                setAttName(newValue);
                              }}
                              getOptionSelected={(option, value) => option.name === value.name}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                              options={labelListInfo && labelListInfo.data ? labelListInfo.data : []}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={onNameKeyWordChange}
                                  variant="outlined"
                                  className="without-padding bg-white"
                                  placeholder="Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {labelListInfo && labelListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {(labelListInfo && labelListInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(labelListInfo)}</span></FormHelperText>)}
                          </Col>
                        </Box>
                        <Box
                          sx={{
                            width: '45%',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Label for="product_id">
                              Value
                              <span className="text-danger ml-1">*</span>
                            </Label>
                            <MuiNoFormTextField
                              sx={{
                                marginTop: 'auto',
                                marginBottom: 'auto',
                              }}
                              name="value"
                              label=""
                              formGroupClassName="m-1"
                              isRequired
                              type="text"
                              inputProps={{ maxLength: 100 }}
                              setFieldValue={onValueChange}
                              customError=""
                            />
                          </Col>
                        </Box>
                      </Box>
                      )}

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="mr-3 ml-3">
            {!(updateEquipment && updateEquipment.data) && (
            <Button
              type="button"
              disabled={!(attName && attValue) || (updateEquipment.loading)}
              variant="contained"
              onClick={() => onAttributeCreate()}
              style={{ width: 'auto', height: '40px' }}
            >
              Create
            </Button>
            )}
            {updateEquipment && updateEquipment.data && (
            <Button
              type="button"
              variant="contained"
              onClick={() => closeAttributeWindow()}
              style={{ width: 'auto', height: '40px' }}
            >
              Ok
            </Button>
            )}
          </DialogActions>
        </Dialog>
      </Col>
    </Row>
  );
};

export default SlaMatrix;
