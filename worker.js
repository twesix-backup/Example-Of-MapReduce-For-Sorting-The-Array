var reader=require('./reader');
var cluster=require('cluster');
var fs=require('fs');
var id=cluster.worker.id;
var range=[id/10-0.1,id/10];

console.log('[id : '+id+'] worker online, on duty of range [ '+range[0]+' ,'+range[1]+')');

process.on('message',function(msg)
{
    switch(msg.type)
    {
        case 'file' : reader(msg.content,collect,sort); break;
        default     : console.log('not a valid message !');
    }
});

var arr=[];

function collect(data)
{
    if(data instanceof Array)
    {
        for(var i in data)
        {
            if(data[i]>=range[0]&&data[i]<range[1])
            {
                arr.push(data[i]);
            }
        }
    }
    else
    {
        console.log('xxxx argument type error : array required');
        console.log(data);
    }
}

function sort()
{
    arr.sort(function(a,b)
    {
        return a-b;
    });
    write_back();
}

function write_back()
{
    console.log(`[ id : ${id}] writing back`);
    var file=fs.createWriteStream(`./temp/w${id}.txt`);
    file.write(arr.join('\n'),end);
    function end()
    {
        // file.uncork();
        file.close();
        process.disconnect();
        process.exit(0);
    }
}

