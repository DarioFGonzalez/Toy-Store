const axios = require('axios');
const PudoTokenManager = require('./PudoTokenManager');
const { LOCKERS_URL } = require('../config/pudoApiConfig');
const normalizeText = require('../controllers/normalizeText');

let _masterLockers = [];
let _masterUbications = new Set();

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

const fetchLockers = async () =>
{
    try
    {
        const header = await PudoTokenManager.getValidHeader();

        const response = await axios.get( LOCKERS_URL, header );

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