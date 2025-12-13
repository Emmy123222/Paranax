"use client";

import React, { useState } from "react";
import {
    //Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
    Typography
} from "../../components/MaterialTailwind";
import { userContext } from "../../context/User";
import Button from "../../components/Button";
import { useWriteContract, useAccount, useConfig, useWatchContractEvent } from "wagmi";
import { POOS_FACTORY_CONRACT_ADDRESS } from "../../config";
import abi from "../../utils/abi";
import { toast } from "react-toastify";
import { updateUser } from "../../actions/auth";
import { getTransactionReceipt } from 'wagmi/actions'
import { getErrorMessage, retryWithBackoff, checkNetworkConnectivity } from "../../utils/rpcErrorHandler";



const DeployContractDialog = ({open, setOpen}) => {
    
    const { user, setUser } = React.useContext(userContext);
    const { writeContract, isPending, reset, data, } = useWriteContract()
    const { address, } = useAccount();
    const [confirming, setConfirming] = useState(false);
    const config = useConfig()

    // useWatchContractEvent({
    //     address: POOS_FACTORY_CONRACT_ADDRESS,
    //     abi,
    //     eventName: 'NewPOoSTokenCreated', 
    //     onLogs: async (logs)=> {
    //         console.log("logs:",logs)
    //       if (logs[0].args[2]===address) {
    //         //update user data with their smart contract 
    //         const payload = { contractAddress:logs[0].args[0] }
    //         const response = await updateUser(payload, user?._id);
    //         const result = await response.json();
    //         setUser(result?.singleUser);
    //         //setOpen(false)
    //         toast.success("Congratulations! Your contract has been deployed. You can now mint the digitalized token of your product on the blockchain")
    //         setOpen(false)
    //       }
    //     },
    //   })



    React.useEffect(() => {

        if (user && (!(user?.contractAddress) || user?.isFirstTimeLogin)) {
            setOpen(true)
        }
    }, [user])

    const handleOpen = () => setOpen(!open);

    const deployERC1155 = async () => {
        try {
            // Validate wallet connection
            if (!address) {
                toast.error("Please connect your wallet first");
                return;
            }

            // Validate contract address
            if (!POOS_FACTORY_CONRACT_ADDRESS) {
                toast.error("Contract address not configured");
                return;
            }

            // Check network connectivity
            const isNetworkAvailable = await checkNetworkConnectivity();
            if (!isNetworkAvailable) {
                toast.error("Network connection issue. Please check your internet connection and try again.");
                return;
            }

            // Use retry logic for the contract deployment
            await retryWithBackoff(async () => {
                return new Promise((resolve, reject) => {
                    writeContract(
                        {
                            abi,
                            address: POOS_FACTORY_CONRACT_ADDRESS,
                            functionName: 'createNewPOoS',
                            args: [
                                `${process.env.NEXT_PUBLIC_PROD_URL}product-verification/{id}`,
                            ],
                            // Add gas estimation for better transaction handling
                            gas: 500000n, // Set a reasonable gas limit
                        },
                        {
                            onSuccess: async (res, variable) => {
                                console.log("Transaction submitted:", res);
                                setConfirming(true);
                                
                                // Use retry logic for transaction receipt checking
                                try {
                                    await retryWithBackoff(async () => {
                                        const result = await getTransactionReceipt(config, {
                                            hash: res,
                                        });
                                        
                                        if (!result || !result.logs || result.logs.length === 0) {
                                            throw new Error("Transaction not yet confirmed");
                                        }
                                        
                                        return result;
                                    }, 15, 3000); // 15 retries with 3 second intervals
                                    
                                    // Get the final receipt
                                    const finalResult = await getTransactionReceipt(config, { hash: res });
                                    const contractAddress = finalResult.logs[0]?.address;
                                    
                                    if (contractAddress) {
                                        const payload = { contractAddress: contractAddress };
                                        const response = await updateUser(payload, user?._id);
                                        const updateResult = await response.json();
                                        
                                        if (response.ok) {
                                            setUser(updateResult?.singleUser);
                                            setConfirming(false);
                                            setOpen(false);
                                            toast.success("Congratulations! Your contract has been deployed successfully. You can now mint digital tokens for your products.");
                                            resolve(res);
                                        } else {
                                            throw new Error("Failed to update user with contract address");
                                        }
                                    } else {
                                        throw new Error("Contract address not found in transaction receipt");
                                    }
                                } catch (receiptError) {
                                    console.error("Receipt confirmation error:", receiptError);
                                    setConfirming(false);
                                    toast.error("Transaction submitted but confirmation failed. Please check your wallet for transaction status.");
                                    reject(receiptError);
                                }
                            },

                            onError: (err) => {
                                console.error("Contract deployment error:", err);
                                setConfirming(false);
                                
                                const errorMessage = getErrorMessage(err);
                                toast.error(errorMessage);
                                reject(err);
                            }
                        }
                    );
                });
            }, 3, 2000); // 3 retries with 2 second intervals

        } catch (error) {
            console.error("Deployment error:", error);
            setConfirming(false);
            
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    }


    return (
        <>

            <Dialog open={open} >
                <DialogHeader>Hello, {user?.name}</DialogHeader>
                <DialogBody>
                    {
                        isPending || confirming ?
                            <div className="flex flex-col items-center">
                                <Spinner color="#235789" className="h-10 w-10" />
                                <Typography className="mt-6 font-oxygen font-normal  text-center text-[16px] leading-[19px] md:text-[20px]  md:leading-[25px] text-[#474935]">
                                    {
                                        !confirming ? "Please wait, deployment process started" :
                                            "Deployment successful! Please wait for confirmation."
                                    }
                                </Typography>
                            </div> :
                            `Are you ready to embark on the journey of ensuring the authenticity of your
                        products across the supply chain? If so, we'd like to seek your permission
                        to assist you in deploying your product's digital token smart contract on
                        the blockchain as part of the onboarding process.`
                    }
                </DialogBody>
                <DialogFooter>
                    {
                        !confirming &&
                        <Button
                            variant="text"
                            onClick={!isPending ? handleOpen : () => reset()}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                    }
                    {
                        !isPending && !confirming &&
                        <Button variant="filled" color="#235789" onClick={deployERC1155}>
                            <span>Ok</span>
                        </Button>
                    }
                </DialogFooter>
            </Dialog>
        </>
    );
}


export default DeployContractDialog;
