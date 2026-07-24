const responseString = '{"success":true,"action":"CONTINUE","message":"Bienvenido, test, tu equipo ha sido registrado en nuestro sistema. Disfrute del juego.","sessionToken":"rg9n5rcgyap","speedhackSensitivity":"1.80"}';
let msgStart = responseString.indexOf('"message":"');
if (msgStart !== -1) {
    msgStart += 11;
    let msgEnd = responseString.indexOf('"', msgStart);
    if (msgEnd !== -1) {
        console.log("Msg:", responseString.substring(msgStart, msgEnd));
    }
}
