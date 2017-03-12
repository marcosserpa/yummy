class AddMeasuresToTables < ActiveRecord::Migration
	AFFECTED_TABLES = [:amino_acids, :lipids, :minerals, :others, :proximates, :vitamins]

  def change
  	AFFECTED_TABLES.each do |t|
      add_column t, :measures, :string, array: true, null: false, default: []
    end
  end
end
