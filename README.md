# TOC
   - [main](#main)
     - [CoreObject](#main-coreobject)
       - [the constructor](#main-coreobject-the-constructor)
     - [target/action (safe method invocation)](#main-targetaction-safe-method-invocation)
       - [try](#main-targetaction-safe-method-invocation-try)
       - [tryOnce](#main-targetaction-safe-method-invocation-tryonce)
       - [forgetTryHistory](#main-targetaction-safe-method-invocation-forgettryhistory)
     - [derive](#main-derive)
<a name=""></a>
 
<a name="main"></a>
# main
<a name="main-coreobject"></a>
## CoreObject
<a name="main-coreobject-the-constructor"></a>
### the constructor
creates an instance of CoreObject.

```js
obj = new rel.CoreObject;
expect(obj).to.be.instanceof(rel.CoreObject);
```

can accept a map of initial key/values that get set on the instance.

```js
var technology = 'JavaScript';
var domain = 'Everywhere';
obj = new rel.CoreObject({
    technology: technology,
    domain: domain
});

expected = [technology, domain];
actual = [obj.technology, obj.domain];

expect(actual).to.deep.equal(expected);
```

<a name="main-targetaction-safe-method-invocation"></a>
## target/action (safe method invocation)
<a name="main-targetaction-safe-method-invocation-try"></a>
### try
fails silently if the the target does not exist.

```js
var target = undefined;
var actual = 'something';
actual = rel.try('singAndDance', target);
expect(actual).to.be.undefined;
```

invokes an action if an only if a method by that name exists on the target.

```js
expected = ['didDoSomething'];
actual = [];

rel.try('doSomething', target, [actual]);

expect(actual).to.deep.equal(expected);
```

<a name="main-targetaction-safe-method-invocation-tryonce"></a>
### tryOnce
fails silently if the target does not exist.

```js
var target = undefined;
var action = 'something';
action = rel.tryOnce('singAndDance', target);
expect(action).to.be.undefined;
```

only invokes action on a target if it has not been done before by tryOnce.

```js
expected = ['didDoSomething'];
actual = [];

rel.tryOnce('doSomething', target, [actual]);
rel.tryOnce('doSomething', target, [actual]);

expect(actual).to.deep.equal(expected);
```

will invoke the same action on different targets.

```js
expected = ['didDoSomething', 'didDoSomethingOnObj2'];
actual = [];

rel.tryOnce('doSomething', target, [actual]);
rel.tryOnce('doSomething', anotherTarget, [actual]);

expect(actual).to.deep.equal(expected);
```

<a name="main-targetaction-safe-method-invocation-forgettryhistory"></a>
### forgetTryHistory
fails silently if the target does not exist.

```js
var target = undefined;
var actual = 'something';
actual = rel.forgetTryHistory(target);
expect(actual).to.be.undefined;
```

fails silently if there is no "try history".

```js
var target = {};
var actual = 'something';
actual = rel.forgetTryHistory(target);
expect(actual).to.be.undefined;
```

clears the invoke history on a target so that tryOnce can fire a previously fired action again.

```js
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
```

<a name="main-derive"></a>
## derive
sets up a prototypal chain between parent and child.

```js
rel.derive(Parent, Child);
expect(Child.prototype).to.be.an.instanceof(Parent);
expect(Child.prototype.constructor).to.equal(Child);
```

enables invocation of the constructor of parent.

```js
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
```

adds methods to the child that can invoke methods on the parent (i.e. super functionality).

```js
var c, p, g, c2;

var actual;
var expected = { child: 'Child',
                 child2: 'Child2',
                 parent: 'Parent',
                 grandParent: 'GrandParent' };

GrandParent.prototype.grow = function(ref) {
    this.ref = ref;
};

rel.derive(GrandParent, Parent, {
    grow: function(ref) {
        Parent._super.grow.call(this, ref);
    }
});

rel.derive(Parent, Child, {
    grow: function(ref) {
        Child._super.grow.call(this, ref);
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

actual = { child: c.ref,
           child2: c2.ref,
           parent: p.ref,
           grandParent: g.ref };

expect(actual).to.deep.equal(expected);
```

adds properties to the child.

```js
var child;
rel.derive(Parent, Child, {
    'invokePattern': 'async'
});

child = new Child;
expect(child.invokePattern).to.equal('async');
```

