const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Get date time all for month, year etc
 * @param {string} type : {year: 2022, month: 5, date: 16, hour: 16, minute: 48, second: 25, millisecond: 918 }
 * @returns
 */
module.exports.getCurrentDateTime = (type) => {
  try {
    let now = dayjs();
    return type ? now[type]() : now;
  } catch (error) {
    throw Error(error);
  }
};
/**
 * Date format
 * @param {string} dateFormat : { 'YYYY-MM-DD'}
 * @returns
 */
module.exports.dateFormat = (date, dateFormat) => {
  try {
    let now = dayjs(date);
    return now.format(dateFormat);
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Get utc date time
 * @param {string} dateFormat : { 'YYYY-MM-DD'}
 * @returns
 */
module.exports.getUtcDateTime = (
  date,
  timezone = 'asia/calcutta',
  dateFormat = 'YYYY-MM-DD'
) => {
  try {
    const customDayjs = dayjs.tz(date, timezone);
    return dateFormat ? customDayjs.format(dateFormat) : customDayjs;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Get start and end date for weak, year and month
 * @param {string} type : {week, month, year}
 * @returns
 */
module.exports.getRelativeDateTime = (date, type, dateFormat) => {
  try {
    let newDate = dayjs(date ?? Date());
    let startDate = newDate.startOf(type);
    let endDate = newDate.endOf(type);
    return {
      startDate: startDate ? startDate.format(dateFormat) : startDate,
      endDate: endDate ? endDate.format(dateFormat) : endDate,
    };
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Current Date and custom date add
 * @param {string} type : {week, month, year}
 * @returns
 */
module.exports.addDate = (date, addValue, type, dateFormat) => {
  try {
    let now = date ? dayjs() : dayjs(date);
    let d1 = now.add(addValue ?? '14', type ?? 'day');
    return dateFormat ? d1.format(dateFormat) : d1;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Current Date and custom date subtract
 * @param {string} type : {week, month, year}
 * @returns
 */
module.exports.subtractDate = (date, subtractValue, type, dateFormat) => {
  try {
    let now = date ? dayjs() : dayjs(date);
    let d1 = now.subtract(subtractValue ?? '14', type ?? 'day');
    return dateFormat ? d1.format(dateFormat) : d1;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Date comparison start and end date
 * @param {string} type : {same, after, before}
 * @returns
 */
module.exports.getComparisonDateTime = (
  startDate,
  endDate,
  type
  //   dateFormat
) => {
  try {
    let toDate = dayjs(startDate ?? Date());
    let fromDate = dayjs(endDate ?? Date());
    // toDate = dateFormat ? toDate.format(dateFormat) : toDate;
    // fromDate = dateFormat ? fromDate.format(dateFormat) : fromDate;
    return type === 'same'
      ? fromDate.isSame(toDate)
      : type === 'after'
        ? fromDate.isAfter(toDate)
        : toDate.isBefore(fromDate);
  } catch (error) {
    throw Error(error);
  }
};
