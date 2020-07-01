import { Client } from "uu_appg01";
import Calls from "calls";

// WTM workaorund to fix bambillion of server calls
const OVERRIDDEN_URLS = [
  "https://api.plus4u.net/ues/wcp/ues/core/security/session/UESSession/getPersonalRole",
  "https://api.plus4u.net/ues/wcp/ues/digitalworkspace/digitalworkspace/UESDigitalWorkspace/getActiveRecordList",
  "https://api.plus4u.net/ues/wcp/ues/core/property/UESProperty/getValue"
];

let oldGet = Client.get;
let newGet = async function(url, data, options) {
  if (OVERRIDDEN_URLS.includes(url)) {
    let commandUri = Calls.getCommandUri("sys/redirectToPlus4uNetApi");
    let newData = {
      originalData: data,
      originalUri: url
    };
    return oldGet(commandUri, newData, options);
  } else {
    return oldGet(url, data, options);
  }
};
Client.get = newGet;
