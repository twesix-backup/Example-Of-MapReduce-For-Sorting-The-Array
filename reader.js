var fs=require('fs');

function reader(filename,handler,done)
{
    var file=fs.createReadStream(filename);
    var buf='';

    file.on('data',incoming_data);
    file.on('end',function()
    {
        if(buf.toString()!=='')
        {
            handler([buf.toString()]);
        }
        done();
    });

    function incoming_data(chunk)
    {
        var temp=(buf+chunk).toString().split('\n');
        buf=temp.pop();
        buf=new Buffer(buf);
        handler(temp);
    }
}

module.exports=reader;