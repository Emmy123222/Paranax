# Blockchain Transaction Error Troubleshooting Guide

## Overview
This guide addresses the "Internal JSON-RPC error" and other blockchain transaction issues encountered in the Genun application.

## Error Analysis

### Primary Error
```
Error TransactionExecutionError: An internal error was received.
Request Arguments:
from: 0x21384CDe50cF0BC2d7A3B5ee8abd19ccaeb50EEF
to: 0x65235cfc2d6b8cfd7c6dafd28d8da51853f39f3a
data: 0x156e29f600000000000000000000000021384cde50cf0bc2d7a3b5ee8abd19ccaeb50eef000000000000000000000000000000000000000000000000003eb9de9868c5f00000000000000000000000000000000000000000000000000000000000002710
Details: Internal JSON-RPC error.
```

### Root Causes
1. **RPC Endpoint Issues**: Network congestion or provider limitations
2. **Gas Estimation Problems**: Insufficient gas or incorrect gas calculations
3. **Contract State Issues**: Contract may be paused or have restrictions
4. **Network Connectivity**: Unstable internet connection
5. **Wallet Configuration**: Incorrect network or insufficient funds

## Solutions Implemented

### 1. Enhanced RPC Configuration (`config.js`)
```javascript
// Improved transport configuration
transports: {
    [baseSepolia.id]: http('https://sepolia.base.org', {
        batch: false, // Disable batching to avoid RPC issues
        fetchOptions: {
            timeout: 30000, // Increased timeout
        },
        retryCount: 5, // More retries
        retryDelay: 2000, // Longer delay between retries
    })
}
```

### 2. Error Handling Utilities (`rpcErrorHandler.js`)
- **Error Classification**: Identifies different types of blockchain errors
- **Retry Logic**: Implements exponential backoff for failed transactions
- **Network Connectivity**: Checks RPC endpoint availability
- **User-Friendly Messages**: Converts technical errors to readable messages

### 3. Enhanced Contract Deployment (`DeployContractDialog.jsx`)
- **Pre-flight Checks**: Validates wallet connection and network status
- **Retry Mechanism**: Automatically retries failed transactions
- **Better Gas Handling**: Sets appropriate gas limits
- **Improved Confirmation**: Robust transaction receipt checking

### 4. Network Status Monitoring (`NetworkStatus.jsx`)
- **Real-time Status**: Shows current network connection status
- **Network Validation**: Ensures correct network (Base Sepolia)
- **Visual Indicators**: Color-coded status indicators
- **Manual Retry**: Allows users to manually check network status

## Troubleshooting Steps

### For Users Experiencing Transaction Errors:

#### Step 1: Check Network Status
- Look for the network status indicator in the bottom-right corner
- Ensure you're connected to Base Sepolia (Chain ID: 84532)
- If status shows "disconnected" or "error", click "Retry"

#### Step 2: Verify Wallet Configuration
- Ensure wallet is connected and unlocked
- Check that you have sufficient ETH for gas fees
- Verify you're on the correct network (Base Sepolia)

#### Step 3: Clear Browser Cache
- Clear browser cache and cookies
- Refresh the page and reconnect wallet
- Try using an incognito/private browsing window

#### Step 4: Try Different RPC Endpoint
- If issues persist, the problem may be with the RPC provider
- Wait a few minutes and try again
- Contact support if errors continue

### For Developers:

#### Debug Mode
Enable console logging to see detailed error information:
```javascript
console.log("Transaction error details:", error);
console.log("Error type:", getErrorMessage(error));
```

#### Manual RPC Testing
Test RPC connectivity directly:
```javascript
import { checkNetworkConnectivity } from './utils/rpcErrorHandler';

const testNetwork = async () => {
    const isConnected = await checkNetworkConnectivity();
    console.log('Network status:', isConnected);
};
```

#### Gas Estimation Testing
Test gas estimation for contract functions:
```javascript
import { estimateGasWithFallback } from './utils/rpcErrorHandler';

const testGasEstimation = async () => {
    try {
        const gasLimit = await estimateGasWithFallback(contract, 'createNewPOoS', [uri]);
        console.log('Estimated gas:', gasLimit.toString());
    } catch (error) {
        console.error('Gas estimation failed:', error);
    }
};
```

## Error Types and Solutions

### 1. Internal JSON-RPC Error
**Cause**: RPC provider issues or network congestion
**Solution**: 
- Automatic retry with exponential backoff
- Fallback to alternative RPC endpoints
- Increased timeout values

### 2. Insufficient Funds for Gas
**Cause**: Not enough ETH in wallet for transaction fees
**Solution**:
- Clear error message asking user to add funds
- Gas estimation with buffer to prevent underestimation
- Display estimated gas costs before transaction

### 3. User Rejected Transaction
**Cause**: User cancelled transaction in wallet
**Solution**:
- Detect rejection and show appropriate message
- Don't retry automatically for user rejections
- Allow user to restart process manually

### 4. Execution Reverted
**Cause**: Smart contract logic prevented execution
**Solution**:
- Check contract state and parameters
- Validate input parameters before sending
- Provide specific error messages based on revert reason

### 5. Network Mismatch
**Cause**: Wallet connected to wrong network
**Solution**:
- Detect current network and show warning
- Provide instructions to switch networks
- Prevent transactions on wrong networks

## Monitoring and Alerts

### Real-time Monitoring
- Network status component shows live connection status
- Automatic retry mechanisms for transient failures
- User-friendly error messages with actionable advice

### Error Logging
- All blockchain errors are logged with context
- Error classification for better debugging
- User actions and error patterns tracked

## Prevention Strategies

### 1. Robust Error Handling
- Comprehensive error classification
- Graceful degradation for network issues
- Clear user communication about problems

### 2. Network Resilience
- Multiple RPC endpoint fallbacks
- Automatic retry with backoff
- Connection health monitoring

### 3. User Experience
- Clear status indicators
- Helpful error messages
- Manual retry options

### 4. Testing
- Regular RPC endpoint health checks
- Gas estimation validation
- Error scenario testing

## Future Improvements

### 1. Advanced RPC Management
- Dynamic RPC endpoint switching
- Load balancing across multiple providers
- Performance monitoring and optimization

### 2. Enhanced Error Recovery
- Automatic transaction resubmission
- Smart gas price adjustment
- Transaction queue management

### 3. User Education
- In-app tutorials for common issues
- Contextual help for error scenarios
- Best practices guidance

## Support Resources

### For Users
- Check network status indicator
- Ensure sufficient wallet funds
- Try refreshing and reconnecting wallet
- Contact support with error details

### For Developers
- Review error logs and classifications
- Test with different RPC endpoints
- Monitor gas estimation accuracy
- Implement additional fallback mechanisms

## Conclusion
The implemented solutions provide robust error handling and recovery mechanisms for blockchain transaction issues. The combination of improved RPC configuration, comprehensive error handling, retry logic, and user-friendly status indicators significantly reduces the impact of network-related transaction failures.