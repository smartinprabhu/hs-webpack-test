import React, { useState, useMemo } from 'react';
import {
  Col,
  Progress,
  Row,
} from 'reactstrap';
import {
  Grid, Card,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/system/Box';

import ErrorContent from '@shared/errorContent';

import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
} from '../../util/appUtils';
import {
  updateHxTask,
  resetHxTask,
  getTaskChecklists,
} from '../siteService';

import { newpercalculate } from '../../util/staticFunctions';

const Checklists = ({ detailData }) => {
  const [dataLists, setDataLists] = useState([]);
  const dispatch = useDispatch();

  const { taskChecklists } = useSelector((state) => state.site);

  useMemo(() => {
    if (detailData && detailData.id) {
      dispatch(getTaskChecklists(detailData.id));
    } else {
      setDataLists([]);
    }
  }, [detailData]);

  useMemo(() => {
    if (taskChecklists && taskChecklists.data && taskChecklists.data.length > 0) {
      setDataLists(taskChecklists.data);
    } else {
      setDataLists([]);
    }
  }, [taskChecklists]);

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  function getStatusCount(data, sta) {
    let res = 0;
    if (data && data.length) {
      const statusDatas = data.filter((item) => item.status);
      res = statusDatas.length;
    }
    return res;
  }

  const handleChange = (event, index) => {
    if (detailData && (detailData.state === 'Open' || detailData.state === 'In progress')) {
      setDataLists((prevDataLists) => prevDataLists.map((item, i) => (i === index ? { ...item, status: !!event.target.checked } : item)));
      if (dataLists[0] && dataLists[index].id) {
        const payload = {
          task_checklist_ids: [[1, dataLists[index].id, { status: !!event.target.checked }]],
          state: 'In progress',
        };
        dispatch(updateHxTask(detailData.id, 'hx.onboarding_tasks', payload));
        dispatch(resetHxTask());
      }
    }
  };

  const cardData = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    title: `Card Title ${index + 1}`,
    content: `This is card content for card ${index + 1}.`,
  }));

  return (

    <Box
      className="p-3"
    >
      <div className="display-flex content-center mb-2">
        <Progress
          value={newpercalculate(dataLists.length > 0 ? dataLists.length : 0, dataLists.length > 0 ? getStatusCount(dataLists, 'Done') : 0)}
          className="w-100"
          color={getProgressColor(newpercalculate(dataLists.length > 0 ? dataLists.length : 0, dataLists.length > 0 ? getStatusCount(dataLists, 'Done') : 0))}
        >
          {newpercalculate(dataLists.length > 0 ? dataLists.length : 0, dataLists.length > 0 ? getStatusCount(dataLists, 'Done') : 0)}
          {' '}
          %
        </Progress>
        <h5 className="font-family-tab ml-3">
          {dataLists.length > 0 ? getStatusCount(dataLists, 'Done') : 0}
          /
          {dataLists.length > 0 ? dataLists.length : 0}
        </h5>
      </div>
      <div className="p-0 tab-detail-scroll thin-scrollbar">
        <hr className="m-0 p-0" />
        {!(taskChecklists && taskChecklists.loading) && dataLists.length > 0 && dataLists.map((item, index) => (
          <div
            aria-hidden
            className="p-0"
          >
            <Row className="content-center p-2">
              <Col md="12" sm="12" lg="12" xs="12" className="mb-0">
                <div className="display-flex content-center">
                  <Checkbox checked={item.status} color="success" onChange={(e) => handleChange(e, index)} />
                  <p className="font-family-tab mb-0 ml-2 font-weight-700">{getDefaultNoValue(item.name)}</p>
                </div>

              </Col>

            </Row>
            <hr className="m-0 p-0" />
          </div>
        ))}
        {!(taskChecklists && taskChecklists.loading) && !(dataLists.length > 0) && (
        <ErrorContent errorTxt="No data found." />
        )}
        {taskChecklists && taskChecklists.loading && (
        <div className="p-2">

          <Grid container className="p-2" spacing={2}>
            {cardData.map((card) => (
              <Grid item xs={12} sm={12} md={12} lg={12} key={card.id}>
                <Card>
                  <Skeleton
                    variant="rectangular"
                    height={20}
                    animation="wave"
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        )}
      </div>
    </Box>
  );
};
export default Checklists;
