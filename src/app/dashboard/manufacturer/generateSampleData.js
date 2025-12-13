import { subHours, subDays, subMinutes } from 'date-fns';

/**
 * Generate sample authentication data for testing the RealTimeAuthChart
 * @param {number} count - Number of sample authentications to generate
 * @returns {Array} Array of sample authentication objects
 */
export const generateSampleAuthData = (count = 50) => {
  const sampleData = [];
  const now = new Date();
  
  // Sample product names
  const products = [
    'Coca Cola', 'Pepsi', 'Sprite', 'Fanta', 'Mountain Dew',
    'iPhone 15', 'Samsung Galaxy', 'MacBook Pro', 'Dell Laptop',
    'Nike Air Max', 'Adidas Ultraboost', 'Puma Sneakers',
    'Rolex Watch', 'Apple Watch', 'Casio G-Shock'
  ];
  
  // Sample requester addresses (mock wallet addresses)
  const requesters = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    '0x9876543210fedcba9876543210fedcba98765432',
    '0xfedcba0987654321fedcba0987654321fedcba09',
    '0x5555666677778888999900001111222233334444'
  ];

  for (let i = 0; i < count; i++) {
    // Generate random time within the last 30 days
    const hoursAgo = Math.random() * 24 * 30; // 0 to 30 days ago
    const createdAt = subHours(now, hoursAgo);
    
    // 80% success rate for realistic data
    const status = Math.random() < 0.8 ? 'passed' : 'failed';
    
    const auth = {
      id: `auth_${i + 1}`,
      product: products[Math.floor(Math.random() * products.length)],
      productId: `PRD_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      requester: requesters[Math.floor(Math.random() * requesters.length)],
      status: status,
      createdAt: createdAt.toISOString(),
      // Additional fields that might be useful
      verificationMethod: Math.random() < 0.5 ? 'QR_CODE' : 'NFC',
      location: ['New York', 'London', 'Tokyo', 'Berlin', 'Sydney'][Math.floor(Math.random() * 5)],
      deviceType: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)]
    };
    
    sampleData.push(auth);
  }
  
  // Sort by creation date (newest first)
  return sampleData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Generate real-time sample data (for demo purposes)
 * This simulates new authentications coming in
 */
export const generateRealtimeAuthData = () => {
  const now = new Date();
  const products = ['Coca Cola', 'iPhone 15', 'Nike Air Max', 'Rolex Watch'];
  const requesters = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12'
  ];
  
  return {
    id: `auth_${Date.now()}`,
    product: products[Math.floor(Math.random() * products.length)],
    productId: `PRD_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    requester: requesters[Math.floor(Math.random() * requesters.length)],
    status: Math.random() < 0.85 ? 'passed' : 'failed',
    createdAt: now.toISOString(),
    verificationMethod: Math.random() < 0.5 ? 'QR_CODE' : 'NFC',
    location: ['New York', 'London', 'Tokyo'][Math.floor(Math.random() * 3)],
    deviceType: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)]
  };
};