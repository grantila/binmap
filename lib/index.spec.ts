'use strict';

import BinMap, { BetweenOptions } from './index'

const strings: Array< [ string, string ] > =
	[ [ 'e', 'f' ], [ 'a', 'b' ], [ 'c', 'd' ] ];

const invertedCmp = ( a: string, b: string ) => b.localeCompare( a );

describe( 'basics', ( ) =>
{
	it( 'empty', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );

		const arr = Array.from( bm );
		expect( arr.length ).toEqual( 0 );

		// Tests the [Symbol.iterator] on empty sets
		Array.from( bm.entries( ) );
	} );

	it( 'empty then add', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		bm.set( 1, 2 );

		expect( bm.size ).toEqual( 1 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 1 );

		const arr = Array.from( bm );
		expect( arr.length ).toEqual( 1 );

		// Tests the [Symbol.iterator] on non-empty sets
		Array.from( bm.entries( ) );
	} );

	it( 'single element', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ 1, 2 ] ] );

		expect( bm.size ).toEqual( 1 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 1 );
		expect( spy.mock.calls[ 0 ] ).toEqual( [ 2, 1, bm ] );

		const arr = Array.from( bm );
		expect( arr.length ).toEqual( 1 );

		// Tests the [Symbol.iterator] on non-empty sets
		Array.from( bm.entries( ) );
	} );

	it( 'numbers', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ 5, 6 ], [ 1, 2 ], [ 3, 4 ] ] );

		expect( bm.size ).toEqual( 3 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 3 );
		expect( spy.mock.calls ).toEqual( [
			[ 2, 1, bm ],
			[ 4, 3, bm ],
			[ 6, 5, bm ],
		] );

		const arr = Array.from( bm );
		expect( arr.length ).toEqual( 3 );
	} );

	it( 'string', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		expect( bm.size ).toEqual( 3 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 3 );
		expect( spy.mock.calls ).toEqual( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'convert from Map', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( new Map< string, string >( strings ) );

		expect( bm.size ).toEqual( 3 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 3 );
		expect( spy.mock.calls ).toEqual( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'convert to Map', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		const map = new Map( bm );

		expect( map.size ).toEqual( 3 );

		map.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 3 );
		expect( spy.mock.calls ).toEqual( [
			[ "b", "a", map ],
			[ "d", "c", map ],
			[ "f", "e", map ],
		] );
	} );

	it( 'insert before all', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		bm.set( "@", "g" );

		expect( bm.size ).toEqual( 4 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 4 );
		expect( spy.mock.calls ).toEqual( [
			[ "g", "@", bm ],
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'insert after all', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		bm.set( "g", "h" );

		expect( bm.size ).toEqual( 4 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 4 );
		expect( spy.mock.calls ).toEqual( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "f", "e", bm ],
			[ "h", "g", bm ],
		] );
	} );

	it( 'insert in the middle', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		bm.set( "cc", "dd" );

		expect( bm.size ).toEqual( 4 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 4 );
		expect( spy.mock.calls ).toEqual( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
			[ "dd", "cc", bm ],
			[ "f", "e", bm ],
		] );
	} );

	it( 'create empty with custom comparator', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( { cmp: invertedCmp } );

		bm.set( "a", "b" );
		bm.set( "c", "d" );

		expect( bm.size ).toEqual( 2 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 2 );
		expect( spy.mock.calls ).toEqual( [
			[ "d", "c", bm ],
			[ "b", "a", bm ],
		] );
	} );

	it( 'create non-empty with custom comparator', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap(
			[ [ "a", "b" ], [ "c", "d" ] ],
			{ cmp: invertedCmp }
		);

		expect( bm.size ).toEqual( 2 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 2 );
		expect( spy.mock.calls ).toEqual( [
			[ "d", "c", bm ],
			[ "b", "a", bm ],
		] );
	} );

	it( 'delete non-existing element', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		expect( bm.delete( "x" ) ).toEqual( false );

		expect( bm.size ).toEqual( 2 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 2 );
		expect( spy.mock.calls ).toEqual( [
			[ "b", "a", bm ],
			[ "d", "c", bm ],
		] );
	} );

	it( 'delete only element', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );
		expect( spy.mock.calls ).toEqual( [ ] );
	} );

	it( 'delete an element', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( bm.size ).toEqual( 1 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 1 );
		expect( spy.mock.calls ).toEqual( [
			[ "d", "c", bm ],
		] );
	} );

	it( 'delete uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( bm.delete( "a" ) ).toEqual( false );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );
		expect( spy.mock.calls ).toEqual( [ ] );
	} );

	it( 'clear', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		bm.clear( );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );
		expect( spy.mock.calls ).toEqual( [ ] );
	} );

	it( 'double clear', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ], [ "c", "d" ] ] );

		bm.clear( );
		bm.clear( );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );
		expect( spy.mock.calls ).toEqual( [ ] );
	} );

	it( 'clear uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		bm.clear( );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );
		expect( spy.mock.calls ).toEqual( [ ] );
	} );

	it( 'clear empty', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		bm.clear( );

		expect( bm.size ).toEqual( 0 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 0 );
		expect( spy.mock.calls ).toEqual( [ ] );
	} );

	it( 'get uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( bm.get( "a" ) ).toBeUndefined( );
	} );

	it( 'get deleted', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( bm.get( "a" ) ).toBeUndefined( );
	} );

	it( 'get never inserted', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.get( "x" ) ).toBeUndefined( );
	} );

	it( 'get existing', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.get( "a" ) ).toEqual( "b" );
	} );

	it( 'has uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( bm.has( "a" ) ).toEqual( false );
	} );

	it( 'has deleted', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( bm.has( "a" ) ).toEqual( false );
	} );

	it( 'has never inserted', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.has( "x" ) ).toEqual( false );
	} );

	it( 'has existing', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.has( "a" ) ).toEqual( true );
	} );

	it( 'keys uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( Array.from( bm.keys( ) ) ).toHaveLength( 0 );
	} );

	it( 'keys empty', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( Array.from( bm.keys( ) ) ).toHaveLength( 0 );
	} );

	it( 'keys one', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.keys( ) ) ).toEqual( [ "a" ] );
	} );

	it( 'keys multiple', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		expect( Array.from( bm.keys( ) ) ).toEqual( [ "a", "c", "e" ] );
	} );

	it( 'values uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( Array.from( bm.values( ) ) ).toHaveLength( 0 );
	} );

	it( 'values empty', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( Array.from( bm.values( ) ) ).toHaveLength( 0 );
	} );

	it( 'values one', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.values( ) ) ).toEqual( [ "b" ] );
	} );

	it( 'values multiple', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		expect( Array.from( bm.values( ) ) ).toEqual( [ "b", "d", "f" ] );
	} );

	it( 'entries uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( Array.from( bm.entries( ) ) ).toHaveLength( 0 );
	} );

	it( 'entries empty', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( bm.delete( "a" ) ).toEqual( true );

		expect( Array.from( bm.entries( ) ) ).toHaveLength( 0 );
	} );

	it( 'entries one', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.entries( ) ) ).toEqual( [ [ "a", "b" ] ] );
	} );

	it( 'entries multiple', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		expect( Array.from( bm.entries( ) ) )
			.toEqual( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] );
	} );

	it( 'between uninitialized', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( );

		expect( Array.from( bm.between( ) ) ).toEqual( [ ] );
	} );

	it( 'between empty', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		bm.clear( );

		expect( Array.from( bm.between( ) ) ).toEqual( [ ] );
	} );

	it( 'between single all', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.between( ) ) )
			.toEqual( [ [ "a", "b" ] ] );
	} );

	it( 'between single all reverse', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( [ [ "a", "b" ] ] );

		expect( Array.from( bm.between( { reverse: true } ) ) )
			.toEqual( [ [ "a", "b" ] ] );
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
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", le: "e" } )
			) ) ).toEqual(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between {min} le-exact', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: BinMap.min, le: "e" } )
			) ) ).toEqual(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge-exact {max}', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", le: BinMap.max } )
			) ) ).toEqual(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge le-exact', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "b", le: "e" } )
			) ) ).toEqual(
				maybeReverse( [ [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge-exact le', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", le: "d" } )
			) ) ).toEqual(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ] ] )
			);
		} );

		it( 'between ge le', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "b", le: "d" } )
			) ) ).toEqual(
				maybeReverse( [ [ "c", "d" ] ] )
			);
		} );

		it( 'between gt-exact le-exact', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "a", le: "e" } )
			) ) ).toEqual(
				maybeReverse( [ [ "c", "d" ], [ "e", "f" ] ] )
			);
		} );

		it( 'between ge-exact lt-exact', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { ge: "a", lt: "e" } )
			) ) ).toEqual(
				maybeReverse( [ [ "a", "b" ], [ "c", "d" ] ] )
			);
		} );

		it( 'between gt-exact lt-exact', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "a", lt: "e" } )
			) ) ).toEqual(
				maybeReverse( [ [ "c", "d" ] ] )
			);
		} );

		it( 'between gt lt', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "b", lt: "d" } )
			) ) ).toEqual(
				maybeReverse( [ [ "c", "d" ] ] )
			);
		} );

		it( 'between lt too low', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "!", lt: "@" } )
			) ) ).toEqual(
				maybeReverse( [ ] )
			);
		} );

		it( 'between lt too low', ( ) =>
		{
			const spy = jest.fn( );
			const bm = new BinMap( strings, { cmp } );

			expect( Array.from( bm.between(
				applyOpts( { gt: "x", lt: "y" } )
			) ) ).toEqual(
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
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		const thrower = ( ) =>
			bm.between( < any >{ le: "x", lt: "y" } );

		expect( thrower ).toThrow( "both" );
	} );

	it( 'between ge and gt', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap( strings );

		const thrower = ( ) =>
			bm.between( < any >{ ge: "x", gt: "y" } );

		expect( thrower ).toThrow( "both" );
	} );
} );

