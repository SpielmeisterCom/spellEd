Ext.define('Spelled.store.system.Defaults', {
    extend: 'Ext.data.Store',

    fields: [ 'systemId', 'executionGroupId' ],

    data : [
		{
			systemId: 'spell.system.keyInput',
			executionGroupId: 'render'
		},
		{
			systemId: 'spell.system.keyFrameAnimation',
			executionGroupId: 'render'
		},
		{
			systemId: 'spell.system.render',
			executionGroupId: 'render'
		},
		{
			systemId: 'spell.system.physics',
			executionGroupId: 'render'
		}
    ]
});