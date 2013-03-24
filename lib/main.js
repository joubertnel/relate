/*globals module */

var _invokeHistoryKey = '__oop.InvokeHistory__' + Date.now();

var derive = function(parent, child, slotDefs) {
    var addSlot = function(name) {
        child.prototype[name] = slotDefs[name];
    };

    if (parent) {
        child.prototype = new parent;
        child.prototype.constructor = child;
        child.prototype._super = parent.prototype;
    }

    (slotDefs && Object.keys(slotDefs) || []).forEach(addSlot);
};

var tryAction = function(action, target, args) {
    var targetAction = target && target[action];
    return targetAction ? targetAction.apply(target, args) : undefined;
};

var tryActionOnce = function(action, target, args) {
    var actionsTakenOnTarget;
    var result;

    if (target) {
        actionsTakenOnTarget = target[_invokeHistoryKey];
        if (!actionsTakenOnTarget) {
            actionsTakenOnTarget = target[_invokeHistoryKey] = {};
        }

        if (!actionsTakenOnTarget[action]) {
            actionsTakenOnTarget[action] = true;
            result = tryAction(action, target, args);
        }
    }

    return result;
};

var forgetTryHistory = function(target) {
    var hasHistory = target && target[_invokeHistoryKey];
    if (hasHistory) {
        target[_invokeHistoryKey] = {};
    }
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


module.exports = {
    CoreObject: CoreObject,
    derive: derive,
    try: tryAction,
    tryOnce: tryActionOnce,
    forgetTryHistory: forgetTryHistory
};
