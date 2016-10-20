var cluster=require('cluster');
var fs=require('fs');
var files= [
        './temp/w1.txt',
        './temp/w2.txt',
        './temp/w3.txt',
        './temp/w4.txt',
        './temp/w5.txt',
        './temp/w6.txt',
        './temp/w7.txt',
        './temp/w8.txt',
        './temp/w9.txt',
        './temp/w10.txt'
    ];

function map(file='./resources/0.001e8.txt',workers=cluster.workers)
{
    console.log('>>>> map start');
    for(var id in workers)
    {
        workers[id].send({type:'file',content:file});
    }
}

function reduce(files,concat=null)
{
    console.log('reduce start');
    var result=fs.createWriteStream('./resources/result.txt');
    concat=function(file,result)
    {
        var stm=fs.createReadStream(file);
        stm.on('data',function(chunk)
        {
            console.log(chunk);
            result.write(chunk);
            result.uncork();
        });
        stm.on('end',function()
        {
            stm.close();
        });
        return stm;
    };
    function next()
    {
        var file=files.shift();
        if(file)
        {
            concat(file,result).on('close',next);
        }
        else
        {
            result.close();
        }
    }
    result.on('open',next);
}

if(cluster.isMaster)
{
    console.log('>>>> waiting for all the workers get ready');
    for(var i=0;i<10;i++)
    {
        cluster.fork();
    }
    var ready=setInterval(function()
    {
        for(var id in cluster.workers)
        {
            if(!cluster.workers[id].isConnected())
            {
                return ;
            }
        }
        clearInterval(ready);
        map();
        var done=setInterval(function()
        {
            for(var id in cluster.workers)
            {
                if(cluster.workers[id].isConnected())
                {
                    return ;
                }
            }
            clearInterval(done);
            console.log(`>>>> all workers disconnected`);
            reduce(files);
        },1000);
    },1000);
}
if(cluster.isWorker)
{
    require('./worker');
}