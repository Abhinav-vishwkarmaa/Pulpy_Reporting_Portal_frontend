/**
 * Safe clipboard copy function with fallback for environments where
 * navigator.clipboard is not available (e.g., non-HTTPS, older browsers)
 */
export const copyToClipboard = async (text) => {
    if (!text) {
        return { success: false, error: 'No text to copy' };
    }

    // Try modern clipboard API first (requires HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return { success: true };
        } catch (err) {
            console.warn('Clipboard API failed, trying fallback:', err);
            // Fall through to fallback method
        }
    }

    // Fallback method for non-HTTPS or unsupported browsers
    try {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.focus();
        textarea.select();
        
        // For iOS
        textarea.setSelectionRange(0, text.length);
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            return { success: true };
        } else {
            return { success: false, error: 'Copy command failed' };
        }
    } catch (err) {
        console.error('Fallback copy method failed:', err);
        return { success: false, error: err.message || 'Failed to copy to clipboard' };
    }
};

