Ext.define('Spelled.view.script.Editor', {
    extend: 'Spelled.view.script.codemirror.Component',
    alias : 'widget.scripteditor',
    closeAction: 'hide',

	requires: [
		'Spelled.view.script.codemirror.Component'
	],

    closable: true,

    model : undefined,
	value: '',

	codemirrorConfig: {
		mode: 'javascript',
		matchBrackets: true,
		autoClearEmptyLines:true,
		lineNumbers: true,
		styleActiveLine: true,
		foldGutter: {
			rangeFinder: new CodeMirror.fold.combine( CodeMirror.fold.brace, CodeMirror.fold.comment )
		},
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"]
	},

	listeners: {
		resize: function() {
			this.reRenderAce()
		}
	},

	refreshContent: function() {

		if( !!this.model ) {
			this.setValue( this.model.get('content') )
			this.startEdit()
		}

		this.reRenderAce()
	},

	reRenderAce: function() {

	},

	startEdit: function() {
		var editor  = this.editor,
			me      = this

		function makeMarker() {
			var marker = document.createElement("div");
			marker.style.color = "#822";
			marker.innerHTML = "●";
			return marker;
		}

//		session.setUseSoftTabs( false )
//
//		editor.commands.addCommand( {
//			name: 'saveCommand',
//			bindKey: {
//				win: 'Ctrl-S',
//				mac: 'Command-S'
//			},
//			exec: Ext.bind( me.onAceSave, me)
//		} )
//
//		editor.commands.addCommand( {
//			name: 'reloadScene',
//			bindKey: {
//				win: 'Ctrl-M',
//				mac: 'Command-M'
//			},
//			exec: Ext.bind( me.onReloadScene, me)
//		} )
//
//		editor.commands.addCommand( {
//			name: 'toggleGrid',
//			bindKey: {
//				win: 'Ctrl-B',
//				mac: 'Command-B'
//			},
//			exec: Ext.bind( me.onToggleGrid, me)
//		} )
//
//		editor.commands.addCommand( {
//			name: 'toggleTitleSaveArea',
//			bindKey: {
//				win: 'Ctrl-I',
//				mac: 'Command-I'
//			},
//			exec: Ext.bind( me.onToggleTitleSaveArea, me)
//		} )
//
//		editor.commands.addCommand( {
//			name: 'fullSize',
//			bindKey: {
//				win: 'Ctrl-U',
//				mac: 'Command-U'
//			},
//			exec: Ext.bind( me.onFullSize, me)
//		} )
//
		editor.on("gutterClick", function( cm, n, gutter ){
			if( gutter != 'breakpoints' ) return

			var info        = cm.lineInfo( n ),
				model       = me.model,
				breakpoints = model.get( 'breakpoints' ) || {}

			cm.setGutterMarker( n, "breakpoints", info.gutterMarkers && info.gutterMarkers.breakpoints ? null : makeMarker() )

			var line = info.line

			if ( breakpoints[line] !== undefined ) {
				breakpoints[line] = undefined

			} else {
				breakpoints[line] =  true
			}

			model.set( 'breakpoints', breakpoints )

			me.fireEvent( 'scriptvalidation', model, breakpoints )
		})

		editor.on( "change", Ext.bind( me.onAceEdit, me) )
//		session.on( "changeAnnotation", Ext.bind( me.onAceChangeAnnotation, me ) )
		this.addEvents(
			'scriptedit',
			'scriptvalidation',
			'save'
		)
	},

	onAceChangeBreakpoint: function() {
		var session = this.aceEditor.getSession()
		this.model.set( 'breakpoints', session.getBreakpoints() )

		//trigger a scriptvalidation event here to force a reload of the script
		this.fireEvent( 'scriptvalidation', this.model, session.getAnnotations() )
	},

	onAceChangeAnnotation: function() {
		var session = this.aceEditor.getSession()

		this.fireEvent( 'scriptvalidation', this.model, session.getAnnotations() )
	},

	onAceSave: function() {
		this.fireEvent( "save" )
	},

	onReloadScene: function() {
		this.fireEvent( "reloadscene" )
	},

	onToggleGrid: function() {
		this.fireEvent( "toggle", 'toggleGrid' )
	},

	onToggleTitleSaveArea: function() {
		this.fireEvent( "toggle", 'toggleTitleSafe' )
	},

	onFullSize: function() {
		this.fireEvent( "fullscreen" )
	},

	onAceEdit: function( e ) {
		var model = this.model

		if( !this.editor.options.readOnly ) {

			model.setDirty()
			model.set( 'content', this.getValue() )
			this.fireEvent( "scriptchange", model, this, e )
		}
	},

    setModel : function( model ) {
        this.model = model
    }
});