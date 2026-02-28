const API_BASE_URL = 'http://localhost:3001/api';

export const fetchClothes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/clothes`);
        if (!response.ok) throw new Error('Failed to fetch wardrobe');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

export const fetchWardrobeStats = async () => {
    try {
        const data = await fetchClothes();
        return {
            totalItems: data.length,
        };
    } catch (error) {
        return { totalItems: 0 };
    }
};

export const fetchDailySuggestion = async () => {
    try {
        const outfits = await fetchOutfits();
        if (outfits.length > 0) {
            const latest = outfits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            return {
                name: latest.name,
                description: `Created on ${new Date(latest.createdAt).toLocaleDateString()}`,
                recommended: true
            };
        }
    } catch (error) { }

    return {
        name: 'No Outfits Yet',
        description: "Generate your first look in the Outfits tab!",
        recommended: false
    };
};

export const fetchLaundryStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/laundry`);
        const data = await response.json();
        const pendingCount = Array.isArray(data)
            ? data.filter(l => l.status === 'pending').reduce((acc, current) => acc + current.items.length, 0)
            : 0;
        return { pending: pendingCount };
    } catch (error) {
        return { pending: 0 };
    }
};

export const fetchLaundryItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/laundry`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

export const addClothesItem = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/clothes`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to add item');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const deleteClothesItem = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/clothes/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete item');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const updateClothesItem = async (id, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/clothes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update item');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const createLaundrySession = async (itemIds) => {
    try {
        const response = await fetch(`${API_BASE_URL}/laundry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemIds, status: 'pending' })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const updateLaundryStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/laundry/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchOutfits = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/outfits`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

export const generateOutfit = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/outfits/generate`, {
            method: 'POST'
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchAnalytics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/outfits/analytics`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};
