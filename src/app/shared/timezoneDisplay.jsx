import { useSelector } from 'react-redux';

export default function DisplayTimezone() {
  const { userInfo } = useSelector((state) => state.user);
  if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone) {
    return `${userInfo.data.company.short_format_timezone || userInfo.data.company.timezone}`;
  }
}
