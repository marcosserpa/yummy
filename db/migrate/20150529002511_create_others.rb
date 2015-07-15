class CreateOthers < ActiveRecord::Migration
  def change
    create_table :others do |t|
      t.belongs_to :aliment, index: true
      t.float :alcohol, null: false, default: ''
      t.float :caffeine, null: false, default: ''
      t.float :theobromine, null: false, default: ''

      t.timestamps null: false
    end
  end
end
