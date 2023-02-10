// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact

require('babel-register')

var SupplyChain = artifacts.require('../contracts/SupplyChain.sol')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    const bottleId = 1;
    const deployerID = accounts[0]
    const producerID = accounts[1]
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const customerID = accounts[4]
    const emptyAddress = 0x00000000000000000000000000000000000000;
    const farmLatitude = "17.809356"
    const farmLongitude = "74.934207"
    const farmAddress = "Panaitolion Trichonidas"
    const farmID = 1;
    const farmName = "Agrinio Olives Farm"
    const grapesId = 1;
    const grapesNotes = "The sweet taste and excellent nutritional benefits ..."
    const collectYear = 2023
    const price = 1;
    const oliveCost = web3.utils.toWei('1', 'ether')
    const oliveNotes = "...bla bla."


    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Producer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    it("Deployer assigned to each role", async () => {
	    // Get deployed contract
	    let instance = await SupplyChain.deployed();
	    // Perform a function of the contract
	    let isProducer 		= await instance.isProducer(deployerID);
	    let isDistributor 	= await instance.isDistributor(deployerID);
	    let isRetailer 		= await instance.isRetailer(deployerID);
	    let isCustomer		= await instance.isCustomer(deployerID);
	    // Assert if result is equal to something, and if not send a message
	    assert.isTrue(isProducer, "creator is producer");
	    assert.isTrue(isDistributor, "creator is distributor");
	    assert.isTrue(isRetailer, "creator is retailer");
	    assert.isTrue(isCustomer, "creator is customer");
  	})

    // 1st Test
    it("Testing smart contract function harvestOlives() that allows producer to harvest grapes", async() => {

        const supplyChain = await SupplyChain.deployed();

        await supplyChain.addProducer(producerID, {from: deployerID});

        await supplyChain.registerFarm(farmID, farmName, farmLatitude, farmLongitude, farmAddress, {from: producerID});

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestOlives(grapesId, grapesNotes, collectYear, farmID, {from: producerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
         
        const resultOlives = await supplyChain.getOlivesInfo.call(grapesId);
        // Verify the result set
        assert.equal(resultOlives[0], grapesId, 'Error: Missing or Invalid Olives ID')
        assert.equal(resultOlives[1], grapesNotes, 'Error: Missing or Invalid Olives Notes')
        assert.equal(resultOlives[2], collectYear, 'Error: Missing or Invalid Crop Year')
        assert.equal(resultOlives[3], "Olives Harvested", 'Error: Missing or Invalid Olives State')
        assert.equal(resultOlives[4], farmID, 'Error: Missing or Invalid Farm ID')
        assert.equal(resultOlives[5], farmName, 'Error: Missing or Invalid Farm Name')
        assert.equal(resultOlives[6], farmLatitude, 'Error: Missing or Invalid Farm Latitude')
        assert.equal(resultOlives[7], farmLongitude, 'Error: Missing or Invalid Farm Longitude')
        assert.equal(resultOlives[8], farmAddress, 'Error: Missing or Invalid Farm Address')
    })    

    // 2nd Test
    it("Testing smart contract function pressGrapes() & preservGrapes() that allows a producer to preserv grapes", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Watch the emitted event Processed()
        

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.pressGrapes(grapesId, {from: producerID});
        await supplyChain.preservGrapes(grapesId, {from: producerID});
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlives = await supplyChain.getOlivesInfo.call(grapesId);
        // Verify the result set
        assert.equal(resultOlives[3], "Grapes Preserved", 'Error: Missing or Invalid Grapes State')
    })    

    // 3rd Test
    it("Testing smart contract function bottlingOlive() that allows a producer to bottle olive", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Packed()
        

        // Mark an item as Packed by calling function packItem()
        await supplyChain.bottlingOlive(bottleId, grapesId, price, oliveNotes, {from: producerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);

        // Verify the result set
        assert.equal(resultOlive[0], bottleId, 'Error: Missing or Invalid Olive ID')
        assert.equal(resultOlive[1], price, 'Error: Missing or Invalid Olive Price')
        assert.equal(resultOlive[2], producerID, 'Error: Missing or Invalid Olive Owner')
        assert.equal(resultOlive[3], emptyAddress, 'Error: Missing or Invalid Olive Buyer')
        assert.equal(resultOlive[4], "Olive Bottled", 'Error: Missing or Invalid Olive State')
        assert.equal(resultOlive[5], grapesId, 'Error: Missing or Invalid Grapes ID')
    })    

    // 4th Test
    it("Testing smart contract function bottleForDistributionSale() that allows a producer to sell olive to distributor", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event ForSale()
        await supplyChain.addDistributor(distributorID, {from: deployerID});

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.bottleForDistributionSale(bottleId, price, {from: distributorID, value: oliveCost});
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);

        // Verify the result set
        assert.equal(resultOlive[0], bottleId, 'Error: Missing or Invalid Olive ID')
        assert.equal(resultOlive[1], price, 'Error: Missing or Invalid Olive Price')
        assert.equal(resultOlive[2], distributorID, 'Error: Missing or Invalid Olive Owner')
        assert.equal(resultOlive[3], distributorID, 'Error: Missing or Invalid Olive Buyer')
        assert.equal(resultOlive[4], 'Olive Bottle sold for Distribution', 'Error: Missing or Invalid Olive State')
        assert.equal(resultOlive[5], grapesId, 'Error: Missing or Invalid Grapes ID')
    })    

    // 5th Test
    it("Testing smart contract function bottleShipForRetail() that allows a distributor to sell & ship olive bottle to retailer", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        await supplyChain.addRetailer(retailerID, {from: deployerID});
        
        // Watch the emitted event Sold()
        

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.bottleShipForRetail(bottleId, price, {from: retailerID, value: oliveCost});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);

        // Verify the result set
         assert.equal(resultOlive[0], bottleId, 'Error: Missing or Invalid Olive ID')
         assert.equal(resultOlive[1], price, 'Error: Missing or Invalid Olive Price')
         assert.equal(resultOlive[2], retailerID, 'Error: Missing or Invalid Olive Owner')
         assert.equal(resultOlive[3], retailerID, 'Error: Missing or Invalid Olive Buyer')
         assert.equal(resultOlive[4], 'Olive Shipped to Retailer', 'Error: Missing or Invalid Olive State')
         assert.equal(resultOlive[5], grapesId, 'Error: Missing or Invalid Grapes ID')
    })    

    // 6th Test
    it("Testing smart contract function bottleForSale() that allows a retailer to sell olive bottle", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Shipped()
        

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.bottleForSale(bottleId, price, {from: retailerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);

        // Verify the result set
        assert.equal(resultOlive[2], retailerID, 'Error: Missing or Invalid Olive Owner')
        assert.equal(resultOlive[3], retailerID, 'Error: Missing or Invalid Olive Buyer')
        assert.equal(resultOlive[4], 'Olive Bottle for Sale with Retailer', 'Error: Missing or Invalid Olive State')
    })    

    // 7th Test
    it("Testing smart contract function buyBottle() that allows a customer to buy olive from retailer", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        await supplyChain.addCustomer(customerID, {from: deployerID});
        
        // Watch the emitted event Received()

        await supplyChain.buyBottle(bottleId, {from: customerID, value: oliveCost});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);

        // Verify the result set
        assert.equal(resultOlive[4], 'Olive Bottle Sold to Consumer', 'Error: Missing or Invalid Olive State')     
    })    

    // 8th Test
    it("Testing smart contract function shipBottle() that allows retailer to ship olive to customer", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Purchased()
        

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.shipBottle(bottleId, {from: retailerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);

        // Verify the result set
        assert.equal(resultOlive[4], 'Olive Bottle Shipped to Consumer', 'Error: Missing or Invalid Olive State') 
    })    

    // 9th Test
    it("Testing smart contract function BottleReceived() that allows customer to mark bottle received.", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        await supplyChain.BottleReceived(bottleId, {from: customerID});
        const resultOlive = await supplyChain.getBottleInfo.call(bottleId);
        // Verify the result set:
        assert.equal(resultOlive[2], customerID, 'Error: Missing or Invalid Olive Owner')
        assert.equal(resultOlive[4], 'Olive Bottle Received by Consumer', 'Error: Missing or Invalid Olive State')
    })

    // 10th Test
    it("Testing smart contract function getOlivesInfo() that allows anyone to fetch grapes details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultOlives = await supplyChain.getOlivesInfo.call(grapesId);
        
        // Verify the result set:
        assert.equal(resultOlives[0], grapesId, 'Error: Missing or Invalid Grapes ID')
        console.log('Grapes ID: ' + resultOlives[0])
        assert.equal(resultOlives[1], grapesNotes, 'Error: Missing or Invalid Grapes Notes')
        console.log('Grapes Notes: ' + resultOlives[1])
        assert.equal(resultOlives[2], collectYear, 'Error: Missing or Invalid Vintage Year')
        console.log('Grapes Vintage Year: ' + resultOlives[2])
        assert.equal(resultOlives[3], "Grapes Preserved", 'Error: Missing or Invalid Grapes State')
        console.log('Grapes State: ' + resultOlives[3])
        assert.equal(resultOlives[4], farmID, 'Error: Missing or Invalid Farm ID')
        console.log('Grapes Farm ID: ' + resultOlives[4])
        assert.equal(resultOlives[5], farmName, 'Error: Missing or Invalid Farm Name')
        console.log('Grapes Farm Name: ' + resultOlives[5])
        assert.equal(resultOlives[6], farmLatitude, 'Error: Missing or Invalid Farm Latitude')
        console.log('Grapes Farm Latitude: ' + resultOlives[6])
        assert.equal(resultOlives[7], farmLongitude, 'Error: Missing or Invalid Farm Longitude')
        console.log('Grapes Farm Longitude: ' + resultOlives[7])
        assert.equal(resultOlives[8], farmAddress, 'Error: Missing or Invalid Farm Address')
        console.log('Grapes Farm Adddress: ' + resultOlives[8])
        
    })

    it("Testing smart contract function getBottleInfo() that allows anyone to fetch olive bottle details on the blockchain", async() => {
        
        const supplyChain = await SupplyChain.deployed()
        
        const resultOlive = await supplyChain.getBottleInfo.call(grapesId);

        assert.equal(resultOlive[0], bottleId, 'Error: Missing or Invalid Olive ID')
        console.log('Olive Bottle ID: ' + resultOlive[0])
        assert.equal(resultOlive[1], price, 'Error: Missing or Invalid Price')
        console.log('Olive Bottle Price: ' + resultOlive[1])
        assert.equal(resultOlive[2], customerID, 'Error: Missing or Invalid Olive Owner')
        console.log('Olive Bottle Owner: ' + resultOlive[2])
        assert.equal(resultOlive[3], emptyAddress, 'Error: Missing or Invalid Olive Buyer')
        console.log('Olive Bottle Buyer: ' + resultOlive[3])
        assert.equal(resultOlive[4], 'Olive Bottle Received by Consumer', 'Error: Missing or Invalid Olive State')
        console.log('Olive Bottle State: ' + resultOlive[4])
        assert.equal(resultOlive[5], grapesId, 'Error: Missing or Invalid Grapes ID')
        console.log('Olive Bottle Grapes ID: ' + resultOlive[5])

    })

});