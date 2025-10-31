/**
 * Formats a card number string by adding spaces after every 4 digits
 * @param value - The card number string (can contain spaces or other characters)
 * @param maxLength - Maximum number of digits allowed (default: 16)
 * @returns Formatted card number string (e.g., "1234 5678 9012 3456")
 */
export function formatCardNumber(value: string, maxLength: number = 16): string {
    // Remove all non-digits
    let digitsOnly = value.replace(/\D/g, "");
    
    // Limit to maxLength digits
    if (digitsOnly.length > maxLength) {
        digitsOnly = digitsOnly.slice(0, maxLength);
    }
    
    // Add space after every 4 digits
    return digitsOnly.match(/.{1,4}/g)?.join(" ") || digitsOnly;
}

/**
 * Formats an expiry date string as MM/YY
 * @param value - The expiry date string (can contain slashes or other characters)
 * @returns Formatted expiry date string (e.g., "12/25")
 */
export function formatExpiryDate(value: string): string {
    // Remove all non-digits
    let digitsOnly = value.replace(/\D/g, "");
    
    // Limit to 4 digits
    if (digitsOnly.length > 4) {
        digitsOnly = digitsOnly.slice(0, 4);
    }
    
    // Add slash after 2 digits
    if (digitsOnly.length >= 2) {
        return digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2);
    }
    
    return digitsOnly;
}

/**
 * Removes formatting from a card number (spaces)
 * @param cardNumber - The formatted card number string
 * @returns Card number with only digits
 */
export function unformatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\s/g, "");
}

/**
 * Parses an expiry date string into month and year
 * @param expiryDate - The formatted expiry date string (e.g., "12/25")
 * @returns Object with month and year, or null if invalid
 */
export function parseExpiryDate(expiryDate: string): { month: string; year: string } | null {
    const parts = expiryDate.split("/");
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
        return null;
    }
    return {
        month: parts[0],
        year: parts[1],
    };
}

/**
 * Validates if a card number has the correct format (16 digits)
 * @param cardNumber - The card number string (can be formatted or unformatted)
 * @returns true if valid, false otherwise
 */
export function isValidCardNumber(cardNumber: string): boolean {
    const digitsOnly = unformatCardNumber(cardNumber);
    return /^\d{13,19}$/.test(digitsOnly); // Most cards are 13-19 digits
}

/**
 * Validates if an expiry date has the correct format (MM/YY)
 * @param expiryDate - The expiry date string
 * @returns true if valid, false otherwise
 */
export function isValidExpiryDate(expiryDate: string): boolean {
    const parsed = parseExpiryDate(expiryDate);
    if (!parsed) return false;
    
    const month = parseInt(parsed.month, 10);
    const year = parseInt(parsed.year, 10);
    
    // Month should be between 01 and 12
    if (month < 1 || month > 12) return false;
    
    // Year should be a valid 2-digit year (assuming 00-99 range)
    if (year < 0 || year > 99) return false;
    
    return true;
}

