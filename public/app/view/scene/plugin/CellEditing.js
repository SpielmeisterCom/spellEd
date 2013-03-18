Ext.define('Spelled.view.scene.plugin.CellEditing' ,{
    extend: 'Ext.grid.plugin.CellEditing',
	alias: 'plugin.renameplugin',

	mixins: [ 'Spelled.base.validator.General' ],

	//TODO: remove this after sencha fixes the bug in Ext.grid.plugin.CellEditing-event-validateedit
	onEditComplete : function(ed, value, startValue) {
		var me = this,
			grid = me.grid,
			activeColumn = me.getActiveColumn(),
			sm = grid.getSelectionModel(),
			context = me.context,
			record;

		if (activeColumn) {
			record = context.record;

			me.setActiveEditor(null);
			me.setActiveColumn(null);
			me.setActiveRecord(null);

			var remembervalue = me.context.value;
			me.context.value = value;
			if (!me.validateEdit()) {
				me.context.value = remembervalue;
				return;
			}

			// Only update the record if the new value is different than the
			// startValue. When the view refreshes its el will gain focus
			if (!record.isEqual(value, startValue)) {
				record.set(activeColumn.dataIndex, value);
			}

			// Restore focus back to the view's element.
			if (sm.setCurrentPosition) {
				sm.setCurrentPosition(sm.getCurrentPosition());
			}
			grid.getView().getEl(activeColumn).focus();
			me.fireEvent('edit', me, context, value, startValue);
			me.editing = false;
		}
	},
	clicksToEdit: 4,
	pluginId:'renamePlugin'
})


