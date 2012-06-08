Ext.define('Spelled.view.script.Editor', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.scripteditor',
    closeAction: 'hide',

    closable: true,

    model : undefined,

	refreshContent: function() {
		if( !!this.model )
			this.aceEditor.getSession().setValue( this.model.get('content') )

		this.aceEditor.scrollPageDown()
		this.aceEditor.scrollToRow( 0 )
	},

    setModel : function( model ) {
        this.model = model
    }
});