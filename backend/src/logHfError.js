// logHfError.js
function logHfError(label, err) {
  const detail = err && err.httpResponse && err.httpResponse.body;
  console.error(label, err && err.message, detail ? JSON.stringify(detail) : "");
}

module.exports = { logHfError };
