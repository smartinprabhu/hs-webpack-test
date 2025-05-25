/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card, CardBody, Col, Row, CardHeader,
} from 'reactstrap';
import { Select, Table } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';

import covidIcon from '@images/noc/covid.svg';
import recoveryIcon from '@images/noc/recovery.svg';
import buildingIcon from '@images/noc/buildingNoc.svg';
import gaugeIcon from '@images/noc/gauge.svg';
import seatIcon from '@images/noc/seat.svg';
import workingHoursIcon from '@images/noc/working_hours.svg';
import employeeIcon from '@images/noc/employees.svg';
import absentIcon from '@images/noc/absent.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';

import '../dashboard.scss';

import Navbar from '../navbar/navbar';
import StatisticCardWithIcon from '../utils/StatisticCardWithIcon';
import HalfDonutChart from '../utils/HalfDonutChart/index';
import DateSliderWithPicker from '../utils/DateSliderWithPicker';
import customData from '../data/customData.json';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const dateFormat = 'MM/DD/YYYY';

const DashboardView = () => {
  const subMenu = 3;
  const [dateRange, setDateRange] = useState([]);
  const [covidData, setCovidData] = useState(customData && customData.covid ? customData.covid : []);
  const [meetingRoomData, setMeetingRoomData] = useState(customData && customData.meetingRoomOccupancy ? customData.meetingRoomOccupancy : []);
  const [attendanceData, setAttendanceData] = useState(customData && customData.attendanceManagement ? customData.attendanceManagement : []);
  const [criticalAlerts, setCriticalAlerts] = useState(customData && customData.criticalAlerts ? customData.criticalAlerts : []);
  const [employees, setEmployees] = useState(customData && customData.employees ? customData.employees : []);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('site');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const { userInfo } = useSelector((state) => state.user);
  const { allowedCompanies } = useSelector((state) => state.setup);

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const filteredCovidData = covidData;

  const activeCovidCases = filteredCovidData.filter(
    (item) => item.status === 'Active',
  ).length;

  const newCovidCases = filteredCovidData.filter(
    (item) => item.status === 'New',
  ).length;

  const recoveredCovidCases = filteredCovidData.filter(
    (item) => item.status === 'Recovered',
  ).length;

  const filteredMeetingRoomData = meetingRoomData;

  const meetingRoomOccupancy = filteredMeetingRoomData.filter((item) => item.status === 'Occupied')
    .length / filteredMeetingRoomData.length;

  const avgSeatVacant = filteredMeetingRoomData.reduce((a, b) => a + b.seats_vacant, 0)
  / filteredMeetingRoomData.length;
  const avgEfficiency = filteredMeetingRoomData.reduce(
    (a, b) => a + b.seats_vacant / b.total_seats,
    0,
  ) / filteredMeetingRoomData.length;

  const filteredAlerts = criticalAlerts;
  const reportedIssues = filteredAlerts
    .map((item) => item.reported_issue)
    .filter(onlyUnique);
  const issueTableData = reportedIssues.map((issue) => ({
    issue,
    count: filteredAlerts.filter((a) => a.reported_issue === issue).length,
  }));

  const filteredEmployees = employees;

  const total_working_hrs = filteredEmployees.reduce(
    (a, b) => a + b.working_hrs,
    0,
  );

  const agreed_man_hrs = filteredEmployees.reduce(
    (a, b) => a + b.agreed_man_hrs,
    0,
  );

  const avgAbsentRate = filteredEmployees.reduce(
    (a, b) => a + Number(b.absenteesim_rate.slice(0, -1)),
    0,
  )
  / filteredEmployees.length
  / 100;

  const filteredAttendanceData = attendanceData;

  const issueColumns = [
    {
      title: <div className="font-weight-bold">Reported Issue</div>,
      dataIndex: 'issue',
      className: 'font-weight-normal table-column',
      sorter: (a, b) => a.issue.length - b.issue.length,
    },
    {
      title: <div className="font-weight-bold">Count of Reported Issue</div>,
      dataIndex: 'count',
      className: 'font-weight-normal table-column',
    },
  ];

  const attendanceColumns = [
    {
      title: <div className="font-weight-bold font-size-11">Site</div>,
      dataIndex: 'site',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Team</div>,
      dataIndex: 'team',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: (
        <div className="font-weight-bold font-size-11">
          Scheduled Work hrs/day
        </div>
      ),
      dataIndex: 'scheduled_hrs_per_day',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: (
        <div className="font-weight-bold font-size-11">
          Performed Work hrs/day
        </div>
      ),
      dataIndex: 'performed_hrs_per_day',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Deviation</div>,
      dataIndex: 'deviation',
      className: 'font-weight-normal table-column font-size-11',
    },
    {
      title: <div className="font-weight-bold font-size-11">Action</div>,
      dataIndex: 'action',
      className: 'font-weight-normal table-column font-size-11',
      sorter: (a, b) => a.issue.length - b.issue.length,
    },
  ];

  const allData = [
    ...covidData,
    ...meetingRoomData,
    ...attendanceData,
    ...criticalAlerts,
    ...employees,
  ].map((a) => a.date);
  const minDate = allData.reduce(
    (a, b) => (moment(a, dateFormat) > moment(b, dateFormat) ? b : a),
    '01/01/2021',
  );

  const maxDate = allData.reduce(
    (a, b) => (moment(a, dateFormat) < moment(b, dateFormat) ? b : a),
    '01/01/2021',
  );

  const onChangeDateRange = (values) => {
    setDateRange(values);
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row>
          <Col md="12" sm="12" lg="12" xs="12" className="pt-2">
            <Card className="p-2 mb-2 h-100">
              <CardBody className="p-1 m-0">
                <Row className="position-relative">
                  <Col md="6">
                    <h2 className="text-mandy font-weight-bold">
                      <img
                        src={buildingBlack}
                        width="50"
                        height="50"
                        alt="deskIcon"
                        className="mr-2"
                      />
                      Workplace Management
                    </h2>
                  </Col>
                  <Col md="4">
                    <div className="d-flex mt-2">
                      <div className="d-flex flex-column mr-3">
                        <Select
                          options={userCompanies.map((vl) => ({
                            value: vl.id,
                            label: vl.name,
                          }))}
                          value={selectedFilter}
                          onSelect={(value) => setSelectedFilter(value)}
                          style={{ minWidth: 100 }}
                        />
                      </div>
                      {!loading && (
                      <DateSliderWithPicker
                        start={minDate}
                        end={maxDate}
                        onChange={onChangeDateRange}
                      />
                      )}
                    </div>
                  </Col>
                </Row>
                <Row sm="12" className="mt-3">
                  <Col md="6">
                    <Row>
                      <Col md="4" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={covidIcon}
                              width="50"
                              height="50"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={activeCovidCases}
                          title="Active COVID Cases"
                        />
                      </Col>
                      <Col md="4" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={recoveryIcon}
                              width="50"
                              height="50"
                              style={{ marginTop: -8 }}
                            />
                          )}
                          value={newCovidCases}
                          title="Today's New Cases"
                        />
                      </Col>
                      <Col md="4" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={recoveryIcon}
                              width="50"
                              height="50"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={recoveredCovidCases}
                          title="Total Recoveries"
                        />
                      </Col>
                      <Col md="4" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={buildingIcon}
                              width="50"
                              height="50"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={`${(meetingRoomOccupancy * 100).toFixed(2)}%`}
                          title="Meeting Room Occupancy"
                        />
                      </Col>
                      <Col md="4" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={gaugeIcon}
                              width="46"
                              height="46"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={`${((1 - avgEfficiency) * 100).toFixed(2)}%`}
                          title="Average Efficiency of Booking"
                        />
                      </Col>
                      <Col md="4" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={seatIcon}
                              width="50"
                              height="50"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={avgSeatVacant.toFixed(2)}
                          title="Seats Vacant"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6">
                    <Card className="border-0">
                      <CardHeader className="border-0 statistic-card-header">
                        Critical Alerts
                      </CardHeader>
                      <Table
                        bordered
                        dataSource={issueTableData}
                        rowKey="issue"
                        columns={issueColumns}
                        pagination={false}
                        scroll={{ y: 180 }}
                        className="mt-3"
                      />
                    </Card>
                  </Col>
                </Row>
                <Row sm="12" className="my-3">
                  <Col md="6">
                    <Card className="border-0">
                      <CardHeader className="border-0 statistic-card-header">
                        Attendance Management
                      </CardHeader>
                      <Table
                        bordered
                        dataSource={filteredAttendanceData}
                        rowKey="id"
                        columns={attendanceColumns}
                        pagination={false}
                        scroll={{ y: 180 }}
                        className="mt-3"
                      />
                    </Card>
                  </Col>
                  <Col md="6">
                    <Row>
                      <Col md="6" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={workingHoursIcon}
                              width="60"
                              height="60"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={total_working_hrs}
                          title="Total Working Hours"
                        />
                      </Col>
                      <Col md="6" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={employeeIcon}
                              width="60"
                              height="60"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={agreed_man_hrs}
                          title="Agreed Man Hours/Day"
                        />
                      </Col>
                      <Col md="6" className="mt-4">
                        <StatisticCardWithIcon
                          icon={(
                            <img
                              src={employeeIcon}
                              width="60"
                              height="60"
                              style={{ marginTop: -8 }}
                            />
                  )}
                          value={filteredEmployees.length}
                          title="Employee ID"
                        />
                      </Col>
                      <Col md="6" className="mt-4">
                        <div className="font-weight-normal position-relative">
                          <img
                            src={absentIcon}
                            width="60"
                            height="60"
                            style={{ marginTop: -8, marginRight: 16 }}
                          />
                          Absenteesim Rate
                          <HalfDonutChart
                    // style={{ height: 250 }}
                            animDelay={0}
                            percent={avgAbsentRate}
                            arcsLength={[avgAbsentRate, 1 - avgAbsentRate]}
                            colors={['#1497ea', '#cdcdcd']}
                            textColor="#3a4354"
                            arcPadding={0}
                            cornerRadius={0}
                            id="gauge-chart-1"
                            showScaleValues
                            thresholdConfig={{ value: 0.08, color: 'blue' }}
                            arcWidth={0.3}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>

  );
};

export default DashboardView;
