/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'babel-polyfill';
import Calandar from 'react-calendar';

import BookingLayout from '../bookingLayout';
import BookingModalWindow from '../bookingModalWindow';
import Calender from '../calendar';
import ConfirmBookingModalScreen from '../confirmBookingModalScreen';
import ConfirmBookingModalWindow from '../confirmBookingModalWindow';
import WorkStationTypes from '../workStationTypes';
import BookingShifts from '../shifts';
import * as services from '../../bookingService';
import * as actions from '../../actions';
import reducer from '../../reducer';
import BookingFilter from '../../createBookingViews/bookingFilters/bookingFilters';
import buildSaveBookingObject from '../buildSaveBookingObject';

jest.mock('@fullcalendar/react', () => <div />);
jest.mock('@fullcalendar/daygrid', () => jest.fn());
jest.mock('@fullcalendar/interaction', () => jest.fn());
jest.mock('@fullcalendar/timegrid', () => jest.fn());
jest.mock('../../../analytics/analyticsView', () => jest.fn());
jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));
const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    location: {},
    push: mockHistoryPush,
  }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: () => jest.fn(),
}));
jest.mock('react-calendar', () => jest.fn());

const bookingData = {
  access_status: false,
  actual_in: '',
  actual_out: '',
  book_for: 'myself',
  booking_type: 'individual',
  company: {
    id: 63,
    name: 'Water Mark Building',
  },
  employee: {
    id: 6453,
    name: 'Raja',
  },
  id: 91404,
  is_host: false,
  members: [],
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
  },
  workStationType: { id: 24 },
  planned_in: '2020-10-20 01:45:00',
  planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  shift: {
    id: 47,
    name: 'A',
  },
  space: {
    id: 9428,
    latitude: '432.75',
    longitude: '132',
    name: 'WS#41',
    status: 'Ready',
  },
  user_defined: false,
  uuid: 'a517dca6-3910-46fd-aed0-b0bfc48426b9',
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  working_hours: 0,
};
const bookingData1 = {
  access_status: false,
  actual_in: '',
  actual_out: '',
  book_for: 'myself',
  booking_type: 'individual',
  company: {
    id: 63,
    name: 'Water Mark Building',
  },
  date: '2020-12-28T12:19:28.411Z',
  employee: {
    id: 6453,
    name: 'Raja',
  },
  id: 91404,
  is_host: false,
  members: [],
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
  },
  workStationType: { id: 24 },
  planned_in: '2020-10-20 01:45:00',
  planned_out: '2020-10-20 10:15:00',
  new_planned_in: '2020-10-20 01:45:00',
  new_planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  shift: {
    id: 47,
    name: 'A',
  },
  space: {
    id: 9428,
    latitude: '432.75',
    longitude: '132',
    name: 'WS#41',
    status: 'Ready',
  },
  user_defined: false,
  uuid: 'a517dca6-3910-46fd-aed0-b0bfc48426b9',
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  working_hours: 0,
};
const bookingData2 = {
  access_status: false,
  actual_in: '',
  actual_out: '',
  book_for: 'myself',
  booking_type: 'individual',
  company: {
    id: 63,
    name: 'Water Mark Building',
  },
  date: '2020-12-28T12:19:28.411Z',
  employee: {
    id: 6453,
    name: 'Raja',
  },
  id: 91404,
  is_host: false,
  members: [],
  site: {
    new_planned_in: '2020-10-20 01:45:00',
    new_planned_out: '2020-10-20 10:15:00',
  },
  workStationType: { id: 24 },
  new_planned_in: '2020-10-20 01:45:00',
  new_planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  shift: {
    id: 47,
    name: 'A',
  },
  space: {
    id: 9428,
    latitude: '432.75',
    longitude: '132',
    name: 'WS#41',
    status: 'Ready',
  },
  user_defined: false,
  uuid: 'a517dca6-3910-46fd-aed0-b0bfc48426b9',
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  working_hours: 0,
};

