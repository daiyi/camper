const fetch = require("node-fetch");
const log = require ('./../logging');
module.exports = async function(bearerToken) {
  const cartUrl = "https://www.recreation.gov/api/cart/shoppingcart";
  const response = await fetch(cartUrl, {
    headers: { authorization: `Bearer ${bearerToken}` }
  });
  if (response.ok) {
    const body = await response.json();
    return body.reservations;
  }
  log.error(`failed to check cart`, response);
  return [];
};
