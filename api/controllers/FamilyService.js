'use strict';
//hima bindu
//test for change
//getting conflicts
//changes made
var Family = require('../domain/family');
  var Logger = require('bunyan');
var log =  new Logger.createLogger({
    name: 'family-labs',
    streams:[
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level: 'error',
            path: 'myerror.log'
        } 
    ],
    serializers:{req:Logger.stdSerializers.req}
});
var validator = require('node-validator');

module.exports = {
    createFamily: createFamily,
    getDetails: getDetails,
    getDetailsById: getDetailsById,
   updateDetails: updateDetails,
  deleteDetails: deleteDetails,

};
function createFamily(req, res) {
   
    var check=validator.isObject()
    .withRequired('name',validator.isString({message:"Please enter name"}))
    .withOptional('description',validator.isString({message:"enter Description.."}))
    var toValidate=req.swagger.params.body.value;
    validator.run(check, toValidate, function(errorCount, errors) {
        if (errorCount == 0) {
    (new Family(req.swagger.params.body.value)).save(function(err, content) {
        if (err) {
            var response = { "status": "400", "error": err }
            res.json(response);
            log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
        } else {
            log.error("create family called...");
            var response = {};
            response.status = 200;
            response.data = {};
            response.data.message = content.message || "Family created successfully";
            res.json(response);
        }
    });
    } else {
        var response = { "status": "400", "error": errors }
        res.json(response);
    }
    });
};
//get details by id
function getDetailsById(req,res)
 { 
     console.log(req.swagger.params.familyId.value);
     var check=validator.isObject().withRequired('familyId',validator.isString({message: "Enter valid family id"} ))
     validator.run(check,{"familyId": req.swagger.params.familyId.value},function(errcount,errors)
    {
        if(errcount==0){
            (new Family()).DetailsById(req.swagger.params.familyId.value,
                function(err, content) {
                                        console.log(content.data);
                    if (err) {
                        var response = { "status": "400", "error": err }
                        res.json(response);
                       
                    } else if (content.data && content.data.length > 0) {
                        var resObj = { "status": "200", "data": content.data }
                        console.log(resObj)
                        res.json(resObj);
                    } else {
                        var resObj = { "status": "200", "data": { "message": " details not found" } }
                        res.json(resObj);
                    }
                    
                });
        }
           
    })
}

function getDetails(req,res)
 {
    var limit = req.limit ? req.limit : 10;
    var page = req.page ? req.page : 1
    var skip = (page - 1) * limit;
    (new Family()).findAll(
        function(err, content) {
            console.log('content==>',content)
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
               // log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            } else if (content.data && content.data.length > 0) {
                var resObj = { "status": "200", "data": content.data }
                res.json(resObj);
            } else {
                var resObj = { "status": "200", "data": { "message": "no Details found" } }
                res.json(resObj);
            }
        });
}

function updateDetails(req, res) {  
    (new Family(req.swagger.params.body.value)).updateDetails(req.swagger.params.familyId.value,
        function(err, content) {
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
                // log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            }
            res.set('Content-Family', 'application/json');
            var resObj = {};
            resObj.status = 200;
            resObj.data = {}
            resObj.data.message = content.message || "updated successfully";
            res.json(resObj);
        });           
};
function deleteDetails(req, res) {
    var familyId = req.swagger.params.familyId.value;
   
    (new Family()).deleteDetails(req.swagger.params.familyId.value,
        function(err, content) {
            if (err) {
                
                var response = { "status": "400", "error": err }
                res.json(response);
               
            } else if (content) {
                 res.set('Content-Family', 'application/json');
                var resObj = {};
                resObj.status = 200;
                resObj.data = {};
                resObj.data.message = content.message || "deleted successfully";
                res.json(resObj);
            } 
            
        });
           
    }
