Ext.define('Spelled.proxy.StorageAction', {
	requires: [
		'Spelled.Remoting'
	],
	extend: 'Ext.data.proxy.Direct',
	alias: 'proxy.storageaction',

	constructor: function(config){
		var me = this;

		me.api = {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		};

		me.callParent(arguments);
	}

});
