export const getSettings = async () => {
    return {
        storeName: "Vellore Sweets",
        email: "admin@velloresweets.com",
        currency: "INR",
        taxRate: 5
    };
};

export const updateSettingsService = async (newSettings) => {
    return newSettings;
};

