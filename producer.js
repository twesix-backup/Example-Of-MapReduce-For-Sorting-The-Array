var fs=require('fs');

var total=9e1;
var done=0;
var timer;
function produce()
{
    var file=fs.createWriteStream('./resources/0.009e8.txt');
    file.on('open',function()
    {
        timer=setInterval(function()
        {
            if(done===total)
            {
                clearInterval(timer);
                return ;
            }
            if(done<total)
            {
                for(var i=0;i<1e4;i++)
                {
                    file.write(Math.random()+'\n');
                }
                done++;
                file.uncork();
                if(done%100===0)
                {
                    console.log('>>>> writing data : total '+10000*done+' items written');
                }
            }
            else
            {
                file.close();
            }
        },10);
    });
    file.once('close',function()
    {
        console.log('>>>> done writing data : total '+10000*total+' items written');
    })
}

module.exports=produce;

produce();