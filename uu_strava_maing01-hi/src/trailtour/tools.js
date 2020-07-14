const NAME_KEYS = ["name", "club", "author"];
const SEGMENT_KEYS = ["distance", "total_elevation_gain", "state", "city"];
const ATHLETE_SEX_KEYS = ["order", "points", "time", "pace"];
const KEY_TRANSLATE = {
  ownOrder: "order"
};
const RUNNER_COUNT_KEY = "runnerCount";
const RUNNER_COUNT_SEXES = {
  male: "menResultsTotal",
  female: "womenResultsTotal"
};
const RUNNER_COUNT_SEX_KEYS = Object.values(RUNNER_COUNT_SEXES);

const TrailtourTools = {
  NAME_FILTER_KEY: "nameFilter",

  handleSorting(sourceData, sorterList, athleteSex) {
    if (!sorterList || sorterList.length === 0) return sourceData;

    sourceData.sort((item1, item2) => {
      for (let i = 0; i < sorterList.length; i++) {
        // prepare key and multiplier
        let { key, descending } = sorterList[i];
        let multiplier = descending ? -1 : 1;
        if (KEY_TRANSLATE[key]) key = KEY_TRANSLATE[key];
        if (athleteSex && key === RUNNER_COUNT_KEY) key = RUNNER_COUNT_SEXES[athleteSex];

        // get values from items based on configuration
        let value1, value2;
        if (SEGMENT_KEYS.includes(key)) {
          value1 = item1.segment[key];
          value2 = item2.segment[key];
        } else if (athleteSex && ATHLETE_SEX_KEYS.includes(key)) {
          let resultKey = athleteSex === "male" ? "menResults" : "womenResults";
          value1 = item1[resultKey][0] ? item1[resultKey][0][key] : null;
          value2 = item2[resultKey][0] ? item2[resultKey][0][key] : null;
        } else if (RUNNER_COUNT_SEX_KEYS.includes(key)) {
          let resultKey = athleteSex === "male" ? "menResults" : "womenResults";
          value1 = item1[resultKey][0] ? item1[key] : null;
          value2 = item2[resultKey][0] ? item2[key] : null;
        } else {
          value1 = item1[key];
          value2 = item2[key];
        }

        // move undefined and null items to the bottom of list
        if (value1 == null) return 1;
        if (value2 == null) return -1;

        // sort strings by comparison
        let result;
        if (NAME_KEYS.includes(key)) {
          let result = multiplier * value1.localeCompare(value2);
          if (result !== 0) return result;
        }

        // sort by numbers
        if (value1 > value2) {
          result = multiplier;
        } else if (value1 < value2) {
          result = -1 * multiplier;
        } else {
          result = 0;
        }
        if (result !== 0) return result;
      }
    });
    return sourceData;
  },

  handleFiltering(sourceData, filterMap) {
    if (filterMap[this.NAME_FILTER_KEY]) {
      let nameFilter = filterMap[this.NAME_FILTER_KEY].toLocaleLowerCase();
      sourceData = sourceData.filter(item => {
        for (let nameKey of NAME_KEYS) {
          if (item[nameKey] && item[nameKey].toLocaleLowerCase().includes(nameFilter)) {
            return true;
          }
        }
        return false;
      });
    }
    return sourceData;
  }
};

export default TrailtourTools;
