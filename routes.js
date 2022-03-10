module.exports = function(app) { 
    app.use('/api/projects', require('./api/projects'));
 
    app.use('/api/test', require('./api/user'));

    // app.use('/api/auth', require('./api/user'));
    app.use('/api/auth', require('./auth'));
    app.use('/api/user', require('./api/user'));



    // MMI Integration API
    // AUTH Token
    app.use('/api/mmiauth', require('./auth'));
    // GEOFENCES
    app.use('/api/geofences',require('./api/geofences'));

}