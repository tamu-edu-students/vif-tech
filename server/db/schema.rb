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

ActiveRecord::Schema[7.0].define(version: 2022_10_21_071837) do
  create_table "allowlist_domains", force: :cascade do |t|
    t.string "email_domain"
    t.string "usertype"
    t.integer "company_id"
    t.index ["company_id"], name: "index_allowlist_domains_on_company_id"
    t.index ["email_domain", "usertype"], name: "index_allowlist_domains_on_email_domain_and_usertype", unique: true
  end

  create_table "allowlist_emails", force: :cascade do |t|
    t.string "email"
    t.string "usertype"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "company_id"
    t.index ["company_id"], name: "index_allowlist_emails_on_company_id"
    t.index ["email", "usertype"], name: "index_allowlist_emails_on_email_and_usertype", unique: true
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "meetings", force: :cascade do |t|
    t.datetime "start_time", precision: nil, null: false
    t.datetime "end_time", precision: nil, null: false
    t.string "title"
    t.integer "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_meetings_on_owner_id"
  end

  create_table "user_meetings", force: :cascade do |t|
    t.integer "meeting_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "accepted", default: false
    t.index ["meeting_id"], name: "index_user_meetings_on_meeting_id"
    t.index ["user_id"], name: "index_user_meetings_on_user_id"
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
    t.integer "company_id"
    t.index ["company_id"], name: "index_users_on_company_id"
  end

  add_foreign_key "allowlist_domains", "companies"
  add_foreign_key "allowlist_emails", "companies"
  add_foreign_key "meetings", "users", column: "owner_id"
  add_foreign_key "user_meetings", "meetings"
  add_foreign_key "user_meetings", "users"
  add_foreign_key "users", "companies"
end
