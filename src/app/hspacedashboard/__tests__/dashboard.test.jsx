import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import MockDate from 'mockdate';
import Dashboard from '../dashboard';
import 'babel-polyfill';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));
jest.mock('@fullcalendar/react', () => { });
jest.mock('@fullcalendar/timegrid', () => { });
jest.mock('@fullcalendar/interaction', () => { });
jest.mock('../../booking/createBookingViews/floorView/layoutFloorView', () => { });
jest.mock('../../booking/createBooking/workStationTypes', () => { });
jest.mock('../../analytics/analyticsView', () => { });

afterEach(cleanup);

// beforeAll(() => {
//   process.env = Object.assign(process.env, { ONESIGNALAPPID: '1234' });
// });

const userInfo = {
  data: {
    allowed_companies: [{
      country: { id: 104, name: 'India' },
      id: 3,
      locality: 'Bengaluru',
      name: 'Divyasree Technopark..',
      postal_code: '560037',
      region: { id: 593, name: 'Karnataka (IN)' },
      street_address: 'DTP Entry Gate, EPIP Zone',
    }],
    employee: {
      id: 6235,
      is_onboarded: false,
      name: 'Raja',
      registration_status: 'draft',
    },
    company: {
      address: 'Water Mark  Building\n222 W. Las Colinas Blvd.\nSuite 755 East\nIrving TX 75039\nUnited States',
      id: 3,
      name: 'Water Mark  Building',
      timezone: 'US/Central',
    },
    id: 1114,
    image_url: 'https://demo.helixsense.com/web/image/res.partner/1455/image/1455.png',
    locale: 'es_ES',
    main_company: { id: 63, name: 'Water Mark Building' },
    mobile: '',
    name: 'Raja',
    phone_number: '',
    timezone: 'Asia/Kolkata',
    user_role: 'tenant_hr',
    username: 'rajahr@gmail.com',
  },
};

describe('Dashboard testing', () => {
  it('snapshot testing ', async () => {
    MockDate.set(1434319925275);
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo: userInfo.data,
      },
      config: {
        covidResources: {
          loading: false,
          err: null,
          data: {},
        },
      },
      configObj:
      {
        loading: false,
        err: null,
        data: {},
      },
      bookingInfo: {
        bookingList: {
          loading: false,
          err: null,
          data: {},
        },
      },
    }));
    const { asFragment } = render(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });
});
