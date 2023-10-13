import { gql } from "@apollo/client";
export const GET_DETAIL = gql`
    query GetContactDetail($id: Int!) {
        contact_by_pk(id: $id) {
            last_name
            id
            first_name
            created_at
            phones {
                number
            }
        }
    }
`;

export const DELETE_CONTACT = gql`
    mutation MyMutation($id: Int!) {
        delete_contact_by_pk(id: $id) {
            first_name
            last_name
            id
        }
    }
`;

export const GET_CONTACT = gql`
    query GetContactList(
        $distinct_on: [contact_select_column!]
        $limit: Int
        $offset: Int
        $order_by: [contact_order_by!]
        $where: contact_bool_exp
    ) {
        contact(
            distinct_on: $distinct_on
            limit: $limit
            offset: $offset
            order_by: $order_by
            where: $where
        ) {
            created_at
            first_name
            id
            last_name
            phones {
                number
            }
        }
    }
`;

export const UPDATE_CONTACT = gql`
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

export const ADD_PHONE_NUMBER = gql`
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

export const DELETE_PHONE_NUMBER = gql`
    mutation DeletePhoneByPK($contact_id: Int!, $number: String!) {
        delete_phone_by_pk(contact_id: $contact_id, number: $number) {
            contact_id
            created_ad
            id
            number
        }
    }
`;
