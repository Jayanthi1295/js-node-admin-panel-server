var express= require('express')
var http= require('http')

var app= express;

app.listen(3000,()=>{
    console.log("listen on port ", 3000)
})


module.exports =app;