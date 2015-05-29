class CreateOthers < ActiveRecord::Migration
  def change
    create_table :others do |t|
      t.string :alcohol, null: false, default: ''
      t.string :caffeine, null: false, default: ''
      t.string :theobromine, null: false, default: ''
    end
  end
end
