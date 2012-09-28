Ext.define('Spelled.view.library.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.librarytreelist',

	title: "Library - Navigator",
	header: false,

    animate: false,
    animCollapse: false,
    store : 'Library',

    rootVisible: false,

	tbar: [
		{
			text: 'Create',
			icon: 'images/icons/add.png',
			menu: {
				items: [
					{
						xtype: 'buttongroup',
						title: 'Asset',
						columns: 1,

						items: [
							{
								text: "2D Animated Appearance",
								action: "showCreateAsset",
								type: 'animation',
								icon: 'images/icons/asset-2danimation.png'
							},
							{
								text: "2D Static Appearance",
								action: "showCreateAsset",
								type: 'appearance',
								icon: 'images/icons/asset-2dstatic.png'
							},
//							{
//								text: "2D Static Domvas Appearance",
//								action: "showCreateAsset",
//								type: 'domvas',
//								icon: 'images/icons/asset-2dstatic.png'
//							},
							{
								text: "Sprite Sheet",
								action: "showCreateAsset",
								type: 'spriteSheet',
								icon: 'images/icons/asset-spritesheet.png'
							},
							{
								text: "Font",
								action: "showCreateAsset",
								type: 'font',
								icon: 'images/icons/asset-font.gif'
							},
							{
								text: "Sound",
								action: "showCreateAsset",
								type: 'sound',
								icon: 'images/icons/asset-sound.png'
							},
							{
								text: "Key to action Mapping",
								action: "showCreateAsset",
								type: 'keyToActionMap',
								icon: 'images/icons/keyboard.png'
							}
						]
					},
					{
						xtype: 'buttongroup',
						title: 'Template',
						columns: 1,
						items: [
							{
								icon: "images/icons/component-add.png",
								action: 'showCreateTemplate',
								text: 'Component',
								type: 'component'
							},
							{
								icon: "images/icons/entity-add.png",
								action: 'showCreateTemplate',
								text: 'Entity',
								type: 'entity'
							},
							{
								icon: "images/icons/system-add.png",
								action: 'showCreateTemplate',
								text: 'System',
								type: 'system'
							}
						]
					},
					{
						xtype: 'buttongroup',
						title: 'Script',
						columns: 1,
						items:[
							{
								icon: "images/icons/script-add.png",
								action: 'showCreateScript',
								text: 'Script'
							}
						]
					}
				]
			}
		}
	]
});