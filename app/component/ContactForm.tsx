import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ContactByPKDetail } from "../utils/ResponseType";
import styled from "@emotion/styled";
import { UPDATE_CONTACT } from "../utils/Request";

type ContactDetailType = {
    first_name: string;
    last_name: string;
};
const ContactForm: React.FC<{
    data?: ContactByPKDetail;
    editMode: boolean;
    setEditMode: any;
}> = ({ data, editMode, setEditMode }) => {
    const [updateContact] = useMutation(UPDATE_CONTACT);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactDetailType>({
        mode: "onBlur",
        defaultValues: {
            first_name: data?.first_name,
            last_name: data?.last_name,
        },
    });

    const onSubmit: SubmitHandler<ContactDetailType> = async (postData) => {
        const id = data?.id;
        await updateContact({
            variables: {
                id: id,
                _set: {
                    first_name: postData.first_name,
                    last_name: postData.last_name,
                },
            },
        });
        setEditMode(false);
    };

    const resetForm = () => {
        reset({
            first_name: data?.first_name,
            last_name: data?.last_name,
        });
        setEditMode(false);
    };
    return (
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Label>First Name</Label>
                <StyledInput
                    data-testid="first_name"
                    disabled={!editMode}
                    {...register("first_name", {
                        required: true,
                        pattern: /^[A-Za-z0-9\s]+$/,
                    })}
                />
                <div>
                    {errors.first_name &&
                        errors.first_name.type === "custom" && (
                            <ErrorSpan>{errors.first_name.message}</ErrorSpan>
                        )}
                    {errors.first_name &&
                        errors.first_name.type === "required" && (
                            <ErrorSpan>First Name is required</ErrorSpan>
                        )}
                    {errors.first_name &&
                        errors.first_name.type === "pattern" && (
                            <ErrorSpan>
                                Invalid character in first name
                            </ErrorSpan>
                        )}
                </div>
            </div>
            <div>
                <Label>Last Name</Label>
                <StyledInput
                    data-testid="last_name"
                    disabled={!editMode}
                    {...register("last_name", {
                        required: true,
                        pattern: /^[A-Za-z0-9\s]+$/,
                    })}
                />
                <div>
                    {errors.last_name && errors.last_name.type === "custom" && (
                        <ErrorSpan>{errors.last_name.message}</ErrorSpan>
                    )}
                    {errors.last_name &&
                        errors.last_name.type === "required" && (
                            <ErrorSpan>First Name is required</ErrorSpan>
                        )}
                    {errors.last_name &&
                        errors.last_name.type === "pattern" && (
                            <ErrorSpan>
                                Invalid character in last name
                            </ErrorSpan>
                        )}
                </div>
            </div>
            <ButtonContainer>
                {editMode && (
                    <Button data-testid="save-info" type="submit">
                        Save
                    </Button>
                )}
                {editMode && <Button onClick={resetForm}>Cancel</Button>}
            </ButtonContainer>
        </FormContainer>
    );
};

export default ContactForm;

const Label = styled.label`
    color: #969ea3;
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

const Button = styled.button`
    padding: 10px 20px;
    background-color: #52616b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #1e2022;
    }

    &:focus {
        box-shadow: 0 0 5px #1e2022;
    }
`;

const ErrorSpan = styled.span`
    color: red;
`;

const StyledInput = styled.input`
    color: white;
    width: 100%;
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