describe( 'types', ( ) =>
{
	it( 'date', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap< Date, number >( );

		const dates: Array< [ number, Date ] > = [
			[ 1, new Date( "2018-01-01T00:01:00Z" ) ],
			[ 2, new Date( "2018-01-02T00:01:00Z" ) ],
			[ 3, new Date( "2018-01-03T00:01:00Z" ) ],
			[ 4, new Date( "2018-01-04T00:01:00Z" ) ],
		];
		const datesKeyVal = dates.map( arr => [ ...arr ].reverse( ) );

		bm.set( dates[ 2 ][ 1 ], dates[ 2 ][ 0 ] );
		bm.set( dates[ 1 ][ 1 ], dates[ 1 ][ 0 ] );
		bm.set( dates[ 0 ][ 1 ], dates[ 0 ][ 0 ] );
		bm.set( dates[ 3 ][ 1 ], dates[ 3 ][ 0 ] );

		expect( bm.size ).toEqual( 4 );

		bm.forEach( spy );
		expect( spy.mock.calls.length ).toEqual( 4 );
		expect( spy.mock.calls ).toEqual( [
			[ ...dates[ 0 ], bm ],
			[ ...dates[ 1 ], bm ],
			[ ...dates[ 2 ], bm ],
			[ ...dates[ 3 ], bm ],
		] );

		const future = new Date( );
		expect( Array.from( bm.between( { le: future } ) ) )
			.toEqual( datesKeyVal );
		expect( Array.from( bm.between( { le: future, reverse: true } ) ) )
			.toEqual( [ ...datesKeyVal ].reverse( ) );

		const past = new Date( "2017-10-01T00:01:00Z" );
		expect( Array.from( bm.between( { ge: past } ) ) )
			.toEqual( datesKeyVal );
		expect( Array.from( bm.between( { ge: past, reverse: true } ) ) )
			.toEqual( [ ...datesKeyVal ].reverse( ) );
	} );

	it( 'undefined', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap< Date, number >( );

		bm.set( new Date( "2018-01-01T00:01:00Z" ), 0 );

		const throwerUndefined = ( ) =>
			bm.set( undefined, 2 );

		const throwerNull = ( ) =>
			bm.set( null, 2 );

		expect( throwerUndefined ).toThrow( /Cannot set.*as key/ );
		expect( throwerNull ).toThrow( /Cannot set.*as key/ );
	} );

	it( 'multi types', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap< Date, number >( );

		bm.set( new Date( "2018-01-01T00:01:00Z" ), 0 );

		// Invalid type
		const thrower = ( ) =>
			bm.set( < any >"foo", 1 );

		expect( thrower ).toThrow( "mis-matching" );
	} );

	it( 'invalid type', ( ) =>
	{
		const spy = jest.fn( );
		const bm = new BinMap< { foo: number; }, number >( );

		// Invalid type
		const thrower = ( ) =>
			bm.set( { foo: 0 }, 0 );

		expect( thrower ).toThrow( "Cannot set key of type object" );
	} );

	it( 'custom type', ( ) =>
	{
		type Foo = { foo: number; };
		const spy = jest.fn( );
		const cmp = ( a: Foo, b: Foo ) => a.foo - b.foo;
		const bm = new BinMap< Foo, number >( { cmp } );

		bm.set( { foo: 0 }, 0 );
		bm.set( { foo: 2 }, 2 );
		bm.set( { foo: 1 }, 1 );

		expect( Array.from( bm.between( ) ) )
		.toEqual( [
			[ { foo: 0 }, 0 ],
			[ { foo: 1 }, 1 ],
			[ { foo: 2 }, 2 ],
		] );

		expect( Array.from( bm.between( { reverse: true } ) ) )
		.toEqual( [
			[ { foo: 2 }, 2 ],
			[ { foo: 1 }, 1 ],
			[ { foo: 0 }, 0 ],
		] );
	} );
} );
