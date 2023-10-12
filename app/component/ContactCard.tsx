import { useState } from "react";
import styled from "@emotion/styled";
import { ContactDetailType } from "../utils/ResponseType";
import Link from "next/link";
import { FaStar, FaInfoCircle } from "react-icons/fa";

const ContactCard: React.FC<{
    fav?: boolean;
    setSelected: (id: number) => void;
    selected: number | null;
    contact: ContactDetailType;
}> = ({ fav = false, setSelected, selected, contact }) => {
    const detail = (
        <div>
            <NumberTable>
                {contact.phones.map((data) => (
                    <span key={data.number}>{data.number}</span>
                ))}
            </NumberTable>
            <NumberButtonsDiv>
                <Link href={`/detail/${contact.id}`}>
                    <DetailInfoButton>
                        <FaInfoCircle size={20} />
                        Detail Info
                    </DetailInfoButton>
                </Link>
            </NumberButtonsDiv>
        </div>
    );
    return (
        <MainCardDiv style={{ borderBottom: "solid 1px #52616B" }}>
            <TitleCardDiv onClick={() => setSelected(contact.id)}>
                <AvatarContainer>
                    {contact.first_name[0].toUpperCase()}
                </AvatarContainer>
                <div>
                    <p>
                        {contact.first_name} {contact.last_name}{" "}
                        {fav && (
                            <span>
                                <FaStar color={"yellow"} />
                            </span>
                        )}
                    </p>
                </div>
            </TitleCardDiv>
            {selected === contact.id && detail}
        </MainCardDiv>
    );
};
const AvatarContainer = styled.div`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-color: gray;
    color: white;
    font-weight: 800;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MainCardDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 3px;
    border-radius: 4px;
`;

const TitleCardDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
`;

const NumberButtonsDiv = styled.div`
    display: flex;
    justify-content: space-around;
    margin: 1em;
`;

const NumberTable = styled.div`
    padding-left: 1.5em;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const DetailInfoButton = styled.div`
    background-color: none;
    display: flex;
    align-items: center;
    color: white;
    gap: 5px;
`;

export default ContactCard;
