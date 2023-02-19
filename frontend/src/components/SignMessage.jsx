import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

export function SignMessage() {
    const { account, active, library } = useWeb3React();

    const handleSignMessage = (event) => {
        event.preventDefault();

        if (!library || !account) {
            window.alert("Wallet is no connected");
            return;
        }

        async function signMessage() {
            try {
                const signature = await library
                    .getSigner(account)
                    .signMessage("Hello wisysta");
                window.alert(`Success! ${signature}`);
            } catch (error) {
                console.error(error);
            }
        }

        signMessage();
    };

    return (
        <button disabled={!active ? true : false} onClick={handleSignMessage}>
            Sign Message
        </button>
    );
}
