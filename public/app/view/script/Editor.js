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
		var editor = this.aceEditor,
			me     = this

		editor.commands.addCommand( {
			name: 'saveCommand',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S'
			},
			exec: Ext.bind( me.onAceSave, me)
		} )

		editor.getSession().on( "change", Ext.bind( me.onAceEdit, me) )
		this.addEvents(
			'scriptedit',
			'save'
		)
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