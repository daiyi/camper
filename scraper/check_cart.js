const fetch = require("node-fetch");
module.exports = async function(bearerToken) {
  const cartUrl = "https://www.recreation.gov/api/cart/shoppingcart";
  const response = await fetch(cartUrl, {
    headers: { authorization: `Bearer ${bearerToken}` }
  });
  if (response.ok) {
    const body = await response.json();
    console.log(body.reservations);
    return body.reservations;
  }
  console.error(response);
  return [];
};
