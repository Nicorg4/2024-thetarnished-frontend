import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import dayjs from 'dayjs';

interface DateRangeCalendarProps {
  onDateChange: (dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
}

export default function DateRangeCalendarComponent({ onDateChange }: DateRangeCalendarProps) {
  const [value, setValue] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [width, setWidth] = useState(window.innerWidth);

  const handleChange = (newValue: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
    setValue(newValue);
    onDateChange(newValue);
  };

  const widthUmbral = 1000;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getNumberOfCalendars = () => {
    if (width >= widthUmbral) {
      return 2;
    }
    return 1;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar', 'DateRangeCalendar']}>
        <DateRangeCalendar calendars={getNumberOfCalendars()} value={value} onChange={handleChange} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
