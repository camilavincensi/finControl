export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string | { seconds: number; nanoseconds: number } | any;
    description?: string;
    userId?: string;
}