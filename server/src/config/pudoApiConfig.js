const PUDO_BASE_URL = process.env.NODE_ENV === 'production'
? 'https://ecommerceapipudo.azurewebsites.net/api'
: 'https://ecommerceapipudo-sandbox.azurewebsites.net/api';

const AUTH_URL = `${PUDO_BASE_URL}/token`;

const LOCKERS_URL = `${PUDO_BASE_URL}/v1/Lockers`;

const QUOTE_URL = `${PUDO_BASE_URL}/v1/ShippingRates`;

const SHIPMENT_URL = `${PUDO_BASE_URL}/v1/Order`;

const TRACKING_URL = `${PUDO_BASE_URL}/v1/trackingurl/`;

const LABEL_URL = `${PUDO_BASE_URL}/v1/labels/`;

module.exports =
{
    PUDO_BASE_URL, AUTH_URL, LOCKERS_URL,
    QUOTE_URL, SHIPMENT_URL,
    TRACKING_URL, LABEL_URL
 };