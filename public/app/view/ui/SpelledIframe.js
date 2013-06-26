Ext.define('Spelled.view.ui.SpelledIframe', {
    extend: 'Spelled.base.view.IFrame',
    alias : 'widget.spellediframe',

	reload: function() {
		this.load( Spelled.Converter.toWorkspaceUrl( this.projectName + '/public/spellEdShim.html?iframeId='+this.id ) )
	},

	focus: function() {
		this.up( 'panel' ).focus()
		this.callParent( arguments )
	}
})