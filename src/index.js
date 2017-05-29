'use strict';

import createPrivateStorage from './private.js';
const _ = createPrivateStorage();

class DoserError extends Error {
    constructor(message) {
        super('[Doser] '+message);
    }  
}

function isPrimitive(v) {
    return v !== Object(v);
}

function resolver(onlyPublic, key) {
    const injection = _(this)[key];
    
    if(onlyPublic && injection.isPrivate) {
        throw new DoserError(`Key '${key}' is private`);
    }
    
    if(!injection.resolved) {
        injection.instance = injection.factory(resolver.bind(this, false));
        injection.resolved = true;
        delete injection.factory;
    }
    
    return injection.instance;
}

class Doser {
    has(key) {
        if(!isPrimitive(key)) {
            throw new DoserError(`Key must be a primitive`);
        }
        return _(this).hasOwnProperty(key);
    }
    
    get(key) {
        if(!this.has(key)) {
            throw new DoserError(`No such key '${key}'`);
        }
        
        return resolver.call(this, true, key);
    }
    
    register(key, factory, isPrivate) {
        if(this.has(key)) {
            throw new DoserError(`Key '${key}' already registered`);
        }
        
        if(typeof(factory) !== 'function') {
            throw new DoserError('Factory must be a function');
        }
        
        _(this)[key] = {
            resolved: false,
            isPrivate: !!isPrivate,
            factory 
        };
    } 
}


export default Doser;
module.exports = Doser;