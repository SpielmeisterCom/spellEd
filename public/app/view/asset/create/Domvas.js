Ext.define('Spelled.view.asset.create.Domvas', {
    extend: 'Ext.container.Container',
    alias: 'widget.domvasassetconfig',

	aceEditor: null,

	initComponent: function() {
		var me           = this

		Ext.applyIf( me, {
			layout:'column',
			items: [
				{
					xtype: 'filefield',
					allowBlank: true,
					name: 'asset',
					fieldLabel: 'File',
					labelWidth: 50,
					msgTarget: 'side',
					buttonText: 'Select a File...',
					listeners: {
						'show': function( file ) {
							var domElement = document.querySelector('input[type="file"]')

							if( domElement && !domElement.onChange ) {
								domElement.addEventListener( 'change',
									function(event) {
										file.fileRawInput = event.target.files[0]
									},
									false
								)
							}
						}
					},
					validator: function( value ) {
						if( !value )
							return "You need to select a new File"
						else
							return true
					}
				},
				{
					name: 'aceDomvasContainer',
					columnWidth: 0.5,
					height: 350
				},
				{
					xtype: 'container',
					columnWidth: 0.5,
					items: [
						{
							xtype: 'tool-documentation',
							docString: "#!/guide/asset_type_text_appearance",
							width: 'null'
						},
						{
							name: 'aceDomvasPreview',
							xtype: 'container',
							margin: '0 0 0 270',
							autoEl : {
								tag : 'iframe',
								height: 500,
								width: 500,
								border: '0',
								frameborder: '0',
								scrolling: 'no'
							}
						}
					]
				}
			]

		})

		me.callParent()
	},

	startEdit: function() {
		var editor = this.aceEditor,
			me     = this

		editor.getSession().on( "change", Ext.bind( me.onAceEdit, me) )
		this.addEvents(
			'domvasedit'
		)
	},

	onAceEdit: function( e ) {
		this.fireEvent( "domvasedit", this, this.aceEditor.getSession().getValue(), e )
	}
});
