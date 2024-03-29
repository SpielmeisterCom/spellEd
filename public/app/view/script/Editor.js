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

	toggleLinting: function() {
		var editor = this.editor,
			option = editor.getOption( "lint" )

		if( option ) {
			editor.setOption( "lint", false )
		} else {
			editor.setOption( "lint", this.lintingConfig() )
		}
	},

	lintingConfig: function() {
		return {
			getAnnotations: CodeMirror.javascriptValidator,
			onUpdateLinting: Ext.bind( this.onChangeAnnotation, this ),
			asi: true
		}
	},

	initComponent: function() {
		var me = this

		Ext.applyIf( me,{
			codemirrorConfig: {
				extraKeys: {
					"Ctrl-S": Ext.bind( me.onSave, me ),
					"Ctrl-M": Ext.bind( me.onReloadScene, me),
					"Ctrl-B": Ext.bind( me.onToggleGrid, me),
					"Ctrl-U": Ext.bind( me.onFullSize, me),
					"Shift-Ctrl-C": Ext.bind( me.toggleComment, me)
				},
				theme: 'spelled',
				mode: 'javascript',
				matchBrackets: true,
				autoClearEmptyLines:true,
				autoCloseBrackets: true,
				lineNumbers: true,
				indentWithTabs: true,
				styleActiveLine: true,
				lint: me.lintingConfig(),
				foldGutter: {
					rangeFinder: new CodeMirror.fold.combine( CodeMirror.fold.brace, CodeMirror.fold.comment )
				},
				gutters: [ "CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"]
			}
		})


		return this.callParent( arguments )
	},

	refreshContent: function() {

		if( !!this.model ) {
			this.setValue( this.model.get('content') )
			this.startEdit()
		}
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

		var responseCallback = function( response ){
			var code = response.responseText;

			var server = new CodeMirror.TernServer( { defs: [ Ext.JSON.decode(code) ] } )

			editor.setOption( "extraKeys", Ext.Object.merge( {}, editor.options.extraKeys, {
				"Ctrl-Space": function(cm) { server.complete(cm); },
				"Ctrl-I": function(cm) { server.showType(cm); },
				"Alt-.": function(cm) { server.jumpToDef(cm); },
				"Alt-,": function(cm) { server.jumpBack(cm); },
				"Ctrl-Q": function(cm) { server.rename(cm); }
			})
			)

			editor.on("cursorActivity", function(cm) { server.updateArgHints(cm); })
		}

		Ext.Ajax.request({
			url: 'lib/tern/defs/ecma5.json',
			success: responseCallback,
			failure: responseCallback
		})

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

		editor.on( "change", Ext.bind( me.onEdit, me) )

		this.addEvents(
			'scriptedit',
			'scriptvalidation',
			'save'
		)
	},

	onChangeAnnotation: function( annotationsNotSorted, annotations, cm ) {
		if( !this.model ) return

		this.fireEvent( 'scriptvalidation', this.model, annotations )
	},

	toggleComment: function() {
		var editor = this.editor

		CodeMirror.commands.toggleComment( editor )
	},

	onSave: function() {
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

	onEdit: function( e ) {
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