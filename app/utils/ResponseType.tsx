export type ContactList = {
    contact: ContactDetailType[];
};

export type ContactDetailType = {
    created_at: string;
    first_name: string;
    id: number;
    last_name: string;
    phones: { number: number }[];
};
