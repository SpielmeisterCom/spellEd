Ext.define('Spelled.store.system.EditMode', {
    extend: 'Ext.data.Store',

    fields: [ 'systemId', 'executionGroupId', 'systemConfig' ],

    data : [
		{
			systemId: 'spell.system.render',
			executionGroupId: 'render',
			systemConfig: {
				active: true
			}
		}
    ]
});