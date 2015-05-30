# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150530032208) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "aliments", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "amino_acids", force: :cascade do |t|
    t.integer  "aliment_id"
    t.float    "tryptophan",    null: false
    t.float    "threonine",     null: false
    t.float    "isoleucine",    null: false
    t.float    "leucine",       null: false
    t.float    "lysine",        null: false
    t.float    "methionine",    null: false
    t.float    "cystine",       null: false
    t.float    "phenylalanine", null: false
    t.float    "tyrosine",      null: false
    t.float    "valine",        null: false
    t.float    "arginine",      null: false
    t.float    "histidine",     null: false
    t.float    "alanine",       null: false
    t.float    "aspartic_acid", null: false
    t.float    "glutamic_acid", null: false
    t.float    "glycine",       null: false
    t.float    "proline",       null: false
    t.float    "serine",        null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "amino_acids", ["aliment_id"], name: "index_amino_acids_on_aliment_id", using: :btree

  create_table "lipids", force: :cascade do |t|
    t.integer  "aliment_id"
    t.float    "fatty_acids_saturated",       null: false
    t.float    "fatty_acids_monounsaturated", null: false
    t.float    "fatty_acids_polyunsaturated", null: false
    t.float    "cholesterol",                 null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  add_index "lipids", ["aliment_id"], name: "index_lipids_on_aliment_id", using: :btree

  create_table "minerals", force: :cascade do |t|
    t.integer  "aliment_id"
    t.float    "calcium",    null: false
    t.float    "iron",       null: false
    t.float    "magnesium",  null: false
    t.float    "phosphorus", null: false
    t.float    "potassium",  null: false
    t.float    "sodium",     null: false
    t.float    "zinc",       null: false
    t.float    "copper",     null: false
    t.float    "manganese",  null: false
    t.float    "selenium",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "minerals", ["aliment_id"], name: "index_minerals_on_aliment_id", using: :btree

  create_table "others", force: :cascade do |t|
    t.integer  "aliment_id"
    t.float    "alcohol",     null: false
    t.float    "caffeine",    null: false
    t.float    "theobromine", null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "others", ["aliment_id"], name: "index_others_on_aliment_id", using: :btree

  create_table "proximates", force: :cascade do |t|
    t.integer  "aliment_id"
    t.float    "water",        null: false
    t.float    "energy",       null: false
    t.float    "protein",      null: false
    t.float    "fat",          null: false
    t.float    "ash",          null: false
    t.float    "carbohydrate", null: false
    t.float    "fiber",        null: false
    t.float    "sugars",       null: false
    t.float    "sucrose",      null: false
    t.float    "glucose",      null: false
    t.float    "fructose",     null: false
    t.float    "lactose",      null: false
    t.float    "maltose",      null: false
    t.float    "galactose",    null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "proximates", ["aliment_id"], name: "index_proximates_on_aliment_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "vitamins", force: :cascade do |t|
    t.integer  "aliment_id"
    t.float    "vitamin_c",                  null: false
    t.float    "thiamin",                    null: false
    t.float    "riboflavin",                 null: false
    t.float    "niacin",                     null: false
    t.float    "pantothenic_acid",           null: false
    t.float    "vitamin_b6",                 null: false
    t.float    "folate_total",               null: false
    t.float    "folic_acid",                 null: false
    t.float    "folate_food",                null: false
    t.float    "folate_dfe",                 null: false
    t.float    "choline",                    null: false
    t.float    "betaine",                    null: false
    t.float    "vitamin_b12",                null: false
    t.float    "vitamin_b12_added",          null: false
    t.float    "vitamin_a_rae",              null: false
    t.float    "retinol",                    null: false
    t.float    "beta_carotene",              null: false
    t.float    "alpha_carotene",             null: false
    t.float    "cryptoxanthin",              null: false
    t.float    "vitamin_a_iu",               null: false
    t.float    "lycopene",                   null: false
    t.float    "lutein_zeaxanthin",          null: false
    t.float    "vitamin_e_alpha_tocopherol", null: false
    t.float    "vitamin_e_added",            null: false
    t.float    "vitamin_d_d2_d3",            null: false
    t.float    "vitamin_d",                  null: false
    t.float    "vitamin_k",                  null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "vitamins", ["aliment_id"], name: "index_vitamins_on_aliment_id", using: :btree

end
