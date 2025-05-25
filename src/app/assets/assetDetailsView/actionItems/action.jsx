/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  Box, Button,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import Loader from '@shared/loading';
import {
  faArrowCircleLeft, faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, extractValueObjects, trimJsonObject,
} from '../../../util/appUtils';
import { updateEquipmentData } from '../../equipmentService';
import validationSchema from './formModel/validationSchema';
import scheduleFormModel from './formModel/formModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import BasicForm from './basicForm';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = scheduleFormModel;

const faIcons = {
  'Assign Asset': faArrowCircleRight,
  'Return Asset': faArrowCircleLeft,
};

const Action = (props) => {
  const {
    equipmentsDetails, actionModal, actionText, actionButton, atFinish, atCancel, isITAsset, categoryType,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [entityType, setEntityType] = useState('Employee');
  const { assetHistoryCard } = useSelector((state) => state.equipment);

  const {
    updateEquipment,
  } = useSelector((state) => state.equipment);

  const editId = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].id : false;
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  useEffect(() => {
    if (assetHistoryCard && assetHistoryCard.data && assetHistoryCard.data.length && actionText === 'Return Asset') {
      setEntityType(assetHistoryCard.data[0].checkout_to);
    }
  }, [assetHistoryCard, actionText]);

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  function handleSubmit(values) {
    const eType = entityType;

    let space = extractValueObjects(values.location_id);
    let equipment = extractValueObjects(values.asset_id);
    let employee = extractValueObjects(values.employee_id);

    if (eType === 'Location') {
      equipment = false;
      employee = false;
    }
    if (eType === 'Equipment') {
      space = false;
      employee = false;
    }
    if (eType === 'Employee') {
      space = false;
      equipment = false;
    }
    const payload = {
      maintenance_type: actionText === 'Assign Asset' ? 'Assign' : 'Return',
      checkout_to: values.checkout_to,
      nature_of_work: values.nature_of_work,
      date: values.date,
      location_id: space,
      employee_id: employee,
      asset_id: equipment,
      equipment_id: false,
      order_id: false,
    };
    const addValue = 0;
    const id = editId;
    const assignmentStatus = actionText === 'Assign Asset' ? 'Assigned' : 'Not Assigned';
    const postValue = { assignment_status: assignmentStatus, history_card_ids: [[addValue, id || 0, payload]] };
    dispatch(updateEquipmentData(editId, postValue, appModels.EQUIPMENT));
  }

  const loading = (updateEquipment && updateEquipment.loading) || (equipmentsDetails && equipmentsDetails.loading);
  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  const latestAssign = assetHistoryCard && assetHistoryCard.data && assetHistoryCard.data.length > 0 ? trimJsonObject(assetHistoryCard.data[0]) : false;

  return (
    <Dialog maxWidth="md" open={actionModal}>
      <DialogHeader title={actionText} onClose={toggleCancel} response={updateEquipment} fontAwesomeIcon={faIcons[actionText]} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className=" mt-3 ml-4 mb-4 mr-4  rounded-0 border-0">
              {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Row>
                  <Col md="2" xs="2" sm="2" lg="1" className="mr-4">
                    <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                  </Col>
                  <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                    <Row className="p-1">
                      <Col md="12" xs="12" sm="12" lg="6" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Asset :
                        </span>
                        <span className="font-weight-400">
                          {equipmentData.name}
                        </span>
                      </Col>
                      <Col md="12" xs="12" sm="12" lg="6" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Location :
                        </span>
                        <span className="font-weight-400">
                          #
                          {equipmentData.location_id
                            ? equipmentData.location_id[1]
                            : <span>Not Assigned</span>}
                        </span>
                      </Col>
                    </Row>
                    <Row className="p-1">
                      <Col md="12" xs="12" sm="12" lg="6" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Category :
                        </span>
                        <span className="font-weight-400">
                          {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].category_id[1] ? equipmentsDetails.data[0].category_id[1] : '')}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
              )}
            </Card>
            <>
              <Row className="p-1">
                <Col md="12" sm="12" lg="12" xs="12">
                  {(updateEquipment && !loading) && (
                  <Formik
                    initialValues={actionText === 'Return Asset' && latestAssign ? latestAssign : formInitialValues}
                    validationSchema={validationSchema}
                    // eslint-disable-next-line react/jsx-no-bind
                    onSubmit={handleSubmit}
                  >
                    {({
                      isValid, dirty, setFieldValue, setFieldTouched,
                    }) => (
                      <Form id={formId}>
                        <ThemeProvider theme={theme}>
                          <BasicForm
                            formField={formField}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            entityType={entityType}
                            setEntityType={setEntityType}
                            actionText={actionText}
                            isITAsset={isITAsset}
                            categoryType={categoryType}
                          />
                          {(updateEquipment && updateEquipment.err) && (
                          <SuccessAndErrorFormat response={updateEquipment} />
                          )}
                          <Row className="justify-content-center">
                            {updateEquipment && updateEquipment.data && !loading && (
                            <SuccessAndErrorFormat
                              response={updateEquipment}
                              successMessage={actionText === 'Assign Asset' ? 'Asset assigned successfully..'
                                : 'Asset returned successfully..'}
                            />
                            )}
                          </Row>
                          <hr />
                          {(updateEquipment && updateEquipment.data) ? ''
                            : (
                              <div className="float-right mr-4">
                                <Button
                                  disabled={!(isValid && dirty)}
                                  type="submit"
                                  size="sm"
                                  color="secondary"
                                  variant="contained"
                                >
                                  {actionButton}
                                </Button>
                              </div>
                            )}
                          {(updateEquipment && updateEquipment.data) && (
                          <div className="float-right mr-4">
                            <Button
                              type="button"
                              color="secondary"
                              variant="contained"
                              size="sm"
                              onClick={toggle}
                            >
                              Ok
                            </Button>
                          </div>
                          )}
                        </ThemeProvider>
                      </Form>
                    )}
                  </Formik>
                  )}
                </Col>
              </Row>
              {(loading) && (
              <Loader />
              )}
            </>
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

Action.defaultProps = {
  isITAsset: false,
  categoryType: false,
};

Action.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
  isITAsset: PropTypes.bool,
  categoryType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};
export default Action;
