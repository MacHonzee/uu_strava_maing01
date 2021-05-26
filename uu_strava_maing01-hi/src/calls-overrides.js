import { Client } from "uu_appg01";
import Calls from "calls";

// Cors workaround, all of these calls are redirected to own server which handles it without the Cors
const OVERRIDDEN_URLS = [
  "https://api.plus4u.net/ues/wcp/ues/core/security/session/UESSession/getPersonalRole",
  "https://api.plus4u.net/ues/wcp/ues/digitalworkspace/digitalworkspace/UESDigitalWorkspace/getActiveRecordList",
  "https://api.plus4u.net/ues/wcp/ues/core/property/UESProperty/getValue",
  "https://cmd.plus4u.net/PLUS4U-BT/uu-plus4uppl/PersonalCard/getAttributes/exec",
  "https://cmd.plus4u.net/PLUS4U-BT/uu-plus4uppl/PersonalCard/getAttributes/exec?contact_list=false",
  "https://uuappg01-eu-w-1.plus4u.net/uu-plus4upeople-maing01/56ac93ddb0034de8b8e4f4b829ff7d0f/findPerson",
];

let oldGet = Client.get;
let newGet = async function (url, data, options) {
  if (OVERRIDDEN_URLS.includes(url)) {
    let commandUri = Calls.getCommandUri("sys/redirectToPlus4uNetApi");
    let newData = {
      originalData: data,
      originalUri: url,
    };
    return oldGet(commandUri, newData, options);
  } else {
    return oldGet(url, data, options);
  }
};
Client.get = newGet;
