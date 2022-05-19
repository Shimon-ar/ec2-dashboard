import {EC2} from "aws-sdk";
import {DescribeInstancesResult} from "aws-sdk/clients/ec2";

const AWS = require('aws-sdk');

/**
 * This Class handles the connection with aws
 * specifically with ec2 instances
 */

export class Ec2Connector {
    ec2:EC2
    constructor(accessKeyId, secretAccessKey, region) {
        this.ec2 = new AWS.EC2({
            apiVersion: '2016-11-15',
            accessKeyId:accessKeyId,
            secretAccessKey: secretAccessKey,
            region:region
        });
    }

    async describeInstances(nextToken:string = null): Promise<DescribeInstancesResult>{
        return new Promise((resolve, reject) => {
            const params = nextToken ? {NextToken:nextToken} : {};

            this.ec2.describeInstances(params, function(err, data) {
                if (err){
                    console.log(err, err.stack);
                    reject(err)
                }
                else    {
                    resolve(data)
                }
            });
        })

    }



}




