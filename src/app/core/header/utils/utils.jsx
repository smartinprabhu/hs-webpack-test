/* eslint-disable import/no-unresolved */
import covidAlert from '@images/icons/alert.svg';
import infoGreen from '@images/icons/infoGreen.svg';
import checkout from '@images/icons/checkout.svg';

export default function getIcon(priority) {
  let icon = '';
  if (priority === 'warning') {
    icon = checkout;
  } else if (priority === 'info') {
    icon = infoGreen;
  } else if (priority === 'alert') {
    icon = covidAlert;
  }
  return icon;
}
