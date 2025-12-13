const formatWalletAddres = (address) => {
    const slicedAddr = address;
    const leftContent = slicedAddr.slice(0, 10);
    const rightContent = slicedAddr.slice(-4);
    
    return leftContent + "..." + rightContent;

}

export default formatWalletAddres;
