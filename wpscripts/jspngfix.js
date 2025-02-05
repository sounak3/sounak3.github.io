let supported = !/Gecko/.test(navigator.userAgent) && !/Opera/.test(navigator.userAgent) && /MSIE (5\.5|6)/.test(navigator.userAgent) && navigator.platform == "Win32";
function OnLoadPngFix() {
    if (!supported) {
        return;
    }
    if ( !event.srcElement ) {
        return;
    }
    let a = event.srcElement.src;
    if ( !a ) {
        return;
    }
    if ( !new RegExp(blankSrc).test(a) ) {
        if ( /\.png$/.test(a.toLowerCase()) ) { 
            a = a.replace(/\(/g,"%28");
            a = a.replace(/\)/g,"%29");
            event.srcElement.src = blankSrc;
            event.srcElement.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + a + "',sizingMethod='scale')";
        } else {
            event.srcElement.runtimeStyle.filter = "";
        }
    }
}