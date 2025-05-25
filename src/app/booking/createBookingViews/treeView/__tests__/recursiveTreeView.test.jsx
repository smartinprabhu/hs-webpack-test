/* eslint-disable import/no-named-as-default */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Select from 'react-select';
// import * as redux from 'react-redux';
import { useSelector } from 'react-redux';
import { act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';

import RecursiveTreeViewLayout from '../recursiveTreeViewLayout';
import SelectedSpaceView from '../selectedSpaceView';
import { buildTreeViewData } from '../buildTreeViewData';
import reducer from '../../../reducer';
// import store from '../../../../../store';

const mockedStore = {
  user: {
    userInfo: {
      id: 13,
      image_url: '',
      locale: 'en_US',
      main_company: { id: 3, name: 'Water Mark Building' },
      mobile: '',
      name: 'Andrew',
      partner_id: 18,
      phone_number: '',
      timezone: 'US/Central',
      user_role: 'tenant_employee',
      username: 'andrew.wmb@ml.in',
      vendor: { id: 11, name: 'Motivity Labs(Tenant)' },
      website: '',
      address: {
        country: {}, formatted: '↵↵ ↵', locality: '', postal_code: '', region: {}, street_address: '',
      },
      allowed_companies: [{
        country: { id: 233, name: 'United States' },
        id: 3,
        locality: 'Irving',
        name: 'Water Mark  Building',
        postal_code: '75039',
        region: { id: 52, name: 'Texas (US)' },
        street_address: '222 W. Las Colinas Blvd.',
      }],
      company: {
        address: 'Water Mark  Building↵222 W. Las Colinas Blvd.↵Suite 755 East↵Irving TX 75039↵United States',
        id: 3,
        name: 'Water Mark  Building',
        timezone: 'US/Central',
      },
      email: { email: 'andrew.wmb@ml.in', readonly: true },
      employee: [
        {
          id: 6, is_onboarded: false, name: 'Andrew', registration_status: 'approved',
        },
      ],
    },
  },
  bookingInfo: {
    employees: [
      {
        active: true, barcode: '', company: { id: 63, name: 'Water Mark Building' }, department: {}, employee_ref: false, gender: 'male', id: 6479, job: {}, name: 'AbhishekKumar', parent: {}, vendor: { id: 1450, name: 'Motivity Labs(Tenant)' }, vendor_ref: '', work_email: 'aadevi44@gmail.com', work_phone: '9040504138',
      },
      {
        active: true, barcode: '90876', company: { id: 63, name: 'Water Mark Building' }, department: { id: 106, name: 'Sales' }, employee_ref: '90876', gender: 'female', id: 6379, job: { id: 15, name: 'Manager' }, name: 'Adalia', parent: {}, vendor: { id: 1450, name: 'Motivity Labs(Tenant)' }, vendor_ref: '', work_email: 'adalia@gmail.com', work_phone: '123456789',
      },
      {
        active: true, barcode: '87678', company: { id: 63, name: 'Water Mark Building' }, department: { id: 106, name: 'Sales' }, employee_ref: '87678', gender: 'male', id: 6381, job: { id: 15, name: 'Manager' }, name: 'Frank Outlook User', parent: {}, vendor: { id: 1450, name: 'Motivity Labs(Tenant)' }, vendor_ref: '', work_email: 'frank@example.com', work_phone: '123456789',
      },
    ],
  },
};

const data = [
  {
    asset_categ_type: 'floor',
    availability_status: true,
    bookings: [],
    child_count: 11,
    employee: {},
    id: 9104,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9102,
      name: 'WBL',
    },
    path_name: 'WMB/WBL/F#10',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Floor #10',
    space_number: 'WMB-A-00003',
    space_sub_type: {
      id: 2,
      name: 'Breakout Area',
    },
    space_type: {
      id: 2,
      name: 'Floor',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9111,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '271',
    longitude: '175',
    max_occupancy: 0,
    parent: {
      id: 9543,
      name: 'Row#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1/WS#2',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #2',
    space_number: 'WMB-A-00010',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9112,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '383',
    longitude: '170',
    max_occupancy: 0,
    parent: {
      id: 9543,
      name: 'Row#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1/WS#3',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #3',
    space_number: 'WMB-A-00011',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9113,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9543,
      name: 'Row#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1/WS#4',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #4',
    space_number: 'WMB-A-00012',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9114,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '294',
    longitude: '389',
    max_occupancy: 0,
    parent: {
      id: 9543,
      name: 'Row#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1/WS#5',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #5',
    space_number: 'WMB-A-00013',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9115,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '281.25',
    longitude: '352.5',
    max_occupancy: 0,
    parent: {
      id: 9543,
      name: 'Row#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1/WS#6',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #6',
    space_number: 'WMB-A-00014',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9116,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '236',
    longitude: '438',
    max_occupancy: 0,
    parent: {
      id: 9543,
      name: 'Row#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1/WS#7',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #7',
    space_number: 'WMB-A-00015',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9117,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '270',
    longitude: '240',
    max_occupancy: 0,
    parent: {
      id: 9544,
      name: 'Row#2',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2/WS#8',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #8',
    space_number: 'WMB-A-00016',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9118,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '370',
    longitude: '405',
    max_occupancy: 0,
    parent: {
      id: 9544,
      name: 'Row#2',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2/WS#9',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #9',
    space_number: 'WMB-A-00017',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9259,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '348',
    longitude: '228',
    max_occupancy: 0,
    parent: {
      id: 9544,
      name: 'Row#2',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2/WS#10',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #10',
    space_number: 'WMB-A-00018',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9398,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '405.6022397580632',
    longitude: '120.28993532248856',
    max_occupancy: 0,
    parent: {
      id: 9544,
      name: 'Row#2',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2/WS#11',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #11',
    space_number: 'WMB-A-00019',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9399,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '188',
    longitude: '532',
    max_occupancy: 0,
    parent: {
      id: 9544,
      name: 'Row#2',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2/WS#12',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #12',
    space_number: 'WMB-A-00020',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9400,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '391.5',
    longitude: '348.75',
    max_occupancy: 0,
    parent: {
      id: 9544,
      name: 'Row#2',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2/WS#13',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #13',
    space_number: 'WMB-A-00021',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9401,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '163',
    longitude: '572',
    max_occupancy: 0,
    parent: {
      id: 9545,
      name: 'Row#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#14',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #14',
    space_number: 'WMB-A-00022',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9402,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '473.7730147621644',
    longitude: '175.66119572088613',
    max_occupancy: 0,
    parent: {
      id: 9545,
      name: 'Row#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#15',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #15',
    space_number: 'WMB-A-00023',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [
      {
        actual_in: false,
        actual_out: false,
        employee_id: 6385,
        employee_name: 'elavarasan',
        id: 92245,
        planned_in: '2020-12-28 10:27:00',
        planned_out: '2020-12-28 11:27:00',
        shift_id: 47,
        shift_name: 'A',
      },
    ],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9403,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '349.3196996448647',
    longitude: '320.86298586648655',
    max_occupancy: 0,
    parent: {
      id: 9545,
      name: 'Row#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#16',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #16',
    space_number: 'WMB-A-00024',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Partial',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9404,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '212.80243165432938',
    longitude: '383.748959748823',
    max_occupancy: 0,
    parent: {
      id: 9545,
      name: 'Row#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3/WS#17',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #17',
    space_number: 'WMB-A-00025',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9406,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '253',
    longitude: '485',
    max_occupancy: 0,
    parent: {
      id: 9546,
      name: 'Row#4',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#4/WS#19',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #19',
    space_number: 'WMB-A-00027',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9407,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '167.30541829848335',
    longitude: '275.5991367039098',
    max_occupancy: 0,
    parent: {
      id: 9546,
      name: 'Row#4',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#4/WS#20',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #20',
    space_number: 'WMB-A-00028',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9408,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '273.89962798244034',
    longitude: '273.7444624405457',
    max_occupancy: 0,
    parent: {
      id: 9546,
      name: 'Row#4',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#4/WS#21',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #21',
    space_number: 'WMB-A-00029',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9409,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '321.4611358321468',
    longitude: '122.39808094315836',
    max_occupancy: 0,
    parent: {
      id: 9546,
      name: 'Row#4',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#4/WS#22',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #22',
    space_number: 'WMB-A-00030',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9410,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '216.42857956265527',
    longitude: '164.1871982889109',
    max_occupancy: 0,
    parent: {
      id: 9547,
      name: 'Row#5',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5/WS#23',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #23',
    space_number: 'WMB-A-00031',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9411,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '318',
    longitude: '249.75',
    max_occupancy: 0,
    parent: {
      id: 9547,
      name: 'Row#5',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5/WS#24',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #24',
    space_number: 'WMB-A-00032',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9412,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '476.2548129580024',
    longitude: '283.8906686513527',
    max_occupancy: 0,
    parent: {
      id: 9547,
      name: 'Row#5',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5/WS#25',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #25',
    space_number: 'WMB-A-00033',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9413,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '216.20996274320407',
    longitude: '387.46537877742514',
    max_occupancy: 0,
    parent: {
      id: 9547,
      name: 'Row#5',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5/WS#26',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #26',
    space_number: 'WMB-A-00034',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9414,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '448.41805015449404',
    longitude: '235.86228188258457',
    max_occupancy: 0,
    parent: {
      id: 9547,
      name: 'Row#5',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5/WS#27',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #27',
    space_number: 'WMB-A-00035',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9415,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '303',
    longitude: '442',
    max_occupancy: 0,
    parent: {
      id: 9547,
      name: 'Row#5',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5/WS#28',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #28',
    space_number: 'WMB-A-00036',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9416,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '188.3860851470793',
    longitude: '188.1972494218423',
    max_occupancy: 0,
    parent: {
      id: 9548,
      name: 'Row#6',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#6/WS#29',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #29',
    space_number: 'WMB-A-00037',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Maintenance in Progress',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9417,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '389.82090367812896',
    longitude: '314.1832108582301',
    max_occupancy: 0,
    parent: {
      id: 9548,
      name: 'Row#6',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#6/WS#30',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #30',
    space_number: 'WMB-A-00038',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9418,
    is_booking_allowed: false,
    is_parent: false,
    latitude: '112.31711819154029',
    longitude: '105',
    max_occupancy: 0,
    parent: {
      id: 9548,
      name: 'Row#6',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#6/WS#31',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #31',
    space_number: 'WMB-A-00039',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 10,
      name: 'Room',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9419,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '482.44139805762694',
    longitude: '382.914605699531',
    max_occupancy: 0,
    parent: {
      id: 9548,
      name: 'Row#6',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#6/WS#32',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #32',
    space_number: 'WMB-A-00040',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {
      id: '',
      name: '',
    },
    id: 9420,
    is_booking_allowed: true,
    is_parent: false,
    latitude: '349.83165108824755',
    longitude: '516.9474239140366',
    max_occupancy: 0,
    parent: {
      id: 9548,
      name: 'Row#6',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#6/WS#33',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station #33',
    space_number: 'WMB-A-00041',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'room',
    availability_status: true,
    bookings: [],
    child_count: 11,
    employee: {},
    id: 9538,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '274',
    longitude: '512',
    max_occupancy: 0,
    parent: {
      id: 9104,
      name: 'F#10',
    },
    path_name: 'WMB/WBL/F#10/WS',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Work Station',
    space_number: 'WMB-A-00158',
    space_sub_type: {
      id: 50,
      name: 'Workstation Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 11,
    employee: {},
    id: 9540,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9538,
      name: 'WS',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Zone #1',
    space_number: 'WMB-A-00159',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9542,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9538,
      name: 'WS',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#3',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Zone #3',
    space_number: 'WMB-A-00161',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9543,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#1',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #1',
    space_number: 'WMB-A-00162',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9544,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#2',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #2',
    space_number: 'WMB-A-00163',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 3,
    employee: {},
    id: 9545,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#3',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #3',
    space_number: 'WMB-A-00164',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 2,
    employee: {},
    id: 9546,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#4',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #4',
    space_number: 'WMB-A-00165',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 3,
    employee: {},
    id: 9547,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#5',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #5',
    space_number: 'WMB-A-00166',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 3,
    employee: {},
    id: 9548,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#6',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #6',
    space_number: 'WMB-A-00167',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9549,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#7',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #7',
    space_number: 'WMB-A-00168',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: false,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9550,
    is_booking_allowed: false,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9540,
      name: 'Z#1',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#1/Row#8',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #8',
    space_number: 'WMB-A-00169',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Blocked',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9562,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9542,
      name: 'Z#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#3/Row#1',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #1',
    space_number: 'WMB-A-00181',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9563,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9542,
      name: 'Z#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#3/Row#2',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #2',
    space_number: 'WMB-A-00182',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9564,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9542,
      name: 'Z#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#3/Row#3',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #3',
    space_number: 'WMB-A-00183',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
  {
    asset_categ_type: 'space',
    availability_status: true,
    bookings: [],
    child_count: 0,
    employee: {},
    id: 9565,
    is_booking_allowed: true,
    is_parent: true,
    latitude: '',
    longitude: '',
    max_occupancy: 0,
    parent: {
      id: 9542,
      name: 'Z#3',
    },
    path_name: 'WMB/WBL/F#10/WS/Z#3/Row#4',
    position: {
      xpos: '',
      ypos: '',
    },
    space_name: 'Row #4',
    space_number: 'WMB-A-00184',
    space_sub_type: {
      id: 38,
      name: 'Office Area',
    },
    space_type: {
      id: 9,
      name: 'Area',
    },
    status: 'Ready',
  },
];

const BookingData = {
  date: 'Mon Dec 21 2020 05: 25: 04 GMT',
  site: {
    duration: 8,
    id: 4,
    name: 'C',
    planned_in: '2020-12-22 04:00:00',
    planned_out: '2020-12-22 12:00:00',
    start_time: 22,
  },
  workStationType: {
    file_path: '/web/image/mro.asset.category/17/image_medium/17.png',
    id: 17,
    name: 'Work Station',
    sequence: 1,
    type: 'building',
  },
};

jest.mock('@fullcalendar/react', () => () => <div />);
jest.mock('@fullcalendar/daygrid', () => jest.fn());
jest.mock('@fullcalendar/interaction', () => jest.fn());
jest.mock('@fullcalendar/timegrid', () => jest.fn());
jest.mock('powerbi-report-component', () => jest.fn());

const setTreeDataToSelectedSpaceView = jest.fn();
const removeNodeWithEmp = undefined;

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

jest.mock('react-select', () => jest.fn());
// function renderWithRedux(component) {
//   const { Provider } = redux;
//   return {
//     ...render(<Provider store={store}>{component}</Provider>),
//   };
// }

describe('recursive tree snapshots', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(mockedStore));
  });
  afterEach(() => {
    useSelector.mockClear();
  });

  it('recursive tree renders for individual booking', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));
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
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const { asFragment } = render(<RecursiveTreeViewLayout data={buildTreeViewData(data)} BookingData={BookingData} setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView} treeBookingType="individual" removeNodeWithEmp={removeNodeWithEmp} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('recursive tree renders for group booking', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));
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
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const { asFragment } = render(<RecursiveTreeViewLayout data={buildTreeViewData(data)} BookingData={BookingData} setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView} treeBookingType="group" removeNodeWithEmp={removeNodeWithEmp} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should fire expand button', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));
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
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const { container } = render(<RecursiveTreeViewLayout data={buildTreeViewData(data)} BookingData={BookingData} setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView} treeBookingType="group" removeNodeWithEmp={removeNodeWithEmp} />);

    const expandButton = screen.getByTestId('expandAllTest');
    act(() => {
      fireEvent.click(expandButton);
      const collpaseButton = screen.getByTestId('collapseAllTest');
      fireEvent.click(collpaseButton);
    });
    // expect(expandAll).toHaveBeenCalled();
    expect(container).toBeInTheDocument();
  });

  const treeData = {
    is_parent: true,
    key: 53,
    name: 'Floor #10',
    treeNodeId: 'root',
    children: [
      {
        children: [],
        id: 158,
        is_booking_allowed: true,
        is_parent: false,
        name: 'Recreation Room1',
        path_name: 'WMB/WBL/F#10/RR',
        space_name: 'Recreation Room',
        space_number: 'WMB-A-00060',
        status: 'Ready to occupy',
        treeNodeId: '158',
      },
      {
        children: [],
        id: 159,
        is_booking_allowed: true,
        is_parent: false,
        name: 'Recreation Room2',
        path_name: 'WMB/WBL/F#10/RR',
        space_name: 'Recreation Room',
        space_number: 'WMB-A-00060',
        status: 'Ready to occupy',
        treeNodeId: '159',
      },
      {
        id: 76,
        is_booking_allowed: true,
        is_parent: true,
        name: 'Global Outlook Team',
        path_name: 'WMB/WBL/F#10/GOT',
        space_name: 'Global Outlook Team',
        space_number: 'WMB-A-00005',
        status: 'Ready to occupy',
        treeNodeId: '76',
        children: [
          {
            children: [],
            id: 131,
            is_booking_allowed: true,
            is_parent: true,
            name: 'Row #2',
            path_name: 'WMB/WBL/F#10/GOT/Row #2',
            space_name: 'Row #2',
            space_number: 'WMB-A-00041',
            status: 'Ready to occupy',
            treeNodeId: '131',
          },
          {
            children: [],
            id: 130,
            is_booking_allowed: true,
            is_parent: true,
            name: 'Row #1',
            path_name: 'WMB/WBL/F#10/GOT/Row #1',
            space_name: 'Row #1',
            space_number: 'WMB-A-00040',
            status: 'Ready to occupy',
            treeNodeId: '130',
          },
        ],
      },
    ],
  };
  it('should check recursive tree view with new data', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));
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
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const { asFragment } = render(<RecursiveTreeViewLayout data={buildTreeViewData(data)} BookingData={BookingData} setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView} treeBookingType="group" removeNodeWithEmp={removeNodeWithEmp} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should check the checkbox', () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockedStore));
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
          onChange(values, { action: 'test', removedValue: workstation });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const { container } = render(<RecursiveTreeViewLayout data={treeData} BookingData={BookingData} setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView} treeBookingType="group" removeNodeWithEmp={removeNodeWithEmp} />);

    const checkBox = screen.getByTestId('checkboxTest-158');
    const checkBox1 = screen.getByTestId('checkboxTest-159');
    act(() => {
      fireEvent.click(checkBox);
      fireEvent.click(checkBox1);
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for group RecursiveTreeViewLayout', async () => {
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const employee = [
          {
            active: true,
            barcode: '90876',
            company: { id: 63, name: 'Water Mark Building' },
            department: { id: 106, name: 'Sales' },
            employee_ref: '90876',
            gender: 'female',
            id: 6379,
            job: { id: 15, name: 'Manager' },
            label: 'Adalia',
            name: 'Adalia',
            parent: {},
            value: 'Adalia',
            vendor: { id: 1450, name: 'Motivity Labs(Tenant)' },
            vendor_ref: '',
            work_email: 'adalia@gmail.com',
            work_phone: '123456789',
          },
        ];
        function handleChange(values) {
          onChange(values, { action: 'select-option', name: 'employee', option: employee });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  <span data-testid="testName">{name}</span>
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
      <RecursiveTreeViewLayout
        data={buildTreeViewData(data)}
        BookingData={BookingData}
        setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView}
        treeBookingType="group"
        removeNodeWithEmp={removeNodeWithEmp}
      />,
    );

    const expandButton = screen.getByTestId('expandAllTest');
    act(() => {
      fireEvent.change(screen.getByTestId('select'), {
        target: { value: 'Adalia' },
      });
      fireEvent.click(expandButton);
      // const zone1 = screen.getByText('Zone #1');
      // fireEvent.click(zone1);
      // const row3 = screen.getByText('Row #3');
      // fireEvent.click(row3);
      const ws14 = screen.getByTestId('checkboxTest-9401');
      fireEvent.change(getByTestId('checkboxTest-9401'), { target: { checked: true } });
      fireEvent.click(ws14);
      const ws15 = screen.getByTestId('checkboxTest-9402');
      fireEvent.change(getByTestId('checkboxTest-9402'), { target: { checked: true } });
      fireEvent.click(ws15);

      // fireEvent.change(getByTestId('checkboxTest-9403'), { target: { checked: false } });
      // fireEvent.click(ws15);
      // const ws16 = screen.getByTestId('checkboxTest-9403')
      // fireEvent.change(getByTestId('checkboxTest-9403'), { target: { checked: true } });
      // fireEvent.click(ws16);
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for set employee on selected node', async () => {
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const employee = {
          id: 6235,
          is_onboarded: false,
          label: 'Raja',
          name: 'Raja',
          registration_status: 'draft',
          value: 'Raja',
        };
        const node = {
          children: [],
          id: 9562,
          is_booking_allowed: true,
          is_parent: true,
          name: 'Row #1',
          path_name: 'WMB/WBL/F#10/WS/Z#3/Row#1',
          space_name: 'Row #1',
          space_number: 'WMB-A-00181',
          status: 'Ready to occupy',
          treeNodeId: '9562',
        };
        function handleChange(values) {
          onChange(values, { action: 'select-option', selectedEmp: employee, node });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
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
      <RecursiveTreeViewLayout
        data={buildTreeViewData(data)}
        BookingData={BookingData}
        setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView}
        treeBookingType="group"
        removeNodeWithEmp={removeNodeWithEmp}
      />,
    );
    // const nodeWS = screen.getByText('Work Station');
    const expandButton = screen.getByTestId('expandAllTest');
    // const selectSpace = screen.getByText('employeeSelect');
    const selectId = screen.getAllByTestId('select');
    act(() => {
      fireEvent.change(selectId[0], {
        target: { value: 'Raja' },
      });

      fireEvent.change(selectId[0], {
        target: { value: 'Adalia' },
      });

      fireEvent.click(expandButton);
      // const zone1 = screen.getByText('Zone #1');
      // fireEvent.click(zone1);
      // const row3 = screen.getByText('Row #3');
      // fireEvent.click(row3);
      const ws14 = screen.getByTestId('checkboxTest-9401');
      fireEvent.change(getByTestId('checkboxTest-9401'), { target: { checked: true } });
      fireEvent.click(ws14);
      const newSelectId1 = screen.getAllByTestId('select');
      fireEvent.change(newSelectId1[1], {
        target: { value: 'Abhishek' },
      });
      const ws15 = screen.getByTestId('checkboxTest-9402');

      fireEvent.change(getByTestId('checkboxTest-9402'), { target: { checked: true } });
      fireEvent.click(ws15);
      const newSelectId = screen.getAllByTestId('select');

      fireEvent.change(newSelectId[1], {
        target: { value: 'Adalia' },
      });
    });
    expect(container).toBeInTheDocument();
  });

  it('should check remove-value action of select', async () => {
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        const employee = {
          id: 6235,
          is_onboarded: false,
          label: 'Raja',
          name: 'Raja',
          registration_status: 'draft',
          value: 'Raja',
        };
        function handleChange(values) {
          onChange(values, { action: 'remove-value', removedValue: employee });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container,
    } = render(
      <RecursiveTreeViewLayout
        data={buildTreeViewData(data)}
        BookingData={BookingData}
        setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView}
        treeBookingType="group"
        removeNodeWithEmp={removeNodeWithEmp}
      />,
    );
    const selectId = screen.getAllByTestId('select');
    act(() => {
      fireEvent.change(selectId[0], {
        target: { value: 'Adalia' },
      });

      // fireEvent.change(selectId[2], {
      //     target: { value: "Adalia" },
      // })
    });
    expect(container).toBeInTheDocument();
  });

  it('should check clear action of select', async () => {
    Select.mockImplementation(
      ({ options, value, onChange }) => {
        // const employee = {
        //   id: 6235,
        //   is_onboarded: false,
        //   label: 'Raja',
        //   name: 'Raja',
        //   registration_status: 'draft',
        //   value: 'Raja',
        // };
        function handleChange(values) {
          onChange(values, { action: 'clear', removedValue: undefined });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))
            }
          </select>
        );
      },
    );
    const {
      container,
    } = render(
      <RecursiveTreeViewLayout
        data={buildTreeViewData(data)}
        BookingData={BookingData}
        setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView}
        treeBookingType="group"
        removeNodeWithEmp={removeNodeWithEmp}
      />,
    );
    act(() => {
      fireEvent.change(screen.getByTestId('select'), {
        target: { value: 'Raja' },
      });
    });
    expect(container).toBeInTheDocument();
  });

  it('dom testing for individual RecursiveTreeViewLayout', async () => {
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

    Select.mockImplementation(
      ({ options, value, onChange }) => {
        function handleChange(values) {
          onChange(values, { action: 'test', removedValue: treeViewData });
        }
        return (
          <select data-testid="select" value={value} onChange={(values) => handleChange(values)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>
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
      <RecursiveTreeViewLayout
        data={buildTreeViewData(data)}
        BookingData={BookingData}
        setTreeDataToSelectedSpaceView={setTreeDataToSelectedSpaceView}
        treeBookingType="individual"
        removeNodeWithEmp={removeNodeWithEmp}
      />,
    );

    const expandButton = screen.getByTestId('expandAllTest');
    act(() => {
      fireEvent.click(expandButton);
      // const nodeWS = screen.getByText(/Work Station/);
      // fireEvent.click(nodeWS);
      // const zone1 = screen.getByText('Zone #1');
      // fireEvent.click(zone1);
      // const row3 = screen.getByText('Row #3');
      // fireEvent.click(row3);
      const ws14 = screen.getByTestId('checkboxTest-9401');
      fireEvent.change(getByTestId('checkboxTest-9401'), { target: { checked: true } });
      fireEvent.click(ws14);

      const { container1 } = render(<SelectedSpaceView
        treeViewData={treeViewData}
        removeNodeWithEmployee={jest.fn()}
        removeAll={false}
        colSize={false}
        updateWorkSpace={jest.fn()}
        workSpace={[]}
      />);

      // const displayText = screen.getByText('Remove');
      // fireEvent.click(displayText);
      fireEvent.change(getByTestId('checkboxTest-9401'), { target: { checked: false } });
      fireEvent.click(ws14);
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

  it('should handle GET_AVAILABILITY_OF_WORK_STATION', () => {
    expect(reducer(initialState, {
      type: 'GET_AVAILABILITY_OF_WORK_STATION',
    })).toEqual({
      ...initialState,
      workStationAvailability: {
        loading: true, err: undefined, data: undefined,
      },
    });
  });

  it('should handle GET_AVAILABILITY_OF_WORK_STATION_SUCCESS', () => {
    expect(reducer(initialState, {
      type: 'GET_AVAILABILITY_OF_WORK_STATION_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      workStationAvailability: {
        loading: false, err: undefined, data: '',
      },
      availabilityResponse: {
        null: '',
      },
    });
  });

  it('should handle GET_AVAILABILITY_OF_WORK_STATION_FAILURE', () => {
    expect(reducer(initialState, {
      type: 'GET_AVAILABILITY_OF_WORK_STATION_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      workStationAvailability: {
        loading: false, err: '', data: undefined,
      },
      availabilityResponse: {
        null: '',
      },
    });
  });

  it('should handle SET_SPACE_ID', () => {
    expect(reducer(initialState, {
      type: 'SET_SPACE_ID',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      workSpaceId: {
        data: '',
      },
    });
  });
});
