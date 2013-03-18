Ext.define('Spelled.view.template.component.attribute.Enum', {
	extend: 'Ext.form.ComboBox',
    alias : 'widget.spelledenumfield',
	mixins: [ 'Spelled.base.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	},

	matchFieldWidth : false,
	forceSelection  : true,
	queryMode       : 'local',
	editable        : true,
	emptyText       : '-- Select a value --',
	name            : 'value'
})
