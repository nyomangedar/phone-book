"use client";
import ContactForm from "@/app/component/ContactForm";
import NumberForm from "@/app/component/NumberForm";
import { ContactByPK, ContactByPKDetail } from "@/app/utils/responseType";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FaStar, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { GET_DETAIL, DELETE_CONTACT } from "@/app/utils/request";

const DetailContact: React.FC<{ params: { id: number } }> = ({ params }) => {
    const id = params.id;
    const { loading, error, data } = useQuery(GET_DETAIL, {
        variables: { id },
    }) as { loading: boolean; error: any; data: ContactByPK };
    const [deleteContact] = useMutation(DELETE_CONTACT);
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

    // Delete Contact
    const deleteContactFunction = async () => {
        await deleteContact({
            variables: {
                id: id,
            },
        });
    };

    // Delete Number
    const addNewPhone = () => {
        setNewPhoneList([...newPhoneList, { number: "+62" }]);
    };
    const submitNewPhone = (
        indexToRemove: number,
        newNumber: { number: string }
    ) => {
        const updatedPhoneList = newPhoneList;
        updatedPhoneList[indexToRemove] = newNumber;
        setNewPhoneList([updatedPhoneList]);
    };
    const removePhone = (indexToRemove: number) => {
        const updatedPhoneList = newPhoneList.filter(
            (phone, index) => index !== indexToRemove
        );
        setNewPhoneList(updatedPhoneList);
    };

    const removeExistingPhone = (indexToRemove: number) => {
        console.log(indexToRemove, existingPhoneList);
        const updatedExistingPhoneList = existingPhoneList.filter(
            (phone, index) => index !== indexToRemove
        );
        setExistingPhone(updatedExistingPhoneList);
    };

    // Favorite function
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

    const contact: ContactByPKDetail = data.contact_by_pk;
    if (contact) {
        const newPhoneComponents = newPhoneList.map((data, index) => {
            return (
                <NumberForm
                    index={index}
                    key={index}
                    data={contact}
                    removePhone={removePhone}
                    removeExistingPhone={removeExistingPhone}
                    manualEditMode={true}
                    submitNewPhone={submitNewPhone}
                />
            );
        });
        const existingPhoneComponents = existingPhoneList.map((data, index) => {
            // console.log(data, index);
            return (
                <NumberForm
                    key={index}
                    index={index}
                    data={contact}
                    existingNumber={data.number}
                    removePhone={removePhone}
                    removeExistingPhone={removeExistingPhone}
                    submitNewPhone={submitNewPhone}
                />
            );
        });
        content = (
            <MainContainer>
                <ContactInfoContainer>
                    <DetailInfoContainer>
                        <ContactForm
                            data={contact}
                            editMode={editModeContact}
                            setEditMode={setEditModeContact}
                        />
                    </DetailInfoContainer>
                    <ContactInforButtonContainer>
                        {!editModeContact && (
                            <Button
                                data-testid="edit-info"
                                onClick={() => setEditModeContact(true)}
                            >
                                <FaEdit /> Edit Contact Info
                            </Button>
                        )}
                    </ContactInforButtonContainer>
                </ContactInfoContainer>
                <PhoneNumberContainer>
                    {existingPhoneComponents}
                    {newPhoneComponents}
                    <Button
                        data-testid="add-number"
                        onClick={() => addNewPhone()}
                    >
                        <FaPlus /> Add New Phone Number
                    </Button>
                </PhoneNumberContainer>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        padding: "1em",
                    }}
                >
                    {checkFav() ? (
                        <Button onClick={removeFav}>
                            <FaStar color={"yellow"} />
                        </Button>
                    ) : (
                        <Button onClick={addFav}>
                            <FaStar color={"white"} />
                        </Button>
                    )}

                    <Link href={"/"}>
                        <Button
                            onClick={deleteContactFunction}
                            style={{ color: "red" }}
                        >
                            <FaTrash /> Delete
                        </Button>
                    </Link>
                </div>
            </MainContainer>
        );
    } else {
        content = <p>Contact not found</p>;
    }

    return <div>{content}</div>;
};
const ContactInforButtonContainer = styled.div`
    margin: auto;
`;
const Button = styled.div`
    background-color: none;
    cursor: pointer;
`;

const ContactInfoContainer = styled.div`
    padding: 2em;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-radius: 8px;
    background-color: #374147;
`;
const DetailInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const PhoneNumberContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2em;
    background-color: #374147;
    margin-top: 1em;
    border-radius: 8px;
    gap: 1.5em;
`;

const MainContainer = styled.div`
    margin-top: 1em;
`;

export default DetailContact;
