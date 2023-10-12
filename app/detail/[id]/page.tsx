"use client";
import ContactForm from "@/app/component/ContactForm";
import NumberForm from "@/app/component/NumberForm";
import { ContactByPK, ContactByPKDetail } from "@/app/utils/ResponseType";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

const DetailContact: React.FC<{ params: { id: number } }> = ({ params }) => {
    const id = params.id;

    const { loading, error, data } = useQuery(GET_DETAIL, {
        variables: { id },
    }) as { loading: boolean; error: any; data: ContactByPK };
    const [editModeContact, setEditModeContact] = useState(false);
    const [newPhoneList, setNewPhoneList] = useState<{ number: string }[] | []>(
        []
    );
    const [existingPhoneList, setExistingPhone] = useState<
        { number: string }[] | []
    >([]);
    const [fav, setFav] = useState<number[] | []>(
        JSON.parse(localStorage.getItem("favorites") || "[]")
    );

    useEffect(() => {
        if (data) {
            setExistingPhone(data.contact_by_pk.phones);
        }
    }, [data]);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(fav));
    }, [fav]);

    let content;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        console.log(error);
        return <p>Error..</p>;
    }

    const addNewPhone = () => {
        setNewPhoneList([...newPhoneList, { number: "+62" }]);
    };
    const removePhone = (indexToRemove: number) => {
        const updatedPhoneList = newPhoneList.filter(
            (phone, index) => index !== indexToRemove
        );
        setNewPhoneList(updatedPhoneList);
    };
    const addFav = () => {
        if (typeof window !== undefined) {
            setFav([...fav, id]);
        }
    };
    const removeFav = () => {
        if (typeof window !== undefined) {
            const updatedFav = fav.filter((id) => id !== id);
            setFav(updatedFav);
        }
    };
    const checkFav = () => {
        if (fav.length < 1) {
            return false;
        }
        if (fav.includes(id)) {
            return true;
        }
        return false;
    };
    const removeExistingPhone = (indexToRemove: number) => {
        const updatedExistingPhoneList = existingPhoneList.filter(
            (phone, index) => index !== indexToRemove
        );
        setExistingPhone(updatedExistingPhoneList);
    };

    const contact: ContactByPKDetail = data.contact_by_pk;
    if (contact) {
        const newPhoneComponents = newPhoneList.map((data, index) => (
            <NumberForm
                index={index}
                key={data.number}
                data={contact}
                removePhone={removePhone}
                removeExistingPhone={removeExistingPhone}
                manualEditMode={true}
            />
        ));
        const existingPhoneComponents = existingPhoneList.map((data, index) => (
            <NumberForm
                key={index}
                index={index}
                data={contact}
                existingNumber={data.number}
                removePhone={removePhone}
                removeExistingPhone={removeExistingPhone}
            />
        ));
        content = (
            <>
                {checkFav() ? (
                    <button onClick={removeFav}>Remove favorites</button>
                ) : (
                    <button onClick={addFav}>Add to favorites</button>
                )}

                <ContactForm
                    data={contact}
                    editMode={editModeContact}
                    setEditMode={setEditModeContact}
                />
                {!editModeContact && (
                    <button onClick={() => setEditModeContact(true)}>
                        Edit Contact
                    </button>
                )}
                {existingPhoneComponents}
                {newPhoneComponents}
                <button onClick={() => addNewPhone()}>Add Contact</button>
            </>
        );
    } else {
        content = <p>Contact not found</p>;
    }

    return <div>{content}</div>;
};
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const GET_DETAIL = gql`
    query GetContactDetail($id: Int!) {
        contact_by_pk(id: $id) {
            last_name
            id
            first_name
            created_at
            phones {
                number
            }
        }
    }
`;

export default DetailContact;