const userInfo = {
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  employee: {
    id: 9845,
    name: 'Raja',
  },
  company: {
    address: 'Water Mark  Building\n222 W. Las Colinas Blvd.\nSuite 755 East\nIrving TX 75039\nUnited States',
    id: 3,
    name: 'Water Mark  Building',
    timezone: 'US/Central',
  },
};
const userInfo1 = {
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  employee: {
    id: 6235,
    name: 'Raja',
  },
  company: {
    address: 'Water Mark  Building\n222 W. Las Colinas Blvd.\nSuite 755 East\nIrving TX 75039\nUnited States',
    id: 3,
    name: 'Water Mark  Building',
    timezone: 'US/Central',
  },
};
const config = {
  configObj: {
    data: {
      filters: { building_space: { id: 9102, name: 'Water Mark Building' } },
      booking: {
        allow_onspot_space_booking: true,
        book_from_outlook: false,
        buffer_period_mins: 15,
        create_work_schedule: true,
        future_limit_days: 7,
        minimum_duration_mins: 60,
        onspot_booking_grace_period: 2,
        show_occupant: false,
        work_schedule_grace_period: 2,
      },
    },
  },
};
const bookingItem = {
  planned_in: '2020-10-20 01:45:00',
  planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  shift: {
    id: 47,
    name: 'B',
  },
  date: '',
};
const bookingItem1 = {
  planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  shift: {
    id: 47,
    name: 'A',
  },
  date: '2020-10-20 10:15:00',
  rescheduleType: true,
};
const bookingItem2 = {
  planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  date: '2020-10-20 10:15:00',
  rescheduleType: 'date',
  space: { category_id: 1 },
};
const workStations = [{
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9485,
  is_parent: false,
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
    id: 28,
  },
  latitude: '23',
  longitude: '25',
  max_occupancy: 0,
  parent: { id: 9104, name: 'Row#8' },
  path_name: 'WMB/WBL/F#10/WS/Z#2/Row#8/WS#96',
  position: { xpos: '', ypos: '' },
  space_name: 'Work Station #96',
  space_number: 'WMB-A-00104',
  space_sub_type: { id: 50, name: 'Workstation Area' },
  space_type: { id: 9, name: 'Area' },
  status: 'Ready',
  is_booking_allowed: true,
}, {
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9485,
  is_parent: false,
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
    id: 28,
  },
  latitude: '23',
  longitude: '25',
  max_occupancy: 0,
  parent: { id: 9558, name: 'Row#8' },
  path_name: 'WMB/WBL/F#10/WS/Z#2/Row#8/WS#96',
  position: { xpos: '', ypos: '' },
  space_name: 'Work Station #96',
  space_number: 'WMB-A-00104',
  space_sub_type: { id: 50, name: 'Workstation Area' },
  space_type: { id: 9, name: 'Area' },
  status: 'Ready',
  is_booking_allowed: true,
}];
const workStations1 = [{
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9485,
  is_parent: false,
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
    id: 28,
  },
  latitude: '23',
  longitude: '25',
  max_occupancy: 0,
  parent: { id: 9558, name: 'Row#8' },
  path_name: 'WMB/WBL/F#10/WS/Z#2/Row#8/WS#96',
  position: { xpos: '', ypos: '' },
  space_name: 'Work Station #96',
  space_number: 'WMB-A-00104',
  space_sub_type: { id: 50, name: 'Workstation Area' },
  space_type: { id: 9, name: 'Area' },
  status: 'Ready',
  is_booking_allowed: true,
}];
const employees = [{
  active: true,
  barcode: '',
  company: { id: 63, name: 'Water Mark Building' },
  department: {},
  employee_ref: false,
  gender: 'male',
  id: 6453,
  job: {},
  name: 'Raja',
  parent: {},
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  vendor_ref: '',
  work_email: 'abhi@helixsense.com',
  work_phone: '98765617',
}];

