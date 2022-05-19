import {Attributes} from "../handlers/ec2InstanceHandler";

import {Ec2Dashboard} from "../dashboards/ec2Dashboard";
import {describeInstancesNextToken, describeInstancesNextTokenNull} from "./data";

/**
 * Testing for the dashboard,
 * I used mock data to simulate responses of the connector
 */

describe('testing ec2Dashboard', () => {
    const ec2Dashboard = new Ec2Dashboard(process.env.accessKeyId, process.env.secretAccessKey, process.env.region);

    let describeInstancesMethod;
    beforeEach(() => {
        jest.resetAllMocks();
        describeInstancesMethod = jest.spyOn(ec2Dashboard.ec2Connector, 'describeInstances')
        for (let i = 0; i<10; i++){
            if(i==9)
                describeInstancesMethod = describeInstancesMethod.mockImplementationOnce(async () => describeInstancesNextTokenNull as unknown);
            else
                describeInstancesMethod = describeInstancesMethod.mockImplementationOnce(async () => describeInstancesNextToken as unknown);

        }
    });


    test('getEc2s <checking first page> - page - 0 , page size - 10', async () => {
        const ec2s = await ec2Dashboard.getEc2s(0, 10, [Attributes.name, Attributes.state])
        expect(describeInstancesMethod).toHaveBeenCalledTimes(2);
        expect(ec2s.length).toBe(10);
    });

    test('getEc2s <checking last page>  page - 8 , page size - 7', async () => {
        const ec2s = await ec2Dashboard.getEc2s(8, 7, [Attributes.name, Attributes.state, Attributes.public_ip], Attributes.public_ip, false)
        expect(describeInstancesMethod).toHaveBeenCalledTimes(10);
        expect(ec2s.length).toBe(4);

        for (let ec2 of ec2s){
            expect(ec2['public_ip']).toBe('34.224.212.70');
        }
    });


    test('getEc2s <checking sort> - page - 1 , page size - 4', async () => {
        const ec2s = await ec2Dashboard.getEc2s(0, 4, [Attributes.name, Attributes.state, Attributes.id, Attributes.type, Attributes.az, Attributes.public_ip, Attributes.private_ips], Attributes.name, true)
        expect(describeInstancesMethod).toHaveBeenCalledTimes(10);
        expect(ec2s.length).toBe(4);

        expect(Object.keys(ec2s[0]).join(',')).toBe('name,state,id,type,az,public_ip,private_ips');

        for(const ec2 of ec2s){
            expect(ec2['name']).toBe('myInstance1');
        }

    });

    test('getEc2s: <exceeding number of instance> page - 10 , page size - 6 -', async () => {
        const ec2s = await ec2Dashboard.getEc2s(10, 6, [Attributes.name, Attributes.state, Attributes.id, Attributes.type, Attributes.az, Attributes.public_ip, Attributes.private_ips], Attributes.name, true)
        expect(describeInstancesMethod).toHaveBeenCalledTimes(10);
        expect(ec2s.length).toBe(0);
    });

});