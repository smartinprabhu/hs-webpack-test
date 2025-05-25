import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./restrooms.scss";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import HealthyIcon from "../../../images/default/icons/externalReport/Group 59583.svg";
import negitiveIcon from "../../../images/default/icons/externalReport/Group 29883.svg";
import rightarrow from "../../../images/default/icons/externalReport/Group 59504.svg";

import positiveIcon from "../../../images/default/icons/externalReport/Group 29882.svg";
import unhealthyIcon from "../../../images/default/icons/externalReport/Group 59584.svg";

import HorizontalChart from "./charts/HorizontalChart";
import VerticalChart from "./charts/barChart";
import RadialChart from "./charts/radialChart";
import LineBarChart from "./charts/lineBarChart";
import LineChart from "./charts/lineChart";
import { BsPencil } from "react-icons/bs";
import { Responsive, WidthProvider } from "react-grid-layout";
import { MuiTooltip } from "./Tooltip";

import {
  restroomsOrdersLayouts,
  ordersData,
  analyticsData,
  analyticsDataLayouts,
} from "./restRoomData/restRoomData";
import { getActiveTab, getHeaderTabs, getTabs } from "../util/appUtils";
import restRoomsNav from './navbar/navlist.json'
import { updateHeaderData } from "../core/header/actions";
import { useDispatch, useSelector } from "react-redux";

const RestroomLayout = WidthProvider(Responsive);
const AnalyticsLayout = WidthProvider(Responsive);

const parsedValue = JSON.parse(JSON.stringify(restroomsOrdersLayouts));

