/* eslint-disable max-len */
/* eslint-disable no-console */

import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import { useSelector } from 'react-redux';
import { act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';

import SelectedSpaceView from '../selectedSpaceView';

jest.mock('@fullcalendar/react', () => () => <div />);
jest.mock('@fullcalendar/daygrid', () => jest.fn());
jest.mock('@fullcalendar/interaction', () => jest.fn());
jest.mock('@fullcalendar/timegrid', () => jest.fn());

const mockedStore = {
  bookingInfo: {
    bookingInfo: {
      date: 'Tue Dec 29 2020 19:50:20 GMT+0530',
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
    workStationAvailability: {
      data: [{
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 1,
        employee: { id: '', name: '' },
        id: 9544,
        is_booking_allowed: true,
        is_parent: false,
        latitude: '163',
        longitude: '572',
        max_occupancy: 0,
        parent: { id: 9540, name: 'Z#1' },
        path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2',
        position: { xpos: '', ypos: '' },
        space_name: 'Work Station #14',
        space_number: 'WMB-A-00163',
        space_sub_type: { id: 38, name: 'Office Area' },
        space_type: { id: 9, name: 'Area' },
        status: 'Ready',
      }],
      err: undefined,
      loading: false,
    },
    availabilityResponse: {
      9544: [{
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 1,
        employee: { id: '', name: '' },
        id: 9544,
        is_booking_allowed: true,
        is_parent: false,
        latitude: '163',
        longitude: '572',
        max_occupancy: 0,
        parent: { id: 9540, name: 'Z#3' },
        path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2',
        position: { xpos: '', ypos: '' },
        space_name: 'Row #2',
        space_number: 'WMB-A-00163',
        space_sub_type: { id: 50, name: 'Workstation Area' },
        space_type: { id: 9, name: 'Area' },
        status: 'Ready',
      }],
    },
  },
  config: {
    configObj: {
      data: {
        booking: {
          allow_onspot_space_booking: true, book_from_outlook: false, buffer_period_mins: 15, create_work_schedule: true, future_limit_days: 7, minimum_duration_mins: 60, onspot_booking_grace_period: 2, show_occupant: false, work_schedule_grace_period: 2,
        },
      },
    },
  },
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
};

const treeViewData = [
  {
    children: [],
    employee: {
      id: 6235, is_onboarded: false, label: 'Raja', name: 'Raja', registration_status: 'draft', value: 'Raja',
    },
    id: 9544,
    isBookingAllowed: true,
    is_booking_allowed: true,
    is_parent: false,
    name: 'Work Station #14',
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#14',
    space_name: 'Work Station #14',
    space_number: 'WMB-A-00022',
    status: 'Ready to occupy',
    treeNodeId: '9544',
  },
];

const removeNodeWithEmployee = jest.fn();
const colSize = false;
const removeAll = false;
const updateWorkSpace = jest.fn();
const workSpace = [];

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

// function renderWithRedux(component) {
//   return {
//     ...render(<Provider store={mockedStore}>{component}</Provider>),
//   };
// }

describe('selectedSpaceView test cases', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockedStore));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  it('selectedSpaceView should render for empty tree data without error', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { asFragment } = render(<SelectedSpaceView
      treeViewData={[]}
      removeNodeWithEmployee={removeNodeWithEmployee}
      removeAll={removeAll}
      updateWorkSpace={updateWorkSpace}
    />);
    expect(asFragment()).toMatchSnapshot();
  });

  // it('selectedSpaceView should render for tree data without error', async () => {
  //     useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

  //     const { asFragment } = await (() => {
  //         render(<SelectedSpaceView treeViewData={treeViewData} removeNodeWithEmployee={removeNodeWithEmployee} colSize={colSize}
  //             removeAll={true} updateWorkSpace={updateWorkSpace} workSpace={workSpace} />);
  //     })
  //     // expect(asFragment()).toMatchSnapshot();
  // });

  it('selectedSpaceView should render for tree data without error', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { asFragment } = render(<SelectedSpaceView
      treeViewData={treeViewData}
      removeNodeWithEmployee={removeNodeWithEmployee}
      colSize={colSize}
      removeAll
      updateWorkSpace={updateWorkSpace}
      workSpace={workSpace}
    />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should check DOM', async () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<SelectedSpaceView
      treeViewData={[]}
      removeNodeWithEmployee={removeNodeWithEmployee}
      colSize={colSize}
      removeAll={removeAll}
      updateWorkSpace={updateWorkSpace}
      workSpace={workSpace}
      selectedWorkSpace={treeViewData}
    />);

    console.log(container);
    const displayText = screen.getByText('No selected space found');
    expect(displayText).toHaveTextContent('No selected space found');
  });

  it('should call async remove function', async () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = await (() => {
      render(<SelectedSpaceView
        treeViewData={treeViewData}
        removeNodeWithEmployee={removeNodeWithEmployee}
        removeAll={removeAll}
        colSize={false}
        updateWorkSpace={updateWorkSpace}
        workSpace={treeViewData}
      />);
    });

    const displayText = await waitFor(() => screen.getByText('Remove'));
    act(() => {
      fireEvent.click(displayText);
    });
    expect(container).toBeInTheDocument();
  });

  it('should call remove function', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<SelectedSpaceView
      treeViewData={treeViewData}
      removeNodeWithEmployee={removeNodeWithEmployee}
      removeAll={removeAll}
      updateWorkSpace={updateWorkSpace}
    />);

    const displayText = screen.getByText('Remove');

    act(() => {
      fireEvent.click(displayText);
    });
    expect(container).toBeInTheDocument();
  });

  it('should call reset function', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));

    const { container } = render(<SelectedSpaceView
      treeViewData={treeViewData}
      removeNodeWithEmployee={removeNodeWithEmployee}
      removeAll={removeAll}
      colSize={false}
      updateWorkSpace={updateWorkSpace}
      workSpace={[]}
    />);
    const resetButton = screen.getByTestId('resetId');

    act(() => {
      fireEvent.click(resetButton);
    });
    expect(container).toBeInTheDocument();
  });
});
