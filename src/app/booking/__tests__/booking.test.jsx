import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';

import Booking from '../booking';
import * as actions from '../actions';
import importContact, * as services from '../bookingService';
import reducer from '../reducer';
import api from '../../../middleware/api';

afterEach(() => {
  cleanup();
});

jest.mock('@fullcalendar/react', () => () => <div />);
jest.mock('@fullcalendar/daygrid', () => jest.fn());
jest.mock('@fullcalendar/interaction', () => jest.fn());
jest.mock('@fullcalendar/timegrid', () => jest.fn());
jest.mock('powerbi-report-component', () => jest.fn());

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

const mockedStore = {
  user: {
    userInfo: {
      address: {
        country: {}, formatted: '↵↵  ↵', locality: '', postal_code: '', region: {}, street_address: '',
      },
      company: {
        address: 'Water Mark Building↵9th & 10th floor, Water Mark B… Hitech City,↵Hyderabad 500084↵Telangana TS↵India', id: 63, name: 'Water Mark Building', timezone: 'Asia/Kolkata',
      },
      email: { email: 'rajahr@gmail.com', readonly: true },
      employee: {
        id: 6235, is_onboarded: false, name: 'Raja', registration_status: 'draft',
      },
      id: 1114,
      image_url: 'https://demo.helixsense.com/web/image/res.partner/1455/image/1455.png',
      locale: 'es_ES',
      main_company: { id: 63, name: 'Water Mark Building' },
      mobile: '',
      name: 'Raja',
      oauth_uid: '',
      partner_id: 1455,
      phone_number: '',
      timezone: 'Asia/Kolkata',
      user_role: 'tenant_hr',
      username: 'rajahr@gmail.com',
      vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
      website: '',
      allowed_companies: [
        {
          country: { id: 104, name: 'India' },
          id: 3,
          locality: 'Bengaluru',
          name: 'Divyasree Technopark..',
          postal_code: '560037',
          region: { id: 593, name: 'Karnataka (IN)' },
          street_address: 'DTP Entry Gate, EPIP Zone',
        },
        {
          country: { id: 104, name: 'India' },
          id: 63,
          locality: 'Hyderabad',
          name: 'Water Mark Building',
          postal_code: '500084',
          region: { id: 608, name: 'Telangana (IN)' },
          street_address: '9th & 10th floor, Water Mark Building,',
        },
        {
          country: { id: 104, name: 'India' },
          id: 62,
          locality: 'Hyderabad',
          name: 'Motivity Labs',
          postal_code: '',
          region: { id: 608, name: 'Telangana (IN)' },
          street_address: '9th & 10th floor, Water Mark Building, Plot No. 11, Survey no.9',
        },
      ],
    },
  },
  bookingInfo: {
    bookingList: {
      err: {},
      loading: false,
      data: [{
        access_status: false,
        actual_in: '',
        actual_out: '',
        book_for: 'myself',
        booking_type: 'individual',
        company: { id: 63, name: 'Water Mark Building' },
        employee: { id: 6235, name: 'Raja' },
        id: 92255,
        is_cancelled: false,
        is_host: false,
        members: [],
        planned_in: '2020-12-30 09:30:00',
        planned_in_before: '2020-12-30 08:30:00',
        planned_out: '2020-12-30 17:30:00',
        planned_out_after: '2020-12-30 18:30:00',
        planned_status: 'Regular',
        prescreen_status: false,
        shift: { id: 48, name: 'B' },
        space: {
          id: 9401, latitude: '', longitude: '', name: 'WS#14', status: 'Ready',
        },
        user_defined: false,
        uuid: 'cc94c5aa-282a-4bd9-b691-765cfd89f3ad',
        vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
        working_hours: 0,
      }],
    },
  },
  config: {
    configObj: {
      err: null,
      loading: false,
      data: {
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
        group_booking: {
          enable_booking_for_others: true,
          enable_group_booking: true,
          prescreen_required_every_schedule: false,
        },
      },
    },
  },
};

