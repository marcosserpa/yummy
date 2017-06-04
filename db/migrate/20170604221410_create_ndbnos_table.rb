class CreateNdbnosTable < ActiveRecord::Migration
  def change
    create_table :ndbnos_tables do |t|
      t.string :ndbno
    end
  end
end
