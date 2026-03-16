import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

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

  module Bill {
    public func compare(bill1 : Bill, bill2 : Bill) : Order.Order {
      Text.compare(bill1.date, bill2.date);
    };
  };

  let bills = Map.empty<Nat, Bill>();

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
};