describe('bookings layout tests', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockedStore));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  it('should render booking', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { asFragment } = render(<Booking />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should call booking function', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));
    const { container } = render(<Booking />);
    const bookButton = screen.getByTestId('bookButton');

    act(() => {
      fireEvent.click(bookButton);
    });
    expect(container).toBeInTheDocument();
  });

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

  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  it('should handle GET_BOOKING_LIST reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_BOOKING_LIST',
    })).toEqual({
      ...initialState,
      bookingList: { loading: true },
      newBooking: (initialState.newBooking, { loading: false, err: undefined }),
      workStations: null,
    });
  });

  it('should handle GET_BOOKING_LIST_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_BOOKING_LIST_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      bookingList: (initialState.bookingList, { loading: false, data: '', err: {} }),
    });
  });

  it('should handle GET_BOOKING_LIST_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_BOOKING_LIST_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      bookingList: (initialState.bookingList, { loading: false, err: '', data: [] }),
    });
  });

  it('should handle SAVE_GROUP_BOOKING reducer', () => {
    expect(reducer(initialState, {
      type: 'SAVE_GROUP_BOOKING',
    })).toEqual({
      ...initialState,
      newBooking: (initialState.newBooking, { loading: true }),
    });
  });

  it('should handle SAVE_BOOKING_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'SAVE_BOOKING_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState, newBooking: {},
    });
  });

  it('should handle SAVE_GROUP_BOOKING_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'SAVE_GROUP_BOOKING_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      newBooking: (initialState.newBooking, { loading: false, err: '', data: undefined }),
    });
  });

  it('should handle SAVE_GROUP_BOOKING_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'SAVE_GROUP_BOOKING_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      newBooking: (initialState.newBooking,
      { loading: false, err: undefined, data: '' }),
    });
  });

  it('should handle SAVE_GROUP_BOOKING_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'RESET_BOOKING',
    })).toEqual({
      ...initialState,
      newBooking: (initialState.newBooking,
      { loading: false, err: undefined, data: undefined }),
    });
  });

  it('should handle GET_SHIFTS_DATA reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_SHIFTS',
    })).toEqual({
      ...initialState,
      shiftsInfo: { loading: true },
    });
  });

  it('should handle GET_SHIFTS_DATA_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_SHIFTS_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      shiftsInfo: { loading: false, data: '', err: {} },
      newBooking: {},
    });
  });

  it('should handle GET_SHIFTS_DATA_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_SHIFTS_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      shiftsInfo: { loading: false, data: [], err: '' },
    });
  });

  it('should handle GET_WORK_STATIONS_DATA reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_WORK_STATIONS',
    })).toEqual({
      ...initialState,
      workStations: { loading: true, data: null, err: null },
    });
  });

  it('should handle GET_WORK_STATIONS_DATA_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_WORK_STATIONS_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      workStationsLoading: true,
      workStations: { loading: false, err: null, data: '' },
    });
  });

  it('should handle GET_WORK_STATIONS_DATA_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_WORK_STATIONS_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      workStations: { data: null, err: '', loading: false },
      workStationError: null,
      workStationsLoading: true,
    });
  });

  it('should handle GET_IMPORTANT_CONTACTS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_IMP_CONTACTS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      importantContacts: { data: '' },
    });
  });

  it('should handle SET_BOOKING_DATA reducer', () => {
    expect(reducer(initialState, {
      type: 'SET_BOOKING_INFO',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      bookingInfo: { data: '' },
    });
  });

  it('should handle GET_ALL_EMPLOYEE_LIST reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_ALL_EMPLOYEE_LIST',
    })).toEqual({
      ...initialState,
    });
  });

  it('should handle GET_ALL_EMPLOYEE_LIST_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_ALL_EMPLOYEE_LIST_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      employees: '',
    });
  });

  it('should handle GET_ALL_EMPLOYEE_LIST_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_ALL_EMPLOYEE_LIST_FAILURE',
    })).toEqual({
      ...initialState,
      employees: [],
    });
  });

  it('should handle GET_FLOOR_VIEW reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_FLOOR_VIEW',
    })).toEqual({
      ...initialState,
      floorView: { loading: true },
    });
  });

  it('should handle GET_FLOOR_VIEW_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_FLOOR_VIEW_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      floorView: { loading: false, data: '', err: {} },
    });
  });

  it('should handle GET_FLOOR_VIEW_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_FLOOR_VIEW_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      floorView: { loading: false, data: [], err: '' },
    });
  });

  it('should handle DELETE_BOOKING reducer', () => {
    expect(reducer(initialState, {
      type: 'DELETE_BOOKING',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      deleteInfo: { loading: true },
    });
  });

  it('should handle DELETE_BOOKING_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'DELETE_BOOKING_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      deleteInfo: { loading: false, data: '', err: undefined },
    });
  });

  it('should handle DELETE_BOOKING_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'DELETE_BOOKING_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      deleteInfo: { loading: false, err: '', data: undefined },
    });
  });

  it('should handle CLEAR_ERROR reducer', () => {
    expect(reducer(initialState, {
      type: 'CLEAR_ERROR',
    })).toEqual({
      ...initialState,
      deleteInfo: {},
    });
  });

  it('should handle GET_CATEGORIES_OF_WORKSTATIONS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_CATEGORIES_OF_WORKSTATIONS',
    })).toEqual({
      ...initialState,
      categories: { loading: true, err: undefined, data: undefined },
    });
  });

  it('should handle GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      categories: { loading: false, err: undefined, data: '' },
    });
  });

  it('should handle GET_CATEGORIES_OF_WORKSTATIONS_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_CATEGORIES_OF_WORKSTATIONS_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      categories: { loading: false, err: '', data: undefined },
    });
  });

  it('should handle GET_AVAILABILITY_OF_WORK_STATION reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_AVAILABILITY_OF_WORK_STATION',
    })).toEqual({
      ...initialState,
      workStationAvailability: { loading: true, err: undefined, data: undefined },
    });
  });

  it('should handle GET_AVAILABILITY_OF_WORK_STATION_SUCCESS reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_AVAILABILITY_OF_WORK_STATION_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      workStationAvailability: { loading: false, err: undefined, data: '' },
      availabilityResponse: { [initialState.workSpaceId]: '' },
    });
  });

  it('should handle GET_AVAILABILITY_OF_WORK_STATION_FAILURE reducer', () => {
    expect(reducer(initialState, {
      type: 'GET_AVAILABILITY_OF_WORK_STATION_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      workStationAvailability: { loading: false, err: '', data: undefined },
      availabilityResponse: { [initialState.workSpaceId]: '' },
    });
  });

  it('should handle SET_SPACE_ID reducer', () => {
    expect(reducer(initialState, {
      type: 'SET_SPACE_ID',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      workSpaceId: { data: '' },
    });
  });

  it('it should handle getBookingsList function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getBookingList');
    const result = services.getBookingsList();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getBookingsList', () => {
    const getBookingsList = () => services.getBookingsList();
    getBookingsList();
    expect(services.getBookingsList).toBeDefined();
  });

  it('it should handle setBookingInfo function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'setBookingInfo');
    const result = services.setBookingData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle saveBookingData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'saveBooking');
    const result = services.saveBookingData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle saveGroupBookingData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'saveGroupBooking');
    const result = services.saveGroupBookingData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getShiftsData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getShiftsList');
    const result = services.getShiftsData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getWorkStationsData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getWorkStationsList');
    const result = services.getWorkStationsData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle removeBooking function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'cancelBooking');
    const result = services.removeBooking();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle clearErr function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'clearDeleteError');
    const result = services.clearErr();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle resetBooking function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'resetBookingAction');
    const result = services.resetBooking();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getFloorView function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getFloorViewInfo');
    const result = services.getFloorView();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getCategoriesOfWorkStations function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getWorkStationCategories');
    const result = services.getCategoriesOfWorkStations();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getImpContacts function', async () => {
    const dispatch = jest.fn();
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const spy = jest.spyOn(actions, 'getImportantContacts');
    const result = importContact();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(window.fetch).toHaveBeenCalledTimes(1);
  });

  it('should check all service', async () => {
    const getBookingsListSpy = jest.spyOn(services, 'getBookingsList');
    const setBookingDataSpy = jest.spyOn(services, 'setBookingData');
    const saveBookingDataSpy = jest.spyOn(services, 'saveBookingData');
    const saveGroupBookingDataSpy = jest.spyOn(services, 'saveGroupBookingData');
    const getShiftsDataSpy = jest.spyOn(services, 'getShiftsData');
    const getWorkStationsDataSpy = jest.spyOn(services, 'getWorkStationsData');
    const removeBookingSpy = jest.spyOn(services, 'removeBooking');
    const clearErrSpy = jest.spyOn(services, 'clearErr');
    const resetBookingSpy = jest.spyOn(services, 'resetBooking');
    const getFloorViewSpy = jest.spyOn(services, 'getFloorView');
    const getCategoriesOfWorkStationsSpy = jest.spyOn(services, 'getCategoriesOfWorkStations');

    services.getBookingsList();
    expect(getBookingsListSpy).toBeCalled();

    services.setBookingData();
    expect(setBookingDataSpy).toBeCalled();

    services.saveBookingData();
    expect(saveBookingDataSpy).toBeCalled();

    services.saveGroupBookingData();
    expect(saveGroupBookingDataSpy).toBeCalled();

    services.getShiftsData();
    expect(getShiftsDataSpy).toBeCalled();

    services.getWorkStationsData();
    expect(getWorkStationsDataSpy).toBeCalled();

    services.removeBooking();
    expect(removeBookingSpy).toBeCalled();

    services.clearErr();
    expect(clearErrSpy).toBeCalled();

    services.resetBooking();
    expect(resetBookingSpy).toBeCalled();

    services.getFloorView();
    expect(getFloorViewSpy).toBeCalled();

    services.getCategoriesOfWorkStations();
    expect(getCategoriesOfWorkStationsSpy).toBeCalled();
  });

  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through GET_BOOKING_LIST action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_BOOKING_LIST };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_BOOKING_LIST_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_BOOKING_LIST_SUCCESS };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('passes through GET_BOOKING_LIST_FAILURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_BOOKING_LIST_FAILURE };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('it should handle getBookingList', () => {
    const getBookingList = () => actions.getBookingList();
    getBookingList();
    expect(actions.getBookingList).toBeDefined();
  });

  it('it should mock getBookingList function', () => {
    // eslint-disable-next-line no-import-assign
    actions.getBookingList = jest.fn();
    const getBookingList = (data, data1, data2) => actions.getBookingList(data, data1, data2);
    getBookingList('plannedOut', 'comId', 'empId');
    expect(actions.getBookingList).toBeCalled();
  });
});
