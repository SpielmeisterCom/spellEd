/*
 Head JS     The only script in your <HEAD>
 Copyright   Tero Piirainen (tipiirai)
 License     MIT / http://bit.ly/mit-license
 Version     0.99

 http://headjs.com
 */
(function(f,w){function m(){}function g(a,b){if(a){"object"===typeof a&&(a=[].slice.call(a));for(var c=0,d=a.length;c<d;c++)b.call(a,a[c],c)}}function v(a,b){var c=Object.prototype.toString.call(b).slice(8,-1);return b!==w&&null!==b&&c===a}function k(a){return v("Function",a)}function h(a){a=a||m;a._done||(a(),a._done=1)}function n(a){var b={};if("object"===typeof a)for(var c in a)a[c]&&(b={name:c,url:a[c]});else b=a.split("/"),b=b[b.length-1],c=b.indexOf("?"),b={name:-1!==c?b.substring(0,c):b,url:a};return(a=p[b.name])&&a.url===b.url?a:p[b.name]=b}function q(a){var a=a||p,b;for(b in a)if(a.hasOwnProperty(b)&&a[b].state!==r)return!1;return!0}function s(a,b){b=b||m;a.state===r?b():a.state===x?d.ready(a.name,b):a.state===y?a.onpreload.push(function(){s(a,b)}):(a.state=x,z(a,function(){a.state=r;b();g(l[a.name],function(a){h(a)});j&&q()&&g(l.ALL,function(a){h(a)})}))}function z(a,b){var b=b||m,c;/\.css[^\.]*$/.test(a.url)?(c=e.createElement("link"),c.type="text/"+(a.type||"css"),c.rel="stylesheet",c.href=a.url):(c=e.createElement("script"),c.type="text/"+(a.type||"javascript"),c.src=a.url);c.onload=c.onreadystatechange=function(a){a=a||f.event;if("load"===a.type||/loaded|complete/.test(c.readyState)&&(!e.documentMode||9>e.documentMode))c.onload=c.onreadystatechange=c.onerror=null,b()};c.onerror=function(){c.onload=c.onreadystatechange=c.onerror=null;b()};c.async=!1;c.defer=!1;var d=e.head||e.getElementsByTagName("head")[0];d.insertBefore(c,d.lastChild)}function i(){e.body?j||(j=!0,g(A,function(a){h(a)})):(f.clearTimeout(d.readyTimeout),d.readyTimeout=f.setTimeout(i,50))}function t(){e.addEventListener?(e.removeEventListener("DOMContentLoaded",t,!1),i()):"complete"===e.readyState&&(e.detachEvent("onreadystatechange",t),i())}var e=f.document,A=[],B=[],l={},p={},E="async"in e.createElement("script")||"MozAppearance"in e.documentElement.style||f.opera,C,j,D=f.head_conf&&f.head_conf.head||"head",d=f[D]=f[D]||function(){d.ready.apply(null,arguments)},y=1,x=3,r=4;d.load=E?function(){var a=arguments,b=a[a.length-1],c={};k(b)||(b=null);g(a,function(d,e){d!==b&&(d=n(d),c[d.name]=d,s(d,b&&e===a.length-2?function(){q(c)&&h(b)}:null))});return d}:function(){var a=arguments,b=[].slice.call(a,1),c=b[0];if(!C)return B.push(function(){d.load.apply(null,a)}),d;c?(g(b,function(a){if(!k(a)){var b=n(a);b.state===w&&(b.state=y,b.onpreload=[],z({url:b.url,type:"cache"},function(){b.state=2;g(b.onpreload,function(a){a.call()})}))}}),s(n(a[0]),k(c)?c:function(){d.load.apply(null,b)})):s(n(a[0]));return d};d.js=d.load;d.test=function(a,b,c,e){a="object"===typeof a?a:{test:a,success:b?v("Array",b)?b:[b]:!1,failure:c?v("Array",c)?c:[c]:!1,callback:e||m};(b=!!a.test)&&a.success?(a.success.push(a.callback),d.load.apply(null,a.success)):!b&&a.failure?(a.failure.push(a.callback),d.load.apply(null,a.failure)):e();return d};d.ready=function(a,b){if(a===e)return j?h(b):A.push(b),d;k(a)&&(b=a,a="ALL");if("string"!==typeof a||!k(b))return d;var c=p[a];if(c&&c.state===r||"ALL"===a&&q()&&j)return h(b),d;(c=l[a])?c.push(b):l[a]=[b];return d};d.ready(e,function(){q()&&g(l.ALL,function(a){h(a)});d.feature&&d.feature("domloaded",!0)});if("complete"===e.readyState)i();else if(e.addEventListener)e.addEventListener("DOMContentLoaded",t,!1),f.addEventListener("load",i,!1);else{e.attachEvent("onreadystatechange",t);f.attachEvent("onload",i);var u=!1;try{u=null==f.frameElement&&e.documentElement}catch(F){}u&&u.doScroll&&function b(){if(!j){try{u.doScroll("left")}catch(c){f.clearTimeout(d.readyTimeout);d.readyTimeout=f.setTimeout(b,50);return}i()}}()}setTimeout(function(){C=!0;g(B,function(b){b()})},300)})(window);

