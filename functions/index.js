const functions = require("firebase-functions");

/**
 * Basic health check endpoint to validate the Functions setup.
 * Add authentication/authorization in front of any sensitive logic.
 */
exports.healthcheck = functions.https.onRequest((req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
