/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'babel-polyfill';
import Select from 'react-select';

import * as actions from '../../actions';
import * as services from '../../bookingService';
import * as floorViewServices from '../treeView/layoutTreeViewService';
import getAllEmployees from '../treeView/layoutTreeViewService';
import reducer from '../../reducer';
import FloorViewLayout from '../floorView/floorViewLayout';
import AvailableIcon from '../floorView/availableIcon';

jest.mock('@fullcalendar/react', () => jest.fn());
jest.mock('@fullcalendar/daygrid', () => jest.fn());
jest.mock('@fullcalendar/interaction', () => jest.fn());
jest.mock('@fullcalendar/timegrid', () => jest.fn());
jest.mock('../../../analytics/analyticsView', () => jest.fn());

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));
jest.mock('react-select', () => jest.fn());
jest.resetAllMocks();

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
const spacesForFloor = [
  {
    asset_category_id: [211, 'Conference Room'],
    id: 9105,
    is_booking_allowed: true,
    latitude: '117.45695228322217',
    longitude: '167.86885582349922',
    path_name: 'WMB/WBL/F#10/WS/Z#4/Row#1/TS/CR#1',
    sequence_asset_hierarchy: 'WMB-A-00004',
    space_name: 'Conference Room #1',
    status: 'Partial',
    space_status: 'Partial',
    space_sub_type: {},
  },
];
const userInfo = {
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  employee: {
    id: 6453,
    name: 'Raja',
  },
  company: {
    address: 'Water Mark  Building\n222 W. Las Colinas Blvd.\nSuite 755 East\nIrving TX 75039\nUnited States',
    id: 3,
    name: 'Water Mark  Building',
    timezone: 'US/Central',
  },
};

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
},
{
  active: true,
  barcode: '',
  company: { id: 63, name: 'Water Mark Building' },
  department: {},
  employee_ref: false,
  gender: 'male',
  id: 6454,
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
}];

const workStations = [{
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9104,
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
  space_status: 'Ready',
  is_booking_allowed: true,
}];

const floorView = {
  data: [{
    file_path: '/web/image/mro.equipment.location/9104/upload_images/9104.svg+xml',
    id: 9104,
    latitude: false,
    longitude: false,
    path_name: 'WMB/WBL/F#10',
    sequence_asset_hierarchy: 'WMB-A-00003',
    space_name: 'Floor #10',
  }],
};

const workstaion1 = [{
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9483,
  is_parent: false,
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
    id: 29,
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
  status: 'Partial',
  space_status: 'Partial',
  is_booking_allowed: true,
}];

const workstation2 = [{
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9483,
  is_parent: false,
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
    id: 29,
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
  status: 'Booked',
  space_status: 'Booked',
  is_booking_allowed: true,
}];

