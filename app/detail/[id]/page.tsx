"use client";
import { ContactByPK, ContactByPKDetail } from "@/app/utils/ResponseType";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import styled from "@emotion/styled";

const DetailContact: React.FC<{ params: { id: number } }> = ({ params }) => {
    const id = params.id;
    const { loading, error, data } = useQuery(GET_DETAIL, {
        variables: { id },
    }) as { loading: boolean; error: any; data: ContactByPK };
    let content;
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        console.log(error);
        return <p>Error..</p>;
    }
    const contact: ContactByPKDetail = data.contact_by_pk;
    content = (
        <DetailContainer>
            <h2>
                {contact.first_name} {contact.last_name}
            </h2>
            {contact.phones.map((data) => (
                <span key={data.number}>{data.number}</span>
            ))}
            <div>
                <button>Edit Contact</button>
            </div>
        </DetailContainer>
    );

    return <div>{content}</div>;
};
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const GET_DETAIL = gql`
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

export default DetailContact;
