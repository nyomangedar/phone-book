import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AddContactType, ContactByPKDetail } from "../utils/ResponseType";
import { useState } from "react";
import styled from "@emotion/styled";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CHECK_NAME_QUERY, ADD_CONTACT } from "../utils/Request";

const Form: React.FC<{
    data?: ContactByPKDetail;
}> = ({ data }) => {
    const [submitLoading, setLoading] = useState(false);
    const [checkName] = useLazyQuery(CHECK_NAME_QUERY);
    const [addContact] = useMutation(ADD_CONTACT);
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<AddContactType>({
        mode: "onBlur",
        defaultValues: {
            first_name: data?.first_name,
            last_name: data?.last_name,
            phones: data?.phones,
        },
    });
    const router = useRouter();

    const onSubmit: SubmitHandler<AddContactType> = async (postData) => {
        const { data } = await checkName({
            variables: {
                where: {
                    first_name: { _eq: postData.first_name },
                    last_name: { _eq: postData.last_name },
                },
            },
        });
        if (data.contact.length > 0) {
            setLoading(false);
            setError("first_name", {
                type: "custom",
                message: "name already exist",
            });
            setError("last_name", {
                type: "custom",
                message: "name already exist",
            });
        } else {
            const { data } = await addContact({
                variables: {
                    first_name: postData.first_name,
                    last_name: postData.last_name,
                    phones: postData.phones,
                },
            });
            setLoading(false);
            router.push(`/detail/${data.insert_contact.returning[0].id}`);
        }
    };
    const { fields, append, remove } = useFieldArray({
        control,
        name: "phones",
        rules: {
            minLength: 1,
        },
    });
    if (submitLoading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <InputContainer>
                    <div>
                        <label>First Name:</label>
                        <StyledInput
                            {...register("first_name", {
                                required: true,
                                pattern: /^[A-Za-z0-9]+$/,
                            })}
                        />
                        {errors.first_name &&
                            errors.first_name.type === "custom" && (
                                <span style={{ color: "red" }}>
                                    {errors.first_name.message}
                                </span>
                            )}
                        {errors.first_name &&
                            errors.first_name.type === "required" && (
                                <span style={{ color: "red" }}>
                                    First Name is required
                                </span>
                            )}
                        {errors.first_name &&
                            errors.first_name.type === "pattern" && (
                                <span style={{ color: "red" }}>
                                    Invalid character in first name
                                </span>
                            )}
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <StyledInput
                            {...register("last_name", {
                                required: true,
                                pattern: /^[A-Za-z0-9]+$/,
                            })}
                        />
                        {errors.last_name &&
                            errors.last_name.type === "custom" && (
                                <span style={{ color: "red" }}>
                                    {errors.last_name.message}
                                </span>
                            )}
                        {errors.last_name &&
                            errors.last_name.type === "required" && (
                                <span style={{ color: "red" }}>
                                    First Name is required
                                </span>
                            )}
                        {errors.last_name &&
                            errors.last_name.type === "pattern" && (
                                <span style={{ color: "red" }}>
                                    Invalid character in last name
                                </span>
                            )}
                    </div>
                </InputContainer>

                <InputContainer>
                    <label>Phones</label>
                    {fields.map((field: any, index: number) => (
                        <div
                            style={{
                                display: "flex",
                            }}
                            key={field.id}
                        >
                            <div>
                                <StyledInput
                                    style={{ width: "11em" }}
                                    {...register(`phones.${index}.number`, {
                                        pattern: /^[0-9+]+$/,
                                    })}
                                />
                                {errors.phones?.[index]?.number && (
                                    <span style={{ color: "red" }}>
                                        Invalid phone number
                                    </span>
                                )}
                            </div>

                            <IconButton
                                type="button"
                                onClick={() => remove(index)}
                            >
                                <FaTimes size={20} />
                            </IconButton>
                        </div>
                    ))}
                    <IconButton
                        type="button"
                        onClick={() => append({ number: "+62" })}
                    >
                        <FaPlus /> Add Phones
                    </IconButton>
                </InputContainer>
                <IconButton style={{ fontSize: "20px" }} type="submit">
                    <FaSave size={20} /> Save
                </IconButton>
            </FormContainer>
        </div>
    );
};

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1em;
`;
const InputContainer = styled.div`
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #374147;
    padding: 1em;
`;

const StyledInput = styled.input`
    border-radius: 8px;
    color: white;
    font-size: 20px;
    padding: 10px;
    background-color: transparent;
    transition: border-color 0.3s;
    border: white solid 1px;

    &:focus {
        border: trasnparent;
    }

    &:disabled {
        color: white;
        background-color: transparent;
        border-bottom: transparent;
    }
`;

const IconButton = styled.button`
    background-color: transparent;
    border: transparent;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

export default Form;
