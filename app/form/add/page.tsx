"use client";

import { AddContactType } from "@/app/utils/ResponseType";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useState } from "react";

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

const AddContact = () => {
    const [submitLoading, setLoading] = useState(false);
    const [checkName] = useLazyQuery(CHECK_NAME_QUERY);
    const [addContact] = useMutation(ADD_CONTACT);
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<AddContactType>();
    const onSubmit: SubmitHandler<AddContactType> = async (postData) => {
        setLoading(true);
        const { data: existData } = await checkName({
            variables: {
                where: {
                    first_name: { _eq: postData.first_name },
                    last_name: { _eq: postData.last_name },
                },
            },
        });
        console.log({ existData });
        if (existData.contact.length > 0) {
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
            const phoneNumbers = postData.phones.map((data) => ({
                number: data,
            }));
            const { data } = await addContact({
                variables: {
                    first_name: postData.first_name,
                    last_name: postData.last_name,
                    phones: phoneNumbers,
                },
            });
            setLoading(false);
            console.log(data);
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
                    <input {...register("first_name", { required: true })} />
                    {errors.first_name && (
                        <span>{errors.first_name.message}</span>
                    )}
                </div>
                <div>
                    <label>Last Name</label>
                    <input {...register("last_name", { required: true })} />
                    {errors.last_name && (
                        <span>{errors.last_name.message}</span>
                    )}
                </div>
                <div>
                    <label>Phones</label>
                    {fields.map((field: any, index: number) => (
                        <div key={field.id}>
                            <input
                                {...register(`phones.${index}`)}
                                type="number"
                            />
                            <button type="button" onClick={() => remove(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ number: 0 })}>
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

export default AddContact;
