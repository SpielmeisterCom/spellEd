Ext.define('Spelled.view.asset.Iframe', {
    extend: 'Spelled.base.view.IFrame',
    alias : 'widget.assetiframe',

	workspacePrefix: true,
	renderingBackEnd: 'canvas-2d',

    afterRender: function() {
		var src = this.src + '?iframeId=' + this.id + '&renderingBackEnd=' + this.renderingBackEnd

        this.load( this.workspacePrefix ? Spelled.Converter.toWorkspaceUrl( src ) : src )
    }
});
