import React from 'react';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, cleanup } from '@testing-library/react';
import UserActions from '../userActions';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

jest.mock('../../data/userActions.json', () => ({
  data: [{
    id: 1,
    name: 'My Bookings',
    image: 'src/app/images/myBookingsBlue.ico',
    route: '/bookings',
  },
  {
    id: 2,
    name: 'Raise A Ticket',
    image: 'src/app/images/covidIncidentBlue.ico',
    route: '/raise-a-ticket',
  },
  {
    id: 3,
    name: 'My Guests',
    image: 'src/app/images/myguests.ico',
    route: '/myguests',
  }],
}));

const userInfo = {
  allowed_companies: [
    {
      country: {
        id: 104,
        name: 'India',
      },
      id: 3,
      locality: 'Bengaluru',
      name: 'Divyasree Technopark..',
      postal_code: '560037',
      region: {
        id: 593,
        name: 'Karnataka (IN)',
      },
      street_address: 'DTP Entry Gate, EPIP Zone',
    },
  ],
  company: {
    address: 'Divyasree Technopark..\nDTP Entry Gate, EPIP Zone\nBrookefield\nBengaluru 560037\nKarnataka KA\nIndia',
    id: 3,
    name: 'Divyasree Technopark..',
    timezone: 'Asia/Kolkata',
  },
  id: 9,
  image_url: 'https://demo.helixsense.com/web/image/message.queue.mqtt/1/avatar_image/1.jpeg',
  name: 'Technopark',
  email: {
    email: 'example@gmail.com',
  },
};

afterEach(cleanup);

describe('useractions testing', () => {
  // snapshot testing

  it('snapshot testing', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {},
        },
      },
    }));
    const { asFragment } = render(<UserActions />);
    expect(asFragment()).toMatchSnapshot();
  });

  // dom testing

  it('dom testing', () => {
    useSelector.mockImplementation((fn) => fn({
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {},
        },
      },
    }));
    const { container, getByText } = render(<UserActions />);
    expect(getByText('My Actions')).toBeInTheDocument();
    expect(getByText('My Bookings')).toBeInTheDocument();
    fireEvent.click(getByText('My Bookings'));
    fireEvent.click(getByText('My Guests'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/myguests');
    expect(container).toBeInTheDocument();
  });
});
