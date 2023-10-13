import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import {
    GET_DETAIL,
    UPDATE_CONTACT,
    EDIT_PHONE_NUMBER,
    ADD_PHONE_NUMBER,
    DELETE_PHONE_NUMBER,
} from "@/app/utils/Request";

import DetailContact from "./page";

const update_var = {
    first_name: "Doe",
    last_name: "John",
    number: "+62331331",
};

const MOCKS = [
    {
        request: {
            query: GET_DETAIL,
            variables: {
                id: 1,
            },
        },
        result: {
            data: {
                contact_by_pk: {
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
            },
        },
    },
    {
        request: {
            query: UPDATE_CONTACT,
            variables: {
                id: 1,
                _set: {
                    first_name: update_var.first_name,
                    last_name: update_var.last_name,
                },
            },
        },
        result: {
            data: {
                update_contact_by_pk: {
                    id: 1,
                    first_name: "Doe",
                    last_name: "John",
                    phones: [
                        {
                            number: "+62123123",
                        },
                    ],
                },
            },
        },
    },
    {
        request: {
            query: EDIT_PHONE_NUMBER,
            variables: {
                pk_columns: {
                    number: "+62123123",
                    contact_id: 1,
                },
                new_phone_number: update_var.number,
            },
        },
    },
    {
        request: {
            query: ADD_PHONE_NUMBER,
            variables: {
                contact_id: 1,
                phone_number: update_var.number,
            },
        },
    },
    {
        request: {
            query: DELETE_PHONE_NUMBER,
            variables: {
                contact_id: 1,
                phone_number: "+62123123",
            },
        },
    },
];

const id = {
    id: 1,
};

describe("Detail Info Inference test", () => {
    it("test detail info", async () => {
        render(
            <MockedProvider mocks={MOCKS}>
                <DetailContact params={id} />
            </MockedProvider>
        );
        expect(await screen.findByText("First Name")).toBeInTheDocument();
        const inputFirstName = screen.getByTestId("first_name");
        expect(inputFirstName.value).toBe("John");

        const inputLastName = screen.getByTestId("last_name");
        expect(inputLastName.value).toBe("Doe");

        const inputNumber = screen.getByTestId("number");
        expect(inputNumber.value).toBe("+62123123");
    });

    it("test chaning info", async () => {
        render(
            <MockedProvider mocks={MOCKS}>
                <DetailContact params={id} />
            </MockedProvider>
        );
        expect(await screen.findByText("First Name")).toBeInTheDocument();

        const editInfoButton = screen.getByTestId("edit-info");
        await userEvent.click(editInfoButton);

        const inputFirstName = screen.getByTestId("first_name");
        fireEvent.input(inputFirstName, {
            target: {
                value: update_var.first_name,
            },
        });

        const inputLastName = screen.getByTestId("last_name");
        fireEvent.input(inputLastName, {
            target: {
                value: update_var.last_name,
            },
        });

        const saveInfo = screen.getByTestId("save-info");
        await userEvent.click(saveInfo);

        expect(inputFirstName.value).toBe("Doe");
        expect(inputLastName.value).toBe("John");
    });

    it("test changing number", async () => {
        render(
            <MockedProvider mocks={MOCKS}>
                <DetailContact params={id} />
            </MockedProvider>
        );
        expect(await screen.findByText("First Name")).toBeInTheDocument();

        const inputNumber = screen.getByTestId("number");
        fireEvent.mouseEnter(inputNumber);

        const buttonEdit = screen.getByTestId("edit-number");
        await userEvent.click(buttonEdit);

        fireEvent.input(inputNumber, {
            target: {
                value: "+62331331",
            },
        });

        const saveEdit = screen.getByTestId("save");
        await userEvent.click(saveEdit);

        expect(inputNumber.value).toBe("+62331331");
    });

    it("test deleting number", async () => {
        render(
            <MockedProvider mocks={MOCKS}>
                <DetailContact params={id} />
            </MockedProvider>
        );
        expect(await screen.findByText("First Name")).toBeInTheDocument();

        const inputNumber = screen.getByTestId("number");
        fireEvent.mouseEnter(inputNumber);

        const buttonEdit = screen.getByTestId("edit-number");
        await userEvent.click(buttonEdit);

        const deleteNumber = screen.getByTestId("delete");
        fireEvent.click(deleteNumber);

        expect(screen.queryByText("+62123123")).toBeNull();
    });
});