const workstation3 = [{
  asset_categ_type: 'room',
  availability_status: true,
  bookings: [],
  child_count: 0,
  employee: { id: 6235, name: 'raja' },
  id: 9483,
  is_parent: false,
  site: {
    planned_in: '2020-10-20 01:45:00',
    planned_out: '2020-10-20 10:15:00',
    id: 29,
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
  status: 'Maintenance in Progress',
  space_status: 'Maintenance in Progress',
  is_booking_allowed: true,
}];

describe('floorview testing', () => {
  it('snapshot testing for FloorViewLayout', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        spacesForFloor: { data: spacesForFloor },
        workStations: {
          data: [{
            asset_categ_type: 'room',
            availability_status: true,
            bookings: [],
            child_count: 0,
            employee: { id: 6237, name: 'Raja' },
            id: 9489,
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
            space_status: 'Ready',
            is_booking_allowed: true,
          }],
        },
        workStationAvailability: {
          data: [],
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: 'Raja' },
          id: 9480,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );

    const { asFragment } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('dom testing for FloorViewLayout for zoomin, zoomout, reset', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },

        workStationAvailability: {
          data: workStations,
        },
        bookingInfo: {
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
        availabilityResponse: workStations,
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );

    const {
      container, getByTestId,
    } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('reset'));
    fireEvent.click(getByTestId('zoomIn'));
    fireEvent.click(getByTestId('zoomOut'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout test for remove', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workstaion1 },
        spacesForFloor: { data: spacesForFloor },

        workStationAvailability: {
          data: workstaion1,
        },
        bookingInfo: {
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
        availabilityResponse: workstaion1,
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          status: 'Partial',
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    fireEvent.click(getByText('Book'));
    fireEvent.click(getByText('Remove'));
    fireEvent.click(getByTestId('svg'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout for group booking', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },

        workStationAvailability: {
          data: workStations,
        },
        availabilityResponse: { 9483: workStations },
        bookingInfo: {
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
      },
      config: {
        configObj: {
          data: {
            booking: {
              buffer_period_mins: 15,
              create_work_schedule: true,
            },
          },
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'clear', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="group"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raju' },
    });
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByTestId('space0'));
    fireEvent.click(getByText('Close'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout for individual booking', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },
        workStationAvailability: {
          data: workStations,
        },
        availabilityResponse: { 9483: workStations },
        bookingInfo: {
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
      },
      config: {
        configObj: {
          data: {
            booking: {
              buffer_period_mins: 15,
              create_work_schedule: true,
            },
          },
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'remove-value', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raju' },
    });
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByTestId('space0'));
    fireEvent.click(getByText('Close'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout  for individual booking select tag', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        spacesForFloor: { data: spacesForFloor },
        workStations: { data: workStations },
        workStationAvailability: {
          data: [],
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9104,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          status: 'Partial',
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'clear', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getAllByTestId,
    } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    const selectTags = getAllByTestId('select');
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout while performing clear action', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        spacesForFloor: { data: spacesForFloor },

        workStations: [{
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6237, name: '' },
          id: 9483,
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
          space_status: 'Ready',
          is_booking_allowed: true,
        }],
        workStationAvailability: {
          data: [],
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'clear', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getAllByTestId,
    } = render(
      <FloorViewLayout
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    const selectTags = getAllByTestId('select');
    fireEvent.click(selectTags[0]);
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout while performing otherthan clear and remove action in individual booking', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },

        workStationAvailability: {
          data: workStations,
        },
        availabilityResponse: { 9483: workStations },
        bookingInfo: {
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
      },
      config: {
        configObj: {
          data: {
            booking: {
              buffer_period_mins: 15,
              create_work_schedule: true,
            },
          },
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raju' },
    });
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByTestId('space0'));
    fireEvent.click(getByText('Close'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout for group booking select tag', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },

        workStationAvailability: {
          data: workStations,
        },
        availabilityResponse: workStations,
        bookingInfo: {
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
      },
      config: {
        configObj: {
          data: {
            booking: {
              buffer_period_mins: 15,
              create_work_schedule: true,
            },
          },
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: 'Raja' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange([values], { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getAllByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="group"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    const selectTags = getAllByTestId('select');
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    fireEvent.click(getByText('Book'));
    fireEvent.change(selectTags[0], {
      target: { value: 'Raju' },
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout while performing otherthan clear and remove action in group booking', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },
        workStationAvailability: {
          data: [],
        },
        availabilityResponse: {},
        bookingInfo: {
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
      },
      config: {
        configObj: {
          data: {
            booking: {
              buffer_period_mins: 15,
              create_work_schedule: true,
            },
          },
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: 'Raja' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange() {
          onChange([{ id: 34 }], { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getAllByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="group"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    const selectTags = getAllByTestId('select');
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    fireEvent.click(getByText('Book'));
    fireEvent.change(selectTags[0], {
      target: { value: 'Raju' },
    });
    fireEvent.change(selectTags[0], {
      target: { value: 'Raju' },
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout for group booking using remove value action', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },
        workStationAvailability: {
          data: [],
        },
        availabilityResponse: {},
        bookingInfo: {
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
      },
      config: {
        configObj: {
          data: {
            booking: {
              buffer_period_mins: 15,
              create_work_schedule: true,
            },
          },
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: 'Raja' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange() {
          onChange([{ id: 34 }], { action: 'remove-value', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getAllByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="group"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    const selectTags = getAllByTestId('select');
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    fireEvent.change(selectTags[1], {
      target: { value: 'Raju' },
    });
    fireEvent.click(getByText('Book'));
    fireEvent.change(selectTags[0], {
      target: { value: 'Raju' },
    });
    fireEvent.change(selectTags[0], {
      target: { value: 'Raju' },
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout for close in group booking', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations: { data: workStations },
        spacesForFloor: { data: spacesForFloor },
        workStationAvailability: {
          data: [],
        },
      },
    }));
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const workstation = {
          asset_categ_type: 'room',
          availability_status: true,
          bookings: [],
          child_count: 0,
          employee: { id: 6235, name: '' },
          id: 9483,
          is_parent: false,
          site: {
            planned_in: '2020-10-20 01:45:00',
            planned_out: '2020-10-20 10:15:00',
            id: 29,
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
          status: 'Partial',
          space_status: 'Partial',
          is_booking_allowed: true,
        };
        function handleChange(values) {
          onChange([values], { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, data }) => (
                <option key={value} value={data}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container, getByTestId, getByText,
    } = render(
      <FloorViewLayout
        treeBookingType="group"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raju' },
    });
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByTestId('space0'));
    fireEvent.click(getByText('Close'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon to click book button', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        space_status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId, getByText,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        employeesForWorkStation={employees}
        workSpaceInfo={workStations[0]}
        floorData={[]}
        setFloorViewData={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    expect(getByText('Please add people for whom you want to book a space:')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByText('Book'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId, getByText,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        employeesForWorkStation={employees}
        workSpaceInfo={workstaion1[0]}
        floorData={[]}
        setFloorViewData={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    expect(getByText('Please add people for whom you want to book a space:')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByText('Book'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon for individual booking', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId, getByText,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        treeBookingType="individual"
        employeesForWorkStation={employees}
        workSpaceInfo={workstaion1[0]}
        floorData={[]}
        setFloorViewData={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    expect(getByText('Please add people for whom you want to book a space:')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    fireEvent.change(getByTestId('select'), {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByText('Book'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon for  individual booking having cx, cy', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        treeBookingType="individual"
        employeesForWorkStation={employees}
        workSpaceInfo={workstaion1[0]}
        floorData={workstaion1}
        setFloorViewData={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon for group booking', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId, getByText,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        treeBookingType="group"
        employeesForWorkStation={employees}
        workSpaceInfo={workstaion1[0]}
        floorData={workstaion1}
        setFloorViewData={jest.fn()}
        setFloorObject={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    const select = getByTestId('select');
    fireEvent.change(select, {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByText('Book'));
    fireEvent.click(getByTestId('space0'));
    fireEvent.change(select, {
      target: { value: 'Raju' },
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon for select options in group booking', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    const {
      container, getByTestId, getByText,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        treeBookingType="group"
        employeesForWorkStation={[]}
        workSpaceInfo={workstaion1[0]}
        floorData={[]}
        setFloorViewData={jest.fn()}
        setFloorObject={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    const select = getByTestId('select');
    fireEvent.change(select, {
      target: { value: 'Raja' },
    });
    fireEvent.click(getByText('Book'));
    fireEvent.click(getByTestId('space0'));
    fireEvent.change(select, {
      target: { value: 'Raju' },
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon without floorData', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        treeBookingType="group"
        employeesForWorkStation={[]}
        workSpaceInfo={workstation2[0]}
        floorData={[]}
        setFloorViewData={jest.fn()}
        setFloorObject={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for availableicon without employeesForWorkStation', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
    }));
    Select.mockImplementation(({ options, value, onChange }) => {
      function handleChange(event, workstation) {
        onChange(event, workstation);
      }
      const workstation = {
        asset_categ_type: 'room',
        availability_status: true,
        bookings: [],
        child_count: 0,
        employee: { id: 6235, name: '' },
        id: 9483,
        is_parent: false,
        site: {
          planned_in: '2020-10-20 01:45:00',
          planned_out: '2020-10-20 10:15:00',
          id: 29,
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
        status: 'Partial',
        is_booking_allowed: true,
      };
      return (
        <select data-testid="select" value={value} onChange={(values) => handleChange(values, workstation)}>
          {options.map(({ name, data }) => (
            <option key={value} value={data}>
              {name}
            </option>
          ))}
        </select>
      );
    });
    const {
      container, getByTestId,
    } = render(
      <AvailableIcon
        cx="23"
        cy="24"
        spaceIndex="space0"
        treeBookingType="group"
        employeesForWorkStation={[]}
        workSpaceInfo={workstation3[0]}
        floorData={[]}
        setFloorViewData={jest.fn()}
        setFloorObject={jest.fn()}
        setSelectedEmployeeToWorkStation={jest.fn()}
        BookingData={bookingData}
      />,
    );
    fireEvent.click(getByTestId('space0'));
    expect(container).toBeInTheDocument();
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

  it('it should handle GET_WORK_STATIONS_DATA', () => {
    expect(reducer(initialState, { type: actions.GET_WORK_STATIONS_DATA })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: { loading: true, data: null, err: null },
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
      workStations: { loading: false, data: workStations, err: null },
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
      workStations: { loading: false, data: null, err: 'error' },
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

  it('it should handle GET_ALL_EMPLOYEE_LIST', () => {
    expect(reducer(initialState, { type: actions.GET_ALL_EMPLOYEE_LIST })).toEqual({
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
    });
  });

  it('it should handle GET_ALL_EMPLOYEE_LIST_SUCCESS', () => {
    expect(reducer(initialState, { type: actions.GET_ALL_EMPLOYEE_LIST_SUCCESS, payload: { data: employees } })).toEqual({
      importantContacts: [],
      bookingInfo: {},
      deleteInfo: {},
      workStations: null,
      workStationsLoading: true,
      workStationError: null,
      bookingList: {},
      shiftsInfo: {},
      newBooking: {},
      employees,
      floorView: {},
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  it('it should handle GET_ALL_EMPLOYEE_LIST_FAILURE', () => {
    expect(reducer(initialState, { type: actions.GET_ALL_EMPLOYEE_LIST_FAILURE })).toEqual({
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
    expect(reducer(initialState, { type: actions.GET_FLOOR_VIEW_SUCCESS, payload: floorView })).toEqual({
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
      floorView: { data: floorView.data, loading: false, err: {} },
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
      floorView: { loading: false, err: 'error', data: [] },
      categories: {},
      workStationAvailability: {},
      workSpaceId: null,
      availabilityResponse: {},
    });
  });

  // test for actions

  it('it should mock the getWorkStationsList function', () => {
    const getWorkStationsList = () => actions.getWorkStationsList(9433, '2020-12-22 17:45:00', '2020-12-23 00:30:00');
    getWorkStationsList();
    expect(actions.getWorkStationsList(9433, '2020-12-22 17:45:00', '2020-12-23 00:30:00')).toBeDefined();
  });

  it('it should mock the getFloorViewInfo function', () => {
    const getFloorViewInfo = () => actions.getFloorViewInfo('test', 63);
    getFloorViewInfo();
    expect(actions.getFloorViewInfo('test', 63)).toBeDefined();
  });

  it('it should mock the getEmployeeList function', () => {
    const getEmployeeList = () => actions.getEmployeeList(63);
    getEmployeeList();
    expect(actions.getEmployeeList(63)).toBeDefined();
  });

  it('it should mock the checkAvailabilityOfWorkStation function', () => {
    const checkAvailabilityOfWorkStation = () => actions.checkAvailabilityOfWorkStation(workStations);
    checkAvailabilityOfWorkStation();
    expect(actions.checkAvailabilityOfWorkStation(workStations)).toBeDefined();
  });

  it('it should mock the setSpaceId function', () => {
    const setSpaceId = () => actions.setSpaceId();
    setSpaceId();
    expect(actions.setSpaceId).toBeDefined();
  });

  // test for services

  it('it should handle checkAvailabilityForWorkStation function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'checkAvailabilityOfWorkStation');
    const result = floorViewServices.checkAvailabilityForWorkStation(workStations);
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getAllEmployees function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getEmployeeList');
    const result = getAllEmployees();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getWorkStationsData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getWorkStationsList');
    const result = services.getWorkStationsData(9433, '2020-12-22 17:45:00', '2020-12-23 00:30:00');
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle getFloorView function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getFloorViewInfo');
    const result = services.getFloorView('test', 63);
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('dom testing for FloorViewLayout without userinfo', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo: false,
      },
      bookingInfo: {
        floorView,
        employees,
        workStations,
        workStationAvailability: {
          data: workStations,
        },
        bookingInfo: {
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
        availabilityResponse: workStations,
      },
    }));

    const {
      container,
    } = render(
      <FloorViewLayout
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
        loading={false}
      />,
    );
    expect(container).toBeInTheDocument();
  });

  it('dom testing for FloorViewLayout without employees ', async () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      bookingInfo: {
        floorView,
        employees: false,
        workStations: { data: workStations },
        workStationAvailability: {
          data: workStations,
        },
        bookingInfo: {
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
        availabilityResponse: workStations,
      },
    }));

    const {
      container,
    } = render(
      <FloorViewLayout
        treeBookingType="individual"
        floorId={9104}
        workSpaceSelect={jest.fn()}
        BookingData={bookingData}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
