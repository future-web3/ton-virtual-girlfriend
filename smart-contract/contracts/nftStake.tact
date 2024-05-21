import "@stdlib/ownable";

/* ===========================================================================
Owing to the architectural design of TON, each token owned by an address possesses its unique
receiving wallet address. This implies that it is not possible to input 'token contract messages'
to be received by the token contract used for fundraising, as it would not make sense.

The correct procedure involves inputting this 'receiving contract' into the specified Jetton
token contract to acquire the Wallet Address unique to this Jetton token. Only after obtaining
this address can you input the message into the 'target business logic contract'.
=========================================================================== */

contract StakingContract {
    this_contract_jettonWallet: Address?;
    owner: Address;
    index: Int as uint32 = 0;
    stake_record: map<Int, StakeRecord>;
    score_list: map<Address, Int>;
    start_time: Int as uint32;
    total_score: Int as uint128 = 0;
    parameter: Int as uint16;
    // TODO:
    // jetton_root_init: InitOf;
    // get fun get_jetton_root(): Address{}
    // InitOf vs Address: Which one has lowest storage cost?

    init(_owner: Address, _parameter: Int){
        // self.this_contract_jettonWallet = this_contract_jettonWallet;
        self.owner = _owner;
        self.parameter = _parameter;
        self.start_time = now();
    }

    // The notification for the Jetton Token contract noification(when current address receive the token will get the notification)
    receive(stake: TokenNotification){
        require(context().value >= ton("0.1"), "not enough value");
        // Check the sender is from the Jetton Wallet
        require(context().sender == self.this_contract_jettonWallet, "not from one of any jetton wallet");
        // Manipulating the score you want to give, no matter based on time or amount
        let score: Int = self.score_function(stake.amount);
        // Update the stake record
        self.stake_record.set(self.index,
            StakeRecord{stake_address: stake.from, jettonStakeAmount: stake.amount, score: score}
        );
        // Update the weight of the user, if the user is in the list, then add it
        let previous_score: Int = self.score_list.get(stake.from)!!;
        if (previous_score == null) {
            self.score_list.set(stake.from, score);
        } else if (previous_score >= 0) {
            previous_score = (previous_score + score);
            self.score_list.set(stake.from, previous_score);
        }
        self.total_score = (self.total_score + score);
        self.index = (self.index + 1);
        // Submit the Log Event
        emit(TransferEvent{sender_address: stake.from, jetton_amount: stake.amount, score: score}.toCell());
    }

    // To get the ratio of a user in a on-chain ways
    receive(msg: GetWeighted){
        let ctx: Context = context();
        let user_score: Int = self.score_list.get(msg.applied_user_address)!!;
        require(user_score > 0, "no Record");
        send(SendParameters{
                to: ctx.sender,
                value: 0,
                mode: (SendRemainingValue + SendIgnoreErrors),
                bounce: true,
                body: PassScoreToRoundContract{
                    checked_address: msg.applied_user_address, // 0xe5fd7f29
                    return_score: user_score
                }.toCell()
            }
        );
    }

    // receive(msg: AdminExecute) {}

    receive(msg: Unstake){
        let weight: Int = self.score_list.get(context().sender)!!;
        require(weight > 0, "not in the list"); // TODO: only checking point

        // Send Transfer to self.get_major_jetton_address(myAddress())
        // Transfer the jetton token back: Amount, who
        let stake_record: StakeRecord = self.stake_record.get(msg.index_id)!!;
        require(stake_record.jettonStakeAmount > 0, "don't have value");
        self.stake_record.set(msg.index_id, null);
        send(SendParameters{
                to: self.this_contract_jettonWallet!!,
                value: 0,
                mode: (SendRemainingValue + SendIgnoreErrors),
                bounce: false, // 0x7362d09c - notify new owner
                body: TokenTransfer{
                    query_id: 0,
                    amount: stake_record.jettonStakeAmount,
                    destination: context().sender,
                    response_destination: myAddress(),
                    custom_payload: null,
                    forward_ton_amount: ton("0.01"),
                    forward_payload: emptySlice()
                }.toCell()
            }
        );
    }

    fun score_function(jetton_amount: Int): Int {
        return jetton_amount * pow(10, 18) / self.durationTime() * self.parameter / 1000;
    }

    fun durationTime(): Int {
        return (now() - self.start_time);
    }

    // TODO: Admin 強制 UnStake所有代幣？
    // admin enable to withdraw the token to the original depositor

    receive(){}

    get fun get_user_stake_record(): map<Int, StakeRecord> {
        return self.stake_record;
    }

    get fun get_user_stake_amount(): map<Address, Int> {
        return self.score_list;
    }

    get fun get_return_staking_data(): StakingData {
        return
            StakingData{
                index: self.index,
                this_contract_jettonWallet: self.this_contract_jettonWallet!!,
                total_score: self.total_score,
                parameter: self.parameter
            };
    }

    // get fun get_ratio_of_stake(StakeTokenAmount: Int): Int {
    //     return self.score_function(StakeTokenAmount) * pow(10, 9) / self.total_score;
    // }
    // get fun get_ratio_of_stake_2(StakeTokenAmount: Int): Int {
    //     return self.score_function(StakeTokenAmount) * pow(10, 6) / self.total_score;
    // }
    // get fun get_ratio_of_stake_3(StakeTokenAmount: Int): Int {
    //     return self.score_function(StakeTokenAmount) * 100 / self.total_score / 100;
    // }
}

