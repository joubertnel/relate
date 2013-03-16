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

can accept a map of initial property values.

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

adds a parent property that can be used to refer to the parent (for calling "super" methods).

```js
oop.derive(Parent, Child);
expect(Child.prototype.parent).to.equal(Parent.prototype);
```

adds properties with values to the child prototype.

```js
var child;
oop.derive(Parent, Child, {
    language: 'JavaScript'
});

child = new Child();
expect(child.language).to.equal('JavaScript');
```

adds methods to the child (prototype).

```js
var child;
oop.derive(Parent, Child, {
    grow: function() { return 'didGrow'; }
});

child = new Child;
expect(child.grow()).to.equal('didGrow');
```

