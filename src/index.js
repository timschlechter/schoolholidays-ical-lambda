const schoolholidays = require("./schoolholidays");

exports.handler = async event => {
  const region = event.queryStringParameters
    ? event.queryStringParameters.region
    : null;

  const filename = region
    ? `schoolvakanties-${region}.ics`
    : `schoolvakanties.ics`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    },
    body: await schoolholidays.getCalendar(region)
  };
};
