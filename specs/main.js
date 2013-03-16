/*globals require, describe, it, expect, before, beforeEach */


var requirejs = require('requirejs');
var expect = require('chai').expect;

requirejs.config({
    baseUrl: 'src',
    nodeRequire: require
});

describe('main', function() {

    var oop;

    // Importing the OOP library using RequireJS is asynchronous.
    // So we wait for it to be imported and then continue. 
    before(function(done) {
        requirejs(['main'], function(lib) {
            oop = lib;
            done();
        });
    });

    describe('CoreObject', function() {

        describe('the constructor', function() {
            it('creates an instance of CoreObject', function() {
                var o = new oop.CoreObject;
                expect(o).to.be.instanceof(oop.CoreObject);
            });

            it('can accept a map of initial key/values that get set on the instance', function() {
                var technology = 'JavaScript';
                var domain = 'Everywhere';
                var expected = [technology, domain];
                var o = new oop.CoreObject({
                    technology: technology,
                    domain: domain
                });
                var actual = [o.technology, o.domain];
                expect(actual).to.deep.equal(expected);
            });
        });

    });

    describe('derive', function() {
        var Parent, Child;

        beforeEach(function() {
            Parent = function() {};
            Child = function() {};
        });
        
        it('sets up a prototypal chain between parent and child', function() {
            oop.derive(Parent, Child);
            expect(Child.prototype).to.be.an.instanceof(Parent);
            expect(Child.prototype.constructor).to.equal(Child);
        });

        it('adds methods to the child that can invoke methods on the parent (i.e. super functionality)', function() {
            var child;
            Parent.prototype.grow = function() { return 'parentDidGrow'; };
            
            oop.derive(Parent, Child, {
                grow: function() {
                    var result = 'childDidGrow ' + this._super.grow();
                    return result;
                }
            });

            child = new Child;

            expect(child.grow()).to.equal('childDidGrow parentDidGrow');
        });

        it('adds properties to the child', function() {
            var child;
            oop.derive(Parent, Child, {
                'invokePattern': 'async'
            });

            child = new Child;
            expect(child.invokePattern).to.equal('async');            
        });
    });
    
});

