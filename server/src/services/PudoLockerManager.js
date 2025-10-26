const axios = require('axios');
const PudoTokenManager = require('./PudoTokenManager');
const normalizeText = require('../controllers/normalizeText');

const API_LOCKER_URL = process.env.NODE_ENV === 'production' 
? 'https://ecommerceapipudo.azurewebsites.net/api/v1/Lockers' 
: 'https://ecommerceapipudo-sandbox.azurewebsites.net/api/v1/Lockers';

let _masterLockers = [];
let _masterUbications = new Set();

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

const fetchLockers = async () =>
{
    try
    {
        const token = await PudoTokenManager.getValidToken();

        const response = await axios.get( API_LOCKER_URL, { headers: { 'Authorization': `Bearer ${token}` } } );

        _masterLockers = response.data;

        _masterLockers.forEach( locker => _masterUbications.add( normalizeText(locker.lockerAddress.city) ) );

        return true;
    }
    catch(err)
    {
        console.error( err );
        return false;
    }
};

const initializeLockerManager = async () =>
{
    const success =  await fetchLockers();

    if(success)
    {
        setInterval( fetchLockers, REFRESH_INTERVAL_MS );
    }
    else
    {
        throw new Error( 'El servicio PUDO Lockers está inoperable.' );
    }

}

const getMasterLockers = async () =>
{
    if(_masterLockers.length===0)
    {
        await fetchLockers();
        
        if(_masterLockers.length===0)
        {
            throw new Error( 'El servicio PUDO Lockers está inoperable.' );
        }
    }

    return [..._masterLockers];
}

const getLockerZones= async () =>
{
    if(_masterUbications.size===0)
    {
        await fetchLockers();

        if(_masterUbications.size===0)
        {
            throw new Error( 'El servicio PUDO Lockers está inoperable.' );
        }
    }

    return [..._masterUbications];
}

module.exports = { getMasterLockers, initializeLockerManager, getLockerZones };