 var personIdUtente
function setRandomKey()
{
	master_key=document.getElementsByName('user[master_key2]')[0].value;
	toEnc=makeKey();
	document.getElementsByName('user[master_key]')[0].value= GibberishAES.enc(toEnc, master_key)
	localStorage.setItem("master_key", master_key);
}
function makeKey()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function storeMasterKey()
{
	master_key=document.getElementsByName('user[master_key2]')[0].value;
	localStorage.setItem("master_key", master_key);
}
function decrypt(url, password)
{
        $.get(url, function(data)
        {
		try
		{
                	stringa = GibberishAES.dec(data, password);
			immagine="data:image/jpg;base64,"+stringa
		}
		catch(Exc)
		{
			return immagine=data;
		}
        });
        return immagine
}
function sendData()
{
	nomeUtente=document.getElementsByName('friends_password[name]')[0].value;
	passwordUtente=document.getElementsByName('friends_password[password]')[0].value;
	passwordUtente=GibberishAES.enc(passwordUtente, keyToCrypt)
	$.post("/friends_passwords", { username: nomeUtente, password: passwordUtente, personid: personIdUtente },
	function(data) 
	{
		 alert(data);
	});
}

