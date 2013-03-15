Ext.define('Spelled.model.Script', {
    extend: 'Ext.data.Model',
	requires: ['proxy.direct', 'Spelled.data.reader.Script', 'Spelled.data.writer.Script'],
	mixins: ['Spelled.abstract.model.Model'],

	iconCls : "tree-script-icon",

	mergeDependencies: true,

	sortOrder: 310,

    proxy: {
        type: 'direct',
		extraParams: {
			type: 'script'
		},
        api: {
            create:  Spelled.StorageActions.create,
            read:    Spelled.StorageActions.read,
            update:  Spelled.StorageActions.update,
            destroy: Spelled.StorageActions.destroy
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

	getCalculatedDependencies: function() {
		return []
	},

	createDependencyNode: function() {
		return { libraryId: this.getFullName(), children:[] }
	},

	listeners: {
		loadscript: function() {
			Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
				function( result ) {
					this.set( 'path', this.getAccordingJSFileName() )
					this.set( 'content', result )
					this.dirty = false
				},
				this
			)

		},
		dirty: function() {
			this.updateDependencies()
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
		this.fireEvent( 'loadscript' )
	},

    fields: [
        'name',
        'namespace',
        'type',
		'path',
		'content',
	    'breakpoints',
		'dependencies'
    ]
});