message PassScoreToRoundContract {
    checked_address: Address;
    return_score: Int as uint64;
}
// ===== Data Struct ===== //
struct StakingData {
    index: Int as uint64;
    this_contract_jettonWallet: Address;
    total_score: Int as coins;
    parameter: Int as uint16;
}
struct StakeRecord {
    stake_address: Address;
    jettonStakeAmount: Int as coins;
    score: Int as uint128; // TODO: 可以後面刪掉
}
// ===== TEP64 Standard: Jetton Messages ===== //
// message(0xf8a7ea5) TokenTransfer {
//     query_id: Int as uint64;
//     amount: Int as coins;
//     destination: Address;
//     response_destination: Address;
//     custom_payload: Cell?;
//     forward_ton_amount: Int as coins;
//     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
// }

// message(0x7362d09c) TokenNotification {
//     query_id: Int as uint64;
//     amount: Int as coins;
//     from: Address;
//     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
// }


// For the end-point of the Tx, this data means nothing important.
// (Ref: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
// ===== LOG Event ===== //
message TransferEvent {
    sender_address: Address;
    jetton_amount: Int as coins;
    score: Int as uint128;
}
// ================================================================================ //
message AddingJettonAddress {
    this_contract_jettonWallet: Address;
}
message Unstake {
    index_id: Int as uint32;
}
message Redeem {
    queryId: Int as uint64;
    project_id: Int as uint16;
}
message GetWeighted {
    // ===== on-chain fetch ===== //
    applied_user_address: Address;
}

message Mint {
    amount: Int;
    receiver: Address;
}

contract SampleJetton with Jetton {
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;

    max_supply: Int as coins; // Extract parameter we set here. The Jetton Standards doesn't have this parameter.

    init(owner: Address, content: Cell, max_supply: Int) {
        self.total_supply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
        self.max_supply = max_supply;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(self.mintable, "Not mintable");
        require(self.total_supply + msg.amount <= self.max_supply, "Max supply exceeded");
        self.mint(msg.receiver, msg.amount, self.owner); // (to, amount, response_destination)
    }

    receive("Mint: 100") { // Public Minting
        let ctx: Context = context();
        require(self.mintable, "Not mintable");
        require(self.total_supply + 100 <= self.max_supply, "Max supply exceeded");
        self.mint(ctx.sender, 100, self.owner); // 🔴 
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.mintable = false;
    }
} 

// ============================================================================================================ //
@interface("org.ton.jetton.master")
trait Jetton with Ownable {

    total_supply: Int; // Already set initially 
    mintable: Bool;
    owner: Address;
    content: Cell;
    
    receive(msg: TokenUpdateContent) {
        self.requireOwner();                // Allow changing content only by owner
        self.content = msg.content;         // Update content
    }

    receive(msg: TokenBurnNotification) {
        self.requireSenderAsWalletOwner(msg.response_destination);       // Check wallet
        self.total_supply = self.total_supply - msg.amount; // Update supply
        if (msg.response_destination != null) { // Cashback
            send(SendParameters{
                to: msg.response_destination, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: TokenExcesses{ query_id: msg.query_id }.toCell()
            });
        }
    }

