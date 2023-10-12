export type ContactList = {
    contact: ContactDetailType[];
};

export type ContactDetailType = {
    created_at: string;
    first_name: string;
    id: number;
    last_name: string;
    phones: { number: string }[];
};

export type ContactByPK = {
    contact_by_pk: ContactByPKDetail;
};

export type ContactByPKDetail = {
    last_name: string;
    id: number;
    first_name: string;
    created_at: string;
    phones: { number: string }[];
};

export type AddContactType = {
    first_name: string;
    last_name: string;
    phones: { number: string }[];
};
