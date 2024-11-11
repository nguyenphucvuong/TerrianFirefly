export const formatNumber = ({ num }) => {
    // console.log(num)
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B'; // tỷ
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M'; // triệu
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K'; // nghìn
    } else {
        return num.toString(); // số bình thường
    }
};