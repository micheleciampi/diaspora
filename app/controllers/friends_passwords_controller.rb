class FriendsPasswordsController < ApplicationController
 def new
   end
   
   def create
   connection = ActiveRecord::Base.connection();
   result=connection.execute("select contacts.id from contacts where contacts.person_id in
	(
		select people.id from people, users where users.username= '"+params[:username]+"' and people.owner_id=users.id
	)
	and contacts.user_id ="+@current_user.id.to_s+" 
   ")

 
	contactId=-1 #id della tabella contatti relativo alla relazione di amicizia tra l'utente che sta utilizzano il sistema e l'utente con username= params[:username] 
	result.each do |row|
		contactId= row[0]
	end

	if contactId  != -1 # se l'utente esiste e c'e' una relazione di amicizia allora inserisci la password cifrata nel database
	   connection.execute("update contacts set crypted_person_password = '"+params[:password]+"' where id = "+contactId.to_s)
		response="ok";
	else
		response="ko"
	end		 

	render text: response
	end

end
