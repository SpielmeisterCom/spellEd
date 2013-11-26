Ext.define('Spelled.model.Script', {
    extend: 'Ext.data.Model',
	requires: ['proxy.storageaction', 'Spelled.data.reader.Script', 'Spelled.data.writer.Script'],
	mixins: ['Spelled.base.model.Model'],

	iconCls : "tree-script-icon",

	mergeDependencies: true,

	sortOrder: 310,

    proxy: {
        type: 'storageaction',
	    extraParams: {
		    type: 'script'
	    },
	    writer: {
		    type: 'script'
	    },
	    reader: {
		    type: 'script'
	    }
    },

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( arguments )
	},

	listeners: {
		loadscript: function() {
			this.readAccordingJSFile()
		}
	},

	setDirty: function() {
		this.fireDirtyEvent()
		this.callParent()
	},

	getFullName: function() {
		return this.get('scriptId')
	},

	constructor: function() {
		this.callParent( arguments )
		var object = arguments[0] || arguments[2]
		this.set( 'scriptId', this.generateIdentifier( object ) )
        this.set( 'internalAssetId', "script:" + this.getFullName() )
		if( arguments.length > 1 ) this.fireEvent( 'loadscript' )
	},

    fields: [
        'name',
        'namespace',
        'type',
		'path',
		'content',
	    'breakpoints',
		'dependencies',
		'dependencyNode'
    ]
});