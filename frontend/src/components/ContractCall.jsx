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

const StyledInput = styled.input`
    padding: 0.4rem 0.6rem;
`;

const styledButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: blue;
    cursor: pointer;
`;

export function ContractCall() {
    const { active, library } = useWeb3React();

    const [signer, setSigner] = useState();
    const [greeting, setGreeting] = useState();
    const [greetingContract, setGreetingContract] = useState("");
    const [greetingContractAddr, setGreetingContractAddr] = useState("");
    const [greetingInput, setGreetingInput] = useState("");

    useEffect(() => {
        if (!library) {
            setSigner(undefined);
            return;
        }
        setSigner(library.getSigner());
    }, [library]);

    useEffect(() => {
        if (!greetingContract) return;

        async function getGreeting(greetingContract) {
            const _greeting = await greetingContract.greet();

            if (_greeting !== greeting) {
                setGreeting(_greeting);
            }
        }

        getGreeting(greetingContract);
    }, [greetingContract, greeting]);

    const handleGreetingChange = (event) => {
        event.preventDefault();
        setGreetingInput(event.target.value);
    };

    const handleGreetingSubmit = (event) => {
        event.preventDefault();
        if (!greetingContract) {
            window.alert("Undefined greeting Contract");
            return;
        }
        if (!greetingInput) {
            window.alert("Greeting cannot be empty");
            return;
        }

        async function submitGreeing(greetingContract) {
            try {
                const setGreetingTxn = await greetingContract.setGreeting(
                    greetingInput
                );
                await setGreetingTxn.wait();

                const newGreeting = await greetingContract.greet();
                window.alert(`Success : ${newGreeting}`);

                if (newGreeting !== greeting) {
                    setGreeting(newGreeting);
                }
            } catch (error) {
                window.alert(
                    "Error: ",
                    error && error.message ? `${error.message}` : ""
                );
            }
        }

        submitGreeing(greetingContract);
    };

    const handleDeployContract = (event) => {
        event.preventDefault();

        if (greetingContract) {
            return;
        }

        async function deployGreetingContract() {
            const Greeting = new ethers.ContractFactory(
                GreetingArtifact.abi,
                GreetingArtifact.bytecode
            ).connect(signer);
            try {
                const greetingContract = await Greeting.deploy(
                    "Hello~ good morning everybody"
                );

                await greetingContract.deployed();

                const greeting = await greetingContract.greet();
                const address = greetingContract.address;

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
            <StyledGreetingDiv>
                <StyledLabel>Set new Greeting</StyledLabel>
                <input
                    id="greetingInput"
                    type="text"
                    placeholder={greeting ? "" : "Contract not yed deployed"}
                    onChange={handleGreetingChange}
                />
                <button
                    disabled={!active || !greetingContract ? true : false}
                    onClick={handleGreetingSubmit}
                >
                    Submit
                </button>
            </StyledGreetingDiv>
        </>
    );
}
