const https = require("https");
const ical = require("ical-generator");

const concat = (x, y) => x.concat(y);
const flatMap = (f, xs) => xs.map(f).reduce(concat, []);
Array.prototype.flatMap = function(f) {
  return flatMap(f, this);
};

const getSchoolHolidays = () =>
  new Promise((resolve, reject) => {
    const url =
      "https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays?output=json";

    https
      .get(url, resp => {
        let data = "";
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });

const getData = async regionName => {
  const schoolHolidays = await getSchoolHolidays();

  return schoolHolidays
    .flatMap(item => item.content)
    .flatMap(content => content.vacations)
    .flatMap(vacation =>
      vacation.regions
        .filter(
          r =>
            !regionName ||
            r.region === regionName ||
            r.region === "heel Nederland"
        )
        .map(r => ({
          title: `${vacation.type.trim()} (${r.region})`,
          startdate: r.startdate,
          enddate: r.enddate
        }))
    );
};

exports.getCalendar = async region => {
  const data = await getData(region);

  const cal = ical({
    name: `Schoolvakanties regio ${region}`,
    events: data.map(item => ({
      start: item.startdate,
      end: item.enddate,
      summary: item.title
    }))
  }).ttl(60 * 60 * 24);

  return cal.toString();
};
