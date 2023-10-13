import { ContactList, ContactDetailType } from "./responseType";

export const SortOutFavorites = (data: ContactList, filterQuery: string) => {
    if (filterQuery !== "") {
        return data.contact.filter((data) => {
            const fullname = `${data.first_name} ${data.last_name}`;
            return fullname.toLowerCase().includes(filterQuery.toLowerCase());
        });
    }
    let regulars: ContactDetailType[] = [];
    let favorites: ContactDetailType[] = [];

    data.contact.map((data) => {
        let favoritesData;
        if (typeof window !== "undefined") {
            // Perform localStorage action
            favoritesData = localStorage.getItem("favorites");
        }

        if (favoritesData?.includes(data.id)) {
            favorites.push(data);
        } else {
            regulars.push(data);
        }
    });
    return { regulars, favorites };
};
