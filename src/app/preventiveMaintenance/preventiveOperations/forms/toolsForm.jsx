/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  
  Typography,
} from '@mui/material';
import Loader from '@shared/loading';
import Select from 'react-select';
import addIcon from '@images/icons/plusCircleBlue.svg';
import closeIcon from '@images/icons/circleClose.svg';
import { AddThemeColor } from '../../../themes/theme';
import theme from '../../../util/materialTheme';
import { getPreventiveToolsList, getToolsData, getTaskToolList } from '../../ppmService';
import { getDefaultState } from '../../utils/utils';
import '../../preventiveMaintenance.scss';
import {
  getArrayFromValuesById,
  getColumnArrayById,
  getAllowedCompanies,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const ToolsForm = (props) => {
  const {
    editId,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const [toolsListData, setToolsListData] = useState([]);
  const [toolListAdd, setToolListAdd] = useState('');
  const [toolListOptions, setToolListOptions] = useState([]);
  const [totalListData, setTotalListData] = useState([]);
  const [toolListOptionsChecked, setToolListOptionsChecked] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    toolsList, toolsSelected, ppmOperationData, taskToolsList,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getPreventiveToolsList(companies, appModels.TOOL));
    }
  }, [userInfo]);

  useEffect(() => {
    if (editId && (userInfo && userInfo.data) && (ppmOperationData && ppmOperationData.data)) {
      dispatch(getTaskToolList(companies, appModels.TASKTOOLS, ppmOperationData.data[0].tool_ids));
    }
  }, [editId, ppmOperationData]);

  useEffect(() => {
    if (editId && (taskToolsList && taskToolsList.data && taskToolsList.data.length)) {
      const newArrData = taskToolsList.data.map((cl) => ({
        ...cl, id: cl.id, tool_id: cl.tool_id ? cl.tool_id[0] : '',
      }));
      setToolsListData(newArrData);
      dispatch(getToolsData(newArrData));
    }
  }, [editId, taskToolsList]);

  useEffect(() => {
    if (toolsList && toolsList.data && toolsList.data.length > 0) {
      const { data } = toolsList;
      setToolListOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
      setToolListOptionsChecked(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [toolsList]);

  useEffect(() => {
    if (toolListAdd) {
      setToolsListData(toolsListData);
      dispatch(getToolsData(toolsListData));
      const ids = getColumnArrayById(totalListData && totalListData.length ? totalListData : [], 'tool_id');
      const data = getArrayFromValuesById(toolsList && toolsList.data ? toolsList.data : [], ids, 'id');
      setToolListOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [toolListAdd]);

  useEffect(() => {
    if (toolsSelected && toolsSelected.length > 0) {
      setFieldValue('tool_ids', toolsSelected);
      setTotalListData(toolsSelected);
    } else {
      setToolsListData([]);
      setFieldValue('tool_ids', []);
      setTotalListData();
    }
  }, [toolsSelected]);

  const loadEmptyTd = () => {
    let newData = { tool_id: '' };
    if (editId) {
      newData = { tool_id: '', id: false };
    }
    setToolsListData((data) => [...data, newData]);
    setToolListAdd(Math.random());
  };

  const removeData = (e, index) => {
    if (editId) {
      const newData = toolsListData;
      const { id } = newData[index];
      if (id) {
        newData[index].isRemove = true;
        setToolsListData(newData);
        setToolListAdd(Math.random());
      } else {
        newData.splice(index, 1);
        setToolsListData(newData);
        setToolListAdd(Math.random());
      }
    } else {
      const checkData = toolsListData;
      checkData.splice(index, 1);
      setToolsListData(checkData);
      setToolListAdd(Math.random());
    }
  };

  const onChangeToolsList = (e, index) => {
    const newData = toolsListData;
    newData[index].tool_id = e.value;
    newData[index].name = e.name;
    setToolsListData(newData);
    setToolListAdd(Math.random());
  };

  return (
    <>
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginBottom: '10px',
          marginTop: '10px',
          paddingBottom: '4px',
        })}
      >
        Maintenance Tools
      </Typography>
      <ThemeProvider theme={theme}>
        <Row className="ml-2">
          <Col xs={12} sm={4} md={4} lg={4}>
            <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
              <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
              <span className="mr-5">
                Add a Line
              </span>
            </div>
          </Col>
        </Row>
        <br />
        {editId && taskToolsList && taskToolsList.loading && (
        <div className="p-3" data-testid="loading-case">
          <Loader />
        </div>
        )}
        {(toolsSelected && toolsSelected.length > 0 && toolsSelected.map((tl, index) => (
          <React.Fragment key={index}>
            {!tl.isRemove && (
            <Row className="ml-2">
              <Col xs={12} sm={4} md={4} lg={4}>
                <Select
                  name="toolsList"
                  placeholder="Select"
                  value={getDefaultState(toolListOptionsChecked, tl.tool_id)}
                  classNamePrefix="react-selects"
                  className="react-select-boxcheck"
                  onChange={(e) => onChangeToolsList(e, index)}
                  options={toolListOptions}
                  isClearable={false}
                />
              </Col>
              <img src={closeIcon} className="mr-2 mt-2 cursor-pointer" alt="addequipment" height="15" aria-hidden="true" onClick={(e) => { removeData(e, index); }} width="15" />
            </Row>
            )}
            <br />
          </React.Fragment>
        )))}
      </ThemeProvider>
    </>
  );
};

ToolsForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default ToolsForm;
