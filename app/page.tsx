"use client";
import { useState } from "react";
import styled from "@emotion/styled";
import { SortOutFavorites } from "./utils/SortOutFavorites";
import { gql } from "@apollo/client";
import ContactCard from "./component/ContactCard";
import { ContactDetailType } from "./utils/ResponseType";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { FaUserPlus } from "react-icons/fa";

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
            <h1>Contact List</h1>
            <ButtonsContainer>
                <SearchInput
                    type="text"
                    placeholder="Search..."
                    value={filterQuery}
                    onChange={handleFilter}
                />
                <Button>
                    <FaUserPlus />
                </Button>
            </ButtonsContainer>
            <div
                style={{
                    height: "31.5em",
                    overflowY: "scroll",
                }}
            >
                {contactListComponent}
            </div>
        </MainContainer>
    );
}

const ContactCardContainer = styled.input`
    border-color: rgb(248 250 252);
`;
const SearchInput = styled.input`
    width: 100%;
    border: 2px solid #ccc;
    border-radius: 5px;
    transition: border-color 0.3s;
    &:focus {
        border-color: #007bff;
    }
`;
const MainContainer = styled.div`
    // outline: 1px solid black;
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 5px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #52616b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #1e2022;
    }

    &:focus {
        box-shadow: 0 0 5px #1e2022;
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
