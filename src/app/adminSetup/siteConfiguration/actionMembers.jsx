/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import imageUpload from '@images/teamMemberBlue.svg';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
} from '@mui/material';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  extractTextObject,
  getAllowedCompanies,
  getArrayFromValuesByIdIn,
  getDefaultNoValue,
} from '../../util/appUtils';
import {
  getMemberTeams,
  resetUpdateUser,
  updateUser,
} from '../setupService';

const appModels = require('../../util/appModels').default;

const faIcons = {
  Approve: faCheckCircle,
  Cancel: faTimesCircle,
};

const ActionMembers = (props) => {
  const {
    details, actionModal, actionText, actionCode, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [checkedAgree, setCheckedAgree] = useState(false);

  const {
    updateUserInfo, memberTeams,
  } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);

  const isResult = updateUserInfo && updateUserInfo.data;
  const loading = updateUserInfo && updateUserInfo.loading;
  const isError = updateUserInfo && updateUserInfo.err;

  useEffect(() => {
    dispatch(resetUpdateUser());
  }, []);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, state) => {
    const postDataValues = {
      state,
    };
    dispatch(updateUser(id, postDataValues, appModels.TEAMMEMEBERS));
  };

  const handleChange = () => {
    setCheckedAgree(!checkedAgree);
  };

  const toggle = () => {
    dispatch(resetUpdateUser());
    setModal(!modal);
    atFinish();
  };

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const selectedCompanies = getArrayFromValuesByIdIn(userCompanies, detailData.company_ids, 'id');

  useEffect(() => {
    if (detailData) {
      dispatch(getMemberTeams(companies, detailData.maintenance_team_ids, appModels.TEAM));
    }
  }, [detailData]);

  const Checkbox = ({ label, value, onChange }) => (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );

  return (
    <Dialog size="md" open={actionModal}>
      <DialogHeader title={`${actionText} Team Member`} fontAwesomeIcon={faIcons[actionText]} onClose={toggle} response={updateUserInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
            {details && (details.data && details.data.length > 0 && !details.loading && !loading) && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={imageUpload} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">{detailData.name}</h6>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Role :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(extractTextObject(detailData.user_role_id))}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Current Company :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(extractTextObject(detailData.company_id))}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Allowed Companies :
                      </span>
                      <span className="font-weight-400">
                        {selectedCompanies && selectedCompanies.length > 0 && selectedCompanies.map((item, index) => (
                          <span className="mr-1" key={item.id}>
                            {item.name}
                            {'  '}
                            {selectedCompanies.length !== (index + 1) && (<span>,</span>)}
                            {'  '}
                          </span>
                        ))}
                        {selectedCompanies && selectedCompanies.length === 0 && (
                        <span className="mr-1">{getDefaultNoValue('')}</span>
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Status :
                      </span>
                      <span className="font-weight-400">
                        {isResult && (details && !details.loading) ? actionCode : detailData.state}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Teams :
                      </span>
                      <span className="font-weight-400">
                        {memberTeams && memberTeams.data && memberTeams.data.length ? (
                          <>
                            {memberTeams.data.map((item, index) => (
                              <span className="mr-1" key={item.id}>
                                {item.name}
                                {'  '}
                                {memberTeams.data.length !== (index + 1) && (<span>,</span>)}
                                {'  '}
                              </span>
                            ))}
                          </>
                        ) : (
                          <>
                            {memberTeams && memberTeams.loading ? (
                              <Spinner size="sm" color="light" className="mr-2" />
                            ) : (
                              <>
                                {' '}
                                -
                              </>
                            )}
                          </>
                        )}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            )}
          </Card>
          { actionCode === 'Approved' && !isResult && (details && !details.loading && !loading) && (
          <Row className="justify-content-center">
            <Checkbox
              label=" I  agree, to the above mentioned details for registering the user"
              value={checkedAgree}
              onChange={handleChange}
            />
          </Row>
          )}
          <Row className="justify-content-center">
            {isResult && (details && !details.loading) && (
            <SuccessAndErrorFormat response={updateUserInfo} successMessage={`The Team Member has been ${actionCode} successfully..`} />
            )}
            {isError && (
            <SuccessAndErrorFormat response={updateUserInfo} />
            )}
            {((details && details.loading) || (loading)) && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
            )}
          </Row>
        </DialogContentText>
      </DialogContent>
      {!details.loading && !loading && (
      <DialogActions>
        {!isResult && (
        <Button
          type="button"
          variant="contained"
          disabled={actionCode === 'Approved' && !checkedAgree}
          size="sm"
          className="mr-1"
          onClick={() => handleStateChange(detailData.id, actionCode)}
        >
          {actionText}
        </Button>
        )}
        {isResult && (
        <Button
          type="button"
          size="sm"
          variant="contained"
          className="mr-1"
          onClick={toggle}
        >
          Ok
        </Button>
        )}
      </DialogActions>
      )}
    </Dialog>
  );
};

ActionMembers.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ActionMembers;
