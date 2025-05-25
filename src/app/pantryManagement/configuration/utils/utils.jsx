/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable radix */
import { Badge } from 'reactstrap';
import pantryActions from '../data/customData.json';

export function getInventoryValuation(data) {
  if (pantryActions && pantryActions.inventoryText[data]) {
    return pantryActions.inventoryText[data].label;
  }
  return '';
}

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data, label: values[i].label, backgroundColor: ['#00be4b', '#fdca5c', '#17a2b8', '#ff1e32', '#6134eb', '#6f42c1', '#8077ee', '#21ebbc'],
        });
      }
    }
    result = {
      datasets: datas,
      labels,
    };
  }
  return result;
}

export function getPantryStateLabel(staten) {
  if (pantryActions && pantryActions.statesPantryLabel[staten]) {
    return (
      <Badge
        color={pantryActions.statesPantryLabel[staten].color}
        className="badge-text no-border-radius pantry-badge"
        pill
      >
        {pantryActions.statesPantryLabel[staten].label}
      </Badge>
    );
  }
  return '';
}
