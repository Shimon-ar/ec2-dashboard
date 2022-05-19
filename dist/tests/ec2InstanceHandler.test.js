"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2InstanceHandler_1 = require("../handlers/ec2InstanceHandler");
const data_1 = require("./data");
const instanceHandler = new ec2InstanceHandler_1.Ec2InstanceHandler();
/**
 * Tests for the instance handler class
 */
describe('testing getFieldFetcher inside InstanceHandler', () => {
    const fieldFetcher = instanceHandler.getFieldFetcher();
    test('fetching name from instance', () => {
        expect(fieldFetcher[ec2InstanceHandler_1.Attributes.name](data_1.ec2Instance1)).toBe('myInstance1');
    });
    test('fetching state from instance', () => {
        expect(fieldFetcher[ec2InstanceHandler_1.Attributes.state](data_1.ec2Instance1)).toBe('running');
    });
    test('fetching private ips from instance', () => {
        expect(fieldFetcher[ec2InstanceHandler_1.Attributes.private_ips](data_1.ec2Instance1)[0]).toBe('172.31.30.219');
    });
    test('fetching public ip from instance', () => {
        expect(fieldFetcher[ec2InstanceHandler_1.Attributes.public_ip](data_1.ec2Instance1)).toBe('34.224.212.70');
    });
    test('fetching id from instance', () => {
        expect(fieldFetcher[ec2InstanceHandler_1.Attributes.id](data_1.ec2Instance1)).toBe('i-0a4c05824971efb9f');
    });
    test('fetching type from instance', () => {
        expect(fieldFetcher[ec2InstanceHandler_1.Attributes.type](data_1.ec2Instance1)).toBe('t2.micro');
    });
});