const parsedValue1 = JSON.parse(JSON.stringify(analyticsDataLayouts));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Restrooms() {
  const [value, setValue] = React.useState(0);
  const [liveDataFilter, setLiveDataFilter] = useState([]);
  const [selectedValue1, setSelectedValue1] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const [selectedValue3, setSelectedValue3] = useState("");
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [selectedValue4, setSelectedValue4] = useState("");
  const [selectedValue5, setSelectedValue5] = useState("");
  const [selectedValue6, setSelectedValue6] = useState("");
  const [options4, setOptions4] = useState([]);
  const [options5, setOptions5] = useState([]);

  const [reArrangeEnergyCards, setReArrangeEnergyCards] = useState(true);

  const [restroomLayout, setRestroomLayout] = useState(
    parsedValue.map((each) => ({ ...each, static: true }))
  );
  const dispatch = useDispatch();
  const [analyticsLayout, setAnalyticsLayout] = useState(
    parsedValue1.map((each) => ({ ...each, static: true }))
  );

  const handleDropdown1Change = (event) => {
    setSelectedValue1(event.target.value);
    setOptions2([
      { key: "a", value: "a", text: "Floor 1" },
      { key: "b", value: "b", text: "Floor 2" },
      { key: "c", value: "c", text: "Floor 3" },
    ]);
  };

  const handleDropdown2Change = (event) => {
    setSelectedValue2(event.target.value);
    setOptions3([
      { key: "x", value: "x", text: "Washroom 1" },
      { key: "y", value: "y", text: "Washroom 2" },
      { key: "z", value: "z", text: "Washroom 3" },
    ]);
  };

  const handleDropdown3Change = (event) => {
    setSelectedValue3(event.target.value);
  };

  const handleDropdown4Change = (event) => {
    setSelectedValue4(event.target.value);
    setOptions4([
      { key: "a", value: "a", text: "Floor 1" },
      { key: "b", value: "b", text: "Floor 2" },
      { key: "c", value: "c", text: "Floor 3" },
    ]);
  };

  const handleDropdown5Change = (event) => {
    setSelectedValue5(event.target.value);
    setOptions5([
      { key: "x", value: "x", text: "Washroom 1" },
      { key: "y", value: "y", text: "Washroom 2" },
      { key: "z", value: "z", text: "Washroom 3" },
    ]);
  };

  const handleDropdown6Change = (event) => {
    setSelectedValue6(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardsReArrange = () => {
    setRestroomLayout(
      restroomLayout.map((eachItem) => ({
        ...eachItem,
        static: !eachItem.static,
      }))
    );
    setAnalyticsLayout(
      analyticsLayout.map((eachItem) => ({
        ...eachItem,
        static: !eachItem.static,
      }))
    );
    setReArrangeEnergyCards(!reArrangeEnergyCards);
  };

  const handleLayoutChange = (layouts) => {
    setRestroomLayout(layouts);
  };

  const handleLayoutChange1 = (layouts) => {
    setRestroomLayout(layouts);
  };

  const onClickSaveLayout = () => {
    setReArrangeEnergyCards(!reArrangeEnergyCards);
    setRestroomLayout(
      restroomLayout.map((eachItem) => ({
        ...eachItem,
        static: !eachItem.static,
      }))
    );

    setAnalyticsLayout(
      analyticsLayout.map((eachItem) => ({
        ...eachItem,
        static: !eachItem.static,
      }))
    );
  };

  const handleResetLayout = () => {
    setRestroomLayout(restroomsOrdersLayouts);

    setAnalyticsLayout(analyticsDataLayouts);

    setReArrangeEnergyCards(!reArrangeEnergyCards);
  };

  const { userRoles } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Restrooms"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, restRoomsNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Insights"
    );
  }

  React.useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Restrooms",
        moduleName: "Restrooms",
        menuName: "Insights",
        link: "/restrooms-insights-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <>
      <Box sx={{ width: "100%", margin: "10px" }}>
        <div className="energy-main-box">
          <div className="energy-filters-box">
            <div
              style={{
                display: "flex",
                margin: "10px",
                justifyContent: "flex-end",
                marginRight: "180px",
              }}
            >
              {!reArrangeEnergyCards && (
                <>
                  <Button
                    onClick={onClickSaveLayout}
                    type="button"
                    variant="contained"
                    className="normal-btn"
                  >
                    Save
                  </Button>

                  <Button
                    type="button"
                    variant='outlined'
                    onClick={handleResetLayout}
                    className="normal-btn"
                  >
                    Reset
                  </Button>
                </>
              )}
              <MuiTooltip title={<Typography>Rearrange Cards</Typography>}>
                <IconButton onClick={handleCardsReArrange} className="link-btn">
                  <BsPencil size={20} />
                </IconButton>
              </MuiTooltip>
            </div>
          </div>
        </div>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
          sx={{
            borderBottom: "1px solid #efefef",
            marginLeft: "30px",
            background: "#FFFFFF",
          }}
        >
          <Tab
            sx={{
              textTransform: "capitalize",
              fontFamily: "Suisse Intl",
              fontWeight: "600",
            }}
            label="Live Data"
            {...a11yProps(0)}
          />
          <Tab
            sx={{
              textTransform: "capitalize",
              fontFamily: "Suisse Intl",
              fontWeight: "600",
            }}
            label="Analytics"
            {...a11yProps(2)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <div style={{ display: "flex" }}>
            <RestroomLayout
              margin={[10, 10]}
              className="layout"
              layouts={{
                lg: restroomLayout,
                md: restroomLayout,
                sm: restroomLayout,
                xs: restroomLayout,
                xxs: restroomLayout,
              }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={20}
              onLayoutChange={(layouts) => handleLayoutChange(layouts)}
            >
              {ordersData.map((each, i) => {
                return (
                  <div className="restrooms-cards-container" key={each.key}>
                    <div
                      className="restrooms-order-info-outer"
                      style={{
                        padding: `${restroomLayout[i]?.w * 5}px`,
                      }}
                    >
                      <img
                        className="order-img"
                        style={{
                          fontSize: `${restroomLayout[i]?.w * 8}px`,
                        }}
                        src={each.orderIcon}
                        alt="img"
                      />
                      <h1
                        className="order-text"
                        style={{
                          fontSize: `${restroomLayout[i]?.w * 8}px`,
                        }}
                      >
                        {each.cardText1}
                      </h1>
                      <p
                        className="order-count"
                        style={{
                          fontSize: `${restroomLayout[i]?.w * 10}px`,
                        }}
                      >
                        {each.orderCount}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="livedata-graph-container" key="live-data-graph">
                <div className="livedata-graph">
                  <p className="view">View by</p>

                  <div className="livedata-graph-view">
                    <p
                      className={
                        liveDataFilter.includes("Building")
                          ? "livedata-filter-active"
                          : "livedata-filter-active "
                      }
                    >
                      Building
                    </p>
                    <span style={{ paddingTop: "8px" }}>{">"}</span>
                    <p
                      className={
                        liveDataFilter.includes("Floors")
                          ? "livedata-filter-active "
                          : "livedata-filter-active livedata-filter-disable"
                      }
                    >
                      Floors
                    </p>
                    <span style={{ paddingTop: "8px" }}>{">"}</span>
                    <p
                      className={
                        liveDataFilter.includes("Washrooms")
                          ? "livedata-filter-active "
                          : "livedata-filter-active livedata-filter-disable"
                      }
                    >
                      Washrooms
                    </p>
                    <span style={{ paddingTop: "8px" }}>{">"}</span>
                    <p
                      className={
                        liveDataFilter.includes("Categorries")
                          ? "livedata-filter-active "
                          : "livedata-filter-active livedata-filter-disable"
                      }
                    >
                      Categories
                    </p>
                    <button
                      type="button"
                      className="reset-button"
                      onClick={() => setTicketsStepFilter([])}
                    >
                      Reset
                    </button>
                  </div>
                  <div></div>
                </div>
                <div className="graph-container">
                  <HorizontalChart
                    chartData={[
                      {
                        name: "Resolved",
                        data: [44, 55, 41, 37, 22, 43, 21],
                        color: "#4ED5A4",
                      },
                      {
                        name: "Pending",
                        data: [53, 32, 33, 52, 13, 43, 32],
                        color: "#F0D19F",
                      },
                      {
                        name: "Over due",
                        data: [12, 17, 11, 9, 15, 11, 20],
                        color: "#ED64B3",
                      },
                    ]}
                    categories={[
                      "Building1",
                      "Building2",
                      "Building3",
                      "Building4",
                      "Building5",
                      "Building6",
                      "Building7",
                    ]}
                    xAxisTitle="Count"
                    yAxisTitle="Problem category"
                    barHeight="30px"
                    height={
                      restroomLayout.filter(
                        (each) => each?.i === "live-data-graph"
                      )[0]?.h
                    }
                  // clickHandle={onClickHorizontalChart}
                  />
                </div>
              </div>
            </RestroomLayout>
          </div>

          <div className="vertical-graph-container">
            {/* <RestroomLayout
              margin={[10, 10]}
              className="layout"
              layouts={{
                lg: restroomLayout,
                md: restroomLayout,
                sm: restroomLayout,
                xs: restroomLayout,
                xxs: restroomLayout,
              }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={20}
              onLayoutChange={(layouts) => handleLayoutChange(layouts)}
            > */}
            <div className="vertical-graph" key="vertical-graph">
              <p className="hourly-usage-trend"> Hourly Usage Trend</p>
              <div className="dropdowns">
                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel id="dropdown-1-label">Select Building</InputLabel>
                  <Select
                    labelId="dropdown-1-label"
                    id="dropdown-1"
                    value={selectedValue1}
                    onChange={handleDropdown1Change}
                    label="Select Building"
                  >
                    <MenuItem value="1">Building 1</MenuItem>
                    <MenuItem value="2"> Building 2</MenuItem>
                    <MenuItem value="3">Building 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel id="dropdown-2-label">Select Floor</InputLabel>
                  <Select
                    labelId="dropdown-2-label"
                    id="dropdown-2"
                    value={selectedValue2}
                    onChange={handleDropdown2Change}
                    label="Select Floor"
                    disabled={!selectedValue1}
                  >
                    {options2.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel id="dropdown-3-label">Select Washroom</InputLabel>
                  <Select
                    labelId="dropdown-3-label"
                    id="dropdown-3"
                    value={selectedValue3}
                    onChange={handleDropdown3Change}
                    label="Select Washroom"
                    disabled={!selectedValue2}
                  >
                    {options3.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <VerticalChart
                chartData={[
                  {
                    name: "Men",
                    data: [200, 400, 600, 300, 400],
                    color: "#00A4DC",
                  },
                  {
                    name: "Women",
                    data: [360, 560, 360, 460, 450],
                    color: "#ED64B3",
                  },
                ]}
                categories={[
                  "10:00AM",
                  "11:00AM",
                  "12:00AM",
                  "01:00AM",
                  "02:00AM",
                  "03:00AM",
                  "04:00AM",
                ]}
                chartHeight={350}
                height={
                  restroomLayout.filter(
                    (each) => each?.i === "vertical-graph"
                  )[0]?.h
                }
              />
            </div>

            <div className="indoor-air-quality-container">
              <p className="indoor-air-heading"> Indoor Air Quality</p>

              <div className="dropdowns">
                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel id="dropdown-1-label">Select Building</InputLabel>
                  <Select
                    labelId="dropdown-1-label"
                    id="dropdown-1"
                    value={selectedValue4}
                    onChange={handleDropdown4Change}
                    label="Select Building"
                  >
                    <MenuItem value="1">Building 1</MenuItem>
                    <MenuItem value="2"> Building 2</MenuItem>
                    <MenuItem value="3">Building 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel id="dropdown-2-label">Select Floor</InputLabel>
                  <Select
                    labelId="dropdown-2-label"
                    id="dropdown-2"
                    value={selectedValue5}
                    onChange={handleDropdown5Change}
                    label="Select Floor"
                    disabled={!selectedValue4}
                  >
                    {options4.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel id="dropdown-3-label">Select Washroom</InputLabel>
                  <Select
                    labelId="dropdown-3-label"
                    id="dropdown-3"
                    value={selectedValue6}
                    onChange={handleDropdown6Change}
                    label="Select Washroom"
                    disabled={!selectedValue5}
                  >
                    {options5.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="radial-container-overal">
                <div>
                  <img src={HealthyIcon} alt="img" className="healthy-icon" />
                </div>
                <div className="radial-container-good">
                  <RadialChart
                    chartData={{
                      label: ["GOOD"],
                      color: ["#65B883"],
                    }}
                  />
                </div>
                <div className="radial-reviews">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p> Co2 </p>
                    <h4> 345</h4>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p> Tempeature </p>
                    <h4> 15.0 C</h4>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p> Humidity </p>
                    <h4> 56% </h4>
                  </div>
                </div>
              </div>
              <div className="radial-container-overal">
                <div>
                  <img src={unhealthyIcon} alt="img" className="healthy-icon" />
                </div>
                <div className="radial-container-good">
                  <RadialChart
                    chartData={{
                      label: ["Unhealthy"],
                      color: ["#801A74"],
                    }}
                  />
                </div>
                <div className="radial-reviews">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p className="co2"> Co2 </p>
                    <h4> 1693</h4>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p> Tempeature </p>
                    <h4> 10.0 C</h4>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p> Humidity </p>
                    <h4> 48% </h4>
                  </div>
                </div>
              </div>
            </div>
            {/* </RestroomLayout> */}
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div style={{ display: "flex" }}>
            {/* <AnalyticsLayout
              margin={[10, 10]}
              layouts={{
                lg: analyticsLayout,
                md: analyticsLayout,
                sm: analyticsLayout,
                xs: analyticsLayout,
                xxs: analyticsLayout,
              }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={20}
              onLayoutChange={(layouts) => handleLayoutChange1(layouts)}
            > */}
            <div>
              {analyticsData.map((item, i) => {
                return (
                  <div
                    className="analytics-container"
                    key={item.key}
                    style={{ padding: `${analyticsLayout[i]?.w * 5}px` }}
                  >
                    <div style={{ marginRight: "20px", marginTop: "14px" }}>
                      <img
                        className="analytics-img"
                        src={item.icon}
                        alt="img"
                        style={{
                          fontSize: `${analyticsLayout[i]?.w * 2}px`,
                        }}
                      />
                    </div>
                    <div className="analytics-items">
                      <h1
                        className="analytics-data"
                        style={{
                          fontSize: `${analyticsLayout[i]?.w * 8}px`,
                        }}
                      >
                        {item.text}
                      </h1>
                      <p
                        className="analytics-count"
                        style={{
                          fontSize: `${analyticsLayout[i]?.w * 8}px`,
                        }}
                      >
                        {item.count}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="analytics-graph" key="analytics">
              <div className="livedata-graph">
                <p className="view">View by</p>
                <div className="livedata-graph-view">
                  <p
                    className={
                      liveDataFilter.includes("Building")
                        ? "livedata-filter-active"
                        : "livedata-filter-active "
                    }
                  >
                    Building
                  </p>
                  <span style={{ paddingTop: "8px" }}>{">"}</span>
                  <p
                    className={
                      liveDataFilter.includes("Floors")
                        ? "livedata-filter-active "
                        : "livedata-filter-active livedata-filter-disable"
                    }
                  >
                    Floors
                  </p>
                  <span style={{ paddingTop: "8px" }}>{">"}</span>
                  <p
                    className={
                      liveDataFilter.includes("Washrooms")
                        ? "livedata-filter-active "
                        : "livedata-filter-active livedata-filter-disable"
                    }
                  >
                    Washrooms
                  </p>
                  <span style={{ paddingTop: "8px" }}>{">"}</span>
                  <p
                    className={
                      liveDataFilter.includes("Categorries")
                        ? "livedata-filter-active "
                        : "livedata-filter-active livedata-filter-disable"
                    }
                  >
                    Categories
                  </p>
                  <button
                    type="button"
                    className="reset-button"
                    onClick={() => setTicketsStepFilter([])}
                  >
                    Reset
                  </button>
                </div>
                <div></div>
              </div>
              <div className="graph-container">
                <HorizontalChart
                  chartData={[
                    {
                      name: "Resolved",
                      data: [44, 55, 41, 37, 22, 43, 21],
                      color: "#4ED5A4",
                    },
                    {
                      name: "Pending",
                      data: [53, 32, 33, 52, 13, 43, 32],
                      color: "#F0D19F",
                    },
                    {
                      name: "Over due",
                      data: [12, 17, 11, 9, 15, 11, 20],
                      color: "#ED64B3",
                    },
                  ]}
                  categories={[
                    "Building1",
                    "Building2",
                    "Building3",
                    "Building4",
                    "Building5",
                    "Building6",
                    "Building7",
                  ]}
                  xAxisTitle="Count"
                  yAxisTitle="Problem category"
                  barHeight="30%"
                  height={
                    analyticsLayout.filter(
                      (each) => each?.i === "live-data-graph"
                    )[0]?.h
                  }
                // clickHandle={onClickHorizontalChart}
                />
              </div>
            </div>
            {/* </AnalyticsLayout> */}
          </div>
          <div className="linebar-chart">
            <div className="usages-workorders-container">
              <p className="usages-workorders-header">Usages Vs Work orders</p>
              <div>
                <button className="men-button"> Men</button>
                <button className="women-button">Women</button>
              </div>
            </div>
            <LineBarChart />
          </div>
          <div className="reviews-container">
            <div>
              <div className="positive-survey-container">
                <div>
                  <h1 className="positive-survey-heading"> Positive Surveys</h1>
                  <h1 className="positive-count"> 2657 </h1>
                </div>
                <div>
                  <img src={positiveIcon} alt="img" className="survey-img" />
                </div>
              </div>
              <div className="positive-reviews">
                <div className="dropdowns">
                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-1-label">
                      Select Building
                    </InputLabel>
                    <Select
                      labelId="dropdown-1-label"
                      id="dropdown-1"
                      value={selectedValue1}
                      onChange={handleDropdown1Change}
                      label="Select Building"
                    >
                      <MenuItem value="1">Building 1</MenuItem>
                      <MenuItem value="2"> Building 2</MenuItem>
                      <MenuItem value="3">Building 3</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-2-label">Select Floor</InputLabel>
                    <Select
                      labelId="dropdown-2-label"
                      id="dropdown-2"
                      value={selectedValue2}
                      onChange={handleDropdown2Change}
                      label="Select Floor"
                      disabled={!selectedValue1}
                    >
                      {options2.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-3-label">
                      Select Washroom
                    </InputLabel>
                    <Select
                      labelId="dropdown-3-label"
                      id="dropdown-3"
                      value={selectedValue3}
                      onChange={handleDropdown3Change}
                      label="Select Washroom"
                      disabled={!selectedValue2}
                    >
                      {options3.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="positive-reviews-box">
                  <p className="review-data"> Waste-bin</p>
                  <h1 className="review-count1"> 500</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>{" "}
                <div className="positive-reviews-box">
                  <p className="review-data"> Soap Dispenser</p>
                  <h1 className="review-count"> 200</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>
                <div className="positive-reviews-box">
                  <p className="review-data"> Indoor air quality</p>
                  <h1 className="review-count"> 647</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>
                <div className="positive-reviews-box">
                  <p className="review-data"> Cleaning as well</p>
                  <h1 className="review-count"> 437</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>
              </div>
            </div>
            <div>
              <div className="negitive-survey-container">
                <div>
                  <h1 className="positive-survey-heading"> Negative Surveys</h1>
                  <h1 className="positive-count"> 265 </h1>
                </div>
                <div>
                  <img src={negitiveIcon} alt="img" className="survey-img" />
                </div>
              </div>
              <div className="positive-reviews">
                <div className="dropdowns">
                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-1-label">
                      Select Building
                    </InputLabel>
                    <Select
                      labelId="dropdown-1-label"
                      id="dropdown-1"
                      value={selectedValue1}
                      onChange={handleDropdown1Change}
                      label="Select Building"
                    >
                      <MenuItem value="1">Building 1</MenuItem>
                      <MenuItem value="2"> Building 2</MenuItem>
                      <MenuItem value="3">Building 3</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-2-label">Select Floor</InputLabel>
                    <Select
                      labelId="dropdown-2-label"
                      id="dropdown-2"
                      value={selectedValue2}
                      onChange={handleDropdown2Change}
                      label="Select Floor"
                      disabled={!selectedValue1}
                    >
                      {options2.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-3-label">
                      Select Washroom
                    </InputLabel>
                    <Select
                      labelId="dropdown-3-label"
                      id="dropdown-3"
                      value={selectedValue3}
                      onChange={handleDropdown3Change}
                      label="Select Washroom"
                      disabled={!selectedValue2}
                    >
                      {options3.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="positive-reviews-box">
                  <p className="review-data"> Waste-bin</p>
                  <h1 className="review-count1"> 500</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>{" "}
                <div className="positive-reviews-box">
                  <p className="review-data"> Soap Dispenser</p>
                  <h1 className="review-count"> 200</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>
                <div className="positive-reviews-box">
                  <p className="review-data"> Indoor air quality</p>
                  <h1 className="review-count"> 647</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>
                <div className="positive-reviews-box">
                  <p className="review-data"> Cleaning as well</p>
                  <h1 className="review-count"> 437</h1>
                  <img src={rightarrow} alt="arrow" />
                </div>
              </div>
            </div>
          </div>
          <div className="line-chart">
            <div className="usages-workorders-container">
              <p className="usages-workorders-header">Indoor Air Quality</p>
              <div>
                <div className="dropdowns" style={{ margin: "10px" }}>
                  <FormControl
                    size="small"
                    sx={{ minWidth: 170, marginRight: "5px" }}
                  >
                    <InputLabel id="dropdown-1-label">
                      Select Building
                    </InputLabel>
                    <Select
                      labelId="dropdown-1-label"
                      id="dropdown-1"
                      value={selectedValue4}
                      onChange={handleDropdown4Change}
                      label="Select Building"
                    >
                      <MenuItem value="1">Building 1</MenuItem>
                      <MenuItem value="2"> Building 2</MenuItem>
                      <MenuItem value="3">Building 3</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: 170, marginRight: "5px" }}
                  >
                    <InputLabel id="dropdown-2-label">Select Floor</InputLabel>
                    <Select
                      labelId="dropdown-2-label"
                      id="dropdown-2"
                      value={selectedValue5}
                      onChange={handleDropdown5Change}
                      label="Select Floor"
                      disabled={!selectedValue4}
                    >
                      {options4.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel id="dropdown-3-label">
                      Select Washroom
                    </InputLabel>
                    <Select
                      labelId="dropdown-3-label"
                      id="dropdown-3"
                      value={selectedValue6}
                      onChange={handleDropdown6Change}
                      label="Select Washroom"
                      disabled={!selectedValue5}
                    >
                      {options5.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            <LineChart />
          </div>
        </TabPanel>
        <div> Rakesh</div>
      </Box>
    </>
  );
}
