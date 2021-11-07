export interface Product {
    id: string;
    //category: string;
    code: string,
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    createdDate: Date;
    lastUpdated: Date;
}