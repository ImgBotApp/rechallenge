'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function($){"use strict";var FOUNDATION_VERSION='6.3.1';// Global Foundation object
// This is attached to the window, or used as a module for AMD/Browserify
var Foundation={version:FOUNDATION_VERSION,/**
   * Stores initialized plugins.
   */_plugins:{},/**
   * Stores generated unique ids for plugin instances
   */_uuids:[],/**
   * Returns a boolean for RTL support
   */rtl:function rtl(){return $('html').attr('dir')==='rtl';},/**
   * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
   * @param {Object} plugin - The constructor of the plugin.
   */plugin:function plugin(_plugin,name){// Object key to use when adding to global Foundation object
// Examples: Foundation.Reveal, Foundation.OffCanvas
var className=name||functionName(_plugin);// Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
// Examples: data-reveal, data-off-canvas
var attrName=hyphenate(className);// Add to the Foundation object and the plugins list (for reflowing)
this._plugins[attrName]=this[className]=_plugin;},/**
   * @function
   * Populates the _uuids array with pointers to each individual plugin instance.
   * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
   * Also fires the initialization event for each plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @param {String} name - the name of the plugin, passed as a camelCased string.
   * @fires Plugin#init
   */registerPlugin:function registerPlugin(plugin,name){var pluginName=name?hyphenate(name):functionName(plugin.constructor).toLowerCase();plugin.uuid=this.GetYoDigits(6,pluginName);if(!plugin.$element.attr('data-'+pluginName)){plugin.$element.attr('data-'+pluginName,plugin.uuid);}if(!plugin.$element.data('zfPlugin')){plugin.$element.data('zfPlugin',plugin);}/**
           * Fires when the plugin has initialized.
           * @event Plugin#init
           */plugin.$element.trigger('init.zf.'+pluginName);this._uuids.push(plugin.uuid);return;},/**
   * @function
   * Removes the plugins uuid from the _uuids array.
   * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
   * Also fires the destroyed event for the plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @fires Plugin#destroyed
   */unregisterPlugin:function unregisterPlugin(plugin){var pluginName=hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));this._uuids.splice(this._uuids.indexOf(plugin.uuid),1);plugin.$element.removeAttr('data-'+pluginName).removeData('zfPlugin')/**
           * Fires when the plugin has been destroyed.
           * @event Plugin#destroyed
           */.trigger('destroyed.zf.'+pluginName);for(var prop in plugin){plugin[prop]=null;//clean up script to prep for garbage collection.
}return;},/**
   * @function
   * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
   * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
   * @default If no argument is passed, reflow all currently active plugins.
   */reInit:function reInit(plugins){var isJQ=plugins instanceof $;try{if(isJQ){plugins.each(function(){$(this).data('zfPlugin')._init();});}else{var type=typeof plugins==='undefined'?'undefined':_typeof(plugins),_this=this,fns={'object':function object(plgs){plgs.forEach(function(p){p=hyphenate(p);$('[data-'+p+']').foundation('_init');});},'string':function string(){plugins=hyphenate(plugins);$('[data-'+plugins+']').foundation('_init');},'undefined':function undefined(){this['object'](Object.keys(_this._plugins));}};fns[type](plugins);}}catch(err){console.error(err);}finally{return plugins;}},/**
   * returns a random base-36 uid with namespacing
   * @function
   * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
   * @param {String} namespace - name of plugin to be incorporated in uid, optional.
   * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
   * @returns {String} - unique id
   */GetYoDigits:function GetYoDigits(length,namespace){length=length||6;return Math.round(Math.pow(36,length+1)-Math.random()*Math.pow(36,length)).toString(36).slice(1)+(namespace?'-'+namespace:'');},/**
   * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
   * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
   * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
   */reflow:function reflow(elem,plugins){// If plugins is undefined, just grab everything
if(typeof plugins==='undefined'){plugins=Object.keys(this._plugins);}// If plugins is a string, convert it to an array with one item
else if(typeof plugins==='string'){plugins=[plugins];}var _this=this;// Iterate through each plugin
$.each(plugins,function(i,name){// Get the current plugin
var plugin=_this._plugins[name];// Localize the search to all elements inside elem, as well as elem itself, unless elem === document
var $elem=$(elem).find('[data-'+name+']').addBack('[data-'+name+']');// For each plugin found, initialize it
$elem.each(function(){var $el=$(this),opts={};// Don't double-dip on plugins
if($el.data('zfPlugin')){console.warn("Tried to initialize "+name+" on an element that already has a Foundation plugin.");return;}if($el.attr('data-options')){var thing=$el.attr('data-options').split(';').forEach(function(e,i){var opt=e.split(':').map(function(el){return el.trim();});if(opt[0])opts[opt[0]]=parseValue(opt[1]);});}try{$el.data('zfPlugin',new plugin($(this),opts));}catch(er){console.error(er);}finally{return;}});});},getFnName:functionName,transitionend:function transitionend($elem){var transitions={'transition':'transitionend','WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend','OTransition':'otransitionend'};var elem=document.createElement('div'),end;for(var t in transitions){if(typeof elem.style[t]!=='undefined'){end=transitions[t];}}if(end){return end;}else{end=setTimeout(function(){$elem.triggerHandler('transitionend',[$elem]);},1);return'transitionend';}}};Foundation.util={/**
   * Function for applying a debounce effect to a function call.
   * @function
   * @param {Function} func - Function to be called at end of timeout.
   * @param {Number} delay - Time in ms to delay the call of `func`.
   * @returns function
   */throttle:function throttle(func,delay){var timer=null;return function(){var context=this,args=arguments;if(timer===null){timer=setTimeout(function(){func.apply(context,args);timer=null;},delay);}};}};// TODO: consider not making this a jQuery function
// TODO: need way to reflow vs. re-initialize
/**
 * The Foundation jQuery method.
 * @param {String|Array} method - An action to perform on the current jQuery object.
 */var foundation=function foundation(method){var type=typeof method==='undefined'?'undefined':_typeof(method),$meta=$('meta.foundation-mq'),$noJS=$('.no-js');if(!$meta.length){$('<meta class="foundation-mq">').appendTo(document.head);}if($noJS.length){$noJS.removeClass('no-js');}if(type==='undefined'){//needs to initialize the Foundation object, or an individual plugin.
Foundation.MediaQuery._init();Foundation.reflow(this);}else if(type==='string'){//an individual method to invoke on a plugin or group of plugins
var args=Array.prototype.slice.call(arguments,1);//collect all the arguments, if necessary
var plugClass=this.data('zfPlugin');//determine the class of plugin
if(plugClass!==undefined&&plugClass[method]!==undefined){//make sure both the class and method exist
if(this.length===1){//if there's only one, call it directly.
plugClass[method].apply(plugClass,args);}else{this.each(function(i,el){//otherwise loop through the jQuery collection and invoke the method on each
plugClass[method].apply($(el).data('zfPlugin'),args);});}}else{//error for no class or no method
throw new ReferenceError("We're sorry, '"+method+"' is not an available method for "+(plugClass?functionName(plugClass):'this element')+'.');}}else{//error for invalid argument type
throw new TypeError('We\'re sorry, '+type+' is not a valid parameter. You must use a string representing the method you wish to invoke.');}return this;};window.Foundation=Foundation;$.fn.foundation=foundation;// Polyfill for requestAnimationFrame
(function(){if(!Date.now||!window.Date.now)window.Date.now=Date.now=function(){return new Date().getTime();};var vendors=['webkit','moz'];for(var i=0;i<vendors.length&&!window.requestAnimationFrame;++i){var vp=vendors[i];window.requestAnimationFrame=window[vp+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vp+'CancelAnimationFrame']||window[vp+'CancelRequestAnimationFrame'];}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var lastTime=0;window.requestAnimationFrame=function(callback){var now=Date.now();var nextTime=Math.max(lastTime+16,now);return setTimeout(function(){callback(lastTime=nextTime);},nextTime-now);};window.cancelAnimationFrame=clearTimeout;}/**
   * Polyfill for performance.now, required by rAF
   */if(!window.performance||!window.performance.now){window.performance={start:Date.now(),now:function now(){return Date.now()-this.start;}};}})();if(!Function.prototype.bind){Function.prototype.bind=function(oThis){if(typeof this!=='function'){// closest thing possible to the ECMAScript 5
// internal IsCallable function
throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');}var aArgs=Array.prototype.slice.call(arguments,1),fToBind=this,fNOP=function fNOP(){},fBound=function fBound(){return fToBind.apply(this instanceof fNOP?this:oThis,aArgs.concat(Array.prototype.slice.call(arguments)));};if(this.prototype){// native functions don't have a prototype
fNOP.prototype=this.prototype;}fBound.prototype=new fNOP();return fBound;};}// Polyfill to get the name of a function in IE9
function functionName(fn){if(Function.prototype.name===undefined){var funcNameRegex=/function\s([^(]{1,})\(/;var results=funcNameRegex.exec(fn.toString());return results&&results.length>1?results[1].trim():"";}else if(fn.prototype===undefined){return fn.constructor.name;}else{return fn.prototype.constructor.name;}}function parseValue(str){if('true'===str)return true;else if('false'===str)return false;else if(!isNaN(str*1))return parseFloat(str);return str;}// Convert PascalCase to kebab-case
// Thank you: http://stackoverflow.com/a/8955580
function hyphenate(str){return str.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();}}(jQuery);
'use strict';!function($){Foundation.Box={ImNotTouchingYou:ImNotTouchingYou,GetDimensions:GetDimensions,GetOffsets:GetOffsets/**
 * Compares the dimensions of an element to a container and determines collision events with container.
 * @function
 * @param {jQuery} element - jQuery object to test for collisions.
 * @param {jQuery} parent - jQuery object to use as bounding container.
 * @param {Boolean} lrOnly - set to true to check left and right values only.
 * @param {Boolean} tbOnly - set to true to check top and bottom values only.
 * @default if no parent object passed, detects collisions with `window`.
 * @returns {Boolean} - true if collision free, false if a collision in any direction.
 */};function ImNotTouchingYou(element,parent,lrOnly,tbOnly){var eleDims=GetDimensions(element),top,bottom,left,right;if(parent){var parDims=GetDimensions(parent);bottom=eleDims.offset.top+eleDims.height<=parDims.height+parDims.offset.top;top=eleDims.offset.top>=parDims.offset.top;left=eleDims.offset.left>=parDims.offset.left;right=eleDims.offset.left+eleDims.width<=parDims.width+parDims.offset.left;}else{bottom=eleDims.offset.top+eleDims.height<=eleDims.windowDims.height+eleDims.windowDims.offset.top;top=eleDims.offset.top>=eleDims.windowDims.offset.top;left=eleDims.offset.left>=eleDims.windowDims.offset.left;right=eleDims.offset.left+eleDims.width<=eleDims.windowDims.width;}var allDirs=[bottom,top,left,right];if(lrOnly){return left===right===true;}if(tbOnly){return top===bottom===true;}return allDirs.indexOf(false)===-1;};/**
 * Uses native methods to return an object of dimension values.
 * @function
 * @param {jQuery || HTML} element - jQuery object or DOM element for which to get the dimensions. Can be any element other that document or window.
 * @returns {Object} - nested object of integer pixel values
 * TODO - if element is window, return only those values.
 */function GetDimensions(elem,test){elem=elem.length?elem[0]:elem;if(elem===window||elem===document){throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");}var rect=elem.getBoundingClientRect(),parRect=elem.parentNode.getBoundingClientRect(),winRect=document.body.getBoundingClientRect(),winY=window.pageYOffset,winX=window.pageXOffset;return{width:rect.width,height:rect.height,offset:{top:rect.top+winY,left:rect.left+winX},parentDims:{width:parRect.width,height:parRect.height,offset:{top:parRect.top+winY,left:parRect.left+winX}},windowDims:{width:winRect.width,height:winRect.height,offset:{top:winY,left:winX}}};}/**
 * Returns an object of top and left integer pixel values for dynamically rendered elements,
 * such as: Tooltip, Reveal, and Dropdown
 * @function
 * @param {jQuery} element - jQuery object for the element being positioned.
 * @param {jQuery} anchor - jQuery object for the element's anchor point.
 * @param {String} position - a string relating to the desired position of the element, relative to it's anchor
 * @param {Number} vOffset - integer pixel value of desired vertical separation between anchor and element.
 * @param {Number} hOffset - integer pixel value of desired horizontal separation between anchor and element.
 * @param {Boolean} isOverflow - if a collision event is detected, sets to true to default the element to full width - any desired offset.
 * TODO alter/rewrite to work with `em` values as well/instead of pixels
 */function GetOffsets(element,anchor,position,vOffset,hOffset,isOverflow){var $eleDims=GetDimensions(element),$anchorDims=anchor?GetDimensions(anchor):null;switch(position){case'top':return{left:Foundation.rtl()?$anchorDims.offset.left-$eleDims.width+$anchorDims.width:$anchorDims.offset.left,top:$anchorDims.offset.top-($eleDims.height+vOffset)};break;case'left':return{left:$anchorDims.offset.left-($eleDims.width+hOffset),top:$anchorDims.offset.top};break;case'right':return{left:$anchorDims.offset.left+$anchorDims.width+hOffset,top:$anchorDims.offset.top};break;case'center top':return{left:$anchorDims.offset.left+$anchorDims.width/2-$eleDims.width/2,top:$anchorDims.offset.top-($eleDims.height+vOffset)};break;case'center bottom':return{left:isOverflow?hOffset:$anchorDims.offset.left+$anchorDims.width/2-$eleDims.width/2,top:$anchorDims.offset.top+$anchorDims.height+vOffset};break;case'center left':return{left:$anchorDims.offset.left-($eleDims.width+hOffset),top:$anchorDims.offset.top+$anchorDims.height/2-$eleDims.height/2};break;case'center right':return{left:$anchorDims.offset.left+$anchorDims.width+hOffset+1,top:$anchorDims.offset.top+$anchorDims.height/2-$eleDims.height/2};break;case'center':return{left:$eleDims.windowDims.offset.left+$eleDims.windowDims.width/2-$eleDims.width/2,top:$eleDims.windowDims.offset.top+$eleDims.windowDims.height/2-$eleDims.height/2};break;case'reveal':return{left:($eleDims.windowDims.width-$eleDims.width)/2,top:$eleDims.windowDims.offset.top+vOffset};case'reveal full':return{left:$eleDims.windowDims.offset.left,top:$eleDims.windowDims.offset.top};break;case'left bottom':return{left:$anchorDims.offset.left,top:$anchorDims.offset.top+$anchorDims.height+vOffset};break;case'right bottom':return{left:$anchorDims.offset.left+$anchorDims.width+hOffset-$eleDims.width,top:$anchorDims.offset.top+$anchorDims.height+vOffset};break;default:return{left:Foundation.rtl()?$anchorDims.offset.left-$eleDims.width+$anchorDims.width:$anchorDims.offset.left+hOffset,top:$anchorDims.offset.top+$anchorDims.height+vOffset};}}}(jQuery);
/*******************************************
 *                                         *
 * This util was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/'use strict';!function($){var keyCodes={9:'TAB',13:'ENTER',27:'ESCAPE',32:'SPACE',37:'ARROW_LEFT',38:'ARROW_UP',39:'ARROW_RIGHT',40:'ARROW_DOWN'};var commands={};var Keyboard={keys:getKeyCodes(keyCodes),/**
   * Parses the (keyboard) event and returns a String that represents its key
   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
   * @param {Event} event - the event generated by the event handler
   * @return String key - String that represents the key pressed
   */parseKey:function parseKey(event){var key=keyCodes[event.which||event.keyCode]||String.fromCharCode(event.which).toUpperCase();// Remove un-printable characters, e.g. for `fromCharCode` calls for CTRL only events
key=key.replace(/\W+/,'');if(event.shiftKey)key='SHIFT_'+key;if(event.ctrlKey)key='CTRL_'+key;if(event.altKey)key='ALT_'+key;// Remove trailing underscore, in case only modifiers were used (e.g. only `CTRL_ALT`)
key=key.replace(/_$/,'');return key;},/**
   * Handles the given (keyboard) event
   * @param {Event} event - the event generated by the event handler
   * @param {String} component - Foundation component's name, e.g. Slider or Reveal
   * @param {Objects} functions - collection of functions that are to be executed
   */handleKey:function handleKey(event,component,functions){var commandList=commands[component],keyCode=this.parseKey(event),cmds,command,fn;if(!commandList)return console.warn('Component not defined!');if(typeof commandList.ltr==='undefined'){// this component does not differentiate between ltr and rtl
cmds=commandList;// use plain list
}else{// merge ltr and rtl: if document is rtl, rtl overwrites ltr and vice versa
if(Foundation.rtl())cmds=$.extend({},commandList.ltr,commandList.rtl);else cmds=$.extend({},commandList.rtl,commandList.ltr);}command=cmds[keyCode];fn=functions[command];if(fn&&typeof fn==='function'){// execute function  if exists
var returnValue=fn.apply();if(functions.handled||typeof functions.handled==='function'){// execute function when event was handled
functions.handled(returnValue);}}else{if(functions.unhandled||typeof functions.unhandled==='function'){// execute function when event was not handled
functions.unhandled();}}},/**
   * Finds all focusable elements within the given `$element`
   * @param {jQuery} $element - jQuery object to search within
   * @return {jQuery} $focusable - all focusable elements within `$element`
   */findFocusable:function findFocusable($element){if(!$element){return false;}return $element.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]').filter(function(){if(!$(this).is(':visible')||$(this).attr('tabindex')<0){return false;}//only have visible elements and those that have a tabindex greater or equal 0
return true;});},/**
   * Returns the component name name
   * @param {Object} component - Foundation component, e.g. Slider or Reveal
   * @return String componentName
   */register:function register(componentName,cmds){commands[componentName]=cmds;},/**
   * Traps the focus in the given element.
   * @param  {jQuery} $element  jQuery object to trap the foucs into.
   */trapFocus:function trapFocus($element){var $focusable=Foundation.Keyboard.findFocusable($element),$firstFocusable=$focusable.eq(0),$lastFocusable=$focusable.eq(-1);$element.on('keydown.zf.trapfocus',function(event){if(event.target===$lastFocusable[0]&&Foundation.Keyboard.parseKey(event)==='TAB'){event.preventDefault();$firstFocusable.focus();}else if(event.target===$firstFocusable[0]&&Foundation.Keyboard.parseKey(event)==='SHIFT_TAB'){event.preventDefault();$lastFocusable.focus();}});},/**
   * Releases the trapped focus from the given element.
   * @param  {jQuery} $element  jQuery object to release the focus for.
   */releaseFocus:function releaseFocus($element){$element.off('keydown.zf.trapfocus');}};/*
 * Constants for easier comparing.
 * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
 */function getKeyCodes(kcs){var k={};for(var kc in kcs){k[kcs[kc]]=kcs[kc];}return k;}Foundation.Keyboard=Keyboard;}(jQuery);
