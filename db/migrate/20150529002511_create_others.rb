class CreateOthers < ActiveRecord::Migration
  def change
    create_table :others do |t|
      t.float :alcohol, null: false, default: ''
      t.float :caffeine, null: false, default: ''
      t.float :theobromine, null: false, default: ''
    end
  end
end
