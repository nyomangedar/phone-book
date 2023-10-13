"use client";
import styled from "@emotion/styled";
import Link from "next/link";

const NavbarContainer = styled.div`
    margin-top: 1em;
    margin-bottom: 1em;
    border-radius: 8px;
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
