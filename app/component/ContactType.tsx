type PhoneType = {
    contact: ContactType;
    number: number;
};

type ContactType = {
    last_name: string;
    first_name: string;
    id: number;
};

type ContactResponseType = {
    phone: ContactType[];
};
