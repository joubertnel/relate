# TOC
   - [main](#main)
     - [CoreObject](#main-coreobject)
       - [the constructor](#main-coreobject-the-constructor)
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
var o = new oop.CoreObject;
expect(o).to.be.instanceof(oop.CoreObject);
```

can accept a map of initial key/values that get set on the instance.

```js
var technology = 'JavaScript';
var domain = 'Everywhere';
var expected = [technology, domain];
var o = new oop.CoreObject({
    technology: technology,
    domain: domain
});
var actual = [o.technology, o.domain];
expect(actual).to.deep.equal(expected);
```

<a name="main-derive"></a>
## derive
sets up a prototypal chain between parent and child.

```js
oop.derive(Parent, Child);
expect(Child.prototype).to.be.an.instanceof(Parent);
expect(Child.prototype.constructor).to.equal(Child);
```

adds methods to the child that can invoke methods on the parent (i.e. super functionality).

```js
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
```

adds properties to the child.

```js
var child;
oop.derive(Parent, Child, {
    'invokePattern': 'async'
});

child = new Child;
expect(child.invokePattern).to.equal('async');
```