function loadCSSFile(filename){
	var fileref = document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", filename)

	document.getElementsByTagName("head")[0].appendChild(fileref)
}

var nwExceptionHandler = function(errorMsg) {
    var gui = require('nw.gui'),
        win = gui.Window.get()

    win.capturePage(function(img) {
        // code to run when error has occured on page
        window.location.href = 'error.html?' +
            'errorMsg='         + encodeURIComponent(errorMsg) +
            '&screenCapture='   + encodeURIComponent(img)
    }, 'png');
}

function registerGlobalErrorHandler(isNWRuntime, isDevelEnv) {
	if( isDevelEnv ) return

	window.triggerError = function(message) {
		throw message
	}

    if( isNWRuntime ) {
        process.on('uncaughtException', nwExceptionHandler);
        window.onerror = function(errorMsg, url, lineNumber) {
              nwExceptionHandler(url + ':' + lineNumber + "\n" + errorMsg);
        }

    } else {

        window.onerror = function(errorMsg, url, lineNumber) {
            var msg = url + ':' + lineNumber + "\n" + errorMsg;
            window.location.href = 'error.html?errorMsg=' + encodeURIComponent(msg)
        }

    }
}


var isNWRuntime = (typeof process) !== 'undefined',
	isDevelEnv  =   window.location.hostname === 'localhost' ||
					window.location.hostname === '127.0.0.1' ||
					(window.location.search && window.location.search === '?isDevelEnv=true'),
	JSincludes  = [],
	CSSincludes = []

registerGlobalErrorHandler(isNWRuntime, isDevelEnv);

if( !isNWRuntime ) {
	JSincludes.push('libs/fontDetect/javascripts/swfobject.js')
}

if( isDevelEnv ) {
	JSincludes.push(
		(navigator.appName === 'Microsoft Internet Explorer') ? 'ext/ext-all.js' : 'ext/ext-dev.js'
	)

	JSincludes.push( 'bootstrap.js' )
	JSincludes.push( 'app/app.js' )

	if( isNWRuntime ) {
		JSincludes.push('libs.js')
		JSincludes.push('nwlibs.js')
	}

	CSSincludes.push('packages/spelled-theme/build/resources/spelled-theme-all.css');
} else {
	JSincludes.push('libs.js')

	if( isNWRuntime ) {
		JSincludes.push('nwlibs.js')
	}

	JSincludes.push('all-classes.js')

	CSSincludes.push('resources/spellEd-all.css');
}


if( isNWRuntime ) {
	// use require.js in node.js mode
	var requirejs   = require( 'requirejs' ),
		define  = requirejs.define

	requirejs.config( {
		baseUrl: '../public/libs',
		nodeRequire: require
	} )

	window.requirejs = requirejs

	loadSpellEd()

} else {
	// use require.js in browser mode
	head.js("libs/require.js", function() {

		requirejs.config( {
			baseUrl : 'libs', waitSeconds: 14,
			nodeRequire: require

		} )

		loadSpellEd()
	} )
}


function loadSpellEd() {
	head.js.apply( null, JSincludes )

	for( var i= 0; i<CSSincludes.length; i++) {
		loadCSSFile( CSSincludes[i] )
	}
}