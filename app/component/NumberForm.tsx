import { useForm, SubmitHandler } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { ContactByPKDetail } from "../utils/ResponseType";
import { useState } from "react";

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
        <form
            onSubmit={handleSubmit(onSubmit)}
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
        >
            <div>
                <label>Mobile</label>
                <input
                    disabled={!editMode}
                    {...register("number", {
                        pattern: /^[0-9+]+$/,
                    })}
                />
                {errors.number && errors.number.type == "pattern" && (
                    <span>Invalid phone number</span>
                )}
                {errors.number && errors.number.type == "custom" && (
                    <span>Number already exists</span>
                )}
            </div>
            {editMode ? (
                <>
                    <button type="submit">Save</button>
                    <button
                        type="submit"
                        onClick={() => {
                            setDeleteNumber(true);
                        }}
                    >
                        Delete
                    </button>
                    <button onClick={() => cancelEdit()}>Reset</button>
                </>
            ) : (
                onHover && (
                    <button onClick={() => setEditMode(true)}>
                        Edit number
                    </button>
                )
            )}
        </form>
    );
};

export default NumberForm;

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
