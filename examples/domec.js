/**
 * jQuery DOMEC (DOM Elements Creator) 0.3
 *
 * Copyright (c) 2008 Lukasz Rajchel (lukasz@rajchel.pl | http://lukasz.rajchel.pl)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Syntax:
 * $.create(element[, attributes[, children]])
 *
 * Parameters:
 * - string element - name of the element to create
 * - object|array attributes - element properties to be set
 * - string|array children - child elements (could also contain text value)
 *
 * Changelog:
 * 0.3.1 (2008.04.10)
 * - code optimization 
 *
 * 0.3 (2008.04.04)
 * - plugin function renamed from new to create (works now in IE)
 *
 * 0.2.1 (2008.04.01)
 * - namespace added
 * - fixed dates in changelog
 * - comments added
 *
 * 0.2 (2008.03.19)
 * - attributes and children parameters added
 * - changelog added
 *
 * 0.1 (2008.03.18)
 * - initial release
 */
 
(function($) {
 
 	// register jQuery extension
	$.extend({
		create: function(element, attributes, children) {
		
			// create new element
			var elem = $(document.createElement(element));
			
			// check argument shortening
			if (attributes.constructor == Array) {
				children = attributes;
				attributes = undefined;
			}
			
			// add passed attributes
			if (attributes) {
				for (key in attributes) {
					elem.attr(key, attributes[key]);
				}
			}
			
			// add passed child elements
			if (children) {
				for (i = 0; i < children.length; i++) {
					elem.append(children[i]);
				}
			}
			return elem;
		}
	});

})(jQuery);