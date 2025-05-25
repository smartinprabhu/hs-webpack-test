import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';

import BookingActionButton from '../bookingActionButton';

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
    deleteInfo: {},
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
        access: { access_type: 'QR', enable_access: true, skip_occupy: false },
        attendance: { attendance_source: 'mobile', attendance_with_face_detection: false, require_attendance: true },
        occupy: { detect_mask: true, face_detection_mandatory: true, mask_mandatory: true },
        prerelease: { prerelease_period: 1, prerelease_required: true },
        prescreen: {
          checklists: [{ id: 1711, name: 'Covid-19 Checklist.' }], enable_prescreen: true, prescreen_is_mandatory: false, prescreen_period: 1, prescreen_required_every_schedule: false, require_checklist: true,
        },
        release: { auto_release: true, auto_release_grace_period: 5, generate_mor_after_release: true },
      },
    },
  },
  preScreening: {
    preScreeningProcess: {},
  },
  access: {
    accessInfo: { err: null },
  },
  occupy: {
    occupyResponse: {},
  },
  release: {
    releaseInfo: {},
  },
};

const bookingItem = {
  access_status: false,
  actual_in: '',
  actual_out: '',
  book_for: 'myself',
  booking_type: 'individual',
  company: { id: 63, name: 'Water Mark Building' },
  employee: { id: 6235, name: 'Raja' },
  id: 92269,
  is_cancelled: false,
  is_host: false,
  members: [],
  planned_in: '2020-12-31 05:45:00',
  planned_in_before: '2020-12-31 04:45:00',
  planned_out: '2020-12-31 07:30:00',
  planned_out_after: '2020-12-31 08:30:00',
  planned_status: 'Regular',
  prescreen_status: false,
  shift: { id: 47, name: 'A' },
  space: {
    id: 9401, latitude: '', longitude: '', name: 'WS#14', status: 'Ready',
  },
  user_defined: false,
  uuid: '719f3d17-ac99-447c-bbb7-8ac6fd1d60f2',
  vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
  working_hours: 0,
};

const bookingActionComplete = jest.fn();
const openRescheduleModalWindow = jest.fn();

