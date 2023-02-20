import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import GreetingArtifact from "../artifacts/contracts/Greeting.sol/Greeting.json";

const StyledDeployContractButton = styled.button`
    width: 180px;
    height: 2rem;
    border-radius: 1rem;
    border-color: blue;
    cursor: pointer;
    place-self: center;
`;

const StyledGreetingDiv = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const StyledLabel = styled.label`
    font-weight: bold;
`;

export function ContractCall() {
    const { active, library } = useWeb3React();

    const [signer, setSigner] = useState();
    const [greeting, setGreeting] = useState();
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState();

    useEffect(() => {
        if (!library) {
            setSigner(undefined);
            return;
        }
        setSigner(library.getSigner());
    }, [library]);

    // useEffect(() => {
    //     if (!greetingContract) return;

    //     async function getGreeting(greetingContract) {
    //         const _greeting = await greetingContract.getFunction("greet").name;

    //         if

    //         setGreeting(_greeting);
    //     }

    //     getGreeting(greetingContract);
    // }, []);

    const handleDeployContract = (event) => {
        event.preventDefault();

        if (greetingContract) {
            return;
        }

        async function deployGreetingContract() {
            const Greeting = new ethers.ContractFactory(
                GreetingArtifact.abi,
                GreetingArtifact.bytecode,
                signer
            );
            try {
                const greetingContract = await Greeting.deploy("Hello wisysta");
                await greetingContract.waitForDeployment();

                const greet = greetingContract.getFunction("greet");

                console.log(await greet());
                // console.log(await greet.staticCallResult("Hello wisysta"));

                const address = await greetingContract.getAddress();

                setGreetingContract(greetingContract);
                setGreeting(greeting);
                setGreetingContractAddr(address);
                window.alert(`Greeting deployed to : ${address}`);
            } catch (error) {
                console.log(error);
                window.alert(
                    "Error: ",
                    error && error.message ? `${error.message}` : ""
                );
            }
        }
        deployGreetingContract();
    };

    return (
        <>
            <StyledDeployContractButton
                disabled={!active || greetingContract ? true : false}
                onClick={handleDeployContract}
            >
                Deploy Greeting Contract
            </StyledDeployContractButton>
            <StyledGreetingDiv>
                <StyledLabel>Contract address</StyledLabel>
                <StyledLabel>
                    {greetingContractAddr ? (
                        greetingContractAddr
                    ) : (
                        <>'Contract not yet deployed'</>
                    )}
                </StyledLabel>
            </StyledGreetingDiv>
            <StyledGreetingDiv>
                <StyledLabel>Greeting</StyledLabel>
                <StyledLabel>
                    {greeting ? greeting : <>'Contract not yet deployed'</>}
                </StyledLabel>
            </StyledGreetingDiv>
        </>
    );
}
