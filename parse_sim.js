const responseString = `{"success":true,"action":"CONTINUE","message":"Bienvenido nuevamente test, disfrute del juego.","sessionToken":"rz3xfxaq0g","speedhackSensitivity":"1.80"}`;

let msgStart = responseString.indexOf('"message":"');
if (msgStart !== -1) {
    msgStart += 11;
    let msgEnd = msgStart;
    while (true) {
        let nextQuote = responseString.indexOf('"', msgEnd);
        if (nextQuote === -1) break;
        msgEnd = nextQuote;
        if (msgEnd > 0 && responseString[msgEnd - 1] !== '\\') break;
        msgEnd++;
    }
    console.log("Msg:", responseString.substring(msgStart, msgEnd));
}
