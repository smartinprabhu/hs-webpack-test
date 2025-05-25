import React from 'react';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import api from '../../../../middleware/api';
import * as services from '../service';
import GetAccess from '../accessQrScan';
import * as actions from '../actions';
import reducer from '../reducer';
import 'babel-polyfill';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

const bookingList = {
  data: [
    {
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
        name: 'SI ABHI',
      },
      id: 91404,
      is_host: false,
      members: [],
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
    },
  ],
};

describe('accessQrScan testing', () => {
  it('snapshot testing for GET_BOOKING_LIST action', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        bookingListInfo: {
          loading: true, err: {},
        },
      },
    }));
    const { asFragment } = render(<GetAccess location={{ search: '?uuid=0a3ac7cf-ccbb-4356-b8df-073ec0a32aa0' }} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot testing for GET_BOOKING_LIST_SUCCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        bookingListInfo: {
          loading: false, data: bookingList.data, err: {},
        },
      },
    }));
    const { asFragment } = render(<GetAccess location={{ search: '?uuid=0a3ac7cf-ccbb-4356-b8df-073ec0a32aa0' }} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('it should mock the getBookingList function', () => {
    const getBookingList = (uuid) => actions.getBookingList(uuid);
    getBookingList('0a3ac7cf-ccbb-4356-b8df-073ec0a32aa0');
    expect(actions.getBookingList).toBeDefined();
  });

  it('it should mock the getBookingListFromUuid function', () => {
    const getBookingListFromUuid = (uuid) => services.getBookingListFromUuid(uuid);
    getBookingListFromUuid('0a3ac7cf-ccbb-4356-b8df-073ec0a32aa0');
    expect(services.getBookingListFromUuid).toBeDefined();
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

  const initialState = {
    bookingListInfo: {},
    accessInfo: { err: null },
  };

  it('it should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('it should handle the GET_BOOKING_LIST', () => {
    expect(reducer(initialState, {
      type: actions.GET_BOOKING_LIST,
    })).toEqual({
      accessInfo: { err: null },
      bookingListInfo: { loading: true, err: {} },
    });
  });

  it('it should handle the GET_BOOKING_LIST_FAILURE', () => {
    expect(reducer(initialState, {
      type: actions.GET_BOOKING_LIST_FAILURE,
      error: { data: 'an error occured' },
    })).toEqual({
      accessInfo: { err: null },
      bookingListInfo: { loading: false, data: {}, err: 'an error occured' },
    });
  });

  it('it should handle the GET_BOOKING_LIST_SUCCESS', () => {
    expect(reducer(initialState, {
      type: actions.GET_BOOKING_LIST_SUCCESS,
      payload: { data: bookingList },
    })).toEqual({
      accessInfo: { err: null },
      bookingListInfo: { loading: false, data: bookingList, err: {} },
    });
  });

  it('it should handle getBookingListFromUuid function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getBookingList');
    const result = services.getBookingListFromUuid();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('dom testing while passing uuid', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn({
      access: {
        bookingListInfo: { loading: false, data: bookingList.data, err: {} }, accessInfo: {},
      },
    }));
    const { container, getByText } = render(
      <GetAccess location={{
        search: '?uuid=0a3ac7cf-ccbb-4356-b8df-073ec0a32aa0',
      }}
      />,
    );

    expect(getByText('Have a nice day!')).toBeInTheDocument();
    expect(getByText('Water Mark Building')).toBeInTheDocument();
    expect(getByText('WS#41')).toBeInTheDocument();
    expect(getByText('Scan QR code to access the building')).toBeInTheDocument();
    expect(getByText('Tuesday 20 October 2020')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing without passing uuid', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn({
      access: {
        bookingListInfo: { loading: true, err: {} },
        accessInfo: {},
      },
    }));
    const { container } = render(<GetAccess location={{ search: '?sessionId=0a3ac7cf-ccbb-4356-b8df-073ec0a32aa0' }} />);
    expect(container).toBeInTheDocument();
  });
});
