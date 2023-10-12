"use client";
import { useState } from "react";
import styled from "@emotion/styled";
import { SortOutFavorites } from "./utils/SortOutFavorites";
import { gql } from "@apollo/client";
import ContactCard from "./component/ContactCard";
import { ContactDetailType } from "./utils/ResponseType";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

export default function Home() {
    const { error, data, loading } = useQuery(GET_CONTACT);
    const [filterQuery, setFilterQuery] = useState("");
    const [selected, setSelected] = useState<number | null>(null);
    const handleSelectContact = (id: number) => {
        if (id === selected) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };
    const handleFilter = (e) => {
        setFilterQuery(e.target.value);
    };

    let contactListComponent;

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p> Error</p>;
    }
    const result:
        | ContactDetailType[]
        | { regulars: ContactDetailType[]; favorites: ContactDetailType[] } =
        SortOutFavorites(data, filterQuery);
    if (!Array.isArray(result)) {
        const regulardsCard = result.regulars
            .slice(0, 10)
            .map((data) => (
                <ContactCard
                    selected={selected}
                    setSelected={handleSelectContact}
                    contact={data}
                    key={data.id}
                />
            ));
        const favoritesCard = result.favorites.map((data) => (
            <ContactCard
                fav
                selected={selected}
                setSelected={handleSelectContact}
                contact={data}
                key={data.id}
            />
        ));
        contactListComponent = (
            <>
                {favoritesCard}
                {regulardsCard}
            </>
        );
    } else {
        contactListComponent = result.map((data) => (
            <ContactCard
                selected={selected}
                setSelected={handleSelectContact}
                contact={data}
                key={data.id}
            />
        ));
    }

    return (
        <MainContainer>
            <ButtonsContainer>
                <input
                    type="text"
                    placeholder="Search..."
                    value={filterQuery}
                    onChange={handleFilter}
                />
                <Button>Add Contact</Button>
            </ButtonsContainer>

            {contactListComponent}
        </MainContainer>
    );
}

const MainContainer = styled.div`
    margin-top: 2em;
    outline: 1px solid black;
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Button = styled.button`
    cursor: pointer;
    padding: 5px;
    background-color: hotpink;
    font-size: 16px;
    border-radius: 4px;
    color: black;
    font-weight: bold;
    &:hover {
        color: white;
        background-color: black;
    }
`;

const GET_CONTACT = gql`
    query GetContactList(
        $distinct_on: [contact_select_column!]
        $limit: Int
        $offset: Int
        $order_by: [contact_order_by!]
        $where: contact_bool_exp
    ) {
        contact(
            distinct_on: $distinct_on
            limit: $limit
            offset: $offset
            order_by: $order_by
            where: $where
        ) {
            created_at
            first_name
            id
            last_name
            phones {
                number
            }
        }
    }
`;
