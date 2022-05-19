How to launch:

npm install
npm run build
npm run start

npm run test - to run all the tests

Ep specification

/instances - to get all ec2 instances

authentication:
    accessKey:privateAccessKey

params:
   (required) region - the region to get the instances from.
   (optional) page - integer positive value , default: 1
   (optional) pagesize - the size of number results to get back , positive integer, default:5
   (optional) sortby - attribute to sort by the results, [name,id,type,state,az,public_ip]
   (optional) isasc - is ascending sort, default: true

   example:
   /instance?region=us-east1&page=3&pagesize=5&sortby=name


