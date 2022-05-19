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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ec2Dashboard_1 = require("./dashboards/ec2Dashboard");
const ec2InstanceHandler_1 = require("./handlers/ec2InstanceHandler");
const utilities_1 = require("./utilities");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
function authentication(req, res, next) {
    const authheader = req.headers.authorization;
    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send('You are not authenticated!');
    }
    const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    if (!auth[0] || !auth[1]) {
        res.status(401).send('You are not authenticated!');
    }
    else {
        req.accessKeyId = auth[0];
        req.secretAccessKey = auth[1];
        next();
    }
}
app.use(authentication);
app.get('/instances', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const region = req.query.region;
    const sortBy = req.query.sortby;
    let isAsc = req.query.isasc === undefined ? 'true' : req.query.isasc.toString().toLowerCase();
    const page = req.query.page || 1;
    const pageSize = req.query.pagesize || 5;
    if (!region)
        return res.status(400).send({
            message: 'Query Params Error: region must be specified'
        });
    if (!(0, utilities_1.isPositiveInteger)(page) || !(0, utilities_1.isPositiveInteger)(pageSize))
        return res.status(400).send({
            message: 'Query Params Error: page or page size must be a positive numbers'
        });
    if (!['true', 'false'].includes(isAsc)) {
        return res.status(400).send({
            message: 'Query Params Error: isasc must have true or false value'
        });
    }
    try {
        const ec2Dashboard = new ec2Dashboard_1.Ec2Dashboard(req['accessKeyId'], req['secretAccessKey'], region);
        const attributes = [ec2InstanceHandler_1.Attributes.name, ec2InstanceHandler_1.Attributes.id, ec2InstanceHandler_1.Attributes.type, ec2InstanceHandler_1.Attributes.state, ec2InstanceHandler_1.Attributes.az, ec2InstanceHandler_1.Attributes.public_ip, ec2InstanceHandler_1.Attributes.private_ips];
        const ec2s = yield ec2Dashboard.getEc2s(Number(page) - 1, Number(pageSize), attributes, (_a = ec2InstanceHandler_1.Attributes[sortBy]) !== null && _a !== void 0 ? _a : null, isAsc === 'true');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(ec2s));
    }
    catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
