import { ObjectId } from "mongodb";

export type outletType = {
    name: string,
    email: string,
    password: string,
    address: string,
    nameOutlet: string,
    phone: string,
    latitude: number;
    longitude: number;
    role: string
}

export type customerType = {
    name: string,
    email: string,
    password: string,
    address: string,
    phone: string,
    latitude: number;
    longitude: number;
    imgUrl: string
    role: string
}

export type produkType = {
 _id?: ObjectId
 name: string
 slug: string
 price: number
 imgUrl: string
 description: string;
 tags: string[]
 thumbnail: string;
 outletId?: ObjectId
 outletDetails?: {
    name: string
    nameOutlet: string
    phone: string
    email: string
    address: string
 }
}

export type transactionType = {
    _id?: string
    outletId: string
    customerId: string
    transactionDate: string
    totalAmount: number
    status: string
    customerDetail?: customerType[]
}

export type transaction = {
    id: string
    customerName: string
    customerAddress: string
    dateTransaction: string
    status: string
    updateStatus: string
}