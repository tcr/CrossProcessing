decompressed swf 3081 -> 4592
size [Rect 0 0 16000 12000]
frame rate 30
frame count 1
FileAttributes 4b 0%
SetBackgroundColor 3b 0%
DoABC 4540b 98%
magic 2e0010
Cpool numbers size 5 0 %
Cpool strings count 143 size 1167 25 %
Cpool namespaces count 10 size 19 0 %
Cpool nssets count 2 size 3 0 %
Cpool names count 120 size 371 8 %
MethodInfo count 56 size 276 6 %
InstanceInfo size 106 2 %
ClassInfo size 152 3%
ScriptInfo size 39 0 %
MethodBodies size 2397 52 %
  script0

  class ProcessingSketch extends Object
  {

    function ProcessingSketch():void	/* disp_id -1*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    returnvoid    	
    }

    function test():int	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=1 code_len=3
      0     pushbyte      	5
      2     returnvalue   	
    }

    function __init__():Function	/* disp_id 0*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=7
      0     getlocal0     	
      1     pushscope     	
      2     findproperty  	test
      4     getproperty   	test
      6     returnvalue   	
    }

    static function ProcessingSketch$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  class flash::Lib extends Object
  {

    function flash::Lib():void	/* disp_id -1*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    returnvoid    	
    }
    static var current:flash.display::MovieClip	/* slot_id 1 */

    static function getTimer():int	/* disp_id 1*/
    {
      // local_count=1 max_scope=0 max_stack=1 code_len=6
      0     findpropstrict	flash.utils::getTimer
      2     callproperty  	flash.utils::getTimer (0)
      5     returnvalue   	
    }

    static function eval(String):*	/* disp_id 2*/
    {
      activation {
      }
      // local_count=9 max_scope=4 max_stack=3 code_len=175
      0     getlocal0     	
      1     pushscope     	
      2     newactivation 	
      3     dup           	
      4     setlocal2     	
      5     pushscope     	
      6     pushnull      	
      7     coerce_a      	
      8     setlocal      	6
      10    pushnull      	
      11    astype        	String
      13    setlocal      	8
      15    getlocal1     	
      16    pushstring    	"."
      18    callproperty  	http://adobe.com/AS3/2006/builtin::split (1)
      21    coerce        	Array
      23    coerce        	Array
      25    setlocal3     	
      26    newarray      	[0]
      28    coerce        	Array
      30    setlocal      	4
      32    pushnull      	
      33    coerce_a      	
      34    coerce_a      	
      35    setlocal      	5
      37    jump          	L1

      
      L2: 
      41    label         	
      42    findpropstrict	flash.utils::getDefinitionByName
      44    getlocal3     	
      45    pushstring    	"."
      47    callproperty  	http://adobe.com/AS3/2006/builtin::join (1)
      50    coerce        	String
      52    callproperty  	flash.utils::getDefinitionByName (1)
      55    coerce_a      	
      56    setlocal      	5
      58    jump          	L3

      62    getlocal0     	
      63    pushscope     	
      64    getlocal2     	
      65    pushscope     	
      66    coerce_a      	
      67    setlocal      	6
      69    getlocal      	6
      71    astype        	Error
      73    iffalse       	L4

      77    getlex        	Boot_3eae51
      79    getlocal      	6
      81    initproperty  	lastError
      
      L4: 
      83    getlocal      	4
      85    getlocal3     	
      86    callproperty  	http://adobe.com/AS3/2006/builtin::pop (0)
      89    coerce        	String
      91    callpropvoid  	http://adobe.com/AS3/2006/builtin::unshift (1)
      
      L3: 
      94    getlocal      	5
      96    pushnull      	
      97    coerce_a      	
      98    ifeq          	L1

      102   jump          	L5
      
      L1: 
      106   getlocal3     	
      107   getproperty   	length
      109   convert_i     	
      110   pushbyte      	0
      112   ifgt          	L2
      
      L5: 
      116   pushbyte      	0
      118   convert_i     	
      119   setlocal      	7
      121   jump          	L6

      
      L7: 
      125   label         	
      126   getlocal      	4
      128   getlocal      	7
      130   getproperty   	null
      132   coerce        	String
      134   coerce        	String
      136   setlocal      	8
      138   inclocal_i    	7
      140   getlocal      	5
      142   pushnull      	
      143   coerce_a      	
      144   ifne          	L8

      148   pushnull      	
      149   coerce_a      	
      150   returnvalue   	
      
      L8: 
      151   getlocal      	5
      153   getlocal      	8
      155   getproperty   	null
      157   coerce_a      	
      158   coerce_a      	
      159   setlocal      	5
      
      L6: 
      161   getlocal      	7
      163   getlocal      	4
      165   getproperty   	length
      167   convert_i     	
      168   iflt          	L7

      172   getlocal      	5
      174   returnvalue   	
    }

    static function getURL(flash.net::URLRequest,String):void	/* disp_id 3*/
    {
      // local_count=4 max_scope=0 max_stack=4 code_len=35
      0     getlex        	flash.net::navigateToURL
      2     coerce        	Function
      4     coerce        	Function
      6     setlocal3     	
      7     getlocal2     	
      8     pushnull      	
      9     coerce        	String
      11    ifne          	L1

      15    getlocal3     	
      16    getglobalscope	
      17    getlocal1     	
      18    call          	(1)
      20    coerce_a      	
      21    pop           	
      22    jump          	L2
      
      L1: 
      26    getlocal3     	
      27    getglobalscope	
      28    getlocal1     	
      29    getlocal2     	
      30    call          	(2)
      32    coerce_a      	
      33    pop           	
      
      L2: 
      34    returnvoid    	
    }

    static function fscommand(String,String):void	/* disp_id 4*/
    {
      // local_count=3 max_scope=0 max_stack=4 code_len=23
      0     findpropstrict	flash.system::fscommand
      2     getlocal1     	
      3     getlocal2     	
      4     pushnull      	
      5     coerce        	String
      7     ifne          	L1

      11    pushstring    	""
      13    jump          	L2
      
      L1: 
      17    getlocal2     	
      
      L2: 
      18    callproperty  	flash.system::fscommand (2)
      21    pop           	
      22    returnvoid    	
    }

    static function trace(*):void	/* disp_id 5*/
    {
      // local_count=2 max_scope=0 max_stack=2 code_len=8
      0     findpropstrict	trace
      2     getlocal1     	
      3     callproperty  	trace (1)
      6     pop           	
      7     returnvoid    	
    }

    static function attach(String):flash.display::MovieClip	/* disp_id 6*/
    {
      // local_count=3 max_scope=0 max_stack=2 code_len=15
      0     findpropstrict	flash.utils::getDefinitionByName
      2     getlocal1     	
      3     callproperty  	flash.utils::getDefinitionByName (1)
      6     getlex        	Class
      8     astypelate    	
      9     coerce_a      	
      10    setlocal2     	
      11    getlocal2     	
      12    construct     	(0)
      14    returnvalue   	
    }

    static function as(*,Class):Object	/* disp_id 7*/
    {
      // local_count=3 max_scope=0 max_stack=2 code_len=4
      0     getlocal1     	
      1     getlocal2     	
      2     astypelate    	
      3     returnvalue   	
    }

    static function flash::Lib$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  final class Void extends Object
  {

    function Void(String,int,Object):void	/* disp_id -1*/
    {
      // local_count=4 max_scope=1 max_stack=2 code_len=18
      0     getlocal0     	
      1     pushscope     	
      2     findproperty  	tag
      4     getlocal1     	
      5     initproperty  	tag
      7     findproperty  	index
      9     getlocal2     	
      10    initproperty  	index
      12    findproperty  	params
      14    getlocal3     	
      15    initproperty  	params
      17    returnvoid    	
    }
    var tag:String	/* slot_id 0 */
    var index:int	/* slot_id 0 */
    var params:Array	/* slot_id 0 */
    const __enum__:Boolean = true	/* slot_id 0 */

    function toString():String	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=2 code_len=7
      0     getlex        	Boot_3eae51
      2     getlocal0     	
      3     callproperty  	enum_to_string (1)
      6     returnvalue   	
    }
    static const __isenum:Boolean = true	/* slot_id 2 */
    static var __constructs__:*	/* slot_id 1 */

    static function Void$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  class Dynamic extends Object
  {

    function Dynamic():void	/* disp_id -1*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    returnvoid    	
    }

    static function Dynamic$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  class IntIter extends Object
  {

    function IntIter(int,int):void	/* disp_id -1*/
    {
      // local_count=3 max_scope=1 max_stack=2 code_len=22
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    findproperty  	min
      13    getlocal1     	
      14    initproperty  	min
      16    findproperty  	max
      18    getlocal2     	
      19    initproperty  	max
      21    returnvoid    	
    }

    function next():int	/* disp_id 0*/
    {
      // local_count=2 max_scope=1 max_stack=3 code_len=16
      0     getlocal0     	
      1     pushscope     	
      2     findproperty  	min
      4     findproperty  	min
      6     getproperty   	min
      8     dup           	
      9     convert_i     	
      10    setlocal1     	
      11    increment_i   	
      12    initproperty  	min
      14    getlocal1     	
      15    returnvalue   	
    }
    var min:int	/* slot_id 0 */
    var max:int	/* slot_id 0 */

    function hasNext():Boolean	/* disp_id 0*/
    {
      // local_count=1 max_scope=1 max_stack=2 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     findproperty  	min
      4     getproperty   	min
      6     findproperty  	max
      8     getproperty   	max
      10    lessthan      	
      11    returnvalue   	
    }

    static function IntIter$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  class Std extends Object
  {

    function Std():void	/* disp_id -1*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    returnvoid    	
    }

    static function is(*,*):Boolean	/* disp_id 1*/
    {
      // local_count=3 max_scope=0 max_stack=3 code_len=9
      0     getlex        	Boot_3eae51
      2     getlocal1     	
      3     getlocal2     	
      4     callproperty  	__instanceof (2)
      7     convert_b     	
      8     returnvalue   	
    }

    static function string(*):String	/* disp_id 2*/
    {
      // local_count=2 max_scope=0 max_stack=3 code_len=11
      0     getlex        	Boot_3eae51
      2     getlocal1     	
      3     pushstring    	""
      5     callproperty  	__string_rec (2)
      8     coerce        	String
      10    returnvalue   	
    }

    static function int(Number):int	/* disp_id 3*/
    {
      // local_count=2 max_scope=0 max_stack=1 code_len=3
      0     getlocal1     	
      1     convert_i     	
      2     returnvalue   	
    }

    static function parseInt(String):Object	/* disp_id 4*/
    {
      // local_count=3 max_scope=0 max_stack=2 code_len=23
      0     findpropstrict	parseInt
      2     getlocal1     	
      3     callproperty  	parseInt (1)
      6     coerce_a      	
      7     setlocal2     	
      8     findpropstrict	isNaN
      10    getlocal2     	
      11    callproperty  	isNaN (1)
      14    iffalse       	L1

      18    pushnull      	
      19    coerce_a      	
      20    returnvalue   	
      
      L1: 
      21    getlocal2     	
      22    returnvalue   	
    }

    static function parseFloat(String):Number	/* disp_id 5*/
    {
      // local_count=2 max_scope=0 max_stack=2 code_len=7
      0     findpropstrict	parseFloat
      2     getlocal1     	
      3     callproperty  	parseFloat (1)
      6     returnvalue   	
    }

    static function random(int):int	/* disp_id 6*/
    {
      // local_count=2 max_scope=0 max_stack=3 code_len=15
      0     getlex        	Math
      2     getlex        	Math
      4     callproperty  	random (0)
      7     convert_d     	
      8     getlocal1     	
      9     multiply      	
      10    callproperty  	floor (1)
      13    convert_i     	
      14    returnvalue   	
    }

    static function Std$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  class Main extends Object
  {

    function Main():void	/* disp_id -1*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    returnvoid    	
    }

    static function main():void	/* disp_id 1*/
    {
      // local_count=2 max_scope=0 max_stack=1 code_len=13
      0     findpropstrict	ProcessingSketch
      2     constructprop 	ProcessingSketch (0)
      5     coerce        	ProcessingSketch
      7     setlocal1     	
      8     getlocal1     	
      9     callpropvoid  	__init__ (0)
      12    returnvoid    	
    }

    static function Main$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  dynamic class Boot_3eae51 extends flash.display::MovieClip
  {

    function Boot_3eae51(flash.display::MovieClip):void	/* disp_id -1*/
    {
      activation {
        var cca:Object	/* slot_id 1 */
      }
      // local_count=5 max_scope=4 max_stack=3 code_len=199
      0     getlocal0     	
      1     pushscope     	
      2     newactivation 	
      3     dup           	
      4     setlocal2     	
      5     pushscope     	
      6     pushnull      	
      7     coerce_a      	
      8     setlocal3     	
      9     getlex        	Boot_3eae51
      11    getproperty   	skip_constructor
      13    iffalse       	L1

      17    returnvoid    	
      
      L1: 
      18    getlocal0     	
      19    constructsuper	(0)
      21    getlex        	Array
      23    getproperty   	prototype
      25    coerce_a      	
      26    setlocal3     	
      27    getlocal3     	
      28    newfunction   	var undefined():Object	/* disp_id 0*/
      30    initproperty  	copy
      32    getlocal3     	
      33    newfunction   	var undefined(Object,Object):void	/* disp_id 0*/
      35    initproperty  	insert
      37    getlocal3     	
      38    newfunction   	var undefined(Object):Boolean	/* disp_id 0*/
      40    initproperty  	remove
      42    getlocal3     	
      43    newfunction   	var undefined():Object	/* disp_id 0*/
      45    initproperty  	iterator
      47    getlocal3     	
      48    pushstring    	"copy"
      50    pushfalse     	
      51    callpropvoid  	setPropertyIsEnumerable (2)
      54    getlocal3     	
      55    pushstring    	"insert"
      57    pushfalse     	
      58    callpropvoid  	setPropertyIsEnumerable (2)
      61    getlocal3     	
      62    pushstring    	"remove"
      65    pushfalse     	
      66    callpropvoid  	setPropertyIsEnumerable (2)
      69    getlocal3     	
      70    pushstring    	"iterator"
      73    pushfalse     	
      74    callpropvoid  	setPropertyIsEnumerable (2)
      77    getscopeobject	1
      79    getlex        	String
      81    getproperty   	prototype
      83    getproperty   	charCodeAt
      85    coerce_a      	
      86    setslot       	1
      88    getlex        	String
      90    getproperty   	prototype
      92    newfunction   	var undefined(Object):Object	/* disp_id 0*/
      94    initproperty  	charCodeAt
      96    getlex        	Boot_3eae51
      98    newarray      	[0]
      100   initproperty  	lines
      102   getlocal1     	
      103   pushnull      	
      104   coerce        	flash.display::MovieClip
      106   ifne          	L2

      110   getlocal0     	
      111   coerce        	flash.display::MovieClip
      113   jump          	L3
      
      L2: 
      117   getlocal1     	
      
      L3: 
      118   coerce        	flash.display::MovieClip
      120   setlocal      	4
      122   getlex        	flash::Lib
      124   getlocal      	4
      126   initproperty  	current
      128   pushfalse     	
      129   getlocal      	4
      131   getproperty   	stage
      133   pushnull      	
      134   coerce        	flash.display::Stage
      136   ifeq          	L4

      140   pop           	
      141   getlocal      	4
      143   getproperty   	stage
      145   getproperty   	align
      147   pushstring    	""
      149   equals        	
      150   convert_b     	
      
      L4: 
      151   iffalse       	L5

      155   getlocal      	4
      157   getproperty   	stage
      159   pushstring    	"TOP_LEFT"
      162   initproperty  	align
      164   jump          	L6
      
      L5: 
      168   pushnull      	
      169   coerce        	String
      171   pop           	
      
      L6: 
      172   jump          	L7

      176   getlocal0     	
      177   pushscope     	
      178   getlocal2     	
      179   pushscope     	
      180   coerce_a      	
      181   setlocal3     	
      
      L7: 
      182   getlex        	Boot_3eae51
      184   getproperty   	init
      186   pushnull      	
      187   coerce        	Function
      189   ifeq          	L8

      193   getlex        	Boot_3eae51
      195   callpropvoid  	init (0)
      
      L8: 
      198   returnvoid    	
    }
    static var init:Function	/* slot_id 1 */
    static var tf:flash.text::TextField	/* slot_id 2 */
    static var lines:Array	/* slot_id 3 */
    static var lastError:Error	/* slot_id 4 */
    static var skip_constructor:Boolean	/* slot_id 5 */

    static function enum_to_string(Object):String	/* disp_id 1*/
    {
      // local_count=2 max_scope=0 max_stack=3 code_len=49
      0     getlocal1     	
      1     getproperty   	params
      3     coerce        	Array
      5     pushnull      	
      6     coerce        	Array
      8     ifne          	L1

      12    getlocal1     	
      13    getproperty   	tag
      15    coerce        	String
      17    returnvalue   	
      
      L1: 
      18    getlocal1     	
      19    getproperty   	tag
      21    coerce        	String
      23    pushstring    	"("
      25    add           	
      26    coerce        	String
      28    getlocal1     	
      29    getproperty   	params
      31    coerce        	Array
      33    pushstring    	","
      35    callproperty  	http://adobe.com/AS3/2006/builtin::join (1)
      38    coerce        	String
      40    add           	
      41    coerce        	String
      43    pushstring    	")"
      45    add           	
      46    coerce        	String
      48    returnvalue   	
    }

    static function __instanceof(*,*):Boolean	/* disp_id 2*/
    {
      activation {
      }
      // local_count=5 max_scope=4 max_stack=2 code_len=36
      0     getlocal0     	
      1     pushscope     	
      2     newactivation 	
      3     dup           	
      4     setlocal3     	
      5     pushscope     	
      6     pushnull      	
      7     coerce_a      	
      8     setlocal      	4
      10    getlocal2     	
      11    getlex        	Dynamic
      13    ifne          	L1

      17    pushtrue      	
      18    returnvalue   	
      
      L1: 
      19    getlocal1     	
      20    getlocal2     	
      21    istypelate    	
      22    returnvalue   	
      23    jump          	L2

      27    getlocal0     	
      28    pushscope     	
      29    getlocal3     	
      30    pushscope     	
      31    coerce_a      	
      32    setlocal      	4
      
      L2: 
      34    pushfalse     	
      35    returnvalue   	
    }

    static function __clear_trace():void	/* disp_id 3*/
    {
      // local_count=1 max_scope=0 max_stack=2 code_len=37
      0     getlex        	Boot_3eae51
      2     getproperty   	tf
      4     pushnull      	
      5     coerce        	flash.text::TextField
      7     ifne          	L1

      11    returnvoid    	
      
      L1: 
      12    getlex        	flash::Lib
      14    getproperty   	current
      16    getlex        	Boot_3eae51
      18    getproperty   	tf
      20    callpropvoid  	removeChild (1)
      23    getlex        	Boot_3eae51
      25    pushnull      	
      26    coerce        	flash.text::TextField
      28    initproperty  	tf
      30    getlex        	Boot_3eae51
      32    newarray      	[0]
      34    initproperty  	lines
      36    returnvoid    	
    }

    static function __set_trace_color(uint):void	/* disp_id 4*/
    {
      // local_count=2 max_scope=0 max_stack=2 code_len=11
      0     getlex        	Boot_3eae51
      2     callproperty  	getTrace (0)
      5     coerce        	flash.text::TextField
      7     getlocal1     	
      8     initproperty  	textColor
      10    returnvoid    	
    }

    static function getTrace():flash.text::TextField	/* disp_id 5*/
    {
      // local_count=3 max_scope=0 max_stack=3 code_len=119
      0     pushnull      	
      1     astype        	flash.text::TextFormat
      3     setlocal2     	
      4     getlex        	flash::Lib
      6     getproperty   	current
      8     coerce        	flash.display::MovieClip
      10    setlocal1     	
      11    getlex        	Boot_3eae51
      13    getproperty   	tf
      15    pushnull      	
      16    coerce        	flash.text::TextField
      18    ifne          	L1

      22    getlex        	Boot_3eae51
      24    findpropstrict	flash.text::TextField
      26    constructprop 	flash.text::TextField (0)
      29    initproperty  	tf
      31    getlex        	Boot_3eae51
      33    getproperty   	tf
      35    callproperty  	getTextFormat (0)
      38    coerce        	flash.text::TextFormat
      40    coerce        	flash.text::TextFormat
      42    setlocal2     	
      43    getlocal2     	
      44    pushstring    	"_sans"
      46    initproperty  	font
      48    getlex        	Boot_3eae51
      50    getproperty   	tf
      52    getlocal2     	
      53    initproperty  	defaultTextFormat
      55    getlex        	Boot_3eae51
      57    getproperty   	tf
      59    pushfalse     	
      60    initproperty  	selectable
      62    getlex        	Boot_3eae51
      64    getproperty   	tf
      66    getlocal1     	
      67    getproperty   	stage
      69    pushnull      	
      70    coerce        	flash.display::Stage
      72    ifne          	L2

      76    pushint       	800	// 0x320
      78    jump          	L3
      
      L2: 
      82    getlocal1     	
      83    getproperty   	stage
      85    getproperty   	stageWidth
      
      L3: 
      87    initproperty  	width
      89    getlex        	Boot_3eae51
      91    getproperty   	tf
      93    getlex        	flash.text::TextFieldAutoSize
      95    getproperty   	LEFT
      97    initproperty  	autoSize
      99    getlex        	Boot_3eae51
      101   getproperty   	tf
      103   pushfalse     	
      104   initproperty  	mouseEnabled
      
      L1: 
      106   getlocal1     	
      107   getlex        	Boot_3eae51
      109   getproperty   	tf
      111   callpropvoid  	addChild (1)
      114   getlex        	Boot_3eae51
      116   getproperty   	tf
      118   returnvalue   	
    }

    static function __trace(*,Object):void	/* disp_id 6*/
    {
      // local_count=6 max_scope=0 max_stack=6 code_len=173
      0     getlex        	Boot_3eae51
      2     callproperty  	getTrace (0)
      5     coerce        	flash.text::TextField
      7     coerce        	flash.text::TextField
      9     setlocal3     	
      10    getlocal2     	
      11    pushnull      	
      12    coerce_a      	
      13    ifne          	L1

      17    pushstring    	"(null)"
      19    jump          	L2
      
      L1: 
      23    getlocal2     	
      24    getproperty   	fileName
      26    coerce        	String
      28    pushstring    	":"
      30    add           	
      31    coerce        	String
      33    getlocal2     	
      34    getproperty   	lineNumber
      36    convert_i     	
      37    add           	
      38    coerce        	String
      
      L2: 
      40    coerce        	String
      42    setlocal      	4
      44    getlex        	Boot_3eae51
      46    getlex        	Boot_3eae51
      48    getproperty   	lines
      50    getlocal      	4
      52    pushstring    	": "
      54    add           	
      55    coerce        	String
      57    getlex        	Boot_3eae51
      59    getlocal1     	
      60    pushstring    	""
      62    callproperty  	__string_rec (2)
      65    coerce        	String
      67    add           	
      68    coerce        	String
      70    pushstring    	"\n"
      72    callproperty  	http://adobe.com/AS3/2006/builtin::split (1)
      75    coerce        	Array
      77    callproperty  	http://adobe.com/AS3/2006/builtin::concat (1)
      80    coerce        	Array
      82    initproperty  	lines
      84    getlocal3     	
      85    getlex        	Boot_3eae51
      87    getproperty   	lines
      89    pushstring    	"\n"
      91    callproperty  	http://adobe.com/AS3/2006/builtin::join (1)
      94    coerce        	String
      96    initproperty  	text
      98    getlex        	flash::Lib
      100   getproperty   	current
      102   getproperty   	stage
      104   coerce        	flash.display::Stage
      106   setlocal      	5
      108   getlocal      	5
      110   pushnull      	
      111   coerce        	flash.display::Stage
      113   ifne          	L3

      117   returnvoid    	
      
      L3: 
      118   jump          	L4

      
      L5: 
      122   label         	
      123   getlex        	Boot_3eae51
      125   getproperty   	lines
      127   callpropvoid  	http://adobe.com/AS3/2006/builtin::shift (0)
      130   getlocal3     	
      131   getlex        	Boot_3eae51
      133   getproperty   	lines
      135   pushstring    	"\n"
      137   callproperty  	http://adobe.com/AS3/2006/builtin::join (1)
      140   coerce        	String
      142   initproperty  	text
      
      L4: 
      144   pushfalse     	
      145   getlex        	Boot_3eae51
      147   getproperty   	lines
      149   getproperty   	length
      151   convert_i     	
      152   pushbyte      	1
      154   ifngt         	L6

      158   pop           	
      159   getlocal3     	
      160   getproperty   	height
      162   getlocal      	5
      164   getproperty   	stageHeight
      166   greaterthan   	
      167   convert_b     	
      
      L6: 
      168   iftrue        	L5

      172   returnvoid    	
    }

    static function __string_rec(*,String):String	/* disp_id 7*/
    {
      // local_count=14 max_scope=0 max_stack=5 code_len=408
      0     pushnull      	
      1     astype        	String
      3     setlocal      	4
      5     pushnull      	
      6     astype        	Array
      8     setlocal      	5
      10    pushnull      	
      11    astype        	Array
      13    setlocal      	6
      15    pushbyte      	0
      17    setlocal      	7
      19    pushnull      	
      20    coerce_a      	
      21    setlocal      	8
      23    pushnull      	
      24    astype        	String
      26    setlocal      	9
      28    pushfalse     	
      29    setlocal      	10
      31    pushbyte      	0
      33    setlocal      	11
      35    pushbyte      	0
      37    setlocal      	12
      39    pushnull      	
      40    astype        	String
      42    setlocal      	13
      44    findpropstrict	flash.utils::getQualifiedClassName
      46    getlocal1     	
      47    callproperty  	flash.utils::getQualifiedClassName (1)
      50    coerce        	String
      52    setlocal3     	
      53    getlocal3     	
      54    coerce        	String
      56    setlocal      	4
      58    getlocal      	4
      60    pushstring    	"Object"
      62    ifne          	L1

      66    pushbyte      	0
      68    convert_i     	
      69    setlocal      	7
      71    newarray      	[0]
      73    coerce        	Array
      75    setlocal      	6
      77    getlocal1     	
      78    coerce_a      	
      79    setlocal      	8
      81    jump          	L2

      
      L3: 
      85    label         	
      86    getlocal      	6
      88    getlocal      	8
      90    getlocal      	7
      92    nextname      	
      93    callpropvoid  	http://adobe.com/AS3/2006/builtin::push (1)
      
      L2: 
      96    hasnext2      	8 7
      99    iftrue        	L3

      103   getlocal      	6
      105   coerce        	Array
      107   setlocal      	5
      109   pushstring    	"{"
      111   coerce        	String
      113   setlocal      	9
      115   pushtrue      	
      116   convert_b     	
      117   setlocal      	10
      119   pushbyte      	0
      121   convert_i     	
      122   setlocal      	7
      124   getlocal      	5
      126   getproperty   	length
      128   convert_i     	
      129   convert_i     	
      130   setlocal      	11
      132   jump          	L4

      
      L5: 
      136   label         	
      137   getlocal      	7
      139   inclocal_i    	7
      141   convert_i     	
      142   setlocal      	12
      144   getlocal      	5
      146   getlocal      	12
      148   getproperty   	null
      150   coerce        	String
      152   coerce        	String
      154   setlocal      	13
      156   getlocal      	10
      158   iffalse       	L6

      162   pushfalse     	
      163   convert_b     	
      164   setlocal      	10
      166   jump          	L7
      
      L6: 
      170   getlocal      	9
      172   pushstring    	","
      174   add           	
      175   coerce        	String
      177   coerce        	String
      179   setlocal      	9
      
      L7: 
      181   getlocal      	9
      183   pushstring    	" "
      185   getlocal      	13
      187   add           	
      188   coerce        	String
      190   pushstring    	" : "
      192   add           	
      193   coerce        	String
      195   getlex        	Boot_3eae51
      197   getlocal1     	
      198   getlocal      	13
      200   getproperty   	null
      202   coerce_a      	
      203   getlocal2     	
      204   callproperty  	__string_rec (2)
      207   coerce        	String
      209   add           	
      210   coerce        	String
      212   add           	
      213   coerce        	String
      215   coerce        	String
      217   setlocal      	9
      
      L4: 
      219   getlocal      	7
      221   getlocal      	11
      223   iflt          	L5

      227   getlocal      	10
      229   not           	
      230   iffalse       	L8

      234   getlocal      	9
      236   pushstring    	" "
      238   add           	
      239   coerce        	String
      241   coerce        	String
      243   setlocal      	9
      
      L8: 
      245   getlocal      	9
      247   pushstring    	"}"
      249   add           	
      250   coerce        	String
      252   coerce        	String
      254   setlocal      	9
      256   getlocal      	9
      258   returnvalue   	
      259   jump          	L9
      
      L1: 
      263   getlocal      	4
      265   pushstring    	"Array"
      267   ifne          	L10

      271   pushstring    	"["
      273   coerce        	String
      275   setlocal      	9
      277   pushtrue      	
      278   convert_b     	
      279   setlocal      	10
      281   getlocal1     	
      282   coerce        	Array
      284   setlocal      	5
      286   pushbyte      	0
      288   convert_i     	
      289   setlocal      	7
      291   getlocal      	5
      293   getproperty   	length
      295   convert_i     	
      296   convert_i     	
      297   setlocal      	11
      299   jump          	L11

      
      L12: 
      303   label         	
      304   getlocal      	7
      306   inclocal_i    	7
      308   convert_i     	
      309   setlocal      	12
      311   getlocal      	10
      313   iffalse       	L13

      317   pushfalse     	
      318   convert_b     	
      319   setlocal      	10
      321   jump          	L14
      
      L13: 
      325   getlocal      	9
      327   pushstring    	","
      329   add           	
      330   coerce        	String
      332   coerce        	String
      334   setlocal      	9
      
      L14: 
      336   getlocal      	9
      338   getlex        	Boot_3eae51
      340   getlocal      	5
      342   getlocal      	12
      344   getproperty   	null
      346   coerce_a      	
      347   getlocal2     	
      348   callproperty  	__string_rec (2)
      351   coerce        	String
      353   add           	
      354   coerce        	String
      356   coerce        	String
      358   setlocal      	9
      
      L11: 
      360   getlocal      	7
      362   getlocal      	11
      364   iflt          	L12

      368   getlocal      	9
      370   pushstring    	"]"
      372   add           	
      373   coerce        	String
      375   returnvalue   	
      376   jump          	L9
      
      L10: 
      380   getlocal1     	
      381   typeof        	
      382   coerce        	String
      384   setlocal      	4
      386   getlocal      	4
      388   pushstring    	"function"
      390   ifne          	L9

      394   pushstring    	"<function>"
      396   returnvalue   	
      397   jump          	L9
      
      L9: 
      401   findpropstrict	String
      403   getlocal1     	
      404   constructprop 	String (1)
      407   returnvalue   	
    }

    static function __unprotect__(String):String	/* disp_id 8*/
    {
      // local_count=2 max_scope=0 max_stack=1 code_len=2
      0     getlocal1     	
      1     returnvalue   	
    }

    static function Boot_3eae51$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  class @Main extends Object
  {

    function @Main():void	/* disp_id -1*/
    {
      // local_count=1 max_scope=1 max_stack=1 code_len=12
      0     getlocal0     	
      1     pushscope     	
      2     getlex        	Boot_3eae51
      4     getproperty   	skip_constructor
      6     iffalse       	L1

      10    returnvoid    	
      
      L1: 
      11    returnvoid    	
    }
    static var init:Object	/* slot_id 1 */

    static function @Main$cinit():void	/* disp_id 0*/
    {
      // local_count=1 max_scope=0 max_stack=0 code_len=1
      0     returnvoid    	
    }
  }

  function script0$init():void	/* disp_id 0*/
  {
    // local_count=2 max_scope=2 max_stack=3 code_len=116
    0       getlocal0     	
    1       pushscope     	
    2       getglobalscope	
    3       getlex        	Object
    5       pushscope     	
    6       getlex        	Object
    8       newclass      	ProcessingSketch
    10      popscope      	
    11      initproperty  	ProcessingSketch
    13      getglobalscope	
    14      getlex        	Object
    16      pushscope     	
    17      getlex        	Object
    19      newclass      	flash::Lib
    21      popscope      	
    22      initproperty  	flash::Lib
    24      getglobalscope	
    25      getlex        	Object
    27      pushscope     	
    28      getlex        	Object
    30      newclass      	Void
    32      popscope      	
    33      dup           	
    34      setlocal1     	
    35      initproperty  	Void
    37      getlocal1     	
    38      newarray      	[0]
    40      setproperty   	__constructs__
    42      getglobalscope	
    43      getlex        	Object
    45      pushscope     	
    46      getlex        	Object
    48      newclass      	Dynamic
    50      popscope      	
    51      initproperty  	Dynamic
    53      getglobalscope	
    54      getlex        	Object
    56      pushscope     	
    57      getlex        	Object
    59      newclass      	IntIter
    61      popscope      	
    62      initproperty  	IntIter
    64      getglobalscope	
    65      getlex        	Object
    67      pushscope     	
    68      getlex        	Object
    70      newclass      	Std
    72      popscope      	
    73      initproperty  	Std
    75      getglobalscope	
    76      getlex        	Object
    78      pushscope     	
    79      getlex        	Object
    81      newclass      	Main
    83      popscope      	
    84      initproperty  	Main
    86      getglobalscope	
    87      getlex        	flash.display::MovieClip
    89      pushscope     	
    90      getlex        	flash.display::MovieClip
    92      newclass      	Boot_3eae51
    94      popscope      	
    95      initproperty  	Boot_3eae51
    97      getglobalscope	
    98      getlex        	Object
    100     pushscope     	
    101     getlex        	Object
    103     newclass      	@Main
    105     popscope      	
    106     initproperty  	@Main
    108     getglobalscope	
    109     getproperty   	Boot_3eae51
    111     newfunction   	var undefined():void	/* disp_id 0*/
    113     initproperty  	init
    115     returnvoid    	
  }

  var undefined():Object	/* disp_id 0*/
  {
    // local_count=1 max_scope=1 max_stack=1 code_len=8
    0       getlocal0     	
    1       pushscope     	
    2       getlocal0     	
    3       callproperty  	slice (0)
    6       coerce_a      	
    7       returnvalue   	
  }

  var undefined(Object,Object):void	/* disp_id 0*/
  {
    // local_count=3 max_scope=1 max_stack=4 code_len=11
    0       getlocal0     	
    1       pushscope     	
    2       getlocal0     	
    3       getlocal1     	
    4       pushbyte      	0
    6       getlocal2     	
    7       callpropvoid  	splice (3)
    10      returnvoid    	
  }

  var undefined(Object):Boolean	/* disp_id 0*/
  {
    // local_count=5 max_scope=1 max_stack=3 code_len=55
    0       getlocal0     	
    1       pushscope     	
    2       pushbyte      	0
    4       setlocal      	4
    6       pushbyte      	0
    8       convert_i     	
    9       setlocal2     	
    10      getlocal0     	
    11      getproperty   	length
    13      coerce_a      	
    14      setlocal3     	
    15      jump          	L1

    
    L2: 
    19      label         	
    20      getlocal2     	
    21      inclocal_i    	2
    23      convert_i     	
    24      setlocal      	4
    26      getlocal0     	
    27      getlocal      	4
    29      getproperty   	null
    31      coerce_a      	
    32      getlocal1     	
    33      ifne          	L1

    37      getlocal0     	
    38      getlocal      	4
    40      pushbyte      	1
    42      callpropvoid  	splice (2)
    45      pushtrue      	
    46      returnvalue   	
    
    L1: 
    47      getlocal2     	
    48      getlocal3     	
    49      iflt          	L2

    53      pushfalse     	
    54      returnvalue   	
  }

  var undefined():Object	/* disp_id 0*/
  {
    activation {
      var arr:Array	/* slot_id 2 */
      var cur:int	/* slot_id 1 */
    }
    // local_count=1 max_scope=2 max_stack=4 code_len=26
    0       getlocal0     	
    1       pushscope     	
    2       newactivation 	
    3       pushscope     	
    4       getscopeobject	1
    6       pushbyte      	0
    8       setslot       	1
    10      getscopeobject	1
    12      getlocal0     	
    13      setslot       	2
    15      pushstring    	"hasNext"
    17      newfunction   	var undefined():Boolean	/* disp_id 0*/
    19      pushstring    	"next"
    21      newfunction   	var undefined():Object	/* disp_id 0*/
    23      newobject     	{2}
    25      returnvalue   	
  }

  var undefined():Boolean	/* disp_id 0*/
  {
    // local_count=1 max_scope=0 max_stack=2 code_len=9
    0       getlex        	cur
    2       getlex        	arr
    4       getproperty   	length
    6       convert_i     	
    7       lessthan      	
    8       returnvalue   	
  }

  var undefined():Object	/* disp_id 0*/
  {
    // local_count=2 max_scope=0 max_stack=4 code_len=17
    0       getlex        	arr
    2       findproperty  	cur
    4       getlex        	cur
    6       dup           	
    7       convert_i     	
    8       setlocal1     	
    9       increment_i   	
    10      setproperty   	cur
    12      getlocal1     	
    13      getproperty   	null
    15      coerce_a      	
    16      returnvalue   	
  }

  var undefined(Object):Object	/* disp_id 0*/
  {
    // local_count=3 max_scope=1 max_stack=3 code_len=27
    0       getlocal0     	
    1       pushscope     	
    2       getlex        	cca
    4       getlocal0     	
    5       getlocal1     	
    6       callproperty  	call (2)
    9       coerce_a      	
    10      coerce_a      	
    11      setlocal2     	
    12      findpropstrict	isNaN
    14      getlocal2     	
    15      callproperty  	isNaN (1)
    18      iffalse       	L1

    22      pushnull      	
    23      coerce_a      	
    24      returnvalue   	
    
    L1: 
    25      getlocal2     	
    26      returnvalue   	
  }

  var undefined():void	/* disp_id 0*/
  {
    // local_count=2 max_scope=0 max_stack=2 code_len=81
    0       getlex        	Math
    2       getlex        	Number
    4       coerce_a      	
    5       getproperty   	NaN
    7       convert_d     	
    8       initproperty  	NaN
    10      getlex        	Math
    12      getlex        	Number
    14      coerce_a      	
    15      getproperty   	NEGATIVE_INFINITY
    17      convert_d     	
    18      initproperty  	NEGATIVE_INFINITY
    20      getlex        	Math
    22      getlex        	Number
    24      coerce_a      	
    25      getproperty   	POSITIVE_INFINITY
    27      convert_d     	
    28      initproperty  	POSITIVE_INFINITY
    30      getlex        	Math
    32      newfunction   	var undefined(Number):Boolean	/* disp_id 0*/
    34      initproperty  	isFinite
    36      getlex        	Math
    38      newfunction   	var undefined(Number):Boolean	/* disp_id 0*/
    40      initproperty  	isNaN
    42      getglobalscope	
    43      getlex        	Boolean
    45      coerce_a      	
    46      setproperty   	Boolean
    48      getglobalscope	
    49      getlex        	int
    51      setproperty   	int
    53      getglobalscope	
    54      getlex        	Number
    56      setproperty   	Number
    58      getglobalscope	
    59      getproperty   	Boot_3eae51
    61      setlocal1     	
    62      getlocal1     	
    63      pushfalse     	
    64      setslot       	5
    66      getglobalscope	
    67      getproperty   	@Main
    69      setlocal1     	
    70      getlocal1     	
    71      getlex        	Main
    73      callproperty  	main (0)
    76      coerce        	Object
    78      setslot       	1
    80      returnvoid    	
  }

  var undefined(Number):Boolean	/* disp_id 0*/
  {
    // local_count=2 max_scope=0 max_stack=2 code_len=7
    0       findpropstrict	isFinite
    2       getlocal1     	
    3       callproperty  	isFinite (1)
    6       returnvalue   	
  }

  var undefined(Number):Boolean	/* disp_id 0*/
  {
    // local_count=2 max_scope=0 max_stack=2 code_len=7
    0       findpropstrict	isNaN
    2       getlocal1     	
    3       callproperty  	isNaN (1)
    6       returnvalue   	
  }
OPCODE	SIZE	% OF 1911
getlex        	176	9%
coerce        	160	8%
getproperty   	146	7%
getlocal      	106	5%
setlocal      	104	5%
callproperty  	102	5%
jump          	88	4%
initproperty  	86	4%
pushstring    	75	3%
iffalse       	60	3%
ifne          	60	3%
getlocal1     	45	2%
pushscope     	39	2%
callpropvoid  	39	2%
returnvoid    	38	1%
returnvalue   	38	1%
coerce_a      	37	1%
getlocal0     	33	1%
pushnull      	30	1%
pushbyte      	30	1%
findpropstrict	30	1%
getlocal2     	27	1%
findproperty  	22	1%
convert_i     	21	1%
newfunction   	20	1%
getlocal3     	20	1%
newclass      	18	0%
getglobalscope	17	0%
add           	17	0%
iflt          	16	0%
astype        	16	0%
pushfalse     	14	0%
ifeq          	12	0%
newarray      	10	0%
setproperty   	10	0%
setslot       	10	0%
popscope      	9	0%
constructprop 	9	0%
setlocal3     	9	0%
iftrue        	8	0%
inclocal_i    	8	0%
setlocal2     	8	0%
label         	7	0%
pop           	7	0%
convert_b     	7	0%
setlocal1     	7	0%
dup           	6	0%
getscopeobject	6	0%
ifngt         	4	0%
ifgt          	4	0%
pushtrue      	4	0%
call          	4	0%
newactivation 	4	0%
convert_d     	4	0%
hasnext2      	3	0%
pushint       	2	0%
construct     	2	0%
constructsuper	2	0%
newobject     	2	0%
astypelate    	2	0%
lessthan      	2	0%
increment_i   	2	0%
nextname      	1	0%
typeof        	1	0%
not           	1	0%
multiply      	1	0%
equals        	1	0%
greaterthan   	1	0%
istypelate    	1	0%

SymbolClass 16b 0%
ShowFrame 0b 0%
End 0b 0%
