
export class Order {
    state: number = 0;
    date: Date = new Date();
    id_user: string = '';
    id_payment: number = 0;
    id_shipping: number = 0;
    orderDetails: OrderDetail[] = [];
}

export class OrderDetail {
    code: string = '';
    quantity: number = 0;
    price : number = 0;
}
