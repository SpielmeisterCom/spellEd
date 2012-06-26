Ext.define('Spelled.view.asset.create.Animation', {
    extend: 'Ext.container.Container',
    alias: 'widget.animationassetconfig',

	items: [
		{
			xtype: "assetidproperty",
			store: 'asset.SpriteSheets',
			allowBlank: true,
			fieldLabel: "From existing Sprite Sheet",
			listeners: {
				'change': function( cmp, value) {
					if( value )
						this.up('form').down('filefield').reset()
				}
			},
			validator: function( value ) {
				var file = this.up('form').down('filefield').getValue()
				if( ( !file && !value ) )
					return "You need to select a existing Asset"
				else
					return true
			}
		},
		{
			xtype: "textfield",
			name: 'animationType',
			value: 'sprite',
			fieldLabel: 'Animation Type',
			disabled: true
		},
		{
			xtype: "checkbox",
			name: 'looped',
			fieldLabel: 'Looped'
		},
		{
			xtype: "numberfield",
			name: 'duration',
			minValue: 0,
			fieldLabel: 'Duration'
		},
		{
			xtype: "textfield",
			name: 'frameIds',
			fieldLabel: 'Frames'
		}
	]
});
