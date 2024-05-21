import "@stdlib/deploy";
message Withdraw {
    amount: Int as coins;
}

message Referral {
    referral: Address;
}

message FarmMintEvent {
    senderAddress: Address;
    senderFarmCount: Int?;
}

message FarmMintEventWithReferral {
    senderAddress: Address;
    senderFarmCount: Int?;
    referralAddress: Address;
    referralFarmCount: Int?;
    totalCount: Int as uint64;
}

contract FarmLand with Deployable {
    const MinTonForStorage: Int = ton("0.05");

    deployer: Address;
    farmCount: map<Address, Int as uint32>;
    totalCount: Int as uint64 = 0; 

    init(){
        self.deployer = sender();        
    }

    receive(msg: Referral){
        if (self.totalCount <= 10000) {
            require(context().value >= ton("0.1"),  "First 10000 lands only cost 0.1 TON");
        } else if (self.totalCount <= 20000) { 
            require(context().value >= ton("1"),  "10000 - 20000 lands cost 1 TON");
        } else if (self.totalCount <= 30000) {
            require(context().value >= ton("2"),  "20000 - 30000 lands cost 2 TON");
        } else if (self.totalCount <= 40000) {
            require(context().value >= ton("3"),  "30000 - 40000 lands cost 3 TON");
        } else if (self.totalCount <= 50000){
            require(context().value >= ton("4"),  "40000 - 50000 lands cost 4 TON");
        } else {
            require(context().value >= ton("5"),  "More than 50000 lands cost 5 TON");
        }


        let sender: Address = sender();
        let referral: Address = msg.referral;

        if (referral == sender) {
            referral = self.deployer;
        }

        let count: Int? = self.farmCount.get(sender);        
        if (count == null) {
            count = 1;
        } else {
            count += 1;
        }

        let refCount: Int? = self.farmCount.get(referral);
        if (refCount == null) {
            refCount = 0;
        } else {
            refCount += 1;
        }

        self.farmCount.set(sender, count);
        self.farmCount.set(referral, refCount);

        self.totalCount += 2;
        
        emit(FarmMintEventWithReferral{
            senderAddress: sender, 
            senderFarmCount: count,  
            referralAddress: msg.referral, 
            referralFarmCount: refCount,
            totalCount: self.totalCount}.toCell());
    }

    // this will withdraw the entire balance of the contract and leave 0
    receive("withdraw all"){
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        send(SendParameters{to: sender(), bounce: true, value: 0, mode: (SendRemainingBalance + SendIgnoreErrors)});
    }

    // this will withdraw the entire balance but leave 0.01 for storage rent costs
    receive("withdraw safe"){
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        send(SendParameters{
                to: sender(),
                bounce: true,
                value: ((myBalance() - context().value) - self.MinTonForStorage),
                mode: (SendRemainingValue + SendIgnoreErrors)
            }
        );
    }

    // this will withdraw a specific amount but leave 0.01 for storage rent costs
    receive(msg: Withdraw){
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        let amount: Int = min(msg.amount, ((myBalance() - context().value) - self.MinTonForStorage));
        require(amount > 0, "Insufficient balance");
        send(SendParameters{to: sender(), bounce: true, value: amount, mode: (SendRemainingValue + SendIgnoreErrors)});
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }

    // if the key is not found, the get() method returns null

    get fun farmCount(key: Address): Int? {
        return self.farmCount.get(key);
    }

    get fun totalFarmCount(): Int {
        return self.totalCount;
    }
}