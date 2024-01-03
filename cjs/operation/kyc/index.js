"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYC = void 0;
const create_service_js_1 = require("./create-service.js");
const add_controller_js_1 = require("./add-controller.js");
const remove_controller_js_1 = require("./remove-controller.js");
const add_customer_js_1 = require("./add-customer.js");
const update_customer_js_1 = require("./update-customer.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../types/index.js");
class KYC extends index_js_1.ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, currency) {
        return new index_js_1.Operation(this.networkID, new create_service_js_1.CreateServiceFact(index_js_2.TimeStamp.new().UTC(), sender, contractAddr, currency));
    }
    addController(contractAddr, sender, controller, currency) {
        return new index_js_1.Operation(this.networkID, new add_controller_js_1.AddControllerFact(index_js_2.TimeStamp.new().UTC(), sender, [
            new add_controller_js_1.AddControllerItem(contractAddr, controller, currency)
        ]));
    }
    addCustomer(contractAddr, sender, customer, status, currency) {
        return new index_js_1.Operation(this.networkID, new add_customer_js_1.AddCustomerFact(index_js_2.TimeStamp.new().UTC(), sender, [
            new add_customer_js_1.AddCustomerItem(contractAddr, customer, status, currency)
        ]));
    }
    removeController(contractAddr, sender, controller, currency) {
        return new index_js_1.Operation(this.networkID, new remove_controller_js_1.RemoveControllerFact(index_js_2.TimeStamp.new().UTC(), sender, [
            new remove_controller_js_1.RemoveControllerItem(contractAddr, controller, currency)
        ]));
    }
    updateCustomer(contractAddr, sender, customer, status, currency) {
        return new index_js_1.Operation(this.networkID, new update_customer_js_1.UpdateCustomerFact(index_js_2.TimeStamp.new().UTC(), sender, [new update_customer_js_1.UpdateCustomerItem(contractAddr, customer, status, currency)]));
    }
}
exports.KYC = KYC;
//# sourceMappingURL=index.js.map