/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
} from 'reactstrap';
import {
  Box,
} from '@mui/material';
import addIcon from '@images/icons/plusCircleGrey.svg';
import Loader from '@shared/loading';
import { getTaskToolList, getToolsData, getPreventiveToolsList } from '../../preventiveMaintenance/ppmService';
import Selection from '../../commonComponents/multipleFormFields/selectionMultiple';
import {
  getAllowedCompanies, extractOptionsObject,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const ToolsForm = (props) => {
  const {
    operation,
    setToolIds,
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
    if (operation.tool_ids && operation.tool_ids.length && (userInfo && userInfo.data)) {
      dispatch(getTaskToolList(companies, appModels.TASKTOOLS, operation.tool_ids));
    } else {
      setToolsListData(toolsListData);
      dispatch(getToolsData(toolsListData));
    }
  }, [operation]);

  useEffect(() => {
    if (toolsList && toolsList.length) {
      setToolsListData(toolsList);
      dispatch(getToolsData(toolsList));
    }
  }, [toolsList]);

  useEffect(() => {
    if (toolsSelected && toolsSelected.length > 0) {
      setToolIds(toolsSelected);
      setTotalListData(toolsSelected);
    } else {
      setToolsListData([]);
      setToolIds([]);
      setTotalListData();
    }
  }, [toolsSelected]);

  useEffect(() => {
    if ((taskToolsList && taskToolsList.data && taskToolsList.data.length)) {
      const newArrData = taskToolsList.data.map((cl) => ({
        ...cl, id: cl.id, tool_id: cl.tool_id,
      }));
      setToolsListData(newArrData);
      dispatch(getToolsData(newArrData));
    }
  }, [taskToolsList]);

  useEffect(() => {
    if (toolListAdd) {
      setToolsListData(toolsListData);
      dispatch(getToolsData(toolsListData));
    }
  }, [toolListAdd]);

  const loadEmptyTd = () => {
    const newData = toolsListData && toolsListData.length ? toolsListData : [];
    newData.push({ tool_id: '', id: false });
    setToolsListData(newData);
    setToolListAdd(Math.random());
  };

  const removeData = (e, index) => {
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
  };

  const onChangeToolsList = (e, index) => {
    const newData = toolsListData;
    newData[index].tool_id = { id: e.id, name: e.name };
    setToolsListData(newData);
    setToolListAdd(Math.random());
  };

  return (
    <Box>
      <Table responsive className="border-0">
        {/* <thead className="bg-gray-light">
          <tr>
            <th className="p-2 min-width-160 border-0">
              <Typography>
                {' '}
                Tool Name
                {infoValue('tools')}
              </Typography>

            </th>
            <th className="p-2 border-0" align="right">
                    <span className="invisible"><Typography>DEL</Typography></span>
                  </th>
          </tr>
        </thead> */}
        <tbody>
          <tr>
            <td colSpan="5" className="text-right border-0">
              <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                <span className="mr-5">Add Tool</span>
              </div>
            </td>
          </tr>
          {(toolsListData && toolsListData.length > 0 && toolsListData.map((pl, index) => (
            <tr key={pl.id}>
              <td className="border-0">
                <Selection
                  isMultipleForm
                  paramsSet={(e) => onChangeToolsList(e, index)}
                  paramsValue={pl.tool_id && pl.tool_id.name ? pl.tool_id.name : pl.tool_id && pl.tool_id.length ? pl.tool_id[1] : ''}
                  paramsId={Math.random()}
                  callData={getPreventiveToolsList}
                  dropdownsInfo={toolsList}
                  dropdownOptions={extractOptionsObject(toolsList, pl.tool_id)}
                  moduleName={appModels.TOOL}
                  columns={['id', 'name']}
                  indexValue={index}
                  infoText="tool_id"
                  advanceSearchHeader="Tools List"
                  placeholderText="Tool Name"
                />
              </td>
              <td className="border-0">
                <span className="font-weight-400 d-inline-block" />
                <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="lg" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
              </td>
            </tr>
          )))}
        </tbody>
      </Table>
      {taskToolsList && taskToolsList.loading && (
      <div className="text-center mt-3 mb-3">
        <Loader />
      </div>
      )}
    </Box>
  );
};

ToolsForm.propTypes = {
  setToolIds: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default ToolsForm;
