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
export interface Bill {
    customerName: string;
    date: string;
    totalAmount: bigint;
    items: Array<BillItem>;
}
export interface backendInterface {
    getAllBills(): Promise<Array<Bill>>;
    getBill(id: bigint): Promise<Bill>;
    saveBill(id: bigint, bill: Bill): Promise<void>;
}
