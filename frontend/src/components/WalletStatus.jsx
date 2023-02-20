import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

const StyledWalletStatusDiv = styled.div`
    display: flex;
    gap: 20px;
`;

const ChainId = () => {
    const { chainId } = useWeb3React();
    return (
        <>
            <span>ChainId : </span>
            <span>{chainId}</span>
        </>
    );
};

const BlockNumber = () => {
    const { chainId, library } = useWeb3React();

    const [blockNumber, setBlockNumber] = useState();

    useEffect(() => {
        if (!library) return;

        let stale = false;
        async function getBlockNumber() {
            try {
                const blockNumber = await library.getBlockNumber();
                if (!stale) {
                    setBlockNumber(blockNumber);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getBlockNumber();

        library.on("block", getBlockNumber);

        return () => {
            stale = true;
            library.removeListener("block", getBlockNumber);
            setBlockNumber(undefined);
        };
    }, [library, chainId]);

    return (
        <>
            <span>Block Number : </span>
            <span>{blockNumber}</span>
        </>
    );
};
const Account = () => {
    const { account } = useWeb3React();

    return (
        <>
            <span>Account : </span>
            <span>
                {account
                    ? `${account.substring(0, 6)}...${account.substring(
                          account.length - 4
                      )}`
                    : ""}
            </span>
        </>
    );
};
const Balance = () => {
    const { account, library, chainId } = useWeb3React();
    const [balance, setBalance] = useState();

    let stale = false;
    useEffect(() => {
        if (typeof account === "undefined" || account === null || !library) {
            return;
        }
        async function getBalance() {
            try {
                const balance = await library.getBalance(account);
                if (!stale) {
                    setBalance(balance._hex);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getBalance();

        library.on("block", getBalance);

        return () => {
            stale = true;
            library.removeListener("block", getBalance);
            setBalance(undefined);
        };
    }, [account, library, chainId]);

    return (
        <>
            <span>Balance : </span>
            <span>
                {balance ? `${ethers.utils.formatEther(balance)} ETH` : ""}
            </span>
        </>
    );
};
const NextNonce = () => {
    const { account, library, chainId } = useWeb3React();
    const [nextNonce, setNextNonce] = useState();

    useEffect(() => {
        if (typeof account === "undefined" || account === null || !library) {
            return;
        }

        let stale = false;

        async function getNextNonce() {
            try {
                const nextNonce = await library.getTransactionCount(account);
                console.log(nextNonce);
                if (!stale) {
                    setNextNonce(nextNonce);
                }
            } catch (error) {}
        }

        getNextNonce();

        library.on("block", getNextNonce);

        return () => {
            stale = true;
            setNextNonce(undefined);
        };
    }, [account, library, chainId]);

    return (
        <>
            <span>NextNonce : </span>
            <span>{nextNonce ? nextNonce : ""}</span>
        </>
    );
};

export function WalletStatus() {
    return (
        <StyledWalletStatusDiv>
            <ChainId />
            <BlockNumber />
            <Account />
            <Balance />
            <NextNonce />
        </StyledWalletStatusDiv>
    );
}
