const api ={
    TELEMATICS : "https://intouch.mapmyindia.com/iot/api"
}

module.exports = {
    tokenGeneration : {
        METHOD :"POST",
        URL  : "https://outpost.mapmyindia.com/api/security/oauth/token",
        headers: { 
            contentType: 'application/x-www-form-urlencoded',
            accept: 'application/json'
          }
    },
    telematics : {
        URL : api.TELEMATICS,
        headers:{
          'accept': 'application/json',
          'Authorization': 'Bearer %ACCESS_TOKEN%'
        },
        Geofence :{   // fetch all the geofence data
             GETALL:{
                METHOD:"GET",
                URL  : api.TELEMATICS + '/geofences'
             },
             CREATE:{
                METHOD : "POST",
                URL  : api.TELEMATICS + '/geofences'
             },
             UPDATE:{
                METHOD : "POST",
                URL  : api.TELEMATICS + '/geofences/{id}'
             },
             GETSINGLE:{
                METHOD : "GET",
                URL  : api.TELEMATICS + '/geofences/{id}'
             },
            DELETE:{
                METHOD : "DELETE",
                URL  : api.TELEMATICS + '/geofences/{id}'
            },
            GETALLACTIVITY :{
                METHOD : "GET",
                URL  : api.TELEMATICS + '/geofences/activities'
            }  
        }
    }
}