Ext.define('Spelled.controller.Layout', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.layout.Split',
		'Spelled.view.layout.Main',
		'layout.column',
		'layout.form'
	],

    views: [
        'layout.Split',
        'layout.Main'
    ],

    init: function() {
        this.control({
			'#SceneEditor': {
				beforeadd: this.checkForTabChange
			},
			'spelledmenu [action="changeToMainLayout"]': {
				click: this.changeToMainLayout
			},
			'spelledmenu [action="changeToSplitLayout"]': {
				click: this.changeToSplitLayout
			}
        })

		this.application.on( {
			closealltabs: this.closeAllTabs,
			scope: this
		})
	},

	refs: [
		{
			ref : 'MainPanel',
			selector: '#MainPanel'
		},
		{
			ref : 'SceneEditor',
			selector: '#SceneEditor'
		},
		{
			ref : 'SecondTabPanel',
			selector: '#SecondTabPanel'
		},
		{
			ref : 'MainLayout',
			selector: 'mainlayout'
		},
		{
			ref : 'SplitLayout',
			selector: 'splitlayout'
		}
	],

	closeAllTabs: function() {
		this.getSceneEditor().removeAll()
		this.getSecondTabPanel().removeAll()
	},

	checkForTabChange: function( tabPanel, panel ) {
		var secondTab   = this.getSecondTabPanel(),
			splitLayout = secondTab.up( 'splitlayout' )

		if( splitLayout.isVisible() && panel.getXType() !== 'renderedscene' ) {
			var foundTab    = this.application.findActiveTabByTitle( secondTab, panel.title )

			if( !foundTab ) {
				secondTab.add( panel )
				secondTab.setActiveTab( panel )
			}
			return false
		}
	},

	moveTabs: function( destinationTab, sourceTabPanel ) {
		var fakePanel = Ext.widget( 'panel' )
		destinationTab.insert( 0, fakePanel )

		sourceTabPanel.items.each(
			function( panel ) {
				if( panel.getXType() != 'renderedscene' ){
					destinationTab.insert( null, panel )
					destinationTab.setActiveTab( panel )
				}
			}
		)
		destinationTab.remove( fakePanel )
	},

	changeToMainLayout: function() {
		var mainLayout  = this.getMainLayout()
		this.getSplitLayout().hide()

		this.moveTabs( this.getSceneEditor(), this.getSecondTabPanel() )

		mainLayout.add( this.getSceneEditor() )
		mainLayout.show()
		this.application.fireEvent( 'reloadscene' )
	},

	changeToSplitLayout: function() {
		var splitLayout = this.getSplitLayout()
		this.getMainLayout().hide()

		this.moveTabs( this.getSecondTabPanel(), this.getSceneEditor() )

		splitLayout.insert( 0, this.getSceneEditor() )
		splitLayout.show()
		this.application.fireEvent( 'reloadscene' )
	}
})
