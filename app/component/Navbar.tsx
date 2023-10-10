"use client";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const NavbarContainer = styled.div`
    position: sticky;
    top: 0;
    padding: 3px;
    background-color: gray;
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

const Navbar: React.FC = () => {
    return (
        <NavbarContainer>
            <ButtonsContainer>
                <Button>Search</Button>
                <Button>Add Contact</Button>
            </ButtonsContainer>
            <h1>Contact List</h1>
        </NavbarContainer>
    );
};

export default Navbar;
