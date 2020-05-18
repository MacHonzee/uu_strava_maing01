"use strict";
const uuidv4 = require("uuid/v4");
const { ObjectId } = require("mongodb");
const Errors = require("../api/errors/sse-adapter-error.js");

class SseAdapter {
  constructor() {
    this._responses = {};
  }

  setup(streamId, response) {
    this._responses[streamId] = this._responses[streamId] || [];
    this._responses[streamId].push(response);
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache,no-transform");
    response.setHeader("Connection", "keep-alive");
    response.setBody("\n");
  }

  sendEvent(streamId, action, data) {
    let responseList = this._responses[streamId];
    if (!responseList) {
      throw new Errors.SendEvent.NoStreamFound({}, { streamId });
    }
    let uuidString = uuidv4().replace(/-/g, "");
    let messageId = new ObjectId(uuidString.substring(0, 24));
    let body = `id: ${messageId}\nevent: ${action}\ndata: ${JSON.stringify(data)}\n\n`;
    responseList.forEach(response => response.unwrap().write(body));
  }

  close(streamId) {
    // connection is closed by client by default, server should not handle it on its terms, we just clear the cache
    delete this._responses[streamId];
  }
}

module.exports = new SseAdapter();
