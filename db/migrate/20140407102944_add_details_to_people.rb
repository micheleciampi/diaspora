class AddDetailsToPeople < ActiveRecord::Migration
  def change
    add_column :people, :public_key, :string
  end
end
