import dayjs from 'dayjs'

export interface ReturnUseDateUtils {
  format: (date: string, type: 'date' | 'time') => string
  isSameMonth: (calendarDate: string, current: number) => boolean
  isThisMonth: (calendarDate: number) => boolean
  isSameDate: (current: Date, calendarDate: Date) => boolean
}
export default function useDateUtils(): ReturnUseDateUtils {
  function format(date: string, type: 'date' | 'time') {
    return type === 'date'
    ? dayjs(date).format('YYYY-MM-DD')
    : dayjs(date).format('HH:mm')
  }

  function isSameMonth(calendarDate: string, current: number) {
    const currentDate = dayjs(current).format('YYYY-MM-DD')
    const calendarMonth =  dayjs(calendarDate).get('month')
    const currentMonth = dayjs(currentDate).get('month')
    return calendarMonth === currentMonth
  }

  function isThisMonth(calendarDate: number) {
    const currentDate = dayjs().format('YYYY-MM-DD')
    const calendarMonth =  dayjs(calendarDate).get('month')
    const currentMonth = dayjs(currentDate).get('month')
    return calendarMonth === currentMonth
  }


  function isSameDate(current: Date, calendarDate: Date) {
    const date1 = new Date(current);
    const date2 = new Date(calendarDate);

    return dayjs(date1).isSame(date2, 'day')
  }

  return {
    format,
    isSameMonth,
    isThisMonth,
    isSameDate,
  }
}