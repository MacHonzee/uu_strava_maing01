/**
 * Server calls of application client.
 */
import * as UU5 from "uu5g04";
import Calls from "calls";

let eventSourceMap = {};
const EventSources = {
  setup(useCase, dtoIn) {
    let id = dtoIn.id || UU5.Common.Tools.generateUUID();
    if (eventSourceMap[id]) return { id, sse: eventSourceMap[id] };
    let commandUri = Calls.getCommandUri(useCase);
    let session = UU5.Environment.getSession().getCallToken();
    commandUri = commandUri + "?access_token=" + session.token;
    dtoIn.parameters &&
      Object.keys(dtoIn.parameters).forEach(param => {
        commandUri = commandUri + "&" + param + "=" + dtoIn.parameters[param];
      });
    let sse = new EventSource(commandUri);
    eventSourceMap[id] = sse;
    if (dtoIn.open) sse.addEventListener("open", event => dtoIn.open(id, sse, event));
    if (dtoIn.error) sse.addEventListener("error", event => dtoIn.error(id, sse, event));
    return { id, sse };
  },

  setupListener(sseId, action, eventListener) {
    let sse = eventSourceMap[sseId];
    if (!sse) {
      console.error("No EventSource was found with specified id.", sseId);
    } else {
      sse.addEventListener(action, eventListener);
    }
  },

  close(sseId) {
    eventSourceMap[sseId].close();
    delete eventSourceMap[sseId];
  }
};

export default EventSources;
