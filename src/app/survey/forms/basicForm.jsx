/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button, Row, Col, Table,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { Box } from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';
import editIcon from '@images/icons/edit.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import { InputField } from '@shared/formFields';
import DetailViewFormat from '@shared/detailViewFormat';
import Page from './page';
import {
  getDefaultNoValue,
} from '../../util/appUtils';
import {
  getQuestionsCount,
} from '../utils/utils';
import {
  getSurveyPages, storePages, storeQuestions, setPageData,
} from '../surveyService';
import MuiTextField from "../../commonComponents/formFields/muiTextField";
import MuiTextArea from "../../commonComponents/formFields/muiTextarea";
import { returnThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const BasicForm = React.memo((props) => {
  const {
    editId,
    reload,
    setFieldValue,
    formField: {
      title,
      description,
    },
  } = props;

  const dispatch = useDispatch();
  const [pageRemove, setPageRemove] = useState('');
  const [pageModal, showPageModal] = useState(false);
  const [editPageData, setEditPageData] = useState(false);
  const [editPageId, setEditPageId] = useState(false);
  const [editPageIndex, setEditPageIndex] = useState(false);
  const [refresh, setRefresh] = useState(reload);
  const [modalAlert, setModalAlert] = useState(false);

  const {
    pagesInfo, pageQuestionList, surveyDetails, pageData,
  } = useSelector((state) => state.survey);

  const toggleAlert = () => {
    setModalAlert(false);
  };

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    dispatch(setPageData([]));
    if (editId && (surveyDetails && surveyDetails.data)) {
      if (surveyDetails.data[0].page_ids && surveyDetails.data[0].page_ids.length > 0) {
        dispatch(getSurveyPages(appModels.SURVEYPAGE, surveyDetails.data[0].page_ids));
        setPageRemove(Math.random());
      }
    }
  }, [editId, surveyDetails]);

  useEffect(() => {
    if (pageQuestionList && pageQuestionList.data && pageQuestionList.data.length) {
      if (pagesInfo && !pagesInfo.data) {
        const pageDataArray = pageData && pageData.length ? pageData : [];
        const arr1 = [...pageDataArray, ...pageQuestionList.data];
        const arr = [...new Map(arr1.map((item) => [item.id, item])).values()];
        dispatch(setPageData(arr));
      } else {
        dispatch(setPageData([]));
      }
    } else {
      dispatch(setPageData([]));
    }
  }, [pageQuestionList]);

  useEffect(() => {
    dispatch(setPageData(pageData));
  }, [pageRemove]);

  useEffect(() => {
    if (pagesInfo && pagesInfo.data && pagesInfo.data.length > 0 && refresh) {
      const arr = pagesInfo.data;
      dispatch(setPageData(arr));
      setPageRemove(Math.random());
      setFieldValue('page_ids', arr);
    }
  }, [pagesInfo, refresh]);

  const state = surveyDetails && surveyDetails.data && surveyDetails.data.length && surveyDetails.data.length > 0
    && surveyDetails.data[0].stage_id && surveyDetails.data[0].stage_id.length > 0 ? surveyDetails.data[0].stage_id : [];

  const removeData = (e, index) => {
    if (state && state.length > 0 && state[1] === 'In progress') {
      setModalAlert(true);
    } else {
      const checkData = pageData;
      const indexRemove = checkData.indexOf(checkData[index]);
      const { id } = checkData[indexRemove];
      if (id) {
        checkData[indexRemove].isRemove = true;
        dispatch(setPageData(checkData));
        setPageRemove(Math.random());
      } else {
        checkData.splice(indexRemove, 1);
        dispatch(setPageData(checkData));
        setPageRemove(Math.random());
      }
      dispatch(storePages(checkData));
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <MuiTextField
          name={title.name}
          label={title.label}
          isRequired
          type="text"
          inputProps={{ maxLength: 150 }}
          sx={{
            marginTop: "auto",
            marginBottom: "10px",
            width: '100%'
          }}
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <MuiTextArea
          name={description.name}
          label={description.label}
          inputProps={{ maxLength: 150 }}
          multiline
          rows="3"
          sx={{
            marginTop: "auto",
            marginBottom: "10px",
            width: '100%'
          }}
        />
      </Box>
      <Box
        sx={{
          marginTop: "auto",
          border: `1px solid ${returnThemeColor()}`,
          padding: '15px',
          marginTop: '15px',
          marginBottom: "10px",
        }}>
        <Table responsive style={{ marginBottom: '0px', }}>
          <thead className="bg-lightblue">
            <tr>
              <th className="p-2 min-width-160 border-0">
                Page Title
              </th>
              <th className="p-2 min-width-160 border-0">
                Questions
              </th>
              <th className="p-2 min-width-100 border-0" align="right">
                <span className="">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" className="text-left">
                <div
                  aria-hidden="true"
                  className="font-weight-800 d-inline text-lightblue cursor-pointer mt-1 mb-1"
                  onClick={() => { showPageModal(true); dispatch(storePages(pageData)); dispatch(storeQuestions([])); }}
                >
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-2">Add a Line</span>
                </div>
              </td>
            </tr>
            {(pageData && pageData.length > 0 && pageData.map((pl, index) => (
              !pl.isRemove && (
                <tr>
                  <td>{getDefaultNoValue(pl.title)}</td>
                  <td>
                    {pl.question_ids && pl.question_ids.length && pl.question_ids.length > 0 ? getQuestionsCount(pl.question_ids) : 0}
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
                        onClick={() => { setEditPageData(pl); setEditPageId(pl.id ? pl.id : false); setEditPageIndex(index + 1); dispatch(storeQuestions([])); showPageModal(true); }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <span className="font-weight-400 d-inline-block" />
                      <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                    </Tooltip>
                  </td>
                </tr>
              )
            )))}
          </tbody>
        </Table>
      </Box>
      <DetailViewFormat detailResponse={pageQuestionList} />
      <DetailViewFormat detailResponse={pagesInfo} />
      {pageModal && (
        <Page
          editId={editPageId}
          editData={editPageData}
          editIndex={editPageIndex}
          pageData={pageData}
          setFieldValue={setFieldValue}
          atFinish={() => { showPageModal(false); setEditPageData(false); setEditPageIndex(false); setEditPageId(false); }}
          pageModal
        />
      )}
      <Dialog open={modalAlert} fullWidth size="sm">
        <DialogHeader size="sm" title="Alert" onClose={() => toggleAlert()} response={[]} />
        <hr className="m-0" />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can not delete the page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
