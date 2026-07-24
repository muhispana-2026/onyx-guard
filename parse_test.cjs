const str = '{"success":true,"action":"CONTINUE","message":"Bienvenido nuevamente test, disfruta del juego.","sessionToken":"8vnydv5zoe8","speedhackSensitivity":"1.80"}';

let msgStart = str.indexOf('"message":"');
if (msgStart !== -1) {
    msgStart += 11;
    let msgEnd = msgStart;
    while ((msgEnd = str.indexOf('"', msgEnd)) !== -1) {
        if (msgEnd > 0 && str[msgEnd - 1] !== '\\\\') break;
        msgEnd++;
    }
    if (msgEnd !== -1) {
        console.log("Substring:", str.substring(msgStart, msgEnd));
    }
}
