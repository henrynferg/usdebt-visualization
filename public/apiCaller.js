const request = require("request");
const govtHost = 'https://www.transparency.treasury.gov';
const govtPath = '/services/api/fiscal_service/v1/accounting/od/debt_to_penny';
var queryOptions = {sort: '-data_date'};

const pennyThickness = 1.52e-6; // In km
var debt = 0; // In USD

var caller = {};

var fetchData = function() {
    request({
        url: govtHost + govtPath,
        qs: queryOptions
    }, function(err, response, body) {
        caller.height = handleDebtData(err, response, body);
    });
}

var handleDebtData = function(err, response, body) {
    if(err) {
        console.log(err); return;
    }

    console.log("Response: " + response.statusCode);
    var p = JSON.parse(body);
    debt = p.data[0].tot_pub_debt_out_amt;

    caller.debt = debt;

    const debtHeight = calculateNationalDebtHeight(debt);
    return debtHeight;
}

var calculateNumPennies = function(dollars) {
    return dollars * 100;
}

var calculateNationalDebtHeight = function(numDollars) {
    return pennyThickness * calculateNumPennies(numDollars);
}

module.exports(caller);
