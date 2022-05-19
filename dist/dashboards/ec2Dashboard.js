"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2Dashboard = void 0;
const ec2Connector_1 = require("../connectors/ec2Connector");
const ec2InstanceHandler_1 = require("../handlers/ec2InstanceHandler");
/**
 * This class encapsulate all the functionality
 * with the ec2 dashboard
 */
class Ec2Dashboard {
    constructor(accessKeyId, secretAccessKey, region) {
        this._ec2Connector = new ec2Connector_1.Ec2Connector(accessKeyId, secretAccessKey, region);
        this._ec2InstanceHandler = new ec2InstanceHandler_1.Ec2InstanceHandler();
    }
    get ec2Connector() {
        return this._ec2Connector;
    }
    selectFields(reservations, fields) {
        let instances = [];
        const fetcher = this._ec2InstanceHandler.getFieldFetcher();
        for (const reserve of reservations) {
            for (const instance of reserve['Instances'] || []) {
                const new_instance = {};
                for (let field of fields) {
                    new_instance[ec2InstanceHandler_1.Attributes[field]] = fetcher[field](instance);
                }
                instances.push(new_instance);
            }
        }
        return instances;
    }
    getEc2s(page, pageSize, fields, sortAttr = null, isAsc = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let ec2s = [];
            const offset = page * pageSize;
            const limit = offset + pageSize;
            let nextToken = null;
            do {
                let describeInstances = yield this._ec2Connector.describeInstances(nextToken);
                nextToken = describeInstances['NextToken'];
                ec2s = ec2s.concat(this.selectFields(describeInstances['Reservations'], fields));
                if (sortAttr == null && ec2s.length >= limit)
                    break;
            } while (nextToken);
            if (sortAttr !== null)
                this.sortResults(ec2s, sortAttr, isAsc);
            if (ec2s.length - 1 < offset)
                return [];
            return ec2s.slice(offset, Math.min(ec2s.length, limit));
        });
    }
    sortResults(ec2s, attr, isAsc) {
        ec2s.sort((x, y) => {
            if (typeof x[ec2InstanceHandler_1.Attributes[attr]] !== 'string' || typeof y[ec2InstanceHandler_1.Attributes[attr]] !== 'string')
                return 0;
            const res = x[ec2InstanceHandler_1.Attributes[attr]].localeCompare(y[ec2InstanceHandler_1.Attributes[attr]]);
            return isAsc ? res : -1 * res;
        });
    }
}
exports.Ec2Dashboard = Ec2Dashboard;
