"use client";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Link from "next/link";

const NavbarContainer = styled.div`
    border-radius: 8px;
    position: sticky;
    top: 0;
    padding: 3px;
    background-color: #52616b;
    text-align: center;
    font-weight: 800;
`;

const Navbar: React.FC = () => {
    return (
        <NavbarContainer>
            <Link href={"/"} style={{ textDecoration: "none", color: "white" }}>
                <h1>Phone Book</h1>
            </Link>
        </NavbarContainer>
    );
};

export default Navbar;
