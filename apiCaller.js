const request = require("request");
const govtHost = 'https://www.transparency.treasury.gov';
const govtPath = '/services/api/fiscal_service/v1/accounting/od/debt_to_penny';
var queryOptions = {sort: '-data_date'};

var lastDebt = 0;

var caller = {
    fetchData: function() {
        return new Promise(function(resolve, reject) {
                request({
                url: govtHost + govtPath,
                qs: queryOptions
            }, function(err, response, body) {
                var date = new Date();
                console.log("CALLED: " + date.getHours() + ":" + date.getMinutes() + " " + 
                            (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear());
                resolve(handleDebtData(err, response, body));
            });
        });
    },
};

var handleDebtData = function(err, response, body) {
    if(err) {
        console.log("Error calling API: Reverting back to previous debt.\n", err); return lastDebt;
    }

    var p = JSON.parse(body);
    debt = p.data[0].tot_pub_debt_out_amt; // USD
    lastDebt = debt;
    return debt;
}

module.exports = caller;