'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function($){// Default set of media queries
var defaultQueries={'default':'only screen',landscape:'only screen and (orientation: landscape)',portrait:'only screen and (orientation: portrait)',retina:'only screen and (-webkit-min-device-pixel-ratio: 2),'+'only screen and (min--moz-device-pixel-ratio: 2),'+'only screen and (-o-min-device-pixel-ratio: 2/1),'+'only screen and (min-device-pixel-ratio: 2),'+'only screen and (min-resolution: 192dpi),'+'only screen and (min-resolution: 2dppx)'};var MediaQuery={queries:[],current:'',/**
   * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
   * @function
   * @private
   */_init:function _init(){var self=this;var extractedStyles=$('.foundation-mq').css('font-family');var namedQueries;namedQueries=parseStyleToObject(extractedStyles);for(var key in namedQueries){if(namedQueries.hasOwnProperty(key)){self.queries.push({name:key,value:'only screen and (min-width: '+namedQueries[key]+')'});}}this.current=this._getCurrentSize();this._watcher();},/**
   * Checks if the screen is at least as wide as a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
   */atLeast:function atLeast(size){var query=this.get(size);if(query){return window.matchMedia(query).matches;}return false;},/**
   * Checks if the screen matches to a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check, either 'small only' or 'small'. Omitting 'only' falls back to using atLeast() method.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it does not.
   */is:function is(size){size=size.trim().split(' ');if(size.length>1&&size[1]==='only'){if(size[0]===this._getCurrentSize())return true;}else{return this.atLeast(size[0]);}return false;},/**
   * Gets the media query of a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to get.
   * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
   */get:function get(size){for(var i in this.queries){if(this.queries.hasOwnProperty(i)){var query=this.queries[i];if(size===query.name)return query.value;}}return null;},/**
   * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
   * @function
   * @private
   * @returns {String} Name of the current breakpoint.
   */_getCurrentSize:function _getCurrentSize(){var matched;for(var i=0;i<this.queries.length;i++){var query=this.queries[i];if(window.matchMedia(query.value).matches){matched=query;}}if((typeof matched==='undefined'?'undefined':_typeof(matched))==='object'){return matched.name;}else{return matched;}},/**
   * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
   * @function
   * @private
   */_watcher:function _watcher(){var _this=this;$(window).on('resize.zf.mediaquery',function(){var newSize=_this._getCurrentSize(),currentSize=_this.current;if(newSize!==currentSize){// Change the current media query
_this.current=newSize;// Broadcast the media query change on the window
$(window).trigger('changed.zf.mediaquery',[newSize,currentSize]);}});}};Foundation.MediaQuery=MediaQuery;// matchMedia() polyfill - Test a CSS media type/query in JS.
// Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
window.matchMedia||(window.matchMedia=function(){'use strict';// For browsers that support matchMedium api such as IE 9 and webkit
var styleMedia=window.styleMedia||window.media;// For those that don't support matchMedium
if(!styleMedia){var style=document.createElement('style'),script=document.getElementsByTagName('script')[0],info=null;style.type='text/css';style.id='matchmediajs-test';script&&script.parentNode&&script.parentNode.insertBefore(style,script);// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
info='getComputedStyle'in window&&window.getComputedStyle(style,null)||style.currentStyle;styleMedia={matchMedium:function matchMedium(media){var text='@media '+media+'{ #matchmediajs-test { width: 1px; } }';// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
if(style.styleSheet){style.styleSheet.cssText=text;}else{style.textContent=text;}// Test if media query is true or false
return info.width==='1px';}};}return function(media){return{matches:styleMedia.matchMedium(media||'all'),media:media||'all'};};}());// Thank you: https://github.com/sindresorhus/query-string
function parseStyleToObject(str){var styleObject={};if(typeof str!=='string'){return styleObject;}str=str.trim().slice(1,-1);// browsers re-quote string style values
if(!str){return styleObject;}styleObject=str.split('&').reduce(function(ret,param){var parts=param.replace(/\+/g,' ').split('=');var key=parts[0];var val=parts[1];key=decodeURIComponent(key);// missing `=` should be `null`:
// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
val=val===undefined?null:decodeURIComponent(val);if(!ret.hasOwnProperty(key)){ret[key]=val;}else if(Array.isArray(ret[key])){ret[key].push(val);}else{ret[key]=[ret[key],val];}return ret;},{});return styleObject;}Foundation.MediaQuery=MediaQuery;}(jQuery);
'use strict';!function($){/**
 * Motion module.
 * @module foundation.motion
 */var initClasses=['mui-enter','mui-leave'];var activeClasses=['mui-enter-active','mui-leave-active'];var Motion={animateIn:function animateIn(element,animation,cb){animate(true,element,animation,cb);},animateOut:function animateOut(element,animation,cb){animate(false,element,animation,cb);}};function Move(duration,elem,fn){var anim,prog,start=null;// console.log('called');
if(duration===0){fn.apply(elem);elem.trigger('finished.zf.animate',[elem]).triggerHandler('finished.zf.animate',[elem]);return;}function move(ts){if(!start)start=ts;// console.log(start, ts);
prog=ts-start;fn.apply(elem);if(prog<duration){anim=window.requestAnimationFrame(move,elem);}else{window.cancelAnimationFrame(anim);elem.trigger('finished.zf.animate',[elem]).triggerHandler('finished.zf.animate',[elem]);}}anim=window.requestAnimationFrame(move);}/**
 * Animates an element in or out using a CSS transition class.
 * @function
 * @private
 * @param {Boolean} isIn - Defines if the animation is in or out.
 * @param {Object} element - jQuery or HTML object to animate.
 * @param {String} animation - CSS class to use.
 * @param {Function} cb - Callback to run when animation is finished.
 */function animate(isIn,element,animation,cb){element=$(element).eq(0);if(!element.length)return;var initClass=isIn?initClasses[0]:initClasses[1];var activeClass=isIn?activeClasses[0]:activeClasses[1];// Set up the animation
reset();element.addClass(animation).css('transition','none');requestAnimationFrame(function(){element.addClass(initClass);if(isIn)element.show();});// Start the animation
requestAnimationFrame(function(){element[0].offsetWidth;element.css('transition','').addClass(activeClass);});// Clean up the animation when it finishes
element.one(Foundation.transitionend(element),finish);// Hides the element (for out animations), resets the element, and runs a callback
function finish(){if(!isIn)element.hide();reset();if(cb)cb.apply(element);}// Resets transitions and removes motion-specific classes
function reset(){element[0].style.transitionDuration=0;element.removeClass(initClass+' '+activeClass+' '+animation);}}Foundation.Move=Move;Foundation.Motion=Motion;}(jQuery);
'use strict';!function($){var Nest={Feather:function Feather(menu){var type=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'zf';menu.attr('role','menubar');var items=menu.find('li').attr({'role':'menuitem'}),subMenuClass='is-'+type+'-submenu',subItemClass=subMenuClass+'-item',hasSubClass='is-'+type+'-submenu-parent';items.each(function(){var $item=$(this),$sub=$item.children('ul');if($sub.length){$item.addClass(hasSubClass).attr({'aria-haspopup':true,'aria-label':$item.children('a:first').text()});// Note:  Drilldowns behave differently in how they hide, and so need
// additional attributes.  We should look if this possibly over-generalized
// utility (Nest) is appropriate when we rework menus in 6.4
if(type==='drilldown'){$item.attr({'aria-expanded':false});}$sub.addClass('submenu '+subMenuClass).attr({'data-submenu':'','role':'menu'});if(type==='drilldown'){$sub.attr({'aria-hidden':true});}}if($item.parent('[data-submenu]').length){$item.addClass('is-submenu-item '+subItemClass);}});return;},Burn:function Burn(menu,type){var//items = menu.find('li'),
subMenuClass='is-'+type+'-submenu',subItemClass=subMenuClass+'-item',hasSubClass='is-'+type+'-submenu-parent';menu.find('>li, .menu, .menu > li').removeClass(subMenuClass+' '+subItemClass+' '+hasSubClass+' is-submenu-item submenu is-active').removeAttr('data-submenu').css('display','');// console.log(      menu.find('.' + subMenuClass + ', .' + subItemClass + ', .has-submenu, .is-submenu-item, .submenu, [data-submenu]')
//           .removeClass(subMenuClass + ' ' + subItemClass + ' has-submenu is-submenu-item submenu')
//           .removeAttr('data-submenu'));
// items.each(function(){
//   var $item = $(this),
//       $sub = $item.children('ul');
//   if($item.parent('[data-submenu]').length){
//     $item.removeClass('is-submenu-item ' + subItemClass);
//   }
//   if($sub.length){
//     $item.removeClass('has-submenu');
//     $sub.removeClass('submenu ' + subMenuClass).removeAttr('data-submenu');
//   }
// });
}};Foundation.Nest=Nest;}(jQuery);
'use strict';!function($){function Timer(elem,options,cb){var _this=this,duration=options.duration,//options is an object for easily adding features later.
nameSpace=Object.keys(elem.data())[0]||'timer',remain=-1,start,timer;this.isPaused=false;this.restart=function(){remain=-1;clearTimeout(timer);this.start();};this.start=function(){this.isPaused=false;// if(!elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
clearTimeout(timer);remain=remain<=0?duration:remain;elem.data('paused',false);start=Date.now();timer=setTimeout(function(){if(options.infinite){_this.restart();//rerun the timer.
}if(cb&&typeof cb==='function'){cb();}},remain);elem.trigger('timerstart.zf.'+nameSpace);};this.pause=function(){this.isPaused=true;//if(elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
clearTimeout(timer);elem.data('paused',true);var end=Date.now();remain=remain-(end-start);elem.trigger('timerpaused.zf.'+nameSpace);};}/**
 * Runs a callback function when images are fully loaded.
 * @param {Object} images - Image(s) to check if loaded.
 * @param {Func} callback - Function to execute when image is fully loaded.
 */function onImagesLoaded(images,callback){var self=this,unloaded=images.length;if(unloaded===0){callback();}images.each(function(){// Check if image is loaded
if(this.complete||this.readyState===4||this.readyState==='complete'){singleImageLoaded();}// Force load the image
else{// fix for IE. See https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
var src=$(this).attr('src');$(this).attr('src',src+(src.indexOf('?')>=0?'&':'?')+new Date().getTime());$(this).one('load',function(){singleImageLoaded();});}});function singleImageLoaded(){unloaded--;if(unloaded===0){callback();}}}Foundation.Timer=Timer;Foundation.onImagesLoaded=onImagesLoaded;}(jQuery);
'use strict';//**************************************************
//**Work inspired by multiple jquery swipe plugins**
//**Done by Yohai Ararat ***************************
//**************************************************
(function($){$.spotSwipe={version:'1.0.0',enabled:'ontouchstart'in document.documentElement,preventDefault:false,moveThreshold:75,timeThreshold:200};var startPosX,startPosY,startTime,elapsedTime,isMoving=false;function onTouchEnd(){//  alert(this);
this.removeEventListener('touchmove',onTouchMove);this.removeEventListener('touchend',onTouchEnd);isMoving=false;}function onTouchMove(e){if($.spotSwipe.preventDefault){e.preventDefault();}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startPosX-x;var dy=startPosY-y;var dir;elapsedTime=new Date().getTime()-startTime;if(Math.abs(dx)>=$.spotSwipe.moveThreshold&&elapsedTime<=$.spotSwipe.timeThreshold){dir=dx>0?'left':'right';}// else if(Math.abs(dy) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
//   dir = dy > 0 ? 'down' : 'up';
// }
if(dir){e.preventDefault();onTouchEnd.call(this);$(this).trigger('swipe',dir).trigger('swipe'+dir);}}}function onTouchStart(e){if(e.touches.length==1){startPosX=e.touches[0].pageX;startPosY=e.touches[0].pageY;isMoving=true;startTime=new Date().getTime();this.addEventListener('touchmove',onTouchMove,false);this.addEventListener('touchend',onTouchEnd,false);}}function init(){this.addEventListener&&this.addEventListener('touchstart',onTouchStart,false);}function teardown(){this.removeEventListener('touchstart',onTouchStart);}$.event.special.swipe={setup:init};$.each(['left','up','down','right'],function(){$.event.special['swipe'+this]={setup:function setup(){$(this).on('swipe',$.noop);}};});})(jQuery);/****************************************************
 * Method for adding psuedo drag events to elements *
 ***************************************************/!function($){$.fn.addTouch=function(){this.each(function(i,el){$(el).bind('touchstart touchmove touchend touchcancel',function(){//we pass the original event object because the jQuery event
//object is normalized to w3c specs and does not provide the TouchList
handleTouch(event);});});var handleTouch=function handleTouch(event){var touches=event.changedTouches,first=touches[0],eventTypes={touchstart:'mousedown',touchmove:'mousemove',touchend:'mouseup'},type=eventTypes[event.type],simulatedEvent;if('MouseEvent'in window&&typeof window.MouseEvent==='function'){simulatedEvent=new window.MouseEvent(type,{'bubbles':true,'cancelable':true,'screenX':first.screenX,'screenY':first.screenY,'clientX':first.clientX,'clientY':first.clientY});}else{simulatedEvent=document.createEvent('MouseEvent');simulatedEvent.initMouseEvent(type,true,true,window,1,first.screenX,first.screenY,first.clientX,first.clientY,false,false,false,false,0/*left*/,null);}first.target.dispatchEvent(simulatedEvent);};};}(jQuery);//**********************************
//**From the jQuery Mobile Library**
//**need to recreate functionality**
//**and try to improve if possible**
//**********************************
/* Removing the jQuery function ****
************************************

(function( $, window, undefined ) {

	var $document = $( document ),
		// supportTouch = $.mobile.support.touch,
		touchStartEvent = 'touchstart'//supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = 'touchend'//supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = 'touchmove'//supportTouch ? "touchmove" : "mousemove";

	// setup new event shortcuts
	$.each( ( "touchstart touchmove touchend " +
		"swipe swipeleft swiperight" ).split( " " ), function( i, name ) {

		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};

		// jQuery < 1.8
		if ( $.attrFn ) {
			$.attrFn[ name ] = true;
		}
	});

	function triggerCustomEvent( obj, eventType, event, bubble ) {
		var originalType = event.type;
		event.type = eventType;
		if ( bubble ) {
			$.event.trigger( event, undefined, obj );
		} else {
			$.event.dispatch.call( obj, event );
		}
		event.type = originalType;
	}

	// also handles taphold

	// Also handles swipeleft, swiperight
	$.event.special.swipe = {

		// More than this horizontal displacement, and we will suppress scrolling.
		scrollSupressionThreshold: 30,

		// More time than this, and it isn't a swipe.
		durationThreshold: 1000,

		// Swipe horizontal displacement must be more than this.
		horizontalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,

		// Swipe vertical displacement must be less than this.
		verticalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,

		getLocation: function ( event ) {
			var winPageX = window.pageXOffset,
				winPageY = window.pageYOffset,
				x = event.clientX,
				y = event.clientY;

			if ( event.pageY === 0 && Math.floor( y ) > Math.floor( event.pageY ) ||
				event.pageX === 0 && Math.floor( x ) > Math.floor( event.pageX ) ) {

				// iOS4 clientX/clientY have the value that should have been
				// in pageX/pageY. While pageX/page/ have the value 0
				x = x - winPageX;
				y = y - winPageY;
			} else if ( y < ( event.pageY - winPageY) || x < ( event.pageX - winPageX ) ) {

				// Some Android browsers have totally bogus values for clientX/Y
				// when scrolling/zooming a page. Detectable since clientX/clientY
				// should never be smaller than pageX/pageY minus page scroll
				x = event.pageX - winPageX;
				y = event.pageY - winPageY;
			}

			return {
				x: x,
				y: y
			};
		},

		start: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event,
				location = $.event.special.swipe.getLocation( data );
			return {
						time: ( new Date() ).getTime(),
						coords: [ location.x, location.y ],
						origin: $( event.target )
					};
		},

		stop: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event,
				location = $.event.special.swipe.getLocation( data );
			return {
						time: ( new Date() ).getTime(),
						coords: [ location.x, location.y ]
					};
		},

		handleSwipe: function( start, stop, thisObject, origTarget ) {
			if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
				Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {
				var direction = start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight";

				triggerCustomEvent( thisObject, "swipe", $.Event( "swipe", { target: origTarget, swipestart: start, swipestop: stop }), true );
				triggerCustomEvent( thisObject, direction,$.Event( direction, { target: origTarget, swipestart: start, swipestop: stop } ), true );
				return true;
			}
			return false;

		},

		// This serves as a flag to ensure that at most one swipe event event is
		// in work at any given time
		eventInProgress: false,

		setup: function() {
			var events,
				thisObject = this,
				$this = $( thisObject ),
				context = {};

			// Retrieve the events data for this element and add the swipe context
			events = $.data( this, "mobile-events" );
			if ( !events ) {
				events = { length: 0 };
				$.data( this, "mobile-events", events );
			}
			events.length++;
			events.swipe = context;

			context.start = function( event ) {

				// Bail if we're already working on a swipe event
				if ( $.event.special.swipe.eventInProgress ) {
					return;
				}
				$.event.special.swipe.eventInProgress = true;

				var stop,
					start = $.event.special.swipe.start( event ),
					origTarget = event.target,
					emitted = false;

				context.move = function( event ) {
					if ( !start || event.isDefaultPrevented() ) {
						return;
					}

					stop = $.event.special.swipe.stop( event );
					if ( !emitted ) {
						emitted = $.event.special.swipe.handleSwipe( start, stop, thisObject, origTarget );
						if ( emitted ) {

							// Reset the context to make way for the next swipe event
							$.event.special.swipe.eventInProgress = false;
						}
					}
					// prevent scrolling
					if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
						event.preventDefault();
					}
				};

				context.stop = function() {
						emitted = true;

						// Reset the context to make way for the next swipe event
						$.event.special.swipe.eventInProgress = false;
						$document.off( touchMoveEvent, context.move );
						context.move = null;
				};

				$document.on( touchMoveEvent, context.move )
					.one( touchStopEvent, context.stop );
			};
			$this.on( touchStartEvent, context.start );
		},

		teardown: function() {
			var events, context;

			events = $.data( this, "mobile-events" );
			if ( events ) {
				context = events.swipe;
				delete events.swipe;
				events.length--;
				if ( events.length === 0 ) {
					$.removeData( this, "mobile-events" );
				}
			}

			if ( context ) {
				if ( context.start ) {
					$( this ).off( touchStartEvent, context.start );
				}
				if ( context.move ) {
					$document.off( touchMoveEvent, context.move );
				}
				if ( context.stop ) {
					$document.off( touchStopEvent, context.stop );
				}
			}
		}
	};
	$.each({
		swipeleft: "swipe.left",
		swiperight: "swipe.right"
	}, function( event, sourceEvent ) {

		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			},
			teardown: function() {
				$( this ).unbind( sourceEvent );
			}
		};
	});
})( jQuery, this );
*/
'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function($){var MutationObserver=function(){var prefixes=['WebKit','Moz','O','Ms',''];for(var i=0;i<prefixes.length;i++){if(prefixes[i]+'MutationObserver'in window){return window[prefixes[i]+'MutationObserver'];}}return false;}();var triggers=function triggers(el,type){el.data(type).split(' ').forEach(function(id){$('#'+id)[type==='close'?'trigger':'triggerHandler'](type+'.zf.trigger',[el]);});};// Elements with [data-open] will reveal a plugin that supports it when clicked.
$(document).on('click.zf.trigger','[data-open]',function(){triggers($(this),'open');});// Elements with [data-close] will close a plugin that supports it when clicked.
// If used without a value on [data-close], the event will bubble, allowing it to close a parent component.
$(document).on('click.zf.trigger','[data-close]',function(){var id=$(this).data('close');if(id){triggers($(this),'close');}else{$(this).trigger('close.zf.trigger');}});// Elements with [data-toggle] will toggle a plugin that supports it when clicked.
$(document).on('click.zf.trigger','[data-toggle]',function(){var id=$(this).data('toggle');if(id){triggers($(this),'toggle');}else{$(this).trigger('toggle.zf.trigger');}});// Elements with [data-closable] will respond to close.zf.trigger events.
$(document).on('close.zf.trigger','[data-closable]',function(e){e.stopPropagation();var animation=$(this).data('closable');if(animation!==''){Foundation.Motion.animateOut($(this),animation,function(){$(this).trigger('closed.zf');});}else{$(this).fadeOut().trigger('closed.zf');}});$(document).on('focus.zf.trigger blur.zf.trigger','[data-toggle-focus]',function(){var id=$(this).data('toggle-focus');$('#'+id).triggerHandler('toggle.zf.trigger',[$(this)]);});/**
* Fires once after all other scripts have loaded
* @function
* @private
*/$(window).on('load',function(){checkListeners();});function checkListeners(){eventsListener();resizeListener();scrollListener();closemeListener();}//******** only fires this function once on load, if there's something to watch ********
function closemeListener(pluginName){var yetiBoxes=$('[data-yeti-box]'),plugNames=['dropdown','tooltip','reveal'];if(pluginName){if(typeof pluginName==='string'){plugNames.push(pluginName);}else if((typeof pluginName==='undefined'?'undefined':_typeof(pluginName))==='object'&&typeof pluginName[0]==='string'){plugNames.concat(pluginName);}else{console.error('Plugin names must be strings');}}if(yetiBoxes.length){var listeners=plugNames.map(function(name){return'closeme.zf.'+name;}).join(' ');$(window).off(listeners).on(listeners,function(e,pluginId){var plugin=e.namespace.split('.')[0];var plugins=$('[data-'+plugin+']').not('[data-yeti-box="'+pluginId+'"]');plugins.each(function(){var _this=$(this);_this.triggerHandler('close.zf.trigger',[_this]);});});}}function resizeListener(debounce){var timer=void 0,$nodes=$('[data-resize]');if($nodes.length){$(window).off('resize.zf.trigger').on('resize.zf.trigger',function(e){if(timer){clearTimeout(timer);}timer=setTimeout(function(){if(!MutationObserver){//fallback for IE 9
$nodes.each(function(){$(this).triggerHandler('resizeme.zf.trigger');});}//trigger all listening elements and signal a resize event
$nodes.attr('data-events',"resize");},debounce||10);//default time to emit resize event
});}}function scrollListener(debounce){var timer=void 0,$nodes=$('[data-scroll]');if($nodes.length){$(window).off('scroll.zf.trigger').on('scroll.zf.trigger',function(e){if(timer){clearTimeout(timer);}timer=setTimeout(function(){if(!MutationObserver){//fallback for IE 9
$nodes.each(function(){$(this).triggerHandler('scrollme.zf.trigger');});}//trigger all listening elements and signal a scroll event
$nodes.attr('data-events',"scroll");},debounce||10);//default time to emit scroll event
});}}function eventsListener(){if(!MutationObserver){return false;}var nodes=document.querySelectorAll('[data-resize], [data-scroll], [data-mutate]');//element callback
var listeningElementsMutation=function listeningElementsMutation(mutationRecordsList){var $target=$(mutationRecordsList[0].target);//trigger the event handler for the element depending on type
switch(mutationRecordsList[0].type){case"attributes":if($target.attr("data-events")==="scroll"&&mutationRecordsList[0].attributeName==="data-events"){$target.triggerHandler('scrollme.zf.trigger',[$target,window.pageYOffset]);}if($target.attr("data-events")==="resize"&&mutationRecordsList[0].attributeName==="data-events"){$target.triggerHandler('resizeme.zf.trigger',[$target]);}if(mutationRecordsList[0].attributeName==="style"){$target.closest("[data-mutate]").attr("data-events","mutate");$target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger',[$target.closest("[data-mutate]")]);}break;case"childList":$target.closest("[data-mutate]").attr("data-events","mutate");$target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger',[$target.closest("[data-mutate]")]);break;default:return false;//nothing
}};if(nodes.length){//for each element that needs to listen for resizing, scrolling, or mutation add a single observer
for(var i=0;i<=nodes.length-1;i++){var elementObserver=new MutationObserver(listeningElementsMutation);elementObserver.observe(nodes[i],{attributes:true,childList:true,characterData:false,subtree:true,attributeFilter:["data-events","style"]});}}}// ------------------------------------
// [PH]
// Foundation.CheckWatchers = checkWatchers;
Foundation.IHearYou=checkListeners;// Foundation.ISeeYou = scrollListener;
// Foundation.IFeelYou = closemeListener;
}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Accordion module.
 * @module foundation.accordion
 * @requires foundation.util.keyboard
 * @requires foundation.util.motion
 */var Accordion=function(){/**
   * Creates a new instance of an accordion.
   * @class
   * @fires Accordion#init
   * @param {jQuery} element - jQuery object to make into an accordion.
   * @param {Object} options - a plain object with settings to override the default options.
   */function Accordion(element,options){_classCallCheck(this,Accordion);this.$element=element;this.options=$.extend({},Accordion.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Accordion');Foundation.Keyboard.register('Accordion',{'ENTER':'toggle','SPACE':'toggle','ARROW_DOWN':'next','ARROW_UP':'previous'});}/**
   * Initializes the accordion by animating the preset active pane(s).
   * @private
   */_createClass(Accordion,[{key:'_init',value:function _init(){var _this2=this;this.$element.attr('role','tablist');this.$tabs=this.$element.children('[data-accordion-item]');this.$tabs.each(function(idx,el){var $el=$(el),$content=$el.children('[data-tab-content]'),id=$content[0].id||Foundation.GetYoDigits(6,'accordion'),linkId=el.id||id+'-label';$el.find('a:first').attr({'aria-controls':id,'role':'tab','id':linkId,'aria-expanded':false,'aria-selected':false});$content.attr({'role':'tabpanel','aria-labelledby':linkId,'aria-hidden':true,'id':id});});var $initActive=this.$element.find('.is-active').children('[data-tab-content]');this.firstTimeInit=true;if($initActive.length){this.down($initActive,this.firstTimeInit);this.firstTimeInit=false;}this._checkDeepLink=function(){var anchor=window.location.hash;//need a hash and a relevant anchor in this tabset
if(anchor.length){var $link=_this2.$element.find('[href$="'+anchor+'"]'),$anchor=$(anchor);if($link.length&&$anchor){if(!$link.parent('[data-accordion-item]').hasClass('is-active')){_this2.down($anchor,_this2.firstTimeInit);_this2.firstTimeInit=false;};//roll up a little to show the titles
if(_this2.options.deepLinkSmudge){var _this=_this2;$(window).load(function(){var offset=_this.$element.offset();$('html, body').animate({scrollTop:offset.top},_this.options.deepLinkSmudgeDelay);});}/**
            * Fires when the zplugin has deeplinked at pageload
            * @event Accordion#deeplink
            */_this2.$element.trigger('deeplink.zf.accordion',[$link,$anchor]);}}};//use browser to open a tab, if it exists in this tabset
if(this.options.deepLink){this._checkDeepLink();}this._events();}/**
   * Adds event handlers for items within the accordion.
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this.$tabs.each(function(){var $elem=$(this);var $tabContent=$elem.children('[data-tab-content]');if($tabContent.length){$elem.children('a').off('click.zf.accordion keydown.zf.accordion').on('click.zf.accordion',function(e){e.preventDefault();_this.toggle($tabContent);}).on('keydown.zf.accordion',function(e){Foundation.Keyboard.handleKey(e,'Accordion',{toggle:function toggle(){_this.toggle($tabContent);},next:function next(){var $a=$elem.next().find('a').focus();if(!_this.options.multiExpand){$a.trigger('click.zf.accordion');}},previous:function previous(){var $a=$elem.prev().find('a').focus();if(!_this.options.multiExpand){$a.trigger('click.zf.accordion');}},handled:function handled(){e.preventDefault();e.stopPropagation();}});});}});if(this.options.deepLink){$(window).on('popstate',this._checkDeepLink);}}/**
   * Toggles the selected content pane's open/close state.
   * @param {jQuery} $target - jQuery object of the pane to toggle (`.accordion-content`).
   * @function
   */},{key:'toggle',value:function toggle($target){if($target.parent().hasClass('is-active')){this.up($target);}else{this.down($target);}//either replace or update browser history
if(this.options.deepLink){var anchor=$target.prev('a').attr('href');if(this.options.updateHistory){history.pushState({},'',anchor);}else{history.replaceState({},'',anchor);}}}/**
   * Opens the accordion tab defined by `$target`.
   * @param {jQuery} $target - Accordion pane to open (`.accordion-content`).
   * @param {Boolean} firstTime - flag to determine if reflow should happen.
   * @fires Accordion#down
   * @function
   */},{key:'down',value:function down($target,firstTime){var _this3=this;$target.attr('aria-hidden',false).parent('[data-tab-content]').addBack().parent().addClass('is-active');if(!this.options.multiExpand&&!firstTime){var $currentActive=this.$element.children('.is-active').children('[data-tab-content]');if($currentActive.length){this.up($currentActive.not($target));}}$target.slideDown(this.options.slideSpeed,function(){/**
       * Fires when the tab is done opening.
       * @event Accordion#down
       */_this3.$element.trigger('down.zf.accordion',[$target]);});$('#'+$target.attr('aria-labelledby')).attr({'aria-expanded':true,'aria-selected':true});}/**
   * Closes the tab defined by `$target`.
   * @param {jQuery} $target - Accordion tab to close (`.accordion-content`).
   * @fires Accordion#up
   * @function
   */},{key:'up',value:function up($target){var $aunts=$target.parent().siblings(),_this=this;if(!this.options.allowAllClosed&&!$aunts.hasClass('is-active')||!$target.parent().hasClass('is-active')){return;}// Foundation.Move(this.options.slideSpeed, $target, function(){
$target.slideUp(_this.options.slideSpeed,function(){/**
         * Fires when the tab is done collapsing up.
         * @event Accordion#up
         */_this.$element.trigger('up.zf.accordion',[$target]);});// });
$target.attr('aria-hidden',true).parent().removeClass('is-active');$('#'+$target.attr('aria-labelledby')).attr({'aria-expanded':false,'aria-selected':false});}/**
   * Destroys an instance of an accordion.
   * @fires Accordion#destroyed
   * @function
   */},{key:'destroy',value:function destroy(){this.$element.find('[data-tab-content]').stop(true).slideUp(0).css('display','');this.$element.find('a').off('.zf.accordion');if(this.options.deepLink){$(window).off('popstate',this._checkDeepLink);}Foundation.unregisterPlugin(this);}}]);return Accordion;}();Accordion.defaults={/**
   * Amount of time to animate the opening of an accordion pane.
   * @option
   * @type {number}
   * @default 250
   */slideSpeed:250,/**
   * Allow the accordion to have multiple open panes.
   * @option
   * @type {boolean}
   * @default false
   */multiExpand:false,/**
   * Allow the accordion to close all panes.
   * @option
   * @type {boolean}
   * @default false
   */allowAllClosed:false,/**
   * Allows the window to scroll to content of pane specified by hash anchor
   * @option
   * @type {boolean}
   * @default false
   */deepLink:false,/**
   * Adjust the deep link scroll to make sure the top of the accordion panel is visible
   * @option
   * @type {boolean}
   * @default false
   */deepLinkSmudge:false,/**
   * Animation time (ms) for the deep link adjustment
   * @option
   * @type {number}
   * @default 300
   */deepLinkSmudgeDelay:300,/**
   * Update the browser history with the open accordion
   * @option
   * @type {boolean}
   * @default false
   */updateHistory:false};// Window exports
Foundation.plugin(Accordion,'Accordion');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * AccordionMenu module.
 * @module foundation.accordionMenu
 * @requires foundation.util.keyboard
 * @requires foundation.util.motion
 * @requires foundation.util.nest
 */var AccordionMenu=function(){/**
   * Creates a new instance of an accordion menu.
   * @class
   * @fires AccordionMenu#init
   * @param {jQuery} element - jQuery object to make into an accordion menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */function AccordionMenu(element,options){_classCallCheck(this,AccordionMenu);this.$element=element;this.options=$.extend({},AccordionMenu.defaults,this.$element.data(),options);Foundation.Nest.Feather(this.$element,'accordion');this._init();Foundation.registerPlugin(this,'AccordionMenu');Foundation.Keyboard.register('AccordionMenu',{'ENTER':'toggle','SPACE':'toggle','ARROW_RIGHT':'open','ARROW_UP':'up','ARROW_DOWN':'down','ARROW_LEFT':'close','ESCAPE':'closeAll'});}/**
   * Initializes the accordion menu by hiding all nested menus.
   * @private
   */_createClass(AccordionMenu,[{key:'_init',value:function _init(){this.$element.find('[data-submenu]').not('.is-active').slideUp(0);//.find('a').css('padding-left', '1rem');
this.$element.attr({'role':'menu','aria-multiselectable':this.options.multiOpen});this.$menuLinks=this.$element.find('.is-accordion-submenu-parent');this.$menuLinks.each(function(){var linkId=this.id||Foundation.GetYoDigits(6,'acc-menu-link'),$elem=$(this),$sub=$elem.children('[data-submenu]'),subId=$sub[0].id||Foundation.GetYoDigits(6,'acc-menu'),isActive=$sub.hasClass('is-active');$elem.attr({'aria-controls':subId,'aria-expanded':isActive,'role':'menuitem','id':linkId});$sub.attr({'aria-labelledby':linkId,'aria-hidden':!isActive,'role':'menu','id':subId});});var initPanes=this.$element.find('.is-active');if(initPanes.length){var _this=this;initPanes.each(function(){_this.down($(this));});}this._events();}/**
   * Adds event handlers for items within the menu.
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this.$element.find('li').each(function(){var $submenu=$(this).children('[data-submenu]');if($submenu.length){$(this).children('a').off('click.zf.accordionMenu').on('click.zf.accordionMenu',function(e){e.preventDefault();_this.toggle($submenu);});}}).on('keydown.zf.accordionmenu',function(e){var $element=$(this),$elements=$element.parent('ul').children('li'),$prevElement,$nextElement,$target=$element.children('[data-submenu]');$elements.each(function(i){if($(this).is($element)){$prevElement=$elements.eq(Math.max(0,i-1)).find('a').first();$nextElement=$elements.eq(Math.min(i+1,$elements.length-1)).find('a').first();if($(this).children('[data-submenu]:visible').length){// has open sub menu
$nextElement=$element.find('li:first-child').find('a').first();}if($(this).is(':first-child')){// is first element of sub menu
$prevElement=$element.parents('li').first().find('a').first();}else if($prevElement.parents('li').first().children('[data-submenu]:visible').length){// if previous element has open sub menu
$prevElement=$prevElement.parents('li').find('li:last-child').find('a').first();}if($(this).is(':last-child')){// is last element of sub menu
$nextElement=$element.parents('li').first().next('li').find('a').first();}return;}});Foundation.Keyboard.handleKey(e,'AccordionMenu',{open:function open(){if($target.is(':hidden')){_this.down($target);$target.find('li').first().find('a').first().focus();}},close:function close(){if($target.length&&!$target.is(':hidden')){// close active sub of this item
_this.up($target);}else if($element.parent('[data-submenu]').length){// close currently open sub
_this.up($element.parent('[data-submenu]'));$element.parents('li').first().find('a').first().focus();}},up:function up(){$prevElement.focus();return true;},down:function down(){$nextElement.focus();return true;},toggle:function toggle(){if($element.children('[data-submenu]').length){_this.toggle($element.children('[data-submenu]'));}},closeAll:function closeAll(){_this.hideAll();},handled:function handled(preventDefault){if(preventDefault){e.preventDefault();}e.stopImmediatePropagation();}});});//.attr('tabindex', 0);
}/**
   * Closes all panes of the menu.
   * @function
   */},{key:'hideAll',value:function hideAll(){this.up(this.$element.find('[data-submenu]'));}/**
   * Opens all panes of the menu.
   * @function
   */},{key:'showAll',value:function showAll(){this.down(this.$element.find('[data-submenu]'));}/**
   * Toggles the open/close state of a submenu.
   * @function
   * @param {jQuery} $target - the submenu to toggle
   */},{key:'toggle',value:function toggle($target){if(!$target.is(':animated')){if(!$target.is(':hidden')){this.up($target);}else{this.down($target);}}}/**
   * Opens the sub-menu defined by `$target`.
   * @param {jQuery} $target - Sub-menu to open.
   * @fires AccordionMenu#down
   */},{key:'down',value:function down($target){var _this=this;if(!this.options.multiOpen){this.up(this.$element.find('.is-active').not($target.parentsUntil(this.$element).add($target)));}$target.addClass('is-active').attr({'aria-hidden':false}).parent('.is-accordion-submenu-parent').attr({'aria-expanded':true});//Foundation.Move(this.options.slideSpeed, $target, function() {
$target.slideDown(_this.options.slideSpeed,function(){/**
           * Fires when the menu is done opening.
           * @event AccordionMenu#down
           */_this.$element.trigger('down.zf.accordionMenu',[$target]);});//});
}/**
   * Closes the sub-menu defined by `$target`. All sub-menus inside the target will be closed as well.
   * @param {jQuery} $target - Sub-menu to close.
   * @fires AccordionMenu#up
   */},{key:'up',value:function up($target){var _this=this;//Foundation.Move(this.options.slideSpeed, $target, function(){
$target.slideUp(_this.options.slideSpeed,function(){/**
         * Fires when the menu is done collapsing up.
         * @event AccordionMenu#up
         */_this.$element.trigger('up.zf.accordionMenu',[$target]);});//});
var $menus=$target.find('[data-submenu]').slideUp(0).addBack().attr('aria-hidden',true);$menus.parent('.is-accordion-submenu-parent').attr('aria-expanded',false);}/**
   * Destroys an instance of accordion menu.
   * @fires AccordionMenu#destroyed
   */},{key:'destroy',value:function destroy(){this.$element.find('[data-submenu]').slideDown(0).css('display','');this.$element.find('a').off('click.zf.accordionMenu');Foundation.Nest.Burn(this.$element,'accordion');Foundation.unregisterPlugin(this);}}]);return AccordionMenu;}();AccordionMenu.defaults={/**
   * Amount of time to animate the opening of a submenu in ms.
   * @option
   * @type {number}
   * @default 250
   */slideSpeed:250,/**
   * Allow the menu to have multiple open panes.
   * @option
   * @type {boolean}
   * @default true
   */multiOpen:true};// Window exports
Foundation.plugin(AccordionMenu,'AccordionMenu');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Equalizer module.
 * @module foundation.equalizer
 * @requires foundation.util.mediaQuery
 * @requires foundation.util.timerAndImageLoader if equalizer contains images
 */var Equalizer=function(){/**
   * Creates a new instance of Equalizer.
   * @class
   * @fires Equalizer#init
   * @param {Object} element - jQuery object to add the trigger to.
   * @param {Object} options - Overrides to the default plugin settings.
   */function Equalizer(element,options){_classCallCheck(this,Equalizer);this.$element=element;this.options=$.extend({},Equalizer.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Equalizer');}/**
   * Initializes the Equalizer plugin and calls functions to get equalizer functioning on load.
   * @private
   */_createClass(Equalizer,[{key:'_init',value:function _init(){var eqId=this.$element.attr('data-equalizer')||'';var $watched=this.$element.find('[data-equalizer-watch="'+eqId+'"]');this.$watched=$watched.length?$watched:this.$element.find('[data-equalizer-watch]');this.$element.attr('data-resize',eqId||Foundation.GetYoDigits(6,'eq'));this.$element.attr('data-mutate',eqId||Foundation.GetYoDigits(6,'eq'));this.hasNested=this.$element.find('[data-equalizer]').length>0;this.isNested=this.$element.parentsUntil(document.body,'[data-equalizer]').length>0;this.isOn=false;this._bindHandler={onResizeMeBound:this._onResizeMe.bind(this),onPostEqualizedBound:this._onPostEqualized.bind(this)};var imgs=this.$element.find('img');var tooSmall;if(this.options.equalizeOn){tooSmall=this._checkMQ();$(window).on('changed.zf.mediaquery',this._checkMQ.bind(this));}else{this._events();}if(tooSmall!==undefined&&tooSmall===false||tooSmall===undefined){if(imgs.length){Foundation.onImagesLoaded(imgs,this._reflow.bind(this));}else{this._reflow();}}}/**
   * Removes event listeners if the breakpoint is too small.
   * @private
   */},{key:'_pauseEvents',value:function _pauseEvents(){this.isOn=false;this.$element.off({'.zf.equalizer':this._bindHandler.onPostEqualizedBound,'resizeme.zf.trigger':this._bindHandler.onResizeMeBound,'mutateme.zf.trigger':this._bindHandler.onResizeMeBound});}/**
   * function to handle $elements resizeme.zf.trigger, with bound this on _bindHandler.onResizeMeBound
   * @private
   */},{key:'_onResizeMe',value:function _onResizeMe(e){this._reflow();}/**
   * function to handle $elements postequalized.zf.equalizer, with bound this on _bindHandler.onPostEqualizedBound
   * @private
   */},{key:'_onPostEqualized',value:function _onPostEqualized(e){if(e.target!==this.$element[0]){this._reflow();}}/**
   * Initializes events for Equalizer.
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this._pauseEvents();if(this.hasNested){this.$element.on('postequalized.zf.equalizer',this._bindHandler.onPostEqualizedBound);}else{this.$element.on('resizeme.zf.trigger',this._bindHandler.onResizeMeBound);this.$element.on('mutateme.zf.trigger',this._bindHandler.onResizeMeBound);}this.isOn=true;}/**
   * Checks the current breakpoint to the minimum required size.
   * @private
   */},{key:'_checkMQ',value:function _checkMQ(){var tooSmall=!Foundation.MediaQuery.is(this.options.equalizeOn);if(tooSmall){if(this.isOn){this._pauseEvents();this.$watched.css('height','auto');}}else{if(!this.isOn){this._events();}}return tooSmall;}/**
   * A noop version for the plugin
   * @private
   */},{key:'_killswitch',value:function _killswitch(){return;}/**
   * Calls necessary functions to update Equalizer upon DOM change
   * @private
   */},{key:'_reflow',value:function _reflow(){if(!this.options.equalizeOnStack){if(this._isStacked()){this.$watched.css('height','auto');return false;}}if(this.options.equalizeByRow){this.getHeightsByRow(this.applyHeightByRow.bind(this));}else{this.getHeights(this.applyHeight.bind(this));}}/**
   * Manually determines if the first 2 elements are *NOT* stacked.
   * @private
   */},{key:'_isStacked',value:function _isStacked(){if(!this.$watched[0]||!this.$watched[1]){return true;}return this.$watched[0].getBoundingClientRect().top!==this.$watched[1].getBoundingClientRect().top;}/**
   * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
   * @param {Function} cb - A non-optional callback to return the heights array to.
   * @returns {Array} heights - An array of heights of children within Equalizer container
   */},{key:'getHeights',value:function getHeights(cb){var heights=[];for(var i=0,len=this.$watched.length;i<len;i++){this.$watched[i].style.height='auto';heights.push(this.$watched[i].offsetHeight);}cb(heights);}/**
   * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
   * @param {Function} cb - A non-optional callback to return the heights array to.
   * @returns {Array} groups - An array of heights of children within Equalizer container grouped by row with element,height and max as last child
   */},{key:'getHeightsByRow',value:function getHeightsByRow(cb){var lastElTopOffset=this.$watched.length?this.$watched.first().offset().top:0,groups=[],group=0;//group by Row
groups[group]=[];for(var i=0,len=this.$watched.length;i<len;i++){this.$watched[i].style.height='auto';//maybe could use this.$watched[i].offsetTop
var elOffsetTop=$(this.$watched[i]).offset().top;if(elOffsetTop!=lastElTopOffset){group++;groups[group]=[];lastElTopOffset=elOffsetTop;}groups[group].push([this.$watched[i],this.$watched[i].offsetHeight]);}for(var j=0,ln=groups.length;j<ln;j++){var heights=$(groups[j]).map(function(){return this[1];}).get();var max=Math.max.apply(null,heights);groups[j].push(max);}cb(groups);}/**
   * Changes the CSS height property of each child in an Equalizer parent to match the tallest
   * @param {array} heights - An array of heights of children within Equalizer container
   * @fires Equalizer#preequalized
   * @fires Equalizer#postequalized
   */},{key:'applyHeight',value:function applyHeight(heights){var max=Math.max.apply(null,heights);/**
     * Fires before the heights are applied
     * @event Equalizer#preequalized
     */this.$element.trigger('preequalized.zf.equalizer');this.$watched.css('height',max);/**
     * Fires when the heights have been applied
     * @event Equalizer#postequalized
     */this.$element.trigger('postequalized.zf.equalizer');}/**
   * Changes the CSS height property of each child in an Equalizer parent to match the tallest by row
   * @param {array} groups - An array of heights of children within Equalizer container grouped by row with element,height and max as last child
   * @fires Equalizer#preequalized
   * @fires Equalizer#preequalizedrow
   * @fires Equalizer#postequalizedrow
   * @fires Equalizer#postequalized
   */},{key:'applyHeightByRow',value:function applyHeightByRow(groups){/**
     * Fires before the heights are applied
     */this.$element.trigger('preequalized.zf.equalizer');for(var i=0,len=groups.length;i<len;i++){var groupsILength=groups[i].length,max=groups[i][groupsILength-1];if(groupsILength<=2){$(groups[i][0][0]).css({'height':'auto'});continue;}/**
        * Fires before the heights per row are applied
        * @event Equalizer#preequalizedrow
        */this.$element.trigger('preequalizedrow.zf.equalizer');for(var j=0,lenJ=groupsILength-1;j<lenJ;j++){$(groups[i][j][0]).css({'height':max});}/**
        * Fires when the heights per row have been applied
        * @event Equalizer#postequalizedrow
        */this.$element.trigger('postequalizedrow.zf.equalizer');}/**
     * Fires when the heights have been applied
     */this.$element.trigger('postequalized.zf.equalizer');}/**
   * Destroys an instance of Equalizer.
   * @function
   */},{key:'destroy',value:function destroy(){this._pauseEvents();this.$watched.css('height','auto');Foundation.unregisterPlugin(this);}}]);return Equalizer;}();/**
 * Default settings for plugin
 */Equalizer.defaults={/**
   * Enable height equalization when stacked on smaller screens.
   * @option
   * @type {boolean}
   * @default false
   */equalizeOnStack:false,/**
   * Enable height equalization row by row.
   * @option
   * @type {boolean}
   * @default false
   */equalizeByRow:false,/**
   * String representing the minimum breakpoint size the plugin should equalize heights on.
   * @option
   * @type {string}
   * @default ''
   */equalizeOn:''};// Window exports
Foundation.plugin(Equalizer,'Equalizer');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Orbit module.
 * @module foundation.orbit
 * @requires foundation.util.keyboard
 * @requires foundation.util.motion
 * @requires foundation.util.timerAndImageLoader
 * @requires foundation.util.touch
 */var Orbit=function(){/**
  * Creates a new instance of an orbit carousel.
  * @class
  * @param {jQuery} element - jQuery object to make into an Orbit Carousel.
  * @param {Object} options - Overrides to the default plugin settings.
  */function Orbit(element,options){_classCallCheck(this,Orbit);this.$element=element;this.options=$.extend({},Orbit.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Orbit');Foundation.Keyboard.register('Orbit',{'ltr':{'ARROW_RIGHT':'next','ARROW_LEFT':'previous'},'rtl':{'ARROW_LEFT':'next','ARROW_RIGHT':'previous'}});}/**
  * Initializes the plugin by creating jQuery collections, setting attributes, and starting the animation.
  * @function
  * @private
  */_createClass(Orbit,[{key:'_init',value:function _init(){// @TODO: consider discussion on PR #9278 about DOM pollution by changeSlide
this._reset();this.$wrapper=this.$element.find('.'+this.options.containerClass);this.$slides=this.$element.find('.'+this.options.slideClass);var $images=this.$element.find('img'),initActive=this.$slides.filter('.is-active'),id=this.$element[0].id||Foundation.GetYoDigits(6,'orbit');this.$element.attr({'data-resize':id,'id':id});if(!initActive.length){this.$slides.eq(0).addClass('is-active');}if(!this.options.useMUI){this.$slides.addClass('no-motionui');}if($images.length){Foundation.onImagesLoaded($images,this._prepareForOrbit.bind(this));}else{this._prepareForOrbit();//hehe
}if(this.options.bullets){this._loadBullets();}this._events();if(this.options.autoPlay&&this.$slides.length>1){this.geoSync();}if(this.options.accessible){// allow wrapper to be focusable to enable arrow navigation
this.$wrapper.attr('tabindex',0);}}/**
  * Creates a jQuery collection of bullets, if they are being used.
  * @function
  * @private
  */},{key:'_loadBullets',value:function _loadBullets(){this.$bullets=this.$element.find('.'+this.options.boxOfBullets).find('button');}/**
  * Sets a `timer` object on the orbit, and starts the counter for the next slide.
  * @function
  */},{key:'geoSync',value:function geoSync(){var _this=this;this.timer=new Foundation.Timer(this.$element,{duration:this.options.timerDelay,infinite:false},function(){_this.changeSlide(true);});this.timer.start();}/**
  * Sets wrapper and slide heights for the orbit.
  * @function
  * @private
  */},{key:'_prepareForOrbit',value:function _prepareForOrbit(){var _this=this;this._setWrapperHeight();}/**
  * Calulates the height of each slide in the collection, and uses the tallest one for the wrapper height.
  * @function
  * @private
  * @param {Function} cb - a callback function to fire when complete.
  */},{key:'_setWrapperHeight',value:function _setWrapperHeight(cb){//rewrite this to `for` loop
var max=0,temp,counter=0,_this=this;this.$slides.each(function(){temp=this.getBoundingClientRect().height;$(this).attr('data-slide',counter);if(_this.$slides.filter('.is-active')[0]!==_this.$slides.eq(counter)[0]){//if not the active slide, set css position and display property
$(this).css({'position':'relative','display':'none'});}max=temp>max?temp:max;counter++;});if(counter===this.$slides.length){this.$wrapper.css({'height':max});//only change the wrapper height property once.
if(cb){cb(max);}//fire callback with max height dimension.
}}/**
  * Sets the max-height of each slide.
  * @function
  * @private
  */},{key:'_setSlideHeight',value:function _setSlideHeight(height){this.$slides.each(function(){$(this).css('max-height',height);});}/**
  * Adds event listeners to basically everything within the element.
  * @function
  * @private
  */},{key:'_events',value:function _events(){var _this=this;//***************************************
//**Now using custom event - thanks to:**
//**      Yohai Ararat of Toronto      **
//***************************************
//
this.$element.off('.resizeme.zf.trigger').on({'resizeme.zf.trigger':this._prepareForOrbit.bind(this)});if(this.$slides.length>1){if(this.options.swipe){this.$slides.off('swipeleft.zf.orbit swiperight.zf.orbit').on('swipeleft.zf.orbit',function(e){e.preventDefault();_this.changeSlide(true);}).on('swiperight.zf.orbit',function(e){e.preventDefault();_this.changeSlide(false);});}//***************************************
if(this.options.autoPlay){this.$slides.on('click.zf.orbit',function(){_this.$element.data('clickedOn',_this.$element.data('clickedOn')?false:true);_this.timer[_this.$element.data('clickedOn')?'pause':'start']();});if(this.options.pauseOnHover){this.$element.on('mouseenter.zf.orbit',function(){_this.timer.pause();}).on('mouseleave.zf.orbit',function(){if(!_this.$element.data('clickedOn')){_this.timer.start();}});}}if(this.options.navButtons){var $controls=this.$element.find('.'+this.options.nextClass+', .'+this.options.prevClass);$controls.attr('tabindex',0)//also need to handle enter/return and spacebar key presses
.on('click.zf.orbit touchend.zf.orbit',function(e){e.preventDefault();_this.changeSlide($(this).hasClass(_this.options.nextClass));});}if(this.options.bullets){this.$bullets.on('click.zf.orbit touchend.zf.orbit',function(){if(/is-active/g.test(this.className)){return false;}//if this is active, kick out of function.
var idx=$(this).data('slide'),ltr=idx>_this.$slides.filter('.is-active').data('slide'),$slide=_this.$slides.eq(idx);_this.changeSlide(ltr,$slide,idx);});}if(this.options.accessible){this.$wrapper.add(this.$bullets).on('keydown.zf.orbit',function(e){// handle keyboard event with keyboard util
Foundation.Keyboard.handleKey(e,'Orbit',{next:function next(){_this.changeSlide(true);},previous:function previous(){_this.changeSlide(false);},handled:function handled(){// if bullet is focused, make sure focus moves
if($(e.target).is(_this.$bullets)){_this.$bullets.filter('.is-active').focus();}}});});}}}/**
   * Resets Orbit so it can be reinitialized
   */},{key:'_reset',value:function _reset(){// Don't do anything if there are no slides (first run)
if(typeof this.$slides=='undefined'){return;}if(this.$slides.length>1){// Remove old events
this.$element.off('.zf.orbit').find('*').off('.zf.orbit');// Restart timer if autoPlay is enabled
if(this.options.autoPlay){this.timer.restart();}// Reset all sliddes
this.$slides.each(function(el){$(el).removeClass('is-active is-active is-in').removeAttr('aria-live').hide();});// Show the first slide
this.$slides.first().addClass('is-active').show();// Triggers when the slide has finished animating
this.$element.trigger('slidechange.zf.orbit',[this.$slides.first()]);// Select first bullet if bullets are present
if(this.options.bullets){this._updateBullets(0);}}}/**
  * Changes the current slide to a new one.
  * @function
  * @param {Boolean} isLTR - flag if the slide should move left to right.
  * @param {jQuery} chosenSlide - the jQuery element of the slide to show next, if one is selected.
  * @param {Number} idx - the index of the new slide in its collection, if one chosen.
  * @fires Orbit#slidechange
  */},{key:'changeSlide',value:function changeSlide(isLTR,chosenSlide,idx){if(!this.$slides){return;}// Don't freak out if we're in the middle of cleanup
var $curSlide=this.$slides.filter('.is-active').eq(0);if(/mui/g.test($curSlide[0].className)){return false;}//if the slide is currently animating, kick out of the function
var $firstSlide=this.$slides.first(),$lastSlide=this.$slides.last(),dirIn=isLTR?'Right':'Left',dirOut=isLTR?'Left':'Right',_this=this,$newSlide;if(!chosenSlide){//most of the time, this will be auto played or clicked from the navButtons.
$newSlide=isLTR?//if wrapping enabled, check to see if there is a `next` or `prev` sibling, if not, select the first or last slide to fill in. if wrapping not enabled, attempt to select `next` or `prev`, if there's nothing there, the function will kick out on next step. CRAZY NESTED TERNARIES!!!!!
this.options.infiniteWrap?$curSlide.next('.'+this.options.slideClass).length?$curSlide.next('.'+this.options.slideClass):$firstSlide:$curSlide.next('.'+this.options.slideClass)://pick next slide if moving left to right
this.options.infiniteWrap?$curSlide.prev('.'+this.options.slideClass).length?$curSlide.prev('.'+this.options.slideClass):$lastSlide:$curSlide.prev('.'+this.options.slideClass);//pick prev slide if moving right to left
}else{$newSlide=chosenSlide;}if($newSlide.length){/**
      * Triggers before the next slide starts animating in and only if a next slide has been found.
      * @event Orbit#beforeslidechange
      */this.$element.trigger('beforeslidechange.zf.orbit',[$curSlide,$newSlide]);if(this.options.bullets){idx=idx||this.$slides.index($newSlide);//grab index to update bullets
this._updateBullets(idx);}if(this.options.useMUI&&!this.$element.is(':hidden')){Foundation.Motion.animateIn($newSlide.addClass('is-active').css({'position':'absolute','top':0}),this.options['animInFrom'+dirIn],function(){$newSlide.css({'position':'relative','display':'block'}).attr('aria-live','polite');});Foundation.Motion.animateOut($curSlide.removeClass('is-active'),this.options['animOutTo'+dirOut],function(){$curSlide.removeAttr('aria-live');if(_this.options.autoPlay&&!_this.timer.isPaused){_this.timer.restart();}//do stuff?
});}else{$curSlide.removeClass('is-active is-in').removeAttr('aria-live').hide();$newSlide.addClass('is-active is-in').attr('aria-live','polite').show();if(this.options.autoPlay&&!this.timer.isPaused){this.timer.restart();}}/**
    * Triggers when the slide has finished animating in.
    * @event Orbit#slidechange
    */this.$element.trigger('slidechange.zf.orbit',[$newSlide]);}}/**
  * Updates the active state of the bullets, if displayed.
  * @function
  * @private
  * @param {Number} idx - the index of the current slide.
  */},{key:'_updateBullets',value:function _updateBullets(idx){var $oldBullet=this.$element.find('.'+this.options.boxOfBullets).find('.is-active').removeClass('is-active').blur(),span=$oldBullet.find('span:last').detach(),$newBullet=this.$bullets.eq(idx).addClass('is-active').append(span);}/**
  * Destroys the carousel and hides the element.
  * @function
  */},{key:'destroy',value:function destroy(){this.$element.off('.zf.orbit').find('*').off('.zf.orbit').end().hide();Foundation.unregisterPlugin(this);}}]);return Orbit;}();Orbit.defaults={/**
  * Tells the JS to look for and loadBullets.
  * @option
   * @type {boolean}
  * @default true
  */bullets:true,/**
  * Tells the JS to apply event listeners to nav buttons
  * @option
   * @type {boolean}
  * @default true
  */navButtons:true,/**
  * motion-ui animation class to apply
  * @option
   * @type {string}
  * @default 'slide-in-right'
  */animInFromRight:'slide-in-right',/**
  * motion-ui animation class to apply
  * @option
   * @type {string}
  * @default 'slide-out-right'
  */animOutToRight:'slide-out-right',/**
  * motion-ui animation class to apply
  * @option
   * @type {string}
  * @default 'slide-in-left'
  *
  */animInFromLeft:'slide-in-left',/**
  * motion-ui animation class to apply
  * @option
   * @type {string}
  * @default 'slide-out-left'
  */animOutToLeft:'slide-out-left',/**
  * Allows Orbit to automatically animate on page load.
  * @option
   * @type {boolean}
  * @default true
  */autoPlay:true,/**
  * Amount of time, in ms, between slide transitions
  * @option
   * @type {number}
  * @default 5000
  */timerDelay:5000,/**
  * Allows Orbit to infinitely loop through the slides
  * @option
   * @type {boolean}
  * @default true
  */infiniteWrap:true,/**
  * Allows the Orbit slides to bind to swipe events for mobile, requires an additional util library
  * @option
   * @type {boolean}
  * @default true
  */swipe:true,/**
  * Allows the timing function to pause animation on hover.
  * @option
   * @type {boolean}
  * @default true
  */pauseOnHover:true,/**
  * Allows Orbit to bind keyboard events to the slider, to animate frames with arrow keys
  * @option
   * @type {boolean}
  * @default true
  */accessible:true,/**
  * Class applied to the container of Orbit
  * @option
   * @type {string}
  * @default 'orbit-container'
  */containerClass:'orbit-container',/**
  * Class applied to individual slides.
  * @option
   * @type {string}
  * @default 'orbit-slide'
  */slideClass:'orbit-slide',/**
  * Class applied to the bullet container. You're welcome.
  * @option
   * @type {string}
  * @default 'orbit-bullets'
  */boxOfBullets:'orbit-bullets',/**
  * Class applied to the `next` navigation button.
  * @option
   * @type {string}
  * @default 'orbit-next'
  */nextClass:'orbit-next',/**
  * Class applied to the `previous` navigation button.
  * @option
   * @type {string}
  * @default 'orbit-previous'
  */prevClass:'orbit-previous',/**
  * Boolean to flag the js to use motion ui classes or not. Default to true for backwards compatability.
  * @option
   * @type {boolean}
  * @default true
  */useMUI:true};// Window exports
Foundation.plugin(Orbit,'Orbit');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * ResponsiveToggle module.
 * @module foundation.responsiveToggle
 * @requires foundation.util.mediaQuery
 */var ResponsiveToggle=function(){/**
   * Creates a new instance of Tab Bar.
   * @class
   * @fires ResponsiveToggle#init
   * @param {jQuery} element - jQuery object to attach tab bar functionality to.
   * @param {Object} options - Overrides to the default plugin settings.
   */function ResponsiveToggle(element,options){_classCallCheck(this,ResponsiveToggle);this.$element=$(element);this.options=$.extend({},ResponsiveToggle.defaults,this.$element.data(),options);this._init();this._events();Foundation.registerPlugin(this,'ResponsiveToggle');}/**
   * Initializes the tab bar by finding the target element, toggling element, and running update().
   * @function
   * @private
   */_createClass(ResponsiveToggle,[{key:'_init',value:function _init(){var targetID=this.$element.data('responsive-toggle');if(!targetID){console.error('Your tab bar needs an ID of a Menu as the value of data-tab-bar.');}this.$targetMenu=$('#'+targetID);this.$toggler=this.$element.find('[data-toggle]').filter(function(){var target=$(this).data('toggle');return target===targetID||target==="";});this.options=$.extend({},this.options,this.$targetMenu.data());// If they were set, parse the animation classes
if(this.options.animate){var input=this.options.animate.split(' ');this.animationIn=input[0];this.animationOut=input[1]||null;}this._update();}/**
   * Adds necessary event handlers for the tab bar to work.
   * @function
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this._updateMqHandler=this._update.bind(this);$(window).on('changed.zf.mediaquery',this._updateMqHandler);this.$toggler.on('click.zf.responsiveToggle',this.toggleMenu.bind(this));}/**
   * Checks the current media query to determine if the tab bar should be visible or hidden.
   * @function
   * @private
   */},{key:'_update',value:function _update(){// Mobile
if(!Foundation.MediaQuery.atLeast(this.options.hideFor)){this.$element.show();this.$targetMenu.hide();}// Desktop
else{this.$element.hide();this.$targetMenu.show();}}/**
   * Toggles the element attached to the tab bar. The toggle only happens if the screen is small enough to allow it.
   * @function
   * @fires ResponsiveToggle#toggled
   */},{key:'toggleMenu',value:function toggleMenu(){var _this2=this;if(!Foundation.MediaQuery.atLeast(this.options.hideFor)){/**
       * Fires when the element attached to the tab bar toggles.
       * @event ResponsiveToggle#toggled
       */if(this.options.animate){if(this.$targetMenu.is(':hidden')){Foundation.Motion.animateIn(this.$targetMenu,this.animationIn,function(){_this2.$element.trigger('toggled.zf.responsiveToggle');_this2.$targetMenu.find('[data-mutate]').triggerHandler('mutateme.zf.trigger');});}else{Foundation.Motion.animateOut(this.$targetMenu,this.animationOut,function(){_this2.$element.trigger('toggled.zf.responsiveToggle');});}}else{this.$targetMenu.toggle(0);this.$targetMenu.find('[data-mutate]').trigger('mutateme.zf.trigger');this.$element.trigger('toggled.zf.responsiveToggle');}}}},{key:'destroy',value:function destroy(){this.$element.off('.zf.responsiveToggle');this.$toggler.off('.zf.responsiveToggle');$(window).off('changed.zf.mediaquery',this._updateMqHandler);Foundation.unregisterPlugin(this);}}]);return ResponsiveToggle;}();ResponsiveToggle.defaults={/**
   * The breakpoint after which the menu is always shown, and the tab bar is hidden.
   * @option
   * @type {string}
   * @default 'medium'
   */hideFor:'medium',/**
   * To decide if the toggle should be animated or not.
   * @option
   * @type {boolean}
   * @default false
   */animate:false};// Window exports
Foundation.plugin(ResponsiveToggle,'ResponsiveToggle');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Reveal module.
 * @module foundation.reveal
 * @requires foundation.util.keyboard
 * @requires foundation.util.box
 * @requires foundation.util.triggers
 * @requires foundation.util.mediaQuery
 * @requires foundation.util.motion if using animations
 */var Reveal=function(){/**
   * Creates a new instance of Reveal.
   * @class
   * @param {jQuery} element - jQuery object to use for the modal.
   * @param {Object} options - optional parameters.
   */function Reveal(element,options){_classCallCheck(this,Reveal);this.$element=element;this.options=$.extend({},Reveal.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Reveal');Foundation.Keyboard.register('Reveal',{'ENTER':'open','SPACE':'open','ESCAPE':'close'});}/**
   * Initializes the modal by adding the overlay and close buttons, (if selected).
   * @private
   */_createClass(Reveal,[{key:'_init',value:function _init(){this.id=this.$element.attr('id');this.isActive=false;this.cached={mq:Foundation.MediaQuery.current};this.isMobile=mobileSniff();this.$anchor=$('[data-open="'+this.id+'"]').length?$('[data-open="'+this.id+'"]'):$('[data-toggle="'+this.id+'"]');this.$anchor.attr({'aria-controls':this.id,'aria-haspopup':true,'tabindex':0});if(this.options.fullScreen||this.$element.hasClass('full')){this.options.fullScreen=true;this.options.overlay=false;}if(this.options.overlay&&!this.$overlay){this.$overlay=this._makeOverlay(this.id);}this.$element.attr({'role':'dialog','aria-hidden':true,'data-yeti-box':this.id,'data-resize':this.id});if(this.$overlay){this.$element.detach().appendTo(this.$overlay);}else{this.$element.detach().appendTo($(this.options.appendTo));this.$element.addClass('without-overlay');}this._events();if(this.options.deepLink&&window.location.hash==='#'+this.id){$(window).one('load.zf.reveal',this.open.bind(this));}}/**
   * Creates an overlay div to display behind the modal.
   * @private
   */},{key:'_makeOverlay',value:function _makeOverlay(){return $('<div></div>').addClass('reveal-overlay').appendTo(this.options.appendTo);}/**
   * Updates position of modal
   * TODO:  Figure out if we actually need to cache these values or if it doesn't matter
   * @private
   */},{key:'_updatePosition',value:function _updatePosition(){var width=this.$element.outerWidth();var outerWidth=$(window).width();var height=this.$element.outerHeight();var outerHeight=$(window).height();var left,top;if(this.options.hOffset==='auto'){left=parseInt((outerWidth-width)/2,10);}else{left=parseInt(this.options.hOffset,10);}if(this.options.vOffset==='auto'){if(height>outerHeight){top=parseInt(Math.min(100,outerHeight/10),10);}else{top=parseInt((outerHeight-height)/4,10);}}else{top=parseInt(this.options.vOffset,10);}this.$element.css({top:top+'px'});// only worry about left if we don't have an overlay or we havea  horizontal offset,
// otherwise we're perfectly in the middle
if(!this.$overlay||this.options.hOffset!=='auto'){this.$element.css({left:left+'px'});this.$element.css({margin:'0px'});}}/**
   * Adds event handlers for the modal.
   * @private
   */},{key:'_events',value:function _events(){var _this2=this;var _this=this;this.$element.on({'open.zf.trigger':this.open.bind(this),'close.zf.trigger':function closeZfTrigger(event,$element){if(event.target===_this.$element[0]||$(event.target).parents('[data-closable]')[0]===$element){// only close reveal when it's explicitly called
return _this2.close.apply(_this2);}},'toggle.zf.trigger':this.toggle.bind(this),'resizeme.zf.trigger':function resizemeZfTrigger(){_this._updatePosition();}});if(this.$anchor.length){this.$anchor.on('keydown.zf.reveal',function(e){if(e.which===13||e.which===32){e.stopPropagation();e.preventDefault();_this.open();}});}if(this.options.closeOnClick&&this.options.overlay){this.$overlay.off('.zf.reveal').on('click.zf.reveal',function(e){if(e.target===_this.$element[0]||$.contains(_this.$element[0],e.target)||!$.contains(document,e.target)){return;}_this.close();});}if(this.options.deepLink){$(window).on('popstate.zf.reveal:'+this.id,this._handleState.bind(this));}}/**
   * Handles modal methods on back/forward button clicks or any other event that triggers popstate.
   * @private
   */},{key:'_handleState',value:function _handleState(e){if(window.location.hash==='#'+this.id&&!this.isActive){this.open();}else{this.close();}}/**
   * Opens the modal controlled by `this.$anchor`, and closes all others by default.
   * @function
   * @fires Reveal#closeme
   * @fires Reveal#open
   */},{key:'open',value:function open(){var _this3=this;if(this.options.deepLink){var hash='#'+this.id;if(window.history.pushState){window.history.pushState(null,null,hash);}else{window.location.hash=hash;}}this.isActive=true;// Make elements invisible, but remove display: none so we can get size and positioning
this.$element.css({'visibility':'hidden'}).show().scrollTop(0);if(this.options.overlay){this.$overlay.css({'visibility':'hidden'}).show();}this._updatePosition();this.$element.hide().css({'visibility':''});if(this.$overlay){this.$overlay.css({'visibility':''}).hide();if(this.$element.hasClass('fast')){this.$overlay.addClass('fast');}else if(this.$element.hasClass('slow')){this.$overlay.addClass('slow');}}if(!this.options.multipleOpened){/**
       * Fires immediately before the modal opens.
       * Closes any other modals that are currently open
       * @event Reveal#closeme
       */this.$element.trigger('closeme.zf.reveal',this.id);}var _this=this;function addRevealOpenClasses(){if(_this.isMobile){if(!_this.originalScrollPos){_this.originalScrollPos=window.pageYOffset;}$('html, body').addClass('is-reveal-open');}else{$('body').addClass('is-reveal-open');}}// Motion UI method of reveal
if(this.options.animationIn){var afterAnimation=function afterAnimation(){_this.$element.attr({'aria-hidden':false,'tabindex':-1}).focus();addRevealOpenClasses();Foundation.Keyboard.trapFocus(_this.$element);};if(this.options.overlay){Foundation.Motion.animateIn(this.$overlay,'fade-in');}Foundation.Motion.animateIn(this.$element,this.options.animationIn,function(){if(_this3.$element){// protect against object having been removed
_this3.focusableElements=Foundation.Keyboard.findFocusable(_this3.$element);afterAnimation();}});}// jQuery method of reveal
else{if(this.options.overlay){this.$overlay.show(0);}this.$element.show(this.options.showDelay);}// handle accessibility
this.$element.attr({'aria-hidden':false,'tabindex':-1}).focus();Foundation.Keyboard.trapFocus(this.$element);/**
     * Fires when the modal has successfully opened.
     * @event Reveal#open
     */this.$element.trigger('open.zf.reveal');addRevealOpenClasses();setTimeout(function(){_this3._extraHandlers();},0);}/**
   * Adds extra event handlers for the body and window if necessary.
   * @private
   */},{key:'_extraHandlers',value:function _extraHandlers(){var _this=this;if(!this.$element){return;}// If we're in the middle of cleanup, don't freak out
this.focusableElements=Foundation.Keyboard.findFocusable(this.$element);if(!this.options.overlay&&this.options.closeOnClick&&!this.options.fullScreen){$('body').on('click.zf.reveal',function(e){if(e.target===_this.$element[0]||$.contains(_this.$element[0],e.target)||!$.contains(document,e.target)){return;}_this.close();});}if(this.options.closeOnEsc){$(window).on('keydown.zf.reveal',function(e){Foundation.Keyboard.handleKey(e,'Reveal',{close:function close(){if(_this.options.closeOnEsc){_this.close();_this.$anchor.focus();}}});});}// lock focus within modal while tabbing
this.$element.on('keydown.zf.reveal',function(e){var $target=$(this);// handle keyboard event with keyboard util
Foundation.Keyboard.handleKey(e,'Reveal',{open:function open(){if(_this.$element.find(':focus').is(_this.$element.find('[data-close]'))){setTimeout(function(){// set focus back to anchor if close button has been activated
_this.$anchor.focus();},1);}else if($target.is(_this.focusableElements)){// dont't trigger if acual element has focus (i.e. inputs, links, ...)
_this.open();}},close:function close(){if(_this.options.closeOnEsc){_this.close();_this.$anchor.focus();}},handled:function handled(preventDefault){if(preventDefault){e.preventDefault();}}});});}/**
   * Closes the modal.
   * @function
   * @fires Reveal#closed
   */},{key:'close',value:function close(){if(!this.isActive||!this.$element.is(':visible')){return false;}var _this=this;// Motion UI method of hiding
if(this.options.animationOut){if(this.options.overlay){Foundation.Motion.animateOut(this.$overlay,'fade-out',finishUp);}else{finishUp();}Foundation.Motion.animateOut(this.$element,this.options.animationOut);}// jQuery method of hiding
else{this.$element.hide(this.options.hideDelay);if(this.options.overlay){this.$overlay.hide(0,finishUp);}else{finishUp();}}// Conditionals to remove extra event listeners added on open
if(this.options.closeOnEsc){$(window).off('keydown.zf.reveal');}if(!this.options.overlay&&this.options.closeOnClick){$('body').off('click.zf.reveal');}this.$element.off('keydown.zf.reveal');function finishUp(){if(_this.isMobile){if($('.reveal:visible').length===0){$('html, body').removeClass('is-reveal-open');}if(_this.originalScrollPos){$('body').scrollTop(_this.originalScrollPos);_this.originalScrollPos=null;}}else{if($('.reveal:visible').length===0){$('body').removeClass('is-reveal-open');}}Foundation.Keyboard.releaseFocus(_this.$element);_this.$element.attr('aria-hidden',true);/**
      * Fires when the modal is done closing.
      * @event Reveal#closed
      */_this.$element.trigger('closed.zf.reveal');}/**
    * Resets the modal content
    * This prevents a running video to keep going in the background
    */if(this.options.resetOnClose){this.$element.html(this.$element.html());}this.isActive=false;if(_this.options.deepLink){if(window.history.replaceState){window.history.replaceState('',document.title,window.location.href.replace('#'+this.id,''));}else{window.location.hash='';}}}/**
   * Toggles the open/closed state of a modal.
   * @function
   */},{key:'toggle',value:function toggle(){if(this.isActive){this.close();}else{this.open();}}},{key:'destroy',/**
   * Destroys an instance of a modal.
   * @function
   */value:function destroy(){if(this.options.overlay){this.$element.appendTo($(this.options.appendTo));// move $element outside of $overlay to prevent error unregisterPlugin()
this.$overlay.hide().off().remove();}this.$element.hide().off();this.$anchor.off('.zf');$(window).off('.zf.reveal:'+this.id);Foundation.unregisterPlugin(this);}}]);return Reveal;}();Reveal.defaults={/**
   * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
   * @option
   * @type {string}
   * @default ''
   */animationIn:'',/**
   * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
   * @option
   * @type {string}
   * @default ''
   */animationOut:'',/**
   * Time, in ms, to delay the opening of a modal after a click if no animation used.
   * @option
   * @type {number}
   * @default 0
   */showDelay:0,/**
   * Time, in ms, to delay the closing of a modal after a click if no animation used.
   * @option
   * @type {number}
   * @default 0
   */hideDelay:0,/**
   * Allows a click on the body/overlay to close the modal.
   * @option
   * @type {boolean}
   * @default true
   */closeOnClick:true,/**
   * Allows the modal to close if the user presses the `ESCAPE` key.
   * @option
   * @type {boolean}
   * @default true
   */closeOnEsc:true,/**
   * If true, allows multiple modals to be displayed at once.
   * @option
   * @type {boolean}
   * @default false
   */multipleOpened:false,/**
   * Distance, in pixels, the modal should push down from the top of the screen.
   * @option
   * @type {number|string}
   * @default auto
   */vOffset:'auto',/**
   * Distance, in pixels, the modal should push in from the side of the screen.
   * @option
   * @type {number|string}
   * @default auto
   */hOffset:'auto',/**
   * Allows the modal to be fullscreen, completely blocking out the rest of the view. JS checks for this as well.
   * @option
   * @type {boolean}
   * @default false
   */fullScreen:false,/**
   * Percentage of screen height the modal should push up from the bottom of the view.
   * @option
   * @type {number}
   * @default 10
   */btmOffsetPct:10,/**
   * Allows the modal to generate an overlay div, which will cover the view when modal opens.
   * @option
   * @type {boolean}
   * @default true
   */overlay:true,/**
   * Allows the modal to remove and reinject markup on close. Should be true if using video elements w/o using provider's api, otherwise, videos will continue to play in the background.
   * @option
   * @type {boolean}
   * @default false
   */resetOnClose:false,/**
   * Allows the modal to alter the url on open/close, and allows the use of the `back` button to close modals. ALSO, allows a modal to auto-maniacally open on page load IF the hash === the modal's user-set id.
   * @option
   * @type {boolean}
   * @default false
   */deepLink:false,/**
   * Allows the modal to append to custom div.
   * @option
   * @type {string}
   * @default "body"
   */appendTo:"body"};// Window exports
Foundation.plugin(Reveal,'Reveal');function iPhoneSniff(){return /iP(ad|hone|od).*OS/.test(window.navigator.userAgent);}function androidSniff(){return /Android/.test(window.navigator.userAgent);}function mobileSniff(){return iPhoneSniff()||androidSniff();}}(jQuery);
'use strict';

// Polyfill for requestAnimationFrame
(function() {
  if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
      window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                 || window[vp+'CancelRequestAnimationFrame']);
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function() { callback(lastTime = nextTime); },
                          nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
})();

var initClasses   = ['mui-enter', 'mui-leave'];
var activeClasses = ['mui-enter-active', 'mui-leave-active'];

// Find the right "transitionend" event for this browser
var endEvent = (function() {
  var transitions = {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'otransitionend'
  }
  var elem = window.document.createElement('div');

  for (var t in transitions) {
    if (typeof elem.style[t] !== 'undefined') {
      return transitions[t];
    }
  }

  return null;
})();

function animate(isIn, element, animation, cb) {
  element = $(element).eq(0);

  if (!element.length) return;

  if (endEvent === null) {
    isIn ? element.show() : element.hide();
    cb();
    return;
  }

  var initClass = isIn ? initClasses[0] : initClasses[1];
  var activeClass = isIn ? activeClasses[0] : activeClasses[1];

  // Set up the animation
  reset();
  element.addClass(animation);
  element.css('transition', 'none');
  requestAnimationFrame(function() {
    element.addClass(initClass);
    if (isIn) element.show();
  });

  // Start the animation
  requestAnimationFrame(function() {
    element[0].offsetWidth;
    element.css('transition', '');
    element.addClass(activeClass);
  });

  // Clean up the animation when it finishes
  element.one('transitionend', finish);

  // Hides the element (for out animations), resets the element, and runs a callback
  function finish() {
    if (!isIn) element.hide();
    reset();
    if (cb) cb.apply(element);
  }

  // Resets transitions and removes motion-specific classes
  function reset() {
    element[0].style.transitionDuration = 0;
    element.removeClass(initClass + ' ' + activeClass + ' ' + animation);
  }
}

var MotionUI = {
  animateIn: function(element, animation, cb) {
    animate(true, element, animation, cb);
  },

  animateOut: function(element, animation, cb) {
    animate(false, element, animation, cb);
  }
}

/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) { 
if (typeof define === 'function' && define.amd) { 
 // AMD. Register as an anonymous module. 
 define(['jquery'], factory); 
 } else if (typeof exports === 'object') { 
 // Node/CommonJS 
 factory(require('jquery')); 
 } else { 
 // Browser globals 
 factory(window.jQuery || window.Zepto); 
 } 
 }(function($) { 

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					mfp._setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						mfp.prev();
					});
					arrowRight.click(function() {
						mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));
;jQuery(function ($) {

    // Init Foundation JS
    Foundation.Orbit.defaults.navButtons = false;
    $(document).foundation();

    // Don't follow links with data-open attribute
    $("a[data-open]").on('click tap', function (e) {
        e.preventDefault();
    });

    // Add class to body when menu open, for styling purposes
    $('[data-responsive-toggle]').on('toggled.zf.responsiveToggle', function (e, b, c) {
        var body = $("body"), button = $('.wisv-menu-icon');

        if (body.hasClass("menu-open")) {
            body.removeClass("menu-open");
            button.removeClass('is-active');
        } else {
            body.addClass("menu-open");
            button.addClass('is-active');
        }

    });

    /* IMAGE GALLERIES */
    $('.inline-gallery').each(function () {
        $(this).magnificPopup({
            delegate: 'a.gallery-image',
            type: 'image',
            gallery: {
                enabled: true
            },
            image: {
                titleSrc: function (item) {
                    var p = item.el.parent();
                    if (p.is('figure')) {
                        var cap = p.find('figcaption').text();
                    } else {
                        var cap = item.el.find('img').attr('alt');
                    }
                    return cap ? cap : '';
                }
            },
            callbacks: {
                beforeOpen: function () {
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = 'mfp-zoom-in';
                },
                change: function () {
                    var t = this.content.find('.mfp-title');
                    if (t) {
                        if (t.text() == "") {
                            t.addClass('nobg');
                        } else {
                            t.removeClass('nobg');
                        }
                    }
                }
            }
        });
    });

    $('.post-content').find('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".gif"]').each(function () {

        $(this).magnificPopup({
            type: 'image',
            image: {
                titleSrc: function (item) {
                    var p = item.el.parent();
                    return p.is('figure') ? p.find('figcaption').text() : item.el.find('img').attr('alt');
                }
            },
            callbacks: {
                beforeOpen: function () {
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = 'mfp-zoom-in';
                },
                change: function () {
                    var t = this.content.find('.mfp-title');
                    if (t) {
                        if (t.text() == "") {
                            t.addClass('nobg');
                        } else {
                            t.removeClass('nobg');
                        }
                    }
                }
            }
        });
    });


    /* EVENTS */
    if ($.fullCalendar) {

        // Load large calendar
        var cal = $('#calendar').fullCalendar({
            firstDay: 1,
            height: "auto",

            defaultView: Foundation.MediaQuery.atLeast('large') ? 'month' : 'listMonth',

            header: {
                left: 'title',
                center: '',
                right: 'today prev, next'
            },

            events: {
                url: '/wp-json/wp/v2/events/fullcalendar'
            },

            timeFormat: 'H:mm',
            displayEventEnd: true,

            handleWindowResize: false,

            // Fix multi-day event start and end times
            eventAfterRender: function (event, $el) {
                if (!event.start.isSame(event.end, 'day')) {
                    $el.find('.fc-time').html(event.start.format("H:mm"));
                }
            }
        }).on('click tap', '.fc-button', function (e) {
            // Lose focus..
            $(this).blur();
        });

        // Change view on media query change
        $(window).on('changed.zf.mediaquery', function () {
            if (Foundation.MediaQuery.atLeast('large')) {
                cal.fullCalendar('changeView', 'month');
            } else {
                cal.fullCalendar('changeView', 'listMonth');
            }
        });

    }


    /* PORTAL */

    // Add readonly attribute to edit profile fields on load
    $("form.edit-profile-form :input:not(:submit):not(:hidden)").prop('readonly', true);

    // Add listeners
    $("form.edit-profile-form").on('focus', 'input[readonly]', function () {

        // Remove readonly attribute
        $(this).prop('readonly', false);

        // Store original value
        $(this).data("val-original", $(this).val());


    }).on('blur', ':input:not(:submit)', function () {

        // Reset readonly status if nothing has changed
        if ($(this).val() == $(this).data('val-original')) {
            $(this).prop('readonly', true);
        }

    }).on('submit', function (e) {

        // Replace readonly with disabled, so only changed inputs are submitted
        $(this).find('input[readonly]').prop('readonly', false).prop('disabled', true);

    });

});
