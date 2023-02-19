import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useState } from "react";
import { injected } from "../utils/connectors";
import { useInactiveListener, useWeb3Connect } from "../utils/hooks";
import styled from "styled-components";
import {
    NoEthereumProviderError,
    UserRejectedRequestError,
} from "@web3-react/injected-connector";

const StyledActivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: green;
    cursor: pointer;
`;

const StyledDeactivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: green;
    cursor: pointer;
`;

const Activate = () => {
    const context = useWeb3React();
    const { activate, active } = context;
    const [activating, setActivating] = useState(false);

    const handleActivate = (event) => {
        event.preventDefault();

        async function _activate() {
            setActivating(true);
            await activate(injected);
            setActivating(false);
        }
        _activate();
    };
    const eagerConnectionSuccessful = useWeb3Connect();
    useInactiveListener(!eagerConnectionSuccessful);

    return (
        <StyledActivateButton
            style={{
                borderColor: activating ? "orange" : active ? "unset" : "green",
            }}
            disable={active}
            onClick={handleActivate}
        >
            Connect
        </StyledActivateButton>
    );
};

const Deactivate = () => {
    const context = useWeb3React();
    const { deactivate, active } = context;

    const handleDeactivate = (event) => {
        event.preventDefault();
        deactivate();
    };

    return (
        <StyledDeactivateButton
            style={{
                borderColor: active ? "red" : "unset",
            }}
            disable={!active}
            onClick={handleDeactivate}
        >
            Disconnect
        </StyledDeactivateButton>
    );
};

function getErrorMessage(error) {
    let errorMessage;

    switch (error.constructor) {
        case NoEthereumProviderError:
            errorMessage = "NoEthereumProviderError";
            break;
        case UnsupportedChainIdError:
            errorMessage = "UnsupportedChainIdError";
            break;
        case UserRejectedRequestError:
            errorMessage = "UserRejectedRequestError";
            break;
        default:
            errorMessage = error.message;
    }

    return errorMessage;
}

export function Connect() {
    const { error } = useWeb3React();

    if (error) {
        window.alert(getErrorMessage(error));
    }

    return (
        <>
            <Activate />
            <Deactivate />
        </>
    );
}
