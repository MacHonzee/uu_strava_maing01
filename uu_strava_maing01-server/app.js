const appServer = require("uu_appg01_server");

appServer.disableMiddleware("uu_appg01_core-appserver:middleware/ResponseHandler");

appServer.start();
