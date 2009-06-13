/*
 * Copyright (c) 2005, The haXe Project Contributors
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE HAXE PROJECT CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE HAXE PROJECT CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */

/*
 * Adapted from standard haXe EReg class, for speed on JS platforms
 */

class SimpleEReg {

	var r : Dynamic;
	#if flash9
	var result : {> Array<String>, index : Int, input : String };
	#end
	#if (neko || php)
	var last : String;
	var global : Bool;
	#end
	#if php
	var pattern : String;
	var options : String;
	var re : String;
	var matches : ArrayAccess<Dynamic>;
	#end

	/**
		Creates a new regular expression with pattern [r] and
		options [opt].
	**/
	public function new( r : String, opt : String ) {
		#if neko
			var a = opt.split("g");
			global = a.length > 1;
			if( global )
				opt = a.join("");
			this.r = regexp_new_options(untyped r.__s, untyped opt.__s);
		#elseif js
			opt = opt.split("u").join(""); // 'u' (utf8) depends on page encoding
			this.r = untyped __new__("RegExp",r,opt);
		#elseif flash9
			this.r = untyped __new__(__global__["RegExp"],r,opt);
		#elseif php
			this.pattern = r;
			var a = opt.split("g");
			global = a.length > 1;
			if( global )
				opt = a.join("");
			this.options = opt;
			this.re = "/" + untyped __php__("str_replace")("/", "\\/", r) + "/" + opt;
		#else
			throw "Regular expressions are not implemented for this platform";
		#end
	}

	/**
		Tells if the regular expression matches the String.
		Updates the internal state accordingly.
	**/
	public function match( s : String ) : Bool {
		#if neko
			var p = regexp_match(r,untyped s.__s,0,s.length);
			if( p )
				last = s;
			else
				last = null;
			return p;
		#elseif js
			untyped {
				r.m = r.exec(s);
				r.s = s;
				return (r.m != null);
			}
		#elseif flash9
			result = untyped r.exec(s);
			return (result != null);
		#elseif php
			var p : Int = untyped __php__("preg_match")(re, s, matches, __php__("PREG_OFFSET_CAPTURE"));
			if(p > 0)
				last = s;
			else
				last = null;
			return p > 0;
		#else
			return false;
		#end
	}

	/**
		Returns a matched group or throw an expection if there
		is no such group. If [n = 0], the whole matched substring
		is returned.
	**/
	public function matched( n : Int ) : String {
		#if neko
			var m = regexp_matched(r,n);
			return (m == null) ? null : new String(m);
		#elseif js
			return untyped if( r.m != null && n >= 0 && n < r.m.length ) r.m[n] else throw "EReg::matched";
		#elseif flash9
			return untyped if( result != null && n >= 0 && n < result.length ) result[n] else throw "EReg::matched";
		#elseif php
			if( n < 0 ) throw "EReg::matched";
			// we can't differenciate between optional groups at the end of a match
			// that have not been matched and invalid groups
			if( n >= untyped __call__("count", matches)) return null;
			if(untyped __php__("$this->matches[$n][1] < 0")) return null;
			return untyped __php__("$this->matches[$n][0]");
		#else
			return null;
		#end
	}

#if neko
	static var regexp_new_options = neko.Lib.load("regexp","regexp_new_options",2);
	static var regexp_match = neko.Lib.load("regexp","regexp_match",4);
	static var regexp_matched = neko.Lib.load("regexp","regexp_matched",2);
	static var regexp_matched_pos : Dynamic -> Int -> { pos : Int, len : Int } = neko.Lib.load("regexp","regexp_matched_pos",2);
#end

}