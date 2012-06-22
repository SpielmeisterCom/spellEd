Ext.define('Spelled.view.blueprint.system.input.ComboBox', {
    extend: 'Ext.form.field.ComboBox',

	alias : 'widget.systemblueprintinputgridcombobox',

	editable       : false,
	emptyText      : '-- Select a Component --',
	queryMode	   : 'local',
	store          : 'blueprint.Components',
	name           : 'blueprintId',
	displayField   : 'blueprintId',
	valueField     : 'blueprintId',
	listClass      : 'x-combo-list-small'
});