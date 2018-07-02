'use strict';
var dbconfig = require('../../config/db'),
FamilyMetadata = require('../helpers/transformer/familyMetadata');
var Logger=require('bunyan');
var log=new Logger.createLogger({
    name:'family-labs',
    serializers: { req: Logger.stdSerializers.req }

});
var rdb = require('rethinkdbdash')({
    pool: true,
    cursor: false,
    port: dbconfig.rethinkdb.port,
    host: dbconfig.rethinkdb.host,
    db: dbconfig.rethinkdb.db
});

const uuidv4 = require('uuid/v4');

family.prototype.data = {}

function family(data) {
    family.prototype.data = data;
}

family.prototype.getData = function() {
    return family.prototype.data;
}

family.prototype.get = function(name) {
    return this.data[name];
}

family.prototype.set = function(name, value) {
    this.data[name] = value;
}

/**
 * save family details
 */
family.prototype.save = (cb) => {   
    console.log('create family model....',family.prototype.data);
    var familyMetadata = new FamilyMetadata(family.prototype.data).getData();
    console.log(familyMetadata)
    rdb.table("family").insert(familyMetadata).run().then(function(familyMetadata) {
        cb(null, familyMetadata);
    }).catch(function(e) {
        cb(e);
    })       
}
family.prototype.findAll = (cb) =>
{
    var response = {
        message: "Cannot Get all Details.",
        statusCode: 404,
        errorCode: "code1"
    }
    rdb.table("family")
        //.orderBy('familyId')
        .run().then(function(result) {

            console.log(result)
            var resObj = { "status": "200", "data": result }
            cb(null, resObj);
        }).catch(function(err) {
            log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            cb(response);
        });
                        
}
 /* get badge details by badgeId
 */
family.prototype.DetailsById = (familyId, cb) => {
    var response = {
        message: "Cannot Get Details by Id" + familyId,
        statusCode: 404,
        errorCode: "code1"
    }
    rdb.table("family")
        .filter({ 'familyId': familyId})
        .run()
        .then(function(result) {            
                var resObj = { "status": "200", "data": result }
                cb(null, resObj);
            })
};
family.prototype.updateDetails = (familyId,cb) => {
    var familyMetadata = new FamilyMetadata(family.prototype.data).getData();
familyMetadata.updatedDTS = new Date();
    rdb.table("family").filter({ 'familyId': familyId})
        .update(familyMetadata).run().then(function(result) {
            cb(null, result);
        }).catch(function(err) {
            //log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            cb(err);
        })
}
family.prototype.deleteDetails= (familyId, cb) => {
   /* var response = {
        message: "Cannot delete  by Id" + familyId,
        statusCode: 404,
        errorCode: "code1"
    }*/
    rdb.table("family")
        .filter({ 'familyId': familyId})
        .delete()
        .run()
        .then(function(result) {   
            console.log("deleted")           
            cb(null,result);  
            console.log(result.data)          
        }).catch(function(err) {
            cb(result);
        });
}
module.exports = family;