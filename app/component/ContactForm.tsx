import { useForm, SubmitHandler } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { ContactByPKDetail } from "../utils/ResponseType";

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
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>First Name</label>
                <input
                    disabled={!editMode}
                    {...register("first_name", {
                        required: true,
                        pattern: /^[A-Za-z0-9]+$/,
                    })}
                />
                {errors.first_name && errors.first_name.type === "custom" && (
                    <span>{errors.first_name.message}</span>
                )}
                {errors.first_name && errors.first_name.type === "required" && (
                    <span>First Name is required</span>
                )}
                {errors.first_name && errors.first_name.type === "pattern" && (
                    <span>Invalid character in first name</span>
                )}
            </div>
            <div>
                <label>Last Name</label>
                <input
                    disabled={!editMode}
                    {...register("last_name", {
                        required: true,
                        pattern: /^[A-Za-z0-9]+$/,
                    })}
                />
                {errors.last_name && errors.last_name.type === "custom" && (
                    <span>{errors.last_name.message}</span>
                )}
                {errors.last_name && errors.last_name.type === "required" && (
                    <span>First Name is required</span>
                )}
                {errors.last_name && errors.last_name.type === "pattern" && (
                    <span>Invalid character in last name</span>
                )}
            </div>
            {editMode && <button type="submit">Save</button>}
        </form>
    );
};

export default ContactForm;

const UPDATE_CONTACT = gql`
    mutation EditContactById($id: Int!, $_set: contact_set_input) {
        update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
            id
            first_name
            last_name
            phones {
                number
            }
        }
    }
`;
