"use client";
import { gql } from "@apollo/client";
import Form from "@/app/component/Form";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const UpdateContact: React.FC<{ params: { id: number } }> = ({ params }) => {
    const id = params.id;
    const { loading, data, error } = useQuery(GET_DETAIL, {
        variables: { id },
    });

    if (loading) {
        return <p>Loading...</p>;
    }

    return <Form data={data.contact_by_pk} />;
};

const GET_DETAIL = gql`
    query GetContactDetail($id: Int!) {
        contact_by_pk(id: $id) {
            id
            last_name
            first_name
            phones {
                number
            }
        }
    }
`;
export default UpdateContact;
