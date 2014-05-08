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
	passwordUtente=GibberishAES.enc(passwordUtente, master_key)
	console.log("dati cifrati con masterKey: ", master_key)
	$.post("/friends_passwords", { username: nomeUtente, password: passwordUtente},
	function(data) 
	{
		if(data=="ok")
		{
			alert("Password inserita correttamente")
			document.getElementsByName('friends_password[name]')[0].value=""
			document.getElementsByName('friends_password[password]')[0].value=""
		}
		else
		{
			alert("Forse "+nomeUtente+" non e' ancora tuo amico");

		}
	});
}
function searchPassword(personIdCurrentUser, personIdAuthor, myFriends)
{

	if(personIdCurrentUser==personIdAuthor) //se l'autore del post sono io
	{
		return keyToCrypt 
	}
	else
	{
		for(var i=0; i<myFriends.length; i++)
		{
			if(myFriends[i].contact.person_id==personIdAuthor)
			{
				try
				{
					return GibberishAES.dec(myFriends[i].contact.crypted_person_password, master_key)
					

				}
				catch(Exc)
				{
					console.log("Master key dell'utente errata")
					return -1
				}
			}
		}
	}
}
