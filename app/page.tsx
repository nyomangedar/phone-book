"use client";
import { useState } from "react";
import styled from "@emotion/styled";
import { SortOutFavorites } from "./utils/SortOutFavorites";
import { ContactList } from "./utils/ResponseType";
import ContactCard from "./component/ContactCard";
import { useQuery, gql } from "@apollo/client";

export default function Home() {
    const MainContainer = styled.div`
        margin-top: 2em;
        outline: 1px solid black;
    `;
    const [selected, setSelected] = useState<number | null>(null);
    const handleSelectContact = (id: number) => {
        if (id === selected) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };
    const { regulars, favorites } = SortOutFavorites(contactData);
    const regulardsCard = regulars.map((data) => (
        <ContactCard
            selected={selected}
            setSelected={handleSelectContact}
            contact={data}
            key={data.id}
        />
    ));
    const favoritesCard = favorites.map((data) => (
        <ContactCard
            fav
            selected={selected}
            setSelected={handleSelectContact}
            contact={data}
            key={data.id}
        />
    ));
    return (
        <MainContainer>
            {/* Contact List Component */}
            {regulardsCard}
            {/* FavoriteContacts */}
            {favoritesCard}
        </MainContainer>
    );
}

const contactData: ContactList = {
    contact: [
        {
            created_at: "2023",
            first_name: "john",
            id: 213,
            last_name: "doe",
            phones: [
                {
                    number: 1231223,
                },
            ],
        },
        {
            created_at: "2023",
            first_name: "dohn",
            id: 12,
            last_name: "doe",
            phones: [
                {
                    number: 1231223,
                },
            ],
        },
    ],
};
