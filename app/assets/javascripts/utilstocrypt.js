const bitsAKey = 512
function encryptText(key, text)
{
	binaryKeyToCrypt = CryptoJS.enc.Base64.parse(key);
    return CryptoJS.AES.encrypt(text, binaryKeyToCrypt, {'iv':makeIv()}).toString()	
}
function decryptText(key, text)
{
	try
	{
	    decText = CryptoJS.AES.decrypt(text,  CryptoJS.enc.Base64.parse(key), {'iv':makeIv()}).toString(CryptoJS.enc.Utf8)	
		if(decText == "")
		{
			return text;
		}
		return decText
	}
	catch(Exc)
	{
		return text
	}
}
function setRandomKey()
{
	master_key = $('#user_master_key_client')[0].value
	master_key_confirmation = $('#user_master_key_client_confirmation')[0].value

	if(master_key != master_key_confirmation) //mettere un controllo appropriato sulla master key (da usare anche in fase di login)
	{
		alert("Wrong confirmation of the master key")
		return false;
	}

	/* Genera chiave e crittografa con la master_key (inserita dall'utente). La chiave generata
	 * sarà utilizzata per cifrare tutti i dati che l'utente non vuole pubblici
	 */
	toEnc=makeKey().toString(CryptoJS.enc.Base64);
	encrypted = CryptoJS.AES.encrypt(toEnc, master_key);

	$('#user_master_key')[0].value = encrypted 
	localStorage.setItem("master_key", master_key); //necessary when the user closes and reopens the browser without logging out

	//Create RSA key pair and write them into hidden fields	
    privateKeyString  = makeKey().toString((CryptoJS.enc.Base64));
	RSAkey = cryptico.generateRSAKey(privateKeyString, bitsAKey);
    publicKeyString = cryptico.publicKeyString(RSAkey);
	encryptedPrivateKey = CryptoJS.AES.encrypt(privateKeyString, master_key); //encrypt private key, but not public key
	$('#public_key')[0].value = publicKeyString; 
	$('#user_private_key')[0].value = encryptedPrivateKey; 

	//disable field (do not want to send 'master_key_client' and 'master_key_client_confirmation' to the server)
	$('#user_master_key_client_confirmation').attr('disabled', true)
	$('#user_master_key_client').attr('disabled', true)
	return true;
	

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
function logOut()
{
	$.ajax({
		type: "DELETE",
		async: false,
		url: "/users/sign_out",
		success: function(msg)
		{
			alert("Uncorrect master key");
			window.location ="http://diaspora.cs.unisa.it/users/sign_in"
		}
	});	
}
function checkAndStoreMasterKey()
{
	master_key = $('#user_master_key_client')[0].value; //controllare presenza e correttezza della master_key
	localStorage.setItem("master_key", master_key);
	return true
}
function decrypt(url, b64password)
{
	jQuery.ajaxSetup({async:false});
	$.get(url, function(data)
    {
		try
		{
			b64Image = CryptoJS.AES.decrypt(data,  CryptoJS.enc.Base64.parse(b64password), {'iv':makeIv()}).toString(CryptoJS.enc.Utf8)
			if(b64Image  =="")
			{
				immagine = url
			}
			else
			{
				immagine="data:image/jpg;base64, "+b64Image 
			}
		}
		catch(Exc)
		{
			console.log("Uncorrect key used to decrypt data")
			return immagine = url;
		}
	});
	jQuery.ajaxSetup({async:true});
	return immagine
}
/*Used in the first version of cDiaspora (form to input friend's key)
 *
 */
/*
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
}*/
