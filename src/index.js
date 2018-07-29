const schoolholidays = require("./schoolholidays");

exports.handler = async event => {
  const region = event.queryStringParameters
    ? event.queryStringParameters.region
    : null;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="calendar.ics"'
    },
    body: await schoolholidays.getCalendar(region)
  };
};