describe('BookingActionButton test cases', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockedStore));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  it('renders booking action button', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { asFragment } = render(<BookingActionButton bookingItem={bookingItem} bookingActionComplete={bookingActionComplete} openRescheduleModalWindow={openRescheduleModalWindow} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('clicks pre screen booking', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<BookingActionButton bookingItem={bookingItem} bookingActionComplete={bookingActionComplete} openRescheduleModalWindow={openRescheduleModalWindow} />);

    const preScreenButton = screen.getByText('PRE-SCREEN');
    const cancelButton = screen.getByText('Cancel');
    act(() => {
      fireEvent.click(preScreenButton);
      fireEvent.click(cancelButton);
    });
    expect(container).toBeInTheDocument();
  });

  it('clicks access', () => {
    const accessBookingItem = {
      access_status: false,
      actual_in: '',
      actual_out: '',
      book_for: 'myself',
      booking_type: 'individual',
      company: { id: 63, name: 'Water Mark Building' },
      employee: { id: 6235, name: 'Raja' },
      id: 92269,
      is_cancelled: false,
      is_host: false,
      members: [],
      planned_in: '2020-12-31 05:45:00',
      planned_in_before: '2020-12-31 04:45:00',
      planned_out: '2020-12-31 07:30:00',
      planned_out_after: '2020-12-31 08:30:00',
      planned_status: 'Regular',
      prescreen_status: true,
      shift: { id: 47, name: 'A' },
      space: {
        id: 9401, latitude: '', longitude: '', name: 'WS#14', status: 'Ready',
      },
      user_defined: false,
      uuid: '719f3d17-ac99-447c-bbb7-8ac6fd1d60f2',
      vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
      working_hours: 0,
    };
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<BookingActionButton bookingItem={accessBookingItem} bookingActionComplete={bookingActionComplete} openRescheduleModalWindow={openRescheduleModalWindow} />);

    const accessButton = screen.getByText('ACCESS');
    act(() => {
      fireEvent.click(accessButton);
    });
    expect(container).toBeInTheDocument();
  });

  it('clicks occupy', () => {
    const occupyBookingItem = {
      access_status: true,
      actual_in: '',
      actual_out: '',
      book_for: 'myself',
      booking_type: 'individual',
      company: { id: 63, name: 'Water Mark Building' },
      employee: { id: 6235, name: 'Raja' },
      id: 92269,
      is_cancelled: false,
      is_host: false,
      members: [],
      planned_in: '2020-12-31 05:45:00',
      planned_in_before: '2020-12-31 04:45:00',
      planned_out: '2020-12-31 07:30:00',
      planned_out_after: '2020-12-31 08:30:00',
      planned_status: 'Regular',
      prescreen_status: true,
      shift: { id: 47, name: 'A' },
      space: {
        id: 9401, latitude: '', longitude: '', name: 'WS#14', status: 'Ready',
      },
      user_defined: false,
      uuid: '719f3d17-ac99-447c-bbb7-8ac6fd1d60f2',
      vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
      working_hours: 0,
    };
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<BookingActionButton bookingItem={occupyBookingItem} bookingActionComplete={bookingActionComplete} openRescheduleModalWindow={openRescheduleModalWindow} />);

    const occupyButton = screen.getByText('OCCUPY');
    act(() => {
      fireEvent.click(occupyButton);
    });
    expect(container).toBeInTheDocument();
  });

  it('has occupied', () => {
    const occupiedMockedStore = {
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
            access: { access_type: 'QR', enable_access: true, skip_occupy: false },
            attendance: { attendance_source: 'mobile', attendance_with_face_detection: false, require_attendance: true },
            occupy: { detect_mask: true, face_detection_mandatory: true, mask_mandatory: true },
            prerelease: { prerelease_period: 1, prerelease_required: true },
            prescreen: {
              checklists: [{ id: 1711, name: 'Covid-19 Checklist.' }], enable_prescreen: true, prescreen_is_mandatory: false, prescreen_period: 1, prescreen_required_every_schedule: false, require_checklist: true,
            },
            release: { auto_release: true, auto_release_grace_period: 5, generate_mor_after_release: true },
          },
        },
      },
      bookingInfo: {
        preScreeningProcess: {},
      },
      preScreening: {
        preScreeningProcess: {},
      },
      access: {
        accessInfo: { err: null },
      },
      occupy: {
        occupyResponse: {
          data: [136892],
          err: {},
          loading: false,
        },
      },
      release: {
        releaseInfo: {},
      },
    };

    const occupyBookingItem = {
      access_status: true,
      actual_in: '',
      actual_out: '',
      book_for: 'myself',
      booking_type: 'individual',
      company: { id: 63, name: 'Water Mark Building' },
      employee: { id: 6235, name: 'Raja' },
      id: 92269,
      is_cancelled: false,
      is_host: false,
      members: [],
      planned_in: '2020-12-31 05:45:00',
      planned_in_before: '2020-12-31 04:45:00',
      planned_out: '2020-12-31 07:30:00',
      planned_out_after: '2020-12-31 08:30:00',
      planned_status: 'Regular',
      prescreen_status: true,
      shift: { id: 47, name: 'A' },
      space: {
        id: 9401, latitude: '', longitude: '', name: 'WS#14', status: 'Occupied',
      },
      user_defined: false,
      uuid: '719f3d17-ac99-447c-bbb7-8ac6fd1d60f2',
      vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
      working_hours: 0,
    };
    useSelector.mockImplementation((selectorFn) => selectorFn(occupiedMockedStore));

    const { container } = render(<BookingActionButton bookingItem={occupyBookingItem} bookingActionComplete={bookingActionComplete} openRescheduleModalWindow={openRescheduleModalWindow} />);

    const releaseButton = screen.getByText('RELEASE');
    act(() => {
      fireEvent.click(releaseButton);
    });
    expect(container).toBeInTheDocument();
  });
});
