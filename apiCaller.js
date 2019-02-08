const request = require("request");
const govtHost = 'https://www.transparency.treasury.gov';
const govtPath = '/services/api/fiscal_service/v1/accounting/od/debt_to_penny';
var queryOptions = {sort: '-data_date'};

var caller = {
    called: false,
    fetchData: function() {
        return new Promise(function(resolve, reject) {
                request({
                url: govtHost + govtPath,
                qs: queryOptions
            }, function(err, response, body) {
                this.called = true;
                resolve(handleDebtData(err, response, body));
            });
        });
    },
};

var handleDebtData = function(err, response, body) {
    if(err) {
        console.log(err); return;
    }

    var p = JSON.parse(body);
    debt = p.data[0].tot_pub_debt_out_amt; // USD
    return debt;
}

module.exports = caller;
