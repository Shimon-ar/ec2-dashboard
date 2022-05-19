import {Ec2Connector} from "../connectors/ec2Connector";
import {Attributes, Ec2InstanceHandler} from "../handlers/ec2InstanceHandler";

/**
 * This class encapsulate all the functionality
 * with the ec2 dashboard
 */

export class Ec2Dashboard {

    private readonly _ec2Connector: Ec2Connector;
    private readonly _ec2InstanceHandler: Ec2InstanceHandler

    constructor(accessKeyId: string, secretAccessKey: string, region: string) {
        this._ec2Connector = new Ec2Connector(accessKeyId, secretAccessKey, region);
        this._ec2InstanceHandler = new Ec2InstanceHandler();
    }

    get ec2Connector(): Ec2Connector {
        return this._ec2Connector;
    }

    selectFields(reservations: object[], fields: Attributes[]) {
        let instances = [];
        const fetcher = this._ec2InstanceHandler.getFieldFetcher();

        for (const reserve of reservations) {
            for (const instance of reserve['Instances'] || []) {
                const new_instance = {};
                for (let field of fields) {
                    new_instance[Attributes[field]] = fetcher[field](instance);
                }
                instances.push(new_instance);
            }
        }
        return instances;
    }


    async getEc2s(page: number, pageSize: number, fields: Attributes[], sortAttr: Attributes = null, isAsc: boolean = true) {
        let ec2s = [];
        const offset = page * pageSize;
        const limit = offset + pageSize;

        let nextToken = null;
        do {
            let describeInstances = await this._ec2Connector.describeInstances(nextToken);
            nextToken = describeInstances['NextToken'];
            ec2s = ec2s.concat(this.selectFields(describeInstances['Reservations'], fields));

            if (sortAttr == null && ec2s.length >= limit)
                break;
        } while (nextToken)

        if (sortAttr !== null)
            this.sortResults(ec2s, sortAttr, isAsc);

        if (ec2s.length - 1 < offset)
            return [];

        return ec2s.slice(offset, Math.min(ec2s.length, limit));
    }

    sortResults(ec2s: object[], attr: Attributes, isAsc: boolean) {
        ec2s.sort((x, y) => {
            if (typeof x[Attributes[attr]] !== 'string' || typeof y[Attributes[attr]] !== 'string')
                return 0;
            const res = x[Attributes[attr]].localeCompare(y[Attributes[attr]]);
            return isAsc ? res : -1 * res;
        })
    }


}