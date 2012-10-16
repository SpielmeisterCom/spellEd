var wm = {};	
wm.entityFiles = [];

ig.module(
	'weltmeister.weltmeister'
)
.requires(
	'dom.ready',
	'impact.game',
	'weltmeister.evented-input',
	'weltmeister.config',
	'weltmeister.edit-map',
	'weltmeister.select-file-dropdown',
	'weltmeister.undo'
)
.defines(function(){ "use strict";

wm.Weltmeister = ig.Class.extend({	
	MODE: {
		DRAW: 1,
		TILESELECT: 2
	},
	
	layers: [],
	activeLayer: null,
	collisionLayer: null,

	screen: {x: 0, y: 0},
	_rscreen: {x: 0, y: 0},
	mouseLast: {x: -1, y: -1},
	waitForModeChange: false,
	
	tilsetSelectDialog: null,
	levelSavePathDialog: null,
	labelsStep: 32,
	
	collisionSolid: 1,
	
	modified: false,
	needsDraw: true,
	
	undo: null,
	iframeId: null,

	getParam: function( name ) {
		name = name.replace( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" )
		var regexS = '[\\?&]' + name + '=([^&#]*)'
		var regex = new RegExp( regexS )
		var results = regex.exec( window.location.href )

		return ( results == null ? '' : results[ 1 ] )
	},

	init: function() {
		window.focus();

		ig.game = ig.editor = this;


		this.iframeId = this.getParam( 'iframeId' );

		ig.system.context.textBaseline = 'top';
		ig.system.context.font = wm.config.labels.font;
		this.labelsStep = wm.config.labels.step;

		this.mode = this.MODE.DEFAULT;

		$('#layers').sortable({
			update: this.reorderLayers.bind(this)
		});
		$('#layers').disableSelection();
		this.resetModified();
		
		
		// Events/Input
		for( var key in wm.config.binds ) {
			ig.input.bind( ig.KEY[key], wm.config.binds[key] );
		}
		ig.input.keydownCallback = this.keydown.bind(this);
		ig.input.keyupCallback = this.keyup.bind(this);
		ig.input.mousemoveCallback = this.mousemove.bind(this);
		
		$(window).resize( this.resize.bind(this) );
		$(window).bind( 'keydown', this.uikeydown.bind(this) );

		var me = this;

		$('#zoomIn').bind( 'click', function() { me.keyup('zoomin') } );
		$('#zoomOut').bind( 'click', function() { me.keyup('zoomout') } );

		$('input#toggleSidebar').click(function() {
			$('div#menu').slideToggle('fast');
			$('input#toggleSidebar').toggleClass('active');
		});
		
		
		this.undo = new wm.Undo( wm.config.undoLevels );

		ig.setAnimation( this.drawIfNeeded.bind(this) );

		window.addEventListener(
			'message',
			this.onMessageReceived.bind(this),
			false
		)

		this.postMessage('wm.initialized')
	},

	onMessageReceived: function( event ) {

		var data = JSON.parse( event.data );

		if ( data.type == "wm.load" ) {
			this.loadResponse( data.payload );
		}
	},

	uikeydown: function( event ) {
		if( event.target.type == 'text' ) {
			return;
		}
		
		var key = String.fromCharCode(event.which);
		if( key.match(/^\d$/) ) {
			var index = parseInt(key);
			var name = $('#layers div.layer:nth-child('+index+') span.name').text();
			
			var layer = this.getLayerWithName(name);
				
			if( layer ) {
				if( event.shiftKey ) {
					layer.toggleVisibility();
				} else {
					this.setActiveLayer( layer.name );
				}
			}
		}
	},
	
	setModified: function() {
		//always end all changes to spelled
		this.save();
	},
	
	resetModified: function() {
		this.modified = false;
	},
	
	resize: function() {
		ig.system.resize(
			Math.floor(wm.Weltmeister.getMaxWidth() / wm.config.view.zoom), 
			Math.floor(wm.Weltmeister.getMaxHeight() / wm.config.view.zoom), 
			wm.config.view.zoom
		);
		ig.system.context.textBaseline = 'top';
		ig.system.context.font = wm.config.labels.font;
		this.draw();
	},
	
	
	drag: function() {
		this.screen.x -= ig.input.mouse.x - this.mouseLast.x;
		this.screen.y -= ig.input.mouse.y - this.mouseLast.y;
		this._rscreen.x = Math.round(this.screen.x * ig.system.scale)/ig.system.scale;
		this._rscreen.y = Math.round(this.screen.y * ig.system.scale)/ig.system.scale;
		for( var i = 0; i < this.layers.length; i++ ) {
			this.layers[i].setScreenPos( this.screen.x, this.screen.y );
		}
	},
	
	
	zoom: function( delta ) {
		var z = wm.config.view.zoom;
		var mx = ig.input.mouse.x * z,
			my = ig.input.mouse.y * z;
		
		if( z <= 1 ) {
			if( delta < 0 ) {
				z /= 2;
			}
			else {
				z *= 2;
			}
		}
		else {
			z += delta;
		}
		
		wm.config.view.zoom = z.limit( wm.config.view.zoomMin, wm.config.view.zoomMax );
		wm.config.labels.step = Math.round( this.labelsStep / wm.config.view.zoom );
		$('#zoomIndicator').text( wm.config.view.zoom + 'x' ).stop(true,true).show().delay(300).fadeOut();
		
		// Adjust mouse pos and screen coordinates
		ig.input.mouse.x = mx / wm.config.view.zoom;
		ig.input.mouse.y = my / wm.config.view.zoom;
		this.drag();
		
		for( var i in ig.Image.cache ) {
			ig.Image.cache[i].resize( wm.config.view.zoom );
		}
		
		this.resize();
	},
	
	getTileSize: function() {
		return 100;
	},

	getTileSetName: function() {
		return "Tileset.png";
	},

	spellToWeltmeister: function(data, width, height) {
		var dataCopy = [];
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {

				var newvar = null;

				if (data[x] === undefined || data[x][y] === undefined || data[x][y] === null) {
					newvar = 0;
				} else {
					newvar = data[x][y] + 1;
				}

				if (dataCopy[x] === undefined) {
					dataCopy[x] = [];
				}

				dataCopy[x][y] = newvar;
			}
		}

		return dataCopy;
	},

	// -------------------------------------------------------------------------
	// Loading
	loadResponse: function( data ) {
		while( this.layers.length ) {
			this.layers[0].destroy();
			this.layers.splice( 0, 1 );
		}
		this.screen = {x: 0, y: 0};

		if (!data.tileLayerData) {
			data.tileLayerData = [];
		}

		if (!data.collisionLayerData) {
			data.collisionLayerData = [];
		}

		var tileLayerData = this.spellToWeltmeister(data.tileLayerData, data.height, data.width );
		var collisionLayerData = this.spellToWeltmeister(data.collisionLayerData, data.height, data.width );

/*
		//create collision layer
		var newLayer = new wm.EditMap( 'collision', this.getTileSize(), "", true );
		newLayer.resize( data.width, data.height );
		newLayer.data = tileLayerData;
		newLayer.visible = false;
		newLayer.linkWithCollision = false;
		newLayer.toggleVisibility();
		this.layers.push( newLayer );
		this.collisionLayer = newLayer;
		this.setActiveLayer( 'collision' );
*/
		//create tile layer
		var newLayer = new wm.EditMap( 'tilemap', parseInt(data.frameWidth, 10), '../' + data.path, true );
		newLayer.resize( data.width, data.height );
		newLayer.data = tileLayerData;
		//newLayer.linkWith Collision = true;
		newLayer.visible = false;

		newLayer.toggleVisibility();
		this.layers.push( newLayer );
		this.setActiveLayer( 'tilemap' );







		this.reorderLayers();
		$('#layers').sortable('refresh');
		
		this.resetModified();
		this.undo.clear();
		this.draw();
	},

	// -------------------------------------------------------------------------
	// Saving
	save: function( dialog, path ) {

		var data = {
			'tileLayerData': [],
			'collisionLayerData': []
		};
		
		var resources = [];
		for( var i=0; i < this.layers.length; i++ ) {
			var layer = this.layers[i];

			if (layer.name == 'collision') {
//				data.collisionLayerData = layer.getSaveData()
			} else {
				data.tileLayerData = layer.getSaveData();
			}

		}

		this.postMessage('wm.save', data)
	},

	// -------------------------------------------------------------------------
	// Layers
	getLayerWithName: function( name ) {
		for( var i = 0; i < this.layers.length; i++ ) {
			if( this.layers[i].name == name ) {
				return this.layers[i];
			}
		}
		return null;
	},
	
	
	reorderLayers: function( dir ) {
		var newLayers = [];
		var isForegroundLayer = true;
		$('#layers div.layer span.name').each((function( newIndex, span ){
			var name = $(span).text();
			
			var layer = this.getLayerWithName(name);
				
			if( layer ) {
				layer.setHotkey( newIndex+1 );
				layer.foreground = isForegroundLayer;
				newLayers.unshift( layer );
			}
		}).bind(this));
		this.layers = newLayers;
//		this.setModified();
		this.draw();
	},
	
	
	updateLayerSettings: function( ) {
		$('#layerLinkWithCollision').prop( 'checked', this.activeLayer.linkWithCollision );
	},
	
	setActiveLayer: function( name ) {
		var previousLayer = this.activeLayer;
		this.activeLayer = this.getLayerWithName(name);
		if( previousLayer == this.activeLayer ) {
			return; // nothing to do here
		}
		
		if( previousLayer ) {
			previousLayer.setActive( false );
		}
		this.activeLayer.setActive( true );
		this.mode = this.MODE.DEFAULT;
		
		$('#layerSettings')
			.fadeOut(100,this.updateLayerSettings.bind(this))
			.fadeIn(100);

		this.draw();
	},
	

	// -------------------------------------------------------------------------
	// Update
	
	mousemove: function() {
		window.focus();
		if( !this.activeLayer ) {
			return;
		}
		
		if( this.mode == this.MODE.DEFAULT ) {
			
			// scroll map
			if( ig.input.state('drag') ) {
				this.drag();
			}
			
			else if( ig.input.state('draw') ) {
				
				// draw on map
				if( !this.activeLayer.isSelecting ) {
					this.setTileOnCurrentLayer();
				}
			}
		}
		
		this.mouseLast = {x: ig.input.mouse.x, y: ig.input.mouse.y};
		this.draw();
	},
	
	
	keydown: function( action ) {
		if( !this.activeLayer ) {
			return;
		}
		
		if( action == 'draw' ) {
			if( this.mode == this.MODE.DEFAULT ) {
				if( ig.input.state('select') ) {
					this.activeLayer.beginSelecting( ig.input.mouse.x, ig.input.mouse.y );
				}
				else {
					this.undo.beginMapDraw();
					this.activeLayer.beginEditing();
					if(
						this.activeLayer.linkWithCollision &&
						this.collisionLayer &&
						this.collisionLayer != this.activeLayer
					) {
						this.collisionLayer.beginEditing();
					}
					this.setTileOnCurrentLayer();
				}

			}
			else if( this.mode == this.MODE.TILESELECT && ig.input.state('select') ) {	
				this.activeLayer.tileSelect.beginSelecting( ig.input.mouse.x, ig.input.mouse.y );
			}
		}
		
		this.draw();
	},
	
	
	keyup: function( action ) {
		if( !this.activeLayer ) {
			return;
		}
		
		if( action == 'grid' ) {
			wm.config.view.grid = !wm.config.view.grid;
		}
		
		else if( action == 'menu' ) {
			if( this.mode != this.MODE.TILESELECT ) {
				this.mode = this.MODE.TILESELECT;
				this.activeLayer.tileSelect.setPosition( ig.input.mouse.x, ig.input.mouse.y	);
			} else {
				this.mode = this.MODE.DEFAULT;
			}
		}
		
		else if( action == 'zoomin' ) {
			this.zoom( 1 );
		}
		else if( action == 'zoomout' ) {
			this.zoom( -1 );
		}
		
		
		if( action == 'draw' ) {			
			// select tile
			if( this.mode == this.MODE.TILESELECT ) {
				this.activeLayer.brush = this.activeLayer.tileSelect.endSelecting( ig.input.mouse.x, ig.input.mouse.y );
				this.mode = this.MODE.DEFAULT;
			}
			else {
				if( this.activeLayer.isSelecting ) {
					this.activeLayer.brush = this.activeLayer.endSelecting( ig.input.mouse.x, ig.input.mouse.y );
				}
				else {
					this.undo.endMapDraw();
				}
			}
		}
		
		if( action == 'undo' ) {
			this.undo.undo();
		}
		
		if( action == 'redo' ) {
			this.undo.redo();
		}
		
		this.draw();
		this.mouseLast = {x: ig.input.mouse.x, y: ig.input.mouse.y};
	},
	
	
	setTileOnCurrentLayer: function() {
		if( !this.activeLayer || !this.activeLayer.scroll ) {
			return;
		}
		
		var co = this.activeLayer.getCursorOffset();
		var x = ig.input.mouse.x + this.activeLayer.scroll.x - co.x;
		var y = ig.input.mouse.y + this.activeLayer.scroll.y - co.y;
		
		var brush = this.activeLayer.brush;
		for( var by = 0; by < brush.length; by++ ) {
			var brushRow = brush[by];
			for( var bx = 0; bx < brushRow.length; bx++ ) {
				
				var mapx = x + bx * this.activeLayer.tilesize;
				var mapy = y + by * this.activeLayer.tilesize;
				
				var newTile = brushRow[bx];
				var oldTile = this.activeLayer.getOldTile( mapx, mapy );
				
				this.activeLayer.setTile( mapx, mapy, newTile );
				this.undo.pushMapDraw( this.activeLayer, mapx, mapy, oldTile, newTile );
				
				
				if( 
					this.activeLayer.linkWithCollision && 
					this.collisionLayer && 
					this.collisionLayer != this.activeLayer
				) {
					var collisionLayerTile = newTile > 0 ? this.collisionSolid : 0;
					
					var oldCollisionTile = this.collisionLayer.getOldTile(mapx, mapy);
					this.collisionLayer.setTile( mapx, mapy, collisionLayerTile );
					this.undo.pushMapDraw( this.collisionLayer, mapx, mapy, oldCollisionTile, collisionLayerTile );
				}
			}
		}
		
		this.setModified();
	},
	
	
	// -------------------------------------------------------------------------
	// Drawing
	
	draw: function() {
		// The actual drawing loop is scheduled via ig.setAnimation() already.
		// We just set a flag to indicate that a redraw is needed.
		this.needsDraw = true;
	},
	
	
	drawIfNeeded: function() {
		// Only draw if flag is set
		if( !this.needsDraw ) { return; }
		this.needsDraw = false;
		
		
		ig.system.clear( wm.config.colors.clear );
	
		var entitiesDrawn = false;
		for( var i = 0; i < this.layers.length; i++ ) {
			var layer = this.layers[i];
			layer.draw();
		}
		
		if( this.activeLayer ) {
			if( this.mode == this.MODE.TILESELECT ) {
				this.activeLayer.tileSelect.draw();
				this.activeLayer.tileSelect.drawCursor( ig.input.mouse.x, ig.input.mouse.y );
			}
			
			if( this.mode == this.MODE.DEFAULT ) {
				this.activeLayer.drawCursor( ig.input.mouse.x, ig.input.mouse.y );
			}
		}
		
		if( wm.config.labels.draw ) {
			this.drawLabels( wm.config.labels.step );
		}
	},
	
	
	drawLabels: function( step ) {
		ig.system.context.fillStyle = wm.config.colors.primary;
		var xlabel = this.screen.x - this.screen.x % step - step;
		for( var tx = Math.floor(-this.screen.x % step); tx < ig.system.width; tx += step ) {
			xlabel += step;
			ig.system.context.fillText( xlabel, tx * ig.system.scale, 0 );
		}
		
		var ylabel = this.screen.y - this.screen.y % step - step;
		for( var ty = Math.floor(-this.screen.y % step); ty < ig.system.height; ty += step ) {
			ylabel += step;
			ig.system.context.fillText( ylabel, 0, ty * ig.system.scale );
		}
	},

	postMessage: function(type, payload) {
		var message = {
			type : type,
			payload : payload,
			iframeId : this.iframeId
		}

		parent.window.postMessage( JSON.stringify( message ), '*' )
	}



	});


wm.Weltmeister.getMaxWidth = function() {
	return $(window).width();
};

wm.Weltmeister.getMaxHeight = function() {
	return $(window).height() - $('#headerMenu').height();
};


// Custom ig.Image class for use in Weltmeister. To make the zoom function 
// work, we need some additional scaling behavior:
// Keep the original image, maintain a cache of scaled versions and use the 
// default Canvas scaling (~bicubic) instead of nearest neighbor when 
// zooming out.
ig.Image.inject({
	resize: function( scale ) {
		if( !this.loaded ) { return; }
		if( !this.scaleCache ) { this.scaleCache = {}; }
		if( this.scaleCache['x'+scale] ) {
			this.data = this.scaleCache['x'+scale];
			return;
		}
		
		// Retain the original image when scaling
		this.origData = this.data = this.origData || this.data;
		
		if( scale > 1 ) {
			// Nearest neighbor when zooming in
			this.parent( scale );
		}
		else {
			// Otherwise blur
			var scaled = ig.$new('canvas');
			scaled.width = Math.ceil(this.width * scale);
			scaled.height = Math.ceil(this.height * scale);
			var scaledCtx = scaled.getContext('2d');
			scaledCtx.drawImage( this.data, 0, 0, this.width, this.height, 0, 0, scaled.width, scaled.height );
			this.data = scaled;
		}
		
		this.scaleCache['x'+scale] = this.data;
	}
});



// Create a custom loader, to skip sound files and the run loop creation
wm.Loader = ig.Loader.extend({
	end: function() {
		if( this.done ) { return; }
		
		clearInterval( this._intervalId );
		this.done = true;
		ig.system.clear( wm.config.colors.clear );
		ig.game = new (this.gameClass)();
	},
	
	loadResource: function( res ) {
		if( res instanceof ig.Sound ) {
			this._unloaded.erase( res.path );
		}
		else {
			this.parent( res );
		}
	}
});



// Init!
ig.system = new ig.System(
	'#canvas', 1,
	Math.floor(wm.Weltmeister.getMaxWidth() / wm.config.view.zoom), 
	Math.floor(wm.Weltmeister.getMaxHeight() / wm.config.view.zoom), 
	wm.config.view.zoom
);
	
ig.input = new wm.EventedInput();
ig.soundManager = new ig.SoundManager();
ig.ready = true;

var loader = new wm.Loader( wm.Weltmeister, ig.resources );
loader.load();

});


