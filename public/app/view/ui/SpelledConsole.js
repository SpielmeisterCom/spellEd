Ext.define('Spelled.view.ui.SpelledConsole', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.console',
    title: "Console",
    collapsed : true,
	autoScroll: true,
    height: 150,

	floatable: false,
	titleCollapse: true,

	frame: true,

	bbar: [
		{
			text: "Clear",
			listeners: {
				click: {
					fn: function() {
						this.up( 'console' ).update( "" )
					}
				}
			}
		}
	],

	log: function( message ) {
		var content = this.getTargetEl().getHTML()

		this.update( content + message )

		this.getTargetEl().scroll( "b", this.body.dom.scrollHeight + 100 )
	}
});