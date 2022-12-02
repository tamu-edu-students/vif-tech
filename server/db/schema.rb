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

ActiveRecord::Schema[7.0].define(version: 2022_11_17_153134) do
  create_table "abouts", force: :cascade do |t|
    t.string "firstname"
    t.string "lastname"
    t.text "imgSrc"
    t.string "role"
    t.text "description"
    t.string "rank", default: "normal"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "allowlist_domains", force: :cascade do |t|
    t.string "domain"
    t.string "usertype"
    t.integer "company_id"
    t.index ["company_id"], name: "index_allowlist_domains_on_company_id"
    t.index ["domain", "usertype", "company_id"], name: "domain_usertype_company", unique: true
  end

  create_table "allowlist_emails", force: :cascade do |t|
    t.string "email"
    t.string "usertype"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "company_id"
    t.boolean "is_primary_contact", default: false
    t.index ["company_id"], name: "index_allowlist_emails_on_company_id"
    t.index ["email", "usertype", "company_id"], name: "email_usertype_company", unique: true
  end

  create_table "availabilities", force: :cascade do |t|
    t.integer "user_id", null: false
    t.datetime "start_time", precision: nil
    t.datetime "end_time", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "event_id"
    t.index ["event_id"], name: "index_availabilities_on_event_id"
    t.index ["user_id"], name: "index_availabilities_on_user_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_signups", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_signups_on_event_id"
    t.index ["user_id"], name: "index_event_signups_on_user_id"
  end

  create_table "events", force: :cascade do |t|
    t.datetime "start_time", precision: nil
    t.datetime "end_time", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.text "description"
  end

  create_table "faqs", force: :cascade do |t|
    t.string "question", null: false
    t.text "answer", null: false
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
    t.integer "event_id"
    t.index ["event_id"], name: "index_meetings_on_event_id"
    t.index ["owner_id"], name: "index_meetings_on_owner_id"
  end

  create_table "social_links", force: :cascade do |t|
    t.string "facebook"
    t.string "youtube"
    t.string "portfolio"
    t.string "twitter"
    t.string "linkedin"
    t.string "github"
    t.integer "about_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["about_id"], name: "index_social_links_on_about_id"
  end

  create_table "user_meetings", force: :cascade do |t|
    t.integer "meeting_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "pending"
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
    t.integer "allowlist_email_id"
    t.integer "allowlist_domain_id"
    t.integer "availabilities_id"
    t.index ["allowlist_domain_id"], name: "index_users_on_allowlist_domain_id"
    t.index ["allowlist_email_id"], name: "index_users_on_allowlist_email_id"
    t.index ["availabilities_id"], name: "index_users_on_availabilities_id"
    t.index ["company_id"], name: "index_users_on_company_id"
  end

  add_foreign_key "allowlist_domains", "companies"
  add_foreign_key "allowlist_emails", "companies"
  add_foreign_key "availabilities", "events"
  add_foreign_key "availabilities", "users"
  add_foreign_key "event_signups", "events"
  add_foreign_key "event_signups", "users"
  add_foreign_key "meetings", "events"
  add_foreign_key "meetings", "users", column: "owner_id"
  add_foreign_key "social_links", "abouts"
  add_foreign_key "user_meetings", "meetings"
  add_foreign_key "user_meetings", "users"
  add_foreign_key "users", "allowlist_domains"
  add_foreign_key "users", "allowlist_emails"
  add_foreign_key "users", "availabilities", column: "availabilities_id"
  add_foreign_key "users", "companies"
end
