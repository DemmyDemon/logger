const fs = require('fs');
let day;
let filename;
let stream;

function getTimestamp(forFilename) {
    let d = new Date();
    if (forFilename){
        let day = d.getDate().toString().padStart(2,'0');
        let month = (d.getMonth() + 1).toString().padStart(2,'0');
        let year = d.getFullYear();
        return `${year}-${month}-${day}`;
    }
    else {
        let second = d.getSeconds().toString().padStart(2,'0');
        let minute = d.getMinutes().toString().padStart(2,'0');
        let hour = d.getHours().toString().padStart(2,'0');
        return `${hour}:${minute}:${second}`;
    }
}

function openStream(){
    filename = GetResourcePath(GetCurrentResourceName()) + '/logs/' + getTimestamp(true) + '.log';
    stream = fs.createWriteStream(getFilename(), {flags: 'a'});
    stream.write(`[${getTimestamp()}] Opened logfile ${filename}\n`);
    day = new Date().getDate();
}

function closeStream(){
    stream.end(`[${getTimestamp(false)}] Closed logfile ${filename}\n`);
    stream = null;
}


RegisterConsoleListener((channel,data) => {
    data = data.replace(/\n/g,'');
    if (data.length > 0 && stream != null){

        if (new Date().getDate() != day){
            closeStream();
            openStream();
        }

        try {
            stream.write(`[${getTimestamp(false)}] ${data}\n`);
        }
        catch(error){
            // Crap, we can't output this. It'll loop forever.
        }
    }
});

on('onResourceStop',(resourceName)=>{
    if ( resourceName == GetCurrentResourceName() ){
        closeStream();
    }
})

openStream();
