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

            it('can accept a map of initial property values', function() {
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

        it('adds a parent property that can be used to refer to the parent (for calling "super" methods)', function() {
            oop.derive(Parent, Child);
            expect(Child.prototype.parent).to.equal(Parent.prototype);
        });

        it('adds properties with values to the child prototype', function() {
            var child;
            oop.derive(Parent, Child, {
                language: 'JavaScript'
            });

            child = new Child();
            expect(child.language).to.equal('JavaScript');
        });

        it('adds methods to the child (prototype)', function() {
            var child;
            oop.derive(Parent, Child, {
                grow: function() { return 'didGrow'; }
            });

            child = new Child;
            expect(child.grow()).to.equal('didGrow');
        });
    });
    
});

