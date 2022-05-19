export enum Attributes {
    'name' ,
    'id',
    'type',
    'state',
    'az',
    'public_ip',
    'private_ips'
}

/**
 * This class handles all
 * the actions on the instance object.
 */

export class Ec2InstanceHandler {

    getTag(instance: object, key: string) {
        if (!instance['Tags'])
            return '';
        for (const tag of instance['Tags']) {
            if (tag['Key'] === key)
                return tag['Value'];
        }
        return '';
    }

    getPrivateIps(instance: object) {
        let ips = [];
        const privateIpsArr = instance['NetworkInterfaces']?.map(x => x['PrivateIpAddresses']).filter(x => x) ?? [];
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
            [Attributes.id]: (instance) => instance['InstanceId'] ?? 'None',
            [Attributes.type]: (instance) => instance['InstanceType'] ?? 'None',
            [Attributes.state]: (instance) => instance['State']?.['Name'] ?? 'None',
            [Attributes.az]: (instance) => instance['Placement']?.['AvailabilityZone'] ?? 'None',
            [Attributes.public_ip]: (instance) => instance['PublicIpAddress'] ?? 'None',
            [Attributes.private_ips]: this.getPrivateIps,
        });
    }
}