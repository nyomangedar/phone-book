import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ContactByPKDetail } from "../utils/ResponseType";
import { useState } from "react";
import styled from "@emotion/styled";
import { FaPhone, FaEdit, FaCheck, FaTrash, FaBan } from "react-icons/fa";
import {
    EDIT_PHONE_NUMBER,
    ADD_PHONE_NUMBER,
    DELETE_PHONE_NUMBER,
} from "../utils/Request";
type NumberType = {
    number: string;
};
const NumberForm: React.FC<{
    data?: ContactByPKDetail;
    existingNumber?: string;
    removePhone: (indexToRemove: number) => void;
    removeExistingPhone: (indexToRemove: number) => void;
    submitNewPhone: (
        indexToRemove: number,
        newNumber: { number: string }
    ) => void;
    index: number;
    manualEditMode?: boolean;
}> = ({
    data,
    existingNumber,
    removePhone,
    index,
    removeExistingPhone,
    manualEditMode = false,
    submitNewPhone,
}) => {
    const [editMode, setEditMode] = useState(manualEditMode);
    const [onHover, setOnHover] = useState(false);
    const [deleteNumberState, setDeleteNumber] = useState(false);
    const [editNumber] = useMutation(EDIT_PHONE_NUMBER);
    const [addNumber, { error: addNumberError }] =
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
        }

        if (existingNumber) {
            try {
                await editNumber({
                    variables: {
                        pk_columns: {
                            number: existingNumber,
                            contact_id: id,
                        },
                        new_phone_number: postData.number,
                    },
                });
                setEditMode(false);
            } catch {
                setError("number", {
                    type: "custom",
                    message: `Number already exists`,
                });
            }
        } else {
            try {
                await addNumber({
                    variables: {
                        contact_id: id,
                        phone_number: postData.number,
                    },
                });
                removePhone(index);
            } catch {
                setError("number", {
                    type: "custom",
                    message: `Number already exists`,
                });
            }
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
    // console.log(existingNumber, index);
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
                    data-testid="number"
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
                    <Button type="submit" data-testid="save">
                        <FaCheck />
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => {
                            setDeleteNumber(true);
                        }}
                        data-testid="delete"
                    >
                        <FaTrash />
                    </Button>
                    <Button onClick={() => cancelEdit()} data-testid="cancel">
                        <FaBan />
                    </Button>
                </ButtonContainer>
            ) : (
                onHover && (
                    <Button
                        data-testid="edit-number"
                        onClick={() => setEditMode(true)}
                    >
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