    // Private Methods // 
    // @to The Address receive the Jetton token after minting
    // @amount The amount of Jetton token being minted
    // @response_destination The previous owner address
    fun mint(to: Address, amount: Int, response_destination: Address) {
        require(self.mintable, "Can't Mint Anymore");
        self.total_supply = self.total_supply + amount; // Update total supply

        let winit: StateInit = self.getJettonWalletInit(to); // Create message
        send(SendParameters{
            to: contractAddress(winit), 
            value: 0, 
            bounce: true,
            mode: SendRemainingValue,
            body: TokenTransferInternal{ 
                query_id: 0,
                amount: amount,
                from: myAddress(),
                response_destination: response_destination,
                forward_ton_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    fun requireSenderAsWalletOwner(owner: Address) {
        let ctx: Context = context();
        let winit: StateInit = self.getJettonWalletInit(owner);
        require(contractAddress(winit) == ctx.sender, "Invalid sender");
    }

    virtual fun getJettonWalletInit(address: Address): StateInit {
        return initOf JettonDefaultWallet(myAddress(), address);
    }

    // ====== Get Methods ====== //
    get fun get_jetton_data(): JettonData {
        let code: Cell = self.getJettonWalletInit(myAddress()).code;
        return JettonData{ 
            total_supply: self.total_supply, 
            mintable: self.mintable, 
            owner: self.owner, 
            content: self.content, 
            wallet_code: code
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        let winit: StateInit = self.getJettonWalletInit(owner);
        return contractAddress(winit);
    }
}

// ============================================================ //
@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    balance: Int;
    owner: Address;
    master: Address;

    init(master: Address, owner: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransfer) { // 0xf8a7ea5
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.owner, "Invalid sender");

        // Gas checks
        let fwd_fee: Int = ctx.readForwardFee() + ctx.readForwardFee();  
        let final: Int =  2 * self.gasConsumption + self.minTonsForStorage + fwd_fee;
        require(ctx.value > min(final, ton("0.01")), "Invalid value!!"); 

        // Update balance
        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let init: StateInit = initOf JettonDefaultWallet(self.master, msg.destination);  
        let wallet_address: Address = contractAddress(init);
        send(SendParameters{
            to: wallet_address, 
            value: 0,
            mode: SendRemainingValue, 
            bounce: true,
            body: TokenTransferInternal{
                query_id: msg.query_id,
                amount: msg.amount,
                from: self.owner,
                response_destination: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    receive(msg: TokenTransferInternal) { // 0x178d4519
        let ctx: Context = context();

        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(self.master, msg.from);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }

        // Update balance
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid balance"); 
        
        // Get value for gas
        let msg_value: Int = self.msg_value(ctx.value);  
        let fwd_fee: Int = ctx.readForwardFee();
        msg_value = msg_value - msg.forward_ton_amount - fwd_fee;
        
         // 0x7362d09c - notify the new owner of JettonToken that the transfer is complete
        if (msg.forward_ton_amount > 0) { 
            send(SendParameters{
                to: self.owner,
                value: msg.forward_ton_amount,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                bounce: false,
                body: TokenNotification {
                    query_id: msg.query_id,
                    amount: msg.amount,
                    from: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // 0xd53276db -- Cashback to the original Sender
        if (msg.response_destination != null) { 
            send(SendParameters {
                to: msg.response_destination, 
                value: msg_value,  
                bounce: false,
                body: TokenExcesses { 
                    query_id: msg.query_id
                }.toCell(),
                mode: SendIgnoreErrors
            });
        }
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");  // Check sender

        self.balance = self.balance - msg.amount; // Update balance
        require(self.balance >= 0, "Invalid balance");

        let fwd_fee: Int = ctx.readForwardFee(); // Gas checks
        require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

        // Burn tokens
        send(SendParameters{  
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                query_id: msg.query_id,
                amount: msg.amount,
                response_destination: self.owner
            }.toCell()
        });
    }

    receive(msg: ProvideWalletAddress) {
        require(context().value >= ton("0.0061"), "Insufficient gas");
        let init: StateInit = initOf JettonDefaultWallet(self.master, msg.owner_address);
        let wallet_address: Address = contractAddress(init);

        let response_body: TakeWalletAddress = TakeWalletAddress{
                query_id: msg.query_id,
                wallet_address: wallet_address,
                owner_address: null
            };
        if (msg.include_address) {
            response_body.owner_address = msg.owner_address;
        }
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: response_body.toCell()
        });
    }

    get fun msg_value(value: Int): Int {
        let msg_value: Int = value;
        let ton_balance_before_msg: Int = myBalance() - msg_value;
        let storage_fee: Int = self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage);
        msg_value = msg_value - (storage_fee + self.gasConsumption);
        return msg_value;
    }

    bounced(src: bounced<TokenTransferInternal>) {
        self.balance = self.balance + src.amount;
    }

    bounced(src: bounced<TokenBurnNotification>) {
        self.balance = self.balance + src.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            wallet_code: (initOf JettonDefaultWallet(self.master, self.owner)).code
        };
    }
    
    // bounced(msg: Slice) {
    //     // Parse bounced message
    //     msg.skipBits(32); // 0xFFFFFFFF 
    //     let op: Int = msg.loadUint(32);
    //     let query_id: Int = msg.loadUint(64);
    //     let jettonAmount: Int = msg.loadCoins();
    //     require(op == 0x178d4519 || op == 0x7bdd97de, "Invalid bounced message");
    //     self.balance = self.balance + jettonAmount; // Update balance
    // }

}


struct JettonData {
    total_supply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    wallet_code: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    wallet_code: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x178d4519) TokenTransferInternal {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x7362d09c) TokenNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
}

message(0x595f07bc) TokenBurn {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address;
}

message(0xd53276db) TokenExcesses {
    query_id: Int as uint64;
}

message TokenUpdateContent {
    content: Cell;
}

// ==== TEP89: Jetton Wallet Discovery ====
message(0x2c76b973) ProvideWalletAddress {
    query_id: Int as uint64;
    owner_address: Address;
    include_address: Bool;
}

message(0xd1735400) TakeWalletAddress {
    query_id: Int as uint64;
    wallet_address: Address;
    owner_address: Address?;
}