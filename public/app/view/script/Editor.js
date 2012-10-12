Ext.define('Spelled.view.script.Editor', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.scripteditor',
    closeAction: 'hide',

    closable: true,

    model : undefined,

	refreshContent: function() {
		var editor = this.aceEditor

		if( !!this.model ) {
			editor.getSession().setValue( this.model.get('content') )
			this.startEdit()
		}

		editor.scrollPageDown()
		editor.scrollToRow( 0 )
	},

	startEdit: function() {
		var editor  = this.aceEditor,
			session = editor.getSession(),
			me      = this

		session.setUseSoftTabs( false )

		editor.commands.addCommand( {
			name: 'saveCommand',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S'
			},
			exec: Ext.bind( me.onAceSave, me)
		} )

		editor.on("guttermousedown", function(e){
			var target = e.domEvent.target;
			if (target.className.indexOf("ace_gutter-cell") == -1)
				return;
			if (!editor.isFocused())
				return;
			if (e.clientX > 25 + target.getBoundingClientRect().left)
				return;

			var row = e.getDocumentPosition().row,
				breakpoints = e.editor.session.getBreakpoints()

			if ( breakpoints[row] !== undefined ) {
				e.editor.session.clearBreakpoint(row)

			} else {

				e.editor.session.setBreakpoint(row)
			}

			e.stop()
		})

		session.on( "changeBreakpoint", Ext.bind( me.onAceChangeBreakpoint, me) )
		session.on( "change", Ext.bind( me.onAceEdit, me) )
		session.on( "changeAnnotation", Ext.bind( me.onAceChangeAnnotation, me ) )
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

	onAceEdit: function( e ) {
		var model = this.model

		if( !this.aceEditor.getReadOnly() ) {
			model.setDirty()
			model.set( 'content', this.aceEditor.getSession().getValue() )
			this.fireEvent( "scriptchange", model, this, e )
		}
	},

    setModel : function( model ) {
        this.model = model
    }
});