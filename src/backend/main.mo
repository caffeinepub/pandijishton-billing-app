import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";



actor {
  type BillItem = {
    productName : Text;
    rate : Nat;
    quantity : Nat;
    amount : Nat;
  };

  type Bill = {
    date : Text;
    customerName : Text;
    items : [BillItem];
    totalAmount : Nat;
  };

  type StockItem = {
    productId : Text;
    qty : Nat;
  };

  type Shopkeeper = {
    id : Nat;
    name : Text;
    shopName : Text;
    phone : Text;
    joinDate : Text;
  };

  module Bill {
    public func compare(bill1 : Bill, bill2 : Bill) : Order.Order {
      Text.compare(bill1.date, bill2.date);
    };
  };

  let bills = Map.empty<Nat, Bill>();
  let stocks = Map.empty<Text, Nat>();
  let shopkeepers = Map.empty<Nat, Shopkeeper>();
  var nextShopkeeperId = 1;

  // Bill Functions
  public shared ({ caller }) func saveBill(id : Nat, bill : Bill) : async () {
    if (bills.containsKey(id)) {
      Runtime.trap("Bill with this ID already exists");
    };
    bills.add(id, bill);
  };

  public query ({ caller }) func getBill(id : Nat) : async Bill {
    switch (bills.get(id)) {
      case (null) { Runtime.trap("Bill not found") };
      case (?bill) { bill };
    };
  };

  public query ({ caller }) func getAllBills() : async [Bill] {
    bills.values().toArray().sort();
  };

  // Stock Functions
  public shared ({ caller }) func setStock(productId : Text, qty : Nat) : async () {
    stocks.add(productId, qty);
  };

  public query ({ caller }) func getStock(productId : Text) : async Nat {
    switch (stocks.get(productId)) {
      case (null) { 0 };
      case (?qty) { qty };
    };
  };

  public query ({ caller }) func getAllStock() : async [StockItem] {
    stocks.toArray().map(func((productId, qty)) { { productId; qty } });
  };

  public shared ({ caller }) func addStock(productId : Text, qty : Nat) : async () {
    let currentQty = switch (stocks.get(productId)) {
      case (null) { 0 };
      case (?current) { current };
    };
    stocks.add(productId, currentQty + qty);
  };

  public shared ({ caller }) func deductStock(productId : Text, qty : Nat) : async () {
    let currentQty = switch (stocks.get(productId)) {
      case (null) { 0 };
      case (?current) { current };
    };
    let newQty = if (currentQty > qty) { currentQty - qty } else { 0 };
    stocks.add(productId, newQty);
  };

  public shared ({ caller }) func resetStock(productId : Text) : async () {
    stocks.add(productId, 0);
  };

  // Shopkeeper Functions
  public shared ({ caller }) func addShopkeeper(name : Text, shopName : Text, phone : Text, joinDate : Text) : async Shopkeeper {
    let id = nextShopkeeperId;
    let shopkeeper : Shopkeeper = {
      id;
      name;
      shopName;
      phone;
      joinDate;
    };
    shopkeepers.add(id, shopkeeper);
    nextShopkeeperId += 1;
    shopkeeper;
  };

  public shared ({ caller }) func deleteShopkeeper(id : Nat) : async () {
    shopkeepers.remove(id);
  };

  public query ({ caller }) func getAllShopkeepers() : async [Shopkeeper] {
    shopkeepers.values().toArray();
  };

  public query ({ caller }) func getShopkeeperCount() : async Nat {
    shopkeepers.size();
  };
};
