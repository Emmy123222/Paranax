'use client';

import React, { useState, useEffect } from 'react';
import { getCategories } from '../../actions/product';
import { Button, Spinner } from '../../components/MaterialTailwind';

/**
 * Simple test component to verify category loading functionality
 * This can be temporarily added to any page to test category fetching
 */
const CategoryTest = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testCategoryFetch = async () => {
        console.log('🧪 Testing category fetch...');
        setLoading(true);
        setError(null);
        
        try {
            const response = await getCategories();
            console.log('📡 Response status:', response.status);
            
            const result = await response.json();
            console.log('📦 Response data:', result);
            
            if (response.ok) {
                setCategories(result.categories || []);
                console.log('✅ Categories loaded:', result.categories?.length || 0);
            } else {
                setError(result.message || 'Failed to load categories');
                console.error('❌ Error:', result);
            }
        } catch (err) {
            setError(err.message);
            console.error('💥 Exception:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-test on component mount
        testCategoryFetch();
    }, []);

    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Category Test Component</h3>
            
            <div className="flex gap-2 mb-4">
                <Button 
                    onClick={testCategoryFetch} 
                    disabled={loading}
                    size="sm"
                >
                    {loading ? <Spinner className="h-4 w-4" /> : 'Test Category Fetch'}
                </Button>
                
                <Button 
                    variant="outlined"
                    onClick={() => {
                        setCategories([]);
                        setError(null);
                    }}
                    size="sm"
                >
                    Clear
                </Button>
            </div>

            {/* Status */}
            <div className="mb-4">
                <div className="text-sm">
                    <strong>Status:</strong> {loading ? 'Loading...' : error ? 'Error' : 'Ready'}
                </div>
                <div className="text-sm">
                    <strong>Categories Count:</strong> {categories.length}
                </div>
                <div className="text-sm">
                    <strong>Auth Token:</strong> {localStorage.getItem('_poostoken_') ? 'Present' : 'Missing'}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Categories List */}
            {categories.length > 0 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded">
                    <strong>Categories:</strong>
                    <ul className="mt-2 list-disc list-inside">
                        {categories.map(category => (
                            <li key={category._id} className="text-sm">
                                {category.name} (ID: {category._id})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 text-xs text-gray-600">
                <p><strong>Instructions:</strong></p>
                <ul className="list-disc list-inside mt-1">
                    <li>This component tests category fetching functionality</li>
                    <li>Check browser console for detailed logs</li>
                    <li>Ensure you&apos;re logged in before testing</li>
                    <li>Remove this component after testing</li>
                </ul>
            </div>
        </div>
    );
};

export default CategoryTest;