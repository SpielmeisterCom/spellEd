Ext.define('Spelled.store.project.Plugins', {
    extend: 'Ext.data.Store',

	fields: ['name', 'fields'],

	data : [{
		name: 'Gameclosure',
		fields: [
			{
				xtype: 'textfield',
				fieldLabel: 'Option1',
				name: 'option1',
				value: 'Default1'
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Option2',
				name: 'option2',
				value: 'Default2'
			}
		]
	},
		{
			name: 'Ejecta',
			fields: [
				{
					xtype: 'textfield',
					fieldLabel: 'Option3',
					name: 'option3',
					value: 'Default3'
				},
				{
					xtype: 'textfield',
					fieldLabel: 'Option4',
					name: 'option4',
					value: 'Default4'
				}
			]
		}
	]
});
