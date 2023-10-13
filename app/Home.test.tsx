import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import userEvent from "@testing-library/user-event";

import Home from "./page";

const GET_CONTACT = gql`
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

const MOCKS = [
    {
        request: {
            query: GET_CONTACT,
        },
        result: {
            data: {
                contact: [
                    {
                        created_at: "0-0-1999",
                        first_name: "John",
                        id: 1,
                        last_name: "Doe",
                        phones: [
                            {
                                number: "+62123123",
                            },
                        ],
                    },
                ],
            },
        },
    },
];

describe("Home Contact list inference", () => {
    it("test contact list", async () => {
        render(
            <MockedProvider mocks={MOCKS}>
                <Home />
            </MockedProvider>
        );
        expect(await screen.findByText("John Doe")).toBeInTheDocument();

        const button = screen.getByTestId("card-title-1");
        await userEvent.click(button);

        expect(await screen.findByText("+62123123")).toBeInTheDocument();
    });
});
