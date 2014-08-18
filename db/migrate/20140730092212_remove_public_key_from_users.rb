class RemovePublicKeyFromUsers < ActiveRecord::Migration
  def up
    remove_column :users, :public_key
  end

  def down
    add_column :users, :public_key, :string
  end
end
