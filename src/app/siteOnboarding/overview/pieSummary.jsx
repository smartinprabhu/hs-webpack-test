import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
  Card,
  Col,
  CardBody,
  Row,
} from 'reactstrap';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import Box from '@mui/system/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHourglass } from '@fortawesome/free-solid-svg-icons';

import ErrorContent from '@shared/errorContent';

import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
} from '../../util/appUtils';

const PieSummary = ({ detailData }) => {
  const [pieSeries, setPieSeries] = useState(false);
  const [pieOptions, setPieOptions] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const getDataLabelValue = (val, opts) => `${val}%`;

  const getTooltipValue = (val, opts) => {
    console.log(opts);
    const res = opts.w && opts.w.globals && opts.w.globals.labels && opts.w.globals.labels[opts.dataPointIndex] ? opts.w.globals.labels[opts.dataPointIndex] : 0;
    return `${res} : ${val}`;
  };

  const addDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  function getDueDays(endDate) {
    if (!endDate) return '';

    const now = moment().startOf('day'); // Current date at midnight
    const dueDate = moment.utc(endDate).local().startOf('day'); // Convert endDate to local and set to midnight

    if (!dueDate.isValid()) return ''; // Validate the endDate

    if (dueDate.isSameOrAfter(now, 'day')) {
      const days = dueDate.diff(now, 'days'); // Difference in days (date only)
      if (days === 0) {
        return <span className="font-tiny text-warning">(Due on Today)</span>;
      }
      return (
        <span className="font-tiny text-info">
          (Due in
          {' '}
          {days}
          {' '}
          {days > 1 ? 'days' : 'day'}
          )
        </span>
      );
    }
    const expiredDays = now.diff(dueDate, 'days'); // Difference in days when expired
    return (
      <span className="font-tiny text-danger">
        (
        {expiredDays}
        {' '}
        {expiredDays > 1 ? 'days' : 'day'}
        {' '}
        delay)
      </span>
    );
  }

  useMemo(() => {
    if (detailData && detailData.length) {
      const predefinedLabels = ['Open', 'In Progress', 'Done']; // Your predefined labels
      const customLabels = ['Not Started', 'In Progress', 'Completed']; // Your predefined labels
      const customColors = ['#6c757d', '#ffa000', '#70b652']; // Your predefined labels
      // Initialize count for each category
      const counts = Array(predefinedLabels.length).fill(0);

      // Count occurrences of each state
      detailData.forEach((record) => {
        const index = predefinedLabels.indexOf(record.state);
        if (index !== -1) {
          counts[index] += 1;
        }
      });
      const series = [
        {
          name: 'Tasks',
          data: counts, // Corrected to match customLabels
          colors: customColors,
        },
      ];
      console.log(series);
      const totalSum = series.reduce((acc, item) => acc + item.data.reduce((sum, num) => sum + num, 0), 0);
      setPieSeries(series);
      const options = {
        chart: {
          width: 450,
          height: 250,
          type: 'bar',
          toolbar: {
            show: false, // isTools,
            tools: {
              download: false,
              selection: false, // isTools,
              zoom: false,
              zoomin: false, // isTools,
              zoomout: false, // isTools,
              pan: false, // isTools,
              reset: false, // isTools,s
            },
          },
        },
        grid: {
          show: false,
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        colors: customColors,
        fill: {
          opacity: 1,
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 0,
            dataLabels: {
              position: 'center', // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => {
            const percentage = totalSum > 0 ? ((val / totalSum) * 100).toFixed(2) : 0;
            return `${percentage}%`; // ✅ Show count + percentage
          },
          style: {
            fontSize: '12px',
            colors: ['white'],
            fontFamily: 'Suisse Intl',
          },
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false,
          },
          y: {
            formatter(val, opt) {
              return getTooltipValue(val, opt);
            },
            title: {
              formatter() {
                return '';
              },
            },
          },
        },
        xaxis: {
          categories: customLabels,
          position: 'top',
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter(val) {
              return `${val}`;
            },
          },

        },
      };
      setPieOptions(options);
    }
  }, [detailData]);

  const getSortedDoneTasks = (data) => {
    const doneTasks = data
      .flatMap((item) => item.onboarding_task_ids || [])
      .filter((task) => task.state === 'Done')
      .sort((a, b) => new Date(b.done_on) - new Date(a.done_on));

    return doneTasks.slice(0, 10);
  };

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: '5%' }}
    >
      <Box
        className="p-3"
        sx={{ width: '50%', alignItems: 'center', verticalAlign: 'middle' }}
      >
        <div className="p-2">
          <p className="font-family-tab font-weight-800 mt-0 mb-0">Setup Progress Overview (%)</p>
          <p className="font-family-tab font-tiny font-weight-400 mt-0 mb-0">A breakdown of the current setup progress with percentage completion for each stage.</p>
        </div>
        {pieSeries && pieOptions && (
        <Chart
          type="bar"
          height={250}
          series={pieSeries}
          options={pieOptions}
        />
        )}
      </Box>
      <Box
        className="p-3"
        sx={{ width: '50%', alignItems: 'center', verticalAlign: 'middle' }}
      >
        <Card
          style={{
            height: '300px',
            position: 'sticky',
            top: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          className="thin-scrollbar p-0"
        >
          <div className="p-2"><p className="font-family-tab font-weight-800 mt-0 mb-0">Recently Completed Tasks</p></div>
          <CardBody className="p-0">
            <hr className="m-0 p-0" />
            {detailData && detailData.length > 0 && getSortedDoneTasks(detailData) && getSortedDoneTasks(detailData).length > 0 && getSortedDoneTasks(detailData).map((item, index) => (
              <div
                aria-hidden
                className="p-0"
              >
                <Row className="content-center p-3">
                  <Col md="9" sm="12" lg="9" xs="12" className="mb-0">
                    <div className="display-flex content-center">
                      <div style={{
                        border: item.state === 'Done' ? '1px solid #70b652' : '1px solid #ffa000',
                        padding: '10px',
                        borderRadius: '50%',
                        backgroundColor: item.state === 'Done' ? '#70b652' : '#ffa000',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      >
                        <FontAwesomeIcon
                          icon={item.state === 'Done' ? faCheckCircle : faHourglass}
                          size="md"
                          style={{ color: 'white', borderRadius: '50%' }}
                        />
                      </div>
                      <p className="font-family-tab mb-0 ml-2 font-weight-700">{getDefaultNoValue(item.name)}</p>
                    </div>
                    <p className="font-tiny font-family-tab ml-4 pl-3 mb-0">
                      {getDefaultNoValue(item.type)}
                    </p>
                    <p className="font-tiny font-family-tab ml-4 pl-3 mb-0">
                      {getDefaultNoValue(item.description)}
                    </p>
                  </Col>
                  <Col md="3" sm="12" lg="3" xs="12" className="mb-0">
                    <p className="font-family-tab font-tiny mb-0">{item.state === 'Done' ? `Completed on ${getCompanyTimezoneDate(item.done_on, userInfo, 'date')}` : `Due on ${getCompanyTimezoneDate(addDays(item.days_required), userInfo, 'date')}`}</p>
                    <p className="font-family-tab font-tiny mb-0">{item.state !== 'Done' ? getDueDays(addDays(item.days_required)) : ''}</p>

                  </Col>
                </Row>
                <hr className="m-0 p-0" />
              </div>
            ))}
            {!(detailData && detailData.length > 0 && getSortedDoneTasks(detailData) && getSortedDoneTasks(detailData).length > 0) && (
            <ErrorContent errorTxt="No data found." />
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};
export default PieSummary;
