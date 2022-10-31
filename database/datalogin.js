const low= require('lowdb')
const FileSinc=require('lowdb/adapters/FileSync')
const path=require('path')
const config=require('../configLogin.json')
const adapter = new FileSinc(path.resolve(__dirname, config.db))
const db= low(adapter)


module.exports=db;