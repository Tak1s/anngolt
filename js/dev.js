// @author's	I. Demianov & P. Sayk 
// @version	$Id: dev.js 0.1 2010-09-10 10:26:00Z PaLyCH
// @package	DeV
// @copyright	Copyright (C) 2005 - 2010 Open Source Matters. All rights reserved.
// @license	GNU/GPL2
// Dev.js is free software. This version may have been modified pursuant
// to the GNU General Public License, and as distributed it includes or
// is derivative of works licensed under the GNU General Public License or
// other free or open source software licenses.


var DeveloperTool={
        Init:function(){
                this.headObj =
		document.getElementsByTagName('html')[0].getElementsByTagName('head')[0];
                return this;
        },
        ReloadAllCSS : function(headObj) {
                console.log("DT:ReloadAllCSS");
                var links = headObj.getElementsByTagName('link');
                for (var i=0 ; i < links.length ; i++){
                        var link = links[i];
                        this.ReloadCSSLink(link);
                }
                return this;
        },
        ReloadCSSLink : function(item) {
                var value = item.getAttribute('href');
                var cutI = value.lastIndexOf('?');
                if (cutI != -1)
                        value = value.substring(0, cutI);
                item.setAttribute('href', value + '?t=' + new Date().valueOf());
                return this;
        },
        ReloadAllCSSThisPage : function() {
                this.ReloadAllCSS(this.headObj);
                return this;
        }
};
