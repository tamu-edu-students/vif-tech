FactoryBot.define do
  factory :user do
    firstname { Faker::Name.first_name }
    lastname { Faker::Name.last_name }
    password { Faker::Alphanumeric.alpha(number: 10) }
    email { Faker::Internet.email }
  end
end
