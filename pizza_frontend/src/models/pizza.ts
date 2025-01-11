export interface Pizza {
  _id?: string;
  name: string;
  description?: string;
  images?: string[];
  address: string;
  price: number;
  discount: number;
  netPrice: number;
  crust: string;
  sauce: string;
  cheese: string;
  toppings: string[];
  isTrending: boolean;
}
