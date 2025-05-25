import React from 'react';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import FullCalendar from '@fullcalendar/react';
import 'babel-polyfill';

import MyBookings from '../myBookings';
import * as actions from '../actions';
import getBookingsList, { getScheduledBookingsList } from '../service';
import reducer from '../reducer';

jest.mock('@fullcalendar/react', () => jest.fn());
jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));
jest.mock('@fullcalendar/react', () => () => <div />);
jest.mock('@fullcalendar/daygrid', () => jest.fn());
jest.mock('@fullcalendar/interaction', () => jest.fn());
jest.mock('@fullcalendar/timegrid', () => jest.fn());
jest.mock('../../analytics/analyticsView', () => jest.fn());

jest.mock('../../booking/createBooking/workStationTypes', () => () => jest.fn());
const bookingsList = [
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
      id: 6235,
      name: 'Raja',
    },
    id: 90410,
    is_cancelled: false,
    is_host: false,
    members: [],
    planned_in: '2020-08-31 00:00:00',
    planned_out: '2020-08-31 15:00:00',
    planned_status: 'Regular',
    prescreen_status: true,
    shift: {
      id: 47,
      name: 'A',
    },
    space: {
      name: '#WS3',
    },
    user_defined: true,
    uuid: 'b6975ea1-0fe5-4e76-b82c-bc94e49d0eff',
    vendor: {
      id: 1450,
      name: 'Motivity Labs(Tenant)',
    },
    working_hours: 0.0,
  },
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
      id: 6235,
      name: 'Raja',
    },
    id: 90410,
    is_cancelled: false,
    is_host: false,
    members: [],
    planned_in: '2020-08-31 00:00:00',
    planned_out: '2020-08-31 15:00:00',
    planned_status: 'Regular',
    prescreen_status: true,
    shift: {
      id: 47,
      name: 'A',
    },
    space: {},
    user_defined: true,
    uuid: 'b6975ea1-0fe5-4e76-b82c-bc94e49d0eff',
    vendor: {
      id: 1450,
      name: 'Motivity Labs(Tenant)',
    },
    working_hours: 0.0,
  },
];

const bookingsList1 = [{
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
    id: 6235,
    name: 'Raja',
  },
  id: 90410,
  is_cancelled: false,
  is_host: false,
  members: [],
  planned_in: '2020-08-31 00:00:00',
  planned_out: '2020-08-31 15:00:00',
  planned_status: 'Regular',
  prescreen_status: false,
  shift: {
    id: 47,
    name: 'A',
  },
  space: {
    name: '#WS3',
  },
  user_defined: true,
  uuid: 'b6975ea1-0fe5-4e76-b82c-bc94e49d0eff',
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  working_hours: 0.0,
}];

