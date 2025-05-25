/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import editIcon from '@images/icons/edit.svg';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogContentText, Button } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';

import addIcon from '@images/icons/plusCircleBlue.svg';
import DetailViewFormat from '@shared/detailViewFormat';
import {
  getQuestionTypeLabel,
} from '../utils/utils';
import validationSchema from '../formModel/pageValidationSchema';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/pageFormInitialValues';
import Questions from './questions';
import {
  storePages, storeQuestions, getSurveyQuestionIds, resetStorePages, getChoiceData, getMatrixData,
} from '../surveyService';
import {
  trimJsonObject, getDefaultNoValue,
} from '../../util/appUtils';
import MuiTextField from '../../commonComponents/formFields/muiTextField';

const appModels = require('../../util/appModels').default;

const { formField } = checkoutFormModel;

const Page = (props) => {
  const {
    pageModal, editId, editIndex, editData, atFinish, setFieldValue, pageData,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(pageModal);
  const [questionRemove, setQuestionRemove] = useState('');
  const [questionData, setQuestionData] = useState([]);
  const [activityModal, showActivityModal] = useState(false);
  const [editQuestionData, setEditQuestionData] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(false);
  const [editPageIndex, setEditPageIndex] = useState(false);
  const toggle = () => {
    setmodel(!model);
    atFinish();
  };
  const {
    questionsInfo, pagesInfo, questionList, pageQuestionList,
  } = useSelector((state) => state.survey);

  useEffect(() => {
    setQuestionData(questionData);
  }, [questionRemove]);

  useEffect(() => {
    if (editData) {
      setQuestionData([]);
      const questionIds = editData.question_ids;
      if (editId) {
        dispatch(getSurveyQuestionIds(appModels.SURVEYQUESTION, questionIds));
      } else {
        dispatch(storeQuestions(questionIds));
      }
    }
  }, [editData]);

  useEffect(() => {
    if (editId && editData && editData.question_ids && editData.question_ids.length > 0 && questionList && questionList.data) {
      setQuestionData([]);
      dispatch(storeQuestions(questionList.data));
    }
  }, [editData, questionList]);

  useEffect(() => {
    if (questionsInfo && questionsInfo.data && questionsInfo.data.length > 0) {
      setQuestionData(questionData);
      const arr1 = [...questionData, ...questionsInfo.data];
      const arr = [...new Set(arr1)];
      setQuestionData(arr);
      setFieldValue('question_ids', arr);
    } else {
      setQuestionData([]);
      setFieldValue('question_ids', []);
    }
  }, [questionsInfo]);

  function handleSubmit(values) {
    if (editIndex) {
      if (pageData && pageData.length > 0) {
        pageData[editIndex - 1].title = values.title;
        pageData[editIndex - 1].question_ids = questionData;
        dispatch(resetStorePages([]));
        dispatch(storePages(pageData));
      } else {
        const arr = [{ title: values.title, question_ids: questionsInfo.data }];
        dispatch(storePages(arr));
      }
      if (atFinish) atFinish();
    } else if (editId) {
      if (pageQuestionList && pageQuestionList.data && pageQuestionList.data.length > 0) {
        const index = pageQuestionList.data.findIndex((obj) => (obj.id === editId));
        pageQuestionList.data[index].title = values.title;
        pageQuestionList.data[index].question_ids = questionData;
        dispatch(resetStorePages([]));
        dispatch(storePages(pageQuestionList.data));
      }
      if (atFinish) atFinish();
    } else {
      const pageTitle = values.title;
      const postData = { ...values };

      postData.title = pageTitle;
      postData.question_ids = questionData;
      postData.sequence = 0;
      let postValue = [postData];
      if (pagesInfo && pagesInfo.data && pagesInfo.data.length > 0) {
        postValue = [...postValue, ...pagesInfo.data];
      }
      dispatch(storePages(postValue));
      if (atFinish) atFinish();
    }
  }

  const removeData = (e, index) => {
    const checkData = questionData;
    const indexRemove = checkData.indexOf(checkData[index]);
    const { id } = checkData[indexRemove];
    if (id) {
      checkData[indexRemove].isRemove = true;
      setQuestionData(checkData);
      setQuestionRemove(Math.random());
    } else {
      checkData.splice(indexRemove, 1);
      setQuestionData(checkData);
      setQuestionRemove(Math.random());
    }
  };

  const removeOldData = () => {
    dispatch(getChoiceData([]));
    dispatch(getMatrixData([]));
  };

  const loading = (questionsInfo && questionsInfo.loading) || (pageQuestionList && pageQuestionList.loading) || (questionList && questionList.loading);

  return (
    <Dialog size="md" fullWidth open={model}>
      <DialogHeader title={!editId ? 'Create Pages' : 'Update Pages'} onClose={() => { toggle(); }} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">

          <Formik
          validateOnMount   
            enableReinitialize
            initialValues={(editId || editData) ? trimJsonObject(editData) : formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, dirty,
            }) => (
              <Form id="pageForm">
                <MuiTextField
                  name={formField.pageTitle.name}
                  label={formField.pageTitle.label}
                  isRequired
                  formGroupClassName="m-1"
                  type="text"
                  inputProps={{ maxLength: 100 }}
                  sx={{ padding: '10px', marginBottom: '20px' }}
                />
                <Table responsive>
                  <thead className="bg-lightblue">
                    <tr>
                      <th className="p-2 min-width-160 border-0">
                        Question Name
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Type of Question
                      </th>
                      <th className="p-2 border-0 min-width-100" align="right">
                        <span className="">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3" className="text-left">
                        <div aria-hidden="true" className="font-weight-800 d-inline text-lightblue cursor-pointer mt-1 mb-1" onClick={() => { showActivityModal(true); }}>
                          <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                          <span className="mr-2">Add a Line</span>
                        </div>
                      </td>
                    </tr>
                    {(!loading && questionData && questionData.length > 0 && questionData.map((pl, index) => (
                      <>
                        {!pl.isRemove && (
                          <tr>
                            <td>{getDefaultNoValue(pl.question)}</td>
                            <td>{getQuestionTypeLabel(pl.type && pl.type.value ? pl.type.value : pl.type)}</td>
                            <td>
                              <Tooltip title="Edit">
                                <img
                                  aria-hidden="true"
                                  src={editIcon}
                                  className="cursor-pointer mr-3"
                                  height="12"
                                  width="12"
                                  alt="edit"
                                  onClick={() => { setEditQuestionData(pl); setEditPageIndex(index + 1); setEditQuestionId(pl.id ? pl.id : false); showActivityModal(true); }}
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <span className="font-weight-400 d-inline-block" />
                                <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                              </Tooltip>
                            </td>
                          </tr>
                        )}
                      </>
                    )))}
                  </tbody>
                </Table>
                {questionData && questionData.length <= 0
                  ? (
                    <>
                      <DetailViewFormat detailResponse={pageQuestionList} />
                      <DetailViewFormat detailResponse={questionList} />
                    </>
                  )
                  : ''}
                {activityModal && (
                  <Questions
                    editQuestionId={editQuestionId}
                    editPageIndex={editPageIndex}
                    editId={editId}
                    editIndex={editIndex}
                    questionData={questionData}
                    editData={editQuestionData}
                    onClick={removeOldData}
                    atFinish={() => { showActivityModal(false); setEditPageIndex(false); setEditQuestionId(false); setEditQuestionData(false); }}
                    activityModal
                  />
                )}
                <div className="float-right">
                  <Button
                    disabled={(editId || editData) ? !(isValid) : !(isValid && dirty) }
                    type="submit"
                    size="sm"
                    variant='contained'
                  >
                    Confirm
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
Page.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  pageModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  pageData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};

export default Page;