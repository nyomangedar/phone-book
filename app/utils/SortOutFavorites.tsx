import { ContactList, ContactDetailType } from "./ResponseType";

export const SortOutFavorites = (data: ContactList) => {
    let regulars: ContactDetailType[] = [];
    let favorites: ContactDetailType[] = [];

    data.contact.map((data) => {
        if (typeof window !== "undefined") {
            // Perform localStorage action
            const favorites = localStorage.getItem("favorites");
        }

        if (favorites.includes(data.id)) {
            favorites.push(data);
        } else {
            regulars.push(data);
        }
    });
    return { regulars, favorites };
};
