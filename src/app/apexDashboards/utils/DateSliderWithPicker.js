import React, { useState, useEffect } from 'react';
import { Slider, DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';

const DateSliderWithPicker = ({
  start, end, step = 1, onChange,
}) => {
  const start_date = moment(start, dateFormat);
  const number_of_date = moment(end, dateFormat).diff(start_date, 'days');
  const [selectedRange, setSelectedRange] = useState([0, number_of_date]);

  const onSliderChange = (values) => {
    setSelectedRange(values);
    const start_string = moment(start, dateFormat)
      .add(values[0], 'days')
      .format(dateFormat);
    const end_string = moment(start, dateFormat)
      .add(values[1], 'days')
      .format(dateFormat);
    onChange && onChange([start_string, end_string]);
  };

  useEffect(() => {
    const start_d = moment(start, dateFormat);
    const number_of_d = moment(end, dateFormat).diff(start_d, 'days');
    setSelectedRange([0, number_of_d]);
    // onChange && onChange([start, end]);
  }, [start, end]);

  const onPickDates = (dates) => {
    if (dates && dates.length && dates[0] !== null) {
      setSelectedRange([
        dates[0].diff(moment(start, dateFormat), 'days'),
        dates[1].diff(moment(start, dateFormat), 'days'),
      ]);
      onChange
      && onChange([dates[0].format(dateFormat), dates[1].format(dateFormat)]);
    }
  };

  const formatter = (value) => moment(start, dateFormat).add(value, 'days').format(dateFormat);

  const disabledDate = (current) =>
    // Can not select days before today and today
    (
      current
      && (current < moment(start, dateFormat) || current > moment(end, dateFormat))
    );
  return (
    <div>
      <DatePicker.RangePicker
        format={dateFormat}
        disabledDate={disabledDate}
        value={[
          moment(start, dateFormat).add(selectedRange[0], 'days'),
          moment(start, dateFormat).add(selectedRange[1], 'days'),
        ]}
        onChange={onPickDates}
      />
      <Slider
        min={0}
        max={number_of_date}
        range
        defaultValue={[0, number_of_date]}
        value={selectedRange}
        tipFormatter={formatter}
        onChange={onSliderChange}
      />
    </div>
  );
};

export default DateSliderWithPicker;
