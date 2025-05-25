import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';

import BookingCalendarDayGridComponent from '../bookingCalendarDayGridView';

const workStationAvailability = [
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: { id: '', name: '' },
    id: 9401,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '163',
    longitude: '572',
    max_occupancy: 0,
    parent: { id: 9545, name: 'Row#3' },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#14',
    position: { xpos: '', ypos: '' },
    space_name: 'Work Station #14',
    space_number: 'WMB-A-00022',
    space_sub_type: { id: 50, name: 'Workstation Area' },
    space_type: { id: 9, name: 'Area' },
    status: 'Ready',
  },
];

const bookingSpace = {
  children: [],
  employee: {
    id: 6235,
    is_onboarded: false,
    label: 'Raja',
    name: 'Raja',
    registration_status: 'draft',
    value: 'Raja',
  },
  id: 9401,
  is_booking_allowed: true,
  is_parent: false,
  name: 'Work Station #14',
  path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#14',
  space_name: 'Work Station #14',
  space_number: 'WMB-A-00022',
  status: 'Ready to occupy',
  treeNodeId: '9401',
};

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
    bookingInfo: {
      date: '2020-12-28T05:59:43+00:00>',
      workStationType: {
        file_path: '/web/image/mro.asset.category/212/image_medium/212.png',
        id: 212,
        name: 'Work Station',
        sequence: 1,
        type: 'room',
      },
      site: {
        duration: 8.25,
        id: 47,
        name: 'A',
        planned_in: '2020-12-28 01:00:00',
        planned_out: '2020-12-28 09:15:00',
        start_time: 6.5,
      },
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

jest.mock('@fullcalendar/react', () => () => <div />);
jest.mock('@fullcalendar/daygrid', () => () => <div />);
jest.mock('@fullcalendar/interaction', () => () => <div />);
jest.mock('@fullcalendar/timegrid', () => () => <div />);

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

// function renderWithRedux(component) {
//   return {
//     ...render(<Provider store={mockedStore}>{component}</Provider>),
//   };
// }

describe('BookingCalendarDayGridView test case', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockedStore));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  it('BookingCalendarDayGridComponent renders without error', async () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { asFragment } = render(<BookingCalendarDayGridComponent bookingSpace={bookingSpace} workStationAvailability={workStationAvailability} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers fullShift and reset button', async () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<BookingCalendarDayGridComponent bookingSpace={bookingSpace} workStationAvailability={workStationAvailability} />);

    const fullShift = screen.getByTestId('fullShiftId');
    act(() => {
      fireEvent.click(fullShift);
      fireEvent.click(fullShift);
    });
    expect(container).toBeInTheDocument();
  });

  it('should cover for pre-bookings', () => {
    const workStationAvailabilityBookings = [
      {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [
          {
            planned_in: '2020-12-28 01:00:00',
            planned_out: '2020-12-28 09:15:00',
          },
        ],
        child_count: 0,
        employee: { id: '', name: '' },
        id: 9401,
        is_booking_allowed: true,
        is_parent: false,
        latitude: '163',
        longitude: '572',
        max_occupancy: 0,
        parent: { id: 9545, name: 'Row#3' },
        path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#14',
        position: { xpos: '', ypos: '' },
        space_name: 'Work Station #14',
        space_number: 'WMB-A-00022',
        space_sub_type: { id: 50, name: 'Workstation Area' },
        space_type: { id: 9, name: 'Area' },
        status: 'Ready',
      },
    ];

    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<BookingCalendarDayGridComponent bookingSpace={bookingSpace} workStationAvailability={workStationAvailabilityBookings} />);

    // const data = {
    //   allDay: false,
    //   end: 'Wed Dec 30 2020 18:00:00 GMT+0530',
    //   endStr: '2020-12-30T18:00:00+05:30',
    //   start: 'Wed Dec 30 2020 17:15:00 GMT+0530',
    //   startStr: '2020-12-30T17:15:00+05:30',
    // };

    expect(container).toBeInTheDocument();
  });
});
