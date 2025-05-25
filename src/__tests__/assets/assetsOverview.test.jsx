import React from 'react';
import { render, screen } from '../../app/util/test.utils';
import '@testing-library/jest-dom/extend-expect';
import AssetOverview from '../../app/assets/assetOverview/assetOverview';
import AssetDetails from '../../app/assets/assetDetails/assetsDetail';
import Summary from '../../app/assets/assetDetails/summary';
import LocationDetail from '../../app/assets/locationDetails/locationDetail';

describe('Assets', () => {
  it('Renders <Insights /> component correctly', () => {
    render(<AssetOverview />);
    expect(screen.getByText('Asset Registry')).toBeInTheDocument();
  });

  it('Component renders link to /assets/add-asset', () => {
    render(<AssetOverview />);
    expect(document.querySelector('.action a#assetactions0').getAttribute('href')).toBe(
      '/assets/add-asset',
    );
  });

  it('Component renders link to /assets/equipments', () => {
    render(<AssetOverview />);
    expect(document.querySelector('.action a#assetactions2').getAttribute('href')).toBe(
      '/assets/equipments',
    );
  });

  it('Renders <AssetDetails /> component correctly', () => {
    render(<AssetDetails id={1} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('Renders <Summary /> component correctly', () => {
    render(<Summary />);
    expect(screen.getByText('Manufacturer')).toBeInTheDocument();
  });

  it('Renders <LocationDetail /> component correctly', () => {
    render(<LocationDetail />);
    expect(screen.getByText('Assets')).toBeInTheDocument();
  });
});
