"use client";
import ContactForm from "@/app/component/ContactForm";
import NumberForm from "@/app/component/NumberForm";
import { ContactByPK, ContactByPKDetail } from "@/app/utils/ResponseType";
import { gql, useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FaStar, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const DetailContact: React.FC<{ params: { id: number } }> = ({ params }) => {
    const id = params.id;
    const router = useRouter();
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

    const deleteContactFunction = async () => {
        await deleteContact({
            variables: {
                id: id,
            },
        });
        router.push("/");
    };

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
                            <Button onClick={() => setEditModeContact(true)}>
                                <FaEdit /> Edit Contact Info
                            </Button>
                        )}
                    </ContactInforButtonContainer>
                </ContactInfoContainer>
                <PhoneNumberContainer>
                    {existingPhoneComponents}
                    {newPhoneComponents}
                    <Button onClick={() => addNewPhone()}>
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
                    <Button
                        onClick={deleteContactFunction}
                        style={{ color: "red" }}
                    >
                        <FaTrash /> Delete
                    </Button>
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

const DELETE_CONTACT = gql`
    mutation MyMutation($id: Int!) {
        delete_contact_by_pk(id: $id) {
            first_name
            last_name
            id
        }
    }
`;

export default DetailContact;
