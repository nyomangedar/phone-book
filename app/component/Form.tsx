import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { AddContactType, ContactByPKDetail } from "../utils/ResponseType";
import { useState } from "react";
import { FormSubmit } from "../utils/FormSubmit";

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
        }
    };
    const { fields, append, remove } = useFieldArray({
        control,
        name: "phones",
    });
    if (submitLoading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First Name</label>
                    <input
                        {...register("first_name", {
                            required: true,
                            pattern: /^[A-Za-z0-9]+$/,
                        })}
                    />
                    {errors.first_name &&
                        errors.first_name.type === "custom" && (
                            <span>{errors.first_name.message}</span>
                        )}
                    {errors.first_name &&
                        errors.first_name.type === "required" && (
                            <span>First Name is required</span>
                        )}
                    {errors.first_name &&
                        errors.first_name.type === "pattern" && (
                            <span>Invalid character in first name</span>
                        )}
                </div>
                <div>
                    <label>Last Name</label>
                    <input
                        {...register("last_name", {
                            required: true,
                            pattern: /^[A-Za-z0-9]+$/,
                        })}
                    />
                    {errors.last_name && errors.last_name.type === "custom" && (
                        <span>{errors.last_name.message}</span>
                    )}
                    {errors.last_name &&
                        errors.last_name.type === "required" && (
                            <span>First Name is required</span>
                        )}
                    {errors.last_name &&
                        errors.last_name.type === "pattern" && (
                            <span>Invalid character in last name</span>
                        )}
                </div>
                <div>
                    <label>Phones</label>
                    {fields.map((field: any, index: number) => (
                        <div key={field.id}>
                            <input
                                {...register(`phones.${index}.number`, {
                                    pattern: /^[0-9+]+$/,
                                })}
                            />
                            {errors.phones?.[index]?.number && (
                                <span>Invalid phone number</span>
                            )}
                            <button type="button" onClick={() => remove(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ number: "+62" })}
                    >
                        Add Phones
                    </button>
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

const CHECK_NAME_QUERY = gql`
    query GetContactList($where: contact_bool_exp) {
        contact(where: $where) {
            id
        }
    }
`;

const ADD_CONTACT = gql`
    mutation AddContactWithPhones(
        $first_name: String!
        $last_name: String!
        $phones: [phone_insert_input!]!
    ) {
        insert_contact(
            objects: {
                first_name: $first_name
                last_name: $last_name
                phones: { data: $phones }
            }
        ) {
            returning {
                id
            }
        }
    }
`;
export default Form;
