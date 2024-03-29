/*globals require, describe, it, expect, before, beforeEach, afterEach */


var rel = require('../lib/main');
var expect = require('chai').expect;


describe('main', function() {

    var actual, expected;
    var obj;

    describe('CoreObject', function() {

        describe('the constructor', function() {
            it('creates an instance of CoreObject', function() {
                obj = new rel.CoreObject;
                expect(obj).to.be.instanceof(rel.CoreObject);
            });

            it('can accept a map of initial key/values that get set on the instance', function() {
                var technology = 'JavaScript';
                var domain = 'Everywhere';
                obj = new rel.CoreObject({
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
                actual = rel.try('singAndDance', target);
                expect(actual).to.be.undefined;
            });
            
            it('invokes an action if an only if a method by that name exists on the target', function() {
                expected = ['didDoSomething'];
                actual = [];

                rel.try('doSomething', target, [actual]);

                expect(actual).to.deep.equal(expected);
            });
        });

        describe('tryOnce', function() {
            it('fails silently if the target does not exist', function() {
                var target = undefined;
                var action = 'something';
                action = rel.tryOnce('singAndDance', target);
                expect(action).to.be.undefined;
            });
            it('only invokes action on a target if it has not been done before by tryOnce', function() {
                expected = ['didDoSomething'];
                actual = [];

                rel.tryOnce('doSomething', target, [actual]);
                rel.tryOnce('doSomething', target, [actual]);

                expect(actual).to.deep.equal(expected);
            });

            it('will invoke the same action on different targets', function() {
                expected = ['didDoSomething', 'didDoSomethingOnObj2'];
                actual = [];

                rel.tryOnce('doSomething', target, [actual]);
                rel.tryOnce('doSomething', anotherTarget, [actual]);

                expect(actual).to.deep.equal(expected);
            });
        });

        describe('forgetTryHistory', function() {
            it('fails silently if the target does not exist', function() {
                var target = undefined;
                var actual = 'something';
                actual = rel.forgetTryHistory(target);
                expect(actual).to.be.undefined;
            });
            
            it('fails silently if there is no "try history"', function() {
                var target = {};
                var actual = 'something';
                actual = rel.forgetTryHistory(target);
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

                rel.tryOnce('doSomething', target, [actual, 0]);
                rel.tryOnce('doSomething', target, [actual, 1]);
                rel.forgetTryHistory(target);
                rel.tryOnce('doSomething', target, [actual, 2]);

                expect(actual).to.deep.equal(expected);
            });
        });

    });


    describe('derive', function() {
        var Parent, Child;
        var GrandParent;

        beforeEach(function() {
            GrandParent = function() {};
            Parent = function() {};
            Child = function() {};
        });
        
        it('sets up a prototypal chain between parent and child', function() {
            rel.derive(Parent, Child);
            expect(Child.prototype).to.be.an.instanceof(Parent);
            expect(Child.prototype.constructor).to.equal(Child);
        });

        it('enables invocation of the constructor of parent', function() {
            var expected = { didInvokeParentConstructor: true,
                             didInvokeChildConstructor: true,
                             cRef: 'C',
                             c2Ref: 'C2',
                             pRef: 'P',
                             p2Ref: 'P2'};
            var actual;
            var c, c2;
            var p, p2;
            
            var P = function(ref) {
                this.ref = ref;
                this.didInvokeParentConstructor = true;
            };

            var C = function(ref) {
                C._super.constructor.call(this, ref);
                this.didInvokeChildConstructor = true;
            };

            rel.derive(P, C);

            p = new P('P');
            c = new C('C');
            p2 = new P('P2');
            c2 = new C('C2');
                             
            
            actual = { didInvokeParentConstructor: c.didInvokeParentConstructor,
                       didInvokeChildConstructor: c.didInvokeChildConstructor,
                       cRef: c.ref,
                       c2Ref: c2.ref,
                       pRef: p.ref,
                       p2Ref: p2.ref };

            expect(actual).to.deep.equal(expected);
        });

        it('adds methods to the child that can invoke methods on the parent (i.e. super functionality)', function() {
            var c, p, g, c2, c3;

            var actual;
            var expected = { child: 'Child',
                             child2: 'Child2',
                             parent: 'Parent',
                             grandParent: 'GrandParent',

                             childDidInvokeOnGrandParent: true,
                             childDidInvokeOnParent: true,
                             childDidInvokeOnChild: true,

                             child3DidInvokeOnGrandParent: undefined };

            
            GrandParent.prototype.grow = function(ref) {
                this.ref = ref;
                this.didInvokeOnGrandParent = true;
            };

            rel.derive(GrandParent, Parent, {
                grow: function(ref) {
                    Parent._super.grow.call(this, ref);
                    this.didInvokeOnParent = true;
                }
            });
            
            rel.derive(Parent, Child, {
                grow: function(ref) {
                    Child._super.grow.call(this, ref);
                    this.didInvokeOnChild = true;
                }
            });

            c = new Child;
            c.grow('Child');

            p = new Parent;
            p.grow('Parent');

            c2 = new Child;
            c2.grow('Child2');

            g = new GrandParent;
            g.grow('GrandParent');

            c3 = new Child;

            actual = { child: c.ref,
                       child2: c2.ref,
                       parent: p.ref,
                       grandParent: g.ref,

                       childDidInvokeOnGrandParent: c.didInvokeOnGrandParent,
                       childDidInvokeOnParent: c.didInvokeOnParent,
                       childDidInvokeOnChild: c.didInvokeOnChild,

                       child3DidInvokeOnGrandParent: c3.didInvokeOnGrandParent
                     };

            expect(actual).to.deep.equal(expected);
        });


        it('adds properties to the child', function() {
            var child;
            rel.derive(Parent, Child, {
                'invokePattern': 'async'
            });

            child = new Child;
            expect(child.invokePattern).to.equal('async');            
        });
    });
    
});

