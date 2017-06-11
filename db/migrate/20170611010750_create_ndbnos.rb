class CreateNdbnos < ActiveRecord::Migration
  def change
    create_table :ndbnos do |t|
      t.text :ndbnos
    end
  end
end
