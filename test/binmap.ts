'use strict';

import 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import 'source-map-support/register'

import BinMap, { BetweenOptions } from '../'

const strings: Array< [ string, string ] > =
	[ [ 'e', 'f' ], [ 'a', 'b' ], [ 'c', 'd' ] ];

const invertedCmp = ( a: string, b: string ) => b.localeCompare( a );

describe( 'basics', ( ) =>
{
	it( 'empty', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );

		const arr = Array.from( bm );
		expect( arr.length ).to.equal( 0 );

		// Tests the [Symbol.iterator] on empty sets
		Array.from( bm.entries( ) );
	} );

	it( 'empty then add', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		bm.set( 1, 2 );

		expect( bm.size ).to.equal( 1 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 1 );

		const arr = Array.from( bm );
		expect( arr.length ).to.equal( 1 );

		// Tests the [Symbol.iterator] on non-empty sets
		Array.from( bm.entries( ) );
	} );

	it( 'single element', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ 1, 2 ] ] );

		expect( bm.size ).to.equal( 1 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 1 );
		expect( spy.args[ 0 ] ).to.deep.equal( [ 2, 1, bm ] );

		const arr = Array.from( bm );
		expect( arr.length ).to.equal( 1 );

		// Tests the [Symbol.iterator] on non-empty sets
		Array.from( bm.entries( ) );
	} );

	it( 'numbers', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ 5, 6 ], [ 1, 2 ], [ 3, 4 ] ] );

		expect( bm.size ).to.equal( 3 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 3 );
		expect( spy.args ).to.deep.equal( [
			[ 2, 1, bm ],
			[ 4, 3, bm ],
			[ 6, 5, bm ],
		] );

		const arr = Array.from( bm );
		expect( arr.length ).to.equal( 3 );
	} );

	it( 'string', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		expect( bm.size ).to.equal( 3 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 3 );
		expect( spy.args ).to.deep.equal( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'convert from Map', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( new Map< string, string >( strings ) );

		expect( bm.size ).to.equal( 3 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 3 );
		expect( spy.args ).to.deep.equal( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'convert to Map', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		const map = new Map( bm );

		expect( map.size ).to.equal( 3 );

		map.forEach( spy );
		expect( spy.callCount ).to.equal( 3 );
		expect( spy.args ).to.deep.equal( [
			[ "b", "a", map ],
			[ "d", "c", map ],
			[ "f", "e", map ],
		] );
	} );

	it( 'insert before all', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		bm.set( "@", "g" );

		expect( bm.size ).to.equal( 4 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 4 );
		expect( spy.args ).to.deep.equal( [
			[ "g", "@", bm ],
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'insert after all', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		bm.set( "g", "h" );

		expect( bm.size ).to.equal( 4 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 4 );
		expect( spy.args ).to.deep.equal( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
			[ "h", "g", bm ],
		] );
	} );

	it( 'insert in the middle', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		bm.set( "cc", "dd" );

		expect( bm.size ).to.equal( 4 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 4 );
		expect( spy.args ).to.deep.equal( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "dd", "cc", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'create empty with custom comparator', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( { cmp: invertedCmp } );

		bm.set( "a", "b" );
		bm.set( "c", "d" );

		expect( bm.size ).to.equal( 2 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 2 );
		expect( spy.args ).to.deep.equal( [
			[ "d", "c", bm ],
			[ "b", "a", bm ],
		] );
	} );

	it( 'create non-empty with custom comparator', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap(
			[ [ "a", "b" ], [ "c", "d" ] ],
			{ cmp: invertedCmp }
		);

		expect( bm.size ).to.equal( 2 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 2 );
		expect( spy.args ).to.deep.equal( [
			[ "d", "c", bm ],
			[ "b", "a", bm ],
		] );
	} );

	it( 'delete non-existing element', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		expect( bm.delete( "x" ) ).to.be.false;

		expect( bm.size ).to.equal( 2 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 2 );
		expect( spy.args ).to.deep.equal( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
		] );
	} );

	it( 'delete only element', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );
		expect( spy.args ).to.deep.equal( [ ] );
	} );

	it( 'delete an element', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( bm.size ).to.equal( 1 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 1 );
		expect( spy.args ).to.deep.equal( [
			[ "d", "c", bm ],
		] );
	} );

	it( 'delete uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( bm.delete( "a" ) ).to.be.false;

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );
		expect( spy.args ).to.deep.equal( [ ] );
	} );

	it( 'clear', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		bm.clear( );

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );
		expect( spy.args ).to.deep.equal( [ ] );
	} );

	it( 'double clear', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		bm.clear( );
		bm.clear( );

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );
		expect( spy.args ).to.deep.equal( [ ] );
	} );

	it( 'clear uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		bm.clear( );

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );
		expect( spy.args ).to.deep.equal( [ ] );
	} );

	it( 'clear empty', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		bm.clear( );

		expect( bm.size ).to.equal( 0 );

		bm.forEach( spy );
		expect( spy.callCount ).to.equal( 0 );
		expect( spy.args ).to.deep.equal( [ ] );
	} );

	it( 'get uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( bm.get( "a" ) ).to.be.undefined;
	} );

	it( 'get deleted', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( bm.get( "a" ) ).to.be.undefined;
	} );

	it( 'get never inserted', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.get( "x" ) ).to.be.undefined;
	} );

	it( 'get existing', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.get( "a" ) ).to.equal( "b" );
	} );

	it( 'has uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( bm.has( "a" ) ).to.be.false;
	} );

	it( 'has deleted', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( bm.has( "a" ) ).to.be.false;
	} );

	it( 'has never inserted', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.has( "x" ) ).to.be.false;
	} );

	it( 'has existing', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.has( "a" ) ).to.be.true;
	} );

	it( 'keys uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( Array.from( bm.keys( ) ) ).to.be.empty;
	} );

	it( 'keys empty', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( Array.from( bm.keys( ) ) ).to.be.empty;
	} );

	it( 'keys one', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.keys( ) ) ).to.deep.equal( [ "a" ] );
	} );

	it( 'keys multiple', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		expect( Array.from( bm.keys( ) ) ).to.deep.equal( [ "a", "c", "e" ] );
	} );

	it( 'values uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( Array.from( bm.values( ) ) ).to.be.empty;
	} );

	it( 'values empty', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( Array.from( bm.values( ) ) ).to.be.empty;
	} );

	it( 'values one', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.values( ) ) ).to.deep.equal( [ "b" ] );
	} );

	it( 'values multiple', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		expect( Array.from( bm.values( ) ) ).to.deep.equal( [ "b", "d", "f" ] );
	} );

	it( 'entries uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( Array.from( bm.entries( ) ) ).to.be.empty;
	} );

	it( 'entries empty', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).to.be.true;

		expect( Array.from( bm.entries( ) ) ).to.be.empty;
	} );

	it( 'entries one', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.entries( ) ) ).to.deep.equal( [ [ "a", "b" ] ] );
	} );

	it( 'entries multiple', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		expect( Array.from( bm.entries( ) ) ).to.deep
			.equal( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] );
	} );

	it( 'between uninitialized', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( );

		expect( Array.from( bm.between( ) ) ).to.deep.equal( [ ] );
	} );

	it( 'between empty', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		bm.clear( );

		expect( Array.from( bm.between( ) ) ).to.deep.equal( [ ] );
	} );

	it( 'between single all', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.between( ) ) ).to.deep
			.equal( [ [ "a", "b" ] ] );
	} );

	it( 'between single all reverse', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.between( { reverse: true } ) ) ).to.deep
			.equal( [ [ "a", "b" ] ] );
	} );

	function betweens(
		{ reverse, reverseCmp, expectReverse }
		: { reverse: boolean; reverseCmp: boolean; expectReverse: boolean; }
	)
	{
		const cmp = reverseCmp ? invertedCmp : null;

		function invertMinMax< T >( val: T | symbol ): T | symbol
		{
			return val === BinMap.min
				? BinMap.max
				: val === BinMap.max
				? BinMap.min
				: val;
		}

		function applyOpts( opts: Partial< BetweenOptions< string > > )
		: typeof opts
		{
			const out: Partial< BetweenOptions< string > > = { reverse };

			if ( reverseCmp )
			{
				if ( opts.hasOwnProperty( 'ge' ) )
					out.le = invertMinMax( opts.ge );
				if ( opts.hasOwnProperty( 'gt' ) )
					out.lt = invertMinMax( opts.gt );
				if ( opts.hasOwnProperty( 'le' ) )
					out.ge = invertMinMax( opts.le );
				if ( opts.hasOwnProperty( 'lt' ) )
					out.gt = invertMinMax( opts.lt );
			}
			else
			{
				if ( opts.hasOwnProperty( 'ge' ) )
					out.ge = opts.ge;
				if ( opts.hasOwnProperty( 'gt' ) )
					out.gt = opts.gt;
				if ( opts.hasOwnProperty( 'le' ) )
					out.le = opts.le;
				if ( opts.hasOwnProperty( 'lt' ) )
					out.lt = opts.lt;
			}

			return out;
		}

		function maybeReverse( arr: Array< any > )
		{
			return expectReverse ? [ ...arr ].reverse( ) : arr;
		}

		describe( `reverse=${reverse} reverseCmp=${reverseCmp}`, ( ) =>
		{

		it( 'between ge-exact le-exact', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", le: "e" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between {min} le-exact', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: BinMap.min, le: "e" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge-exact {max}', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", le: BinMap.max } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge le-exact', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "b", le: "e" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge-exact le', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", le: "d" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ] ] )
			);
		} );

		it( 'between ge le', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "b", le: "d" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "c", "d" ] ] )
			);
		} );

		it( 'between gt-exact le-exact', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "a", le: "e" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge-exact lt-exact', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", lt: "e" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ] ] )
			);
		} );

		it( 'between gt-exact lt-exact', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "a", lt: "e" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "c", "d" ] ] )
			);
		} );

		it( 'between gt lt', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "b", lt: "d" } )
			) ) ).to.deep.equal(
				maybeReverse( [ [ "c", "d" ] ] )
			);
		} );

		it( 'between lt too low', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "!", lt: "@" } )
			) ) ).to.deep.equal(
				maybeReverse( [ ] )
			);
		} );

		it( 'between lt too low', ( ) =>
		{
			const spy = sinon.spy( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "x", lt: "y" } )
			) ) ).to.deep.equal(
				maybeReverse( [ ] )
			);
		} );

		} );
	}

	betweens( { reverse: false, reverseCmp: false, expectReverse: false } );
	betweens( { reverse: false, reverseCmp: true, expectReverse: true } );
	betweens( { reverse: true, reverseCmp: false, expectReverse: true } );
	betweens( { reverse: true, reverseCmp: true, expectReverse: false } );

	it( 'between le and lt', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		const thrower = ( ) =>
			bm.between( < any >{ le: "x", lt: "y" } );

		expect( thrower ).to.throw( "both" );
	} );

	it( 'between ge and gt', ( ) =>
	{
		const spy = sinon.spy( );
		const bm = new BinMap( strings );

		const thrower = ( ) =>
			bm.between( < any >{ ge: "x", gt: "y" } );

		expect( thrower ).to.throw( "both" );
	} );
} );
