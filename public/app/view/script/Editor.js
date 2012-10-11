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

		session.on( "change", Ext.bind( me.onAceEdit, me) )
		session.on( "changeAnnotation", Ext.bind( me.onAceChangeAnnotation, me ) )
		this.addEvents(
			'scriptedit',
			'scriptvalidation',
			'save'
		)
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