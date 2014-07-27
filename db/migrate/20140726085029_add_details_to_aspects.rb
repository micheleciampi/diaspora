class AddDetailsToAspects < ActiveRecord::Migration
  def change
    add_column :aspects, :aspect_crypted_key, :string
  end
end
