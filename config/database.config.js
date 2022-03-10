console.log(process.env.MONGODB_URI,'...process.env.MONGOLAB_URI')
module.exports = {
    url : process.env.MONGODB_URI || 'mongodb://localhost:27017/mapmy-india'
}