"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2InstanceHandler = exports.Attributes = void 0;
var Attributes;
(function (Attributes) {
    Attributes[Attributes["name"] = 0] = "name";
    Attributes[Attributes["id"] = 1] = "id";
    Attributes[Attributes["type"] = 2] = "type";
    Attributes[Attributes["state"] = 3] = "state";
    Attributes[Attributes["az"] = 4] = "az";
    Attributes[Attributes["public_ip"] = 5] = "public_ip";
    Attributes[Attributes["private_ips"] = 6] = "private_ips";
})(Attributes = exports.Attributes || (exports.Attributes = {}));
/**
 * This class handles all
 * the actions on the instance object.
 */
class Ec2InstanceHandler {
    getTag(instance, key) {
        if (!instance['Tags'])
            return '';
        for (const tag of instance['Tags']) {
            if (tag['Key'] === key)
                return tag['Value'];
        }
        return '';
    }
    getPrivateIps(instance) {
        var _a, _b;
        let ips = [];
        const privateIpsArr = (_b = (_a = instance['NetworkInterfaces']) === null || _a === void 0 ? void 0 : _a.map(x => x['PrivateIpAddresses']).filter(x => x)) !== null && _b !== void 0 ? _b : [];
        for (const privateIps of privateIpsArr) {
            for (const privateIp of privateIps) {
                if (privateIp['PrivateIpAddress'])
                    ips.push(privateIp['PrivateIpAddress']);
            }
        }
        return ips;
    }
    getFieldFetcher() {
        return ({
            [Attributes.name]: (instance) => this.getTag(instance, 'Name'),
            [Attributes.id]: (instance) => { var _a; return (_a = instance['InstanceId']) !== null && _a !== void 0 ? _a : 'None'; },
            [Attributes.type]: (instance) => { var _a; return (_a = instance['InstanceType']) !== null && _a !== void 0 ? _a : 'None'; },
            [Attributes.state]: (instance) => { var _a, _b; return (_b = (_a = instance['State']) === null || _a === void 0 ? void 0 : _a['Name']) !== null && _b !== void 0 ? _b : 'None'; },
            [Attributes.az]: (instance) => { var _a, _b; return (_b = (_a = instance['Placement']) === null || _a === void 0 ? void 0 : _a['AvailabilityZone']) !== null && _b !== void 0 ? _b : 'None'; },
            [Attributes.public_ip]: (instance) => { var _a; return (_a = instance['PublicIpAddress']) !== null && _a !== void 0 ? _a : 'None'; },
            [Attributes.private_ips]: this.getPrivateIps,
        });
    }
}
exports.Ec2InstanceHandler = Ec2InstanceHandler;