const configObj = {
  data: {
    access: {
      access_type: 'QR',
      enable_access: true,
      skip_occupy: false,
    },
    prescreen: {
      checklists: [
        {
          id: 1711,
          name: 'Covid-19 Checklist.',
        },
      ],
      enable_prescreen: true,
      prescreen_is_mandatory: false,
      prescreen_period: 1.0,
      require_checklist: true,
    },
  },
  booking: { future_limit_days: 7 },
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
describe('myBookings testing', () => {
  it('MyBookings snapshot testing ', () => {
    FullCalendar.mockImplementation(({ eventClick, dayCellContent, datesSet }) => {
      function handleEventClick(values) {
        eventClick(values);
      }
      function EventDetail(data) {
        dayCellContent(data);
      }
      EventDetail({ date: '2021-02-04T11:27:59.000Z' });
      function getPreviousData(data) {
        datesSet(data);
      }
      getPreviousData({
        startStr: '2020-12-30T17:15:00+05:30',
        endStr: '2020-12-30T18:00:00+05:30',
      });
      return (
        <div
          eventClick={handleEventClick}
          dayCellContent={EventDetail}
          datesSet={getPreviousData}
          events={bookingsList}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config: { configObj },
      myBookings: { bookingsList1 },
      bookingInfo: {},
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config: { configObj },
      myBookings: { bookingsList },
    }));
    const { asFragment } = render(<MyBookings />);
    expect(asFragment()).toMatchSnapshot();
  });

  // test for reducers

  const initialState = {
    bookingsList: {},
  };

  it('it should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('it should handle the GET_BOOKINGS', () => {
    expect(reducer(initialState, {
      type: actions.GET_BOOKINGS,
    })).toEqual({
      bookingsList: {},
    });
  });

  it('it should handle the GET_BOOKINGS_FAILURE', () => {
    expect(reducer(initialState, {
      type: actions.GET_BOOKINGS_FAILURE,
      error: { data: 'error' },
    })).toEqual({
      bookingsList: {
        err: 'error',
      },
    });
  });

  it('it should handle the GET_BOOKINGS_SUCCESS', () => {
    expect(reducer(initialState, {
      type: actions.GET_BOOKINGS_SUCCESS,
      payload: { data: bookingsList },
    })).toEqual({
      bookingsList,
    });
  });

  // test for actions

  it('test for getBookings function', () => {
    const getBookings = () => actions.getBookings();
    getBookings();
    expect(actions.getBookings()).toBeDefined();
  });

  // test for services

  it('test for getBookingsList function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getBookings');
    const result = getBookingsList();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('test for getScheduledBookingsList function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getBookingsWithinDuration');
    const result = getScheduledBookingsList();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('MyBookings dom testing without calling functions', async () => {
    FullCalendar.mockImplementation(() => (<div />));
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config: { configObj },
      myBookings: { bookingsList },
      bookingInfo: {},
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    const { container } = render(<MyBookings />);
    expect(container).toBeInTheDocument();
  });

  it('MyBookings dom testing while passing configObj data', async () => {
    let executed = false;
    FullCalendar.mockImplementation(({ eventClick, dayCellContent, datesSet }) => {
      const panelData = {
        el: {
          style: {},
        },
        event: {
          el: {
            style: {
              backgroundColor: '#44ADE3',
            },
          },
          _def: {
            extendedProps: bookingsList[0],
          },
        },
      };
      function handleEventClick(values) {
        if (!executed) {
          eventClick(values);
          executed = true;
        }
      }
      handleEventClick(panelData);
      function EventDetail(data) {
        dayCellContent(data);
      }
      EventDetail({ date: '2021-02-04T11:27:59.000Z' });
      function getPreviousData(data) {
        datesSet(data);
      }
      getPreviousData({
        startStr: '2020-12-30T17:15:00+05:30',
        endStr: '2020-12-30T18:00:00+05:30',
      });
      return (
        <div
          eventClick={handleEventClick}
          dayCellContent={EventDetail}
          datesSet={getPreviousData}
          events={bookingsList}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      access: { accessInfo: { data: { message: 'success' } } },
      occupy: { occupyResponse: {} },
      release: { releaseInfo: {} },
      bookingInfo: { deleteInfo: {} },
      config: {
        configObj: {
          data: {
            access: {
              access_type: 'QR',
              enable_access: true,
              skip_occupy: false,
            },
            prescreen: {
              checklists: [
                {
                  id: 1711,
                  name: 'Covid-19 Checklist.',
                },
              ],
              enable_prescreen: true,
              prescreen_is_mandatory: false,
              prescreen_period: 1.0,
              require_checklist: true,
            },
          },
        },
      },
      myBookings: { bookingsList1 },
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    const { container } = render(<MyBookings />);
    expect(container).toBeInTheDocument();
  });

  it('MyBookings dom testing while clicking BOOk button', async () => {
    FullCalendar.mockImplementation(() => (<div />));

    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      config: { configObj },
      myBookings: { bookingsList1 },
      bookingInfo: {},
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    const { container } = render(<MyBookings />);
    fireEvent.click(screen.getByText('BOOK'));
    expect(container).toBeInTheDocument();
  });
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
  it('MyBookings dom testing while having no employeeID', async () => {
    FullCalendar.mockImplementation(() => (<div />));
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo: {
          company: {
            timezone: 'Asia/Kolkata',
          },
          employee: {},
        },
      },
      workStations,
      config: { configObj: {} },
      myBookings: { bookingsList1 },
      bookingInfo: {
        workStations,
      },
      preScreening: {
        preScreeningProcess: { err: {} },
      },
    }));
    const { container } = render(<MyBookings />);
    fireEvent.click(screen.getByTestId('book'));
    fireEvent.click(screen.getByText('Next'));
    expect(container).toBeInTheDocument();
  });
  it('MyBookings dom testing ', async () => {
    FullCalendar.mockImplementation(() => (<div />));
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo: {
          company: {
            timezone: 'Asia/Kolkata',
          },
          employee: {},
        },
      },
      workStations,
      config: { configObj: {} },
      myBookings: { bookingsList1 },
      bookingInfo: {
        workStations,
      },
      preScreening: {
        preScreeningProcess: { err: {} },
      },
    }));
    const { container } = render(<MyBookings />);
    expect(container).toBeInTheDocument();
  });

  it('MyBookings dom testing while executing handleEventClick function', async () => {
    let executed = false;
    FullCalendar.mockImplementation(({ eventClick, dayCellContent, datesSet }) => {
      const panelData = {
        el: {
          style: {},
        },
        event: {
          el: {
            style: {
              backgroundColor: '#44ADE3',
            },
          },
          _def: {
            extendedProps: bookingsList[0],
          },
        },
      };
      function handleEventClick(values) {
        if (!executed) {
          eventClick(values);
          executed = true;
        }
      }
      handleEventClick(panelData);
      function EventDetail(data) {
        dayCellContent(data);
      }
      EventDetail({ date: '2021-02-04T11:27:59.000Z' });
      function getPreviousData(data) {
        datesSet(data);
      }
      getPreviousData({
        startStr: '2020-12-30T17:15:00+05:30',
        endStr: '2020-12-30T18:00:00+05:30',
      });
      return (
        <div
          eventClick={handleEventClick}
          dayCellContent={EventDetail}
          datesSet={getPreviousData}
          events={bookingsList}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      access: { accessInfo: {} },
      occupy: { occupyResponse: {} },
      release: { releaseInfo: {} },
      bookingInfo: { deleteInfo: {} },
      config: {
        configObj: {
          data: {},
        },
      },
      myBookings: { bookingsList1 },
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    const { container } = render(<MyBookings />);
    fireEvent.click(screen.getByTestId('close'));
    expect(container).toBeInTheDocument();
  });

  it('MyBookings dom testing while having no previousData state value', async () => {
    let executed = false;
    FullCalendar.mockImplementation(({ eventClick, dayCellContent, datesSet }) => {
      function handleEventClick(values) {
        if (!executed) {
          eventClick(values);
          executed = true;
        }
      }
      function EventDetail(data) {
        dayCellContent(data);
      }
      EventDetail({ date: '2021-02-04T11:27:59.000Z' });
      function getPreviousData(data) {
        datesSet(data);
      }
      getPreviousData({
        startStr: '2020-12-30T17:15:00+05:30',
        endStr: '2020-12-30T18:00:00+05:30',
      });
      return (
        <div
          eventClick={handleEventClick}
          dayCellContent={EventDetail}
          datesSet={getPreviousData}
          events={bookingsList}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo: { vendor: {}, employee: {} } },
      access: { accessInfo: {} },
      occupy: { occupyResponse: {} },
      release: { releaseInfo: {} },
      bookingInfo: { deleteInfo: {} },
      config: {
        configObj: {
          data: {},
        },
      },
      myBookings: { bookingsList1 },
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    const { container } = render(<MyBookings />);
    expect(container).toBeInTheDocument();
  });

  it('MyBookings dom testing while having previousData state value', async () => {
    let executed = 0;
    FullCalendar.mockImplementation(({ eventClick, dayCellContent, datesSet }) => {
      const panelData = {
        el: {
          style: {},
        },
        event: {
          el: {
            style: {
              backgroundColor: '#44ADE3',
            },
          },
          _def: {
            extendedProps: bookingsList[0],
          },
        },
      };
      function handleEventClick(values) {
        if (executed !== 2) {
          eventClick(values);
          executed += 1;
        }
      }
      handleEventClick(panelData);
      function EventDetail(data) {
        dayCellContent(data);
      }
      EventDetail({ date: '' });
      function getPreviousData(data) {
        datesSet(data);
      }
      getPreviousData({
        startStr: '2020-12-30T17',
        endStr: '2020-12-30T18',
      });
      return (
        <div
          eventClick={handleEventClick}
          dayCellContent={EventDetail}
          datesSet={getPreviousData}
          events={bookingsList}
        />
      );
    });
    useSelector.mockImplementation((fn) => fn({
      user: { userInfo },
      access: { accessInfo: {} },
      occupy: { occupyResponse: {} },
      release: { releaseInfo: {} },
      bookingInfo: { deleteInfo: {} },
      config: {
        configObj: {
          data: {},
        },
      },
      myBookings: { bookingsList1 },
      preScreening: {
        preScreeningProcess: {},
      },
    }));
    const { container } = render(<MyBookings />);
    expect(container).toBeInTheDocument();
  });
});
