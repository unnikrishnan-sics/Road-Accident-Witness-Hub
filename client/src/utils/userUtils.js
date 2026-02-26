/**
 * Formats a user's display name for the header.
 * @param {Object} user - The user object from localStorage or API.
 * @returns {string} - The formatted display name.
 */
export const formatDisplayName = (user) => {
    if (!user) return 'Guest';

    // If name exists, format it to Title Case
    if (user.name) {
        return user.name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    // Fallback: If no name, use role-based friendly name
    const roleMap = {
        'admin': 'Administrator',
        'police': 'Police Officer',
        'citizen': 'Reporter'
    };

    if (user.role && roleMap[user.role]) {
        return roleMap[user.role];
    }

    // Ultimate fallback: Email prefix in Title Case
    if (user.email) {
        const prefix = user.email.split('@')[0];
        return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
    }

    return 'User';
};
