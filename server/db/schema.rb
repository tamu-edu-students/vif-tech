create_table "users", force: :cascade do |t|
  t.string "password_digest"
  t.string "username"
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false  
end