import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BillItem {
    rate: bigint;
    productName: string;
    quantity: bigint;
    amount: bigint;
}
export interface Shopkeeper {
    id: bigint;
    joinDate: string;
    name: string;
    shopName: string;
    phone: string;
}
export interface StockItem {
    qty: bigint;
    productId: string;
}
export interface Bill {
    customerName: string;
    date: string;
    totalAmount: bigint;
    items: Array<BillItem>;
}
export interface backendInterface {
    addShopkeeper(name: string, shopName: string, phone: string, joinDate: string): Promise<Shopkeeper>;
    addStock(productId: string, qty: bigint): Promise<void>;
    deductStock(productId: string, qty: bigint): Promise<void>;
    getAllBills(): Promise<Array<Bill>>;
    getAllShopkeepers(): Promise<Array<Shopkeeper>>;
    getAllStock(): Promise<Array<StockItem>>;
    getBill(id: bigint): Promise<Bill>;
    getShopkeeperCount(): Promise<bigint>;
    getStock(productId: string): Promise<bigint>;
    saveBill(id: bigint, bill: Bill): Promise<void>;
    setStock(productId: string, qty: bigint): Promise<void>;
}
