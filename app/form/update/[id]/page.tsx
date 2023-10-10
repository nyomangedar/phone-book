import { gql } from "@apollo/client";

const UpdateContact: React.FC<{ params: { id: number } }> = ({ params }) => {
    return <></>;
};

const UPDATE_CONTACT = gql`
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
export default UpdateContact;
