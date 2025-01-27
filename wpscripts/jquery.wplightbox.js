//----------------------------------------------------------
// WebPlus LightBox
//----------------------------------------------------------

(function($)
{
    jQuery.fn.wplightbox = function( settings )
    {
        //-----------------------------------
        // Extend jQuery settings to include arguments
        //-----------------------------------
        settings = jQuery.extend(
        {
            bShowToolTip: false,
            strCloseToolTip: 'Close (Esc)',
            strPrevToolTip: 'Previous (<)',
            strNextToolTip: 'Next (>)',
            strPlayToolTip: 'Play',
            strPauseToolTip: 'Pause',

            bBkgrndClickable: true,
            strBkgrndCol: '#000000',
            nBkgrndOpacity: 0.5,
            strContentCol: '#ffffff',
            nContentOpacity: 0.8,
            strCaptionCol: '#555555',
            nCaptionOpacity: 1.0,
            nCaptionType: 2,
            bCaptionCount: true,
            strCaptionFontType: 'Tahoma,Serif',
            strCaptionFontCol: '#ffffff',
            nCaptionFontSz: 15,
            bShowPlay: true,
            bAnimateOpenClose: true,
            nPlayPeriod: 2000,

        //-----------------------------------
        // Permanent Settings
        //-----------------------------------
			
			nZIndex: 151,
            nPlayBtnOffset: 18,
            nNextBtnSz: 35,
            nLoadBtnSz: 50,
            nPlayBtnSz: 40,
            nBtnOffset: 10,
            nTableBorderSz: 10,
            nCaptionPadding: 15,
            nCaptionOffset: 10,
            bShowTranspBkgrndDiv: true,
			
            loadBtnSrc: ( settings.strImgDir + 'lightbox_load.gif' ),
            blankSrc: ( settings.strScriptDir + 'blank.gif' ),
            playBtnSrc: ( settings.strImgDir + 'lightbox_play.png' ),
            playOverBtnSrc: ( settings.strImgDir + 'lightbox_play_over.png' ),
            pauseBtnSrc: ( settings.strImgDir + 'lightbox_pause.png' ),
            pauseOverBtnSrc: ( settings.strImgDir + 'lightbox_pause_over.png' )	,		
			
            closeBtnSrc: ( settings.strImgDir + 'lightbox_close_' + settings.nButtonType + '.png' ),
            closeOverBtnSrc: ( settings.strImgDir + 'lightbox_close_over_' + settings.nButtonType + '.png' ),
            nextBtnSrc: ( settings.strImgDir + 'lightbox_next_' + settings.nButtonType + '.png' ),
            nextOverBtnSrc: ( settings.strImgDir + 'lightbox_next_over_' + settings.nButtonType + '.png' ),
            prevBtnSrc: ( settings.strImgDir + 'lightbox_prev_' + settings.nButtonType + '.png' ),
            prevOverBtnSrc: ( settings.strImgDir + 'lightbox_prev_over_' + settings.nButtonType + '.png' ),

            border_n: ( settings.strImgDir + 'lightbox_n_' + settings.nBorderType + '.png' ),          
            border_e: ( settings.strImgDir + 'lightbox_e_' + settings.nBorderType + '.png' ),             
            border_s: ( settings.strImgDir + 'lightbox_s_' + settings.nBorderType + '.png' ),             
            border_w: ( settings.strImgDir + 'lightbox_w_' + settings.nBorderType + '.png' ),             
            border_ne: ( settings.strImgDir + 'lightbox_ne_' + settings.nBorderType + '.png' ),             
            border_nw: ( settings.strImgDir + 'lightbox_nw_' + settings.nBorderType + '.png' ),             
            border_se: ( settings.strImgDir + 'lightbox_se_' + settings.nBorderType + '.png' ),             
            border_sw: ( settings.strImgDir + 'lightbox_sw_' + settings.nBorderType + '.png' )        
			
        }, settings);
        
        //-----------------------------------
        // Declare browser enumeration
        //-----------------------------------
        var eBrowser = 
        { 
            Msie:0,
            Mozilla:1,
            Safari:2,
            Opera:3,
            Chrome:4
        };

        //-----------------------------------
        // Declare rel enumeration
        //-----------------------------------
        var eRel = 
        { 
            GalleryId:0,
            UniqueId:1,
            Caption:2,
            Width:3,
            Height:4
        };

        //-----------------------------------
        // Declare content enumeration
        //-----------------------------------
        var eContent = 
        { 
            Image:0,
            Iframe:1,
            Flash:2,
            QuickTime:3
        };

        //-----------------------------------
        // Declare caption position enumeration
        //-----------------------------------
        var eCaption = 
        { 
            NoCaption:0,
            ExternalDivBottom:1,
            ExternalDivTop:2
        };

        //-----------------------------------
        // Declare mouse over enumeration
        //-----------------------------------
        var eMouseOver = 
        { 
            None:0,
            Next:1,
            Prev:2
        };

        //-----------------------------------
        // Declare member variables
        //-----------------------------------
        var m_nContentType = eContent.Image;
        var m_AnchorArray = new Array();
        var m_nArrayPos = 0;
        var m_nArraySize = 0;

        var $m_BackgroundDiv = null;
        var $m_Table = null;
        var $m_Content = null;
        var $m_ContentContainer = null;
        var $m_CloseDiv = null;
        var $m_NextDiv = null;
        var $m_PrevDiv = null;
        var $m_PlayDiv = null;
        var $m_CaptionContainer = null;
        var $m_Caption = null;

        var m_strCloseTitle = settings.bShowToolTip ? 'title="' + settings.strCloseToolTip + '"' : '';
        var m_strPrevTitle = settings.bShowToolTip ? 'title="' + settings.strPrevToolTip + '"' : '';
        var m_strNextTitle = settings.bShowToolTip ? 'title="' + settings.strNextToolTip + '"' : '';
        var m_strPlayTitle = settings.bShowToolTip ? 'title="' + settings.strPlayToolTip + '"' : '';
        var m_strPauseTitle = settings.bShowToolTip ? 'title="' + settings.strPauseToolTip + '"' : '';

        var m_bResizing = false;
        var m_bClosing = false;
        var m_nResizeStep = 0;
        var m_nResizeTimerId = 0;
        var m_bChangingContent = false;
        var m_bSingleItem = false;
        var m_strSource;
        var m_strCaption;
        
        var m_nContentWidth = 0;
        var m_nContentHeight = 0;
        var m_nContentLeft = 0;
        var m_nContentTop = 0;
        var m_nOldContentWidth = m_nContentWidth;
        var m_nOldContentHeight = m_nContentHeight;
        var m_nOldContentLeft = m_nContentLeft;
        var m_nOldContentTop = m_nContentTop;
        var m_nDefaultWidth = 600;
        var m_nDefaultHeight = 400;
        var m_nCaptionHeight = settings.nCaptionFontSz + settings.nCaptionPadding;
        
        var m_bPlaying = false;
        var m_nPlayTimerId = 0;
        var m_nMouseOverPos = 0;

        var m_nBrowser = eBrowser.Opera;
        if( /chrome/.test( navigator.userAgent.toLowerCase() ) )
            m_nBrowser = eBrowser.Chrome;
        else if( jQuery.browser.safari )
            m_nBrowser = eBrowser.Safari;

        const m_bPngHack = false;

        //-----------------------------------
        // Initialise gallery
        //-----------------------------------
        this.click(function() 
        {
            if( !$m_Table )
                Initialise( this );

            return false;
        });       

        //--------------------------------------
        // Main initialisation function which registers events and configures lightbox
        //--------------------------------------
        function Initialise( anchor ) 
        {
            // Reset content dimensions
            m_nContentWidth = 200;
            m_nContentHeight = 200;
            m_nContentLeft = GetContentLeft();
            m_nContentTop = GetContentTop();
            StoreOldDimensions();

            // Preload loading image
	        imgLoad = new Image();
	        imgLoad.src = settings.loadBtnSrc;

            //-----------------------------------
            // Add lightbox elements
            //-----------------------------------

            // Add transparent background Div
            if( settings.bShowTranspBkgrndDiv )            
            {
                $('body').append('<div id="wplightbox_bkgrnd" style="position:absolute; top:0px; left:0px; width:' + GetPageWidth() + 'px; height:' + GetPageHeight() + 'px; background-color:' + settings.strBkgrndCol + '; z-index:' + settings.nZIndex + '; filter:alpha(opacity=' + (100 * settings.nBkgrndOpacity) + '); opacity:' + settings.nBkgrndOpacity + '; -moz-opacity:' + settings.nBkgrndOpacity + '; overflow:\'hidden\';"></div>');
                $m_BackgroundDiv = $('#wplightbox_bkgrnd');
            }

            // Add table to hold image contents
            var strTable =   '<table id="wplightbox_table" cellpadding="0" cellspacing="0" style="margin: auto 0px; text-align:center; align:center; vertical-align:middle; position:absolute; top:' + ( GetContentTop() - settings.nTableBorderSz ) + '; left:' + ( GetContentLeft() - settings.nTableBorderSz ) + '; width:'+ ( m_nContentWidth + ( settings.nTableBorderSz * 2 ) ) +'; height:'+ ( m_nContentHeight + ( settings.nTableBorderSz * 2 ) ) +'; z-index:' + ( settings.nZIndex + 1 ) + '; display:none;">\
                                    <tbody>\
                                        <tr style="height:'+settings.nTableBorderSz+'px;">\
                                            <td id="nw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_nw+'); background-repeat:no-repeat;"></td>\
                                            <td id="n" style=background-image:url('+settings.border_n+'); background-repeat:repeat-x;"></td>\
                                            <td id="ne" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_ne+'); background-repeat:no-repeat;"></td>\
                                        </tr>\
                                        <tr>\
                                            <td id="w" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_w+'); background-repeat:repeat-y;"></td>\
                                            <td id="wplightbox_contentcol" style="background-color:'+settings.strContentCol+';"><img id="wplightbox_content" src="' + settings.loadBtnSrc + '" style="border:1px #000000;"/></td>\
                                            <td id="e" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_e+'); background-repeat:repeat-y;"></td>\
                                        </tr>\
                                        <tr style="height:'+settings.nTableBorderSz+'px;">\
                                            <td id="sw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_sw+'); background-repeat:no-repeat;"></td>\
                                            <td id="s" style=background-image:url('+settings.border_s+'); background-repeat:repeat-x;"></td>\
                                            <td id="se" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_se+'); background-repeat:no-repeat;"></td>\
                                        </tr>\
                                    </tbody>\
                                </table>';

            // Append contents table
            $('body').append( strTable );
            $m_Table = $('#wplightbox_table');
            $m_ContentContainer = $('#wplightbox_contentcol');
            $m_Content = $('#wplightbox_content');

            // Add close button
            $('body').append('<div id="wplightbox_closediv" ' + m_strCloseTitle + ' style="position:absolute; top:' + (GetContentTop() - settings.nTableBorderSz - (settings.nNextBtnSz / 2)) + 'px; left:' + (GetContentLeft() - settings.nTableBorderSz + m_nContentWidth - (settings.nNextBtnSz / 2)) + 'px; width:' + settings.nNextBtnSz + 'px; height:' + settings.nNextBtnSz + 'px; z-index:' + (settings.nZIndex + 5) + '; cursor:pointer; border-style:none; background-image:url(' + settings.closeBtnSrc + '); background-repeat:no-repeat;"></div>');
            $m_CloseDiv = $('#wplightbox_closediv');

            // Add next and previous buttons
            $('body').append('<div id="wplightbox_nextdiv" ' + m_strNextTitle + ' style="position:absolute; top:' + (GetContentTop() + m_nContentHeight) + 'px; left:' + (GetContentLeft() + m_nContentWidth + settings.nNextBtnSz) + 'px; width:' + settings.nNextBtnSz + 'px; height:' + settings.nNextBtnSz + 'px; z-index:' + (settings.nZIndex + 5) + '; cursor:pointer; border-style:none; background-image:url(' + settings.nextBtnSrc + '); background-repeat:no-repeat; display:none;"></div>');
            $('body').append('<div id="wplightbox_prevdiv" ' + m_strPrevTitle + ' style="position:absolute; top:' + (GetContentTop() + m_nContentHeight) + 'px; left:' + (GetContentLeft() - (settings.nNextBtnSz * 2)) + 'px; width:' + settings.nNextBtnSz + 'px; height:' + settings.nNextBtnSz + 'px; z-index:' + (settings.nZIndex + 5) + '; cursor:pointer; border-style:none; background-image:url(' + settings.prevBtnSrc + '); background-repeat:no-repeat; display:none;"></div>');
            $m_NextDiv = $('#wplightbox_nextdiv');
            $m_PrevDiv = $('#wplightbox_prevdiv');

            // Add play button
            if( settings.bShowPlay )
            {
                $('body').append('<div id="wplightbox_playdiv" ' + m_strPlayTitle + ' style="position:absolute; top:' + (GetContentTop() + m_nContentHeight - (settings.nPlayBtnSz + settings.nPlayBtnOffset)) + 'px; left:' + (GetContentLeft() + m_nContentWidth - (settings.nPlayBtnSz + settings.nPlayBtnOffset)) + 'px; width:' + settings.nPlayBtnSz + 'px; height:' + settings.nPlayBtnSz + 'px; z-index:' + (settings.nZIndex + 2) + '; cursor:pointer; border-style:none; background-image:url(' + settings.playBtnSrc + '); background-repeat:no-repeat; display:none;"></div>');
                $m_PlayDiv = $('#wplightbox_playdiv');
            }

            // Initialise captions            
            InitCaption();

            // Register mouse click
            if( settings.bShowTranspBkgrndDiv && settings.bBkgrndClickable )
            {
                $m_BackgroundDiv.click(function()
                {
                   StartClose();
                   return false;
                });
            }

            //-----------------------------------
            // Bind lightbox events
            //-----------------------------------
     
            // Register resize event 
            $(window).bind('resize', function() 
            {
                m_nContentLeft = GetContentLeft();
                m_nContentTop = GetContentTop();
                
                if( settings.bShowTranspBkgrndDiv )    
                    $m_BackgroundDiv.css({ 'width':GetPageWidth(), 'height':GetPageHeight(), 'overflow':'hidden' });   

                // Remove and re-append contents table - this fixes a bug with 
                // safari where resizing the table causes table border artefacts
                if( $m_CaptionContainer )
                {
                    $m_CaptionContainer.remove();
                    $m_CaptionContainer = null;
                }

                $m_Table.remove();
                $('body').append( strTable );
                $m_Table = $('#wplightbox_table');
                $m_ContentContainer = $('#wplightbox_contentcol');
                $m_Content = $('#wplightbox_content');
                $m_Content.attr({ 'src':m_strSource, 'width':m_nContentWidth, 'height':m_nContentHeight });
                $m_Table.css({ 'left':(m_nContentLeft - settings.nTableBorderSz), 'top':(m_nContentTop - settings.nTableBorderSz), 'width':(m_nContentWidth + (settings.nTableBorderSz * 2)), 'height':(m_nContentHeight + (settings.nTableBorderSz * 2)) }); 
                $m_Table.show();                

                InitCaption();
                SetCaptionText( true );
                SetCaptionPosition(); 
                ShowCaption( HasCaption() );  

                PositionCloseBtn();
                if( settings.bShowPlay )
                    PositionPlayBtn();
                PositionNextAndPrevBtn();

                ShowImg();
            });

            // Split the lightbox tag into its component parts
            var optionArray = anchor.rel.split('~#~');

            // Reset the m_AnchorArray
            if( m_nArraySize > 0 ) 
                m_AnchorArray = [];
            m_nArrayPos = 0;

            // Load single item
            if( optionArray[0] === 'wplightbox' )
            { 
                m_nArraySize = 1;
                m_AnchorArray[ m_nArrayPos ] = anchor;

                if( settings.bAnimateOpenClose )
                    GetPositionFromAnchor( $(anchor), true );
                Load( anchor, true );
                RegisterEvents( true );
                $m_Table.show();
            }  
            else // Load multiple items
            {
                var nCount = 0;
                var uniqueArray = new Array();

                // Populate the m_AnchorArray
                $('a').each( function(i) 
                { 
					if( this.rel )
                    {
                        var tmpArray = this.rel.split('~#~');
                        if( optionArray[0] === tmpArray[0] )
                        {
                            var bProcessAnchor = false;                            
							if( tmpArray[eRel.UniqueId] === "" )
                            {
                                 bProcessAnchor = true;
                            }
                            else if( uniqueArray[ tmpArray[eRel.UniqueId] ] != 99 )
                            {
                                 uniqueArray[ tmpArray[eRel.UniqueId] ] = 99; 
                                 bProcessAnchor = true;
                            }
                           
                            if( bProcessAnchor ) 
                            {                     
                                m_AnchorArray[ nCount ] = this;
                                ++nCount; 
                            }                        
						}
                    }          
                });

                m_nArraySize = nCount;
                m_bSingleItem = ( m_nArraySize < 2 );
                
				var assocOffset = GetAssociateImageOffset( anchor );
                
                // Find current anchor position
                for( nCount = 0; nCount < m_nArraySize; ++nCount )
                {
                    if( m_AnchorArray[ nCount ].href === anchor.href
                        && m_AnchorArray[ nCount ].rel === anchor.rel ) 
                    {
                        if( assocOffset === null )
                        {
                            m_nArrayPos = nCount;
                            break;
                        }
                        else
                        {
                            var anchorOffset = GetAssociateImageOffset( m_AnchorArray[ nCount ] );
                            
                            if( anchorOffset != null
                                && assocOffset.left === anchorOffset.left
                                && assocOffset.top === anchorOffset.top )
                            {
                                m_nArrayPos = nCount;
                                break;
                            }
                        }
                    }
                }
                
                if( settings.bAnimateOpenClose )
                    GetPositionFromAnchor( $(m_AnchorArray[ m_nArrayPos ]), true );
                Load( m_AnchorArray[ m_nArrayPos ], m_bSingleItem );
                RegisterEvents( m_bSingleItem );
                $m_Table.show();
            }

            if( m_bPngHack )
            {
                $('#ne,#n,#nw,#e,#w,#se,#s,#sw,#cne,#cn,#cnw,#ce,#cw,#cse,#cs,#csw,#wplightbox_closediv,#wplightbox_nextdiv,#wplightbox_prevdiv').PngHack();

                if( settings.bShowPlay && !m_bSingleItem )
                   $m_PlayDiv.PngHack();
            }
        };

        //--------------------------------------
        // Configures next and previous buttons according to mouse over pos
        //--------------------------------------
        function SetMouseOverPos( nPos ) 
        {
            if( !m_bResizing )
            {
                m_nMouseOverPos = nPos;

                switch( m_nMouseOverPos )
                {
                    case eMouseOver.None:
                        $m_NextDiv.hide();
                        $m_PrevDiv.hide();
                        $m_Content.css({ 'cursor':'default' });
                        break;

                    case eMouseOver.Next:
                        $m_NextDiv.show();
                        $m_PrevDiv.hide();
                        $m_Content.css({ 'cursor':'pointer' });
                        break;

                    case eMouseOver.Prev:
                        $m_NextDiv.hide();
                        $m_PrevDiv.show();
                        $m_Content.css({ 'cursor':'pointer' });
                        break;
                }
            }
        };

        //--------------------------------------
        // Get position from objAnchor
        //--------------------------------------
        function GetPositionFromAnchor( objAnchor, bStart ) 
        {
            var span = objAnchor.parent('span');
            if( span.size() > 0 ) // If artistic text then extract position from grand-parent div
            {
                // This works ok as long as WP exports artistic text using
                //<div abs:pos><div class><span><a>Text</a></span></div></div>
                // If export format changes then update code below.

                var positionDiv = span.parent().parent();
                var divOffset = positionDiv.offset();
                m_nContentLeft = divOffset.left;
                m_nContentTop = divOffset.top;
                m_nContentWidth = positionDiv.width();
                m_nContentHeight = positionDiv.height();
            }
            else
            {
                var img = jQuery( 'img', objAnchor );
                if( img.size() < 1 ) // If can't find image, search siblings
                {
                    var parentDiv = $(objAnchor).parent('div');
                    if( parentDiv.size() > 0 )
                        img = jQuery( 'img', parentDiv );
                }

                if( img.size() > 0 ) // For a standard image, extract position from image coords
                {
                    var imgOffset = img.offset();
                    m_nContentLeft = imgOffset.left;
                    m_nContentTop = imgOffset.top;
                    m_nContentWidth = img.width();
                    m_nContentHeight = img.height();
                }
                else // Else use raw anchor coords
                {
                    var anchorOffset = objAnchor.offset();
                    m_nContentLeft = anchorOffset.left;
                    m_nContentTop = anchorOffset.top;
                    m_nContentWidth = objAnchor.width();
                    m_nContentHeight = objAnchor.height();
                }
            }

            if( bStart )
            {
                $m_Table.css({ 'left':(m_nContentLeft - settings.nTableBorderSz), 'top':(m_nContentTop - settings.nTableBorderSz), 'width':(m_nContentWidth + (settings.nTableBorderSz * 2)), 'height':(m_nContentHeight + (settings.nTableBorderSz * 2)) }); 
            }
        }

        //--------------------------------------
        // Loads content from objAnchor
        //--------------------------------------
        function Load( objAnchor, bSingleItem ) 
        {
            var bItemLoaded = false;
            m_bSingleItem = bSingleItem;

            var objArray = objAnchor.rel.split('~#~');
            if( objArray.length > 1 )
                m_strCaption = objArray[eRel.Caption];
            else
                m_strCaption = '';

            m_strSource = objAnchor.href;
            if( !m_strSource.length )
            {
                // If not a standard <a rel="wplightbox" href="url"> 
                // extract image url from the area's href  

                // First attempt to find a child area
                var childArea = jQuery( 'area', objAnchor );
                if( childArea.size() > 0 )
                {
                    jQuery.each( childArea, function(){ 
                        m_strSource = this.href;
                        if( m_strSource.length > 0 )
                            return false;
                     });
                }
                else
                {
                    // Failed to find child area, find parent area
                    var parentDiv = $(objAnchor).parent('div');
                    if( parentDiv.size() > 0 )
                    {
                        var area = jQuery( 'area', parentDiv );
                        if( area.size() > 0 )
                            m_strSource = area[0].href;
                    }
                }
            }

            SetContentToImage();

            var urlType = m_strSource.toLowerCase().slice( m_strSource.lastIndexOf( '.' ) );
            m_nContentType = eContent.Iframe; // Use Iframe as default content

            switch( urlType )
            {
                case '.jpg':
                case '.jpeg':
                case '.png':
                case '.gif':
                case '.bmp':
                    m_nContentType = eContent.Image;
                    break;
                case '.swf':
                    m_nContentType = eContent.Flash;
                    break;
                case '.mov':
                    m_nContentType = eContent.QuickTime;
                    break;
            }

            if( m_nContentType != eContent.Image )
                GetRelDimensions( objAnchor, m_nContentType );

            HideControls();

            if( m_nContentType == eContent.Image )	
            {
                var image = new Image();
                image.onload = function() 
                { 
                    bItemLoaded = true;
                    image.onload = null;

                    StoreOldDimensions();

                    m_nContentWidth = image.width;
                    m_nContentHeight = image.height;

                    if( settings.nCaptionType == eCaption.ExternalDivTop ) 
                    {
                        SetCaptionText( true );
                        SetCaptionPosition();
                    }

                    m_nContentLeft = GetContentLeft();
                    m_nContentTop = GetContentTop();

                    StartResize();
                };
                image.src = m_strSource;
            }
            else
            {
                StartResize();
            }
        };

        //--------------------------------------
        // Displays new image
        //--------------------------------------
        function ShowImg()
        {
            StopResize();    

            switch( m_nContentType )
            {
                case eContent.Image:
                    $m_ContentContainer.append( '<img id="wplightbox_content" src="' + settings.blankSrc + '" style="border:1px #000000;"/>' );
                    break;

                case eContent.Iframe:
                    $m_ContentContainer.append( '<iframe id="wplightbox_content" src="' + settings.blankSrc + '" frameborder=0 style="border:1px #000000;"/>' );
                    break;

                case eContent.QuickTime:
                    {
                        var strObject = '<div id="wplightbox_content" style="z-index:' + ( settings.nZIndex + 1 ) + ';"><object classid="CLSID:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" ';
                        strObject += 'codebase="http://www.apple.com/qtactivex/qtplugin.cab" ';
                        strObject += 'standby="Loading Player..." ';
                        strObject += 'type="application/x-oleobject" ';
                        strObject += 'id="wplightbox_quicktime" ';
			            strObject += 'width="' + m_nContentWidth + 'px" ';
			            strObject += 'height="' + m_nContentHeight + 'px">';
  			            strObject += '<param name="src" value="' + m_strSource + '"/>'
  			            strObject += '<param name="autoplay" value="true"/>';
  			            strObject += '<param name="loop" value="true"/>';
  			            strObject += '<embed src="' + m_strSource + '" ';
                        strObject += 'autoplay="true" '; 
                        strObject += 'loop="true" '; 
                        strObject += 'type="video/quicktime" ';
                        strObject += 'pluginspage="http://www.apple.com/quicktime/" '; 
                        strObject += 'width="' + m_nContentWidth + 'px" ';
  			            strObject += 'height="' + m_nContentHeight + 'px"></embed>';
                        strObject += '</object></div>';

                        $m_ContentContainer.append( strObject );
                        StopPlayTimer();
                    }
                    break;

                case eContent.Flash:
                    {
                        if( DetectFlashVer( 8, 0, 0 ) )
                        {
                            var strFlashObject = '<div id="wplightbox_content"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                            strFlashObject += 'codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab" ';
                            strFlashObject += 'id="wplightbox_flashobj" ';
                            strFlashObject += 'width="' + m_nContentWidth + 'px" ';
                            strFlashObject += 'height="' + m_nContentHeight + 'px">';
  			                strFlashObject += '<param name="movie" value="' + m_strSource + '"/>'
  			                strFlashObject += '<param name="quality" value="high"/>';
  			                strFlashObject += '<embed src="' + m_strSource + '" ';
                            strFlashObject += 'quality="high" '; 
                            strFlashObject += 'type="application/x-shockwave-flash" ';
                            strFlashObject += 'pluginspage="http://www.macromedia.com/go/getflashplayer" ';
                            strFlashObject += 'width="' + m_nContentWidth + 'px" ';
                            strFlashObject += 'height="' + m_nContentHeight + 'px"></embed>';
                            strFlashObject += '</object></div>';

                           $m_ContentContainer.append( strFlashObject );
                        }
                        else
                        {
                            $m_ContentContainer.append( '<div id="wplightbox_content" frameborder=0 style="border:1px #000000;"/>An old version of the Flash plugin was detected. <strong><a href="http://www.macromedia.com/go/getflash/">Please upgrade your Flash plugin.<\/a><\/strong><\/div>' );
                        }
                        StopPlayTimer();
                    }
                    break;
            }

            $m_Content.remove();
            $m_Content = $('#wplightbox_content');
            $m_Content.attr({ 'src':m_strSource });
            
            $m_Content.animate( { opacity:1.0 }, 10, function()
            { 
                $m_Content.attr({ 'width':m_nContentWidth, 'height':m_nContentHeight }); 
                $m_ContentContainer.animate( { 'opacity':1.0, '-moz-opacity':1.0, 'filter:alpha:opacity':100 }, 100, function() 
                { 
                    m_bChangingContent = false; 

                    PositionCloseBtn();
                    $m_CloseDiv.show();

                    if( !m_bSingleItem )
                    {
                        if( settings.bShowPlay )
                        {
                            PositionPlayBtn();
                            $m_PlayDiv.show();
                        }

                        PositionNextAndPrevBtn();
                        $m_NextDiv.show();
                        $m_PrevDiv.show();
                    }
                });
            });

            ShowCaption( HasCaption() )
        };
 
        //--------------------------------------
        // Extracts dimensions from 'rel' attribute of anchor
        //--------------------------------------
        function GetRelDimensions( objAnchor, nContentType )
        {
            if( objAnchor )
            {
                StoreOldDimensions();

                var relArray = objAnchor.rel.split('~#~');
                
                // Read in rel width if it has been set
                if( relArray[eRel.Width] )
                    m_nContentWidth = eval( relArray[eRel.Width] );
                else
                    m_nContentWidth = m_nDefaultWidth;

                // Read in rel height if it has been set
                if( relArray[eRel.Height] )
                    m_nContentHeight = eval( relArray[eRel.Height] );
                else
                    m_nContentHeight = m_nDefaultHeight;

                // Update content position relative to new size
                m_nContentLeft = GetContentLeft();
                m_nContentTop = GetContentTop();
            }
        };
    
        //--------------------------------------
        // Start resize animation timer
        //--------------------------------------
        function StartResize()
        {
            if( !m_bResizing )
            {
                m_bResizing = true;
                m_nResizeStep = 0;
                m_nResizeTimerId = setInterval( OnResize, 12 );
            }
        };

        //--------------------------------------
        // Switches main content to an image
        //--------------------------------------
        function SetContentToImage()
        {
            if( m_nContentType != eContent.Image )
            {
                $m_Content.remove();
                $m_ContentContainer.append('<img id="wplightbox_content" src="' + settings.loadBtnSrc + '" style="width=' + settings.nLoadBtnSz + 'px; height=' + settings.nLoadBtnSz + 'px; border:1px #000000;"/>');
                $m_Content = $('#wplightbox_content');
            }
        };

        //--------------------------------------
        // Stop resize animation timer
        //--------------------------------------
        function StopResize()
        {
            if( m_bResizing )
            {
               m_bResizing = false;
               clearInterval( m_nResizeTimerId );
            }  
        };

        //--------------------------------------
        // Update resize animation
        //--------------------------------------
        function OnResize()
        {
            if( !settings.bAnimateOpenClose )
                m_nResizeStep = 14;

            m_nResizeStep += 1;

	        var nProgress = ( m_nResizeStep / 15 );   
			var nTop	= Math.round( m_nOldContentTop	+ ( m_nContentTop - m_nOldContentTop ) * nProgress );
			var nLeft	= Math.round( m_nOldContentLeft + ( m_nContentLeft - m_nOldContentLeft ) * nProgress );
            var nWidth	= Math.round( m_nOldContentWidth + ( m_nContentWidth - m_nOldContentWidth ) * nProgress );
            var nHeight = Math.round( m_nOldContentHeight + ( m_nContentHeight - m_nOldContentHeight ) * nProgress );
            
            var nTableLeft = nLeft - settings.nTableBorderSz;
            var nTableTop = nTop - settings.nTableBorderSz;
            var nTableWidth = nWidth + ( settings.nTableBorderSz * 2 );
            var nTableHeight = nHeight + ( settings.nTableBorderSz * 2 );

            $m_Table.css({ 'left':nTableLeft, 'top':nTableTop, 'width':nTableWidth, 'height':nTableHeight }); 

            if( m_nResizeStep >= 15 )
            {
                if( m_bClosing )                
                    Close();
                else
                    ShowImg();
            }
        };

        //--------------------------------------
        // Starts play timer
        //--------------------------------------
        function StartPlayTimer()
        {
            if( !m_bPlaying )
            {
                m_bPlaying = true;
                
                if( settings.bShowToolTip )
                    $m_PlayDiv.attr({ 'title':settings.strPauseToolTip });

                if( m_bPngHack )
                    $m_PlayDiv.ImgPngHack( settings.pauseBtnSrc );
                else
                    $m_PlayDiv.css({ 'backgroundImage':'url(' + settings.pauseBtnSrc + ')' });

                OnPlayTimer();
                m_nPlayTimerId = setInterval( OnPlayTimer, settings.nPlayPeriod );
            }
        };

        //--------------------------------------
        // Stop play timer
        //--------------------------------------
        function StopPlayTimer()
        {
            if( m_bPlaying )
            {
                m_bPlaying = false;
                
                if( settings.bShowToolTip )
                    $m_PlayDiv.attr({ 'title':settings.strPlayToolTip });

                if( m_bPngHack )
                    $m_PlayDiv.ImgPngHack( settings.playBtnSrc );
                else
                    $m_PlayDiv.css({ 'backgroundImage':'url(' + settings.playBtnSrc + ')' });

                clearInterval( m_nPlayTimerId );
            }  
        };

        //--------------------------------------
        // Updates play
        //--------------------------------------
        function OnPlayTimer()
        {
            Next( false );
        };

        //--------------------------------------
        // Close wp lightbox
        //--------------------------------------
        function HideControls() 
        {
            $m_Content.attr({ 'src':settings.loadBtnSrc, 'width':settings.nLoadBtnSz, 'height':settings.nLoadBtnSz });
            $m_ContentContainer.css({ 'opacity':settings.nContentOpacity, '-moz-opacity':settings.nContentOpacity, 'filter:alpha:opacity':( settings.nContentOpacity * 100 ) });
            $m_CloseDiv.hide();

            ShowCaption( false );
            if( !m_bSingleItem )
            {
                SetMouseOverPos( eMouseOver.None );
                if( settings.bShowPlay )
                    $m_PlayDiv.hide();
            }
        }

        //--------------------------------------
        // Close wp lightbox
        //--------------------------------------
        function StartClose() 
        {
            if( !m_bClosing )
            {
                m_bClosing = true;

                if( settings.bAnimateOpenClose )
                {
                    HideControls();
                    StoreOldDimensions();
                    SetContentToImage();
                    GetPositionFromAnchor( $(m_AnchorArray[ m_nArrayPos ]), false );
                    StartResize();
                }
                else
                {
                    Close();
                }
            }
        }

        //--------------------------------------
        // Close wp lightbox
        //--------------------------------------
        function Close() 
        {
            if( settings.bAnimateOpenClose )
                StopResize();             
            m_bClosing = false; 

            $(document).unbind('keyup');
            $(window).unbind('resize');

            $("#wplightbox_bkgrnd").unbind("click");
            $("#wplightbox_close").unbind("click");

            if( $m_CaptionContainer )
            {
                $m_CaptionContainer.remove();
                $m_CaptionContainer = null;
            }

            $m_Table.remove();
            $m_CloseDiv.remove();

            if( !m_bSingleItem )
            {
                $("#wplightbox_next").unbind("click");
                $("#wplightbox_prev").unbind("click");
                $m_NextDiv.remove();
                $m_PrevDiv.remove();
                
                if( settings.bShowPlay )
                {                   
                    StopPlayTimer();
                    $m_PlayDiv.unbind("click");
                    $m_PlayDiv.remove();
                }
            }

            if( settings.bShowTranspBkgrndDiv )
                $m_BackgroundDiv.animate({ 'opacity':0.0, '-moz-opacity':0.0, 'filter:alpha:opacity':0 }, 300, function() { $('#wplightbox_bkgrnd').remove(); m_nContentWidth = 200; m_nContentHeight = 200; });
        
            $m_Table = null;
            $m_CloseDiv = null;
            $m_NextDiv = null;
            $m_PrevDiv = null;
            $m_PlayDiv = null;
            $m_BackgroundDiv = null;
        };
        
        //--------------------------------------
        // Move to next item
        //--------------------------------------
        function Next( bStopPlayTimer ) 
        {
            if( !m_bChangingContent )
            {
                if( bStopPlayTimer )
                    StopPlayTimer();

                m_bChangingContent = true;
                ++m_nArrayPos;
                
                if( m_nArrayPos >= m_nArraySize )
                    m_nArrayPos = 0;
                    
                Load( m_AnchorArray[ m_nArrayPos ], false );     
            }
        };

        //--------------------------------------
        // Move to previous item
        //--------------------------------------
        function Prev() 
        {
            if( !m_bChangingContent )
            {
                StopPlayTimer();
                
                m_bChangingContent = true;
                --m_nArrayPos;
                
                if( m_nArrayPos < 0 )
                    m_nArrayPos = m_nArraySize - 1;
      
                Load( m_AnchorArray[ m_nArrayPos ], false );   
            }  
        };
        
        //--------------------------------------
        // Register keyboard, mouse hover and mouse click events
        //--------------------------------------
        function RegisterEvents( bSingleItem )
        {
            $(document).bind('keyup', function(e) 
            { 
		        if(e == null) keycode = event.keyCode; // IE			        
                else keycode = e.which;  // Mozilla
			        
			    if( bSingleItem )
			    {
				    if( keycode == 27 )
			             StartClose(); 
			    }
			    else
			    {
			        switch( keycode )   
			        {
			             case 27:   
			                 StartClose();   
			                 break;
			             
			             case 190: 
			             case 39:   
			                 Next( true );    
			                 break; 
			             
			             case 188: 
			             case 37:   
			                 Prev();    
			                 break;
			        } 
			    }
            });
           
            $m_CloseDiv.click( function(){ StartClose(); } );
            $m_CloseDiv.hover(function() { if( m_bPngHack ) $(this).ImgPngHack( settings.closeOverBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.closeOverBtnSrc + ')' }); }, function() { if( m_bPngHack ) $(this).ImgPngHack( settings.closeBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.closeBtnSrc + ')' }); });
            
            if( !bSingleItem )
            {
                if( settings.bShowPlay && !m_bSingleItem )
                {
                    $m_PlayDiv.click( function()
                    { 
                        if( !m_bPlaying )
                            StartPlayTimer();
                        else
                            StopPlayTimer();
                    });
                }

                $m_PrevDiv.click( function(){ Prev(); } );
                $m_NextDiv.click( function(){ Next( true ); } );
                $m_PrevDiv.hover(function() { if( m_bPngHack ) $(this).ImgPngHack( settings.prevOverBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.prevOverBtnSrc + ')' }); }, function() { if( m_bPngHack ) $(this).ImgPngHack( settings.prevBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.prevBtnSrc + ')' }); });
                $m_NextDiv.hover(function() { if( m_bPngHack ) $(this).ImgPngHack( settings.nextOverBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.nextOverBtnSrc + ')' }); }, function() { if( m_bPngHack ) $(this).ImgPngHack( settings.nextBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.nextBtnSrc + ')' }); });
    
                if( settings.bShowPlay )
                {
                    $m_PlayDiv.hover(function() 
                    { 
                        if( m_bPlaying ) { if( m_bPngHack ) $(this).ImgPngHack( settings.pauseOverBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.pauseOverBtnSrc + ')' }); }
                        else { if( m_bPngHack ) $(this).ImgPngHack( settings.playOverBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.playOverBtnSrc + ')' }); }
                    }, 
                    function() 
                    { 
                        if( m_bPlaying ) { if( m_bPngHack ) $(this).ImgPngHack( settings.pauseBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.pauseBtnSrc + ')' }); }
                        else { if( m_bPngHack ) $(this).ImgPngHack( settings.playBtnSrc ); else $(this).css({ 'backgroundImage':'url(' + settings.playBtnSrc + ')' }); }
                    });
                }
            }
        };

        //--------------------------------------
        // Positions next and previous buttons
        //--------------------------------------
        function PositionNextAndPrevBtn() 
        {
            var nTopPos = m_nContentTop + ( m_nContentHeight / 2 ) - ( settings.nNextBtnSz / 2 );
            $m_NextDiv.css({ 'left':( m_nContentLeft + m_nContentWidth - 3 + settings.nBtnOffset ), 'top': nTopPos }); 
            $m_PrevDiv.css({ 'left':( m_nContentLeft - settings.nNextBtnSz - settings.nBtnOffset ), 'top': nTopPos }); 
       };   

        //--------------------------------------
        // Positions close button
        //--------------------------------------
        function PositionCloseBtn() 
        {
            var nTop = m_nContentTop - settings.nNextBtnSz - settings.nBtnOffset;           

            if( settings.nCaptionType == eCaption.ExternalDivTop && HasCaption() )
                nTop -= $m_CaptionContainer.height();

            $m_CloseDiv.css({ 'left':( m_nContentLeft + m_nContentWidth - settings.nNextBtnSz ), 'top':nTop }); 
        }

        //--------------------------------------
        // Positions play button
        //--------------------------------------
        function PositionPlayBtn() 
        {
            $m_PlayDiv.css({ 'left':( m_nContentLeft + m_nContentWidth - ( settings.nPlayBtnSz + settings.nPlayBtnOffset ) ), 'top':( m_nContentTop + m_nContentHeight - ( settings.nPlayBtnSz + settings.nPlayBtnOffset ) ) }); 
        };

        //--------------------------------------
        // Gets left position
        //--------------------------------------
        function GetContentLeft() 
        {
            return Math.max( 0, ( $(window).width() - m_nContentWidth ) / 2 );
        };   

        //--------------------------------------
        // Gets top position
        //--------------------------------------
        function GetContentTop() 
        {
            if( settings.nCaptionType == eCaption.ExternalDivTop )
            {
                if( $m_CaptionContainer && HasCaption() )
                {
                    var nCaptionHt = GetCaptionHeight();
                    return Math.max( ( settings.nNextBtnSz + settings.nBtnOffset + GetCaptionHeight() ), ( GetPageScrollY() + ( Math.min( ( $(window).height() / 10 ) + nCaptionHt, ( ( $(window).height() - ( m_nContentHeight + 20 - nCaptionHt ) ) / 2 ) ) ) ) );
                }
                else
                    return Math.max( ( settings.nNextBtnSz + settings.nBtnOffset ), ( GetPageScrollY() + ( Math.min( ( $(window).height() / 10 ) + ( ( settings.nTableBorderSz * 2 ) + m_nCaptionHeight ), ( ( $(window).height() - ( m_nContentHeight + 20 + ( ( settings.nTableBorderSz * 2 ) + m_nCaptionHeight ) ) ) / 2 ) ) ) ) );
            }
            else
            {
                return Math.max( ( settings.nNextBtnSz + settings.nBtnOffset ), ( GetPageScrollY() + ( Math.min( ( $(window).height() / 10 ), ( ( $(window).height() - ( m_nContentHeight + 20 ) ) / 2 ) ) ) ) );
            }
        };

        //--------------------------------------
        // Gets page width
        //--------------------------------------
        function GetPageWidth() 
        {
            var nPageWidth = ( m_nBrowser == eBrowser.Msie ) ? $(window).width() : Math.max( $(window).width(), $(document).width() ); 
            nPageWidth = Math.max( nPageWidth, ( m_nContentWidth + 40 ) );

            return nPageWidth;
        };

        //--------------------------------------
        // Gets page height
        //--------------------------------------
        function GetPageHeight() 
        {
            var nPageHeight = ( m_nBrowser == eBrowser.Msie ) ? $(document).height() : Math.max( $(window).height(), $(document).height() ); 
            nPageHeight = Math.max( nPageHeight, ( GetContentTop() + m_nContentHeight + 100 ) );

            return nPageHeight;
        };

        //--------------------------------------
        // Gets page scroll values
        //--------------------------------------
        function GetPageScrollY() 
        {
            var yScroll = 0;

            if( window.pageYOffset )
                yScroll = window.pageYOffset;
            else if( document.body && document.body.scrollTop )
                yScroll = document.body.scrollTop;
            else if( document.documentElement && document.documentElement.scrollTop )
                yScroll = document.documentElement.scrollTop;
            else if( window.scrollY )
                yScroll = window.scrollY;

			return yScroll;
        };

        //--------------------------------------
        // Records old content dimensions
        //--------------------------------------
        function StoreOldDimensions() 
        {
            m_nOldContentWidth = m_nContentWidth;
            m_nOldContentHeight = m_nContentHeight;
            m_nOldContentTop = m_nContentTop;
            m_nOldContentLeft = m_nContentLeft;
        };

        //--------------------------------------
        // Performs png hack
        //--------------------------------------
		$.fn.PngHack = function()
        {
			this.each(function () 
            {
				var img = $(this).css('backgroundImage');
				if( img.match(/^url\((.*\.png)\)$/i) ) 
                {
					img = RegExp.$1;
					$(this).css(
                    {
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img + "', sizingMethod=" + ($(this).css('background-repeat') == 'no-repeat' ? 'crop' : 'scale') + ")"
					});
				}
			});
        };

        //--------------------------------------
        // Performs png hack
        //--------------------------------------
		$.fn.ImgPngHack = function( strImgUrl )
        {
            $(this).css(
            {
				'backgroundImage': 'none',
				'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + strImgUrl + "' )"
			});
        };

        //--------------------------------------
        // Initialise captions
        //--------------------------------------
        function InitCaption() 
        {
            // If caption container already initialised then don't continue
            if( $m_CaptionContainer )
                return;

            switch( settings.nCaptionType )
            {
                case eCaption.ExternalDivBottom:
                case eCaption.ExternalDivTop:
                {
                    var strCaptionTable = '<table id="wplightbox_captiontable" cellpadding="0" cellspacing="0" style="margin: auto 0px; text-align:center; align:center; vertical-align:middle; position:absolute; top:' + (GetContentTop() + (settings.nTableBorderSz * 2) + m_nContentHeight) + 'px; left:' + (GetContentLeft() - settings.nTableBorderSz) + 'px; width:' + (m_nContentWidth + (settings.nTableBorderSz * 2)) + 'px; height:' + m_nCaptionHeight + 'px; z-index:' + (settings.nZIndex + 3) + ';">\
                                            <tbody>\
                                                <tr style="height:'+settings.nTableBorderSz+'px;">\
                                                    <td id="cnw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_nw+'); background-repeat:no-repeat;"></td>\
                                                    <td id="cn" style=background-image:url('+settings.border_n+'); background-repeat:repeat-x;"></td>\
                                                    <td id="cne" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_ne+'); background-repeat:no-repeat;"></td>\
                                                </tr>\
                                                <tr style="height:' + m_nCaptionHeight + ';">\
                                                    <td id="cw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_w+'); background-repeat:repeat-y;"></td>\
                                                    <td id="wplightbox_captioncol" style="background-color:' + settings.strCaptionCol + '; padding:' + settings.nCaptionPadding + 'px;"><span id="wplightbox_caption" style="font-family:' + settings.strCaptionFontType + '; color:' + settings.strCaptionFontCol + '; font-size:' + settings.nCaptionFontSz + '; font-weight:normal;">Caption</span></td>\
                                                    <td id="ce" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_e+'); background-repeat:repeat-y;"></td>\
                                                </tr>\
                                                <tr style="height:'+settings.nTableBorderSz+'px;">\
                                                    <td id="csw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_sw+'); background-repeat:no-repeat;"></td>\
                                                    <td id="cs" style=background-image:url('+settings.border_s+'); background-repeat:repeat-x;"></td>\
                                                    <td id="cse" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_se+'); background-repeat:no-repeat;"></td>\
                                                </tr>\
                                            </tbody>\
                                        </table>';

                    // Add caption table
                    $('body').append( strCaptionTable );
                    $m_CaptionContainer = $('#wplightbox_captiontable');
                    $m_Caption = $('#wplightbox_caption');

                    $('#wplightbox_captioncol').css({ 'opacity':settings.nCaptionOpacity, '-moz-opacity':settings.nCaptionOpacity, 'filter:alpha:opacity':( settings.nCaptionOpacity * 100 ) });
                }
                break;
            };
        }

        //--------------------------------------
        // Sets caption position
        //--------------------------------------
        function SetCaptionPosition() 
        {
            switch( settings.nCaptionType )
            {
                case eCaption.ExternalDivBottom:
                    $m_CaptionContainer.css({ 'left':(m_nContentLeft - settings.nTableBorderSz), 'top':( m_nContentTop + settings.nCaptionOffset + m_nContentHeight ), 'width':(m_nContentWidth + (settings.nTableBorderSz * 2)) }); 
                    break;
                
                case eCaption.ExternalDivTop:
                    $m_CaptionContainer.css({ 'left':(m_nContentLeft - settings.nTableBorderSz), 'width':(m_nContentWidth + (settings.nTableBorderSz * 2)) }); 
                    var nContentTop = GetContentTop();
                    var nCaptionHeight = GetCaptionHeight();
                    $m_CaptionContainer.css({ 'top':( m_nContentTop - ( settings.nCaptionOffset + nCaptionHeight ) ) }); 
                    break;
            };
        }

        //--------------------------------------
        // Returns true if content item has a caption
        //--------------------------------------
        function HasCaption()
        {
            if( settings.nCaptionType == eCaption.NoCaption )
                return false;
            if( m_strCaption && m_strCaption.length > 0 )
                return true;
            if( settings.bCaptionCount && !m_bSingleItem )
                return true;
            return false;
        }

        //--------------------------------------
        // Sets caption position
        //--------------------------------------
        function SetCaptionText( bShow )
        {
            if( $m_Caption )
            {
                if( bShow ) // Apply caption text
                {
                    if( settings.bCaptionCount && !m_bSingleItem )
                    {
                        var nImagePos = m_nArrayPos + 1;
                        var strCount = nImagePos + '/' +  m_nArraySize + ' ';
                        $m_Caption.text( strCount +  m_strCaption );  
                    }
                    else
                    {
                        $m_Caption.text( m_strCaption );  
                    }
                }
                else // Else clear caption text
                {
                    $m_Caption.text( '' );  
                }
            }
        }

        //--------------------------------------
        // Displays or hides lightbox caption
        //--------------------------------------
        function ShowCaption( bShow )
        {
            switch( settings.nCaptionType )
            {
                case eCaption.ExternalDivBottom:
                case eCaption.ExternalDivTop:
                    {
                        if( $m_CaptionContainer )
                        {
                            if( bShow )
                            {
                                SetCaptionText( true );              
                                SetCaptionPosition();  
                                $m_CaptionContainer.show();
                            }
                            else
                            {
                                SetCaptionText( false );              
                                $m_CaptionContainer.hide();
                            }
                        }
                    }
                    break;
            };
        }

        //--------------------------------------
        // Returns caption height
        //--------------------------------------
        function GetCaptionHeight()
        {
            if( m_nBrowser == eBrowser.Msie )
            {
                return $m_CaptionContainer.height();
            }
            else
            {
                // This fixes a bug in the remaining browsers where the height of the 
                // caption container is only correct when the caption is displayed.
                $m_CaptionContainer.show();
                var nCaptionHeight = $m_CaptionContainer.height();
                $m_CaptionContainer.hide();
                return nCaptionHeight;
            }
        }
		
        //--------------------------------------
        // Returns image offset associated with objAnchor
        //--------------------------------------
        function GetAssociateImageOffset( anchor )
        {
            var img = jQuery( 'img', anchor );
            if( img.size() < 1 ) // If can't find image, search siblings
            {
                var parentDiv = $(anchor).parent('div');
                if( parentDiv.size() > 0 )
                   img = jQuery( 'img', parentDiv );
            }
           
            if( img.size() > 0 )
                return img.offset();
            return null;
        }		
    };
})(jQuery);