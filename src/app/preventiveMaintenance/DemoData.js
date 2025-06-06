const DemoData = {
  resources: [
    {
      id: 'r0',
      name: 'Daily Frontdesk',
    },
    {
      id: 'r1',
      name: 'Daily HVAC Checklist',
    },
    {
      id: 'r2',
      name: 'Daily Lighting Checklist',
    },
    {
      id: 'r3',
      name: 'Daily Washroom Checklist',
    },
  ],
  events: [
    {
      id: 1,
      start: '2021-02-10 19:30:00',
      end: '2021-02-10 23:30:00',
      resourceId: 'r1',
      title: '5 WO',
      bgColor: '#00be4b',
      showPopover: true,
      status: '1',
    },
    {
      id: 2,
      start: '2021-02-11 12:30:00',
      end: '2021-02-11 23:30:00',
      resourceId: 'r2',
      title: '5 WO',
      bgColor: '#ffa000',
      showPopover: true,
      status: '2',
    },
    {
      id: 3,
      start: '2021-02-13 12:30:00',
      end: '2021-02-13 23:30:00',
      resourceId: 'r3',
      title: '5 WO',
      bgColor: '#2691ec',
      showPopover: true,
      status: '3',
    },
    {
      id: 4,
      start: '2021-02-15 14:30:00',
      end: '2021-02-15 23:30:00',
      resourceId: 'r4',
      title: '4 WO',
      bgColor: '#ffa000',
      showPopover: true,
      status: '2',
    },
    {
      id: 5,
      start: '2021-02-09 15:30:00',
      end: '2021-02-11 23:30:00',
      resourceId: 'r5',
      title: '5 WO',
      bgColor: '#2691ec',
      showPopover: true,
      status: '3',
    },
    {
      id: 6,
      start: '2021-02-12 15:35:00',
      end: '2021-02-12 23:30:00',
      resourceId: 'r6',
      title: '5 WO',
      bgColor: '#00be4b',
      showPopover: true,
      status: '1',
    },
  ],
  eventsForCustomEventStyle: [
    {
      id: 1,
      start: '2021-01-28 09:30:00',
      end: '2021-12-19 23:30:00',
      resourceId: 'r1',
      title: 'I am finished',
      bgColor: '#D9D9D9',
      type: 1,
    },
    {
      id: 2,
      start: '2021-01-2812:30:00',
      end: '2021-01-29 23:30:00',
      resourceId: 'r2',
      title: 'I am not resizable',
      resizable: false,
      type: 2,
    },
    {
      id: 3,
      start: '2021-12-19 12:30:00',
      end: '2021-12-20 23:30:00',
      resourceId: 'r3',
      title: 'I am not movable',
      movable: false,
      type: 3,
    },
    {
      id: 4,
      start: '2021-12-19 14:30:00',
      end: '2021-12-20 23:30:00',
      resourceId: 'r4',
      title: 'I am not start-resizable',
      startResizable: false,
      type: 1,
    },
    {
      id: 5,
      start: '2021-12-19 15:30:00',
      end: '2021-12-20 23:30:00',
      resourceId: 'r5',
      title: 'I am not end-resizable',
      endResizable: false,
      type: 2,
    },
    {
      id: 6,
      start: '2021-12-19 15:35:00',
      end: '2021-12-19 23:30:00',
      resourceId: 'r6',
      title: 'I am normal',
      type: 3,
    },
    {
      id: 7,
      start: '2021-12-19 15:40:00',
      end: '2021-12-20 23:30:00',
      resourceId: 'r7',
      title: 'I am exceptional',
      bgColor: '#FA9E95',
      type: 1,
    },
    {
      id: 8,
      start: '2021-12-19 15:50:00',
      end: '2021-12-19 23:30:00',
      resourceId: 'r1',
      title: 'I am locked',
      movable: false,
      resizable: false,
      bgColor: 'red',
      type: 2,
    },
    {
      id: 9,
      start: '2021-12-19 16:30:00',
      end: '2021-12-27 23:30:00',
      resourceId: 'r1',
      title: 'R1 has many tasks 1',
      type: 3,
    },
    {
      id: 10,
      start: '2021-12-20 18:30:00',
      end: '2021-12-20 23:30:00',
      resourceId: 'r1',
      title: 'R1 has many tasks 2',
      type: 1,
    },
    {
      id: 11,
      start: '2021-12-21 18:30:00',
      end: '2021-12-22 23:30:00',
      resourceId: 'r1',
      title: 'R1 has many tasks 3',
      type: 2,
    },
    {
      id: 12,
      start: '2021-12-23 18:30:00',
      end: '2021-12-27 23:30:00',
      resourceId: 'r1',
      title: 'R1 has many tasks 4',
      type: 3,
    },
  ],
};

export default DemoData;
