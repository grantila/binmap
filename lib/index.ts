
import { RBTree, Iterator } from 'bintrees'


export interface Options< K, V >
{
	cmp: ( a: K, b: K ) => number;
}

interface Comparator
{
	cmp: ( a: any, b: any ) => number;
	sameType: ( val: any ) => boolean;
}

function valueOf( v: any )
{
	return ( v && ( typeof v[ 'valueOf' ] === 'function' ) )
		? v.valueOf( )
		: v;
}

const defaultComparators: { [ key: string ]: Comparator; } = {
	string: {
		cmp: ( a: string, b: string ) =>
			valueOf( a ).localeCompare( valueOf( b ) ),
		sameType: ( a: string ) =>
			typeof valueOf( a ) === 'string',
	},
	number: {
		cmp: ( a: number, b: number ) =>
			valueOf( a ) - valueOf( b ),
		sameType: ( val: number ) =>
			typeof valueOf( val ) === 'number',
	},
};

export type IteratorType< K, V > =
	[ K, V ];

export type ConstructorValues< K, V > =
	Array< IteratorType< K, V > > |
	Iterable< IteratorType< K, V > >;

// export type Iterator< ValueType > =
// 	{ next( ): { done: boolean; value?: ValueType; } };

export type IteratorEnd =
	{ done: true; value: any };

export type UnderlyingStorage< K, V > =
	RBTree< IteratorType< K, V > >;

function makeIterator< T >( next: ( value?: any ) => IteratorResult< T > )
: IterableIterator< T >
{
	const iterator = {
		next,
		[ Symbol.iterator ]( ) { return iterator },
	};

	return iterator;
}

const iteratorEnd: Readonly< IteratorEnd > =
	Object.freeze( { done: true, value: void 0 } ) as IteratorEnd;
const emptyIterator: IterableIterator< any > =
	makeIterator( ( ) => iteratorEnd );

export type LE< K > = { le: K | typeof BinMap.min; lt?: never; };
export type LT< K > = { lt: K | typeof BinMap.min; le?: never; };
export type GE< K > = { ge: K | typeof BinMap.max; gt?: never; };
export type GT< K > = { gt: K | typeof BinMap.max; ge?: never; };
export type BetweenOptions< K > =
	( LE< K > | LT< K > ) &
	( GE< K > | GT< K > ) &
	( { reverse?: boolean; } );

export default class BinMap< K, V > extends Map
{
	static [ Symbol.toStringTag ] = "BinMap";
	static min = Symbol( "min" );
	static max = Symbol( "max" );

	private _opts: Options< K, V > = {
		cmp: null,
	};

	private _data: UnderlyingStorage< K, V >;
	private _comparator: Comparator;

	constructor(
		values?: ConstructorValues< K, V >,
		opts?: Partial< Options< K, V > >
	);
	constructor( opts?: Partial< Options< K, V > > );

	constructor(
		values?: ConstructorValues< K, V > | Partial< Options< K, V > >,
		opts?: Partial< Options< K, V > >
	)
	{
		super( );

		if ( values )
		{
			if ( typeof values[ Symbol.iterator ] !== 'function' )
			{
				opts = < Partial< Options< K, V > > >values;
				values = null;
			}
		}

		if ( opts )
		{
			if ( typeof opts.cmp === 'function' )
				this._opts.cmp = opts.cmp;
		}

		if ( values )
			Array
			.from( < ConstructorValues< K, V > >values )
			.forEach( ( [ k, v ] ) => this.set( k, v ) );
	}

	private ensureComparator( val: any ): void
	{
		if ( this._data )
		{
			if ( !this._comparator.sameType( val ) )
				throw new Error( "Cannot set key of mis-matching type" );

			return;
		}

		if ( this._opts.cmp )
			this._comparator = {
				cmp: this._opts.cmp,
				sameType: ( ) => true,
			};
		else
		{
			const valType = typeof valueOf( val );

			const comparator = defaultComparators[ valType ];
			if ( !comparator )
				throw new Error(
					`Cannot set key of type ${valType} which are not (or ` +
					"convertible into) strings or numbers."
				);

			this._comparator = comparator;
		}

		const comparator =
			( a: IteratorType< K, V >, b: IteratorType< K, V > ) =>
				this._comparator.cmp( a[ 0 ], b[ 0 ] );

		this._data = new RBTree( comparator );
	}

	get size( ): number
	{
		return this._data ? this._data.size : 0;
	}

	clear( ): void
	{
		this._data && this._data.clear( );
	}

	delete( key: K ): boolean
	{
		return !this._data
			? false
			: this._data.remove( [ key, void 0 ] );
	}

	entries( ): IterableIterator< IteratorType< K, V > >
	{
		if ( !this._data )
			return emptyIterator;

		const iter = this._data.iterator( );

		const next = ( ) =>
		{
			const value = iter.next( );

			if ( !value )
				return iteratorEnd;

			return { value, done: false };
		}

		return makeIterator( next );
	}

