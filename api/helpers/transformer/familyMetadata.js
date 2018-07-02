'use strict'

familyMetadata.prototype.family = {};

function familyMetadata(data) {
    familyMetadata.prototype.family = {};
    var typedata;
    if ((typeof data) === "string") {
        typedata = JSON.parse(data);
    } else {
        typedata = data;
    }

    familyMetadata.prototype.family.name = typedata.name;
    familyMetadata.prototype.family.description = typedata.description;
   

}

familyMetadata.prototype.getData = function() {
    return familyMetadata.prototype.family;
}

module.exports = familyMetadata;