Ext.define('Spelled.view.scene.ProgressBar' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.spellprogressbar',

	requires: [
		'Ext.ProgressBar'
	],

	height: 200,

	layout: {
		type: 'vbox',
		align: 'center',
		pack: 'center'
	},

    items: [{
		width: 350,
		xtype: 'progressbar',
		text: 'Loading...',
		value: 0
	}],

	updateProgress: function( value ) {
		var pg = this.down( 'progressbar' )

		pg.updateProgress( value )
	}
});
