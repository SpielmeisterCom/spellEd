describe( "SpellEd messageBus", function() {

    it( "has been loaded", function() {
        expect( Spelled.MessageBus ).to.exist
    })

    it( "has been added to Spelled application", function() {
        expect( Spelled.app ).to.have.property( 'engineMessageBus' )
    })
})
