/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Button, Card, Popover, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import 'antd/dist/antd.css';
import Scheduler, {
  SchedulerData, ViewTypes, DATE_FORMAT, AddMorePopover,
} from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

import completed from '@images/icons/completed.svg';
import inProgress from '@images/icons/inprogress.svg';
import upcoming from '@images/icons/upcoming.svg';
import upcomingBlack from '@images/icons/upcomingBlack.svg';
import questionCircle from '@images/icons/questionCircle.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight, faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

import './preventiveMaintenance.scss';
import calendarMiniIcon from '@images/icons/calendarMini.svg';
import calendarCountIcon from '@images/icons/calendarCount.svg';
import workordersBlueIcon from '@images/icons/workordersBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import EventDetails from './eventDetails';
import withDragDropContext from './withDnDContext';
import {
  isNonWorkingTime, getCustomDate, getDateLabelFunc, getResources, getEventData, getHeaderDateFormat,
} from './utils/utils';
import {
  getPPMCalendar,
} from './ppmService';
import {
  getLocalTimeStart, getLocalTimeEnd, generateErrorMessage, getColumnArrayById,
  getAllowedCompanies, truncate,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const CalendarSchedule = ({ isInspection, collapse, userInfo }) => {
  const dispatch = useDispatch();
  moment.locale('en', { week: { dow: 1, doy: 7 } });
  const schedulerData = new SchedulerData(moment().format(DATE_FORMAT), isInspection ? ViewTypes.Day : ViewTypes.Week, false, false, {
    resourceName: '',
    schedulerWidth: '62%',
    dayResourceTableWidth: 200,
    weekResourceTableWidth: 200,
    monthResourceTableWidth: 200,
    customResourceTableWidth: 200,
    weekCellWidth: '11%',
    agendaResourceTableWidth: 200,
    nonAgendaSlotMinHeight: 90,
    dayCellWidth: 40,
    monthCellWidth: 30,
    weekMaxEvents: 4,
    monthMaxEvents: 4,
    dayMaxEvents: 3,
    customCellWidth: 30,
    nonWorkingTimeHeadBgColor: '#fff',
    nonWorkingTimeBodyBgColor: '#fff',
    nonAgendaOtherCellHeaderFormat: getHeaderDateFormat(userInfo, 'date'),
    minuteStep: 60,
    addMorePopoverHeaderFormat: getHeaderDateFormat(userInfo, 'date'),
    scrollToSpecialMomentEnabled: false,
    views: [
      {
        viewName: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false,
      },
      {
        viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false,
      },
      {
        viewName: 'Month', viewType: ViewTypes.Custom, showAgenda: false, isEventPerspective: false,
      },
    ],
  },
  { getCustomDateFunc: getCustomDate, isNonWorkingTimeFunc: isNonWorkingTime });
  schedulerData.setLocaleMoment(moment);
  const [viewModal, setViewModal] = useState(schedulerData);
  const [enter, setEnter] = useState('');
  const [viewHead, setViewHead] = useState(isInspection ? 'Day' : 'Week');
  const [eventModal, setEventModal] = useState(false);
  const [eventDetail, setEventDetail] = useState({});
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarData, setCalendarData] = useState(false);
  const [headerItem, setHeaderItem] = useState(undefined);
  const [leftPop, setLeftPop] = useState(0);
  const [topPop, setTopPop] = useState(0);
  const [heightPop, setHeightPop] = useState(0);
  const toggle = () => setPopoverOpen(!popoverOpen);
  const companies = getAllowedCompanies(userInfo);
  const {
    ppmFilterViewer, ppmCalendarInfo,
  } = useSelector((state) => state.ppm);

  const getDateLabel = () => {
    if (viewModal) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;
      const start = moment(startDate);
      const end = moment(endDate);
      let dateLabel = `${start.format('LL')}-${end.format('LL')}`;
      if (start !== end) dateLabel = getDateLabelFunc(viewModal, viewType, startDate, endDate);
      return dateLabel;
    }
    return '';
  };

  const getWeekCount = () => {
    if (viewModal) {
      const { startDate } = viewModal;
      const { viewType } = viewModal;
      if (viewType === 1) {
        const viewDate = moment(startDate).format('MM-DD-YYYY');
        const weekcount = moment(viewDate, 'MM-DD-YYYY').week();
        const labelWeek = `Week ${weekcount}`;
        return labelWeek;
      }
      return '';
    }
    return '';
  };

  useEffect(() => {
    if (viewModal) {
      let isMounted = true;
      if (isMounted) {
        const thead = document.getElementById('RBS-Scheduler-root').tHead;
        const row = thead.insertRow(1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = '<span class="ml-3 mr-2 resourceHeading">Schedule</span>';
        cell2.innerHTML = `<div class="p-1 d-inline-block font-size-13"><img
    id="DateFilters"
    alt="DateFilters"  
    class="cursor-pointer ml-2 mr-2 mb-1"
    src=${calendarMiniIcon}
  /><span id="dateLabelText" class="p-1 font-size-13">${getDateLabel()}</span></div><span id="weekLabelCount" class="float-right p-1 mr-2 font-size-13">${getWeekCount()}</span>`;
        const { resources } = viewModal;
        const resourceTable = document.getElementsByClassName('resource-table');
        for (let i = 0; i < resources.length; i += 1) {
          resourceTable[1].rows[i].cells[0].innerHTML = `<span class="ml-3 mr-2 
        textwrapdots d-inline-block width-160 text-left resourceHeading"  title=${resources[i].name}>${resources[i].name}</span><br><k title=${resources[i].team} class="resourceCount"><img
      class="cursor-pointer ml-2 mr-1"
      height="10px"
      src=${calendarCountIcon}
    />&nbsp;<small>Total PPM:&nbsp;<b>${resources[i].total}</b></small></k><br><k title=${resources[i].team} class="resourceTeam"><img
    class="cursor-pointer ml-2 mr-1"
    height="10px"
    src=${workordersBlueIcon}
  />&nbsp;<small>Team:&nbsp;<b>${truncate(resources[i].team, 35)}</b></small></k>
  <br><k class="resourceSchedule"><span class="ml-2 badge-text no-border-radius badge badge-blue badge-pill">${truncate(resources[i].schedule, 35)}</span></k>`;
        }
      }
      return () => { isMounted = false; };
    }
  }, [viewModal]);

  useEffect(() => {
    if (ppmFilterViewer && (ppmFilterViewer.states || ppmFilterViewer.categories || ppmFilterViewer.priorities || ppmFilterViewer.types)) {
      let isMounted = true;
      if (isMounted) {
        setViewModal(viewModal);
        setViewHead(viewHead);
        const dLabel = document.getElementById('dateLabelText');
        dLabel.innerHTML = getDateLabel();
        const dWeek = document.getElementById('weekLabelCount');
        dWeek.innerHTML = getWeekCount();
        const { startDate } = viewModal;
        const { endDate } = viewModal;
        const start = getLocalTimeStart(startDate);
        const end = getLocalTimeEnd(endDate);
        let schedule = [];
        let performedBy = [];
        let priorities = [];
        let category = [];
        let types = [];
        if (ppmFilterViewer && ppmFilterViewer.states && ppmFilterViewer.states.length > 0) {
          schedule = getColumnArrayById(ppmFilterViewer.states, 'id');
        }
        if (ppmFilterViewer && ppmFilterViewer.preventiveBy && ppmFilterViewer.preventiveBy.length > 0) {
          performedBy = getColumnArrayById(ppmFilterViewer.preventiveBy, 'id');
        }
        if (ppmFilterViewer && ppmFilterViewer.priorities && ppmFilterViewer.priorities.length > 0) {
          priorities = getColumnArrayById(ppmFilterViewer.priorities, 'id');
        }
        if (ppmFilterViewer && ppmFilterViewer.categories && ppmFilterViewer.categories.length > 0) {
          category = getColumnArrayById(ppmFilterViewer.categories, 'id');
        }
        if (ppmFilterViewer && ppmFilterViewer.types && ppmFilterViewer.types.length > 0) {
          types = getColumnArrayById(ppmFilterViewer.types, 'id');
        }
        if (userInfo && userInfo.data) {
          // const company = userInfo.data.company.id;
          dispatch(getPPMCalendar(companies, appModels.PPMCALENDAR, start, end, schedule, performedBy, priorities, category, types, isInspection));
        }
      }
      return () => { isMounted = false; };
    }
  }, [ppmFilterViewer]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const { resources } = viewModal;
      const resourceTable = document.getElementsByClassName('resource-table');
      for (let i = 0; i < resources.length; i += 1) {
        resourceTable[1].rows[i].cells[0].innerHTML = `<span class="ml-2 mr-2 textwrapdots
      d-inline-block width-160 text-left resourceHeading" title="${resources[i].name}">${resources[i].name}</span><br><k class="resourceCount"><img
      class="cursor-pointer ml-2 mr-1"
      height="10px"
      src=${calendarCountIcon}
    />&nbsp;<small>Total PPM:&nbsp;<b>${resources[i].total}</b></small></k><br><k class="resourceTeam"><img
    class="cursor-pointer ml-2 mr-1"
    height="10px"
    src=${workordersBlueIcon}
  />&nbsp;<small>Team:&nbsp;<b>${truncate(resources[i].team, 35)}</b></small></k>
  <br><k class="resourceSchedule"><span class="ml-2 badge-text no-border-radius badge badge-blue badge-pill">${truncate(resources[i].schedule, 35)}</span></k>`;
      }
    }
    return () => { isMounted = false; };
  }, [calendarData]);

  useEffect(() => {
    if (enter) {
      setHeaderItem(undefined);
      setLeftPop(0);
      setTopPop(0);
      setHeightPop(0);
      setViewModal(viewModal);
      setViewHead(viewHead);
      const dLabel = document.getElementById('dateLabelText');
      dLabel.innerHTML = getDateLabel();
      const dWeek = document.getElementById('weekLabelCount');
      dWeek.innerHTML = getWeekCount();
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const start = getLocalTimeStart(startDate);
      const end = getLocalTimeEnd(endDate);
      let schedule = [];
      let performedBy = [];
      let priorities = [];
      let category = [];
      let types = [];
      if (ppmFilterViewer && ppmFilterViewer.states && ppmFilterViewer.states.length > 0) {
        schedule = getColumnArrayById(ppmFilterViewer.states, 'id');
      }
      if (ppmFilterViewer && ppmFilterViewer.preventiveBy && ppmFilterViewer.preventiveBy.length > 0) {
        performedBy = getColumnArrayById(ppmFilterViewer.preventiveBy, 'id');
      }
      if (ppmFilterViewer && ppmFilterViewer.priorities && ppmFilterViewer.priorities.length > 0) {
        priorities = getColumnArrayById(ppmFilterViewer.priorities, 'id');
      }
      if (ppmFilterViewer && ppmFilterViewer.categories && ppmFilterViewer.categories.length > 0) {
        category = getColumnArrayById(ppmFilterViewer.categories, 'id');
      }
      if (ppmFilterViewer && ppmFilterViewer.types && ppmFilterViewer.types.length > 0) {
        types = getColumnArrayById(ppmFilterViewer.types, 'id');
      }
      if (userInfo && userInfo.data) {
        // const company = userInfo.data.company.id;
        dispatch(getPPMCalendar(companies, appModels.PPMCALENDAR, start, end, schedule, performedBy, priorities, category, types, isInspection));
      }
    }
  }, [enter]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (ppmCalendarInfo && ppmCalendarInfo.data) {
        viewModal.setResources(getResources(ppmCalendarInfo.data));
        viewModal.setEvents(getEventData(ppmCalendarInfo.data, userInfo));
        setCalendarData(Math.random());
      } else {
        viewModal.setResources(getResources([]));
        viewModal.setEvents(getEventData([]));
        setCalendarData(Math.random());
      }
    }
    return () => { isMounted = false; };
  }, [ppmCalendarInfo]);

  const prevClick = (sdata) => {
    sdata.prev();
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const nextClick = (sdata) => {
    sdata.next();
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const prevClickCustom = () => {
    const sdata = viewModal;
    sdata.prev();
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const nextClickCustom = () => {
    const sdata = viewModal;
    sdata.next();
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const onViewChange = (sdata, view) => {
    sdata.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    let head = 'Day';
    if (view.viewType === 0) {
      head = 'Day';
    }
    if (view.viewType === 1) {
      head = 'Week';
    }
    if (view.viewType === 5) {
      head = 'Month';
    }
    setViewHead(head);
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const onSelectDate = (sdata, date) => {
    sdata.setDate(date);
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const clickedEvent = (sdata, event) => {
    setEventDetail(event);
    setEventModal(true);
  };

  const toggleExpandFunc = (sdata, slotId) => {
    sdata.toggleExpandStatus(slotId);
    setViewModal(sdata);
  };

  const onSetAddMoreState = (newState) => {
    if (newState === undefined) {
      setHeaderItem(undefined);
      setLeftPop(0);
      setTopPop(0);
      setHeightPop(0);
    } else {
      setHeaderItem(newState.headerItem);
      setLeftPop(newState.left);
      setTopPop(newState.top);
      setHeightPop(newState.height);
    }
  };

  const handleDateChange = () => {
    const today = moment();
    const sdata = viewModal;
    sdata.setDate(today);
    setViewModal(sdata);
    setEnter(Math.random());
  };

  const nonAgendaCellHeaderTemplateResolver = (sdata, item, formattedDateItems, style) => {
    const datetime = sdata.localeMoment(item.time);
    let isCurrentDate = false;

    if (sdata.viewType === ViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), 'hour');
    } else {
      isCurrentDate = datetime.isSame(new Date(), 'day');
    }

    if (isCurrentDate) {
      style.backgroundColor = '#f3f9fc';
      style.color = '#3a4354';
    }

    const dateFormat = getHeaderDateFormat(userInfo, 'date').split(' ')[1].split('/');
    const dateFormatIndex = dateFormat.indexOf('DD');

    return (
      <th key={item.time} className="header3-text" style={style}>
        {
          formattedDateItems.map((formattedItem, index) => (
            sdata.viewType === ViewTypes.Custom
              ? (
                <div
                  key={`${index}${item.time}`}
                  className="font-12"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedItem.replace(formattedItem, formattedItem.split(' ')[1].split('/')[dateFormatIndex]), { USE_PROFILES: { html: true } }) }}
                />
              )
              : (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedItem.replace(/[0-9]/g, '<b>$&</b>'), { USE_PROFILES: { html: true } }) }}
                />
              )
          ))
        }
      </th>
    );
  };

  const leftCustomHeader = (
    <div>
      <FontAwesomeIcon size="lg" className="mr-3 ml-2 cursor-pointer" onClick={() => { prevClickCustom(); }} icon={faChevronLeft} />
      <Button
        size="sm"
        onClick={() => { handleDateChange(); }}
        className="pr-4 pl-4 p-0  text-white rounded-pill"
      >
        {viewHead}
      </Button>
      <FontAwesomeIcon size="lg" className="ml-3 cursor-pointer" onClick={() => { nextClickCustom(); }} icon={faChevronRight} />
    </div>
  );

  const rightCustomHeader = (
    <div className="mr-2">
      <Button id="PopoverHelp" onClick={toggle} type="button" className="bg-white question_button rounded-pill">
        <img alt="Help" src={questionCircle} height="13" className="mb-1 cursor-pointer" />
      </Button>
    </div>
  );

  const eventItemTemplateResolver = (sdata, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
    const roundCls = 'round-all';
    const backgroundColor = event.bgColor;
    let image = '';
    let margin;

    if (sdata.viewType === ViewTypes.Custom) {
      margin = '';
    } else {
      margin = 'ml-2';
    }

    const titleText = sdata.behaviors.getEventTextFunc(sdata, event);
    if (event.status === '1') {
      image = <img alt="completed" src={completed} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '2') {
      image = <img alt="inprogress" src={inProgress} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '4') {
      image = <img alt="upcoming" src={upcoming} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '3') {
      image = <img alt="upcoming" src={upcomingBlack} width="17" height="17" className={`${margin} cursor-pointer`} />;
    }

    let divStyle = { backgroundColor, height: mustBeHeight };
    if (agendaMaxEventWidth) divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };
    let events = '';

    if (sdata.viewType === ViewTypes.Custom) {
      events = (
        <div key={event.id} className="text-center">
          {image}
          {' '}
        </div>
      );
      /** For Month removed more text(+2more) */
      const d = document.querySelectorAll('a.timeline-event > div:not([class])');
      const searchValue = 'more';
      for (let i = 0; i < d.length; i += 1) {
        if (d[i].innerHTML.indexOf(searchValue) > -1) {
          d[i].innerHTML = d[i].innerHTML.replace('more', '');
        }
      }
    } else {
      events = (
        <div key={event.id} className={`${roundCls} event-item`} style={divStyle}>
          {image}
          {' '}
          <span className="font-11 ml-1" style={{ lineHeight: `${mustBeHeight}px` }}>
            {titleText}
          </span>
        </div>
      );
    }

    return events;
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (ppmCalendarInfo && ppmCalendarInfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (ppmCalendarInfo && ppmCalendarInfo.err) ? generateErrorMessage(ppmCalendarInfo) : userErrorMsg;
  let popover = <div />;
  if (headerItem) {
    popover = (
      <AddMorePopover
        headerItem={headerItem}
        eventItemClick={clickedEvent}
        closeAction={onSetAddMoreState}
        left={(leftPop - 500)}
        schedulerData={viewModal}
        top={topPop - 200}
        height={heightPop}
      />
    );
  }

  return (
    <Card className={collapse ? 'filter-margin-right side-filters-list p-1 bg-lightblue h-100' : 'side-filters-list p-1 bg-lightblue h-100'}>
      <div className="cschedule">
        <Scheduler
          className="thin-scrollbar"
          schedulerData={viewModal}
          prevClick={prevClick}
          nextClick={nextClick}
          onSelectDate={onSelectDate}
          onViewChange={onViewChange}
          eventItemClick={clickedEvent}
          toggleExpandFunc={toggleExpandFunc}
          nonAgendaCellHeaderTemplateResolver={nonAgendaCellHeaderTemplateResolver}
          eventItemTemplateResolver={eventItemTemplateResolver}
          onSetAddMoreState={onSetAddMoreState}
          leftCustomHeader={leftCustomHeader}
          rightCustomHeader={rightCustomHeader}
        />
        {popover}
        {loading && (
        <div className="loader" data-testid="loading-case">
          <Loader />
        </div>
        )}
        {((ppmCalendarInfo && ppmCalendarInfo.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
        )}
        {(ppmCalendarInfo && ppmCalendarInfo.data && ppmCalendarInfo.data.ppm_orders && ppmCalendarInfo.data.ppm_orders.length <= 0) && (
        <ErrorContent errorTxt="No data found" />
        )}
        <EventDetails eventList={eventDetail} isInspection={isInspection} companyDetails={userInfo} eventDetailModel={eventModal} atFinish={() => setEventModal(false)} />
      </div>
      <Popover placement="left" isOpen={popoverOpen} className="popoverQuestion" target="PopoverHelp">
        <PopoverBody className="pr-0 pl-2">
          <div className="ml-1 popover_line">
            <img alt="upcoming" src={upcomingBlack} height="17" className="cursor-pointer mr-1" />
            <small className="text-table-gray font-weight-600">Not Yet Started</small>
            <br />
            <img alt="inProgress" src={inProgress} height="17" className="cursor-pointer mr-1" />
            <small className="text-yellow mr-4 font-weight-600">In Progress</small>
            <br />
            <img alt="completed" src={completed} height="17" className="cursor-pointer mr-1" />
            <small className="text-green mr-4 font-weight-600">Completed</small>
            <br />
            <img alt="upcoming" src={upcoming} height="17" className="cursor-pointer mr-1" />
            <small className="text-blue font-weight-600">Upcoming</small>
          </div>
        </PopoverBody>
      </Popover>
    </Card>
  );
};
CalendarSchedule.propTypes = {
  collapse: PropTypes.bool,
  isInspection: PropTypes.bool,
  userInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
CalendarSchedule.defaultProps = {
  collapse: false,
  isInspection: false,
};

export default withDragDropContext(CalendarSchedule);
