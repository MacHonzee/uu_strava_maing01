const Tools = {
  updateStatistics: (statistics, trailtour, yesterday) => {
    ["menResults", "womenResults"].forEach((resultKey) => {
      let sex = resultKey.replace("Results", "");

      trailtour[resultKey].forEach((result) => {
        let stravaId = result.stravaId;
        statistics[stravaId] = statistics[stravaId] || { count: 0 };
        statistics[stravaId].count++;
        if (yesterday) {
          if (!statistics[stravaId].lastRun) {
            statistics[stravaId].lastRun = result.runDate;
          }

          if (result.runDate > statistics[stravaId].lastRun) {
            statistics[stravaId].lastRun = result.runDate;
          }
        }

        if (result.club) {
          statistics.clubs[result.club] = statistics.clubs[result.club] || Tools.clubDefault;
          let clubStats = statistics.clubs[result.club];
          clubStats.runners[sex][stravaId] = clubStats.runners[sex][stravaId] || 0;
          clubStats.runners[sex][stravaId] += result.points;
          clubStats.results[sex]++;
        }
      });
    });
    return statistics;
  },

  saveStatistics: async (statistics, trailtourObj) => {
    ["menResults", "womenResults"].forEach((resultKey) => {
      trailtourObj.totalResults[resultKey].forEach((result) => {
        let stravaId = result.stravaId;
        let stats = statistics[stravaId] || { count: 0 };
        result.totalCount = stats.count;
        result.avgPoints = stats.count > 0 ? result.points / result.totalCount : 0;
        if (stats.lastRun) result.lastRun = stats.lastRun;
      });
    });

    trailtourObj.totalResults.clubResults.forEach((result) => {
      let club = result.name;
      let stats = statistics.clubs[club] || Tools.clubDefault;
      result.resultsMen = stats.results.men;
      result.resultsWomen = stats.results.women;
      result.resultsTotal = stats.results.men + stats.results.women;
      result.runnersMen = Object.keys(stats.runners.men).length;
      result.runnersWomen = Object.keys(stats.runners.women).length;
      result.runnersTotal = result.runnersMen + result.runnersWomen;
      result.pointsMen = Object.values(stats.runners.men).reduce((sum, points) => sum + points, 0.0);
      result.pointsWomen = Object.values(stats.runners.women).reduce((sum, points) => sum + points, 0.0);
      result.avgPointsMen = result.resultsMen > 0 ? result.pointsMen / result.resultsMen : 0;
      result.avgPointsWomen = result.resultsWomen > 0 ? result.pointsWomen / result.resultsWomen : 0;
      result.avgPoints = result.resultsTotal > 0 ? result.points / result.resultsTotal : 0;
    });

    const trailtourDao = require("../trailtour/update-abl").trailtourDao;
    return await trailtourDao.updateByYear(trailtourObj);
  },

  get clubDefault() {
    return { runners: { men: {}, women: {} }, results: { men: 0, women: 0 } };
  },
};

module.exports = Tools;
