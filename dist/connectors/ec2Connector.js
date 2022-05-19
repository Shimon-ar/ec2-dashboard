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
exports.Ec2Connector = void 0;
const AWS = require('aws-sdk');
/**
 * This Class handles the connection with aws
 * specifically with ec2 instances
 */
class Ec2Connector {
    constructor(accessKeyId, secretAccessKey, region) {
        this.ec2 = new AWS.EC2({
            apiVersion: '2016-11-15',
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        });
    }
    describeInstances(nextToken = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const params = nextToken ? { NextToken: nextToken } : {};
                this.ec2.describeInstances(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
}
exports.Ec2Connector = Ec2Connector;
