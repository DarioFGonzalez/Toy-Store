const { getLockerZones, getMasterLockers } = require('../../services/PudoLockerManager');

const getLockerLocations = async (req, res) =>
{
    try
    {
        const locations = await getLockerZones();
        
        return res.status(200).json( locations );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { getLockerLocations: 'Error al traer localizaciones de lockers.' } );
    }
}

const getLockersByLocation = async (req, res) =>
{
    const { zone } = req.params;

    try
    {
        const allLockers =  await getMasterLockers();
        const filteredLockers = allLockers.filter( locker => locker.lockerAddress.city === zone );

        if(filteredLockers.length===0)
        {
            return res.status(404).json( { getLockersByLocation: 'No se encontraron lockers en la localización solicitada.' } );
        }

        return res.status(200).json( filteredLockers );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { getLockersByLocation: 'Error al traer lockers por localización.' } );
    }
}

module.exports = { getLockerLocations, getLockersByLocation };