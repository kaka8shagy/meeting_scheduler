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

ActiveRecord::Schema[8.0].define(version: 2025_06_19_045918) do
  create_table "attendees", force: :cascade do |t|
    t.integer "booking_id", null: false
    t.integer "user_id", null: false
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id", "user_id"], name: "index_attendees_on_booking_id_and_user_id", unique: true
    t.index ["booking_id"], name: "index_attendees_on_booking_id"
    t.index ["user_id"], name: "index_attendees_on_user_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.integer "room_id", null: false
    t.integer "user_id", null: false
    t.string "title", null: false
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.text "description"
    t.string "status", default: "confirmed", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["end_time"], name: "index_bookings_on_end_time"
    t.index ["room_id"], name: "index_bookings_on_room_id"
    t.index ["start_time"], name: "index_bookings_on_start_time"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "meeting_rooms", force: :cascade do |t|
    t.string "name", null: false
    t.string "location", null: false
    t.integer "capacity", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_meeting_rooms_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "attendees", "bookings"
  add_foreign_key "attendees", "users"
  add_foreign_key "bookings", "meeting_rooms", column: "room_id"
  add_foreign_key "bookings", "users"
end
