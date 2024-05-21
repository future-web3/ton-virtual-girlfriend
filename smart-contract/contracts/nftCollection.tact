const minTonsForStorage: Int = ton("0.08");
const gasConsumption: Int = ton("0.08");

message EventMintRecord {
    minter: Address;
    item_id: Int;
    generate_number: Int;
}

message Referral {
    referred_by: Address;
}

message ReferralWithTon {
    referred_by: Address;
}

message EventBoxOpenAllowed {
    allow_open: Bool;
}

message OwnerUpdateCollectionContent {
    content: Cell;
}

message OpenGiftBox {
    nft_item_address: Address;
    item_index: Int;
}

message UpdateCollectionContent {
    content: Cell?;
}

message BatchMint {
    number: Int;
}

message EventGptTokenPurchase {
    buyer: Address;
    payment: Int as coins;
}

contract NftCollection {
    next_item_index: Int as uint32 = 1;
    owner_address: Address;
    royalty_params: RoyaltyParams?;
    collection_content: Cell;
    updated_collection_content: Cell?;
    allow_open: Bool;
    total_supply: Int;

    init(owner_address: Address, collection_content: Cell, allow_open: Bool, royalty_params: RoyaltyParams, total_supply: Int){
        self.owner_address = owner_address;
        self.collection_content = collection_content;
        self.allow_open = false;
        self.royalty_params = royalty_params;
        self.total_supply = total_supply;
    }

    receive(msg: OwnerUpdateCollectionContent) {
        let ctx: Context = context();
        require(ctx.sender == self.owner_address, "Not Owner");
        self.allow_open = true;
        self.updated_collection_content = msg.content;
        emit(EventBoxOpenAllowed{
            allow_open: true
        }.toCell());
    }

    receive("GptTokenPurchase") {
        let ctx: Context = context();
        let gptToken: Int = 0;
        require(context().value >= ton("0.1"), "Insuffcient Funds");
        emit(EventGptTokenPurchase{
            buyer: context().sender,
            payment: context().value
        }.toCell());
    }

    receive("Mint"){
        require(self.next_item_index <= self.total_supply, "Total Supply Excceed");
        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        require(context().value >= ton("0.12"), "Insuffcient Funds");
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);
        self.mint(ctx.sender, msgValue);

        emit(EventMintRecord{
            minter: sender(),
            item_id: self.next_item_index,
            generate_number: nativeRandom()
        }.toCell());
    }

    receive(msg: Referral) {
        require(self.next_item_index <= self.total_supply, "Total Supply Excceed");
        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        require(context().value >= ton("0.12"), "Insuffcient Funds");
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);
        self.mint(ctx.sender, msgValue/2);
        self.mint(msg.referred_by, msgValue/2);
    }

    receive(msg: ReferralWithTon) {
        require(self.next_item_index <= self.total_supply, "Total Supply Excceed");
        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        require(context().value >= ton("0.12"), "Insuffcient Funds");
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);
        self.mint(ctx.sender, msgValue/2);
        self.referral_with_ton(ctx.sender, msg.referred_by);
    }

    receive(msg: BatchMint){
        require(self.next_item_index + msg.number <= self.total_supply, "Total Supply Excceed");
        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let minimalValue: Int = 1 * msg.number * 120000000;
        require(context().value >= minimalValue, "Insuffcient Funds");
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);
        repeat(msg.number) {
            self.mint(ctx.sender, msgValue/msg.number);
        }
    }

    receive(msg: OpenGiftBox){
        let ctx: Context = context();
        require(self.allow_open == true, "action not allowed");
        self.reply(UpdateCollectionContent{content: self.updated_collection_content}.toCell());
    }

    receive("withdraw safe"){
        require(sender() == self.owner_address, "Only deployer is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: (myBalance() - context().value - gasConsumption - minTonsForStorage),
            mode: (SendRemainingValue + SendIgnoreErrors)
            }
        );
    }

    // ===== Private Methods ===== //
    fun mint(sender: Address, msgValue: Int) {
        require(self.next_item_index >= 1, "non-sequential NFTs");
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        send(
            SendParameters{
                to: contractAddress(nft_init),
                value: msgValue,
                bounce: false,
                mode: SendIgnoreErrors,
                body: Transfer {
                    query_id: 0,
                    new_owner: sender,
                    response_destination: self.owner_address,
                    custom_payload: self.collection_content,
                    forward_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
        });
        // dump(self.next_item_index);
        self.next_item_index = self.next_item_index + 1;
    }

    fun referral_with_ton(sender: Address, receiver: Address) {
        require(sender != receiver, "Invalid Action");
        send(SendParameters{
            to: receiver,
            value: ton("0.2"),
            bounce: false,
            mode: SendIgnoreErrors
        });
    }

    receive(msg: GetRoyaltyParams) {
        let ctx: Context = context(); // get sender Info
        send(
            SendParameters{
                to: ctx.sender,
                value: 0,
                mode: 64,
                bounce: false,
                body: ReportRoyaltyParams {
                    query_id: msg.query_id,
                    numerator:  (self.royalty_params!!).numerator,
                    denominator: (self.royalty_params!!).denominator,
                    destination: self.owner_address
                }.toCell()
        });
    }

    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {
        let b: StringBuilder = beginString();
        let collectionDataString: String = self.collection_content.asSlice().asString();
        b.append(collectionDataString);
        b.append("collection.json"); // You can changed this your self.
        return CollectionData{
            next_item_index: self.next_item_index,
            collection_content: b.toCell(),
            owner_address: self.owner_address
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        return initOf NftItem(myAddress(), item_index);
    }

    get fun get_nft_content(index: Int, individual_content: Cell): Cell {
        let b: StringBuilder = beginString();
        let ic: String = individual_content.asSlice().asString();
        b.append(ic);
        return b.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params!!;
    }

    get fun get_updated_collection_content(): Cell? {
        return self.updated_collection_content;
    }

    get fun get_total_supply(): Int {
        return self.total_supply;
    }

    get fun get_allow_open(): Bool {
        return self.allow_open;
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}

contract NftItem {
    collection_address: Address;
    item_index: Int;
    is_initialized: Bool;

    owner: Address?;
    individual_content: Cell?;

    init(collection_address: Address, item_index: Int){
        require(sender() == collection_address, "not from collection");
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.is_initialized = false;
    }

    receive(msg: Transfer){
        let ctx: Context = context();

        let msgValue: Int = ctx.value; // Check the gasCost for storage
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        if (self.is_initialized == false) {  // Initial Transfer, aka the "Minting" of the NFT
            require(ctx.sender == self.collection_address, "initialized tx need from collection");
            self.is_initialized = true;
            self.owner = msg.new_owner;
            self.individual_content = msg.custom_payload;
            send(
                SendParameters{
                    to: msg.response_destination!!,
                    value: msgValue,
                    mode: SendPayGasSeparately,
                    body: Excesses { query_id: msg.query_id }.toCell()
            });
        } else {
            require(ctx.sender == self.owner!!, "not owner");
            self.owner = msg.new_owner;  // change current owner to the new_owner
            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode:  SendPayGasSeparately,
                    bounce: true,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                });
            }

            msgValue = msgValue - ctx.readForwardFee();
            if (msg.response_destination != null) {
                send(
                    SendParameters{
                        to: msg.response_destination!!,
                        value: msgValue - msg.forward_amount,
                        mode: SendPayGasSeparately,
                        bounce: true,
                        body: Excesses { query_id: msg.query_id }.toCell()
                        }
                    );
            }
        }
    }

    receive(msg: GetStaticData){
        let ctx: Context = context();
        send(
            SendParameters {
                to: ctx.sender,
                value: 0,
                mode: 64,  // (return msg amount except gas fees)
                bounce: true,
                body: ReportStaticData{
                    query_id: msg.query_id,
                    index_id: self.item_index,
                    collection: self.collection_address
                }.toCell()
        });
    }

    receive("update") {
        let ctx: Context = context();        
        let msgValue: Int = ctx.value;
        require(ctx.sender == self.owner, "not owner");
        self.update_nft_data(msgValue);
    }

    receive(msg: UpdateCollectionContent) {
        let ctx: Context = context();
        require(ctx.sender == self.collection_address, "not valid");
        self.individual_content = msg.content;
    }

    fun update_nft_data(msgValue: Int) {
        send(SendParameters {
            to: self.collection_address,
            value: myBalance() - minTonsForStorage,
            mode: SendIgnoreErrors,
            // bounce: true,
            body: OpenGiftBox{
                nft_item_address: myAddress(),
                item_index: self.item_index
            }.toCell()
        });
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        let b: StringBuilder = beginString();
        let collectionData: String = (self.individual_content!!).asSlice().asString();
        b.append(collectionData);
        b.append(self.item_index.toString());
        b.append(".json");

        return GetNftData {
            is_initialized: self.is_initialized,
            index: self.item_index,
            collection_address: self.collection_address,
            owner_address: self.owner!!,
            individual_content: b.toCell()
        };
    }

    get fun get_collection_address(): Address {
        return self.collection_address;
    }
}

message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}
message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
message(0x5fcc3d14) Transfer {
    query_id: Int as uint64;
    new_owner: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_amount: Int as coins;
    forward_payload: Slice as remaining;
}
message(0x05138d91) OwnershipAssigned {
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}
message(0xd53276db) Excesses {
    query_id: Int as uint64;
}
message(0x2fcb26a2) GetStaticData {
    query_id: Int as uint64;
}
message(0x8b771735) ReportStaticData {
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}
struct GetNftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}