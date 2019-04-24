const fetch = require("node-fetch");
const log = require("./../logging");

module.exports = async function login(username, password) {
  const response = await fetch(
    `https://www.recreation.gov/api/accounts/login`,
    {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    }
  );
  log.debug(`login response`, response);
  if (response.ok) {
    const body = await response.json();
    return body;
  } else {
    throw new Error(`Login was not successful for user ${username}`, response);
  }
};
