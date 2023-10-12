import { SubmitHandler } from "react-hook-form";
import { AddContactType, ContactByPKDetail } from "./ResponseType";
import { useLazyQuery, useMutation, gql } from "@apollo/client";

export const FormSubmit = async (
    postData: any,
    setLoading: any,
    setError: any,
    updateContact: any,
    addContact: any,
    checkName: any,
    contactData?: ContactByPKDetail
) => {
    if (contactData) {
        const id = contactData.id;
        const { data } = await updateContact({
            variables: {
                id: { id },
                _set: {
                    first_name: postData.first_name,
                    last_name: postData.last_name,
                    phones: postData.phones,
                },
            },
        });
    } else {
        console.log(postData);
        const { data } = await checkName({
            variables: {
                where: {
                    first_name: { _eq: postData.first_name },
                    last_name: { _eq: postData.last_name },
                },
            },
        });
        console.log({ data });
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
            const phoneNumbers = postData.phones.map((data) => ({
                number: data,
            }));
            const { data } = await addContact({
                variables: {
                    $where: {
                        first_name: postData.first_name,
                        last_name: postData.last_name,
                        phones: phoneNumbers,
                    },
                },
            });
        }
    }
};
