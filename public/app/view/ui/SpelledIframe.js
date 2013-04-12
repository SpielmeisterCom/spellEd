Ext.define('Spelled.view.ui.SpelledIframe', {
    extend: 'Ext.Component',
    alias : 'widget.spellediframe',

    width : '100%',
    height: '100%',
    autoEl : {
		tag : 'iframe',
		border: '0',
		frameborder: '0',
		scrolling: 'no'
    },

    afterRender: function() {
        this.el.dom.src = Spelled.Converter.toWorkspaceUrl( this.projectName + '/public/spellEdShim.html?iframeId='+this.id )
	},

	focus: function() {
		this.up( 'panel' ).focus()
		this.callParent( arguments )
	}
})
