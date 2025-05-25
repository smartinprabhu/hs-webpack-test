/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Checkbox,
  Typography,
} from '@mui/material';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, ModalBody,
  Table,
} from 'reactstrap';
import addIcon from '@images/icons/plusCircleGrey.svg';
import {
  getChecklistQuestionList, updateActivity,
} from '../../preventiveMaintenance/ppmService';
import Activity from '../../preventiveMaintenance/preventiveCheckList/forms/activityNew';
import { getQuestionTypeLabel } from '../../preventiveMaintenance/utils/utils';
import {
  getAllowedCompanies, getDefaultNoValue, getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';
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

const CheckListForm = (props) => {
  const {
    operation,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState([]);
  const [totalListData, setTotalListData] = useState([]);
  const [questionAdd, setQuestionAdd] = useState('');
  const [questionListData, setquestionListData] = useState([]);
  const typeOptions = [{ value: 'e', label: 'Equipment' }, { value: 'ah', label: 'Space' }];
  const [openId, setOpen] = useState('');
  const [openType, setOpenType] = useState('');
  const [checkListKeyword, setCheckListKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['name']);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);
  const [operationData, setOperationData] = useState(false);
  const [activityModal, showActivityModal] = useState(false);
  const [editActivityModal, showUpdateActivityModal] = useState(false);
  const [isRemove, setRemove] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editValue, setEditId] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    checkList, checklistSelected, checklistQuestionList, taskCheckLists, addPreventiveChecklist, updateActivityInfo, questionChecklist, ppmCheckListData, questionData, questionList,
  } = useSelector((state) => state.ppm);

  const ids = operation && operation.id ? operation.id : '';

  useEffect(() => {
    if (ids !== '' && operation && (checkList && !checkList.loading) && (userInfo && userInfo.data)) {
      dispatch(getChecklistQuestionList(companies, appModels.PPMCHECKLIST, ids));
    }
  }, [operation]);

  useEffect(() => {
    if (addPreventiveChecklist && addPreventiveChecklist.data && addPreventiveChecklist.data.length > 0) {
      dispatch(getChecklistQuestionList(companies, appModels.PPMCHECKLIST, ids));
    }
  }, [addPreventiveChecklist]);

  useEffect(() => {
    if (updateActivityInfo && updateActivityInfo.data) {
      dispatch(getChecklistQuestionList(companies, appModels.PPMCHECKLIST, ids));
    }
  }, [updateActivityInfo]);

  useEffect(() => {
    setquestionListData(checklistQuestionList && checklistQuestionList.data && checklistQuestionList.data.length > 0 && checklistQuestionList.data[0].activity_lines && checklistQuestionList.data[0].activity_lines.length ? checklistQuestionList.data[0].activity_lines : []);
  }, [checklistQuestionList]);

  useEffect(() => {
    setquestionListData(questionListData);
  }, [questionAdd]);

  const removeData = (e, index) => {
    const newData = questionListData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setquestionListData(newData);
      setQuestionAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setquestionListData(newData);
      setQuestionAdd(Math.random());
    }
    const postData = {
      activity_lines: newData[index] ? getArrayNewFormatUpdateDelete([newData[index]]) : false,
    };
    dispatch(updateActivity(ids, appModels.PPMCHECKLIST, postData));
  };

  const loading = (checklistQuestionList && checklistQuestionList.loading) || (updateActivityInfo && updateActivityInfo.loading);

  return (
    <>
      <Box>
        {/* <Button
            onClick={() => { showActivityModal(true); }}
            sx={{ backgroundColor: '#dc3545 !important' }}
            type="button"
            variant="contained"
            className="header-create-btn"
          >
            Add Checklist Question
          </Button> */}
        {ids === '' ? (
          <div className="text-info font-16 text-center">
            Select Maintenance checklist to view questions
          </div>
        )
          : (
            <div aria-hidden="true" className="font-weight-800 float-right text-lightblue cursor-pointer mt-2 mb-2" onClick={() => { showActivityModal(true); }}>
              <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
              <span className="mr-1">
                Add Checklist Question
              </span>
            </div>
          )}
        {((questionListData && questionListData.length === 0) || (ids === '')) && !loading ? (
          <ErrorContent errorTxt="No Data Found" />
        )
          : (
            <Table responsive className="border">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    <Typography> Question Group</Typography>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <Typography>  Question Name</Typography>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <Typography> Type of Question</Typography>
                  </th>
                  <th className="p-2 w-25 border-0">
                    <Typography> Mandatory Answer</Typography>
                  </th>
                  <th className="p-2 border-0" align="right">
                    <span className=""><Typography>Action</Typography></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td colSpan="5" className="text-left">
                <div className="btn-shadow font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={() => { showActivityModal(true); }}>
                  <Typography>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    Add a Line
                  </Typography>
                </div>
              </td> */}
                </tr>
                {(questionListData && questionListData.length > 0 && questionListData.map((pl, index) => (
                  <tr key={pl.id}>
                    <td>
                      <Typography>
                        {' '}
                        {getDefaultNoValue(pl.mro_quest_grp_id && pl.mro_quest_grp_id.name ? pl.mro_quest_grp_id.name : '')}
                        {' '}
                      </Typography>
                    </td>
                    <td>
                      {' '}
                      <Typography>
                        {' '}
                        {getDefaultNoValue(pl.name)}
                      </Typography>
                    </td>
                    <td>
                      {' '}
                      <Typography>
                        {' '}
                        {getDefaultNoValue(getQuestionTypeLabel(pl.type))}
                      </Typography>
                    </td>
                    <td>
                      {' '}
                      <div className="checkbox">
                        <Checkbox
                          sx={{
                            transform: 'scale(0.9)',
                            padding: '0px',
                          }}
                          value={JSON.stringify(pl)}
                          id={`checkboxtk${pl.id}`}
                          className="ml-0"
                          name="checkanswer"
                          checked={pl.constr_mandatory}
                        />
                      </div>
                    </td>
                    <td>
                      <Tooltip title="Edit">
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faPencil} onClick={() => { setEditId(pl.id); setEditData(pl); showUpdateActivityModal(true); }} />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={() => { removeData(pl, index); }} />
                      </Tooltip>
                    </td>
                  </tr>
                )))}
              </tbody>
            </Table>
          )}
        {loading && (
          <div className="text-center mt-3 mb-3">
            <Loader />
          </div>
        )}
        {activityModal && (
        <Activity checklistEditId={ids} editId={false} editData={false} atFinish={() => { showActivityModal(false); }} activityModal />
        )}
        {editActivityModal && (
        <Activity checklistEditId={ids} editId={editValue} editData={editData} atFinish={() => { showUpdateActivityModal(false); }} activityModal={editActivityModal} />
        )}
      </Box>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
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

CheckListForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default CheckListForm;
