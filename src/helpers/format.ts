import moment from 'moment';


export const formatDate = (date: string, format: string) => {
    return moment(date).locale('id').format(format);
}

export const formatDateIndonesia = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    }).format(new Date(date));
}

export const formatLongDateIndonesia = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export const formatNumber = (value: string) => {
    // jika bukan string maka convert ke string
    if(typeof value !== 'string') {
        value = String(value);
    }
   return value.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

export const convertToNumber = (value: string) => {
    if(!value) return 0;
    return Number(value.replace(/\./g, '').replace(/,/g, '.'));
}