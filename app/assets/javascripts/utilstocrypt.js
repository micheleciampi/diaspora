function setRandomKey()
{


	master_key=document.getElementsByName('user[master_key2]')[0].value;
	toEnc=makeKey().toString(CryptoJS.enc.Base64);
	 
	encrypted = CryptoJS.AES.encrypt(toEnc, master_key);

	document.getElementsByName('user[master_key]')[0].value = encrypted
	localStorage.setItem("master_key", master_key);
}
function makeKey()
{
	return CryptoJS.lib.WordArray.random(256/8);
}
function makeIv()
{
	utf8Content = ""
	for(i = 0; i< 256/8; i++)
	{
		utf8Content+="0";
	}
	return  CryptoJS.enc.Utf8.parse(utf8Content); 


}

function storeMasterKey()
{
	master_key=document.getElementsByName('user[master_key2]')[0].value;
	localStorage.setItem("master_key", master_key);
}
function decrypt(url, b64password)
{
        $.get(url, function(data)
        {
		try
		{
			stringa = CryptoJS.AES.decrypt(data,  CryptoJS.enc.Base64.parse(b64password), {'iv':makeIv()}).toString(CryptoJS.enc.Utf8)
			immagine="data:image/jpg;base64, "+stringa
		}
		catch(Exc)
		{
			console.log("Uncorrect key used to decrypt data")
			return immagine=data;
		}
        });
        return immagine
}
function sendData()
{
	nomeUtente = document.getElementsByName('friends_password[name]')[0].value;
	passwordUtente = document.getElementsByName('friends_password[password]')[0].value;
	passwordUtente = CryptoJS.AES.encrypt(passwordUtente, master_key).toString()
	console.log("Password cifrata", passwordUtente)
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
					return CryptoJS.AES.decrypt(myFriends[i].contact.crypted_person_password, master_key).toString(CryptoJS.enc.Utf8)
					

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
