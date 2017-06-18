class CreateNdbnos < ActiveRecord::Migration
  def change
    create_table :ndbnos do |t|
      t.text :ndbnos, array: true, default: '{}'
    end
  end
end
