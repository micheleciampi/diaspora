class AddCvPublicKeyToPeople < ActiveRecord::Migration
  def change
    add_column :people, :cv_public_key, :string
  end
end
