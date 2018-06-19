[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][coverage-image]][coverage-url]
[![greenkeeper badge][greenkeeper-image]][greenkeeper-url]

# binmap

`binmap` is a `Map` implementation compatible to the [Built-in Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) but guaranteeing the keys to be ordered.

The constructor has an optional options object and the class has a member function `between` for iterating between two boundary keys.

`BinMap` instances are convertible to and from built-in Maps and Arrays (of sub-arrays).


# Functions

  * [Constructor](#constructor)
  * [between](#between)


## Constructor

The constructor works like the built-in Map in that it can optionally take an iterable of key-value pairs (as individual arrays), but can also have an extra optional options object which can contain a comparison function `cmp` with the same semantics as the custom [`sort` comparator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

```ts
import BinMap from 'binmap'

// Custom comparator
const cmp = ( a, b ) => a.length - b.length;

const bm1 = new BinMap( { cmp } );
// or
const bm2 = new BinMap( [ [ 'key1', 'value1' ], ... ], { cmp } );
```


## betwen

`between( { ... } )` returns an IterableIterator between two boundary keys. The options object can contain:
 - **Either** an `lt` (less than) **or** an `le` (less than or equal to).
 - **Either** a `gt` (greater than) **or** a `ge` (greater than or equal to).
 - `reverse` being a boolean (defaults to false), which returns an iterator from the end to the beginning of the span.

There are two magic values for `lt`, `le`, `gt` and `ge` which is `BinMap.min` and `BinMap.max` which represents the lowest/highest possible values. These are also the default, so an empty `between( { } )` (or just `between( )`) iteraters the whole map.

```ts
import BinMap from 'binmap'

const bm = new BinMap( [
    [ "a", 1 ],
    [ "b", 2 ],
    [ "c", 3 ],
    [ "d", 4 ],
] );

Array.from( bm.between( { gt: 'b' } ) )
// -> [ [ "c", 3 ], [ "d", 4 ] ]

Array.from( bm.between( { gt: 'b', reverse: true } ) )
// -> [ [ "d", 4 ], [ "c", 3 ] ]
```


[npm-image]: https://img.shields.io/npm/v/binmap.svg
[npm-url]: https://npmjs.org/package/binmap
[travis-image]: https://img.shields.io/travis/grantila/binmap.svg
[travis-url]: https://travis-ci.org/grantila/binmap
[coverage-image]: https://coveralls.io/repos/github/grantila/binmap/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/binmap?branch=master
[greenkeeper-image]: https://badges.greenkeeper.io/grantila/binmap.svg
[greenkeeper-url]: https://greenkeeper.io/