const bookingInfoForLoading = {
  workStations: { loading: true },
  floorView: {
    data: [{
      file_path: '/web/image/mro.equipment.location/9104/upload_images/9104.svg+xml',
      id: 9104,
      latitude: false,
      longitude: false,
      path_name: 'WMB/WBL/F#10',
      sequence_asset_hierarchy: 'WMB-A-00003',
      space_name: 'Floor #10',
    }],
  },
  bookingInfo: {
    bookingId: 1,
    date: '2020-10-20 01:45:00',
    site: {
      duration: 8,
      id: 48,
      name: 'B',
      planned_in: '2020-12-21 09:30:00',
      planned_out: '2020-12-21 17:30:00',
      start_time: 15,
    },
    workStationType: {
      file_path: '/web/image/mro.asset.category/212/image_medium/212.png',
      id: 212,
      name: 'Work Station - WMB',
      sequence: 1,
      type: 'room',
    },

  },
};
const bookingInfoForError = {
  workStations: { data: workStations, err: { error: { message: 'error' } } },
  floorView: {
    data: [{
      file_path: '/web/image/mro.equipment.location/9104/upload_images/9104.svg+xml',
      id: 9104,
      latitude: false,
      longitude: false,
      path_name: 'WMB/WBL/F#10',
      sequence_asset_hierarchy: 'WMB-A-00003',
      space_name: 'Floor #10',
    }],
  },
  bookingInfo: {
    bookingId: 1,
    date: '2020-10-20 01:45:00',
    site: {
      duration: 8,
      id: 48,
      name: 'B',
      planned_in: '2020-12-21 09:30:00',
      planned_out: '2020-12-21 17:30:00',
      start_time: 15,
    },
    workStationType: {
      file_path: '/web/image/mro.asset.category/212/image_medium/212.png',
      id: 212,
      name: 'Work Station - WMB',
      sequence: 1,
      type: 'room',
    },

  },
};
const bookingInfo = {
  employees: [{
    active: true,
    barcode: '',
    company: { id: 63, name: 'Water Mark Building' },
    department: {},
    employee_ref: false,
    gender: 'male',
    id: 6235,
    job: {},
    name: 'Raja',
    parent: {},
    vendor: {
      id: 1450,
      name: 'Motivity Labs(Tenant)',
    },
    vendor_ref: '',
    work_email: 'abhi@helixsense.com',
    work_phone: '98765617',
  },
  {
    active: true,
    barcode: '',
    company: { id: 63, name: 'Water Mark Building' },
    department: {},
    employee_ref: false,
    gender: 'male',
    id: 6235,
    job: {},
    name: 'Raju',
    parent: {},
    vendor: {
      id: 1450,
      name: 'Motivity Labs(Tenant)',
    },
    vendor_ref: '',
    work_email: 'abhi@helixsense.com',
    work_phone: '98765617',
  }],
  workStations,
  floorView: {
    data: [{
      file_path: '/web/image/mro.equipment.location/9104/upload_images/9104.svg+xml',
      id: 9104,
      latitude: false,
      longitude: false,
      path_name: 'WMB/WBL/F#10',
      sequence_asset_hierarchy: 'WMB-A-00003',
      space_name: 'Floor #10',
    }],
  },
  categories: {
    data: [
      {
        file_path: '/web/image/mro.asset.category/211/image_medium/211.png', id: 211, name: 'Conference Room', sequence: 1, type: 'building',
      },
      {
        file_path: '/web/image/mro.asset.category/212/image_medium/212.png', id: 212, name: 'Work Station', sequence: 1, type: 'room',
      },
    ],
  },
  shiftsInfo: {
    data: [{
      duration: 8, id: 48, name: 'B', planned_in: '2020-12-28 09:30:00', planned_out: '2020-12-28 17:30:00', start_time: 15,
    }, {
      duration: 6.75, id: 51, name: 'C', planned_in: '2020-12-28 17:45:00', planned_out: '2020-12-29 00:30:00', start_time: 15,
    }],
  },
  newBooking: { loading: false, err: undefined, data: undefined },
  bookingInfo: {
    bookingId: 1,
    date: '2020-10-20 01:45:00',
    site: {
      duration: 8,
      id: 48,
      name: 'B',
      planned_in: '2020-12-21 09:30:00',
      planned_out: '2020-12-21 17:30:00',
      start_time: 15,
    },
    workStationType: {
      file_path: '/web/image/mro.asset.category/212/image_medium/212.png',
      id: 212,
      name: 'Work Station - WMB',
      sequence: 1,
      type: 'room',
    },

  },
};
const bookingInfoForViews = {
  employees: [{
    active: true,
    barcode: '',
    company: { id: 63, name: 'Water Mark Building' },
    department: {},
    employee_ref: false,
    gender: 'male',
    id: 6235,
    job: {},
    name: 'Raja',
    parent: {},
    vendor: {
      id: 1450,
      name: 'Motivity Labs(Tenant)',
    },
    vendor_ref: '',
    work_email: 'abhi@helixsense.com',
    work_phone: '98765617',
  },
  {
    active: true,
    barcode: '',
    company: { id: 63, name: 'Water Mark Building' },
    department: {},
    employee_ref: false,
    gender: 'male',
    id: 6235,
    job: {},
    name: 'Raju',
    parent: {},
    vendor: {
      id: 1450,
      name: 'Motivity Labs(Tenant)',
    },
    vendor_ref: '',
    work_email: 'abhi@helixsense.com',
    work_phone: '98765617',
  }],
  workStations: { data: workStations },
  floorView: {
    data: [{
      file_path: '/web/image/mro.equipment.location/9104/upload_images/9104.svg+xml',
      id: 9104,
      latitude: false,
      longitude: false,
      path_name: 'WMB/WBL/F#10',
      sequence_asset_hierarchy: 'WMB-A-00003',
      space_name: 'Floor #10',
    }],
  },
  categories: {
    data: [
      {
        file_path: '/web/image/mro.asset.category/211/image_medium/211.png', id: 211, name: 'Conference Room', sequence: 1, type: 'building',
      },
      {
        file_path: '/web/image/mro.asset.category/212/image_medium/212.png', id: 212, name: 'Work Station', sequence: 1, type: 'room',
      },
    ],
  },
  shiftsInfo: {
    data: [{
      duration: 8, id: 48, name: 'B', planned_in: '2020-12-28 09:30:00', planned_out: '2020-12-28 17:30:00', start_time: 15,
    }, {
      duration: 6.75, id: 51, name: 'C', planned_in: '2020-12-28 17:45:00', planned_out: '2020-12-29 00:30:00', start_time: 15,
    }],
  },
  newBooking: { loading: false, err: undefined, data: undefined },
  spacesForFloor: {
    data: [
      {
        asset_category_id: [211, 'Conference Room'],
        id: 9105,
        is_booking_allowed: true,
        latitude: '117.45695228322217',
        longitude: '167.86885582349922',
        path_name: 'WMB/WBL/F#10/WS/Z#4/Row#1/TS/CR#1',
        sequence_asset_hierarchy: 'WMB-A-00004',
        space_name: 'Conference Room #1',
        space_status: 'Partial',
        space_sub_type: {},
      },
    ],
  },
  bookingInfo: {
    bookingId: 1,
    viewType: 'floor',
    date: '2020-10-20 01:45:00',
    site: {
      duration: 8,
      id: 48,
      name: 'B',
      planned_in: '2020-12-21 09:30:00',
      planned_out: '2020-12-21 17:30:00',
      start_time: 15,
    },
    workStationType: {
      file_path: '/web/image/mro.asset.category/212/image_medium/212.png',
      id: 212,
      name: 'Work Station - WMB',
      sequence: 1,
      type: 'room',
    },
  },
};
describe('createBooking testing', () => {
  it('BookingLayout snapshot testing', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<BookingLayout />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('BookingFilter snapshot testing for floor view', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<BookingFilter viewType="floor" loadFloorView={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('BookingFilter snapshot testing for tree view', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<BookingFilter viewType="tree" loadFloorView={jest.fn()} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('BookingModalWindow snapshot testing', () => {
    Calandar.mockImplementation(() => (
      <div />
    ));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<BookingModalWindow shiftModalWindowOpen openModalWindow={jest.fn()} bookingData={bookingData} filter={false} bookingItem={bookingItem} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('ConfirmBookingModalScreen snapshot testing', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<ConfirmBookingModalScreen bookingData={bookingData} selectWorkStation={workStations} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('ConfirmBookingModalWindow snapshot testing', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<ConfirmBookingModalWindow bookingData={bookingData} openmodalPreview openPreview={jest.fn()} saveBooking={jest.fn()} selectWorkStation={workStations} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('WorkStationTypes snapshot testing', () => {
    useSelector.mockImplementation((fn) => fn({
      bookingInfo,
    }));
    const { asFragment } = render(<WorkStationTypes setWorkStationType={jest.fn()} workStationType={bookingInfo.categories.data[0]} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('BookingShifts snapshot testing', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { asFragment } = render(<BookingShifts onSiteUpdate={jest.fn()} calendarDate={1609138543765} />);
    expect(asFragment()).toMatchSnapshot();
  });

  // test for services

  it('test for resetBooking function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'resetBookingAction');
    const result = services.resetBooking();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('test for getFloorView function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getFloorViewInfo');
    const result = services.getFloorView('mro.equipment.location', 3);
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('test for getWorkStationsData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getWorkStationsList');
    const result = services.getWorkStationsData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('test for getShiftsData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getShiftsList');
    const result = services.getShiftsData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('test for setBookingData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'setBookingInfo');
    const result = services.setBookingData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('test for getCategoriesOfWorkStations function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getWorkStationCategories');
    const result = services.getCategoriesOfWorkStations();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });
  // test for actions

  it('test for getFloorViewInfo function', () => {
    const getFloorViewInfo = () => actions.getFloorViewInfo('mro.equipment.location', 3);
    getFloorViewInfo('mro.equipment.location', 3);
    expect(actions.getFloorViewInfo('mro.equipment.location', 3)).toBeDefined();
  });

  it('test for resetBookingAction function', () => {
    const resetBookingAction = () => actions.resetBookingAction();
    resetBookingAction();
    expect(actions.resetBookingAction()).toBeDefined();
  });

  it('test for getWorkStationsList function', () => {
    const getWorkStationsList = () => actions.getWorkStationsList();
    getWorkStationsList();
    expect(actions.getWorkStationsList()).toBeDefined();
  });

  it('test for getShiftsList function', () => {
    const getShiftsList = () => actions.getShiftsList();
    getShiftsList();
    expect(actions.getShiftsList()).toBeDefined();
  });

  it('test for setBookingInfo function', () => {
    const setBookingInfo = () => actions.setBookingInfo();
    setBookingInfo();
    expect(actions.setBookingInfo()).toBeDefined();
  });

  it('test for getWorkStationCategories function', () => {
    const getWorkStationCategories = () => actions.getWorkStationCategories();
    getWorkStationCategories();
    expect(actions.getWorkStationCategories()).toBeDefined();
  });

  // test for reducer

  const initialState = {
    importantContacts: [],
    bookingInfo: {},
    deleteInfo: {},
    workStations: null,
    workStationsLoading: true,
    workStationError: null,
    bookingList: {},
    shiftsInfo: {},
    newBooking: {},
    employees: [],
    floorView: {},
    categories: {},
    workStationAvailability: {},
    workSpaceId: null,
    availabilityResponse: {},
  };

  it('it should handle GET_CATEGORIES_OF_WORKSTATIONS', () => {
    expect(reducer(initialState, { type: actions.GET_CATEGORIES_OF_WORKSTATIONS })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories:
        { loading: true, err: undefined, data: undefined },
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS', () => {
    expect(reducer(initialState, { type: actions.GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS, payload: { data: {} } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories:
        { loading: false, err: undefined, data: {} },
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_CATEGORIES_OF_WORKSTATIONS_FAILURE', () => {
    expect(reducer(initialState, { type: actions.GET_CATEGORIES_OF_WORKSTATIONS_FAILURE, error: { data: 'error' } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories:
        { loading: false, err: 'error', data: undefined },
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle SET_BOOKING_DATA', () => {
    expect(reducer(initialState, { type: actions.SET_BOOKING_DATA, payload: { data: {} } })).toEqual({
      importantContacts: [],
      bookingInfo: { data: {} },
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_SHIFTS_DATA', () => {
    expect(reducer(initialState, { type: actions.GET_SHIFTS_DATA })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: { loading: true },
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_SHIFTS_DATA_SUCCESS', () => {
    expect(reducer(initialState, { type: actions.GET_SHIFTS_DATA_SUCCESS, payload: { data: {} } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: { loading: false, err: {}, data: {} },
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_SHIFTS_DATA_FAILURE', () => {
    expect(reducer(initialState, { type: actions.GET_SHIFTS_DATA_FAILURE, error: { data: 'error' } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: { loading: false, err: 'error', data: [] },
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_WORK_STATIONS_DATA', () => {
    expect(reducer(initialState, { type: actions.GET_WORK_STATIONS_DATA })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: { data: null, err: null, loading: true },
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_WORK_STATIONS_DATA_SUCCESS', () => {
    expect(reducer(initialState, { type: actions.GET_WORK_STATIONS_DATA_SUCCESS, payload: { data: workStations } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: { data: workStations, err: null, loading: false },
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_WORK_STATIONS_DATA_FAILURE', () => {
    expect(reducer(initialState, { type: actions.GET_WORK_STATIONS_DATA_FAILURE, error: { data: 'error' } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: { data: null, err: 'error', loading: false },
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle RESET_BOOKING', () => {
    expect(reducer(initialState, { type: actions.RESET_BOOKING })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: { loading: false, err: undefined, data: undefined },
      employees: [],
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_FLOOR_VIEW', () => {
    expect(reducer(initialState, { type: actions.GET_FLOOR_VIEW })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: { loading: true },
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_FLOOR_VIEW_SUCCESS', () => {
    expect(reducer(initialState, { type: actions.GET_FLOOR_VIEW_SUCCESS, payload: { data: {} } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: { loading: false, data: {}, err: {} },
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_FLOOR_VIEW_FAILURE', () => {
    expect(reducer(initialState, { type: actions.GET_FLOOR_VIEW_FAILURE, error: { data: 'error' } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees: [],
      floorView: { loading: false, data: [], err: 'error' },
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('dom testing for workStations while having data', () => {
    useSelector.mockImplementation((fn) => fn({
      bookingInfo,
    }));
    const { container } = render(<WorkStationTypes setWorkStationType={jest.fn()} workStationType={bookingInfo.categories.data[0]} />);
    expect(screen.getByText('Work Station')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Work Station'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for workStations while loading', () => {
    useSelector.mockImplementation((fn) => fn({
      bookingInfo: {
        categories: { loading: true },
      },
    }));
    const { container } = render(<WorkStationTypes setWorkStationType={jest.fn()} workStationType={bookingInfo.categories.data[0]} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for workStations while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      bookingInfo: {
        categories: { loading: false, err: { error: { message: 'error' } }, data: {} },
      },
    }));
    const { container } = render(<WorkStationTypes setWorkStationType={jest.fn()} workStationType={bookingInfo.categories.data[0]} />);
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingShifts while loading', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo: {
        shiftsInfo: { loading: true },
      },
    }));
    const { container } = render(<BookingShifts onSiteUpdate={jest.fn()} calendarDate={1609138543765} />);
    fireEvent.click(screen.getByTestId('loader'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingShifts while having no data', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo: {
        shiftsInfo: { loading: false, data: [] },
      },
    }));
    const { container } = render(<BookingShifts onSiteUpdate={jest.fn()} />);
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingShifts while having data', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo,
    }));
    const { container } = render(<BookingShifts onSiteUpdate={jest.fn()} />);
    fireEvent.click(screen.getAllByTestId('shift')[0]);
    fireEvent.click(screen.getAllByTestId('shift')[1]);
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingShifts while having data and bookingItem', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo,
    }));
    const { container } = render(<BookingShifts onSiteUpdate={jest.fn()} bookingItem={bookingItem} />);
    fireEvent.click(screen.getAllByTestId('shift')[0]);
    expect(container).toBeInTheDocument();
  });
  it('dom testing for ConfirmBookingModalWindow ', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo,
    }));
    const { container } = render(<ConfirmBookingModalWindow bookingData={bookingData} openmodalPreview openPreview={jest.fn()} saveBooking={jest.fn()} selectWorkStation={workStations} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for ConfirmBookingModalWindow while loading data ', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo: {
        newBooking: { loading: true },
      },
    }));
    const { container } = render(<ConfirmBookingModalWindow bookingData={bookingData} openmodalPreview openPreview={jest.fn()} saveBooking={jest.fn()} selectWorkStation={workStations} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for ConfirmBookingModalWindow while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      bookingInfo: {
        newBooking: {
          err:
          {
            error: {
              message: 'error',
            },
          },
        },
      },
    }));
    const { container } = render(<ConfirmBookingModalWindow bookingData={bookingData} openmodalPreview openPreview={jest.fn()} saveBooking={jest.fn()} selectWorkStation={workStations} />);
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for ConfirmBookingModalScreen while having more than one workstation', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<ConfirmBookingModalScreen bookingData={bookingData1} selectWorkStation={workStations} />);
    expect(screen.getAllByText('WMB/WBL/F#10/WS/Z#2/Row#8/WS#96')[0]).toBeInTheDocument();
    expect(screen.getAllByText('raja')[0]).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for ConfirmBookingModalScreen with new_planned_in and new_planned_out', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<ConfirmBookingModalScreen bookingData={bookingData2} selectWorkStation={workStations} />);
    expect(screen.getAllByText('WMB/WBL/F#10/WS/Z#2/Row#8/WS#96')[0]).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for ConfirmBookingModalScreen while having single workstation', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<ConfirmBookingModalScreen bookingData={bookingData1} selectWorkStation={workStations[0]} />);
    expect(screen.getByText('WMB/WBL/F#10/WS/Z#2/Row#8/WS#96')).toBeInTheDocument();
    expect(screen.getByText('Work Station #96')).toBeInTheDocument();
    expect(screen.getByTestId('date')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout while slecting views', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      bookingInfo: bookingInfoForViews,
    }));
    const { container } = render(<BookingLayout />);
    fireEvent.click(screen.getByText('Tree View'));
    fireEvent.click(screen.getByText('Map View'));
    fireEvent.click(screen.getByTestId('space0'));
    fireEvent.click(screen.getByText('Book'));
    fireEvent.click(screen.getByText('Next'));
    const floors = screen.getAllByText('Floor #10');
    expect(floors[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back'));
    expect(mockHistoryPush).toHaveBeenCalledWith({ pathname: '/' });
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Date/Time'));
    expect(screen.getByText('Filter By')).toBeInTheDocument();
    fireEvent.click(floors[0]);
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout while opening booking popover', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      bookingInfo: bookingInfoForViews,
    }));
    const { container } = render(<BookingLayout />);
    fireEvent.click(screen.getByTestId('next'));
    fireEvent.click(screen.getByTestId('back'));
    fireEvent.click(screen.getByText('Tree View'));
    fireEvent.click(screen.getByText('Map View'));
    fireEvent.change(screen.getByTestId('group'));
    fireEvent.change(screen.getByTestId('individual'));
    fireEvent.click(screen.getByTestId('group'));
    fireEvent.click(screen.getByTestId('individual'));
    fireEvent.click(screen.getByTestId('space0'));
    fireEvent.click(screen.getByTestId('book'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout while selecting Categories', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      bookingInfo: bookingInfoForViews,
    }));
    const { container } = render(<BookingLayout />);
    fireEvent.click(screen.getByText('Tree View'));
    fireEvent.click(screen.getByText('Map View'));
    fireEvent.click(screen.getByTestId('space0'));
    fireEvent.click(screen.getByText('Categories'));
    fireEvent.click(screen.getByText('Conference Room'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout without bookingInfo', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      bookingInfo: {
        bookingInfo: false,
      },

    }));
    const { container } = render(<BookingLayout />);
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout while loading data', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      bookingInfo: bookingInfoForLoading,
    }));
    const { container } = render(<BookingLayout />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: true,
      bookingInfo: bookingInfoForError,
    }));
    const { container } = render(<BookingLayout />);
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingLayout while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      bookingInfo: bookingInfoForViews,
    }));
    const { container } = render(<BookingLayout />);
    fireEvent.click(screen.getByTestId('next'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingModalWindow while having bookingItem', () => {
    Calandar.mockImplementation(() => (<div />));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingModalWindow shiftModalWindowOpen openModalWindow={jest.fn()} bookingData={bookingData} filter={false} bookingItem={bookingItem} />);
    fireEvent.click(screen.getByText('Next'));
    // fireEvent.click(screen.getByText('Work Station'));
    // fireEvent.click(screen.getByText('Next'));
    // expect(screen.getByText('Please Select a Valid Date')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingModalWindow without filter', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingModalWindow shiftModalWindowOpen openModalWindow={jest.fn()} />);
    fireEvent.click(screen.getByText('Next'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingModalWindow with filter', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingModalWindow shiftModalWindowOpen openModalWindow={jest.fn()} filter />);
    fireEvent.click(screen.getByText('Next'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingModalWindow without filter and bookingData', () => {
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingModalWindow shiftModalWindowOpen openModalWindow={jest.fn()} filter={false} bookingItem={bookingItem1} />);
    fireEvent.click(screen.getByText('Next'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for BookingModalWindow without filter and having reshedule type', () => {
    Calandar.mockImplementation(() => (
      <div />
    ));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingModalWindow shiftModalWindowOpen openModalWindow={jest.fn()} bookingItem={bookingItem2} />);
    fireEvent.click(screen.getByText('Next'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for Calender with bookingData', () => {
    Calandar.mockImplementation(({ onChange }) => {
      function onChangeValue(newDate) {
        onChange(newDate);
      }
      onChangeValue('2021-01-28T18:13:45.000Z');
      return (
        <div
          onChange={onChange}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<Calender onDateUpdate={jest.fn()} bookingData={{ date: '' }} />);
    expect(container).toBeInTheDocument();
  });

  it('dom testing for Calender without palnned_in', () => {
    Calandar.mockImplementation(({ onChange }) => {
      function onChangeValue(newDate) {
        onChange(newDate);
      }
      onChangeValue('2021-01-28T18:13:45.000Z');
      return (
        <div
          onChange={onChange}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<Calender onDateUpdate={jest.fn()} bookingItem={bookingItem1} />);
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingFilter with floor view', () => {
    Calandar.mockImplementation(() => (
      <div />
    ));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingFilter viewType="floor" loadFloorView={jest.fn()} />);
    const conferenceRoom = screen.getAllByText('Conference Room');
    fireEvent.click(screen.getAllByText('Floor #10')[0]);
    fireEvent.click(screen.getByText('Date/Time'));
    fireEvent.click(conferenceRoom[0]);
    expect(container).toBeInTheDocument();
  });

  it('dom testing BookingFilter with tree view', () => {
    Calandar.mockImplementation(() => (
      <div />
    ));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config,
      workStationsLoading: false,
      workStations,
      bookingInfo,
    }));
    const { container } = render(<BookingFilter viewType="tree" loadFloorView={jest.fn()} />);
    const workStation = screen.getAllByText('Work Station');
    fireEvent.click(screen.getByText('Date/Time'));
    fireEvent.click(workStation[0]);
    fireEvent.click(screen.getAllByText('Conference Room')[0]);
    expect(container).toBeInTheDocument();
  });

  it('test for buildSaveBookingObject function', () => {
    const buildSaveBookingObj = () => buildSaveBookingObject(workStations1, bookingData, userInfo1, bookingInfo.employees);
    buildSaveBookingObj(workStations1, bookingData, userInfo1, bookingInfo.employees);
    expect(buildSaveBookingObject(workStations1, bookingData, userInfo1, bookingInfo.employees)).toBeDefined();
  });

  it('test for buildSaveBookingObject function with multiple employees and workspaces', () => {
    const buildSaveBookingObj = () => buildSaveBookingObject(workStations, bookingData, userInfo, bookingInfo.employees);
    buildSaveBookingObj(workStations, bookingData, userInfo, bookingInfo.employees);
    expect(buildSaveBookingObject(workStations, bookingData, userInfo, bookingInfo.employees)).toBeDefined();
  });

  it('test for buildSaveBookingObject function with single employee and workspace', () => {
    const buildSaveBookingObj = () => buildSaveBookingObject(workStations1, bookingData, userInfo, employees);
    buildSaveBookingObj(workStations1, bookingData, userInfo, employees);
    expect(buildSaveBookingObject(workStations1, bookingData, userInfo, employees)).toBeDefined();
  });

  it('test for buildSaveBookingObject function with single workspace and multiple employess', () => {
    const buildSaveBookingObj = () => buildSaveBookingObject(workStations1, bookingData, userInfo, bookingInfo.employees);
    buildSaveBookingObj(workStations1, bookingData, userInfo, bookingInfo.employees);
    expect(buildSaveBookingObject(workStations1, bookingData, userInfo, bookingInfo.employees)).toBeDefined();
  });

  it('test for buildSaveBookingObject function with improper userinfo', () => {
    const buildSaveBookingObj = () => buildSaveBookingObject(workStations, bookingData, { employee: { id: 34 } }, bookingInfo.employees);
    buildSaveBookingObj(workStations, bookingData, { employee: { id: 34 } }, bookingInfo.employees);
    expect(buildSaveBookingObject(workStations, bookingData, { employee: { id: 34 } }, bookingInfo.employees)).toBeDefined();
  });
});
