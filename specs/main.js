/*globals require, describe, it, expect, before, beforeEach, afterEach */


var requirejs = require('requirejs');
var expect = require('chai').expect;

requirejs.config({
    baseUrl: 'src',
    nodeRequire: require
});

describe('main', function() {

    var oop;
    var actual, expected;
    var obj;

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
                obj = new oop.CoreObject;
                expect(obj).to.be.instanceof(oop.CoreObject);
            });

            it('can accept a map of initial key/values that get set on the instance', function() {
                var technology = 'JavaScript';
                var domain = 'Everywhere';
                obj = new oop.CoreObject({
                    technology: technology,
                    domain: domain
                });
                
                expected = [technology, domain];
                actual = [obj.technology, obj.domain];

                expect(actual).to.deep.equal(expected);
            });
        });


    });

    describe('target/action (safe method invocation)', function() {

        var target, anotherTarget;

        beforeEach(function() {
            target = {
                doSomething: function() { arguments[0].push('didDoSomething'); }
            };
            
            anotherTarget = {
                doSomething: function() { arguments[0].push('didDoSomethingOnObj2'); }
            };
        });

        describe('try', function() {
            it('fails silently if the the target does not exist', function() {
                var target = undefined;
                var actual = 'something';
                actual = oop.try('singAndDance', target);
                expect(actual).to.be.undefined;
            });
            
            if('invokes an action if an only if a method by that name exists on the target', function() {
                expected = ['didDoSomething'];
                actual = [];

                oop.try('doSomething', target, [actual]);

                expect(actual).to.equal(expected);
            });
        });

        describe('tryOnce', function() {
            it('fails silently if the target does not exist', function() {
                var target = undefined;
                var action = 'something';
                action = oop.tryOnce('singAndDance', target);
                expect(action).to.be.undefined;
            });
            it('only invokes action on a target if it has not been done before by tryOnce', function() {
                expected = ['didDoSomething'];
                actual = [];

                oop.tryOnce('doSomething', target, [actual]);
                oop.tryOnce('doSomething', target, [actual]);

                expect(actual).to.deep.equal(expected);
            });

            it('will invoke the same action on different targets', function() {
                expected = ['didDoSomething', 'didDoSomethingOnObj2'];
                actual = [];

                oop.tryOnce('doSomething', target, [actual]);
                oop.tryOnce('doSomething', anotherTarget, [actual]);

                expect(actual).to.deep.equal(expected);
            });
        });

        describe('forgetTryHistory', function() {
            it('fails silently if the target does not exist', function() {
                var target = undefined;
                var actual = 'something';
                actual = oop.forgetTryHistory(target);
                expect(actual).to.be.undefined;
            });
            
            it('fails silently if there is no "try history"', function() {
                var target = {};
                var actual = 'something';
                actual = oop.forgetTryHistory(target);
                expect(actual).to.be.undefined;
            });
            
            it('clears the invoke history on a target so that tryOnce can fire a previously fired action again', function() {
                var target = {
                    doSomething: function(arr, index) {
                        arr.push(['didDoSomething', index]);
                    }
                };
                
                expected = [['didDoSomething', 0],
                            ['didDoSomething', 2]];
                actual = [];

                oop.tryOnce('doSomething', target, [actual, 0]);
                oop.tryOnce('doSomething', target, [actual, 1]);
                oop.forgetTryHistory(target);
                oop.tryOnce('doSomething', target, [actual, 2]);

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

