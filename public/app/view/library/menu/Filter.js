Ext.define('Spelled.view.library.menu.Filter', {
    extend: 'Ext.button.Button',
    alias : 'widget.libraryfilterbutton',

	text: 'Filter',
	icon: 'resources/images/icons/eye.png',

	assetsOnly: true,

	createFilterItem: function( type, label, checked ) {
		return  {
			xtype: 'menucheckitem',
			checked: checked,
			libraryType: type,
			listeners: {
				render: function(comp) {
					Ext.DomHelper.insertAfter(comp.getEl().down(".x-menu-item-icon"), {
						tag: 'img',
						src: Ext.BLANK_IMAGE_URL,
						cls: type,
						width: 16,
						height: 16
					})
				},
				afterrender: function(cmp){
					cmp.textEl.setStyle({ 'vertical-align': "top", 'margin-left': '5px' })
				}
			},
			checkHandler: Ext.bind( this.filterHandler, this ),
			text: label
		}
	},

	createFilterItemsHelper: function( storeId, checked ) {
		var result = []

		Ext.getStore( storeId ).each(
			function( record ) {
				result.push( this.createFilterItem( record.get( 'iconCls' ), record.get( 'name' ), checked ) )
			},
			this
		)

		return result
	},

	initComponent: function() {
		var me      = this,
			filters = Ext.Array.merge(
				this.createFilterItemsHelper( 'asset.Types', true ),
				this.createFilterItemsHelper( 'template.Types', !this.assetsOnly ),
				[ this.createFilterItem( "tree-scene-icon", 'Scenes', !this.assetsOnly ) ]
			)

		Ext.applyIf( me, {
			menu: filters
		})

		me.callParent( arguments )
	},

	filterHandler: function() {
		var owner    = this.ownerCt.up( 'panel' ),
			filters  = owner.down( '[text="Filter"] > menu' ),
			store    = owner.getStore(),
			filterValues = []

		filters.items.each(
			function( filter ) {
				if( filter.checked ) {
					filterValues.push( filter.libraryType )

					//TODO: find a solution for filtering "folders" like entity composites
					if( filter.libraryType === 'tree-scene-entity-icon' ) {
						Ext.Array.push( filterValues, [ 'tree-scene-entity-readonly-icon', 'tree-scene-entity-linked-icon' ] )
					}
				}
			}
		)

		this.filterFn( store, filterValues )
	},

	filterFn: function( store, filters ) {

		store.filterBy(
			function( item ) {
				return Ext.Array.contains( filters, item.get( 'type' ) )
			}
		)

		store.sort()
	}
})
