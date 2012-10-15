Ext.define('Spelled.view.ui.TilemapEditorIframe', {
	extend: 'Ext.container.Container',
	alias : 'widget.tilemapeditoriframe',

	width : '100%',
	height: '100%',
	autoEl : {
		tag : 'iframe',
		border: '0',
		frameborder: '0',
		scrolling: 'no'
	},

	afterRender: function() {
		this.el.dom.src = '/weltmeister/weltmeister.html?iframeId='+this.id
		this.focus()
	}
});
