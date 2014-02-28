describe( "Basic Assumptions", function() {

    it( "has ExtJS 4 been loaded", function() {
        expect( Ext ).to.exist
        expect( Ext.getVersion().major ).to.equal( 4 )
    })

    it( "has loaded Spelled code", function() {
        expect( Spelled ).to.exist
    })

    it( "app is initialized", function() {
        expect( Spelled.app ).to.exist
    })

    describe( "Viewport", function() {
        describe( "Navigator", function() {
                it( "should be created", function() {
                        var cmp = Ext.getCmp( 'Navigator' )

                        expect( cmp ).to.exist
                    }
                )
            }
        )

        describe( "MainPanel", function() {
                it( "should be created", function() {
                       var cmp = Ext.getCmp( 'MainPanel' )

                       expect( cmp ).to.exist
                    }
                )

                it( "splitlayout should be hidden", function(){
                    var cmp         = Ext.getCmp( 'MainPanel' ),
                        splitLayout = cmp.down( 'splitlayout' )

                    expect( splitLayout ).to.exist

                    expect( splitLayout.isHidden() ).to.be.true
                })

                it( "mainlayout should be shown", function(){
                    var cmp        = Ext.getCmp( 'MainPanel' ),
                        mainlayout = cmp.down( 'mainlayout' )

                    expect( mainlayout ).to.exist

                    expect( mainlayout.isHidden() ).to.not.be.true
                })
            }
        )

        describe( "RightPanel", function() {
                it( "should be created", function() {
                        var cmp = Ext.getCmp( 'RightPanel' )

                        expect( cmp ).to.exist
                    }
                )
            }
        )

        describe( "SpelledConsole", function() {
                it( "should be created", function() {
                        var cmp = Ext.getCmp( 'SpelledConsole' )

                        expect( cmp ).to.exist
                    }
                )
            }
        )
    } )
})
