/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { Box } from '@mui/system';
import {
  Typography,
  Checkbox,
} from '@mui/material';

import Loader from '@shared/loading';
import editIcon from '@images/icons/edit.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import Activity from './activity';
import {
  getDefaultNoValue,
  getAllowedCompanies,
  getColumnArrayById,
} from '../../../util/appUtils';
import {
  getChecklistQuestion, setQuestionData, setQuestionList,
} from '../../ppmService';
import { getChoiceOptions } from '../../../survey/surveyService';
import { getQuestionTypeLabel } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const checkListForm = (props) => {
  const {
    editId,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const [activityModal, showActivityModal] = useState(false);
  const [editActivityModal, showUpdateActivityModal] = useState(false);
  // const [questionList, setQuestionList] = useState([]);
  // const [questionData, setQuestionData] = useState([]);
  const [isRemove, setRemove] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editValue, setEditId] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    addActivityInfo, updateActivityInfo, questionChecklist, ppmCheckListData, questionData, questionList,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (addActivityInfo && addActivityInfo.data && addActivityInfo.data.length > 0) {
      setRemove(false);
      const arr = [...questionList, ...addActivityInfo.data];
      dispatch(setQuestionList([...new Map(arr.map((item) => [item, item])).values()]));
    }
  }, [addActivityInfo]);

  useEffect(() => {
    dispatch(setQuestionList([]));
    dispatch(setQuestionData([]));
    // dispatch(resetQuestionChecklist([]));
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && questionList && questionList.length > 0 && !isRemove) {
      dispatch(getChecklistQuestion(companies, appModels.ACTIVITY, questionList));
    }
  }, [userInfo, questionList, isRemove]);

  useEffect(() => {
    if (updateActivityInfo && updateActivityInfo.data) {
      dispatch(getChecklistQuestion(companies, appModels.ACTIVITY, questionList));
    }
  }, [updateActivityInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && editId && (ppmCheckListData && ppmCheckListData.data)) {
      setRemove(false);
      const arr = [...questionList, ...ppmCheckListData.data[0].activity_lines];
      dispatch(setQuestionList([...new Map(arr.map((item) => [item, item])).values()]));
    }
  }, [userInfo, editId, ppmCheckListData]);

  const getArrayModify = (array) => {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const question = array[i];
        if (question.labels_ids && question.labels_ids.length) {
          const ids = (getColumnArrayById(question.labels_ids, 'id'));
          dispatch(getChoiceOptions(appModels.ACTIVITYLINES, ids));
        }
        newData.push(question);
      }
    }
    return newData;
  };

  useEffect(() => {
    if (questionChecklist && questionChecklist.data && questionChecklist.data.length) {
      setFieldValue('activity_lines', getArrayModify(questionChecklist.data));
      const arr = [...questionData, ...questionChecklist.data];
      dispatch(setQuestionData([...new Map(arr.map((item) => [item.id, item])).values()]));
    }
  }, [questionChecklist]);

  const removeData = (pl) => {
    const checkData = questionData;
    const indexRemove = checkData.indexOf(pl);
    checkData.splice(indexRemove, 1);
    dispatch(setQuestionData(checkData));
    setRemove(true);
    const checkData1 = questionList;
    const indexRemove1 = checkData1.indexOf(pl.id);
    checkData1.splice(indexRemove1, 1);
    dispatch(setQuestionList(checkData1));
    setFieldValue('activity_lines', checkData);
    // dispatch(getChecklistQuestion(userInfo.data.company.id, appModels.ACTIVITY, checkData));
  };

  return (
    <>
      <Box>
        <Table responsive>
          <thead className="bg-lightblue">
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
              <td colSpan="5" className="text-left">
                <div className="btn-shadow font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={() => { showActivityModal(true); }}>
                  <Typography>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    Add a Line
                  </Typography>
                </div>
              </td>
            </tr>
            {(questionData && questionData.length > 0 && questionData.map((pl, index) => (
              <tr key={pl.id}>
                <td>
                  <Typography>
                    {' '}
                    {pl.mro_quest_grp_id && pl.mro_quest_grp_id.name ? pl.mro_quest_grp_id.name : ''}
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
                  <Checkbox
                    sx={{
                      transform: 'scale(0.9)',
                      padding: '0px',
                    }}
                    value="all"
                    name="checkall"
                    id={`checkboxstateaction${index}`}
                    checked={pl.constr_mandatory}
                    disabled
                  />

                </td>
                <td>
                  <Tooltip title="Edit">
                    <img
                      aria-hidden="true"
                      src={editIcon}
                      className="cursor-pointer mr-3"
                      height="12"
                      width="12"
                      alt="edit"
                      onClick={() => { setEditId(pl.id); setEditData(pl); showUpdateActivityModal(true); }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(pl); }} />
                  </Tooltip>
                </td>
              </tr>
            )))}
          </tbody>
        </Table>
        {questionChecklist && questionChecklist.loading && (
          <div className="text-center mt-3 mb-3">
            <Loader />
          </div>
        )}
      </Box>
      {activityModal && (
        <Activity editId={false} editData={false} atFinish={() => { showActivityModal(false); }} activityModal />
      )}
      {editActivityModal && (
        <Activity editId={editValue} editData={editData} atFinish={() => { showUpdateActivityModal(false); }} activityModal={editActivityModal} />
      )}
    </>
  );
};

checkListForm.propTypes = {
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default checkListForm;
