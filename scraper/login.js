const fetch = require("node-fetch");

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
  if (response.ok) {
    const body = await response.json();
    console.log(JSON.stringify(body, null, 4));
    return body;
  } else {
    throw new Error(`Login was not succesful for user ${username}`, response);
  }
};
