import crypto from "crypto";

const BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Please define PAYSTACK_SECRET_KEY in .env.local");
  return key;
}

async function paystackRequest(method, path, body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
  };

  if (body) options.body = JSON.stringify(body);

  const res  = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!data.status) {
    throw new Error(data.message ?? "Paystack request failed");
  }

  return data;
}

export async function createCustomer({ email, name }) {
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ") || firstName;
  const data = await paystackRequest("POST", "/customer", {
    email,
    first_name: firstName,
    last_name:  lastName,
  });
  return data.data;
}

export async function getCustomer(customerCode) {
  const data = await paystackRequest("GET", `/customer/${customerCode}`);
  return data.data;
}

export async function initializeTransaction({ email, amount, metadata, callbackUrl, plan }) {
  const data = await paystackRequest("POST", "/transaction/initialize", {
    email,
    amount,
    metadata,
    callback_url: callbackUrl,
    plan,
  });
  return data.data;
}

export async function verifyTransaction(reference) {
  const data = await paystackRequest("GET", `/transaction/verify/${reference}`);
  return data.data;
}

export async function getSubscription(subscriptionCode) {
  const data = await paystackRequest("GET", `/subscription/${subscriptionCode}`);
  return data.data;
}

export async function cancelSubscription(subscriptionCode, token) {
  const data = await paystackRequest("POST", "/subscription/disable", {
    code:  subscriptionCode,
    token: token,
  });
  return data;
}

export async function listCustomerSubscriptions(customerCode) {
  const data = await paystackRequest("GET", `/subscription?customer=${customerCode}`);
  return data.data;
}

export async function getPlan(planCode) {
  const data = await paystackRequest("GET", `/plan/${planCode}`);
  return data.data;
}

export function verifyWebhookSignature(rawBody, signature) {
  const hash = crypto
    .createHmac("sha512", getSecretKey())
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
