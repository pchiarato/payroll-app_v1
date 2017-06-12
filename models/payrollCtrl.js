module.exports = {

    timeConverter: function(time) {
        let timeInSeconds = time;
        let hours = ~~(timeInSeconds / 3600);
        timeInSeconds -= hours * 3600;
        let minutes = ~~(timeInSeconds / 60);
        t = [hours, minutes]
        return (parseInt(t[0], 10) * 1 + parseInt(t[1], 10) / 60).toFixed(2);
    },

    timeToCurrencyConverter: function(time, hourlyRate) {
        var overtime = 0;
        let amountPerMinute = hourlyRate / 60;
        let minutes = time / 60;
        if (minutes > 2400) {
            var regPay = 2400 * amountPerMinute;
            var ot = ~~(minutes -= 2400);
            overtime = ot * (amountPerMinute * 1.5);
            return { regularPay: regPay.toFixed(2), overtime: overtime.toFixed(2) }
        }
        regPay = (minutes * amountPerMinute);
        return { regularPay: regPay.toFixed(2), overtime: overtime.toFixed(2) }
    },
    addPay: function(regPay, overtime) {
        return (+regPay + (+overtime));
    },
    calculateSocialSecurity: function(grosspay, socialSecurityPercentage) {
        let total = grosspay * socialSecurityPercentage;
        return total.toFixed(2)
    },
    calculateMedicare: function(grosspay, medicarePercentage) {
        let total = grosspay * medicarePercentage;
        return total.toFixed(2)
    },
    calculateFederalTax: function(pay, taxPercentage, socialsecurity, medicare) {
        let myPay = pay;
        myPay - (socialsecurity + medicare);
        let total = myPay * taxPercentage;
        return total.toFixed(2);
    },
    calculateNetPay: function(grosspay, deductions) {
        //let deductions = federal * 1 + medicare * 1 + socialSecurity * 1;
        let netpay = grosspay - deductions;
        return netpay.toFixed(2);
    },
    calculateTotalTaxesPaid: function(federal, medicare, socialSecurity) {
        let deductions = federal * 1 + medicare * 1 + socialSecurity * 1;
        return deductions.toFixed(2);
    }

}