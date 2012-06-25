Ext.define('Spelled.view.asset.create.Animation', {
    extend: 'Ext.container.Container',
    alias: 'widget.animationassetconfig',

	items: [
		{
			xtype: "textfield",
			name: 'type',
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
