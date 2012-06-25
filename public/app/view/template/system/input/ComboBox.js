Ext.define('Spelled.view.template.system.input.ComboBox', {
    extend: 'Ext.form.field.ComboBox',

	alias : 'widget.systemtemplateinputgridcombobox',

	editable       : false,
	emptyText      : '-- Select a Component --',
	queryMode	   : 'local',
	store          : 'template.Components',
	name           : 'templateId',
	displayField   : 'templateId',
	valueField     : 'templateId',
	listClass      : 'x-combo-list-small'
});