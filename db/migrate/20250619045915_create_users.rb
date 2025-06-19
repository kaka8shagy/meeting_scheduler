class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false # For storing hashed passwords (e.g., with has_secure_password)

      t.timestamps # Adds created_at and updated_at columns
    end
  end
end