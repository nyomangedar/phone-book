import { useForm, SubmitHandler } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { ContactByPKDetail } from "../utils/ResponseType";
import { useState } from "react";
import styled from "@emotion/styled";
import { FaPhone, FaEdit, FaCheck, FaTrash, FaBan } from "react-icons/fa";

type NumberType = {
    number: string;
};
const NumberForm: React.FC<{
    data?: ContactByPKDetail;
    existingNumber?: string;
    removePhone: (indexToRemove: number) => void;
    removeExistingPhone: (indexToRemove: number) => void;
    index: number;
    manualEditMode?: boolean;
}> = ({
    data,
    existingNumber,
    removePhone,
    index,
    removeExistingPhone,
    manualEditMode = false,
}) => {
    const [editMode, setEditMode] = useState(manualEditMode);
    const [onHover, setOnHover] = useState(false);
    const [deleteNumberState, setDeleteNumber] = useState(false);
    const [editNumber] = useMutation(EDIT_PHONE_NUMBER);
    const [addNumber, { error: addNewerror, reset: addNewReset }] =
        useMutation(ADD_PHONE_NUMBER);
    const [deleteNumber] = useMutation(DELETE_PHONE_NUMBER);
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<NumberType>({
        mode: "all",
        defaultValues: {
            number: existingNumber || "+62",
        },
    });

    const onSubmit: SubmitHandler<NumberType> = async (postData) => {
        const id = data?.id;
        if (deleteNumberState) {
            if (!existingNumber) {
                console.log("delete");
                removePhone(index);
                setDeleteNumber(false);
                return;
            }
            console.log("delete from graph");
            await deleteNumber({
                variables: {
                    contact_id: id,
                    number: postData.number,
                },
            });
            removeExistingPhone(index);
            setDeleteNumber(false);
            return;
        }

        if (existingNumber) {
            await editNumber({
                variables: {
                    pk_columns: {
                        number: existingNumber,
                        contact_id: id,
                    },
                    new_phone_number: postData.number,
                },
                onError: (err) => {
                    setError("number", {
                        type: "custom",
                        message: `Number already exists`,
                    });
                },
            });
        } else {
            await addNumber({
                variables: {
                    contact_id: id,
                    phone_number: postData.number,
                },
                onError: (err) => {
                    setError("number", {
                        type: "custom",
                        message: `Number already exists`,
                    });
                },
            });
            if (addNewerror) {
                return;
            }
            removePhone(index);
            return;
        }
    };
    const cancelEdit = () => {
        if (existingNumber) {
            reset({
                number: existingNumber,
            });
        } else {
            reset({
                number: "+62",
            });
        }
        setEditMode(false);
    };
    return (
        <FormContainer
            onSubmit={handleSubmit(onSubmit)}
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
        >
            <InputContainer>
                <Label>
                    <FaPhone /> Mobile
                </Label>
                <StyledInput
                    disabled={!editMode}
                    {...register("number", {
                        pattern: /^[0-9+]+$/,
                    })}
                />
                <div>
                    {errors.number && errors.number.type == "pattern" && (
                        <span style={{ color: "red" }}>
                            Invalid phone number
                        </span>
                    )}
                    {errors.number && errors.number.type == "custom" && (
                        <span style={{ color: "red" }}>
                            Number already exists
                        </span>
                    )}
                </div>
            </InputContainer>
            {editMode ? (
                <ButtonContainer
                    style={{
                        display: "flex",
                        gap: "1em",
                        justifyContent: "",
                    }}
                >
                    <Button type="submit">
                        <FaCheck />
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => {
                            setDeleteNumber(true);
                        }}
                    >
                        <FaTrash />
                    </Button>
                    <Button onClick={() => cancelEdit()}>
                        <FaBan />
                    </Button>
                </ButtonContainer>
            ) : (
                onHover && (
                    <Button onClick={() => setEditMode(true)}>
                        <FaEdit /> Edit number
                    </Button>
                )
            )}
        </FormContainer>
    );
};

export default NumberForm;

const Button = styled.button`
    background-color: transparent;
    border: transparent;
    cursor: pointer;
    color: white;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1em;
    justify-content: space-around;
`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1em;
`;

const Label = styled.div`
    color: #969ea3;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`;

const StyledInput = styled.input`
    color: white;
    width: 10em;
    font-size: 20px;
    padding: 10px;
    background-color: transparent;
    border-color: transparent;
    transition: border-color 0.3s;
    border-bottom: white solid 1px;

    &:focus {
        border: trasnparent;
    }

    &:disabled {
        color: white;
        background-color: transparent;
        border-bottom: transparent;
    }
`;

const EDIT_PHONE_NUMBER = gql`
    mutation EditPhoneNumber(
        $pk_columns: phone_pk_columns_input!
        $new_phone_number: String!
    ) {
        update_phone_by_pk(
            pk_columns: $pk_columns
            _set: { number: $new_phone_number }
        ) {
            contact {
                id
                last_name
                first_name
                created_at
                phones {
                    number
                }
            }
        }
    }
`;

const ADD_PHONE_NUMBER = gql`
    mutation AddNumberToContact($contact_id: Int!, $phone_number: String!) {
        insert_phone(
            objects: { contact_id: $contact_id, number: $phone_number }
        ) {
            returning {
                contact {
                    id
                    last_name
                    first_name
                    phones {
                        number
                    }
                }
            }
        }
    }
`;

const DELETE_PHONE_NUMBER = gql`
    mutation DeletePhoneByPK($contact_id: Int!, $number: String!) {
        delete_phone_by_pk(contact_id: $contact_id, number: $number) {
            contact_id
            created_ad
            id
            number
        }
    }
`;
