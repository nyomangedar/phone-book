"use client";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const NavbarContainer = styled.div`
    position: sticky;
    top: 0;
    padding: 3px;
    background-color: gray;
`;

const Navbar: React.FC = () => {
    return (
        <NavbarContainer>
            <h1>Contact List</h1>
        </NavbarContainer>
    );
};

export default Navbar;
