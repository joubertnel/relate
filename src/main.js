/*globals define */

define([], function() {
    var derive = function(parent, child, slotDefs) {
            var addSlot = function(name) {
                child.prototype[name] = slotDefs[name];
            };

            if (parent) {
                child.prototype = new parent;
                child.prototype.constructor = child;
                child.prototype.parent = parent.prototype;
            }

            (slotDefs && Object.keys(slotDefs) || []).forEach(addSlot);
    };

    var CoreObject = function(slots) {
        if (slots) {
            this.setProperties(slots);
        }
    };
    
    CoreObject.prototype = {
        setProperties: function(kv) {
            var instance;
            var setPropertyVal;

            if (kv) {
                instance = this;            
                setPropertyVal = function(k) {
                    instance[k] = kv[k];
                };

                Object.keys(kv).forEach(setPropertyVal);
            }
            
            return this;
        }
    };

    return {
        CoreObject: CoreObject,
        derive: derive
    };
});