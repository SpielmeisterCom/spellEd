Ext.define('Spelled.view.library.menu.Buttons' ,{
    extend: 'Ext.menu.Menu',
    alias : 'widget.librarymenu',

	requires: [
		'Ext.container.ButtonGroup'
	],
	plain: true,

	items: [
		{
			xtype: 'buttongroup',
			title: 'Library',
			columns: 1,
			items: [
				{
					text: "Create namespace",
					tooltip: Spelled.Configuration.getDemoTooltipText(),
					disabled: Spelled.Configuration.isDemoInstance(),
					action: "showCreateFolder",
					icon: 'resources/images/spelled/tree/folder.gif'
				}
			]
		},
		{
			xtype: 'buttongroup',
			title: 'Asset',
			columns: 1,

			items: [
				{
					text: "2D Static Appearance (Image)",
					action: "showCreateAsset",
					type: 'appearance',
					icon: 'resources/images/icons/asset-2dstatic.png'
				},
				{
					text: "2D Sprite Sheet",
					action: "showCreateAsset",
					type: 'spriteSheet',
					icon: 'resources/images/icons/asset-spritesheet.png'
				},
				{
					text: "2D Animation",
					action: "showCreateAsset",
					type: 'animation',
					icon: 'resources/images/icons/asset-2danimation.png'
				},
				{
					text: "Keyframe animation",
					action: "showCreateAsset",
					type: 'keyFrameAnimation',
					icon: 'resources/images/icons/asset-keyframeanimation.png'
				},
//							{
//								text: "2D Static Domvas Appearance",
//								action: "showCreateAsset",
//								type: 'domvas',
//								icon: 'resources/images/icons/asset-2dstatic.png'
//							},
				{
					text: "2d tile map",
					action: "showCreateAsset",
					type: '2dTileMap',
					icon: 'resources/images/icons/asset-2dtilemap.gif'
				},
				{
					text: "Font",
					action: "showCreateAsset",
					type: 'font',
					icon: 'resources/images/icons/asset-font.gif'
				},
				{
					text: "Sound",
					action: "showCreateAsset",
					type: 'sound',
					icon: 'resources/images/icons/asset-sound.png'
				},
				{
					text: "Keyboard mapping",
					action: "showCreateAsset",
					type: 'inputMap',
					icon: 'resources/images/icons/keyboard.png'
				},
				{
					text: "Translation file",
					action: "showCreateAsset",
					type: 'translation',
					icon: 'resources/images/icons/asset-translation.png'
				}
			]
		},
		{
			xtype: 'buttongroup',
			title: 'Template',
			columns: 1,
			items: [
				{
					icon: "resources/images/icons/component.png",
					action: 'showCreateTemplate',
					text: 'Component',
					type: 'component'
				},
				{
					icon: "resources/images/icons/entity.png",
					action: 'showCreateTemplate',
					text: 'Entity',
					type: 'entityTemplate'
				},
				{
					icon: "resources/images/icons/system.png",
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
					icon: "resources/images/icons/script.png",
					action: 'showCreateScript',
					text: 'Script'
				}
			]
		}
	]
});
