# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_10_19_210319) do
  create_table "allowlist_domains", force: :cascade do |t|
    t.string "email_domain"
    t.string "usertype"
    t.index ["email_domain", "usertype"], name: "index_allowlist_domains_on_email_domain_and_usertype", unique: true
  end

  create_table "allowlist_emails", force: :cascade do |t|
    t.string "email"
    t.string "usertype"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email", "usertype"], name: "index_allowlist_emails_on_email_and_usertype", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "email_confirmed", default: false
    t.string "confirm_token"
    t.string "usertype", default: "student"
    t.string "firstname"
    t.string "lastname"
  end

end
