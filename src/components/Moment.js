import moment from 'moment';
export const formatDate = (date) => {
    if (!date) return ''; // Handle cases where date is undefined or null
    return moment(date).format('D MMM YY, h:mm A');
};
export const formatDateTime = (date) => {
    if (!date) return ''; // Handle cases where date is undefined or null
    return moment(date).format('D MMM YYYY');
};

export const limitTextTo15Words = (text) =>{
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, '');
    const words = plainText.split(/\s+/).filter(Boolean);
    const limitedText = words.slice(0, 15).join(' ');
    return words.length > 15 ? `${limitedText}...` : limitedText;
}

export const limitTextTo7Words = (text) =>{
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, '');
    const words = plainText.split(/\s+/).filter(Boolean);
    const limitedText = words.slice(0, 7).join(' ');
    return words.length > 7 ? `${limitedText}...` : limitedText;
}
