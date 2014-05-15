Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.storageaction',
		'Spelled.data.reader.Project',
		'Spelled.data.writer.Project'
	],

	proxy: {
        type: 'storageaction',
		extraParams: {
			type: 'project'
		},
		reader: 'project',
		writer: 'project'
    },

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'project' },
        'name',
        'startScene',
		'apiVersion',
		{ name: 'config', type: 'object', defaultValue: {} },
		{ name: 'assetIds', type: 'array', defaultValue: [] }
	],

	hasMany: [
		{
			model: 'Spelled.model.Language',
			name : 'getSupportedLanguages',
			associationKey: 'supportedLanguages'
		},
		{
			model: 'Spelled.model.config.Scene',
			name : 'getScenes',
			associationKey: 'scenes'
		}
	],

	save: function() {
		var config = this.get( 'config' )

		if( !config.projectId ) config.projectId = this.get( 'name' )

		this.callParent( arguments )
	},

	getDefaultLanguageKey: function() {
		return this.get( 'config' ).defaultLanguage
	},

	getDefaultQualityLevel: function() {
		var qualityLevels    = this.get( 'config' ).qualityLevels
			hasQualityLevels = qualityLevels && Ext.isObject( qualityLevels ) && Ext.Object.getKeys( qualityLevels ).length > 0

		return hasQualityLevels ? 1 : null
	},

	getQualityLevel: function( key ) {
		var qualityLevels = this.get( 'config' ).qualityLevels

		if( key && qualityLevels && Ext.isObject( qualityLevels ) ) {
			return qualityLevels[ key ]
		} else {
			return false
		}
	},

	getQualityLevelsStore: function() {
		var qualityLevels = this.get( 'config' ).qualityLevels

		var store = Ext.create( 'Ext.data.ArrayStore',{
				fields: [
					'name',
					'level'
				]
			}
		)

		var tmpData= []

		Ext.Object.each(
			qualityLevels,
			function( key, value ) {
				tmpData.push( [ key, value ] )
			}
		)

		store.add( tmpData )

		return store
	},

	unDirty:function() {
		this.dirty = false
		this.getScenes().each( function( scene ){ scene.unDirty() } )
	},

	checkForComponentChanges: function() {
		this.getScenes().each(
			function( scene ) {
				scene.checkForComponentChanges()
			}
		)
	},

	getStartScene: function() {
		return Ext.getStore( 'config.Scenes' ).findRecord( 'sceneId', this.get( 'startScene' ), null, null, null, true )
	},

	getPlugin: function( name ) {
		var plugins = this.get( 'config').plugins

		if( !plugins ) {
			plugins = {}
		}

		if( !plugins[ name ] ) {
			plugins[ name ] = {}
		}

		return plugins[ name ]
	}
})
