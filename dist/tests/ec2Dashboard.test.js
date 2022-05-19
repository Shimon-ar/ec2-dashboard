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
const ec2InstanceHandler_1 = require("../handlers/ec2InstanceHandler");
const ec2Dashboard_1 = require("../dashboards/ec2Dashboard");
const data_1 = require("./data");
/**
 * Testing for the dashboard,
 * I used mock data to simulate responses of the connector
 */
describe('testing ec2Dashboard', () => {
    const ec2Dashboard = new ec2Dashboard_1.Ec2Dashboard(process.env.accessKeyId, process.env.secretAccessKey, process.env.region);
    let describeInstancesMethod;
    beforeEach(() => {
        jest.resetAllMocks();
        describeInstancesMethod = jest.spyOn(ec2Dashboard.ec2Connector, 'describeInstances');
        for (let i = 0; i < 10; i++) {
            if (i == 9)
                describeInstancesMethod = describeInstancesMethod.mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return data_1.describeInstancesNextTokenNull; }));
            else
                describeInstancesMethod = describeInstancesMethod.mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return data_1.describeInstancesNextToken; }));
        }
    });
    test('getEc2s <checking first page> - page - 0 , page size - 10', () => __awaiter(void 0, void 0, void 0, function* () {
        const ec2s = yield ec2Dashboard.getEc2s(0, 10, [ec2InstanceHandler_1.Attributes.name, ec2InstanceHandler_1.Attributes.state]);
        expect(describeInstancesMethod).toHaveBeenCalledTimes(2);
        expect(ec2s.length).toBe(10);
    }));
    test('getEc2s <checking last page>  page - 8 , page size - 7', () => __awaiter(void 0, void 0, void 0, function* () {
        const ec2s = yield ec2Dashboard.getEc2s(8, 7, [ec2InstanceHandler_1.Attributes.name, ec2InstanceHandler_1.Attributes.state, ec2InstanceHandler_1.Attributes.public_ip], ec2InstanceHandler_1.Attributes.public_ip, false);
        expect(describeInstancesMethod).toHaveBeenCalledTimes(10);
        expect(ec2s.length).toBe(4);
        for (let ec2 of ec2s) {
            expect(ec2['public_ip']).toBe('34.224.212.70');
        }
    }));
    test('getEc2s <checking sort> - page - 1 , page size - 4', () => __awaiter(void 0, void 0, void 0, function* () {
        const ec2s = yield ec2Dashboard.getEc2s(0, 4, [ec2InstanceHandler_1.Attributes.name, ec2InstanceHandler_1.Attributes.state, ec2InstanceHandler_1.Attributes.id, ec2InstanceHandler_1.Attributes.type, ec2InstanceHandler_1.Attributes.az, ec2InstanceHandler_1.Attributes.public_ip, ec2InstanceHandler_1.Attributes.private_ips], ec2InstanceHandler_1.Attributes.name, true);
        expect(describeInstancesMethod).toHaveBeenCalledTimes(10);
        expect(ec2s.length).toBe(4);
        expect(Object.keys(ec2s[0]).join(',')).toBe('name,state,id,type,az,public_ip,private_ips');
        for (const ec2 of ec2s) {
            expect(ec2['name']).toBe('myInstance1');
        }
    }));
    test('getEc2s: <exceeding number of instance> page - 10 , page size - 6 -', () => __awaiter(void 0, void 0, void 0, function* () {
        const ec2s = yield ec2Dashboard.getEc2s(10, 6, [ec2InstanceHandler_1.Attributes.name, ec2InstanceHandler_1.Attributes.state, ec2InstanceHandler_1.Attributes.id, ec2InstanceHandler_1.Attributes.type, ec2InstanceHandler_1.Attributes.az, ec2InstanceHandler_1.Attributes.public_ip, ec2InstanceHandler_1.Attributes.private_ips], ec2InstanceHandler_1.Attributes.name, true);
        expect(describeInstancesMethod).toHaveBeenCalledTimes(10);
        expect(ec2s.length).toBe(0);
    }));
});
