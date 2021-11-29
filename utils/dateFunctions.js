const { format, formatDistance } = require('date-fns');
const { fi, enGB } = require('date-fns/locale');

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
const formatDate = (date, formatStr = 'PP', locale) => {
  switch (locale) {
    case 'en-GB':
      locale = enGB;
      break;
    default:
      locale = fi;
  }
  return format(date, formatStr, {
    locale,
  });
};

const timeSince = (date, locale) => {
  switch (locale) {
    case 'en-GB':
      locale = enGB;
      break;
    default:
      locale = fi;
  }
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale,
  });
};

module.exports = { formatDate, timeSince };
