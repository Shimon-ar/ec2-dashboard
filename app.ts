import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {Ec2Dashboard} from "./dashboards/ec2Dashboard";
import {Attributes} from "./handlers/ec2InstanceHandler";
import {isPositiveInteger} from "./utilities";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

function authentication(req, res, next) {
    const authheader = req.headers.authorization;
    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send('You are not authenticated!');
    }


    const auth = Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');

    if(!auth[0] || !auth[1]){
        res.status(401).send('You are not authenticated!');
    }else{
        req.accessKeyId = auth[0];
        req.secretAccessKey = auth[1];
        next();
    }
}

app.use(authentication);
app.get('/instances', async (req: Request, res: Response) => {
    const region = req.query.region;
    const sortBy = req.query.sortby;
    let isAsc = req.query.isasc === undefined ? 'true': req.query.isasc.toString().toLowerCase();
    const page = req.query.page || 1;
    const pageSize = req.query.pagesize || 5;

    if(!region)
        return res.status(400).send({
            message: 'Query Params Error: region must be specified'
        })

    if (!isPositiveInteger(page) || !isPositiveInteger(pageSize))
        return res.status(400).send({
            message: 'Query Params Error: page or page size must be a positive numbers'
        });

    if (!['true', 'false'].includes(isAsc)) {
        return res.status(400).send({
            message: 'Query Params Error: isasc must have true or false value'
        });
    }


    try{
        const ec2Dashboard = new Ec2Dashboard(req['accessKeyId'], req['secretAccessKey'], region as string);
        const attributes = [Attributes.name, Attributes.id, Attributes.type,Attributes.state, Attributes.az, Attributes.public_ip, Attributes.private_ips];
        const ec2s = await ec2Dashboard.getEc2s(Number(page) - 1, Number(pageSize), attributes, (<any>Attributes)[sortBy as string] ?? null, isAsc === 'true')
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(ec2s));
    }catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});