var fs=require('fs');

console.log(`>>>> start single process sorting time tests`);
var length=1;
var max=10;
function sort() // x100000
{
    var mock=fs.createWriteStream('./mock.txt');
    var mockarr=[];
    if(length>max)
    {
        return;
    }
    var arr=[];
    var t=new Date().getTime();
    for(let i=0;i<length*100000;i++)
    {
        arr.push(Math.random());
        mock.write(`${Math.random()}\n`);
        mock.uncork();
    }
    mock.close();
    arr.sort(function(a,b)
    {
        return a-b;
    });
    mock=fs.createReadStream('./mock.txt');
    mock.on('data',function(chunk)
    {
        mockarr.concat(this,chunk.toString().split('/n'));
    });
    mock.on('end',function(chunk)
    {
        chunk&&mockarr.concat(this,chunk.toString().split('/n'));
    });
    console.log(`sorting ${length*100000} items,costs ${new Date().getTime()-t}ms`);
    length++;
    process.nextTick(sort);
}

sort(1,1);

