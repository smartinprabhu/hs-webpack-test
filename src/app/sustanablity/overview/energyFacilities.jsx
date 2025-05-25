import React from 'react';
import {
  Table,
} from 'reactstrap';
import Chip from '@mui/material/Chip';

import ChartCard from './chartCard';

const data = [
  {
    id: 1, name: 'Main HVAC Unit', age: '12 years', rating: 'Poor', replaceCost: '$125,000', savings: '$18,500/yr',
  },
  {
    id: 2, name: 'Lighting System (Floor 3)', age: '8 years', rating: 'Average', replaceCost: '$42,000', savings: '$7,200/yr',
  },
  {
    id: 3, name: 'Boiler System', age: '15 years', rating: 'Poor', replaceCost: '$85,000', savings: '$12,000/yr',
  },
  {
    id: 4, name: 'Elevator Motors', age: '9 years', rating: 'Average', replaceCost: '$65,000', savings: '$5,800/yr',
  },
  {
    id: 5, name: 'Water Heaters', age: '10 years', rating: 'Poor', replaceCost: '$28,000', savings: '$3,400/yr',
  },
];

const EnergyFacilities = () => (
  <ChartCard title="Energy-Efficient Replacement Opportunities" subtitle="Potential savings from replacing inefficient assets">
    <div className="overflow-x-auto thin-scrollbar" style={{ maxHeight: '400px', overflow: 'auto' }}>
      <Table className="mb-0 font-weight-400 border-0 assets-table" width="100%">
        <thead>
          <tr>
            <th className="p-2 min-width-160 table-column">
              <div className="font-weight-bold font-family-tab font-size-11">
                Asset Name
              </div>
            </th>
            <th className="p-2 min-width-160 table-column">
              <div className="font-weight-bold font-family-tab font-size-11">
                Age
              </div>
            </th>
            <th className="p-2 min-width-160 table-column">
              <div className="font-weight-bold font-family-tab font-size-11">
                Energy Rating
              </div>
            </th>
            <th className="p-2 min-width-160 table-column">
              <div className="font-weight-bold font-family-tab font-size-11">
                Cost to Replace
              </div>
            </th>
            <th className="p-2 min-width-160 table-column">
              <div className="font-weight-bold font-family-tab font-size-11">
                Potential Savings
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.id}-row`}>
              <td className="font-family-tab">
                {item.name}
              </td>
              <td className="font-family-tab">
                {item.age}
              </td>
              <td className="font-family-tab">
                <Chip size="small" label={item.rating} color={item.rating === 'Poor' ? 'error' : item.rating === 'Average' ? 'warning' : 'success'} />
              </td>
              <td className="font-family-tab">
                {item.replaceCost}
              </td>
              <td className="font-family-tab text-success">
                {item.savings}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <hr className="m-0" />
    </div>
  </ChartCard>
);

export default EnergyFacilities;
