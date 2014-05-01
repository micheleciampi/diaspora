class AddDetailsToContacts < ActiveRecord::Migration
  def change
    add_column :contacts, :crypted_person_password, :string
  end
end
