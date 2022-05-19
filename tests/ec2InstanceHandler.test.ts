import {Attributes, Ec2InstanceHandler} from "../handlers/ec2InstanceHandler";
import {ec2Instance1} from "./data";
const instanceHandler = new Ec2InstanceHandler();

/**
 * Tests for the instance handler class
 */

describe('testing getFieldFetcher inside InstanceHandler', () => {

    const fieldFetcher = instanceHandler.getFieldFetcher();

    test('fetching name from instance', () => {
        expect(fieldFetcher[Attributes.name](ec2Instance1)).toBe('myInstance1');
    });

    test('fetching state from instance', () => {
        expect(fieldFetcher[Attributes.state](ec2Instance1)).toBe('running');
    });

    test('fetching private ips from instance', () => {
        expect(fieldFetcher[Attributes.private_ips](ec2Instance1)[0]).toBe('172.31.30.219');
    });

    test('fetching public ip from instance', () => {
        expect(fieldFetcher[Attributes.public_ip](ec2Instance1)).toBe('34.224.212.70');
    });

    test('fetching id from instance', () => {
        expect(fieldFetcher[Attributes.id](ec2Instance1)).toBe('i-0a4c05824971efb9f');
    });

    test('fetching type from instance', () => {
        expect(fieldFetcher[Attributes.type](ec2Instance1)).toBe('t2.micro');
    });


});