	between( opts: Partial< BetweenOptions< K > > = { } )
	: IterableIterator< IteratorType< K, V > >
	{
		if ( !this._data || !this._data.size )
			return emptyIterator;

		const _opts = Object.assign( { }, opts );

		const hasLt = opts.hasOwnProperty( 'lt' );
		const hasLe = opts.hasOwnProperty( 'le' );
		const hasGt = opts.hasOwnProperty( 'gt' );
		const hasGe = opts.hasOwnProperty( 'ge' );

		if ( hasLt && hasLe )
			throw new Error( "Cannot provide both 'lt' and 'le'" );
		if ( hasGt && hasGe )
			throw new Error( "Cannot provide both 'gt' and 'ge'" );

		if ( !hasLt && !hasLe )
			_opts.le = BinMap.max;
		if ( !hasGt && !hasGe )
			_opts.ge = BinMap.min;

		const { lt, le, gt, ge, reverse } = _opts;

		const goPrev = ( iter: Iterator< IteratorType< K, V > > ) =>
			( iter.prev( ), iter );

		const goNext = ( iter: Iterator< IteratorType< K, V > > ) =>
			( iter.next( ), iter );

		const stopLeft =
			( gt === BinMap.min || ge === BinMap.min )
			? ( key: K ) => false
			: hasGt
			? ( key: K ) => this._comparator.cmp( < K >gt, key ) >= 0
			: ( key: K ) => this._comparator.cmp( < K >ge, key ) > 0;

		const stopRight =
			( lt === BinMap.max || le === BinMap.max )
			? ( key: K ) => false
			: hasLt
			? ( key: K ) => this._comparator.cmp( key, < K >lt ) >= 0
			: ( key: K ) => this._comparator.cmp( key, < K >le ) > 0;

		const strict =
			( less: boolean, iter: Iterator< IteratorType< K, V > > ) =>
		{
			const data = iter.data( );
			if ( !data )
				return goPrev( iter );

			if ( less || this._comparator.cmp( data[ 0 ], < K >le ) !== 0 )
				iter.prev( );

			return iter;
		};

		const iter =
			!reverse
			?
				( gt === BinMap.min || ge === BinMap.min )
				? goNext( this._data.iterator( ) )
				: hasGt
				? this._data.upperBound( [ < K >gt, void 0 ] )
				: this._data.lowerBound( [ < K >ge, void 0 ] )
			:
				( lt === BinMap.max || le === BinMap.max )
				? goPrev( this._data.iterator( ) )
				: hasLt
				? strict( true, this._data.lowerBound( [ < K >lt, void 0 ] ) )
				: strict( false, this._data.lowerBound( [ < K >le, void 0 ] ) );

		const next = ( ) =>
		{
			const value = iter.data( );

			if ( !value )
				return iteratorEnd;

			if (
				( reverse && stopLeft( value[ 0 ] ) )
				||
				( !reverse && stopRight( value[ 0 ] ) )
			)
				return iteratorEnd;

			reverse ? iter.prev( ) : iter.next( );

			return {
				value,
				done: false
			};
		}

		return makeIterator( next );
	}

	forEach( cb: ( value: V, key: K, map: Map< K, V > ) => void )
	{
		this._data && this._data.each( ( [ key, value ] ) =>
			cb( value, key, this )
		);
	}

	get( key: K ): V
	{
		const iter =
			!this._data
			? void 0
			: this._data.find( [ key, void 0 ] );

		return !iter
			? void 0
			: iter[ 1 ];
	}

	has( key: K ): boolean
	{
		return !this._data ? false : !!this._data.find( [ key, void 0 ] );
	}

	keys( ): IterableIterator< K >
	{
		if ( !this._data )
			return emptyIterator;

		const iter = this._data.iterator( );

		const next = ( ) =>
		{
			const value = iter.next( );

			if ( !value )
				return iteratorEnd;

			return {
				value: value[ 0 ],
				done: false
			};
		}

		return makeIterator( next );
	}

	set( key: K, value: V )
	{
		if ( valueOf( key ) == null )
			throw new Error( "Cannot set null or undefined as key" );

		this.ensureComparator( key );

		// If we have to update, we'll need to delete first (bintrees API)
		this.delete( key );

		this._data.insert( [ key, value ] );

		return this;
	}

	values( ): IterableIterator< V >
	{
		if ( !this._data )
			return emptyIterator;

		const iter = this._data.iterator( );

		const next = ( ) =>
		{
			const value = iter.next( );

			if ( !value )
				return iteratorEnd;

			return {
				value: value[ 1 ],
				done: false
			};
		}

		return makeIterator( next );
	}

	[ Symbol.iterator ]( ): IterableIterator< IteratorType< K, V > >
	{
		return this.entries( );
	}
}
