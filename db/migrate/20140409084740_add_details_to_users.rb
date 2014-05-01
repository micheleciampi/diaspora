class AddDetailsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :master_key, :string
  end
end
